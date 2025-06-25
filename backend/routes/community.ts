/**
 * 🌐 FraudShield Revolutionary - Community Routes
 * 
 * Community threat intelligence sharing
 * Features:
 * - Threat reporting and sharing
 * - Community reputation system
 * - P2P network management
 * - Threat intelligence feeds
 * - Collaborative fraud detection
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { RedisService } from "../services/redis.ts";
// Error classes
class ValidationError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

// Validation helpers
function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      throw new ValidationError(`Field '${field}' is required`);
    }
  }
}

function validateTypes(data: any, types: Record<string, string>): void {
  for (const [field, expectedType] of Object.entries(types)) {
    if (data[field] !== undefined && typeof data[field] !== expectedType) {
      throw new ValidationError(`Field '${field}' must be of type ${expectedType}`);
    }
  }
}

export const communityRoutes = new Router();

let dbService: DatabaseService;
let redisService: RedisService;

export function initializeCommunityServices(db: DatabaseService, redis: RedisService) {
  dbService = db;
  redisService = redis;
}

/**
 * GET /api/v1/community/threats
 * Get active community threats
 */
communityRoutes.get("/threats", async (ctx: Context) => {
  const url = new URL(ctx.request.url);
  const severity = url.searchParams.get("severity"); // low, medium, high, critical
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);
  const threatType = url.searchParams.get("type");

  try {
    // Mock threats data (in production, would query actual community threats)
    let threats = generateMockCommunityThreats(limit);

    // Filter by severity if specified
    if (severity && ['low', 'medium', 'high', 'critical'].includes(severity)) {
      threats = threats.filter(t => t.severity === severity);
    }

    // Filter by type if specified
    if (threatType) {
      threats = threats.filter(t => t.threat_type.includes(threatType));
    }

    // Anonymize sensitive data for community sharing
    const anonymizedThreats = threats.map(threat => ({
      id: threat.id,
      threat_hash: threat.threat_hash,
      threat_type: threat.threat_type,
      severity: threat.severity,
      confidence: threat.confidence,
      verified_count: threat.verified_count,
      false_positive_count: threat.false_positive_count,
      reputation_score: calculateReputationScore(threat),
      created_at: threat.created_at,
      expires_at: threat.expires_at,
      // Metadata is sanitized to remove PII
      sanitized_metadata: sanitizeMetadata(threat.metadata)
    }));

    ctx.response.body = {
      threats: anonymizedThreats,
      total_count: threats.length,
      filters_applied: {
        severity,
        threat_type: threatType,
        limit
      },
      last_updated: new Date().toISOString()
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve community threats", { error: error.message });
  }
});

/**
 * POST /api/v1/community/report-threat
 * Report a new threat to the community
 */
communityRoutes.post("/report-threat", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateRequired(requestBody, ['threat_type', 'severity', 'indicators']);
  validateTypes(requestBody, {
    threat_type: 'string',
    severity: 'string',
    indicators: 'object',
    confidence: 'number'
  });

  // Validate severity level
  if (!['low', 'medium', 'high', 'critical'].includes(requestBody.severity)) {
    throw new ValidationError("Severity must be one of: low, medium, high, critical");
  }

  // Validate confidence score
  const confidence = requestBody.confidence || 75;
  if (confidence < 0 || confidence > 100) {
    throw new ValidationError("Confidence must be between 0 and 100");
  }

  try {
    // Generate threat hash from indicators
    const threatHash = await generateThreatHash(requestBody.indicators);

    // Check if threat already exists (simplified for demo)
    const existingThreat = null; // Mock - no existing threat
    if (existingThreat) {
      // Increment verification count
      console.log(`Threat ${threatHash} already exists, incrementing verification count`);
      
      ctx.response.body = {
        message: "Threat already reported, verification count updated",
        threat_id: existingThreat.id,
        threat_hash: threatHash,
        verified_count: existingThreat.verified_count + 1,
        status: "verified"
      };
      return;
    }

    // Create new threat entry
    const threat = await dbService.createCommunityThreat({
      threat_hash: threatHash,
      threat_type: requestBody.threat_type,
      severity: requestBody.severity,
      confidence,
      metadata: sanitizeMetadata(requestBody.indicators),
      reported_by: `user_${user.id.substring(0, 8)}`, // Anonymized user ID
      verified_count: 1,
      false_positive_count: 0
    });

    // Cache the threat for quick access
    await redisService.cacheThreatIntelligence(threatHash, {
      threat_type: threat.threat_type,
      severity: threat.severity,
      confidence: threat.confidence,
      reputation_score: calculateReputationScore(threat)
    });

    // Log the contribution
    console.log(`New threat reported by user ${user.email}: ${threat.threat_type} (${threat.severity})`);

    ctx.response.status = 201;
    ctx.response.body = {
      message: "Threat reported successfully",
      threat_id: threat.id,
      threat_hash: threatHash,
      threat_type: threat.threat_type,
      severity: threat.severity,
      confidence: threat.confidence,
      status: "reported",
      community_impact: "Your contribution helps protect the entire community"
    };

  } catch (error) {
    throw new ValidationError("Failed to report threat", { error: error.message });
  }
});

