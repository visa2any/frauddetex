/**
 * 📧 FraudShield Revolutionary - Email Service
 * 
 * Email automation and notifications
 * Features:
 * - Welcome emails
 * - Billing notifications
 * - Security alerts
 * - Template management
 * - Multi-provider support
 */

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

export class EmailService {
  private provider: 'resend' | 'sendgrid' | 'smtp';
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.provider = (env.EMAIL_PROVIDER as any) || 'resend';
    this.apiKey = env.EMAIL_API_KEY || '';
    this.fromEmail = env.FROM_EMAIL || 'noreply@fraudshield.revolutionary';
  }

  // Send email via Resend
  private async sendViaResend(emailData: EmailData): Promise<any> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailData.from || this.fromEmail,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        attachments: emailData.attachments,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${error.message}`);
    }

    return await response.json();
  }

  // Send email via SendGrid
  private async sendViaSendGrid(emailData: EmailData): Promise<any> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.to }],
          subject: emailData.subject,
        }],
        from: { email: emailData.from || this.fromEmail },
        content: [
          { type: 'text/plain', value: emailData.text || '' },
          { type: 'text/html', value: emailData.html || '' },
        ],
        attachments: emailData.attachments?.map(att => ({
          content: att.content,
          filename: att.filename,
          type: att.type,
          disposition: 'attachment',
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SendGrid API error: ${error.errors?.[0]?.message || 'Unknown error'}`);
    }

    return { success: true };
  }

  // Main send method
  async sendEmail(emailData: EmailData): Promise<any> {
    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendViaResend(emailData);
        case 'sendgrid':
          return await this.sendViaSendGrid(emailData);
        default:
          throw new Error(`Unsupported email provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Email Templates
  private getWelcomeTemplate(name: string, apiKey: string, plan: string): EmailTemplate {
    const subject = `🛡️ Bem-vindo ao FraudShield Revolutionary!`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao FraudShield Revolutionary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
    .api-key { background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 15px 0; }
    .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .plan-badge { background: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ FraudShield Revolutionary</h1>
      <p>Sua defesa contra fraudes em tempo real</p>
    </div>
    
    <div class="content">
      <h2>Olá ${name}! 👋</h2>
      
      <p>Seja bem-vindo ao FraudShield Revolutionary! Sua conta foi criada com sucesso e você já pode começar a detectar fraudes em tempo real.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span class="plan-badge">Plano: ${plan.toUpperCase()}</span>
      </div>
      
      <h3>🔑 Sua API Key</h3>
      <div class="api-key">
        <strong>API Key:</strong> ${apiKey}
      </div>
      <p><small>⚠️ Mantenha sua API key segura e não a compartilhe publicamente.</small></p>
      
      <h3>🚀 Próximos Passos</h3>
      <ol>
        <li><strong>Teste a API:</strong> Faça sua primeira chamada de detecção de fraude</li>
        <li><strong>Integre ao seu sistema:</strong> Use nossa documentação para integração</li>
        <li><strong>Configure alertas:</strong> Personalize suas notificações de segurança</li>
        <li><strong>Monitore métricas:</strong> Acompanhe estatísticas no dashboard</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/dashboard" class="button">Acessar Dashboard</a>
        <a href="http://localhost:8000/api/v1/" class="button" style="background: #6c757d;">Ver Documentação</a>
      </div>
      
      <h3>📚 Recursos Úteis</h3>
      <ul>
        <li><a href="http://localhost:8000/api/v1/">Documentação da API</a></li>
        <li><a href="http://localhost:3000/dashboard">Dashboard de Métricas</a></li>
        <li><a href="mailto:support@fraudshield.revolutionary">Suporte Técnico</a></li>
      </ul>
      
      <h3>🛡️ Seus Recursos Incluem:</h3>
      <ul>
        <li>✅ Detecção de fraudes em tempo real (&lt;100ms)</li>
        <li>✅ Análise comportamental avançada</li>
        <li>✅ Inteligência comunitária de ameaças</li>
        <li>✅ Edge computing para baixa latência</li>
        <li>✅ IA explicável com transparência total</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>FraudShield Revolutionary - Protegendo seu negócio contra fraudes</p>
      <p>Se você não solicitou esta conta, pode ignorar este email.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `
🛡️ Bem-vindo ao FraudShield Revolutionary!

Olá ${name}!

Sua conta foi criada com sucesso no plano ${plan.toUpperCase()}.

API Key: ${apiKey}
⚠️ Mantenha sua API key segura.

Próximos passos:
1. Teste a API em: http://localhost:8000/api/v1/
2. Acesse o dashboard: http://localhost:3000/dashboard
3. Veja a documentação: http://localhost:8000/api/v1/

Recursos inclusos:
- Detecção de fraudes em tempo real
- Análise comportamental
- Inteligência comunitária
- Edge computing
- IA explicável

Suporte: support@fraudshield.revolutionary

FraudShield Revolutionary - Protegendo seu negócio contra fraudes
`;

    return { subject, html, text };
  }

  private getBillingTemplate(name: string, amount: number, currency: string, invoiceUrl: string): EmailTemplate {
    const subject = `💰 Fatura FraudShield - ${currency.toUpperCase()} ${amount.toFixed(2)}`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fatura FraudShield</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
    .amount { font-size: 24px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; }
    .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Fatura FraudShield</h1>
    </div>
    
    <div class="content">
      <h2>Olá ${name},</h2>
      
      <p>Sua fatura do FraudShield Revolutionary está disponível.</p>
      
      <div class="amount">
        ${currency.toUpperCase()} ${amount.toFixed(2)}
      </div>
      
      <p>O pagamento será processado automaticamente usando seu método de pagamento cadastrado.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="${invoiceUrl}" class="button">Ver Fatura Completa</a>
      </div>
      
      <p>Em caso de dúvidas, entre em contato com nosso suporte.</p>
    </div>
    
    <div class="footer">
      <p>FraudShield Revolutionary</p>
    </div>
  </div>
</body>
</html>`;

    const text = `
💰 Fatura FraudShield - ${currency.toUpperCase()} ${amount.toFixed(2)}

Olá ${name},

Sua fatura do FraudShield Revolutionary está disponível.

Valor: ${currency.toUpperCase()} ${amount.toFixed(2)}

Ver fatura: ${invoiceUrl}

O pagamento será processado automaticamente.

FraudShield Revolutionary
`;

    return { subject, html, text };
  }

  private getSecurityAlertTemplate(name: string, alertType: string, details: string): EmailTemplate {
    const subject = `🚨 Alerta de Segurança FraudShield - ${alertType}`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alerta de Segurança</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
    .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Alerta de Segurança</h1>
    </div>
    
    <div class="content">
      <h2>Olá ${name},</h2>
      
      <p>Detectamos uma atividade que requer sua atenção:</p>
      
      <div class="alert">
        <strong>Tipo de Alerta:</strong> ${alertType}<br>
        <strong>Detalhes:</strong> ${details}<br>
        <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}
      </div>
      
      <p>Caso esta atividade não tenha sido autorizada por você, recomendamos:</p>
      
      <ul>
        <li>Alterar sua senha imediatamente</li>
        <li>Revisar suas configurações de segurança</li>
        <li>Verificar logs de acesso recentes</li>
        <li>Entrar em contato com nossa equipe</li>
      </ul>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:3000/security" class="button">Verificar Segurança</a>
      </div>
    </div>
    
    <div class="footer">
      <p>FraudShield Revolutionary - Equipe de Segurança</p>
    </div>
  </div>
</body>
</html>`;

    const text = `
🚨 Alerta de Segurança FraudShield - ${alertType}

Olá ${name},

Detectamos uma atividade que requer sua atenção:

Tipo: ${alertType}
Detalhes: ${details}
Data/Hora: ${new Date().toLocaleString('pt-BR')}

Se não foi você, altere sua senha imediatamente.

Verificar segurança: http://localhost:3000/security

FraudShield Revolutionary - Equipe de Segurança
`;

    return { subject, html, text };
  }

  // Public methods for sending specific types of emails
  async sendWelcomeEmail(to: string, name: string, apiKey: string, plan: string): Promise<any> {
    const template = this.getWelcomeTemplate(name, apiKey, plan);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendBillingEmail(to: string, name: string, amount: number, currency: string, invoiceUrl: string): Promise<any> {
    const template = this.getBillingTemplate(name, amount, currency, invoiceUrl);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendSecurityAlert(to: string, name: string, alertType: string, details: string): Promise<any> {
    const template = this.getSecurityAlertTemplate(name, alertType, details);
    
    return await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendEmailVerification(to: string, name: string, verificationToken: string): Promise<any> {
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    
    const subject = "🔐 Verifique seu email - FraudShield Revolutionary";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verificação de Email</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Verificação de Email</h1>
    </div>
    
    <div class="content">
      <h2>Olá ${name},</h2>
      
      <p>Para completar o cadastro no FraudShield Revolutionary, precisamos verificar seu endereço de email.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" class="button">Verificar Email</a>
      </div>
      
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; color: #6c757d;">${verificationUrl}</p>
      
      <p><small>Este link expira em 24 horas. Se você não solicitou esta verificação, pode ignorar este email.</small></p>
    </div>
    
    <div class="footer">
      <p>FraudShield Revolutionary</p>
    </div>
  </div>
</body>
</html>`;

    const text = `
🔐 Verificação de Email - FraudShield Revolutionary

Olá ${name},

Para completar seu cadastro, verifique seu email clicando no link:

${verificationUrl}

Este link expira em 24 horas.

FraudShield Revolutionary
`;

    return await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  async sendPasswordReset(to: string, name: string, resetToken: string): Promise<any> {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const subject = "🔑 Redefinir senha - FraudShield Revolutionary";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redefinir Senha</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ffc107; color: #212529; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔑 Redefinir Senha</h1>
    </div>
    
    <div class="content">
      <h2>Olá ${name},</h2>
      
      <p>Recebemos uma solicitação para redefinir a senha da sua conta FraudShield Revolutionary.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Redefinir Senha</a>
      </div>
      
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; color: #6c757d;">${resetUrl}</p>
      
      <p><small>Este link expira em 1 hora. Se você não solicitou esta redefinição, pode ignorar este email com segurança.</small></p>
    </div>
    
    <div class="footer">
      <p>FraudShield Revolutionary</p>
    </div>
  </div>
</body>
</html>`;

    const text = `
🔑 Redefinir Senha - FraudShield Revolutionary

Olá ${name},

Para redefinir sua senha, clique no link:

${resetUrl}

Este link expira em 1 hora.

FraudShield Revolutionary
`;

    return await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }
}