/**
 * 💰 FraudDetex - Billing Routes
 * 
 * Subscription and billing management
 * Features:
 * - Usage tracking and billing
 * - Plan management
 * - Stripe integration
 * - Invoice generation
 * - Usage analytics
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { BillingService } from "../services/billing.ts";
import { StripeService } from "../services/stripe.ts";
import { WebhookHandlerService } from "../services/webhook-handler.ts";
// Error classes
class ValidationError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
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

export const billingRoutes = new Router();

let dbService: DatabaseService;
let billingService: BillingService;
let stripeService: StripeService;
let webhookHandler: WebhookHandlerService;

export function initializeBillingServices(db: DatabaseService) {
  dbService = db;
  stripeService = new StripeService();
  billingService = new BillingService(dbService, stripeService);
  webhookHandler = new WebhookHandlerService(dbService, stripeService);
}

// Plan configurations
const PLAN_CONFIGS = {
  community: {
    name: 'Community',
    price: 0,
    currency: 'BRL',
    requests_limit: 10000,
    features: ['Basic fraud detection', 'Community threat sharing', 'Standard support'],
    billing_cycle: 'monthly'
  },
  smart: {
    name: 'Smart',
    price: 0.05, // per request
    currency: 'BRL',
    requests_limit: 100000,
    features: ['Advanced fraud detection', 'Edge processing', 'Behavioral biometrics', 'Priority support'],
    billing_cycle: 'usage'
  },
  enterprise: {
    name: 'Enterprise',
    price: 0.02, // per request
    currency: 'BRL',
    requests_limit: 1000000,
    features: ['All Smart features', 'Custom models', 'Dedicated support', 'SLA guarantee'],
    billing_cycle: 'usage'
  },
  insurance: {
    name: 'Insurance',
    price: 0.01, // 1% of transaction value
    currency: 'BRL',
    requests_limit: 500000,
    features: ['All Enterprise features', 'Insurance guarantee', 'Fraud reimbursement'],
    billing_cycle: 'percentage'
  }
};

/**
 * GET /api/v1/billing/usage
 * Get current billing period usage with enhanced billing service
 */
billingRoutes.get("/usage", async (ctx: Context) => {
  try {
    const user = ctx.state.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    // Get comprehensive billing dashboard data
    const dashboard = await billingService.getBillingDashboard(user.id);
    
    ctx.response.body = {
      success: true,
      data: {
        billing_period: {
          start: dashboard.usage.period_start,
          end: dashboard.usage.period_end
        },
        plan: {
          name: dashboard.plan_details?.name,
          type: dashboard.user.plan,
          billing_cycle: dashboard.plan_details?.billing_interval,
          included_requests: dashboard.plan_details?.included_requests,
          overage_rate: dashboard.plan_details?.overage_rate
        },
        usage: {
          current_requests: dashboard.usage.current_usage,
          limit: dashboard.usage.usage_limit,
          usage_percentage: Math.round((dashboard.usage.current_usage / dashboard.usage.usage_limit) * 100),
          overage_count: dashboard.usage.overage,
          overage_cost: dashboard.usage.overage * (dashboard.plan_details?.overage_rate || 0)
        },
        subscription: dashboard.subscription,
        billing_stats: dashboard.billing_stats,
        recent_invoices: dashboard.recent_invoices
      }
    };
  } catch (error) {
    console.error("Error fetching billing usage:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: "Failed to fetch usage data",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/billing/plans
 * Get available subscription plans
 */
billingRoutes.get("/plans", async (ctx: Context) => {
  const plans = Object.entries(PLAN_CONFIGS).map(([key, config]) => ({
    id: key,
    name: config.name,
    price: config.price,
    currency: config.currency,
    billing_cycle: config.billing_cycle,
    requests_limit: config.requests_limit,
    features: config.features,
    recommended: key === 'smart' // Mark Smart as recommended
  }));

  ctx.response.body = {
    plans,
    current_plan: ctx.user?.plan || 'community'
  };
});

/**
 * POST /api/v1/billing/upgrade
 * Upgrade subscription plan using billing service
 */
billingRoutes.post("/upgrade", async (ctx: Context) => {
  try {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    validateRequired(requestBody, ['plan']);
    validateTypes(requestBody, { plan: 'string' });

    const user = ctx.state.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    const newPlan = requestBody.plan;

    // Use billing service to handle upgrade
    const result = await billingService.upgradePlan(user.id, newPlan);

    console.log(`User ${user.email} upgraded from ${user.plan} to ${newPlan}`);

    ctx.response.body = {
      success: true,
      message: "Plan upgraded successfully",
      data: {
        subscription: result.subscription,
        proration: result.proration,
        new_plan: newPlan
      }
    };

  } catch (error) {
    console.error("Error upgrading plan:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: "Failed to upgrade plan",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/billing/webhook
 * Handle Stripe webhook events
 */
billingRoutes.post("/webhook", async (ctx: Context) => {
  try {
    const signature = ctx.request.headers.get("stripe-signature");
    if (!signature) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing stripe-signature header" };
      return;
    }

    const payload = await ctx.request.body({ type: "text" }).value;
    
    // Process webhook using webhook handler service
    const result = await webhookHandler.processWebhook(payload, signature);

    ctx.response.body = {
      received: true,
      processed: result.processed,
      message: result.message
    };

    if (!result.processed && result.error) {
      ctx.response.status = 400;
      ctx.response.body.error = result.error;
    }

  } catch (error) {
    console.error("Webhook processing error:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      received: false,
      error: "Webhook processing failed"
    };
  }
});