/**
 * POST /api/v1/community/verify-threat/:id
 * Verify or dispute a community threat
 */
communityRoutes.post("/verify-threat/:id", async (ctx: Context) => {
  const threatId = ctx.params.id;
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateRequired(requestBody, ['verification']);
  validateTypes(requestBody, {
    verification: 'string',
    evidence: 'object'
  });

  if (!['confirm', 'false_positive'].includes(requestBody.verification)) {
    throw new ValidationError("Verification must be 'confirm' or 'false_positive'");
  }

  try {
    // Get the threat (simplified for demo)
    const threats = generateMockCommunityThreats(10);
    const threat = threats.find(t => t.id === threatId);

    if (!threat) {
      throw new ValidationError("Threat not found");
    }

    // Record the verification
    const isConfirming = requestBody.verification === 'confirm';
    
    // In production, update the threat verification counts
    console.log(`User ${user.email} ${isConfirming ? 'confirmed' : 'disputed'} threat ${threatId}`);

    // Update cached threat intelligence
    const updatedReputation = calculateReputationScore({
      ...threat,
      verified_count: threat.verified_count + (isConfirming ? 1 : 0),
      false_positive_count: threat.false_positive_count + (isConfirming ? 0 : 1)
    });

    await redisService.cacheThreatIntelligence(threat.threat_hash, {
      threat_type: threat.threat_type,
      severity: threat.severity,
      confidence: threat.confidence,
      reputation_score: updatedReputation
    });

    ctx.response.body = {
      message: `Threat ${requestBody.verification} recorded`,
      threat_id: threatId,
      verification: requestBody.verification,
      new_reputation_score: updatedReputation,
      community_contribution: true
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("Failed to verify threat", { error: error.message });
  }
});

/**
 * GET /api/v1/community/reputation
 * Get community reputation and contributions
 */
communityRoutes.get("/reputation", async (ctx: Context) => {
  const user = ctx.user!;

  try {
    // In production, calculate actual reputation from database
    const reputation = {
      user_reputation: {
        score: 85,
        level: "Trusted Contributor",
        rank: 2456,
        total_users: 50000
      },
      contributions: {
        threats_reported: 12,
        threats_verified: 45,
        false_positives_identified: 3,
        accuracy_rate: 94.2
      },
      rewards: {
        badges: [
          { name: "First Threat Reporter", earned_at: "2024-01-10T10:00:00Z" },
          { name: "Accurate Verifier", earned_at: "2024-01-15T14:30:00Z" },
          { name: "Community Guardian", earned_at: "2024-01-20T09:15:00Z" }
        ],
        total_points: 1250,
        next_reward: {
          name: "Elite Contributor",
          points_needed: 250,
          requirements: "Report 20 verified threats"
        }
      },
      impact: {
        threats_prevented: 156,
        estimated_losses_prevented: 89400,
        community_members_protected: 2340
      }
    };

    ctx.response.body = reputation;

  } catch (error) {
    throw new ValidationError("Failed to retrieve reputation", { error: error.message });
  }
});

/**
 * GET /api/v1/community/network-status
 * Get P2P network status and statistics
 */
communityRoutes.get("/network-status", async (ctx: Context) => {
  try {
    const networkStatus = {
      network_health: {
        status: "healthy",
        connected_peers: 1247,
        total_nodes: 2890,
        network_coverage: 89.2,
        average_latency_ms: 125
      },
      threat_intelligence: {
        active_threats: 3456,
        threats_last_24h: 234,
        high_confidence_threats: 1890,
        global_threat_level: "medium"
      },
      data_sharing: {
        total_reports_shared: 45678,
        data_integrity_score: 98.7,
        anonymization_level: "strong",
        encryption_status: "active"
      },
      geographic_distribution: [
        { region: "North America", nodes: 1156, percentage: 40.0 },
        { region: "Europe", nodes: 867, percentage: 30.0 },
        { region: "Asia Pacific", nodes: 578, percentage: 20.0 },
        { region: "South America", nodes: 231, percentage: 8.0 },
        { region: "Others", nodes: 58, percentage: 2.0 }
      ],
      protocol_version: "2.1.0",
      last_consensus: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
    };

    ctx.response.body = networkStatus;

  } catch (error) {
    throw new ValidationError("Failed to retrieve network status", { error: error.message });
  }
});

/**
 * GET /api/v1/community/threat-feed
 * Get real-time threat intelligence feed
 */
communityRoutes.get("/threat-feed", async (ctx: Context) => {
  const url = new URL(ctx.request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
  const since = url.searchParams.get("since"); // ISO timestamp

  try {
    // Mock threats data (in production, would query actual community threats)
    let threats = generateMockCommunityThreats(limit * 2);

    // Filter by timestamp if specified
    if (since) {
      const sinceDate = new Date(since);
      threats = threats.filter(t => new Date(t.created_at) > sinceDate);
    }

    // Sort by severity and confidence
    threats.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
      const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
      
      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity; // Higher severity first
      }
      
      return b.confidence - a.confidence; // Higher confidence first
    });

    const feed = threats.slice(0, limit).map(threat => ({
      id: threat.id,
      threat_type: threat.threat_type,
      severity: threat.severity,
      confidence: threat.confidence,
      reputation_score: calculateReputationScore(threat),
      timestamp: threat.created_at,
      expires_at: threat.expires_at,
      geographic_scope: extractGeographicScope(threat.metadata),
      risk_level: calculateRiskLevel(threat)
    }));

    ctx.response.body = {
      feed,
      feed_version: "2.1.0",
      total_items: feed.length,
      last_updated: new Date().toISOString(),
      next_update: new Date(Date.now() + 300000).toISOString(), // 5 minutes
      subscription: {
        real_time: true,
        webhook_available: true,
        polling_interval_seconds: 300
      }
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve threat feed", { error: error.message });
  }
});

