/**
 * 🛡️ FraudShield Revolutionary - Fraud Detection Routes
 * 
 * Core fraud detection endpoints
 * Features:
 * - Real-time fraud detection
 * - Behavioral analysis integration
 * - Explainable AI decisions
 * - Community intelligence
 * - Historical transaction analysis
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { MLService, FraudFeatures } from "../services/ml.ts";
import { DatabaseService } from "../services/database.ts";
import { RedisService } from "../services/redis.ts";
import { InputSanitizer } from "../config/security.ts";

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class MLServiceError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'MLServiceError';
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

function validateRange(value: number, min: number, max: number, fieldName: string): void {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
  }
}

export const fraudRoutes = new Router();

// Initialize services (these would be injected in a real DI system)
let mlService: MLService;
let dbService: DatabaseService;
let redisService: RedisService;

export function initializeFraudServices(ml: MLService, db: DatabaseService, redis: RedisService) {
  mlService = ml;
  dbService = db;
  redisService = redis;
}

/**
 * POST /api/v1/fraud/detect
 * Real-time fraud detection endpoint
 */
fraudRoutes.post("/detect", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    // Validate required fields
    validateRequired(requestBody, [
      'transaction_id', 'amount', 'user_id', 'payment_method'
    ]);

    // Validate data types
    validateTypes(requestBody, {
      transaction_id: 'string',
      amount: 'number',
      user_id: 'string',
      payment_method: 'string',
      currency: 'string'
    });

    // Validate business rules
    validateRange(requestBody.amount, 0.01, 1000000, 'amount');

    // Extract transaction data
    const transactionData = {
      transaction_id: requestBody.transaction_id,
      amount: requestBody.amount,
      user_id: requestBody.user_id,
      currency: requestBody.currency || 'BRL',
      payment_method: requestBody.payment_method,
      merchant_category: requestBody.merchant_category || 'general',
      metadata: requestBody.metadata || {}
    };

    // Check cache first
    const requestHash = RedisService.generateRequestHash({
      amount: transactionData.amount,
      user_id: transactionData.user_id,
      payment_method: transactionData.payment_method
    });

    const cached = await redisService.getCachedPrediction(requestHash);
    if (cached) {
      ctx.response.body = {
        ...cached,
        transaction_id: transactionData.transaction_id,
        cached: true,
        processing_time_ms: cached.cached_at ? performance.now() - cached.cached_at : 0
      };
      return;
    }

    // Get user history for feature engineering
    const userHistory = await getUserHistory(transactionData.user_id);
    
    // Get device/behavioral data
    const deviceData = requestBody.device_data || {};
    const behavioralData = requestBody.behavioral_data || {};
    
    // Check community threat intelligence
    const communityThreats = await checkCommunityThreats(transactionData, deviceData);
    
    // Extract ML features
    const features: FraudFeatures = await extractFeatures(
      { ...transactionData, community_threat_score: communityThreats.score },
      userHistory,
      { ...deviceData, behavioral: behavioralData }
    );

    // Run ML prediction
    const prediction = await mlService.predictFraud(features);

    // Store transaction in database (simplified for demo)
    const processingTime = Date.now() - startTime;
    console.log(`Fraud detection stored: ${transactionData.transaction_id} -> ${prediction.fraud_score}% (${prediction.decision})`);

    // Cache the prediction
    await redisService.cachePrediction(requestHash, {
      fraud_score: prediction.fraud_score,
      decision: prediction.decision,
      confidence: prediction.confidence,
      cached_at: Date.now()
    });

    // Update user behavioral profile
    if (Object.keys(behavioralData).length > 0) {
      await redisService.cacheBehavioralPattern(transactionData.user_id, behavioralData);
    }

    // Log high-risk transactions
    if (prediction.fraud_score > 70) {
      console.log(`🚨 High risk transaction detected: ${transactionData.transaction_id} (${prediction.fraud_score}%)`);
    }

    // Increment metrics
    await redisService.incrementMetric("fraud_detections_total");
    await redisService.incrementMetric(`fraud_decisions_${prediction.decision}`);

    // Response
    ctx.response.body = {
      transaction_id: transactionData.transaction_id,
      fraud_score: prediction.fraud_score,
      decision: prediction.decision,
      confidence: prediction.confidence,
      explanation: prediction.explanation,
      processing_time_ms: processingTime,
      community_threat_score: communityThreats.score,
      cached: false,
      model_version: "1.0.0",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new MLServiceError("Fraud detection failed", { 
      error: error.message,
      processing_time_ms: Date.now() - startTime
    });
  }
});

