/**
 * 🛡️ FraudDetex - Usage Enforcement Middleware
 * 
 * Middleware to enforce usage limits and track API consumption
 * for billing and rate limiting purposes
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { BillingService } from "../services/billing.ts";
import { DatabaseService } from "../services/database.ts";

export interface UsageEnforcementOptions {
  billingService: BillingService;
  databaseService: DatabaseService;
  skipPaths?: string[];
  requestWeight?: (ctx: Context) => number;
}

export class UsageEnforcementMiddleware {
  private billingService: BillingService;
  private databaseService: DatabaseService;
  private skipPaths: Set<string>;
  private requestWeight: (ctx: Context) => number;

  constructor(options: UsageEnforcementOptions) {
    this.billingService = options.billingService;
    this.databaseService = options.databaseService;
    this.skipPaths = new Set(options.skipPaths || [
      '/health',
      '/api/v1/health',
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/billing/webhook'
    ]);
    this.requestWeight = options.requestWeight || (() => 1);
  }

  /**
   * Main middleware function
   */
  middleware() {
    return async (ctx: Context, next: Next) => {
      const startTime = Date.now();
      
      try {
        // Skip usage enforcement for certain paths
        if (this.shouldSkipUsageCheck(ctx)) {
          await next();
          return;
        }

        // Get user from context (should be set by auth middleware)
        const user = ctx.state.user;
        if (!user) {
          ctx.response.status = 401;
          ctx.response.body = {
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          };
          return;
        }

        // Calculate request weight
        const requestWeight = this.requestWeight(ctx);

        // Check usage and track
        const usageResult = await this.billingService.checkUsageAndTrack(user.id, requestWeight);

        if (!usageResult.allowed) {
          await this.handleUsageLimitExceeded(ctx, usageResult);
          return;
        }

        // Add usage info to response headers
        this.addUsageHeaders(ctx, usageResult);

        // Send warning if approaching limit
        if (usageResult.warning_threshold_reached) {
          await this.sendUsageWarning(user, usageResult);
        }

        // Continue to next middleware
        await next();

        // Log API usage for analytics
        await this.logAPIUsage(ctx, user, startTime);

      } catch (error) {
        console.error('Usage enforcement error:', error);
        
        // Don't block requests if usage enforcement fails
        // Log error and continue
        await next();
      }
    };
  }

  private shouldSkipUsageCheck(ctx: Context): boolean {
    const path = ctx.request.url.pathname;
    return this.skipPaths.has(path) || path.startsWith('/static/');
  }

  private async handleUsageLimitExceeded(ctx: Context, usageResult: any): Promise<void> {
    const plan = usageResult.plan;
    
    if (plan === 'community') {
      // Hard limit for community plan
      ctx.response.status = 429;
      ctx.response.body = {
        error: 'Usage limit exceeded',
        code: 'USAGE_LIMIT_EXCEEDED',
        message: 'You have reached your monthly limit of 10,000 requests. Please upgrade your plan to continue.',
        details: {
          usage_count: usageResult.usage_count,
          usage_limit: usageResult.usage_limit,
          plan: usageResult.plan,
          overage_count: usageResult.overage_count
        },
        upgrade_url: '/pricing',
        documentation: 'https://docs.frauddetex.com/limits'
      };
    } else {
      // Paid plans - should not reach this point, but handle gracefully
      ctx.response.status = 429;
      ctx.response.body = {
        error: 'Temporary usage limit exceeded',
        code: 'TEMPORARY_LIMIT_EXCEEDED',
        message: 'Please contact support for assistance with your usage limits.',
        support_email: 'support@frauddetex.com'
      };
    }

    // Add rate limit headers
    ctx.response.headers.set('X-RateLimit-Limit', usageResult.usage_limit.toString());
    ctx.response.headers.set('X-RateLimit-Remaining', '0');
    ctx.response.headers.set('X-RateLimit-Reset', this.getResetTimestamp(usageResult).toString());
    ctx.response.headers.set('Retry-After', '3600'); // 1 hour
  }

  private addUsageHeaders(ctx: Context, usageResult: any): void {
    const remaining = Math.max(0, usageResult.usage_limit - usageResult.usage_count);
    
    ctx.response.headers.set('X-RateLimit-Limit', usageResult.usage_limit.toString());
    ctx.response.headers.set('X-RateLimit-Remaining', remaining.toString());
    ctx.response.headers.set('X-RateLimit-Reset', this.getResetTimestamp(usageResult).toString());
    
    if (usageResult.overage_count > 0) {
      ctx.response.headers.set('X-Usage-Overage', usageResult.overage_count.toString());
      ctx.response.headers.set('X-Usage-Overage-Cost', usageResult.overage_cost.toFixed(4));
    }
    
    if (usageResult.warning_threshold_reached) {
      ctx.response.headers.set('X-Usage-Warning', 'approaching-limit');
    }
  }

  private async sendUsageWarning(user: any, usageResult: any): Promise<void> {
    // In a real implementation, you would send an email or notification
    // For now, we'll just log it
    console.log(`Usage warning for user ${user.id}: ${usageResult.usage_count}/${usageResult.usage_limit} requests used`);
    
    // You could implement email notifications here
    // await this.emailService.sendUsageWarning(user.email, usageResult);
  }

  private async logAPIUsage(ctx: Context, user: any, startTime: number): Promise<void> {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    try {
      await this.databaseService.logAPIUsage({
        user_id: user.id,
        endpoint: ctx.request.url.pathname,
        method: ctx.request.method,
        response_time_ms: responseTime,
        status_code: ctx.response.status || 200,
        ip_address: this.getClientIP(ctx),
        user_agent: ctx.request.headers.get('user-agent') || '',
        request_size: this.getRequestSize(ctx),
        response_size: this.getResponseSize(ctx)
      });
    } catch (error) {
      console.error('Failed to log API usage:', error);
    }
  }

  private getResetTimestamp(usageResult: any): number {
    // Calculate when the usage will reset (next billing period)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return Math.floor(nextMonth.getTime() / 1000);
  }

  private getClientIP(ctx: Context): string {
    // Try to get real IP from headers (for proxy setups)
    const forwarded = ctx.request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    const realIP = ctx.request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }
    
    // Fallback to connection IP
    return ctx.request.ip || 'unknown';
  }

  private getRequestSize(ctx: Context): number {
    const contentLength = ctx.request.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : 0;
  }

  private getResponseSize(ctx: Context): number {
    const contentLength = ctx.response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : 0;
  }
}