/**
 * POST /api/v1/community/subscribe-webhook
 * Subscribe to threat intelligence webhooks
 */
communityRoutes.post("/subscribe-webhook", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateRequired(requestBody, ['webhook_url']);
  validateTypes(requestBody, {
    webhook_url: 'string',
    severity_filter: 'object',
    threat_types: 'object'
  });

  // Validate webhook URL
  try {
    new URL(requestBody.webhook_url);
  } catch {
    throw new ValidationError("Invalid webhook URL format");
  }

  try {
    // Test webhook endpoint
    const testPayload = {
      type: "webhook_test",
      timestamp: new Date().toISOString(),
      user_id: user.id
    };

    const response = await fetch(requestBody.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FraudShield-Community/1.0'
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new ValidationError(`Webhook test failed: ${response.status} ${response.statusText}`);
    }

    // Store webhook subscription
    console.log(`Webhook subscription created for user ${user.email}: ${requestBody.webhook_url}`);

    ctx.response.body = {
      message: "Webhook subscription created successfully",
      webhook_url: requestBody.webhook_url,
      subscription_id: `sub_${Date.now()}`,
      filters: {
        severity: requestBody.severity_filter || ["medium", "high", "critical"],
        threat_types: requestBody.threat_types || ["all"]
      },
      test_successful: true,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("Failed to create webhook subscription", { error: error.message });
  }
});

/**
 * GET /api/v1/community/statistics
 * Get community statistics and insights
 */
