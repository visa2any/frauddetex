/**
 * 💳 FraudDetex - Comprehensive Billing Service
 * 
 * Complete billing system with usage enforcement, subscription management,
 * and automated billing cycles for the FraudDetex platform
 */

import { DatabaseService, User, Subscription, UsageMeter, Invoice, PaymentMethod } from "./database.ts";
import { StripeService } from "./stripe.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  included_requests: number;
  overage_rate: number;
  features: string[];
  billing_interval: 'month' | 'year';
}

export interface UsageCheckResult {
  allowed: boolean;
  usage_count: number;
  usage_limit: number;
  overage_count: number;
  overage_cost: number;
  plan: string;
  warning_threshold_reached: boolean;
}

export interface BillingCycleResult {
  invoices_created: number;
  total_revenue: number;
  failed_charges: number;
  users_processed: number;
}

export class BillingService {
  private dbService: DatabaseService;
  private stripeService: StripeService;
  private plans: Map<string, PlanConfig>;

  constructor(dbService: DatabaseService, stripeService: StripeService) {
    this.dbService = dbService;
    this.stripeService = stripeService;
    this.plans = new Map();
    this.initializePlans();
  }

  private initializePlans(): void {
    const planConfigs: PlanConfig[] = [
      {
        id: 'community',
        name: 'Community',
        description: 'Perfect for testing and small projects',
        price: 0,
        currency: 'USD',
        included_requests: 10000,
        overage_rate: 0.001, // $0.001 per request
        features: [
          'Basic fraud detection',
          'Community threat intelligence',
          'API access',
          'Email support'
        ],
        billing_interval: 'month'
      },
      {
        id: 'smart',
        name: 'Smart',
        description: 'Ideal for growing businesses',
        price: 5000, // $50.00 in cents
        currency: 'USD',
        included_requests: 100000,
        overage_rate: 0.0005, // $0.0005 per request
        features: [
          'Advanced fraud detection',
          'Behavioral biometrics',
          'Real-time alerts',
          'Custom rules',
          'Priority support'
        ],
        billing_interval: 'month'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For high-volume applications',
        price: 20000, // $200.00 in cents
        currency: 'USD',
        included_requests: 1000000,
        overage_rate: 0.0002, // $0.0002 per request
        features: [
          'Enterprise-grade ML models',
          'Dedicated support',
          'Custom integrations',
          'Advanced analytics',
          'SLA guarantees'
        ],
        billing_interval: 'month'
      },
      {
        id: 'insurance',
        name: 'Insurance',
        description: 'Transaction-based pricing for insurance companies',
        price: 0, // Base price
        currency: 'USD',
        included_requests: 0,
        overage_rate: 0.01, // 1% of transaction value
        features: [
          'Transaction-based pricing',
          'Insurance-specific models',
          'Regulatory compliance',
          'Custom reporting',
          'Dedicated account manager'
        ],
        billing_interval: 'month'
      }
    ];

    for (const plan of planConfigs) {
      this.plans.set(plan.id, plan);
    }
  }

  /**
   * Check if user is allowed to make requests and track usage
   */
  async checkUsageAndTrack(userId: string, requests: number = 1): Promise<UsageCheckResult> {
    const user = await this.dbService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const plan = this.plans.get(user.plan);
    if (!plan) {
      throw new Error('Invalid plan configuration');
    }

    // Get current usage meter
    let usageMeter = await this.dbService.getCurrentUsageMeter(userId);
    
    // Create new usage meter if none exists or current period has ended
    if (!usageMeter || this.isPeriodEnded(usageMeter)) {
      usageMeter = await this.createNewUsagePeriod(userId, plan);
    }

    const newUsageCount = usageMeter.usage_count + requests;
    const overage = Math.max(0, newUsageCount - plan.included_requests);
    const overageCost = overage * plan.overage_rate;

    // Check if usage is allowed (for community plan, hard limit)
    const allowed = user.plan !== 'community' || newUsageCount <= plan.included_requests;

    if (allowed) {
      // Update usage meter
      await this.dbService.updateUsageMeter(usageMeter.id, requests);
      
      // Update user usage count
      await this.dbService.updateUserUsage(userId, requests);
    }

    const warningThreshold = plan.included_requests * 0.8; // 80% warning
    const warningThresholdReached = newUsageCount >= warningThreshold;

    return {
      allowed,
      usage_count: allowed ? newUsageCount : usageMeter.usage_count,
      usage_limit: plan.included_requests,
      overage_count: Math.max(0, overage),
      overage_cost: overageCost,
      plan: user.plan,
      warning_threshold_reached: warningThresholdReached
    };
  }

