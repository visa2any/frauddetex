/**
 * 🗄️ FraudDetex - Database Service
 * 
 * PostgreSQL database service with comprehensive schema
 * for fraud detection, user management, and analytics
 */

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface User {
  id: string;
  email: string;
  password_hash: string;
  company_name?: string;
  api_key: string;
  plan: 'community' | 'smart' | 'enterprise' | 'insurance';
  usage_count: number;
  usage_limit: number;
  stripe_customer_id?: string;
  current_period_start?: Date;
  current_period_end?: Date;
  subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  email_verified: boolean;
  verification_token?: string;
}

export interface FraudTransaction {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  fraud_score: number;
  decision: 'approve' | 'reject' | 'review';
  confidence: number;
  processing_time_ms: number;
  features: Record<string, any>;
  behavioral_data?: Record<string, any>;
  explanation: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  model_type: 'fraud_detection' | 'behavioral' | 'community';
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  model_path: string;
  is_active: boolean;
  training_data_size: number;
  features: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CommunityThreat {
  id: string;
  reporter_id: string;
  threat_hash: string;
  threat_type: 'ip' | 'email' | 'pattern' | 'behavioral';
  threat_data: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  verified_count: number;
  false_positive_count: number;
  created_at: Date;
  expires_at: Date;
}

export interface BehavioralProfile {
  id: string;
  user_id: string;
  device_fingerprint: string;
  mouse_patterns: Record<string, any>;
  keyboard_patterns: Record<string, any>;
  interaction_patterns: Record<string, any>;
  risk_score: number;
  last_updated: Date;
  created_at: Date;
}

export interface APIUsageLog {
  id: string;
  user_id: string;
  endpoint: string;
  method: string;
  response_time_ms: number;
  status_code: number;
  ip_address: string;
  user_agent: string;
  request_size: number;
  response_size: number;
  created_at: Date;
}

export interface BillingTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_transaction_id?: string;
  description: string;
  usage_count: number;
  created_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  trial_end?: Date;
  quantity: number;
  unit_amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface UsageMeter {
  id: string;
  user_id: string;
  subscription_id?: string;
  period_start: Date;
  period_end: Date;
  usage_count: number;
  billed_usage: number;
  overage_amount: number;
  status: 'active' | 'billed' | 'pending';
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  stripe_invoice_id?: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  period_start: Date;
  period_end: Date;
  due_date: Date;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  type: 'card' | 'pix' | 'boleto';
  last4?: string;
  brand?: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export class DatabaseService {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    const databaseUrl = env.DATABASE_URL;
    
    if (databaseUrl) {
      // Parse DATABASE_URL
      const url = new URL(databaseUrl);
      this.client = new Client({
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        hostname: url.hostname,
        port: parseInt(url.port) || 5432,
      });
    } else {
      // Use individual environment variables
      this.client = new Client({
        user: env.DB_USER || "fraud_user",
        password: env.DB_PASSWORD || "secure_password_123",
        database: env.DB_NAME || "frauddetex",
        hostname: env.DB_HOST || "localhost",
        port: parseInt(env.DB_PORT || "5432"),
      });
    }
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  async close(): Promise<void> {
    if (this.connected) {
      await this.client.end();
      this.connected = false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.queryObject("SELECT 1 as health");
      return result.rows.length > 0;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  // Database Migration
  async migrate(): Promise<void> {
    const migrations = [
      this.createUsersTable(),
      this.createFraudTransactionsTable(),
      this.createMLModelsTable(),
      this.createCommunityThreatsTable(),
      this.createBehavioralProfilesTable(),
      this.createAPIUsageLogsTable(),
      this.createBillingTransactionsTable(),
      this.createSubscriptionsTable(),
      this.createUsageMetersTable(),
      this.createInvoicesTable(),
      this.createPaymentMethodsTable(),
      this.createIndexes(),
    ];

    for (const migration of migrations) {
      try {
        await migration;
        console.log("✅ Migration completed");
      } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
      }
    }
  }

  private async createUsersTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        company_name VARCHAR(255),
        api_key VARCHAR(255) UNIQUE NOT NULL,
        plan VARCHAR(50) DEFAULT 'community' CHECK (plan IN ('community', 'smart', 'enterprise', 'insurance')),
        usage_count INTEGER DEFAULT 0,
        usage_limit INTEGER DEFAULT 10000,
        stripe_customer_id VARCHAR(255),
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        subscription_status VARCHAR(50) CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createFraudTransactionsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS fraud_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        transaction_id VARCHAR(255) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        fraud_score DECIMAL(5,2) NOT NULL CHECK (fraud_score >= 0 AND fraud_score <= 100),
        decision VARCHAR(20) NOT NULL CHECK (decision IN ('approve', 'reject', 'review')),
        confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
        processing_time_ms INTEGER NOT NULL,
        features JSONB NOT NULL,
        behavioral_data JSONB,
        explanation JSONB NOT NULL,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createMLModelsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS ml_models (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        version VARCHAR(50) NOT NULL,
        model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('fraud_detection', 'behavioral', 'community')),
        accuracy DECIMAL(5,4) NOT NULL,
        precision DECIMAL(5,4) NOT NULL,
        recall DECIMAL(5,4) NOT NULL,
        f1_score DECIMAL(5,4) NOT NULL,
        model_path TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false,
        training_data_size INTEGER NOT NULL,
        features TEXT[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(name, version)
      )
    `);
  }

  private async createCommunityThreatsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS community_threats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
        threat_hash VARCHAR(64) UNIQUE NOT NULL,
        threat_type VARCHAR(50) NOT NULL CHECK (threat_type IN ('ip', 'email', 'pattern', 'behavioral')),
        threat_data JSONB NOT NULL,
        severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
        verified_count INTEGER DEFAULT 0,
        false_positive_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
  }

  private async createBehavioralProfilesTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS behavioral_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        device_fingerprint VARCHAR(255) NOT NULL,
        mouse_patterns JSONB NOT NULL,
        keyboard_patterns JSONB NOT NULL,
        interaction_patterns JSONB NOT NULL,
        risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, device_fingerprint)
      )
    `);
  }

  private async createAPIUsageLogsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS api_usage_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        response_time_ms INTEGER NOT NULL,
        status_code INTEGER NOT NULL,
        ip_address INET,
        user_agent TEXT,
        request_size INTEGER DEFAULT 0,
        response_size INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createBillingTransactionsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS billing_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        stripe_transaction_id VARCHAR(255),
        description TEXT NOT NULL,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createSubscriptionsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        stripe_customer_id VARCHAR(255),
        plan_id VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
        current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        cancel_at_period_end BOOLEAN DEFAULT false,
        trial_end TIMESTAMP WITH TIME ZONE,
        quantity INTEGER DEFAULT 1,
        unit_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createUsageMetersTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS usage_meters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
        period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        usage_count INTEGER DEFAULT 0,
        billed_usage INTEGER DEFAULT 0,
        overage_amount DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'billed', 'pending')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createInvoicesTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
        stripe_invoice_id VARCHAR(255) UNIQUE,
        amount_due DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
        period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        pdf_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createPaymentMethodsTable(): Promise<void> {
    await this.client.queryObject(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stripe_payment_method_id VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'pix', 'boleto')),
        last4 VARCHAR(4),
        brand VARCHAR(20),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  private async createIndexes(): Promise<void> {
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
      "CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key)",
      "CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)",
      "CREATE INDEX IF NOT EXISTS idx_fraud_transactions_user_id ON fraud_transactions(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_fraud_transactions_created_at ON fraud_transactions(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_fraud_transactions_fraud_score ON fraud_transactions(fraud_score)",
      "CREATE INDEX IF NOT EXISTS idx_ml_models_active ON ml_models(is_active)",
      "CREATE INDEX IF NOT EXISTS idx_community_threats_hash ON community_threats(threat_hash)",
      "CREATE INDEX IF NOT EXISTS idx_community_threats_type ON community_threats(threat_type)",
      "CREATE INDEX IF NOT EXISTS idx_behavioral_profiles_user_device ON behavioral_profiles(user_id, device_fingerprint)",
      "CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON api_usage_logs(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_billing_transactions_user_id ON billing_transactions(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id)",
      "CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)",
      "CREATE INDEX IF NOT EXISTS idx_usage_meters_user_id ON usage_meters(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_usage_meters_period ON usage_meters(period_start, period_end)",
      "CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_invoices_stripe_id ON invoices(stripe_invoice_id)",
      "CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status)",
      "CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id)",
    ];

