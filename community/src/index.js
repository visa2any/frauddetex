/**
 * FraudShield Community Intelligence Network
 * Distributed P2P network for collaborative threat intelligence sharing
 */

import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { websockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { mplex } from '@libp2p/mplex';
import { bootstrap } from '@libp2p/bootstrap';
import { kadDHT } from '@libp2p/kad-dht';
import { gossipsub } from '@libp2p/gossipsub';
import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import Joi from 'joi';
import pino from 'pino';
import { Level } from 'level';
import { fromString as uint8ArrayFromString, toString as uint8ArrayToString } from 'uint8arrays';

// Logger setup
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Configuration
const config = {
  p2p: {
    port: process.env.P2P_PORT || 9000,
    bootstrapPeers: (process.env.BOOTSTRAP_PEERS || '').split(',').filter(Boolean),
    enableDHT: true,
    enablePubSub: true
  },
  api: {
    port: process.env.API_PORT || 9001,
    host: process.env.API_HOST || '0.0.0.0'
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
  },
  reputation: {
    initialScore: 50,
    maxScore: 100,
    minScore: 0,
    decayRate: 0.1
  },
  storage: {
    path: process.env.STORAGE_PATH || './data'
  }
};

// Data validation schemas
const schemas = {
  threatIntelligence: Joi.object({
    type: Joi.string().valid('ip', 'email_pattern', 'device_fingerprint', 'behavioral_pattern').required(),
    pattern: Joi.string().required(),
    riskLevel: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
    confidence: Joi.number().min(0).max(1).required(),
    source: Joi.string().required(),
    timestamp: Joi.date().required(),
    metadata: Joi.object().optional(),
    ttl: Joi.number().min(3600).max(86400 * 30).default(86400 * 7) // 1 week default
  }),

  threatQuery: Joi.object({
    type: Joi.string().valid('ip', 'email_pattern', 'device_fingerprint', 'behavioral_pattern').required(),
    pattern: Joi.string().required(),
    timeRange: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required()
    }).optional()
  }),

  feedback: Joi.object({
    threatId: Joi.string().required(),
    feedback: Joi.string().valid('accurate', 'false_positive', 'outdated').required(),
    confidence: Joi.number().min(0).max(1).required()
  })
};

class CommunityIntelligenceNode {
  constructor() {
    this.libp2p = null;
    this.api = null;
    this.db = null;
    this.reputation = new Map();
    this.threatCache = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('🚀 Initializing Community Intelligence Node...');

    try {
      await this.initializeStorage();
      await this.initializeP2P();
      await this.initializeAPI();
      await this.loadReputation();
      this.startBackgroundTasks();

      this.isInitialized = true;
      logger.info('✅ Community Intelligence Node initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize node:', error);
      throw error;
    }
  }

  async initializeStorage() {
    this.db = new Level(config.storage.path, { valueEncoding: 'json' });
    logger.info('💾 Storage initialized');
  }

  async initializeP2P() {
    this.libp2p = await createLibp2p({
      addresses: {
        listen: [
          `/ip4/0.0.0.0/tcp/${config.p2p.port}`,
          `/ip4/0.0.0.0/tcp/${config.p2p.port + 1}/ws`
        ]
      },
      transports: [tcp(), websockets()],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      peerDiscovery: config.p2p.bootstrapPeers.length > 0 ? [
        bootstrap({
          list: config.p2p.bootstrapPeers
        })
      ] : [],
      dht: config.p2p.enableDHT ? kadDHT() : undefined,
      pubsub: config.p2p.enablePubSub ? gossipsub() : undefined
    });

    // Event listeners
    this.libp2p.addEventListener('peer:connect', (event) => {
      logger.info(`🤝 Connected to peer: ${event.detail.toString()}`);
    });

    this.libp2p.addEventListener('peer:disconnect', (event) => {
      logger.info(`👋 Disconnected from peer: ${event.detail.toString()}`);
    });

    // Subscribe to threat intelligence topics
    if (this.libp2p.pubsub) {
      await this.libp2p.pubsub.subscribe('fraudshield:threats');
      await this.libp2p.pubsub.subscribe('fraudshield:feedback');
      await this.libp2p.pubsub.subscribe('fraudshield:reputation');

      this.libp2p.pubsub.addEventListener('message', (event) => {
        this.handlePubSubMessage(event.detail);
      });
    }

    await this.libp2p.start();
    logger.info(`🌐 P2P node started on port ${config.p2p.port}`);
    logger.info(`📍 Peer ID: ${this.libp2p.peerId.toString()}`);
  }

