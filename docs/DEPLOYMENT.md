# 🚀 FraudShield Revolutionary - Guia de Deploy Completo

## 📋 Pré-requisitos

### Requisitos do Sistema
- **Node.js**: ≥18.0.0
- **Deno**: ≥1.38.0
- **Docker**: ≥20.10.0
- **Docker Compose**: ≥2.0.0
- **Git**: ≥2.30.0

### Contas Necessárias
- **Vercel**: Para frontend deployment
- **Deno Deploy**: Para backend API
- **Cloudflare**: Para edge workers
- **Supabase**: Para database
- **GitHub**: Para CI/CD
- **Discord**: Para notificações (opcional)

## 🏗️ Arquitetura de Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │     Vercel      │    │  Deno Deploy    │
│   Edge Workers  │    │   Frontend      │    │   Backend API   │
│                 │    │                 │    │                 │
│ • Fraud ML      │◄──►│ • Next.js App   │◄──►│ • FastAPI       │
│ • Rate Limiting │    │ • Dashboard     │    │ • WebSocket     │
│ • DDoS Protect  │    │ • Auth          │    │ • ML Training   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                         │
│  • Supabase (DB)  • Upstash (Redis)  • n8n (Automation)       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Setup Local (Desenvolvimento)

### 1. Clone do Repositório
```bash
git clone https://github.com/fraudshield/revolutionary.git
cd fraudshield-revolutionary
```

### 2. Configuração de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Configurar variáveis de ambiente
vim .env
```

### 3. Setup Completo Automatizado
```bash
# Instalar dependências e configurar tudo
npm run setup:all

# Alternativamente, passo a passo:
npm run setup:deps     # Instalar dependências
npm run setup:db       # Configurar banco de dados
npm run setup:n8n      # Configurar automação
```

### 4. Executar em Desenvolvimento
```bash
# Todos os serviços simultaneamente
npm run dev

# Ou serviços individuais:
npm run dev:frontend   # Frontend (porta 3000)
npm run dev:backend    # Backend (porta 8000)
docker-compose up n8n  # n8n (porta 5678)
```

## 🌐 Deploy em Produção

### Passo 1: Configurar Serviços Externos

#### Supabase (Database)
```bash
# 1. Criar projeto no Supabase
# 2. Obter URL e chaves
# 3. Executar migrações
npx supabase db push

# 4. Configurar Row Level Security
npx supabase db reset
```

#### Cloudflare Workers (Edge)
```bash
# 1. Configurar Wrangler CLI
npm install -g wrangler
wrangler login

# 2. Deploy edge worker
cd edge-ml
wrangler deploy

# 3. Configurar domínio personalizado
wrangler domains add fraud-detection.your-domain.com
```

#### Vercel (Frontend)
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod

# 3. Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_EDGE_URL
```

#### Deno Deploy (Backend)
```bash
# 1. Configurar Deno Deploy CLI
deno install --allow-all --unstable https://deno.land/x/deploy/deployctl.ts

# 2. Deploy backend
cd backend
deployctl deploy --project=fraudshield-api main.ts

# 3. Configurar secrets
deployctl secrets add DATABASE_URL
deployctl secrets add JWT_SECRET
```

### Passo 2: Configurar CI/CD

#### GitHub Actions Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy FraudShield Revolutionary

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-edge:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'edge-ml'

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      - name: Deploy to Deno Deploy
        run: |
          deno install --allow-all --unstable https://deno.land/x/deploy/deployctl.ts
          deployctl deploy --project=fraudshield-api ./backend/main.ts
        env:
          DENO_DEPLOY_TOKEN: ${{ secrets.DENO_DEPLOY_TOKEN }}
```

### Passo 3: Configurar n8n em Produção

#### Self-Hosted n8n
```bash
# 1. Configurar n8n em servidor dedicado
docker-compose -f docker-compose.prod.yml up -d n8n

# 2. Importar workflows
curl -X POST http://your-n8n-domain.com/api/v1/workflows/import \
  -H "Content-Type: application/json" \
  -d @automation/n8n/workflows/fraud-detection-complete.json

# 3. Configurar webhooks
curl -X POST http://your-n8n-domain.com/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -d '{"path": "fraud-detection", "method": "POST"}'
```

#### n8n Cloud (Alternativa)
```bash
# 1. Criar conta no n8n Cloud
# 2. Importar workflows via interface
# 3. Configurar credentials:
#    - Supabase API
#    - Discord Webhook
#    - SMTP
#    - Edge API
```

## 🔒 Configuração de Segurança

### SSL/TLS
```bash
# Cloudflare (automático)
# Vercel (automático)
# Deno Deploy (automático)

