#!/bin/bash

# 🚀 FraudShield Revolutionary - Start Script
echo "🛡️  Iniciando FraudShield Revolutionary..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js >= 18.0.0"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão muito antiga. Requer >= 18.0.0, encontrado: $(node -v)"
    exit 1
fi

echo "✅ Docker e Node.js verificados"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Configure as variáveis em .env antes do deploy em produção"
fi

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Dependências já instaladas"
fi
cd ..

# Instalar dependências do community node
echo "📦 Instalando dependências do community node..."
cd community
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Dependências já instaladas"
fi
cd ..

# Verificar se PostgreSQL e Redis estão rodando via Docker
echo "🗄️  Verificando serviços de banco de dados..."
if ! docker ps | grep -q "postgres"; then
    echo "🐘 Iniciando PostgreSQL..."
    docker-compose up -d postgres
    sleep 5
fi

if ! docker ps | grep -q "redis"; then
    echo "🔴 Iniciando Redis..."
    docker-compose up -d redis
    sleep 3
fi

# Iniciar n8n
echo "🤖 Iniciando n8n (Automação)..."
if ! docker ps | grep -q "n8n"; then
    docker-compose up -d n8n
    sleep 5
fi

echo ""
echo "🎉 FraudShield Revolutionary iniciado com sucesso!"
echo ""
echo "📊 Serviços disponíveis:"
echo "   🌐 Frontend:    http://localhost:3000"
echo "   🤖 n8n:         http://localhost:5678 (admin/fraudshield123)"
echo "   🗄️  PostgreSQL:  localhost:5432"
echo "   🔴 Redis:       localhost:6379"
echo ""
echo "📝 Próximos passos:"
echo "   1. Abrir http://localhost:3000 no browser"
echo "   2. Acessar dashboard em /dashboard"
echo "   3. Configurar n8n em http://localhost:5678"
echo ""
echo "🔧 Para desenvolvimento:"
echo "   Frontend: cd frontend && npm run dev"
echo "   Community: cd community && npm run dev"
echo ""
echo "📖 Documentação completa em: docs/"
echo "🐛 Logs: docker-compose logs -f"
echo ""

# Aguardar um pouco e iniciar o frontend automaticamente
echo "⏳ Aguardando 3 segundos e iniciando frontend..."
sleep 3

cd frontend
echo "🌐 Iniciando frontend Next.js..."
npm run dev