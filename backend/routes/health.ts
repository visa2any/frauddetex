/**
 * ❤️ FraudShield Revolutionary - Health Check Routes
 * 
 * System health monitoring endpoints
 * Features:
 * - Database connectivity
 * - Redis connectivity
 * - ML service status
 * - Edge worker status
 * - Performance metrics
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { MLService } from "../services/ml.ts";
import { RedisService } from "../services/redis.ts";

export const healthRoutes = new Router();

let dbService: DatabaseService;
let mlService: MLService;
let redisService: RedisService;

export function initializeHealthServices(db: DatabaseService, ml: MLService, redis: RedisService) {
  dbService = db;
  mlService = ml;
  redisService = redis;
}

/**
 * GET /api/v1/health
 * Basic health check endpoint
 */
healthRoutes.get("/", async (ctx: Context) => {
  const startTime = Date.now();
  
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime ? process.uptime() : 0,
    environment: Deno.env.get("NODE_ENV") || "development"
  };

  const responseTime = Date.now() - startTime;
  
  ctx.response.headers.set("X-Response-Time", responseTime.toString());
  ctx.response.body = health;
});

/**
 * GET /api/v1/health/detailed
 * Detailed health check with all service statuses
 */
healthRoutes.get("/detailed", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    // Check all services in parallel
    const [
      databaseHealth,
      redisHealth,
      mlHealth,
      edgeHealth
    ] = await Promise.allSettled([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkMLHealth(),
      checkEdgeHealth()
    ]);

    const overallStatus = [
      databaseHealth,
      redisHealth,
      mlHealth,
      edgeHealth
    ].every(result => result.status === 'fulfilled' && result.value.status === 'healthy')
      ? 'healthy'
      : 'degraded';

    const health = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime ? process.uptime() : 0,
      environment: Deno.env.get("NODE_ENV") || "development",
      response_time_ms: Date.now() - startTime,
      services: {
        database: databaseHealth.status === 'fulfilled' ? databaseHealth.value : { status: 'unhealthy', error: databaseHealth.reason },
        redis: redisHealth.status === 'fulfilled' ? redisHealth.value : { status: 'unhealthy', error: redisHealth.reason },
        ml: mlHealth.status === 'fulfilled' ? mlHealth.value : { status: 'unhealthy', error: mlHealth.reason },
        edge: edgeHealth.status === 'fulfilled' ? edgeHealth.value : { status: 'unhealthy', error: edgeHealth.reason }
      }
    };

    ctx.response.status = overallStatus === 'healthy' ? 200 : 503;
    ctx.response.body = health;

  } catch (error) {
    ctx.response.status = 503;
    ctx.response.body = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
});

/**
 * GET /api/v1/health/database
 * Database-specific health check
 */
healthRoutes.get("/database", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const health = await checkDatabaseHealth();
    health.response_time_ms = Date.now() - startTime;
    
    ctx.response.status = health.status === 'healthy' ? 200 : 503;
    ctx.response.body = health;
    
  } catch (error) {
    ctx.response.status = 503;
    ctx.response.body = {
      status: "unhealthy",
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
});

/**
 * GET /api/v1/health/redis
 * Redis-specific health check
 */
healthRoutes.get("/redis", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const health = await checkRedisHealth();
    health.response_time_ms = Date.now() - startTime;
    
    ctx.response.status = health.status === 'healthy' ? 200 : 503;
    ctx.response.body = health;
    
  } catch (error) {
    ctx.response.status = 503;
    ctx.response.body = {
      status: "unhealthy",
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
});

/**
 * GET /api/v1/health/ml
 * ML service health check
 */
healthRoutes.get("/ml", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const health = await checkMLHealth();
    health.response_time_ms = Date.now() - startTime;
    
    ctx.response.status = health.status === 'healthy' ? 200 : 503;
    ctx.response.body = health;
    
  } catch (error) {
    ctx.response.status = 503;
    ctx.response.body = {
      status: "unhealthy",
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
});

/**
 * GET /api/v1/health/edge
 * Edge workers health check
 */
healthRoutes.get("/edge", async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const health = await checkEdgeHealth();
    health.response_time_ms = Date.now() - startTime;
    
    ctx.response.status = health.status === 'healthy' ? 200 : 503;
    ctx.response.body = health;
    
  } catch (error) {
    ctx.response.status = 503;
    ctx.response.body = {
      status: "unhealthy",
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
});

/**
 * GET /api/v1/health/metrics
 * Performance and usage metrics
 */
healthRoutes.get("/metrics", async (ctx: Context) => {
  try {
    const metrics = await gatherMetrics();
    ctx.response.body = metrics;
    
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Failed to gather metrics",
      message: error.message
    };
  }
});

// Helper functions

async function checkDatabaseHealth() {
  const startTime = Date.now();
  
  try {
    const isHealthy = await dbService.healthCheck();
    const responseTime = Date.now() - startTime;
    
    if (!isHealthy) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        response_time_ms: responseTime
      };
    }

    // Additional database checks
    const stats = await gatherDatabaseStats();
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      response_time_ms: responseTime,
      connection_pool: 'active',
      ...stats
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Database health check failed',
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
}

