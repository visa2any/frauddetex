# 🛡️ FraudShield Revolutionary - Backend API

The core backend API powering the world's first explainable, community-driven fraud detection system.

## 🚀 Features

- **Real-time Fraud Detection** - Sub-50ms ML inference with explainable AI
- **Behavioral Biometrics** - Advanced pattern analysis and anomaly detection  
- **Community Intelligence** - P2P threat sharing and verification system
- **Edge Computing** - Global Cloudflare Workers deployment
- **Enterprise Security** - JWT authentication, rate limiting, audit logs
- **Scalable Architecture** - Deno runtime with PostgreSQL and Redis

## 📋 Quick Start

### Prerequisites

- **Deno** >= 1.40.0
- **PostgreSQL** >= 14.0  
- **Redis** >= 6.0
- **Node.js** >= 18.0 (for frontend)

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

### 2. Database Setup

```bash
# Run setup script (creates DB, tables, demo data)
deno run --allow-all setup.ts
```

### 3. Start API Server

```bash
# Development mode (with auto-reload)
deno task dev

# Production mode
deno task start
```

### 4. Verify Installation

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Test fraud detection
curl -X POST http://localhost:8000/api/v1/fraud/detect \
  -H "X-API-Key: fs_demo_key_123456789abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "txn_123",
    "amount": 500.00,
    "user_id": "user_456",
    "payment_method": "card"
  }'
```

## 🏗️ API Architecture

### Core Services

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Edge Workers  │    │   Main API      │    │   ML Service    │
│   (Cloudflare)  │    │   (Deno/Oak)    │    │   (TensorFlow)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┬─────┴─────┬─────────────────┐
         │                 │           │                 │
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │   Community     │
│   (Database)    │ │    (Cache)      │ │   P2P Network   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### API Endpoints

#### 🔐 Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/validate` - Validate credentials

#### 🛡️ Fraud Detection  
- `POST /api/v1/fraud/detect` - Real-time fraud detection
- `POST /api/v1/fraud/batch` - Batch processing
- `GET /api/v1/fraud/transactions` - Transaction history
- `POST /api/v1/fraud/feedback` - Submit feedback

#### 🤖 Machine Learning
- `GET /api/v1/ml/models` - List available models
- `POST /api/v1/ml/predict` - Direct ML prediction
- `POST /api/v1/ml/train` - Train custom models (Enterprise)
- `GET /api/v1/ml/feature-importance` - Feature analysis

#### 🌐 Community Intelligence
- `GET /api/v1/community/threats` - Active threats
- `POST /api/v1/community/report-threat` - Report new threat
- `POST /api/v1/community/verify-threat/:id` - Verify threat
- `GET /api/v1/community/reputation` - User reputation

#### 💰 Billing & Usage
- `GET /api/v1/billing/usage` - Current usage stats
- `GET /api/v1/billing/plans` - Available plans
- `POST /api/v1/billing/upgrade` - Upgrade plan
- `GET /api/v1/billing/invoices` - Billing history

#### 📊 Analytics
- `GET /api/v1/analytics/overview` - Analytics dashboard
- `GET /api/v1/analytics/trends` - Trend analysis
- `GET /api/v1/analytics/fraud-patterns` - Pattern insights
- `POST /api/v1/analytics/custom-report` - Custom reports

#### 👤 User Management
- `GET /api/v1/user/profile` - User profile
- `PUT /api/v1/user/profile` - Update profile
- `POST /api/v1/user/change-password` - Change password
- `POST /api/v1/user/regenerate-api-key` - New API key

#### ❤️ Health & Monitoring
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed system status
- `GET /api/v1/health/metrics` - Performance metrics

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fraudshield
DB_HOST=localhost
DB_PORT=5432
DB_USER=fraudshield
DB_PASSWORD=your_password
DB_NAME=fraudshield

# Redis Cache
REDIS_URL=redis://localhost:6379

# API Configuration
API_HOST=localhost
API_PORT=8000
API_TIMEOUT=30000

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_chars
ENCRYPTION_KEY=your_encryption_key_32_bytes

# ML/AI Services
ML_MODEL_PATH=./models
OPENAI_API_KEY=your_openai_key (optional)

# Edge Computing
EDGE_API_URL=https://fraud-detection.your-domain.workers.dev
CLOUDFLARE_API_TOKEN=your_cloudflare_token

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn (optional)
```

## 🧪 Testing

```bash
# Run all tests
deno task test