# Para serviços self-hosted:
certbot certonly --standalone -d api.fraudshield.dev
```

### Secrets Management
```bash
# Cloudflare Workers
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put ENCRYPTION_KEY

# Vercel
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_API_URL

# Deno Deploy
deployctl secrets add DATABASE_URL
deployctl secrets add REDIS_URL

# GitHub Actions
# Configurar via GitHub Secrets:
# - CLOUDFLARE_API_TOKEN
# - VERCEL_TOKEN
# - DENO_DEPLOY_TOKEN
# - SUPABASE_ACCESS_TOKEN
```

### Rate Limiting
```typescript
// edge-ml/rate-limiter.ts
export class RateLimiter {
  async limit(ip: string): Promise<boolean> {
    const key = `rate_limit:${ip}`;
    const count = await env.REDIS.get(key);
    
    if (count && parseInt(count) > 100) {
      return false; // Rate limited
    }
    
    await env.REDIS.setex(key, 3600, (parseInt(count || '0') + 1).toString());
    return true;
  }
}
```

## 📊 Monitoramento e Observabilidade

### Métricas com Prometheus
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'fraudshield-api'
    static_configs:
      - targets: ['api.fraudshield.dev:8000']
  
  - job_name: 'fraudshield-edge'
    static_configs:
      - targets: ['fraud-detection.fraudshield.dev:443']
```

### Alertas
```yaml
# monitoring/alerts.yml
groups:
  - name: fraudshield
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        annotations:
          summary: "High latency detected"
```

### Logs
```bash
# Structured logging com Pino
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-elasticsearch',
    options: {
      node: process.env.ELASTICSEARCH_URL
    }
  }
});
```

## 🔄 Backup e Disaster Recovery

### Database Backup
```bash
# Backup automático Supabase
# Configurado via dashboard Supabase

# Backup manual
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20241201.sql
```

### Application State Backup
```bash
# Backup n8n workflows
curl -X GET http://n8n-domain.com/api/v1/workflows \
  -H "Authorization: Bearer $N8N_API_KEY" \
  > workflows-backup.json

# Backup Redis cache
redis-cli --rdb redis-backup.rdb
```

### Disaster Recovery Plan
1. **RTO (Recovery Time Objective)**: 15 minutos
2. **RPO (Recovery Point Objective)**: 5 minutos
3. **Failover automático** via Cloudflare
4. **Multi-region deployment** (opcional)

## 🚦 Health Checks

### API Health Check
```typescript
// /health endpoint
export async function healthCheck(): Promise<HealthStatus> {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      ml_model: await checkMLModel(),
      edge_workers: await checkEdgeWorkers()
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: await getCPUUsage()
    }
  };
}
```

### Automated Testing
```bash
# E2E tests em produção
npm run test:e2e:prod

# Smoke tests
npm run test:smoke

# Performance tests
npm run test:performance
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# Auto-scaling configurado via Cloudflare Workers
# Backend: Deno Deploy escala automaticamente
# Frontend: Vercel escala automaticamente

# Para n8n self-hosted:
version: '3.8'
services:
  n8n:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
```

### Performance Optimization
```typescript
// Edge caching
const response = await caches.default.match(request);
if (response) {
  return response;
}

// Edge compute com baixa latência
const result = await detectFraud(request);
const response = new Response(JSON.stringify(result), {
  headers: {
    'Cache-Control': 'public, max-age=60',
    'Content-Type': 'application/json'
  }
});

caches.default.put(request, response.clone());
return response;
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Edge Worker Timeout
```bash
# Verificar logs
wrangler tail

# Otimizar código
# Reduzir dependências
# Usar WebAssembly para ML
```

#### 2. Database Connection Issues
```bash
# Verificar connection pool
# Aumentar timeout
# Verificar rate limits Supabase
```

#### 3. n8n Workflow Failures
```bash
# Verificar logs n8n
docker logs fraudshield-n8n

# Teste manual de endpoints
curl -X POST http://n8n-domain.com/webhook/fraud-detection \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Comandos Úteis
```bash
# Status geral do sistema
npm run status

# Logs em tempo real
npm run logs:follow

# Rebuild completo
npm run rebuild:all

# Deploy rollback
npm run deploy:rollback

# Health check completo
npm run health:check
```

## 📞 Suporte

### Contatos de Emergência
- **DevOps**: devops@fraudshield.dev
- **Security**: security@fraudshield.dev
- **Status Page**: https://status.fraudshield.dev

### Recursos Úteis
- **Documentação**: https://docs.fraudshield.dev
- **Discord**: https://discord.gg/fraudshield
- **GitHub Issues**: https://github.com/fraudshield/revolutionary/issues

---

**⚡ Deploy automatizado em menos de 15 minutos!**