# 🆓 Configuração dos Serviços Gratuitos

## 1. 🔐 Supabase Auth (GRATUITO - 5 min)

### Passos:
1. **Criar conta:** [supabase.com](https://supabase.com)
2. **Novo projeto:** "frauddetex-auth"
3. **Copiar credenciais:**
   ```
   Project URL: https://xxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Configurar no Vercel:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://xxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configurar no Railway:
```bash
railway variables set SUPABASE_URL="https://xxx.supabase.co"
railway variables set SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2. 💳 Stripe Test Mode (GRATUITO - 5 min)

### Passos:
1. **Criar conta:** [stripe.com](https://stripe.com)
2. **Ativar test mode** (toggle no dashboard)
3. **Copiar chaves de teste:**
   ```
   Publishable key: pk_test_xxx
   Secret key: sk_test_xxx
   ```

### Configurar no Vercel:
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Cole: pk_test_xxx
```

### Configurar no Railway:
```bash
railway variables set STRIPE_SECRET_KEY="sk_test_xxx"
railway variables set STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

---

## 3. 📧 EmailJS (GRATUITO - 5 min)

### Passos:
1. **Criar conta:** [emailjs.com](https://emailjs.com)
2. **Adicionar serviço de email** (Gmail recomendado)
3. **Criar template de email:**
   ```
   Subject: FraudDetex - {{subject}}
   Body: Olá {{to_name}}, {{message}}
   ```
4. **Copiar credenciais:**
   ```
   Service ID: service_xxx
   Template ID: template_xxx
   User ID: user_xxx
   ```

### Configurar no Vercel:
```bash
vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production
# Cole: service_xxx

vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production
# Cole: template_xxx

vercel env add NEXT_PUBLIC_EMAILJS_USER_ID production
# Cole: user_xxx
```

---

## 4. 🌐 Cloudflare (OPCIONAL - GRATUITO)

### Para edge functions e DNS:
1. **Criar conta:** [cloudflare.com](https://cloudflare.com)
2. **Adicionar domínio** (se tiver)
3. **Configurar Workers** (opcional)

---

## 🚀 Comando Final

Após configurar todos os serviços:

```bash
# Redeploy com novas configurações
vercel --prod
railway up --detach
```

## ✅ Teste Final

Acesse seu frontend e teste:
- ✅ Login/cadastro (Supabase)
- ✅ Dashboard funciona
- ✅ APIs respondem
- ✅ Emails são enviados
- ✅ Stripe test funciona

## 🎯 Resultado Final

- **Frontend:** https://frauddetex.vercel.app
- **Backend:** https://frauddetex-production.up.railway.app
- **Custo:** $5/mês
- **Status:** 100% funcional para investidores!

---

**Tempo total:** 15-20 minutos  
**Custo total:** $5/mês  
**ROI potencial:** Infinito! 🚀