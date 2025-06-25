/**
 * 💳 FraudShield Revolutionary - Stripe Integration Service
 * 
 * Stripe payment processing integration
 * Features:
 * - Customer management
 * - Subscription handling
 * - Payment method management
 * - Invoice generation
 * - Webhook processing
 */

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  default_source?: string;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  plan: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

export interface StripeInvoice {
  id: string;
  customer: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  created: number;
  period_start: number;
  period_end: number;
  hosted_invoice_url: string;
  invoice_pdf: string;
}

export class StripeService {
  private apiKey: string;
  private baseUrl = 'https://api.stripe.com/v1';

  constructor() {
    this.apiKey = env.STRIPE_SECRET_KEY || 'sk_test_...';
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let body;
    if (data && method !== 'GET') {
      body = new URLSearchParams(data).toString();
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Stripe API error: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  // Customer Management
  async createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<StripeCustomer> {
    const data = {
      email,
      name,
      ...metadata && { metadata: JSON.stringify(metadata) }
    };

    return await this.makeRequest('/customers', 'POST', data);
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    return await this.makeRequest(`/customers/${customerId}`);
  }

  async updateCustomer(customerId: string, updates: Partial<StripeCustomer>): Promise<StripeCustomer> {
    return await this.makeRequest(`/customers/${customerId}`, 'POST', updates);
  }

  // Payment Methods
  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<any> {
    const data = {
      customer: customerId,
    };

    return await this.makeRequest(`/payment_methods/${paymentMethodId}/attach`, 'POST', data);
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<StripeCustomer> {
    const data = {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    };

    return await this.makeRequest(`/customers/${customerId}`, 'POST', data);
  }

  async listPaymentMethods(customerId: string): Promise<any> {
    return await this.makeRequest(`/payment_methods?customer=${customerId}&type=card`);
  }

  // Subscriptions
  async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>): Promise<StripeSubscription> {
    const data = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      ...metadata && { metadata: JSON.stringify(metadata) }
    };

    return await this.makeRequest('/subscriptions', 'POST', data);
  }

  async updateSubscription(subscriptionId: string, updates: any): Promise<StripeSubscription> {
    return await this.makeRequest(`/subscriptions/${subscriptionId}`, 'POST', updates);
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<StripeSubscription> {
    const endpoint = immediately 
      ? `/subscriptions/${subscriptionId}`
      : `/subscriptions/${subscriptionId}`;
    
    const data = immediately 
      ? {} 
      : { cancel_at_period_end: true };

    return await this.makeRequest(endpoint, immediately ? 'DELETE' : 'POST', data);
  }

  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    return await this.makeRequest(`/subscriptions/${subscriptionId}`);
  }

  // Usage-based billing
  async createUsageRecord(subscriptionItemId: string, quantity: number, timestamp?: number): Promise<any> {
    const data = {
      quantity,
      timestamp: timestamp || Math.floor(Date.now() / 1000),
    };

    return await this.makeRequest(`/subscription_items/${subscriptionItemId}/usage_records`, 'POST', data);
  }

  // Invoices
  async createInvoice(customerId: string, metadata?: Record<string, string>): Promise<StripeInvoice> {
    const data = {
      customer: customerId,
      auto_advance: true,
      ...metadata && { metadata: JSON.stringify(metadata) }
    };

    return await this.makeRequest('/invoices', 'POST', data);
  }

  async finalizeInvoice(invoiceId: string): Promise<StripeInvoice> {
    return await this.makeRequest(`/invoices/${invoiceId}/finalize`, 'POST');
  }

  async payInvoice(invoiceId: string): Promise<StripeInvoice> {
    return await this.makeRequest(`/invoices/${invoiceId}/pay`, 'POST');
  }

  async listInvoices(customerId: string, limit: number = 10): Promise<{ data: StripeInvoice[] }> {
    return await this.makeRequest(`/invoices?customer=${customerId}&limit=${limit}`);
  }

  // Products and Prices
  async createProduct(name: string, description: string, metadata?: Record<string, string>): Promise<any> {
    const data = {
      name,
      description,
      type: 'service',
      ...metadata && { metadata: JSON.stringify(metadata) }
    };

    return await this.makeRequest('/products', 'POST', data);
  }

  async createPrice(productId: string, unitAmount: number, currency: string = 'brl', recurring?: any): Promise<any> {
    const data = {
      product: productId,
      unit_amount: unitAmount,
      currency,
      ...recurring && { recurring }
    };

    return await this.makeRequest('/prices', 'POST', data);
  }

  // Payment Intents (for one-time payments)
  async createPaymentIntent(amount: number, currency: string = 'brl', customerId?: string, metadata?: Record<string, string>): Promise<any> {
    const data = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      ...customerId && { customer: customerId },
      ...metadata && { metadata: JSON.stringify(metadata) }
    };

    return await this.makeRequest('/payment_intents', 'POST', data);
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<any> {
    const data = {
      ...paymentMethodId && { payment_method: paymentMethodId }
    };

    return await this.makeRequest(`/payment_intents/${paymentIntentId}/confirm`, 'POST', data);
  }

  // Webhook helpers
  async constructWebhookEvent(payload: string, signature: string, endpointSecret: string): Promise<any> {
    // In a real implementation, you would verify the webhook signature
    // For now, we'll parse the JSON payload
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Invalid webhook payload');
    }
  }