async function checkRedisHealth() {
  const startTime = Date.now();
  
  try {
    const isHealthy = await redisService.ping();
    const responseTime = Date.now() - startTime;
    
    if (!isHealthy) {
      return {
        status: 'unhealthy',
        message: 'Redis connection failed',
        response_time_ms: responseTime
      };
    }

    return {
      status: 'healthy',
      message: 'Redis connection successful',
      response_time_ms: responseTime,
      connection: 'active'
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Redis health check failed',
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
}

async function checkMLHealth() {
  const startTime = Date.now();
  
  try {
    const isHealthy = await mlService.healthCheck();
    const responseTime = Date.now() - startTime;
    
    if (!isHealthy) {
      return {
        status: 'unhealthy',
        message: 'ML service not initialized',
        response_time_ms: responseTime
      };
    }

    // Test ML inference with dummy data
    const testFeatures = {
      amount: 100,
      transaction_hour: 12,
      transaction_day_of_week: 1,
      merchant_category: 'test',
      payment_method: 'card',
      currency: 'USD',
      user_age_days: 30,
      transactions_last_24h: 1,
      avg_transaction_amount: 100,
      velocity_score: 10,
      device_fingerprint: 'test',
      ip_address: '127.0.0.1',
      ip_reputation_score: 80,
      geolocation_risk: 10,
      is_vpn: false,
      is_tor: false,
      country_code: 'US'
    };

    const prediction = await mlService.predictFraud(testFeatures);
    
    return {
      status: 'healthy',
      message: 'ML service operational',
      response_time_ms: Date.now() - startTime,
      test_prediction: {
        fraud_score: prediction.fraud_score,
        processing_time_ms: prediction.processing_time_ms
      },
      model_version: prediction.model_version
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'ML service health check failed',
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
}

async function checkEdgeHealth() {
  const startTime = Date.now();
  const edgeURL = Deno.env.get("EDGE_API_URL");
  
  if (!edgeURL) {
    return {
      status: 'unknown',
      message: 'Edge URL not configured',
      response_time_ms: Date.now() - startTime
    };
  }

  try {
    const response = await fetch(`${edgeURL}/edge/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get("EDGE_API_KEY") || ''}`,
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return {
        status: 'unhealthy',
        message: `Edge workers returned ${response.status}`,
        response_time_ms: responseTime
      };
    }

    const data = await response.json();
    
    return {
      status: 'healthy',
      message: 'Edge workers operational',
      response_time_ms: responseTime,
      edge_location: data.edge_location,
      model_loaded: data.model_loaded,
      cache_size: data.cache_size
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Edge workers health check failed',
      error: error.message,
      response_time_ms: Date.now() - startTime
    };
  }
}

async function gatherDatabaseStats() {
  try {
    // These would be actual database queries in production
    return {
      total_users: 0, // await dbService.countUsers(),
      total_transactions: 0, // await dbService.countTransactions(),
      avg_daily_volume: 0, // await dbService.getAvgDailyVolume()
    };
  } catch (error) {
    console.warn("Failed to gather database stats:", error.message);
    return {};
  }
}

async function gatherMetrics() {
  try {
    const [
      requestMetrics,
      performanceMetrics,
      errorMetrics
    ] = await Promise.allSettled([
      gatherRequestMetrics(),
      gatherPerformanceMetrics(),
      gatherErrorMetrics()
    ]);

    return {
      timestamp: new Date().toISOString(),
      requests: requestMetrics.status === 'fulfilled' ? requestMetrics.value : {},
      performance: performanceMetrics.status === 'fulfilled' ? performanceMetrics.value : {},
      errors: errorMetrics.status === 'fulfilled' ? errorMetrics.value : {}
    };
    
  } catch (error) {
    throw new Error(`Failed to gather metrics: ${error.message}`);
  }
}

async function gatherRequestMetrics() {
  try {
    return {
      total_requests_1h: await redisService.getMetric("requests_total", 3600),
      fraud_detections_1h: await redisService.getMetric("fraud_detections_total", 3600),
      errors_1h: await redisService.getMetric("errors_total", 3600)
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function gatherPerformanceMetrics() {
  try {
    const totalTime = await redisService.getMetric("response_time_total", 3600);
    const totalRequests = await redisService.getMetric("requests_total", 3600);
    
    return {
      avg_response_time_ms: totalRequests > 0 ? Math.round(totalTime / totalRequests) : 0,
      memory_usage_mb: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function gatherErrorMetrics() {
  try {
    return {
      total_errors_1h: await redisService.getMetric("errors_total", 3600),
      error_rate: await calculateErrorRate(),
      last_error_time: await getLastErrorTime()
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function calculateErrorRate() {
  try {
    const errors = await redisService.getMetric("errors_total", 3600);
    const total = await redisService.getMetric("requests_total", 3600);
    
    return total > 0 ? Math.round((errors / total) * 100 * 100) / 100 : 0;
  } catch {
    return 0;
  }
}

async function getLastErrorTime() {
  try {
    // This would be implemented with actual error tracking
    return null;
  } catch {
    return null;
  }
}