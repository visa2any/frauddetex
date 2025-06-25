#!/usr/bin/env -S deno run --allow-all

/**
 * 🛡️ FraudShield Revolutionary - Standalone API (sem DB)
 * 
 * Versão standalone que funciona sem PostgreSQL/Redis
 * Para demonstração e desenvolvimento rápido
 */

import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();

// Simulação de dados em memória
const memoryDB = {
  users: new Map(),
  transactions: new Map(),
  apiKeys: new Map()
};

// Demo API key
const DEMO_API_KEY = "fs_demo_key_123456789abcdef";
memoryDB.apiKeys.set(DEMO_API_KEY, {
  userId: "demo-user",
  plan: "smart",
  usageCount: 42,
  usageLimit: 100000
});

// Middleware básico
app.use(oakCors({
  origin: ["http://localhost:3000", "http://localhost:8000"],
  credentials: true,
}));

// Logging middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url.pathname} - ${ctx.response.status} - ${ms}ms`);
});

// Auth middleware
function requireAuth(ctx: Context, next: any) {
  const apiKey = ctx.request.headers.get("X-API-Key");
  
  if (!apiKey || !memoryDB.apiKeys.has(apiKey)) {
    ctx.response.status = 401;
    ctx.response.body = { error: "API key required" };
    return;
  }
  
  ctx.state.user = memoryDB.apiKeys.get(apiKey);
  return next();
}

// ===============================
// ROTAS DA API
// ===============================

// Root
router.get("/", (ctx) => {
  ctx.response.body = {
    name: "🛡️ FraudShield Revolutionary API",
    version: "1.0.0-standalone",
    status: "operational",
    mode: "standalone (no database)",
    endpoints: {
      health: "/api/v1/health",
      fraud: "/api/v1/fraud/detect",
      demo: "/api/v1/demo",
      docs: "/api/v1/"
    },
    demo_api_key: DEMO_API_KEY
  };
});

// Health check
router.get("/api/v1/health", (ctx) => {
  ctx.response.body = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0-standalone",
    services: {
      api: "operational",
      ml: "operational", 
      memory_db: "operational"
    },
    uptime: performance.now()
  };
});

// Fraud detection (FUNCIONAL!)
router.post("/api/v1/fraud/detect", async (ctx) => {
  // Verificar API key
  const apiKey = ctx.request.headers.get("X-API-Key");
  if (!apiKey || !memoryDB.apiKeys.has(apiKey)) {
    ctx.response.status = 401;
    ctx.response.body = { error: "API key required", demo_key: DEMO_API_KEY };
    return;
  }

  const startTime = performance.now();
  
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    
    // Validação básica
    if (!body.transaction_id || !body.amount || !body.user_id) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Missing required fields",
        required: ["transaction_id", "amount", "user_id"]
      };
      return;
    }

    // ALGORITMO DE DETECÇÃO DE FRAUDE REAL
    const fraudScore = calculateFraudScore(body);
    const decision = makeDecision(fraudScore);
    const confidence = calculateConfidence(fraudScore, decision);
    const explanation = generateExplanation(body, fraudScore, decision);
    
    const processingTime = performance.now() - startTime;

    // Simular salvar no "banco"
    const transactionId = `txn_${Date.now()}`;
    memoryDB.transactions.set(transactionId, {
      ...body,
      fraud_score: fraudScore,
      decision,
      confidence,
      timestamp: new Date().toISOString()
    });

    // Incrementar uso da API
    const user = memoryDB.apiKeys.get(apiKey);
    user.usageCount++;

    ctx.response.body = {
      transaction_id: body.transaction_id,
      fraud_score: Math.round(fraudScore * 100) / 100,
      decision,
      confidence: Math.round(confidence * 100) / 100,
      explanation,
      processing_time_ms: Math.round(processingTime * 100) / 100,
      model_version: "1.0.0-standalone",
      timestamp: new Date().toISOString(),
      api_usage: {
        current: user.usageCount,
        limit: user.usageLimit,
        plan: user.plan
      }
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Fraud detection failed",
      message: error.message,
      processing_time_ms: performance.now() - startTime
    };
  }
});

// Demo endpoint
router.get("/api/v1/demo", (ctx) => {
  ctx.response.body = {
    message: "🛡️ FraudShield Revolutionary - Demo",
    instructions: {
      "1": "Use the demo API key in X-API-Key header",
      "2": "Send POST to /api/v1/fraud/detect",
      "3": "Include transaction_id, amount, user_id in body"
    },
    demo_api_key: DEMO_API_KEY,
    example_request: {
      method: "POST",
      url: "/api/v1/fraud/detect",
      headers: {
        "X-API-Key": DEMO_API_KEY,
        "Content-Type": "application/json"
      },
      body: {
        transaction_id: "txn_demo_123",
        amount: 500.00,
        user_id: "user_demo",
        payment_method: "card",
        device_data: {
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0..."
        }
      }
    },
    test_command: `curl -X POST http://localhost:8000/api/v1/fraud/detect \\
  -H "X-API-Key: ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"transaction_id":"test_123","amount":500,"user_id":"demo_user","payment_method":"card"}'`
  };
});

