#!/bin/bash

echo "🛡️  FraudShield Revolutionary - Modo Simples (Sem Docker)"
echo ""

# Verificar Node.js
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

echo "🎯 Iniciando apenas o frontend (modo demonstração)..."
echo ""

# Criar package.json simplificado para o frontend
cat > frontend/package.json << 'EOF'
{
  "name": "fraudshield-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.303.0",
    "framer-motion": "^10.16.16",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8"
  }
}
EOF

echo "📦 Instalando dependências mínimas..."
cd frontend

# Tentar instalação rápida
timeout 60 npm install --no-optional --no-fund --silent

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo ""
    echo "🚀 Iniciando FraudShield Frontend..."
    echo ""
    echo "📖 Acesse: http://localhost:3000"
    echo "📊 Dashboard: http://localhost:3000/dashboard"
    echo ""
    echo "⚠️  Modo demonstração: Alguns recursos precisam de backend completo"
    echo ""
    
    npm run dev
else
    echo "⚠️  Instalação demorou muito. Tentando iniciar mesmo assim..."
    echo ""
    echo "📋 Para executar manualmente:"
    echo "   cd frontend"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
    echo "🌐 Depois acesse: http://localhost:3000"
fi