  async initializeAPI() {
    this.api = fastify({ logger });

    await this.api.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    });

    await this.api.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    });

    this.registerAPIRoutes();

    await this.api.listen({
      port: config.api.port,
      host: config.api.host
    });

    logger.info(`🚀 API server started on http://${config.api.host}:${config.api.port}`);
  }

  registerAPIRoutes() {
    // Health check
    this.api.get('/health', async (request, reply) => {
      return {
        status: 'healthy',
        peerId: this.libp2p.peerId.toString(),
        connections: this.libp2p.getConnections().length,
        uptime: process.uptime()
      };
    });

    // Share threat intelligence
    this.api.post('/threat/share', async (request, reply) => {
      try {
        const { error, value } = schemas.threatIntelligence.validate(request.body);
        if (error) {
          return reply.code(400).send({ error: error.details[0].message });
        }

        const threat = await this.shareThreatIntelligence(value);
        return { success: true, threatId: threat.id };
      } catch (error) {
        logger.error('Failed to share threat:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });

    // Query threat intelligence
    this.api.post('/threat/query', async (request, reply) => {
      try {
        const { error, value } = schemas.threatQuery.validate(request.body);
        if (error) {
          return reply.code(400).send({ error: error.details[0].message });
        }

        const results = await this.queryThreatIntelligence(value);
        return { success: true, results };
      } catch (error) {
        logger.error('Failed to query threats:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });

    // Submit feedback
    this.api.post('/feedback', async (request, reply) => {
      try {
        const { error, value } = schemas.feedback.validate(request.body);
        if (error) {
          return reply.code(400).send({ error: error.details[0].message });
        }

        await this.submitFeedback(value);
        return { success: true };
      } catch (error) {
        logger.error('Failed to submit feedback:', error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    });

    // Get network statistics
    this.api.get('/stats', async (request, reply) => {
      return {
        network: {
          peerId: this.libp2p.peerId.toString(),
          connections: this.libp2p.getConnections().length,
          peers: this.libp2p.getPeers().length
        },
        threats: {
          cached: this.threatCache.size,
          stored: await this.getThreatCount()
        },
        reputation: {
          nodes: this.reputation.size,
          averageScore: this.getAverageReputationScore()
        }
      };
    });
  }

  async shareThreatIntelligence(threat) {
    const threatId = crypto.randomUUID();
    const timestamp = new Date();

    const anonymizedThreat = await this.anonymizeThreat({
      ...threat,
      id: threatId,
      timestamp,
      source: this.libp2p.peerId.toString()
    });

    await this.storeThreat(anonymizedThreat);

    if (this.libp2p.pubsub) {
      const message = this.encryptMessage(anonymizedThreat);
      await this.libp2p.pubsub.publish('fraudshield:threats', uint8ArrayFromString(JSON.stringify(message)));
    }

    this.threatCache.set(threatId, anonymizedThreat);

    logger.info(`📤 Shared threat intelligence: ${threatId}`);
    return anonymizedThreat;
  }

  async queryThreatIntelligence(query) {
    const results = [];

    for (const [id, threat] of this.threatCache) {
      if (this.matchesThreatQuery(threat, query)) {
        results.push(this.sanitizeThreatForResponse(threat));
      }
    }

    const storedThreats = await this.searchStoredThreats(query);
    results.push(...storedThreats);

    return results
      .sort((a, b) => {
        const scoreA = (a.confidence * 0.7) + (this.calculateRecencyScore(a.timestamp) * 0.3);
        const scoreB = (b.confidence * 0.7) + (this.calculateRecencyScore(b.timestamp) * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, 20);
  }

  async submitFeedback(feedback) {
    await this.db.put(`feedback:${feedback.threatId}:${Date.now()}`, feedback);

    const threat = await this.getThreatById(feedback.threatId);
    if (threat && threat.source) {
      await this.updateReputation(threat.source, feedback);
    }

    if (this.libp2p.pubsub) {
      const message = this.encryptMessage({
        ...feedback,
        timestamp: new Date(),
        submitter: this.libp2p.peerId.toString()
      });
      await this.libp2p.pubsub.publish('fraudshield:feedback', uint8ArrayFromString(JSON.stringify(message)));
    }

    logger.info(`📝 Submitted feedback for threat: ${feedback.threatId}`);
  }

  async handlePubSubMessage(message) {
    try {
      const data = JSON.parse(uint8ArrayToString(message.data));
      const decryptedData = this.decryptMessage(data);

      switch (message.topic) {
        case 'fraudshield:threats':
          await this.handleThreatMessage(decryptedData, message.from);
          break;
        case 'fraudshield:feedback':
          await this.handleFeedbackMessage(decryptedData, message.from);
          break;
        case 'fraudshield:reputation':
          await this.handleReputationMessage(decryptedData, message.from);
          break;
      }
    } catch (error) {
      logger.warn('Failed to process pubsub message:', error);
    }
  }

  async handleThreatMessage(threat, fromPeer) {
    if (this.threatCache.has(threat.id)) {
      return;
    }

    const { error } = schemas.threatIntelligence.validate(threat);
    if (error) {
      logger.warn('Invalid threat received:', error.details[0].message);
      return;
    }

    const senderReputation = this.reputation.get(fromPeer.toString()) || { score: config.reputation.initialScore };
    if (senderReputation.score < 30) {
      logger.warn(`Ignoring threat from low reputation peer: ${fromPeer.toString()}`);
      return;
    }

    await this.storeThreat(threat);
    this.threatCache.set(threat.id, threat);

    logger.info(`📥 Received threat intelligence: ${threat.id} from ${fromPeer.toString()}`);
  }

  async anonymizeThreat(threat) {
    const anonymized = { ...threat };

    if (threat.type === 'ip' || threat.type === 'email_pattern') {
      anonymized.pattern = this.hashWithSalt(threat.pattern);
    }

    if (anonymized.metadata) {
      anonymized.metadata = this.sanitizeMetadata(anonymized.metadata);
    }

    return anonymized;
  }

  encryptMessage(data) {
    const message = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(message, config.encryption.key).toString();
    return {
      encrypted,
      timestamp: Date.now(),
      version: '1.0'
    };
  }

  decryptMessage(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, config.encryption.key);
      const message = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(message);
    } catch (error) {
      throw new Error('Failed to decrypt message');
    }
  }

  hashWithSalt(data) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, salt, 10000, 32, 'sha256').toString('hex');
    return `${salt}:${hash}`;
  }

  sanitizeMetadata(metadata) {
    const sanitized = { ...metadata };
    
    if (sanitized.timestamp) {
      const date = new Date(sanitized.timestamp);
      sanitized.timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
    }

    if (sanitized.location) {
      delete sanitized.location.exact;
      delete sanitized.location.coordinates;
    }

    return sanitized;
  }

  async storeThreat(threat) {
    const key = `threat:${threat.id}`;
    await this.db.put(key, threat);

    const typeKey = `index:type:${threat.type}:${threat.id}`;
    const timeKey = `index:time:${new Date(threat.timestamp).toISOString().slice(0, 10)}:${threat.id}`;
    
    await this.db.put(typeKey, threat.id);
    await this.db.put(timeKey, threat.id);
  }

  async getThreatById(threatId) {
    try {
      return await this.db.get(`threat:${threatId}`);
    } catch (error) {
      return null;
    }
  }

  async searchStoredThreats(query) {
    const results = [];
    const typePrefix = `index:type:${query.type}:`;
    
    try {
      for await (const [key, threatId] of this.db.iterator({ gte: typePrefix, lt: typePrefix + '\xFF' })) {
        const threat = await this.getThreatById(threatId);
        if (threat && this.matchesThreatQuery(threat, query)) {
          results.push(this.sanitizeThreatForResponse(threat));
        }
      }
    } catch (error) {
      logger.warn('Error searching stored threats:', error);
    }

    return results;
  }

  matchesThreatQuery(threat, query) {
    if (threat.type !== query.type) {
      return false;
    }

    if (query.pattern && threat.pattern.includes(query.pattern)) {
      return true;
    }

    if (query.timeRange) {
      const threatTime = new Date(threat.timestamp);
      if (threatTime < query.timeRange.start || threatTime > query.timeRange.end) {
        return false;
      }
    }

    return true;
  }

  sanitizeThreatForResponse(threat) {
    const sanitized = { ...threat };
    delete sanitized.source;
    
    if (sanitized.timestamp) {
      const date = new Date(sanitized.timestamp);
      sanitized.timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    }

    return sanitized;
  }

  async updateReputation(peerId, feedback) {
    const current = this.reputation.get(peerId) || {
      score: config.reputation.initialScore,
      lastUpdated: new Date(0)
    };

    let scoreChange = 0;
    switch (feedback.feedback) {
      case 'accurate':
        scoreChange = +5 * feedback.confidence;
        break;
      case 'false_positive':
        scoreChange = -10 * feedback.confidence;
        break;
      case 'outdated':
        scoreChange = -2 * feedback.confidence;
        break;
    }

    const newScore = Math.max(
      config.reputation.minScore,
      Math.min(config.reputation.maxScore, current.score + scoreChange)
    );

    this.reputation.set(peerId, {
      score: newScore,
      lastUpdated: new Date()
    });

    await this.db.put(`reputation:${peerId}`, this.reputation.get(peerId));

    logger.info(`📊 Updated reputation for ${peerId}: ${current.score} -> ${newScore}`);
  }

  async loadReputation() {
    const prefix = 'reputation:';
    try {
      for await (const [key, value] of this.db.iterator({ gte: prefix, lt: prefix + '\xFF' })) {
        const peerId = key.slice(prefix.length);
        this.reputation.set(peerId, value);
      }
      logger.info(`📊 Loaded reputation data for ${this.reputation.size} peers`);
    } catch (error) {
      logger.warn('Failed to load reputation data:', error);
    }
  }

  async getThreatCount() {
    let count = 0;
    const prefix = 'threat:';
    try {
      for await (const [key] of this.db.iterator({ gte: prefix, lt: prefix + '\xFF' })) {
        count++;
      }
    } catch (error) {
      logger.warn('Error counting threats:', error);
    }
    return count;
  }

  getAverageReputationScore() {
    if (this.reputation.size === 0) return 0;
    
    const total = Array.from(this.reputation.values())
      .reduce((sum, rep) => sum + rep.score, 0);
    
    return total / this.reputation.size;
  }

  calculateRecencyScore(timestamp) {
    const now = Date.now();
    const age = now - new Date(timestamp).getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    return Math.max(0, 1 - (age / maxAge));
  }

  startBackgroundTasks() {
    setInterval(() => {
      this.decayReputation();
    }, 60 * 60 * 1000); // Every hour

    setInterval(() => {
      this.cleanupCache();
    }, 30 * 60 * 1000); // Every 30 minutes

    setInterval(() => {
      this.reportMetrics();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  decayReputation() {
    const now = Date.now();
    const decayThreshold = 24 * 60 * 60 * 1000; // 24 hours

    for (const [peerId, reputation] of this.reputation) {
      const age = now - reputation.lastUpdated.getTime();
      if (age > decayThreshold) {
        const decayAmount = config.reputation.decayRate * (age / decayThreshold);
        reputation.score = Math.max(
          config.reputation.minScore,
          reputation.score - decayAmount
        );
      }
    }
  }

  cleanupCache() {
    const maxCacheSize = 1000;
    const maxAge = 60 * 60 * 1000; // 1 hour
    const now = Date.now();

    for (const [id, threat] of this.threatCache) {
      const age = now - new Date(threat.timestamp).getTime();
      if (age > maxAge) {
        this.threatCache.delete(id);
      }
    }

    if (this.threatCache.size > maxCacheSize) {
      const entries = Array.from(this.threatCache.entries())
        .sort((a, b) => new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime());
      
      this.threatCache.clear();
      for (let i = 0; i < maxCacheSize; i++) {
        if (entries[i]) {
          this.threatCache.set(entries[i][0], entries[i][1]);
        }
      }
    }
  }

  reportMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      network: {
        connections: this.libp2p.getConnections().length,
        peers: this.libp2p.getPeers().length
      },
      storage: {
        threatsInCache: this.threatCache.size,
        reputationEntries: this.reputation.size
      },
      reputation: {
        averageScore: this.getAverageReputationScore()
      }
    };

    logger.info('📊 Node metrics:', metrics);
  }

  async shutdown() {
    logger.info('🛑 Shutting down Community Intelligence Node...');

    if (this.api) {
      await this.api.close();
    }

    if (this.libp2p) {
      await this.libp2p.stop();
    }

    if (this.db) {
      await this.db.close();
    }

    logger.info('✅ Node shutdown complete');
  }
}

// Initialize and start the node
async function main() {
  const node = new CommunityIntelligenceNode();

  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    await node.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    await node.shutdown();
    process.exit(0);
  });

  try {
    await node.initialize();
    logger.info('🎉 Community Intelligence Node is running!');
  } catch (error) {
    logger.error('💥 Failed to start node:', error);
    process.exit(1);
  }
}

main().catch(console.error);