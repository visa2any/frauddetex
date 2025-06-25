#!/bin/bash

# 🛡️ FraudDetex - Vercel Deploy Script (GRATUITO!)
# Frontend Next.js deployment

set -e

echo "🚀 FraudDetex - Vercel Deployment (GRATUITO!)"
echo "💰 Custo: \$0/mês - Totalmente gratuito!"
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

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    log_error "Vercel CLI não encontrado!"
    echo "Instale com: npm install -g vercel"
    exit 1
fi

# Ir para o diretório frontend
cd frontend

# Login no Vercel
log_info "Fazendo login no Vercel..."
if ! vercel whoami &> /dev/null; then
    log_warning "Por favor, faça login no Vercel:"
    vercel login
fi

log_success "Login confirmado no Vercel"

# Instalar dependências
log_info "Instalando dependências..."
npm install

# Build do projeto
log_info "Fazendo build do projeto..."
npm run build

# Deploy do projeto
log_info "Fazendo deploy no Vercel..."
vercel --prod --yes

# Obter URL do deployment
FRONTEND_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*')
log_success "Frontend deployado em: $FRONTEND_URL"

# Configurar variáveis de ambiente
log_info "Configurando variáveis de ambiente..."

# Backend URL (Railway)
vercel env add NEXT_PUBLIC_API_URL production <<< "https://frauddetex-production.up.railway.app"

# Placeholders para configuração posterior
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://your-project.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "your-supabase-anon-key"
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "pk_test_your-stripe-key"
vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production <<< "your-emailjs-service-id"
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production <<< "your-emailjs-template-id"
vercel env add NEXT_PUBLIC_EMAILJS_USER_ID production <<< "your-emailjs-user-id"

log_success "Variáveis de ambiente configuradas"

# Redeploy com variáveis
log_info "Fazendo redeploy com configurações..."
vercel --prod --yes

# Informações finais
echo ""
echo "🎉 FRONTEND DEPLOYADO COM SUCESSO!"
echo ""
echo "💰 Custos Vercel:"
echo "   Hobby Plan: GRATUITO"
echo "   Bandwidth: 100GB/mês grátis"
echo "   Build time: 100h/mês grátis"
echo "   TOTAL: \$0/mês"
echo ""
echo "🔗 URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Dashboard: https://vercel.com/dashboard"
echo ""
echo "📊 Próximos passos:"
echo "   1. Configure Supabase Auth"
echo "   2. Configure Stripe Test Mode"
echo "   3. Configure EmailJS"
echo "   4. Update backend CORS com frontend URL"
echo ""

# Voltar para diretório raiz
cd ..

# Atualizar informações de deployment
if [ -f deployment-info.json ]; then
    # Update existing file
    tmp=$(mktemp)
    jq --arg frontend_url "$FRONTEND_URL" '.frontend_url = $frontend_url | .vercel_cost = "$0" | .total_cost = "$5"' deployment-info.json > "$tmp" && mv "$tmp" deployment-info.json
else
    # Create new file
    cat > deployment-info.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "frontend_url": "$FRONTEND_URL",
  "vercel_cost": "$0",
  "railway_cost": "$5",
  "total_cost": "$5",
  "status": "frontend_deployed"
}
EOF
fi

log_success "Deploy do frontend concluído!"