    for (const index of indexes) {
      await this.client.queryObject(index);
    }
  }

  // User Management Methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const result = await this.client.queryObject<User>(`
      INSERT INTO users (email, password_hash, company_name, api_key, plan, usage_limit, is_active, email_verified, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      userData.email,
      userData.password_hash,
      userData.company_name,
      userData.api_key,
      userData.plan,
      userData.usage_limit,
      userData.is_active,
      userData.email_verified,
      userData.verification_token
    ]);
    
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.client.queryObject<User>(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );
    
    return result.rows[0] || null;
  }

  async getUserByApiKey(apiKey: string): Promise<User | null> {
    const result = await this.client.queryObject<User>(
      "SELECT * FROM users WHERE api_key = $1 AND is_active = true",
      [apiKey]
    );
    
    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.client.queryObject<User>(
      "SELECT * FROM users WHERE id = $1 AND is_active = true",
      [id]
    );
    
    return result.rows[0] || null;
  }

  async updateUserUsage(userId: string, increment: number): Promise<void> {
    await this.client.queryObject(`
      UPDATE users 
      SET usage_count = usage_count + $1, updated_at = NOW()
      WHERE id = $2
    `, [increment, userId]);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [userId, ...Object.values(updates)];
    
    const result = await this.client.queryObject<User>(`
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, values);
    
    return result.rows[0] || null;
  }

  // Fraud Transaction Methods
  async createFraudTransaction(transactionData: Omit<FraudTransaction, 'id' | 'created_at'>): Promise<FraudTransaction> {
    const result = await this.client.queryObject<FraudTransaction>(`
      INSERT INTO fraud_transactions (
        user_id, transaction_id, amount, currency, fraud_score, decision, 
        confidence, processing_time_ms, features, behavioral_data, 
        explanation, ip_address, user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      transactionData.user_id,
      transactionData.transaction_id,
      transactionData.amount,
      transactionData.currency,
      transactionData.fraud_score,
      transactionData.decision,
      transactionData.confidence,
      transactionData.processing_time_ms,
      JSON.stringify(transactionData.features),
      JSON.stringify(transactionData.behavioral_data),
      JSON.stringify(transactionData.explanation),
      transactionData.ip_address,
      transactionData.user_agent
    ]);
    
    return result.rows[0];
  }

  async getFraudTransactionsByUser(userId: string, limit = 100, offset = 0): Promise<FraudTransaction[]> {
    const result = await this.client.queryObject<FraudTransaction>(`
      SELECT * FROM fraud_transactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    
    return result.rows;
  }

  // Analytics Methods
  async getFraudStats(userId?: string, days = 30): Promise<any> {
    const whereClause = userId ? "WHERE user_id = $2 AND" : "WHERE";
    const params = userId ? [days, userId] : [days];
    
    const result = await this.client.queryObject(`
      SELECT 
        COUNT(*) as total_transactions,
        AVG(fraud_score) as avg_fraud_score,
        SUM(CASE WHEN decision = 'approve' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN decision = 'reject' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN decision = 'review' THEN 1 ELSE 0 END) as under_review,
        AVG(processing_time_ms) as avg_processing_time
      FROM fraud_transactions 
      ${whereClause} created_at >= NOW() - INTERVAL '${days} days'
    `, userId ? [userId] : []);
    
    return result.rows[0];
  }

  async getHourlyStats(userId?: string, hours = 24): Promise<any[]> {
    const whereClause = userId ? "WHERE user_id = $2 AND" : "WHERE";
    const params = userId ? [hours, userId] : [hours];
    
    const result = await this.client.queryObject(`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as transaction_count,
        AVG(fraud_score) as avg_fraud_score,
        AVG(processing_time_ms) as avg_processing_time
      FROM fraud_transactions 
      ${whereClause} created_at >= NOW() - INTERVAL '${hours} hours'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `, userId ? [userId] : []);
    
    return result.rows;
  }

  // ML Model Methods
  async createMLModel(modelData: Omit<MLModel, 'id' | 'created_at' | 'updated_at'>): Promise<MLModel> {
    const result = await this.client.queryObject<MLModel>(`
      INSERT INTO ml_models (
        name, version, model_type, accuracy, precision, recall, f1_score,
        model_path, is_active, training_data_size, features
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      modelData.name,
      modelData.version,
      modelData.model_type,
      modelData.accuracy,
      modelData.precision,
      modelData.recall,
      modelData.f1_score,
      modelData.model_path,
      modelData.is_active,
      modelData.training_data_size,
      modelData.features
    ]);
    
    return result.rows[0];
  }

  async getActiveMLModel(modelType: string): Promise<MLModel | null> {
    const result = await this.client.queryObject<MLModel>(`
      SELECT * FROM ml_models 
      WHERE model_type = $1 AND is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [modelType]);
    
    return result.rows[0] || null;
  }

  // Community Threat Methods
  async createCommunityThreat(threatData: Omit<CommunityThreat, 'id' | 'created_at'>): Promise<CommunityThreat> {
    const result = await this.client.queryObject<CommunityThreat>(`
      INSERT INTO community_threats (
        reporter_id, threat_hash, threat_type, threat_data, severity,
        confidence, verified_count, false_positive_count, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      threatData.reporter_id,
      threatData.threat_hash,
      threatData.threat_type,
      JSON.stringify(threatData.threat_data),
      threatData.severity,
      threatData.confidence,
      threatData.verified_count,
      threatData.false_positive_count,
      threatData.expires_at
    ]);
    
    return result.rows[0];
  }

  async getThreatByHash(threatHash: string): Promise<CommunityThreat | null> {
    const result = await this.client.queryObject<CommunityThreat>(`
      SELECT * FROM community_threats 
      WHERE threat_hash = $1 AND expires_at > NOW()
    `, [threatHash]);
    
    return result.rows[0] || null;
  }

  // Behavioral Profile Methods
  async upsertBehavioralProfile(profileData: Omit<BehavioralProfile, 'id' | 'created_at' | 'last_updated'>): Promise<BehavioralProfile> {
    const result = await this.client.queryObject<BehavioralProfile>(`
      INSERT INTO behavioral_profiles (
        user_id, device_fingerprint, mouse_patterns, keyboard_patterns,
        interaction_patterns, risk_score
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, device_fingerprint)
      DO UPDATE SET
        mouse_patterns = $3,
        keyboard_patterns = $4,
        interaction_patterns = $5,
        risk_score = $6,
        last_updated = NOW()
      RETURNING *
    `, [
      profileData.user_id,
      profileData.device_fingerprint,
      JSON.stringify(profileData.mouse_patterns),
      JSON.stringify(profileData.keyboard_patterns),
      JSON.stringify(profileData.interaction_patterns),
      profileData.risk_score
    ]);
    
    return result.rows[0];
  }

  // API Usage Logging
  async logAPIUsage(logData: Omit<APIUsageLog, 'id' | 'created_at'>): Promise<void> {
    await this.client.queryObject(`
      INSERT INTO api_usage_logs (
        user_id, endpoint, method, response_time_ms, status_code,
        ip_address, user_agent, request_size, response_size
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      logData.user_id,
      logData.endpoint,
      logData.method,
      logData.response_time_ms,
      logData.status_code,
      logData.ip_address,
      logData.user_agent,
      logData.request_size,
      logData.response_size
    ]);
  }

  // Billing Methods
  async createBillingTransaction(billingData: Omit<BillingTransaction, 'id' | 'created_at'>): Promise<BillingTransaction> {
    const result = await this.client.queryObject<BillingTransaction>(`
      INSERT INTO billing_transactions (
        user_id, amount, currency, status, stripe_transaction_id,
        description, usage_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      billingData.user_id,
      billingData.amount,
      billingData.currency,
      billingData.status,
      billingData.stripe_transaction_id,
      billingData.description,
      billingData.usage_count
    ]);
    
    return result.rows[0];
  }

  // Subscription Methods
  async createSubscription(subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> {
    const result = await this.client.queryObject<Subscription>(`
      INSERT INTO subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id, plan_id, status,
        current_period_start, current_period_end, cancel_at_period_end,
        trial_end, quantity, unit_amount, currency
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      subscriptionData.user_id,
      subscriptionData.stripe_subscription_id,
      subscriptionData.stripe_customer_id,
      subscriptionData.plan_id,
      subscriptionData.status,
      subscriptionData.current_period_start,
      subscriptionData.current_period_end,
      subscriptionData.cancel_at_period_end,
      subscriptionData.trial_end,
      subscriptionData.quantity,
      subscriptionData.unit_amount,
      subscriptionData.currency
    ]);
    
    return result.rows[0];
  }

  async getSubscriptionByUser(userId: string): Promise<Subscription | null> {
    const result = await this.client.queryObject<Subscription>(`
      SELECT * FROM subscriptions 
      WHERE user_id = $1 AND status IN ('active', 'trialing', 'past_due')
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userId]);
    
    return result.rows[0] || null;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
    const result = await this.client.queryObject<Subscription>(`
      SELECT * FROM subscriptions 
      WHERE stripe_subscription_id = $1
    `, [stripeSubscriptionId]);
    
    return result.rows[0] || null;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [subscriptionId, ...Object.values(updates)];
    
    const result = await this.client.queryObject<Subscription>(`
      UPDATE subscriptions 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, values);
    
    return result.rows[0] || null;
  }

  // Usage Meter Methods
  async createUsageMeter(usageData: Omit<UsageMeter, 'id' | 'created_at' | 'updated_at'>): Promise<UsageMeter> {
    const result = await this.client.queryObject<UsageMeter>(`
      INSERT INTO usage_meters (
        user_id, subscription_id, period_start, period_end,
        usage_count, billed_usage, overage_amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      usageData.user_id,
      usageData.subscription_id,
      usageData.period_start,
      usageData.period_end,
      usageData.usage_count,
      usageData.billed_usage,
      usageData.overage_amount,
      usageData.status
    ]);
    
    return result.rows[0];
  }

  async getCurrentUsageMeter(userId: string): Promise<UsageMeter | null> {
    const result = await this.client.queryObject<UsageMeter>(`
      SELECT * FROM usage_meters 
      WHERE user_id = $1 AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userId]);
    
    return result.rows[0] || null;
  }

  async updateUsageMeter(meterId: string, usage: number): Promise<UsageMeter | null> {
    const result = await this.client.queryObject<UsageMeter>(`
      UPDATE usage_meters 
      SET usage_count = usage_count + $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [usage, meterId]);
    
    return result.rows[0] || null;
  }

  // Invoice Methods
  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const result = await this.client.queryObject<Invoice>(`
      INSERT INTO invoices (
        user_id, subscription_id, stripe_invoice_id, amount_due, amount_paid,
        currency, status, period_start, period_end, due_date, pdf_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      invoiceData.user_id,
      invoiceData.subscription_id,
      invoiceData.stripe_invoice_id,
      invoiceData.amount_due,
      invoiceData.amount_paid,
      invoiceData.currency,
      invoiceData.status,
      invoiceData.period_start,
      invoiceData.period_end,
      invoiceData.due_date,
      invoiceData.pdf_url
    ]);
    
    return result.rows[0];
  }

  async getInvoicesByUser(userId: string, limit = 20, offset = 0): Promise<Invoice[]> {
    const result = await this.client.queryObject<Invoice>(`
      SELECT * FROM invoices 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    
    return result.rows;
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    const result = await this.client.queryObject<Invoice>(`
      SELECT * FROM invoices 
      WHERE id = $1
    `, [invoiceId]);
    
    return result.rows[0] || null;
  }

  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [invoiceId, ...Object.values(updates)];
    
    const result = await this.client.queryObject<Invoice>(`
      UPDATE invoices 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, values);
    
    return result.rows[0] || null;
  }

  // Payment Method Methods
  async createPaymentMethod(paymentData: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentMethod> {
    const result = await this.client.queryObject<PaymentMethod>(`
      INSERT INTO payment_methods (
        user_id, stripe_payment_method_id, type, last4, brand, is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      paymentData.user_id,
      paymentData.stripe_payment_method_id,
      paymentData.type,
      paymentData.last4,
      paymentData.brand,
      paymentData.is_default
    ]);
    
    return result.rows[0];
  }

  async getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
    const result = await this.client.queryObject<PaymentMethod>(`
      SELECT * FROM payment_methods 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `, [userId]);
    
    return result.rows;
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    await this.client.queryObject(`
      UPDATE payment_methods 
      SET is_default = false 
      WHERE user_id = $1
    `, [userId]);
    
    await this.client.queryObject(`
      UPDATE payment_methods 
      SET is_default = true 
      WHERE id = $2 AND user_id = $1
    `, [userId, paymentMethodId]);
  }

  // Enhanced Billing Analytics
  async getBillingStats(userId?: string): Promise<any> {
    const whereClause = userId ? "WHERE user_id = $1" : "";
    const params = userId ? [userId] : [];
    
    const result = await this.client.queryObject(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END) as failed_amount,
        AVG(CASE WHEN status = 'completed' THEN amount END) as avg_transaction
      FROM billing_transactions 
      ${whereClause}
    `, params);
    
    return result.rows[0];
  }

  async getMonthlyRevenue(userId?: string, months = 12): Promise<any[]> {
    const whereClause = userId ? "WHERE user_id = $2 AND" : "WHERE";
    const params = userId ? [months, userId] : [months];
    
    const result = await this.client.queryObject(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as revenue,
        COUNT(*) as transactions
      FROM billing_transactions 
      ${whereClause} created_at >= NOW() - INTERVAL '${months} months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `, userId ? [userId] : []);
    
    return result.rows;
  }
}