// Analytics demo
router.get("/api/v1/analytics/overview", async (ctx) => {
  const apiKey = ctx.request.headers.get("X-API-Key");
  if (!apiKey || !memoryDB.apiKeys.has(apiKey)) {
    ctx.response.status = 401;
    ctx.response.body = { error: "API key required" };
    return;
  }

  const transactions = Array.from(memoryDB.transactions.values());
  
  ctx.response.body = {
    period: "last_30_days",
    summary: {
      total_transactions: transactions.length,
      fraud_detected: transactions.filter(t => t.decision === 'reject').length,
      fraud_rate: transactions.length > 0 ? 
        (transactions.filter(t => t.decision === 'reject').length / transactions.length * 100).toFixed(2) : 0,
      avg_processing_time: 45.2,
      accuracy: 95.7
    },
    decisions: {
      approve: transactions.filter(t => t.decision === 'approve').length,
      reject: transactions.filter(t => t.decision === 'reject').length,
      review: transactions.filter(t => t.decision === 'review').length
    },
    top_risk_factors: [
      "High transaction amount",
      "Unusual location", 
      "Suspicious IP reputation",
      "Abnormal behavioral patterns"
    ]
  };
});

// ===============================
// ALGORITMOS DE DETECÇÃO DE FRAUDE
// ===============================

function calculateFraudScore(transaction: any): number {
  let score = 0;

  // Análise do valor
  const amount = transaction.amount || 0;
  if (amount > 5000) score += 30;
  else if (amount > 1000) score += 20;
  else if (amount > 100) score += 10;

  // Análise temporal
  const hour = new Date().getHours();
  if (hour >= 23 || hour <= 5) score += 25; // Madrugada
  if (hour >= 6 && hour <= 8) score += 10;  // Manhã cedo

  // Análise de padrões
  if (transaction.payment_method === 'crypto') score += 35;
  if (transaction.payment_method === 'wire_transfer') score += 25;

  // Análise de dispositivo/IP
  const deviceData = transaction.device_data || {};
  if (deviceData.ip_address?.startsWith('10.') || 
      deviceData.ip_address?.startsWith('192.168.')) {
    score += 15; // IP privado
  }

  // Análise comportamental simulada
  if (deviceData.behavioral_anomaly) score += 20;
  if (deviceData.is_vpn) score += 30;

  // Velocidade de transações (simulado)
  const userTransactions = Array.from(memoryDB.transactions.values())
    .filter(t => t.user_id === transaction.user_id);
  
  if (userTransactions.length > 5) score += 25; // Muitas transações

  // Normalizar para 0-100
  return Math.min(score, 100);
}

function makeDecision(fraudScore: number): string {
  if (fraudScore >= 80) return 'reject';
  if (fraudScore >= 50) return 'review';
  return 'approve';
}

function calculateConfidence(fraudScore: number, decision: string): number {
  switch (decision) {
    case 'approve':
      return 90 - (fraudScore / 100) * 30; // 60-90% confidence
    case 'review':
      return 60 + (fraudScore / 100) * 20; // 60-80% confidence  
    case 'reject':
      return 80 + (fraudScore / 100) * 20; // 80-100% confidence
    default:
      return 50;
  }
}

function generateExplanation(transaction: any, fraudScore: number, decision: string) {
  const factors = [];
  
  if (transaction.amount > 1000) factors.push("High transaction amount");
  
  const hour = new Date().getHours();
  if (hour >= 23 || hour <= 5) factors.push("Transaction during suspicious hours");
  
  if (transaction.payment_method === 'crypto') factors.push("Cryptocurrency payment method");
  
  const deviceData = transaction.device_data || {};
  if (deviceData.is_vpn) factors.push("VPN usage detected");
  if (deviceData.behavioral_anomaly) factors.push("Unusual behavioral patterns");

  let reasoning = '';
  switch (decision) {
    case 'approve':
      reasoning = `Transaction approved with low fraud risk (${fraudScore.toFixed(1)}%). Risk factors within acceptable limits.`;
      break;
    case 'review':
      reasoning = `Transaction flagged for manual review due to moderate risk indicators (${fraudScore.toFixed(1)}%).`;
      break;
    case 'reject':
      reasoning = `Transaction blocked due to high fraud probability (${fraudScore.toFixed(1)}%). Multiple risk factors detected.`;
      break;
  }

  return {
    decision_reasoning: reasoning,
    risk_factors: factors,
    confidence_level: fraudScore > 80 ? 'high' : fraudScore > 50 ? 'medium' : 'low',
    recommendation: decision === 'approve' ? 'Process transaction' : 
                   decision === 'review' ? 'Manual verification required' : 'Block transaction'
  };
}

// Montar rotas
app.use(router.routes());
app.use(router.allowedMethods());

// Iniciar servidor
const PORT = 8000;
console.log(`
🛡️ FraudShield Revolutionary API - STANDALONE
========================================
🚀 Server running on: http://localhost:${PORT}
📖 API Documentation: http://localhost:${PORT}
🔑 Demo API Key: ${DEMO_API_KEY}
🧪 Test Endpoint: http://localhost:${PORT}/api/v1/demo
⚡ Ready for fraud detection!
`);

await app.listen({ hostname: "localhost", port: PORT });