/**
 * 🔴 FraudShield Revolutionary - Redis Service
 * 
 * Redis caching and rate limiting service
 * Features:
 * - Rate limiting by API key/IP
 * - Caching ML predictions
 * - Session management
 * - Real-time metrics storage
 */

import { connect, Redis } from "https://deno.land/x/redis@v0.32.1/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

export interface CachedPrediction {
  fraud_score: number;
  decision: string;
  confidence: number;
  cached_at: number;
}

export class RedisService {
  private client: Redis | null = null;
  private connected: boolean = false;

  async connect(): Promise<void> {
    if (!this.connected) {
      const redisUrl = env.REDIS_URL || "redis://localhost:6379";
      this.client = await connect({ hostname: "localhost", port: 6379 });
      this.connected = true;
    }
  }

  async close(): Promise<void> {
    if (this.connected && this.client) {
      this.client.close();
      this.connected = false;
    }
  }

  // Rate limiting
  async checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number = 60
  ): Promise<RateLimitResult> {
    if (!this.client) throw new Error("Redis not connected");

    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;
    
    // Remove old entries
    await this.client.zremrangebyscore(key, 0, windowStart);
    
    // Count current requests
    const current = await this.client.zcard(key);
    
    if (current >= limit) {
      const resetTime = now + windowSeconds;
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        limit
      };
    }

    // Add current request
    await this.client.zadd(key, now, `${now}-${Math.random()}`);
    await this.client.expire(key, windowSeconds);

    return {
      allowed: true,
      remaining: limit - current - 1,
      resetTime: now + windowSeconds,
      limit
    };
  }

  // Caching ML predictions (to avoid re-computation for identical requests)
  async cachePrediction(
    requestHash: string,
    prediction: CachedPrediction,
    ttlSeconds: number = 300
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `prediction:${requestHash}`;
    await this.client.setex(
      key,
      ttlSeconds,
      JSON.stringify(prediction)
    );
  }

  async getCachedPrediction(requestHash: string): Promise<CachedPrediction | null> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `prediction:${requestHash}`;
    const cached = await this.client.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }

  // Session management
  async setSession(
    sessionId: string,
    sessionData: any,
    ttlSeconds: number = 3600
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `session:${sessionId}`;
    await this.client.setex(
      key,
      ttlSeconds,
      JSON.stringify(sessionData)
    );
  }

  async getSession(sessionId: string): Promise<any | null> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `session:${sessionId}`;
    const session = await this.client.get(key);
    
    if (session) {
      return JSON.parse(session);
    }
    
    return null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `session:${sessionId}`;
    await this.client.del(key);
  }

  // Real-time metrics
  async incrementMetric(
    metric: string,
    value: number = 1,
    windowSeconds: number = 3600
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const now = Math.floor(Date.now() / 1000);
    const key = `metric:${metric}:${Math.floor(now / windowSeconds)}`;
    
    await this.client.incrby(key, value);
    await this.client.expire(key, windowSeconds * 2); // Keep for 2 windows
  }

  async getMetric(
    metric: string,
    windowSeconds: number = 3600
  ): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");

    const now = Math.floor(Date.now() / 1000);
    const key = `metric:${metric}:${Math.floor(now / windowSeconds)}`;
    
    const value = await this.client.get(key);
    return value ? parseInt(value) : 0;
  }

  async getMetricHistory(
    metric: string,
    periods: number = 24,
    windowSeconds: number = 3600
  ): Promise<Array<{ timestamp: number; value: number }>> {
    if (!this.client) throw new Error("Redis not connected");

    const now = Math.floor(Date.now() / 1000);
    const history: Array<{ timestamp: number; value: number }> = [];

    for (let i = 0; i < periods; i++) {
      const timestamp = now - (i * windowSeconds);
      const key = `metric:${metric}:${Math.floor(timestamp / windowSeconds)}`;
      const value = await this.client.get(key);
      
      history.unshift({
        timestamp: timestamp * 1000, // Convert to milliseconds
        value: value ? parseInt(value) : 0
      });
    }

    return history;
  }

  // Blacklist management
  async addToBlacklist(
    type: 'ip' | 'email' | 'device',
    value: string,
    ttlSeconds: number = 86400
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `blacklist:${type}:${value}`;
    await this.client.setex(key, ttlSeconds, "1");
  }

  async isBlacklisted(type: 'ip' | 'email' | 'device', value: string): Promise<boolean> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `blacklist:${type}:${value}`;
    const result = await this.client.get(key);
    return result !== null;
  }

  async removeFromBlacklist(type: 'ip' | 'email' | 'device', value: string): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `blacklist:${type}:${value}`;
    await this.client.del(key);
  }

  // User behavioral patterns caching
  async cacheBehavioralPattern(
    userId: string,
    pattern: any,
    ttlSeconds: number = 1800
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `behavior:${userId}`;
    await this.client.setex(
      key,
      ttlSeconds,
      JSON.stringify(pattern)
    );
  }

  async getBehavioralPattern(userId: string): Promise<any | null> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `behavior:${userId}`;
    const pattern = await this.client.get(key);
    
    if (pattern) {
      return JSON.parse(pattern);
    }
    
    return null;
  }

  // Community threat intelligence caching
  async cacheThreatIntelligence(
    threatHash: string,
    threatData: any,
    ttlSeconds: number = 3600
  ): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `threat:${threatHash}`;
    await this.client.setex(
      key,
      ttlSeconds,
      JSON.stringify(threatData)
    );
  }

  async getThreatIntelligence(threatHash: string): Promise<any | null> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `threat:${threatHash}`;
    const threat = await this.client.get(key);
    
    if (threat) {
      return JSON.parse(threat);
    }
    
    return null;
  }

  // Real-time dashboard data
  async setDashboardData(userId: string, data: any): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `dashboard:${userId}`;
    await this.client.setex(key, 300, JSON.stringify(data)); // 5 minute cache
  }

  async getDashboardData(userId: string): Promise<any | null> {
    if (!this.client) throw new Error("Redis not connected");

    const key = `dashboard:${userId}`;
    const data = await this.client.get(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return null;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return await this.ping();
  }

  async ping(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      const result = await this.client.ping();
      return result === "PONG";
    } catch {
      return false;
    }
  }

  // Utility: Generate request hash for caching
  static generateRequestHash(data: any): string {
    const normalized = JSON.stringify(data, Object.keys(data).sort());
    return btoa(normalized).slice(0, 32);
  }

  // Utility: Get rate limit key
  static getRateLimitKey(type: 'api_key' | 'ip', value: string): string {
    return `rate_limit:${type}:${value}`;
  }
}