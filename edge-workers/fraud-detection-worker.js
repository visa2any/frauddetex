/**
 * 🌐 FraudShield Revolutionary - Edge Computing Worker
 * 
 * Cloudflare Worker for ultra-fast fraud detection (<50ms)
 * Features:
 * - Edge-based ML inference
 * - Real-time decision making
 * - Global deployment
 * - WebAssembly model execution
 * - IP reputation scoring
 * - Behavioral analysis
 */

// Import WebAssembly module (would be compiled from Rust/TensorFlow)
import wasmModule from './fraud-model.wasm';

class FraudDetectionWorker {
  constructor() {
    this.model = null;
    this.ipReputationCache = new Map();
    this.behavioralPatterns = new Map();
  }

  async initialize() {
    // Initialize WebAssembly module
    this.model = await WebAssembly.instantiate(wasmModule);
    console.log('Edge fraud detection model initialized');
  }

  async handleRequest(request) {
    const startTime = Date.now();

    try {
      // Parse request
      const { method, url } = request;
      const urlObj = new URL(url);

      // CORS handling
      if (method === 'OPTIONS') {
        return this.handleCORS();
      }

      // Route requests
      if (urlObj.pathname === '/edge/detect') {
        return await this.detectFraud(request);
      } else if (urlObj.pathname === '/edge/health') {
        return this.healthCheck();
      } else if (urlObj.pathname === '/edge/metrics') {
        return this.getMetrics();
      }

      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Edge worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: 'Edge processing failed',
        processing_time_ms: Date.now() - startTime
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async detectFraud(request) {
    const startTime = Date.now();

    try {
      // Validate method
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }

      // Parse request body
      const requestData = await request.json();
      
      // Validate required fields
      if (!requestData.amount || !requestData.user_id) {
        return new Response(JSON.stringify({
          error: 'Validation error',
          message: 'Missing required fields: amount, user_id'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Extract client information
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For') || 
                      'unknown';
      const userAgent = request.headers.get('User-Agent') || '';
      const country = request.cf?.country || 'unknown';
      const asn = request.cf?.asn || 0;

      // Build feature vector for edge processing
      const features = await this.extractEdgeFeatures({
        ...requestData,
        client_ip: clientIP,
        user_agent: userAgent,
        country,
        asn,
        timestamp: Date.now()
      });

      // Run edge ML inference
      const prediction = await this.runEdgeInference(features);

      // Apply edge-specific rules
      const edgeDecision = this.applyEdgeRules(prediction, features);

      // Cache behavioral patterns
      if (requestData.behavioral_data) {
        this.updateBehavioralCache(requestData.user_id, requestData.behavioral_data);
      }

      const processingTime = Date.now() - startTime;

      const response = {
        fraud_score: edgeDecision.fraud_score,
        decision: edgeDecision.decision,
        confidence: edgeDecision.confidence,
        processing_time_ms: processingTime,
        edge_location: request.cf?.colo || 'unknown',
        model_version: '1.0.0-edge',
        explanation: edgeDecision.explanation,
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          'X-Processing-Time': processingTime.toString(),
          'X-Edge-Location': request.cf?.colo || 'unknown',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Fraud detection error:', error);
      return new Response(JSON.stringify({
        error: 'Fraud detection failed',
        message: error.message,
        processing_time_ms: Date.now() - startTime
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async extractEdgeFeatures(data) {
    const features = {
      // Transaction features
      amount: Math.log(data.amount + 1), // Log transform
      hour: new Date().getHours(),
      day_of_week: new Date().getDay(),
      
      // IP features
      ip_reputation: await this.getIPReputation(data.client_ip),
      is_tor: this.isTorIP(data.client_ip),
      is_vpn: this.isVPNProvider(data.asn),
      
      // Geographic features
      country_risk: this.getCountryRisk(data.country),
      unusual_location: await this.isUnusualLocation(data.user_id, data.country),
      
      // Device features
      suspicious_user_agent: this.analyzeuserAgent(data.user_agent),
      
      // Behavioral features
      behavioral_anomaly: this.analyzeBehavioralData(data.user_id, data.behavioral_data),
      
      // Velocity features
      transaction_velocity: await this.calculateVelocity(data.user_id),
    };

    return features;
  }

  async runEdgeInference(features) {
    // Convert features to the format expected by WASM model
    const featureVector = this.featuresToVector(features);
    
    // Run inference using WebAssembly model
    // This is a simplified version - real implementation would use actual WASM
    let fraudScore = 0;
    let confidence = 0;

    // Simple rule-based scoring for demo (would be replaced by WASM model)
    fraudScore += features.amount > 8 ? 30 : 10; // Log(amount) > 8 ≈ $2980
    fraudScore += features.ip_reputation < 50 ? 40 : 0;
    fraudScore += features.is_tor || features.is_vpn ? 35 : 0;
    fraudScore += features.country_risk > 70 ? 25 : 0;
    fraudScore += features.unusual_location ? 30 : 0;
    fraudScore += features.suspicious_user_agent ? 20 : 0;
    fraudScore += features.behavioral_anomaly > 60 ? 25 : 0;
    fraudScore += features.transaction_velocity > 80 ? 30 : 0;

    // Normalize to 0-100
    fraudScore = Math.min(fraudScore, 100);
    confidence = Math.max(60, 100 - Math.abs(fraudScore - 50));

    return {
      fraud_score: fraudScore,
      confidence: confidence,
      feature_importance: this.calculateFeatureImportance(features, fraudScore)
    };
  }

  applyEdgeRules(prediction, features) {
    let decision = 'approve';
    
    // Edge-specific decision logic
    if (prediction.fraud_score >= 85) {
      decision = 'reject';
    } else if (prediction.fraud_score >= 60) {
      decision = 'review';
    }

    // Override rules for edge cases
    if (features.is_tor && prediction.fraud_score > 50) {
      decision = 'reject';
    }

    if (features.transaction_velocity > 90) {
      decision = 'reject';
    }

    const explanation = this.generateExplanation(prediction, features, decision);

    return {
      fraud_score: prediction.fraud_score,
      decision,
      confidence: prediction.confidence,
      explanation
    };
  }

  async getIPReputation(ip) {
    // Check cache first
    if (this.ipReputationCache.has(ip)) {
      return this.ipReputationCache.get(ip);
    }

    // Simple IP reputation scoring (in production, use threat intelligence APIs)
    let reputation = 100; // Default good reputation

    // Check for known bad patterns
    if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
      reputation = 50; // Private IPs
    }

    // Simulate threat intelligence lookup
    const ipHash = await this.hashIP(ip);
    if (ipHash % 100 < 5) { // 5% chance of bad IP
      reputation = Math.random() * 30; // 0-30 reputation
    }

    // Cache result
    this.ipReputationCache.set(ip, reputation);
    
    return reputation;
  }

  isTorIP(ip) {
    // In production, check against Tor exit node list
    const torPatterns = ['185.220.', '199.87.', '176.10.'];
    return torPatterns.some(pattern => ip.startsWith(pattern));
  }

  isVPNProvider(asn) {
    // Known VPN provider ASNs
    const vpnASNs = [60068, 396982, 63023, 46844, 53667];
    return vpnASNs.includes(asn);
  }

  getCountryRisk(country) {
    // Country risk scores (0-100, higher = more risky)
    const countryRisks = {
      'US': 10, 'CA': 15, 'GB': 12, 'DE': 8, 'FR': 10,
      'BR': 35, 'MX': 40, 'IN': 25, 'CN': 45, 'RU': 80,
      'NG': 70, 'PK': 65, 'BD': 60, 'UA': 55, 'VN': 30
    };

    return countryRisks[country] || 50; // Default medium risk
  }

  async isUnusualLocation(userId, country) {
    // Check if this country is unusual for this user
    // In production, this would check user's location history
    
    // Simple heuristic: hash user ID to simulate location patterns
    const userHash = await this.hashString(userId);
    const expectedCountries = ['US', 'BR', 'CA'][userHash % 3];
    
    return country !== expectedCountries;
  }

  analyzeuserAgent(userAgent) {
    // Check for suspicious user agent patterns
    const suspiciousPatterns = [
      /bot|crawler|spider/i,
      /curl|wget|python|java/i,
      /postman|insomnia/i,
      /^Mozilla\/4\.0 \(compatible; MSIE 6\.0/i // Very old IE
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  analyzeBehavioralData(userId, behavioralData) {
    if (!behavioralData) return 0;

    // Get cached behavioral pattern for this user
    const cachedPattern = this.behavioralPatterns.get(userId);
    if (!cachedPattern) return 20; // No baseline = slight anomaly

    // Calculate anomaly score based on deviations
    let anomalyScore = 0;

    // Mouse velocity anomaly
    if (behavioralData.mouse_velocity && cachedPattern.mouse_velocity) {
      const deviation = Math.abs(behavioralData.mouse_velocity - cachedPattern.mouse_velocity);
      anomalyScore += Math.min(deviation * 50, 40);
    }

    // Keystroke timing anomaly
    if (behavioralData.keystroke_dwell && cachedPattern.keystroke_dwell) {
      const deviation = Math.abs(behavioralData.keystroke_dwell - cachedPattern.keystroke_dwell);
      anomalyScore += Math.min(deviation * 30, 30);
    }

    return Math.min(anomalyScore, 100);
  }

  async calculateVelocity(userId) {
    // Simulate velocity calculation
    // In production, this would check recent transaction frequency
    const userHash = await this.hashString(userId + Date.now().toString().slice(0, -4));
    return (userHash % 100); // 0-99
  }

  updateBehavioralCache(userId, behavioralData) {
    // Update behavioral pattern cache
    const current = this.behavioralPatterns.get(userId) || {};
    
    // Simple exponential moving average
    const alpha = 0.3;
    const updated = {
      mouse_velocity: current.mouse_velocity 
        ? current.mouse_velocity * (1 - alpha) + (behavioralData.mouse_velocity || 0) * alpha
        : behavioralData.mouse_velocity || 0,
      keystroke_dwell: current.keystroke_dwell
        ? current.keystroke_dwell * (1 - alpha) + (behavioralData.keystroke_dwell || 0) * alpha
        : behavioralData.keystroke_dwell || 0
    };

    this.behavioralPatterns.set(userId, updated);
  }

  featuresToVector(features) {
    // Convert features object to array for WASM model
    return [
      features.amount,
      features.hour / 24,
      features.day_of_week / 7,
      features.ip_reputation / 100,
      features.is_tor ? 1 : 0,
      features.is_vpn ? 1 : 0,
      features.country_risk / 100,
      features.unusual_location ? 1 : 0,
      features.suspicious_user_agent ? 1 : 0,
      features.behavioral_anomaly / 100,
      features.transaction_velocity / 100
    ];
  }

  calculateFeatureImportance(features, fraudScore) {
    // Calculate which features contributed most to the score
    const importance = {};
    
    if (features.ip_reputation < 50) importance.ip_reputation = 0.3;
    if (features.is_tor || features.is_vpn) importance.network_anonymity = 0.25;
    if (features.amount > 8) importance.transaction_amount = 0.2;
    if (features.behavioral_anomaly > 60) importance.behavioral_patterns = 0.2;
    if (features.transaction_velocity > 80) importance.velocity = 0.15;
    if (features.country_risk > 70) importance.geographic_risk = 0.1;

    return importance;
  }

  generateExplanation(prediction, features, decision) {
    const factors = [];
    
    if (features.ip_reputation < 50) {
      factors.push('Low IP reputation detected');
    }
    if (features.is_tor) {
      factors.push('Connection through Tor network');
    }
    if (features.is_vpn) {
      factors.push('VPN or proxy usage detected');
    }
    if (features.amount > 8) {
      factors.push('High transaction amount');
    }
    if (features.behavioral_anomaly > 60) {
      factors.push('Unusual behavioral patterns');
    }
    if (features.transaction_velocity > 80) {
      factors.push('High transaction velocity');
    }
    if (features.unusual_location) {
      factors.push('Unusual geographic location');
    }

    let reasoning = '';
    switch (decision) {
      case 'approve':
        reasoning = 'Transaction approved - risk factors within acceptable limits';
        break;
      case 'review':
        reasoning = 'Transaction flagged for review - moderate risk detected';
        break;
      case 'reject':
        reasoning = 'Transaction blocked - high risk factors detected';
        break;
    }

    return {
      decision_reasoning: reasoning,
      risk_factors: factors,
      confidence_level: prediction.confidence > 80 ? 'high' : prediction.confidence > 60 ? 'medium' : 'low'
    };
  }

  handleCORS() {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key'
      }
    });
  }

  healthCheck() {
    return new Response(JSON.stringify({
      status: 'healthy',
      edge_location: 'cloudflare',
      model_loaded: this.model !== null,
      cache_size: {
        ip_reputation: this.ipReputationCache.size,
        behavioral_patterns: this.behavioralPatterns.size
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getMetrics() {
    return new Response(JSON.stringify({
      cache_stats: {
        ip_reputation_cache_size: this.ipReputationCache.size,
        behavioral_cache_size: this.behavioralPatterns.size
      },
      model_stats: {
        version: '1.0.0-edge',
        loaded: this.model !== null
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.reduce((hash, byte) => hash + byte, 0);
  }

  async hashIP(ip) {
    return await this.hashString(ip);
  }
}

// Global worker instance
const fraudWorker = new FraudDetectionWorker();

// Cloudflare Worker event listeners
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Initialize worker on first request
  if (!fraudWorker.model) {
    await fraudWorker.initialize();
  }

  return await fraudWorker.handleRequest(request);
}

// Export for testing
export { FraudDetectionWorker };