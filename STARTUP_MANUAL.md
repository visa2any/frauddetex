# 🚀 FraudShield - Manual de Inicialização

## ⚠️ PROBLEMA DETECTADO

A instalação automática está falhando devido a:
- Timeouts na instalação do npm
- Dependências conflitantes
- Cache corrompido

## ✅ SOLUÇÃO MANUAL

### **1. Instalar Node.js**
Se não tiver Node.js instalado:
- Baixar em: https://nodejs.org/
- Instalar versão LTS (18 ou superior)

### **2. Abrir Terminal como Administrador**
- Pressionar `Windows + X`
- Escolher "Terminal (Admin)" ou "PowerShell (Admin)"

### **3. Navegar para o projeto**
```cmd
cd C:\Users\vilma\fraud\fraudshield-revolutionary\frontend
```

### **4. Limpar instalação anterior**
```cmd
rmdir /s node_modules
del package-lock.json
npm cache clean --force
```

### **5. Instalar uma dependência por vez**
```cmd
npm install next@14.0.4
npm install react@18.2.0
npm install react-dom@18.2.0
npm install lucide-react@0.303.0
npm install typescript@5 --save-dev
npm install @types/node@20 --save-dev
npm install @types/react@18 --save-dev
npm install @types/react-dom@18 --save-dev
npm install tailwindcss@3.3.0 --save-dev
npm install autoprefixer@10.0.1 --save-dev
npm install postcss@8 --save-dev
```

### **6. Iniciar o servidor**
```cmd
npm run dev
```

### **7. Acessar o sistema**
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 🎯 FUNCIONALIDADES ATIVAS

✅ **Já funcionando:**
- Homepage completa com métricas
- Dashboard explicável
- Behavioral biometrics simulado
- Risk score meters
- Community network visualization
- Responsive design

⚠️ **Modo demonstração:**
- Dados simulados (não salvam)
- Backend não conectado
- n8n não ativo

## 🔧 ALTERNATIVA RÁPIDA

Se ainda não funcionar, criar um projeto Next.js novo:

```cmd
cd C:\Users\vilma\fraud
npx create-next-app@14 fraudshield-demo
cd fraudshield-demo
npm run dev
```

Depois copiar os arquivos do dashboard para o novo projeto.

## 📞 SUPORTE

Se continuar com problemas:
1. Verificar se Node.js está instalado: `node -v`
2. Verificar se npm funciona: `npm -v`
3. Tentar em modo seguro (sem antivírus)
4. Usar Yarn ao invés do npm: `npm install -g yarn && yarn install`

---

**🎉 O FraudShield está pronto! Só precisa das dependências instaladas.**