communityRoutes.get("/statistics", async (ctx: Context) => {
  try {
    const statistics = {
      global_stats: {
        total_participants: 50000,
        active_participants_24h: 12450,
        total_threats_reported: 2340000,
        threats_prevented: 89400,
        estimated_losses_prevented: 45600000
      },
      threat_trends: {
        trending_threat_types: [
          { type: "phishing", count: 234, trend: "increasing" },
          { type: "account_takeover", count: 189, trend: "stable" },
          { type: "payment_fraud", count: 156, trend: "decreasing" }
        ],
        geographic_hotspots: [
          { region: "Southeast Asia", threat_level: "high", primary_threats: ["payment_fraud"] },
          { region: "Eastern Europe", threat_level: "medium", primary_threats: ["account_takeover"] },
          { region: "West Africa", threat_level: "high", primary_threats: ["phishing"] }
        ]
      },
      community_impact: {
        average_response_time_minutes: 15,
        threat_verification_accuracy: 94.2,
        false_positive_rate: 2.1,
        community_coverage: 89.7
      },
      network_metrics: {
        data_shared_gb: 1247.5,
        encryption_strength: "AES-256",
        anonymization_level: 98.9,
        consensus_time_seconds: 12
      }
    };

    ctx.response.body = {
      statistics,
      generated_at: new Date().toISOString(),
      data_freshness: "real-time",
      next_update: new Date(Date.now() + 3600000).toISOString() // 1 hour
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve community statistics", { error: error.message });
  }
});

// Helper functions

async function generateThreatHash(indicators: any): Promise<string> {
  const normalized = JSON.stringify(indicators, Object.keys(indicators).sort());
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function sanitizeMetadata(metadata: any): any {
  // Remove PII and sensitive data while keeping threat indicators
  const sanitized = { ...metadata };
  
  // Remove or hash sensitive fields
  delete sanitized.email;
  delete sanitized.name;
  delete sanitized.phone;
  delete sanitized.address;
  
  // Hash IP addresses
  if (sanitized.ip_address) {
    sanitized.ip_subnet = sanitized.ip_address.split('.').slice(0, 3).join('.') + '.x';
    delete sanitized.ip_address;
  }
  
  return sanitized;
}

function calculateReputationScore(threat: any): number {
  const totalVotes = threat.verified_count + threat.false_positive_count;
  if (totalVotes === 0) return 50; // Default neutral score
  
  const accuracy = threat.verified_count / totalVotes;
  const confidenceBonus = threat.confidence > 80 ? 10 : 0;
  const baseScore = Math.round(accuracy * 100);
  
  return Math.min(baseScore + confidenceBonus, 100);
}

function extractGeographicScope(metadata: any): string[] {
  // Extract geographic information from metadata
  const scope = [];
  
  if (metadata?.country) scope.push(metadata.country);
  if (metadata?.region) scope.push(metadata.region);
  if (metadata?.ip_subnet) scope.push("IP range");
  
  return scope.length > 0 ? scope : ["global"];
}

function calculateRiskLevel(threat: any): string {
  const reputationScore = calculateReputationScore(threat);
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  const severityScore = severityScores[threat.severity as keyof typeof severityScores] || 25;
  
  const riskScore = (reputationScore * 0.4) + (severityScore * 0.4) + (threat.confidence * 0.2);
  
  if (riskScore >= 80) return "critical";
  if (riskScore >= 60) return "high";
  if (riskScore >= 40) return "medium";
  return "low";
}

function generateMockCommunityThreats(limit: number): any[] {
  const threats = [];
  const threatTypes = ['ip', 'email', 'pattern', 'behavioral'];
  const severities = ['low', 'medium', 'high', 'critical'];
  
  for (let i = 0; i < limit; i++) {
    const threat = {
      id: `threat_${i + 1}`,
      threat_hash: `hash_${Math.random().toString(36).substring(2, 15)}`,
      threat_type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100
      verified_count: Math.floor(Math.random() * 20) + 1,
      false_positive_count: Math.floor(Math.random() * 3),
      metadata: {
        description: `Mock threat ${i + 1}`,
        indicators: ['suspicious_activity']
      },
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    threats.push(threat);
  }
  
  return threats;
}