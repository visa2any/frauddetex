#!/usr/bin/env -S deno run --allow-all

/**
 * 🚀 FraudShield Revolutionary - Backend Setup Script
 * 
 * Initializes the backend system with all required services
 */

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { DatabaseService } from "./services/database.ts";
import { RedisService } from "./services/redis.ts";
import { MLService } from "./services/ml.ts";

console.log("🛡️ FraudShield Revolutionary - Backend Setup");
console.log("=" * 50);

// Load environment variables
const env = await load();

async function setupDatabase() {
  console.log("📊 Setting up PostgreSQL database...");
  
  const db = new DatabaseService();
  
  try {
    await db.connect();
    console.log("✅ Database connection established");
    
    await db.migrate();
    console.log("✅ Database migrations completed");
    
    // Create demo user
    try {
      const demoUser = await db.createUser({
        email: "demo@fraudshield.dev",
        password_hash: "hashed_demo_password_123",
        company_name: "FraudShield Demo",
        api_key: "fs_demo_key_123456789abcdef",
        plan: "smart",
        usage_count: 0,
        usage_limit: 100000,
        is_active: true
      });
      
      console.log("✅ Demo user created:", demoUser.email);
    } catch (error) {
      if (error.message?.includes('duplicate key')) {
        console.log("ℹ️  Demo user already exists");
      } else {
        throw error;
      }
    }
    
    // Create sample ML model
    try {
      const mlModel = await db.createMLModel({
        name: "Fraud Detection Model",
        version: "1.0.0",
        model_type: "fraud_detection",
        accuracy: 95.7,
        precision: 94.2,
        recall: 91.8,
        f1_score: 93.0,
        training_data_size: 1000000,
        features: [
          "amount", "transaction_hour", "user_age_days",
          "ip_reputation_score", "velocity_score", "behavioral_anomaly"
        ],
        model_path: "/models/fraud_detection_v1.pkl",
        is_active: true
      });
      
      console.log("✅ Sample ML model created:", mlModel.name);
    } catch (error) {
      if (error.message?.includes('duplicate key')) {
        console.log("ℹ️  Sample ML model already exists");
      } else {
        throw error;
      }
    }
    
    await db.close();
    
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    throw error;
  }
}

async function setupRedis() {
  console.log("🔴 Setting up Redis cache...");
  
  const redis = new RedisService();
  
  try {
    await redis.connect();
    console.log("✅ Redis connection established");
    
    // Test cache operations
    await redis.setSession("test_session", { test: true }, 60);
    const testSession = await redis.getSession("test_session");
    
    if (testSession?.test) {
      console.log("✅ Redis cache operations working");
    }
    
    // Initialize metrics
    await redis.incrementMetric("setup_completed", 1);
    console.log("✅ Redis metrics initialized");
    
    await redis.close();
    
  } catch (error) {
    console.error("❌ Redis setup failed:", error.message);
    throw error;
  }
}

async function setupMLService() {
  console.log("🤖 Setting up ML service...");
  
  const ml = new MLService();
  
  try {
    await ml.initialize();
    console.log("✅ ML service initialized");
    
    // Test prediction
    const testFeatures = {
      amount: 100,
      transaction_hour: 14,
      transaction_day_of_week: 1,
      merchant_category: "test",
      payment_method: "card",
      user_age_days: 30,
      transactions_last_24h: 2,
      avg_transaction_amount: 75,
      velocity_score: 25,
      device_fingerprint: "test_device",
      ip_reputation_score: 85,
      geolocation_risk: 15,
      is_vpn: false
    };
    
    const prediction = await ml.predictFraud(testFeatures);
    console.log("✅ ML prediction test successful:", {
      fraud_score: prediction.fraud_score,
      decision: prediction.decision,
      processing_time: prediction.processing_time_ms + "ms"
    });
    
    const metrics = await ml.getModelMetrics();
    console.log("✅ ML metrics available:", {
      accuracy: metrics.accuracy + "%",
      precision: metrics.precision + "%",
      recall: metrics.recall + "%"
    });
    
  } catch (error) {
    console.error("❌ ML service setup failed:", error.message);
    throw error;
  }
}

async function createDirectories() {
  console.log("📁 Creating required directories...");
  
  const directories = [
    "./logs",
    "./models",
    "./data",
    "./temp",
    "./backups"
  ];
  
  for (const dir of directories) {
    try {
      await Deno.stat(dir);
      console.log(`ℹ️  Directory already exists: ${dir}`);
    } catch {
      await Deno.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }
}

async function validateEnvironment() {
  console.log("🔍 Validating environment configuration...");
  
  const requiredEnvVars = [
    "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME",
    "REDIS_URL", "JWT_SECRET", "API_PORT"
  ];
  
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!env[envVar] && !Deno.env.get(envVar)) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    console.warn("⚠️  Missing environment variables:", missing.join(", "));
    console.warn("ℹ️  Using default values for missing variables");
  } else {
    console.log("✅ All required environment variables present");
  }
  
  // Validate connectivity
  console.log("🔗 Testing external connectivity...");
  
  try {
    const response = await fetch("https://httpbin.org/status/200", {
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      console.log("✅ External connectivity available");
    }
  } catch {
    console.warn("⚠️  Limited external connectivity - some features may not work");
  }
}

async function displaySummary() {
  console.log("\n" + "=" * 50);
  console.log("🎉 FraudShield Backend Setup Complete!");
  console.log("=" * 50);
  
  console.log("\n📋 Setup Summary:");
  console.log("✅ PostgreSQL database configured and migrated");
  console.log("✅ Redis cache service initialized");
  console.log("✅ ML service ready for fraud detection");
  console.log("✅ Required directories created");
  console.log("✅ Demo data populated");
  
  console.log("\n🚀 Next Steps:");
  console.log("1. Start the API server:");
  console.log("   deno run --allow-all main.ts");
  console.log("\n2. Test the API:");
  console.log("   curl http://localhost:8000/api/v1/health");
  console.log("\n3. Use demo credentials:");
  console.log("   Email: demo@fraudshield.dev");
  console.log("   API Key: fs_demo_key_123456789abcdef");
  
  console.log("\n📚 Documentation:");
  console.log("   API Docs: http://localhost:8000/api/v1/");
  console.log("   Architecture: docs/ARCHITECTURE.md");
  console.log("   Deployment: docs/DEPLOYMENT.md");
  
  console.log("\n🛡️  FraudShield Revolutionary is ready to protect against fraud!");
}

// Main setup function
async function main() {
  try {
    await validateEnvironment();
    await createDirectories();
    await setupDatabase();
    await setupRedis();
    await setupMLService();
    await displaySummary();
    
  } catch (error) {
    console.error("\n💥 Setup failed:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("1. Check your .env file configuration");
    console.error("2. Ensure PostgreSQL and Redis are running");
    console.error("3. Verify network connectivity");
    console.error("4. Check the logs for detailed error information");
    
    Deno.exit(1);
  }
}

// Run setup if this file is executed directly
if (import.meta.main) {
  await main();
}