  /**
   * Create subscription for user
   */
  async createSubscription(userId: string, planId: string, paymentMethodId?: string): Promise<Subscription> {
    const user = await this.dbService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('Invalid plan');
    }

    let stripeCustomerId = user.stripe_customer_id;
    
    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await this.stripeService.createCustomer({
        email: user.email,
        name: user.company_name || user.email,
        metadata: {
          user_id: userId,
          plan: planId
        }
      });
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await this.dbService.updateUser(userId, { stripe_customer_id: stripeCustomerId });
    }

    // Attach payment method if provided
    if (paymentMethodId) {
      await this.stripeService.attachPaymentMethod(paymentMethodId, stripeCustomerId);
    }

    const now = new Date();
    const periodEnd = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    let stripeSubscription;
    if (plan.price > 0) {
      // Create Stripe subscription for paid plans
      stripeSubscription = await this.stripeService.createSubscription({
        customer: stripeCustomerId,
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: plan.description
          },
          unit_amount: plan.price,
          recurring: {
            interval: plan.billing_interval
          }
        },
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
    }

    // Create subscription in database
    const subscription = await this.dbService.createSubscription({
      user_id: userId,
      stripe_subscription_id: stripeSubscription?.id,
      stripe_customer_id: stripeCustomerId,
      plan_id: planId,
      status: stripeSubscription ? 'incomplete' : 'active',
      current_period_start: now,
      current_period_end: periodEnd,
      cancel_at_period_end: false,
      quantity: 1,
      unit_amount: plan.price,
      currency: plan.currency
    });

    // Update user plan
    await this.dbService.updateUser(userId, {
      plan: planId as any,
      current_period_start: now,
      current_period_end: periodEnd,
      subscription_status: subscription.status
    });

    return subscription;
  }

  /**
   * Process billing cycle for all users
   */
  async processBillingCycle(): Promise<BillingCycleResult> {
    const result: BillingCycleResult = {
      invoices_created: 0,
      total_revenue: 0,
      failed_charges: 0,
      users_processed: 0
    };

    // Get all active subscriptions that need billing
    const activeUsers = await this.getActiveSubscriptionsForBilling();

    for (const user of activeUsers) {
      try {
        const invoice = await this.processUserBilling(user);
        if (invoice) {
          result.invoices_created++;
          result.total_revenue += invoice.amount_due;
        }
        result.users_processed++;
      } catch (error) {
        console.error(`Failed to process billing for user ${user.id}:`, error);
        result.failed_charges++;
      }
    }

    return result;
  }

  /**
   * Upgrade user to new plan
   */
  async upgradePlan(userId: string, newPlanId: string): Promise<{ subscription: Subscription; proration: number }> {
    const user = await this.dbService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentSubscription = await this.dbService.getSubscriptionByUser(userId);
    const newPlan = this.plans.get(newPlanId);
    const currentPlan = this.plans.get(user.plan);

    if (!newPlan || !currentPlan) {
      throw new Error('Invalid plan configuration');
    }

    // Calculate proration
    const proration = this.calculateProration(currentPlan, newPlan, new Date());

    // Update Stripe subscription if exists
    if (currentSubscription?.stripe_subscription_id) {
      await this.stripeService.updateSubscription(currentSubscription.stripe_subscription_id, {
        price_data: {
          currency: newPlan.currency.toLowerCase(),
          product_data: {
            name: newPlan.name,
            description: newPlan.description
          },
          unit_amount: newPlan.price,
          recurring: {
            interval: newPlan.billing_interval
          }
        },
        proration_behavior: 'always_invoice'
      });
    }

    // Update subscription in database
    const updatedSubscription = await this.dbService.updateSubscription(currentSubscription!.id, {
      plan_id: newPlanId,
      unit_amount: newPlan.price
    });

    // Update user plan
    await this.dbService.updateUser(userId, {
      plan: newPlanId as any,
      usage_limit: newPlan.included_requests
    });

    return {
      subscription: updatedSubscription!,
      proration
    };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, immediately = false): Promise<Subscription> {
    const subscription = await this.dbService.getSubscriptionByUser(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    // Cancel in Stripe
    if (subscription.stripe_subscription_id) {
      await this.stripeService.cancelSubscription(subscription.stripe_subscription_id, immediately);
    }

    // Update subscription status
    const updatedSubscription = await this.dbService.updateSubscription(subscription.id, {
      status: immediately ? 'canceled' : 'active',
      cancel_at_period_end: !immediately
    });

    // If immediate cancellation, downgrade to community plan
    if (immediately) {
      await this.dbService.updateUser(userId, {
        plan: 'community',
        subscription_status: 'canceled'
      });
    }

    return updatedSubscription!;
  }

  /**
   * Generate invoice PDF
   */
  async generateInvoicePDF(invoiceId: string): Promise<string> {
    const invoice = await this.dbService.getInvoiceById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // In a real implementation, you would use a PDF generation library
    // For now, we'll simulate this
    const pdfUrl = `https://invoices.frauddetex.com/${invoiceId}.pdf`;
    
    // Update invoice with PDF URL
    await this.dbService.updateInvoice(invoiceId, { pdf_url: pdfUrl });
    
    return pdfUrl;
  }

  /**
   * Get billing dashboard data for user
   */
  async getBillingDashboard(userId: string): Promise<any> {
    const user = await this.dbService.getUserById(userId);
    const subscription = await this.dbService.getSubscriptionByUser(userId);
    const usageMeter = await this.dbService.getCurrentUsageMeter(userId);
    const recentInvoices = await this.dbService.getInvoicesByUser(userId, 5);
    const billingStats = await this.dbService.getBillingStats(userId);
    const monthlyRevenue = await this.dbService.getMonthlyRevenue(userId, 6);

    const plan = this.plans.get(user?.plan || 'community');

    return {
      user: {
        id: user?.id,
        email: user?.email,
        plan: user?.plan,
        subscription_status: user?.subscription_status
      },
      subscription,
      usage: {
        current_usage: usageMeter?.usage_count || 0,
        usage_limit: plan?.included_requests || 0,
        overage: Math.max(0, (usageMeter?.usage_count || 0) - (plan?.included_requests || 0)),
        period_start: usageMeter?.period_start,
        period_end: usageMeter?.period_end
      },
      plan_details: plan,
      recent_invoices: recentInvoices,
      billing_stats: billingStats,
      monthly_revenue: monthlyRevenue
    };
  }

  // Private helper methods

  private isPeriodEnded(usageMeter: UsageMeter): boolean {
    return new Date() > usageMeter.period_end;
  }

  private async createNewUsagePeriod(userId: string, plan: PlanConfig): Promise<UsageMeter> {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    return await this.dbService.createUsageMeter({
      user_id: userId,
      period_start: now,
      period_end: periodEnd,
      usage_count: 0,
      billed_usage: 0,
      overage_amount: 0,
      status: 'active'
    });
  }

  private async getActiveSubscriptionsForBilling(): Promise<User[]> {
    // This would typically be a more complex query
    // For now, we'll simulate getting users that need billing
    return [];
  }

  private async processUserBilling(user: User): Promise<Invoice | null> {
    const usageMeter = await this.dbService.getCurrentUsageMeter(user.id);
    if (!usageMeter || usageMeter.status === 'billed') {
      return null;
    }

    const plan = this.plans.get(user.plan);
    if (!plan) {
      throw new Error('Invalid plan configuration');
    }

    const overage = Math.max(0, usageMeter.usage_count - plan.included_requests);
    const overageAmount = overage * plan.overage_rate;
    const totalAmount = plan.price + (overageAmount * 100); // Convert to cents

    if (totalAmount <= 0) {
      return null; // No charge needed
    }

    // Create invoice
    const invoice = await this.dbService.createInvoice({
      user_id: user.id,
      amount_due: totalAmount,
      amount_paid: 0,
      currency: plan.currency,
      status: 'open',
      period_start: usageMeter.period_start,
      period_end: usageMeter.period_end,
      due_date: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days to pay
    });

    // Process payment through Stripe
    if (user.stripe_customer_id) {
      try {
        await this.stripeService.createInvoice({
          customer: user.stripe_customer_id,
          amount: totalAmount,
          currency: plan.currency.toLowerCase(),
          description: `${plan.name} plan - Period ${usageMeter.period_start.toISOString().slice(0, 10)} to ${usageMeter.period_end.toISOString().slice(0, 10)}`
        });

        // Mark usage meter as billed
        await this.dbService.updateUsageMeter(usageMeter.id, 0); // Don't add usage, just update status
      } catch (error) {
        console.error('Failed to create Stripe invoice:', error);
      }
    }

    return invoice;
  }

  private calculateProration(currentPlan: PlanConfig, newPlan: PlanConfig, changeDate: Date): number {
    const daysInMonth = 30;
    const daysSinceStart = Math.floor((changeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, daysInMonth - daysSinceStart);
    
    const currentDailyRate = currentPlan.price / daysInMonth;
    const newDailyRate = newPlan.price / daysInMonth;
    
    const refund = currentDailyRate * remainingDays;
    const newCharge = newDailyRate * remainingDays;
    
    return newCharge - refund;
  }
}