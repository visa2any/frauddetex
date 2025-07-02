# 🌐 Configuração do Domínio frauddetex.com

## Status Atual
- ✅ Código pronto para produção
- ✅ Build funcionando no Vercel
- ✅ Todas as páginas 404 criadas
- ✅ Email atualizado para info@frauddetex.com
- 🔧 **Pendente:** Configuração do domínio custom

## Configuração do Domínio no Vercel

### 1. Acessar Dashboard do Vercel
1. Acesse https://vercel.com/dashboard
2. Selecione o projeto `frauddetex`
3. Vá para **Settings** > **Domains**

### 2. Adicionar Domínio Custom
1. Clique em **Add Domain**
2. Digite: `frauddetex.com`
3. Clique em **Add**

### 3. Configurar DNS
O Vercel irá fornecer os registros DNS necessários:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Configurar no Provedor de DNS
No painel do seu provedor de domínio (onde comprou o frauddetex.com):

1. **Registro A (Root Domain)**
   - Type: `A`
   - Name/Host: `@` ou deixe em branco
   - Value/Target: `76.76.19.61`
   - TTL: `3600` (1 hora)

2. **Registro CNAME (WWW)**
   - Type: `CNAME`
   - Name/Host: `www`
   - Value/Target: `cname.vercel-dns.com`
   - TTL: `3600` (1 hora)

### 5. Aguardar Propagação
- Propagação DNS: 24-48 horas
- Verificação: Use `nslookup frauddetex.com` ou https://dnschecker.org

### 6. Configurar SSL
O Vercel irá automaticamente:
- Gerar certificado SSL Let's Encrypt
- Configurar HTTPS redirect
- Ativar certificado em 5-10 minutos após propagação DNS

## URLs Finais
- **Principal:** https://frauddetex.com
- **WWW:** https://www.frauddetex.com (redirect automático)
- **Staging:** https://frauddetex.vercel.app (continua funcionando)

## Verificação Pós-Configuração
- [ ] https://frauddetex.com carrega corretamente
- [ ] Redirect automático de HTTP para HTTPS
- [ ] www.frauddetex.com redireciona para frauddetex.com
- [ ] Certificado SSL válido (cadeado verde)
- [ ] Todas as páginas acessíveis (zero 404s)

## Troubleshooting
- **DNS não propagou:** Aguarde até 48h
- **SSL não ativou:** Verifique se DNS está correto
- **404 em subpáginas:** Verificar se build foi feito após criar páginas
- **Erro de certificado:** Aguardar propagação completa do DNS

## Comandos Úteis
```bash
# Verificar DNS
nslookup frauddetex.com

# Teste SSL
curl -I https://frauddetex.com

# Verificar headers
curl -I https://frauddetex.com
```

---
✅ **Site pronto para produção!** Todas as funcionalidades implementadas e páginas criadas.