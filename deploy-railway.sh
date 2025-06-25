#!/bin/bash

# 🛡️ FraudDetex - Railway Deploy Script
# Deploy completo por apenas $5/mês!

set -e

echo "🚀 FraudDetex - Railway Deployment"
echo "💰 Custo total: \$5/mês no Railway Pro"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    log_error "Railway CLI não encontrado!"
    echo "Instale com: npm install -g @railway/cli"
    exit 1
fi

# Login no Railway
log_info "Fazendo login no Railway..."
if ! railway whoami &> /dev/null; then
    log_warning "Por favor, faça login no Railway:"
    railway login
fi

log_success "Login confirmado no Railway"

# Criar novo projeto Railway
log_info "Criando projeto no Railway..."
railway login
railway create frauddetex

# Adicionar apenas Redis (PostgreSQL via Neon.tech)
log_info "Adicionando Redis..."
railway add redis

log_info "PostgreSQL será via Neon.tech (GRATUITO!)"

# Configurar variáveis de ambiente
log_info "Configurando variáveis de ambiente..."

# Gerar JWT secret seguro
JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET="$JWT_SECRET"

# Configurar ambiente
railway variables set NODE_ENV=production
railway variables set API_HOST=0.0.0.0
railway variables set CORS_ORIGIN="https://frauddetex.vercel.app,https://localhost:3000"

# Configurar rate limiting
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100

# Configurar ML
railway variables set ML_BATCH_SIZE=16
railway variables set ML_CONFIDENCE_THRESHOLD=0.7
railway variables set LOG_LEVEL=info
railway variables set ENABLE_METRICS=true

log_success "Variáveis de ambiente configuradas"

# Deploy do backend
log_info "Fazendo deploy do backend..."
railway up --detach

log_success "Deploy do backend iniciado!"

# Obter URL do deployment
log_info "Aguardando deployment..."
sleep 30

BACKEND_URL=$(railway status --json | jq -r '.deployments[0].url')
log_success "Backend deployado em: $BACKEND_URL"

# Executar migrações de banco
log_info "Executando migrações do banco..."
railway run "deno run --allow-all backend/setup.ts"

log_success "Migrações executadas com sucesso!"

# Informações finais
echo ""
echo "🎉 DEPLOYMENT COMPLETO!"
echo ""
echo "💰 Custos:"
echo "   Railway Pro: \$5/mês"
echo "   PostgreSQL: Incluído"
echo "   Redis: Incluído"
echo "   TOTAL: \$5/mês"
echo ""
echo "🔗 URLs:"
echo "   Backend API: $BACKEND_URL"
echo "   Dashboard: https://railway.app/project/{project-id}"
echo ""
echo "📊 Próximos passos:"
echo "   1. Configure o frontend no Vercel (GRATUITO)"
echo "   2. Configure Supabase Auth (GRATUITO)"
echo "   3. Configure Stripe Test Mode (GRATUITO)"
echo "   4. Configure EmailJS (GRATUITO)"
echo ""
echo "🚀 Pronto para apresentar aos investidores!"

# Salvar informações de deployment
cat > deployment-info.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform": "Railway",
  "cost_monthly": "$5",
  "backend_url": "$BACKEND_URL",
  "database": "PostgreSQL (1GB)",
  "cache": "Redis (25MB)",
  "status": "deployed",
  "next_steps": [
    "Deploy frontend to Vercel",
    "Configure Supabase Auth",
    "Setup Stripe Test Mode",
    "Configure EmailJS"
  ]
}
EOF

log_success "Informações salvas em deployment-info.json"