#!/usr/bin/env -S deno run --allow-all

/**
 * 🛡️ FraudShield Revolutionary - Backend API
 * 
 * Main entry point for the Deno-based fraud detection API
 * Features:
 * - Real-time fraud detection
 * - Behavioral biometrics analysis
 * - ML model inference
 * - Community threat intelligence
 * - Edge computing integration
 */

import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

// Import middleware
import { authMiddleware, initializeAuthService } from "./middleware/auth.ts";
import { rateLimitMiddleware, initializeRateLimitService } from "./middleware/rateLimit.ts";
import { loggingMiddleware } from "./middleware/logging.ts";
import { errorMiddleware } from "./middleware/error.ts";
import { securityStack } from "./middleware/security.ts";
import { securityConfig, validateSecurityEnvironment } from "./config/security.ts";

// Import routes
import { authRoutes } from "./routes/auth.ts";
import { fraudRoutes } from "./routes/fraud.ts";
import { mlRoutes } from "./routes/ml.ts";
import { userRoutes } from "./routes/user.ts";
import { analyticsRoutes } from "./routes/analytics.ts";
import { billingRoutes } from "./routes/billing.ts";
import { communityRoutes } from "./routes/community.ts";
import { healthRoutes } from "./routes/health.ts";

// Import database
import { DatabaseService } from "./services/database.ts";
import { MLService } from "./services/ml.ts";
import { RedisService } from "./services/redis.ts";

// Load environment variables
const env = await load();

const app = new Application();
const router = new Router();

// Initialize services
const db = new DatabaseService();
const ml = new MLService();
const redis = new RedisService();

// Global middleware - Order matters for security
app.use(errorMiddleware);

// Security stack (WAF, CSRF, etc.)
for (const securityMiddleware of securityStack) {
  app.use(securityMiddleware);
}

// Logging after security checks
app.use(loggingMiddleware);

// CORS with security config
app.use(oakCors({
  origin: securityConfig.cors.allowedOrigins,
  methods: securityConfig.cors.allowedMethods,
  allowedHeaders: securityConfig.cors.allowedHeaders,
  exposedHeaders: securityConfig.cors.exposedHeaders,
  credentials: securityConfig.cors.credentials,
}));

// Rate limiting
app.use(rateLimitMiddleware);

// API versioning
const apiV1 = new Router({ prefix: "/api/v1" });

// Health check (no auth required)
apiV1.use("/health", healthRoutes.routes());

// Authentication routes (no auth required)
apiV1.use("/auth", authRoutes.routes());

// Protected routes (require authentication)
apiV1.use(authMiddleware);
apiV1.use("/fraud", fraudRoutes.routes());
apiV1.use("/ml", mlRoutes.routes());
apiV1.use("/user", userRoutes.routes());
apiV1.use("/analytics", analyticsRoutes.routes());
apiV1.use("/billing", billingRoutes.routes());
apiV1.use("/community", communityRoutes.routes());

// Mount API routes
app.use(apiV1.routes());
app.use(apiV1.allowedMethods());

// Root route
router.get("/", (ctx: Context) => {
  ctx.response.body = {
    name: "FraudShield Revolutionary API",
    version: "1.0.0",
    status: "operational",
    features: [
      "Real-time fraud detection",
      "Behavioral biometrics",
      "Edge computing",
      "Community intelligence",
      "Explainable AI"
    ],
    endpoints: {
      health: "/api/v1/health",
      auth: "/api/v1/auth",
      fraud: "/api/v1/fraud",
      ml: "/api/v1/ml",
      analytics: "/api/v1/analytics",
      docs: "/api/v1/docs"
    }
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Initialize database and services
async function initializeServices() {
  try {
    console.log("🚀 Initializing FraudShield Revolutionary API...");
    
    // Validate security environment
    const securityValidation = validateSecurityEnvironment();
    if (!securityValidation.valid) {
      console.warn("⚠️ Security warnings:");
      securityValidation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    // Initialize database
    await db.connect();
    console.log("✅ Database connected");
    
    // Initialize Redis
    await redis.connect();
    console.log("✅ Redis connected");
    
    // Initialize auth service with database
    initializeAuthService(db);
    console.log("✅ Authentication service initialized");
    
    // Initialize rate limiting with Redis
    initializeRateLimitService(redis);
    console.log("✅ Rate limiting service initialized");
    
    // Initialize ML service
    await ml.initialize();
    console.log("✅ ML service initialized");
    
    // Run database migrations
    await db.migrate();
    console.log("✅ Database migrations completed");
    
    // Health check all services
    const healthChecks = await Promise.all([
      db.healthCheck(),
      redis.healthCheck(),
      ml.healthCheck()
    ]);
    
    if (healthChecks.every(check => check)) {
      console.log("✅ All health checks passed");
    } else {
      throw new Error("One or more health checks failed");
    }
    
    console.log("🛡️ FraudShield Revolutionary API ready!");
    console.log(`🔒 Security: ${securityValidation.valid ? 'Hardened' : 'Warnings present'}`);
    console.log(`🌐 Environment: ${env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    Deno.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log("🔄 Shutting down gracefully...");
  
  try {
    await db.close();
    await redis.close();
    console.log("✅ All services closed");
    Deno.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    Deno.exit(1);
  }
}

// Handle shutdown signals
Deno.addSignalListener("SIGTERM", gracefulShutdown);
Deno.addSignalListener("SIGINT", gracefulShutdown);

// Start server
const PORT = parseInt(env.API_PORT || "8000");
const HOST = env.API_HOST || "localhost";

await initializeServices();

console.log(`🚀 Server starting on http://${HOST}:${PORT}`);
await app.listen({ hostname: HOST, port: PORT });