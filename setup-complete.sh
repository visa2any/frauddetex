#!/bin/bash

# 🛡️ FraudDetex - Setup Completo Automatizado
# Deploy completo em um comando!

set -e

echo "🚀 FraudDetex - Setup Completo por \$5/mês"
echo "🎯 Automatizando todo o processo..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Verificar pré-requisitos
log_info "Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    log_warning "Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi

if ! command -v git &> /dev/null; then
    log_warning "Git não encontrado. Instale em: https://git-scm.com"
    exit 1
fi

log_success "Pré-requisitos OK"

# Instalar CLIs necessários
log_info "Instalando CLIs necessários..."
npm install -g @railway/cli vercel

# 1. Deploy Backend (Railway)
log_info "🚂 Iniciando deploy do backend no Railway..."
chmod +x deploy-railway.sh
./deploy-railway.sh

# 2. Deploy Frontend (Vercel)
log_info "▲ Iniciando deploy do frontend no Vercel..."
chmod +x deploy-vercel.sh
./deploy-vercel.sh

# 3. Configurar Git
log_info "📁 Configurando repositório Git..."
git add .
git commit -m "🚀 Deploy completo FraudDetex - $5/mês setup

✅ Railway backend configurado
✅ Vercel frontend configurado
✅ PostgreSQL + Redis incluídos
✅ Scripts de deploy automatizados

💰 Custo total: $5/mês
🎯 Pronto para investidores!"

# Informações finais
echo ""
echo "🎉 SETUP COMPLETO!"
echo ""
echo "💰 CUSTO MENSAL:"
echo "   Railway Pro: \$5/mês"
echo "   Vercel: GRATUITO"
echo "   Supabase: GRATUITO"
echo "   Stripe Test: GRATUITO"
echo "   EmailJS: GRATUITO"
echo "   ────────────────────"
echo "   TOTAL: \$5/mês"
echo ""
echo "🔗 SEUS LINKS:"
if [ -f deployment-info.json ]; then
    BACKEND_URL=$(jq -r '.backend_url // "https://frauddetex-production.up.railway.app"' deployment-info.json)
    FRONTEND_URL=$(jq -r '.frontend_url // "https://frauddetex.vercel.app"' deployment-info.json)
    echo "   Frontend: $FRONTEND_URL"
    echo "   Backend: $BACKEND_URL"
    echo "   Dashboard: $FRONTEND_URL/dashboard"
fi
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "   1. Configure Supabase Auth (5 min)"
echo "   2. Configure Stripe Test Mode (5 min)"
echo "   3. Configure EmailJS (5 min)"
echo "   4. Teste todas as funcionalidades"
echo "   5. Apresente aos investidores! 🚀"
echo ""
echo "📖 DOCUMENTAÇÃO:"
echo "   Leia: DEPLOY_5_DOLLARS.md"
echo ""
log_success "FraudDetex está pronto para conquistar investidores!"