  // Utility methods
  async createFraudShieldProducts(): Promise<{ products: any[], prices: any[] }> {
    const products = [];
    const prices = [];

    // Create FraudShield plans
    const plans = [
      {
        id: 'community',
        name: 'FraudShield Community',
        description: 'Basic fraud detection with community threat sharing',
        price: 0,
        recurring: { interval: 'month' }
      },
      {
        id: 'smart',
        name: 'FraudShield Smart',
        description: 'Advanced fraud detection with edge processing and behavioral biometrics',
        price: 5, // R$ 0.05 per request = 5 centavos
        recurring: null // Usage-based
      },
      {
        id: 'enterprise',
        name: 'FraudShield Enterprise',
        description: 'All Smart features plus custom models and dedicated support',
        price: 2, // R$ 0.02 per request = 2 centavos
        recurring: null // Usage-based
      },
      {
        id: 'insurance',
        name: 'FraudShield Insurance',
        description: 'All Enterprise features plus fraud insurance guarantee',
        price: 100, // 1% of transaction value
        recurring: null // Percentage-based
      }
    ];

    for (const plan of plans) {
      // Create product
      const product = await this.createProduct(
        plan.name,
        plan.description,
        { fraudshield_plan: plan.id }
      );
      products.push(product);

      // Create price
      if (plan.price > 0) {
        const priceData = plan.recurring 
          ? { // Monthly subscription
              product: product.id,
              unit_amount: plan.price * 100, // Convert to centavos
              currency: 'brl',
              recurring: plan.recurring
            }
          : { // Usage-based or one-time
              product: product.id,
              unit_amount: plan.price,
              currency: 'brl',
              billing_scheme: 'per_unit'
            };

        const price = await this.createPrice(
          product.id,
          priceData.unit_amount,
          priceData.currency,
          priceData.recurring
        );
        prices.push(price);
      }
    }

    return { products, prices };
  }

  // Calculate usage-based billing
  calculateUsageBilling(plan: string, requests: number, transactionValues?: number[]): number {
    switch (plan) {
      case 'smart':
        return requests * 0.05; // R$ 0.05 per request
      case 'enterprise':
        return requests * 0.02; // R$ 0.02 per request
      case 'insurance':
        if (transactionValues) {
          return transactionValues.reduce((sum, value) => sum + (value * 0.01), 0); // 1% of transaction value
        }
        return 0;
      case 'community':
      default:
        return 0; // Free plan
    }
  }

  // Customer portal
  async createCustomerPortalSession(customerId: string, returnUrl: string): Promise<any> {
    const data = {
      customer: customerId,
      return_url: returnUrl,
    };

    return await this.makeRequest('/billing_portal/sessions', 'POST', data);
  }
}