/**
 * POST /api/v1/fraud/batch
 * Batch fraud detection for multiple transactions
 */
fraudRoutes.post("/batch", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  
  validateRequired(requestBody, ['transactions']);
  
  if (!Array.isArray(requestBody.transactions)) {
    throw new ValidationError("'transactions' must be an array");
  }

  if (requestBody.transactions.length > 100) {
    throw new ValidationError("Maximum 100 transactions per batch");
  }

  const results = [];
  
  for (const transaction of requestBody.transactions) {
    try {
      // Process each transaction (simplified version of single detection)
      const userHistory = await getUserHistory(transaction.user_id);
      const features = await extractFeatures(transaction, userHistory, {});
      const prediction = await mlService.predictFraud(features);
      
      results.push({
        transaction_id: transaction.transaction_id,
        fraud_score: prediction.fraud_score,
        decision: prediction.decision,
        confidence: prediction.confidence
      });
      
    } catch (error) {
      results.push({
        transaction_id: transaction.transaction_id,
        error: error.message
      });
    }
  }

  ctx.response.body = {
    batch_id: `batch_${Date.now()}`,
    total_transactions: requestBody.transactions.length,
    successful: results.filter(r => !r.error).length,
    failed: results.filter(r => r.error).length,
    results
  };
});

/**
 * GET /api/v1/fraud/transactions
 * Get user's fraud detection history
 */
fraudRoutes.get("/transactions", async (ctx: Context) => {
  const url = new URL(ctx.request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const decision = url.searchParams.get("decision"); // Filter by decision

  let transactions = await dbService.getFraudTransactionsByUser(ctx.user!.id, limit, offset);
  
  // Filter by decision if specified
  if (decision && ['approve', 'reject', 'review'].includes(decision)) {
    transactions = transactions.filter(t => t.decision === decision);
  }

  const stats = await dbService.getFraudStats(ctx.user!.id);

  ctx.response.body = {
    transactions,
    pagination: {
      limit,
      offset,
      total: stats.total_transactions || 0
    },
    stats: {
      total_transactions: stats.total_transactions || 0,
      fraud_detected: stats.fraud_detected || 0,
      fraud_rate: stats.fraud_rate || 0,
      avg_processing_time: stats.avg_processing_time || 0,
      avg_confidence: stats.accuracy || 0
    }
  };
});

/**
 * GET /api/v1/fraud/transaction/:id
 * Get detailed information about a specific transaction
 */
fraudRoutes.get("/transaction/:id", async (ctx: Context) => {
  const transactionId = ctx.params.id;
  
  // Query transaction (this would need a proper query method)
  const transactions = await dbService.getFraudTransactionsByUser(ctx.user!.id, 1000);
  const transaction = transactions.find(t => t.transaction_id === transactionId);
  
  if (!transaction) {
    ctx.response.status = 404;
    ctx.response.body = {
      error: "Transaction not found",
      message: "The specified transaction was not found or you don't have access to it"
    };
    return;
  }

  ctx.response.body = {
    ...transaction,
    features_used: Object.keys(transaction.features || {}),
    explanation_details: transaction.explanation
  };
});

/**
 * POST /api/v1/fraud/feedback
 * Submit feedback on fraud detection decisions
 */
fraudRoutes.post("/feedback", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  
  validateRequired(requestBody, ['transaction_id', 'feedback', 'actual_outcome']);
  validateTypes(requestBody, {
    transaction_id: 'string',
    feedback: 'string',
    actual_outcome: 'string'
  });

  if (!['fraud', 'legitimate', 'unknown'].includes(requestBody.actual_outcome)) {
    throw new ValidationError("actual_outcome must be 'fraud', 'legitimate', or 'unknown'");
  }

  // Store feedback for model improvement
  // In a real system, this would go to a feedback table
  console.log("Feedback received:", {
    user_id: ctx.user!.id,
    transaction_id: requestBody.transaction_id,
    feedback: requestBody.feedback,
    actual_outcome: requestBody.actual_outcome,
    timestamp: new Date().toISOString()
  });

  // Update metrics
  await redisService.incrementMetric("feedback_total");
  await redisService.incrementMetric(`feedback_${requestBody.actual_outcome}`);

  ctx.response.body = {
    message: "Feedback received successfully",
    transaction_id: requestBody.transaction_id,
    status: "recorded"
  };
});

// Helper functions

