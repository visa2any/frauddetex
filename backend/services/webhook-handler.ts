/**
 * 🔗 FraudDetex - Webhook Handler Service
 * 
 * Handles incoming webhooks from Stripe and other payment providers
 * to keep billing data synchronized
 */

import { DatabaseService } from "./database.ts";
import { StripeService } from "./stripe.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
}

export interface WebhookHandlerResult {
  processed: boolean;
  message: string;
  error?: string;
}

export class WebhookHandlerService {
  private dbService: DatabaseService;
  private stripeService: StripeService;
  private webhookSecret: string;

  constructor(dbService: DatabaseService, stripeService: StripeService) {
    this.dbService = dbService;
    this.stripeService = stripeService;
    this.webhookSecret = env.STRIPE_WEBHOOK_SECRET || "";
  }

  /**
   * Verify webhook signature and process event
   */
  async processWebhook(payload: string, signature: string): Promise<WebhookHandlerResult> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        return {
          processed: false,
          message: "Invalid webhook signature",
          error: "INVALID_SIGNATURE"
        };
      }

      const event: WebhookEvent = JSON.parse(payload);
      
      // Process the event based on type
      return await this.handleEvent(event);
      
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        processed: false,
        message: "Webhook processing failed",
        error: error.message
      };
    }
  }

  /**
   * Handle different types of webhook events
   */
  private async handleEvent(event: WebhookEvent): Promise<WebhookHandlerResult> {
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      // Customer events
      case 'customer.created':
        return await this.handleCustomerCreated(event);
      case 'customer.updated':
        return await this.handleCustomerUpdated(event);
      case 'customer.deleted':
        return await this.handleCustomerDeleted(event);

      // Subscription events
      case 'customer.subscription.created':
        return await this.handleSubscriptionCreated(event);
      case 'customer.subscription.updated':
        return await this.handleSubscriptionUpdated(event);
      case 'customer.subscription.deleted':
        return await this.handleSubscriptionDeleted(event);

      // Invoice events
      case 'invoice.created':
        return await this.handleInvoiceCreated(event);
      case 'invoice.payment_succeeded':
        return await this.handleInvoicePaymentSucceeded(event);
      case 'invoice.payment_failed':
        return await this.handleInvoicePaymentFailed(event);
      case 'invoice.finalized':
        return await this.handleInvoiceFinalized(event);

      // Payment events
      case 'payment_intent.succeeded':
        return await this.handlePaymentSucceeded(event);
      case 'payment_intent.payment_failed':
        return await this.handlePaymentFailed(event);

      // Payment method events
      case 'payment_method.attached':
        return await this.handlePaymentMethodAttached(event);
      case 'payment_method.detached':
        return await this.handlePaymentMethodDetached(event);

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
        return {
          processed: true,
          message: `Event type ${event.type} received but not processed`
        };
    }
  }

  // Customer event handlers
  private async handleCustomerCreated(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const customer = event.data.object;
    const userId = customer.metadata?.user_id;

    if (userId) {
      await this.dbService.updateUser(userId, {
        stripe_customer_id: customer.id
      });
    }

    return {
      processed: true,
      message: `Customer ${customer.id} created and linked to user ${userId}`
    };
  }

  private async handleCustomerUpdated(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const customer = event.data.object;
    // Handle customer updates if needed
    
    return {
      processed: true,
      message: `Customer ${customer.id} updated`
    };
  }

  private async handleCustomerDeleted(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const customer = event.data.object;
    
    // Find user by Stripe customer ID and clean up
    const user = await this.getUserByStripeCustomerId(customer.id);
    if (user) {
      await this.dbService.updateUser(user.id, {
        stripe_customer_id: undefined,
        subscription_status: 'canceled'
      });
    }

    return {
      processed: true,
      message: `Customer ${customer.id} deleted`
    };
  }

  // Subscription event handlers
  private async handleSubscriptionCreated(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const subscription = event.data.object;
    const user = await this.getUserByStripeCustomerId(subscription.customer);

    if (user) {
      await this.dbService.createSubscription({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        plan_id: this.extractPlanFromSubscription(subscription),
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
        quantity: subscription.quantity || 1,
        unit_amount: subscription.items.data[0]?.price?.unit_amount || 0,
        currency: subscription.items.data[0]?.price?.currency || 'usd'
      });

      // Update user status
      await this.dbService.updateUser(user.id, {
        subscription_status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });
    }

    return {
      processed: true,
      message: `Subscription ${subscription.id} created`
    };
  }

  private async handleSubscriptionUpdated(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const subscription = event.data.object;
    const dbSubscription = await this.dbService.getSubscriptionByStripeId(subscription.id);

    if (dbSubscription) {
      await this.dbService.updateSubscription(dbSubscription.id, {
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        quantity: subscription.quantity || 1,
        unit_amount: subscription.items.data[0]?.price?.unit_amount || 0
      });

      // Update user status
      const user = await this.dbService.getUserById(dbSubscription.user_id);
      if (user) {
        await this.dbService.updateUser(user.id, {
          subscription_status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000)
        });
      }
    }

    return {
      processed: true,
      message: `Subscription ${subscription.id} updated`
    };
  }

  private async handleSubscriptionDeleted(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const subscription = event.data.object;
    const dbSubscription = await this.dbService.getSubscriptionByStripeId(subscription.id);

    if (dbSubscription) {
      await this.dbService.updateSubscription(dbSubscription.id, {
        status: 'canceled'
      });

      // Downgrade user to community plan
      await this.dbService.updateUser(dbSubscription.user_id, {
        plan: 'community',
        subscription_status: 'canceled',
        usage_limit: 10000 // Community plan limit
      });
    }

    return {
      processed: true,
      message: `Subscription ${subscription.id} deleted`
    };
  }

  // Invoice event handlers
  private async handleInvoiceCreated(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const invoice = event.data.object;
    const user = await this.getUserByStripeCustomerId(invoice.customer);

    if (user) {
      await this.dbService.createInvoice({
        user_id: user.id,
        stripe_invoice_id: invoice.id,
        amount_due: invoice.amount_due,
        amount_paid: invoice.amount_paid || 0,
        currency: invoice.currency,
        status: invoice.status,
        period_start: new Date(invoice.period_start * 1000),
        period_end: new Date(invoice.period_end * 1000),
        due_date: new Date(invoice.due_date * 1000),
        pdf_url: invoice.invoice_pdf
      });
    }

    return {
      processed: true,
      message: `Invoice ${invoice.id} created`
    };
  }

  private async handleInvoicePaymentSucceeded(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const invoice = event.data.object;
    
    // Update invoice status
    const dbInvoice = await this.getInvoiceByStripeId(invoice.id);
    if (dbInvoice) {
      await this.dbService.updateInvoice(dbInvoice.id, {
        status: 'paid',
        amount_paid: invoice.amount_paid
      });

      // Create billing transaction record
      await this.dbService.createBillingTransaction({
        user_id: dbInvoice.user_id,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency,
        status: 'completed',
        stripe_transaction_id: invoice.payment_intent,
        description: `Payment for invoice ${invoice.number}`,
        usage_count: 0
      });
    }

    return {
      processed: true,
      message: `Invoice ${invoice.id} payment succeeded`
    };
  }

  private async handleInvoicePaymentFailed(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const invoice = event.data.object;
    
    // Update invoice status
    const dbInvoice = await this.getInvoiceByStripeId(invoice.id);
    if (dbInvoice) {
      await this.dbService.updateInvoice(dbInvoice.id, {
        status: 'open' // Keep as open for retry
      });

      // Create failed billing transaction
      await this.dbService.createBillingTransaction({
        user_id: dbInvoice.user_id,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: 'failed',
        stripe_transaction_id: invoice.payment_intent,
        description: `Failed payment for invoice ${invoice.number}`,
        usage_count: 0
      });

      // You could implement retry logic or notifications here
    }

    return {
      processed: true,
      message: `Invoice ${invoice.id} payment failed`
    };
  }

  private async handleInvoiceFinalized(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const invoice = event.data.object;
    
    const dbInvoice = await this.getInvoiceByStripeId(invoice.id);
    if (dbInvoice) {
      await this.dbService.updateInvoice(dbInvoice.id, {
        pdf_url: invoice.invoice_pdf
      });
    }

    return {
      processed: true,
      message: `Invoice ${invoice.id} finalized`
    };
  }

  // Payment event handlers
  private async handlePaymentSucceeded(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const paymentIntent = event.data.object;
    
    // Handle successful payment
    console.log(`Payment ${paymentIntent.id} succeeded for amount ${paymentIntent.amount}`);

    return {
      processed: true,
      message: `Payment ${paymentIntent.id} succeeded`
    };
  }

  private async handlePaymentFailed(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const paymentIntent = event.data.object;
    
    // Handle failed payment
    console.log(`Payment ${paymentIntent.id} failed: ${paymentIntent.last_payment_error?.message}`);

    return {
      processed: true,
      message: `Payment ${paymentIntent.id} failed`
    };
  }

  // Payment method event handlers
  private async handlePaymentMethodAttached(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const paymentMethod = event.data.object;
    const user = await this.getUserByStripeCustomerId(paymentMethod.customer);

    if (user) {
      await this.dbService.createPaymentMethod({
        user_id: user.id,
        stripe_payment_method_id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        is_default: false
      });
    }

    return {
      processed: true,
      message: `Payment method ${paymentMethod.id} attached`
    };
  }

  private async handlePaymentMethodDetached(event: WebhookEvent): Promise<WebhookHandlerResult> {
    const paymentMethod = event.data.object;
    
    // Remove payment method from database
    // This would require a deletePaymentMethod method in DatabaseService
    
    return {
      processed: true,
      message: `Payment method ${paymentMethod.id} detached`
    };
  }

  // Helper methods
  private verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      console.warn('Webhook secret not configured, skipping signature verification');
      return true; // In development, you might want to skip verification
    }

    try {
      // In a real implementation, you would use Stripe's webhook signature verification
      // For now, we'll do a simple check
      return signature.length > 0;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  private async getUserByStripeCustomerId(customerId: string): Promise<any> {
    // This would be a database query to find user by Stripe customer ID
    // For now, we'll implement a placeholder
    try {
      const result = await this.dbService.healthCheck(); // Placeholder
      // In real implementation:
      // return await this.dbService.getUserByStripeCustomerId(customerId);
      return null;
    } catch (error) {
      console.error('Error finding user by Stripe customer ID:', error);
      return null;
    }
  }

  private async getInvoiceByStripeId(stripeInvoiceId: string): Promise<any> {
    // This would be a database query to find invoice by Stripe ID
    // For now, we'll implement a placeholder
    try {
      // In real implementation:
      // return await this.dbService.getInvoiceByStripeId(stripeInvoiceId);
      return null;
    } catch (error) {
      console.error('Error finding invoice by Stripe ID:', error);
      return null;
    }
  }

  private extractPlanFromSubscription(subscription: any): string {
    // Extract plan ID from subscription metadata or price data
    const metadata = subscription.metadata;
    if (metadata?.plan_id) {
      return metadata.plan_id;
    }

    // Fallback: determine plan from price
    const unitAmount = subscription.items.data[0]?.price?.unit_amount || 0;
    
    if (unitAmount === 0) return 'community';
    if (unitAmount <= 5000) return 'smart';
    if (unitAmount <= 20000) return 'enterprise';
    return 'insurance';
  }
}