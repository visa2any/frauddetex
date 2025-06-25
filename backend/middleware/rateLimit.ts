/**
 * ⚡ FraudShield Revolutionary - Rate Limiting Middleware
 * 
 * Advanced rate limiting with multiple strategies
 * Features:
 * - Per-API-key rate limiting
 * - Per-IP rate limiting
 * - Plan-based limits
 * - Sliding window algorithm
 * - Redis-backed storage
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { RedisService } from "../services/redis.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface RateLimitConfig {
  requests: number;
  windowSeconds: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Plan-based rate limits
const PLAN_LIMITS: Record<string, RateLimitConfig> = {
  community: {
    requests: 100,
    windowSeconds: 3600, // 100 requests per hour
  },
  smart: {
    requests: 1000,
    windowSeconds: 3600, // 1000 requests per hour
  },
  enterprise: {
    requests: 10000,
    windowSeconds: 3600, // 10000 requests per hour
  },
  insurance: {
    requests: 5000,
    windowSeconds: 3600, // 5000 requests per hour
  }
};

// IP-based rate limits (for unauthenticated requests)
const IP_LIMITS: RateLimitConfig = {
  requests: 10,
  windowSeconds: 60, // 10 requests per minute
};

// Global rate limits (per endpoint)
const ENDPOINT_LIMITS: Record<string, RateLimitConfig> = {
  '/api/v1/fraud/detect': {
    requests: 50,
    windowSeconds: 60, // 50 fraud detection requests per minute per user
  },
  '/api/v1/ml/train': {
    requests: 5,
    windowSeconds: 3600, // 5 training requests per hour
  },
  '/api/v1/auth/login': {
    requests: 5,
    windowSeconds: 300, // 5 login attempts per 5 minutes
  },
  '/api/v1/auth/register': {
    requests: 3,
    windowSeconds: 3600, // 3 registration attempts per hour
  }
};

let redisService: RedisService;

export function initializeRateLimitService(redis: RedisService) {
  redisService = redis;
}

export async function rateLimitMiddleware(ctx: Context, next: Next) {
  // Skip rate limiting for health checks
  if (ctx.request.url.pathname.startsWith('/health')) {
    await next();
    return;
  }

  const startTime = Date.now();

  try {
    // Check different rate limit layers
    const checks = await Promise.all([
      checkIPRateLimit(ctx),
      checkUserRateLimit(ctx),
      checkEndpointRateLimit(ctx)
    ]);

    // If any check fails, return rate limit error
    const failedCheck = checks.find(check => !check.allowed);
    if (failedCheck) {
      ctx.response.status = 429;
      ctx.response.headers.set("X-RateLimit-Limit", failedCheck.limit.toString());
      ctx.response.headers.set("X-RateLimit-Remaining", failedCheck.remaining.toString());
      ctx.response.headers.set("X-RateLimit-Reset", failedCheck.resetTime.toString());
      ctx.response.headers.set("Retry-After", Math.ceil((failedCheck.resetTime - Date.now() / 1000)).toString());

      ctx.response.body = {
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        limit: failedCheck.limit,
        remaining: failedCheck.remaining,
        reset_time: failedCheck.resetTime,
        documentation: "https://docs.fraudshield.revolutionary/rate-limits"
      };
      return;
    }

    // Set rate limit headers for successful requests
    const userCheck = checks[1];
    if (userCheck) {
      ctx.response.headers.set("X-RateLimit-Limit", userCheck.limit.toString());
      ctx.response.headers.set("X-RateLimit-Remaining", userCheck.remaining.toString());
      ctx.response.headers.set("X-RateLimit-Reset", userCheck.resetTime.toString());
    }

    await next();

  } catch (error) {
    console.error("Rate limiting error:", error);
    // Don't block requests if rate limiting fails
    await next();
  }

  // Log request metrics
  const duration = Date.now() - startTime;
  try {
    await redisService.incrementMetric("requests_total", 1);
    await redisService.incrementMetric("response_time_total", duration);
    
    if (ctx.response.status >= 400) {
      await redisService.incrementMetric("errors_total", 1);
    }
  } catch (error) {
    console.error("Error logging metrics:", error);
  }
}

async function checkIPRateLimit(ctx: Context) {
  const clientIP = getClientIP(ctx);
  const key = RedisService.getRateLimitKey('ip', clientIP);
  
  return await redisService.checkRateLimit(
    key,
    IP_LIMITS.requests,
    IP_LIMITS.windowSeconds
  );
}

async function checkUserRateLimit(ctx: Context) {
  // Skip if no user (will be handled by IP rate limit)
  if (!ctx.user) {
    return { allowed: true, remaining: 0, resetTime: 0, limit: 0 };
  }

  const planLimit = PLAN_LIMITS[ctx.user.plan] || PLAN_LIMITS.community;
  const key = RedisService.getRateLimitKey('api_key', ctx.user.api_key);
  
  return await redisService.checkRateLimit(
    key,
    planLimit.requests,
    planLimit.windowSeconds
  );
}

async function checkEndpointRateLimit(ctx: Context) {
  const endpoint = getEndpointPattern(ctx.request.url.pathname);
  const endpointLimit = ENDPOINT_LIMITS[endpoint];
  
  if (!endpointLimit) {
    return { allowed: true, remaining: 0, resetTime: 0, limit: 0 };
  }

  const identifier = ctx.user?.id || getClientIP(ctx);
  const key = `endpoint_limit:${endpoint}:${identifier}`;
  
  return await redisService.checkRateLimit(
    key,
    endpointLimit.requests,
    endpointLimit.windowSeconds
  );
}

function getClientIP(ctx: Context): string {
  // Check for IP in various headers (handle proxies)
  const forwardedFor = ctx.request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = ctx.request.headers.get("X-Real-IP");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = ctx.request.headers.get("CF-Connecting-IP");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to connection remote address
  return ctx.request.ip || "unknown";
}

function getEndpointPattern(pathname: string): string {
  // Map dynamic paths to patterns
  const patterns = [
    { pattern: /^\/api\/v1\/fraud\/detect/, endpoint: '/api/v1/fraud/detect' },
    { pattern: /^\/api\/v1\/ml\/train/, endpoint: '/api/v1/ml/train' },
    { pattern: /^\/api\/v1\/auth\/login/, endpoint: '/api/v1/auth/login' },
    { pattern: /^\/api\/v1\/auth\/register/, endpoint: '/api/v1/auth/register' },
    { pattern: /^\/api\/v1\/user\/\w+/, endpoint: '/api/v1/user/:id' },
    { pattern: /^\/api\/v1\/analytics/, endpoint: '/api/v1/analytics' },
  ];

  for (const { pattern, endpoint } of patterns) {
    if (pattern.test(pathname)) {
      return endpoint;
    }
  }

  return pathname;
}

// Rate limit bypass for specific scenarios
export function bypassRateLimit() {
  return async (ctx: Context, next: Next) => {
    // Add a flag to skip rate limiting
    (ctx as any).skipRateLimit = true;
    await next();
  };
}

// Dynamic rate limit adjustment
export async function adjustRateLimit(
  userId: string,
  multiplier: number,
  durationMinutes: number = 60
) {
  // Implement temporary rate limit adjustments
  // This could be used for premium features or incident response
  const key = `rate_limit_adjustment:${userId}`;
  await redisService.setSession(key, { multiplier }, durationMinutes * 60);
}

// Rate limit analytics
export async function getRateLimitStats(userId?: string) {
  const stats = {
    requests_last_hour: await redisService.getMetric("requests_total", 3600),
    errors_last_hour: await redisService.getMetric("errors_total", 3600),
    avg_response_time: 0
  };

  const totalTime = await redisService.getMetric("response_time_total", 3600);
  if (stats.requests_last_hour > 0) {
    stats.avg_response_time = Math.round(totalTime / stats.requests_last_hour);
  }

  return stats;
}