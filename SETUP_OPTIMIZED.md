# 🚀 FraudDetex - Setup Otimizado com Seus Recursos

## 💰 Novo Breakdown de Custos (AINDA MAIS BARATO!)

### OBRIGATÓRIO - $0/mês:
- ✅ **Neon.tech:** PostgreSQL (GRATUITO! - você já tem)
- ✅ **Railway Hobby:** Redis + Deploy (GRATUITO até $5)
- ✅ **Vercel:** Frontend Next.js (GRATUITO)
- ✅ **Supabase:** Auth (GRATUITO)
- ✅ **Hostinger Email:** info@frauddetex.com (você já tem)
- ✅ **Mercado Pago:** Sandbox (GRATUITO)

### 🎯 NOVO TOTAL: $0/mês (pode escalar para $5/mês)

---

## 🔧 Configuração com Seus Recursos

### 1. 🗄️ Neon.tech (PostgreSQL - GRATUITO)

Você já tem conta! Só precisa:

```bash
# Copiar sua connection string do Neon.tech
# Formato: postgresql://user:pass@host/dbname

# Configurar no Railway
railway variables set NEON_DATABASE_URL="postgresql://user:pass@host/dbname"
```

### 2. 📧 Email Hostinger (info@frauddetex.com)

Você já tem! Configuração:

```bash
# Railway
railway variables set EMAIL_HOST="smtp.hostinger.com"
railway variables set EMAIL_PORT="587"
railway variables set EMAIL_USER="info@frauddetex.com"
railway variables set EMAIL_PASS="sua-senha-email"
railway variables set EMAIL_FROM="info@frauddetex.com"
```

### 3. 💳 Mercado Pago (Sandbox - GRATUITO)

1. **Acesse:** [developers.mercadopago.com](https://developers.mercadopago.com)
2. **Criar aplicação de teste**
3. **Copiar credenciais de sandbox:**
   ```
   Public Key: TEST-xxx
   Access Token: TEST-xxx
   ```

```bash
# Railway
railway variables set MERCADOPAGO_ACCESS_TOKEN="TEST-xxx"
railway variables set MERCADOPAGO_PUBLIC_KEY="TEST-xxx"

# Vercel
vercel env add NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY production
# Cole: TEST-xxx
```

### 4. 🔐 Supabase (Auth - GRATUITO)

1. **Criar conta:** [supabase.com](https://supabase.com)
2. **Novo projeto:** "frauddetex-auth"
3. **Copiar credenciais**

```bash
# Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Railway
railway variables set SUPABASE_URL="https://xxx.supabase.co"
railway variables set SUPABASE_ANON_KEY="eyJxxx"
```

---

## 🚀 Deploy Atualizado

### Script Railway (Somente Redis)
```bash
# Editado para usar Neon.tech + Hostinger
./deploy-railway.sh
```

### Script Vercel (Mercado Pago)
```bash
# Editado para Mercado Pago
./deploy-vercel.sh
```

---

## 💡 Vantagens da Nova Configuração

### ✅ Custos:
- **Neon.tech:** 0.5GB PostgreSQL grátis
- **Railway:** Redis grátis (até $5/mês)
- **Hostinger:** Email já pago
- **Mercado Pago:** Sandbox ilimitado
- **Total:** $0/mês inicialmente!

### ✅ Performance:
- **Neon.tech:** Mais rápido que Railway PostgreSQL
- **Email próprio:** Profissional (info@frauddetex.com)
- **Mercado Pago:** Integração nacional otimizada

### ✅ Escalabilidade:
- Neon.tech: Até 0.5GB grátis → $19/mês para 10GB
- Railway: $0 → $5/mês quando necessário
- Mercado Pago: Sandbox → Produção sem custo adicional

---

## 🎯 Comandos de Deploy

```bash
# 1. Configurar Railway com Neon.tech
railway variables set NEON_DATABASE_URL="sua-connection-string"

# 2. Configurar email Hostinger  
railway variables set EMAIL_USER="info@frauddetex.com"
railway variables set EMAIL_PASS="sua-senha"

# 3. Deploy completo
./setup-complete.sh
```

---

## 📊 Comparação de Custos

| Configuração | PostgreSQL | Email | Pagamentos | Total/mês |
|--------------|------------|-------|------------|-----------|
| **Anterior** | Railway $5 | EmailJS $0 | Stripe $0 | **$5** |
| **Nova** | Neon.tech $0 | Hostinger $0* | MercadoPago $0 | **$0** |

*Já pago na Hostinger

---

## 🚀 Resultado Final

- **Frontend:** https://frauddetex.vercel.app
- **Backend:** https://frauddetex.up.railway.app  
- **Database:** Neon.tech (mais rápido!)
- **Email:** info@frauddetex.com (profissional!)
- **Pagamentos:** Mercado Pago (nacional!)

**Custo inicial:** $0/mês  
**Escalabilidade:** Até $24/mês quando necessário  
**ROI:** Infinito desde o primeiro dia! 🚀