# Run specific test file
deno test tests/fraud_detection_test.ts --allow-all

# Run with coverage
deno test --coverage=coverage tests/

# Generate coverage report
deno coverage coverage --html
```

## 📦 Deployment

### Local Development

```bash
# Start with auto-reload
deno task dev

# Check code quality
deno task lint
deno task fmt
deno task check
```

### Docker Deployment

```bash
# Build container
docker build -t fraudshield-api .

# Run container
docker run -p 8000:8000 --env-file .env fraudshield-api
```

### Deno Deploy

```bash
# Compile for deployment
deno task compile

# Deploy to Deno Deploy
deno task deploy
```

### Cloudflare Workers (Edge)

```bash
# Deploy edge workers
cd edge-workers
wrangler deploy
```

## 🔒 Security

### Authentication Flow

1. **Registration** - User creates account with email/password
2. **Login** - Returns JWT token (24h expiry) + API key
3. **API Access** - Use API key in `X-API-Key` header or JWT in `Authorization: Bearer <token>`
4. **Rate Limiting** - Per-plan limits enforced via Redis

### API Key Format

```
fs_<32_random_characters>
Example: fs_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Rate Limits

| Plan | Requests/Hour | Features |
|------|---------------|----------|
| Community | 100 | Basic detection |
| Smart | 1,000 | + Edge processing |
| Enterprise | 10,000 | + Custom models |
| Insurance | 5,000 | + Fraud guarantee |

## 🚨 Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created  
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Response Format

```json
{
  "error": "validation_error",
  "message": "Missing required field: amount",
  "code": "VALIDATION_ERROR", 
  "request_id": "req_1234567890",
  "timestamp": "2024-01-20T10:30:00Z",
  "documentation": "https://docs.fraudshield.revolutionary/errors"
}
```

## 📊 Performance

### Benchmarks

- **Fraud Detection Latency**: <50ms (p95)
- **Throughput**: 1,000+ RPS per instance
- **Memory Usage**: ~512MB baseline
- **Cold Start**: <100ms (Deno Deploy)

### Monitoring

```bash
# View real-time metrics
curl http://localhost:8000/api/v1/health/metrics

# Check performance
curl http://localhost:8000/api/v1/analytics/performance
```

## 🛠️ Development

### Project Structure

```
backend/
├── main.ts              # Entry point
├── setup.ts             # Setup script
├── deno.json           # Deno configuration
├── services/           # Core services
│   ├── database.ts     # PostgreSQL service
│   ├── redis.ts        # Redis service  
│   └── ml.ts           # ML service
├── middleware/         # HTTP middleware
│   ├── auth.ts         # Authentication
│   ├── rateLimit.ts    # Rate limiting
│   ├── logging.ts      # Request logging
│   └── error.ts        # Error handling
├── routes/             # API routes
│   ├── auth.ts         # Auth endpoints
│   ├── fraud.ts        # Fraud detection
│   ├── ml.ts           # ML management
│   ├── community.ts    # Community features
│   ├── billing.ts      # Billing/usage
│   ├── user.ts         # User management
│   ├── analytics.ts    # Analytics
│   └── health.ts       # Health checks
└── tests/              # Test files
```

### Adding New Features

1. **Create Route Handler**:
```typescript
// routes/new_feature.ts
export const newFeatureRoutes = new Router();
newFeatureRoutes.get("/endpoint", async (ctx) => {
  // Implementation
});
```

2. **Add to Main Router**:
```typescript
// main.ts  
import { newFeatureRoutes } from "./routes/new_feature.ts";
apiV1.use("/new-feature", newFeatureRoutes.routes());
```

3. **Add Tests**:
```typescript
// tests/new_feature_test.ts
import { assertEquals } from "@testing/asserts.ts";
Deno.test("New feature test", async () => {
  // Test implementation
});
```

## 📞 Support

- **Documentation**: [docs.fraudshield.revolutionary](https://docs.fraudshield.revolutionary)
- **API Reference**: [api.fraudshield.revolutionary](https://api.fraudshield.revolutionary)
- **Issues**: [GitHub Issues](https://github.com/fraudshield/revolutionary/issues)
- **Community**: [Discord Server](https://discord.gg/fraudshield)

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

**🛡️ FraudShield Revolutionary - Protecting the digital economy with explainable AI and community intelligence.**