async function getUserHistory(userId: string) {
  try {
    // Get user's transaction history for feature engineering
    const recentTransactions = await dbService.getFraudTransactionsByUser(userId, 10);
    const stats = await dbService.getFraudStats(userId, 7); // Last 7 days
    
    // Calculate user behavior metrics
    const now = Date.now();
    const accountCreated = recentTransactions.length > 0 
      ? new Date(recentTransactions[recentTransactions.length - 1].created_at)
      : new Date();
    
    const accountAgeDays = Math.floor((now - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      account_age_days: Math.max(accountAgeDays, 0),
      recent_transaction_count: stats.total_transactions || 0,
      avg_amount: recentTransactions.length > 0 
        ? recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length
        : 0,
      velocity_score: calculateVelocityScore(recentTransactions)
    };
    
  } catch (error) {
    console.warn("Failed to get user history:", error.message);
    return {
      account_age_days: 0,
      recent_transaction_count: 0,
      avg_amount: 0,
      velocity_score: 0
    };
  }
}

function calculateVelocityScore(transactions: any[]): number {
  if (transactions.length < 2) return 0;
  
  // Calculate transaction frequency in last 24 hours
  const last24h = Date.now() - (24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(t => 
    new Date(t.created_at).getTime() > last24h
  );
  
  // Simple velocity scoring
  if (recentTransactions.length > 10) return 80;
  if (recentTransactions.length > 5) return 60;
  if (recentTransactions.length > 2) return 40;
  return 20;
}

async function checkCommunityThreats(transactionData: any, deviceData: any) {
  try {
    // Check for known threat patterns
    const threatIndicators = [
      deviceData.ip_address,
      deviceData.device_fingerprint,
      transactionData.payment_method + "_" + Math.floor(transactionData.amount / 100) * 100
    ].filter(Boolean);
    
    let maxThreatScore = 0;
    const detectedThreats: string[] = [];
    
    for (const indicator of threatIndicators) {
      const hash = await hashString(indicator);
      const threat = await dbService.getThreatByHash(hash);
      
      if (threat) {
        const threatScore = calculateThreatScore(threat);
        maxThreatScore = Math.max(maxThreatScore, threatScore);
        detectedThreats.push(threat.threat_type);
      }
    }
    
    return {
      score: maxThreatScore,
      threats: detectedThreats
    };
    
  } catch (error) {
    console.warn("Failed to check community threats:", error.message);
    return { score: 0, threats: [] };
  }
}

function calculateThreatScore(threat: any): number {
  const severityScores = { low: 20, medium: 40, high: 70, critical: 90 };
  const baseScore = severityScores[threat.severity as keyof typeof severityScores] || 0;
  
  // Adjust based on verification ratio
  const verificationRatio = threat.verified_count / (threat.verified_count + threat.false_positive_count);
  return Math.round(baseScore * verificationRatio);
}

async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Feature extraction function
async function extractFeatures(transactionData: any, userHistory: any, deviceData: any): Promise<FraudFeatures> {
  const currentHour = new Date().getHours();
  const currentDayOfWeek = new Date().getDay();
  
  return {
    // Transaction features
    amount: transactionData.amount,
    transaction_hour: currentHour,
    transaction_day_of_week: currentDayOfWeek,
    merchant_category: transactionData.merchant_category || 'general',
    payment_method: transactionData.payment_method || 'credit_card',
    currency: transactionData.currency || 'USD',
    
    // User behavior features
    user_age_days: userHistory.account_age_days || 30,
    transactions_last_24h: userHistory.recent_transaction_count || 1,
    avg_transaction_amount: userHistory.avg_amount || transactionData.amount,
    velocity_score: userHistory.velocity_score || 0,
    
    // Device/IP features
    device_fingerprint: deviceData.device_fingerprint || generateDeviceFingerprint(),
    ip_address: deviceData.ip_address || '127.0.0.1',
    ip_reputation_score: deviceData.ip_reputation_score || 50,
    geolocation_risk: deviceData.geolocation_risk || 0,
    is_vpn: deviceData.is_vpn || false,
    is_tor: deviceData.is_tor || false,
    country_code: deviceData.country_code || 'US',
    
    // Behavioral biometrics
    mouse_velocity_avg: deviceData.behavioral?.mouse_velocity_avg,
    mouse_click_pressure: deviceData.behavioral?.mouse_click_pressure,
    keystroke_dwell_time: deviceData.behavioral?.keystroke_dwell_time,
    typing_rhythm_score: deviceData.behavioral?.typing_rhythm_score,
    scroll_pattern_score: deviceData.behavioral?.scroll_pattern_score,
    
    // Network features
    community_threat_score: transactionData.community_threat_score || 0,
    similar_transaction_patterns: 0,
    email_age_days: deviceData.email_age_days || 365,
    device_reputation_score: deviceData.device_reputation_score || 50
  };
}

function generateDeviceFingerprint(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
}