/**
 * Factory function to create usage enforcement middleware
 */
export function createUsageEnforcementMiddleware(options: UsageEnforcementOptions) {
  const middleware = new UsageEnforcementMiddleware(options);
  return middleware.middleware();
}

/**
 * Request weight calculator based on endpoint complexity
 */
export function calculateRequestWeight(ctx: Context): number {
  const path = ctx.request.url.pathname;
  const method = ctx.request.method;

  // Define weights for different endpoints
  const weights: Record<string, number> = {
    // Fraud detection endpoints (heavy ML processing)
    'POST /api/v1/fraud/check': 1,
    'POST /api/v1/fraud/batch-check': 5,
    'POST /api/v1/fraud/advanced-check': 2,
    
    // Analytics endpoints (database heavy)
    'GET /api/v1/analytics/dashboard': 1,
    'GET /api/v1/analytics/reports': 2,
    'GET /api/v1/analytics/export': 3,
    
    // Community endpoints (network operations)
    'POST /api/v1/community/threats': 1,
    'GET /api/v1/community/threats': 1,
    
    // User management (light operations)
    'GET /api/v1/user/profile': 0.5,
    'PUT /api/v1/user/profile': 0.5,
    
    // Billing endpoints (very light)
    'GET /api/v1/billing/usage': 0.1,
    'GET /api/v1/billing/invoices': 0.1
  };

  const key = `${method} ${path}`;
  return weights[key] || 1; // Default weight
}

/**
 * Enhanced request weight calculator that considers request body size
 */
export function calculateAdvancedRequestWeight(ctx: Context): number {
  const baseWeight = calculateRequestWeight(ctx);
  
  // Adjust weight based on request size
  const requestSize = parseInt(ctx.request.headers.get('content-length') || '0', 10);
  const sizeMultiplier = Math.max(1, Math.ceil(requestSize / 10000)); // +1 for every 10KB
  
  return baseWeight * sizeMultiplier;
}