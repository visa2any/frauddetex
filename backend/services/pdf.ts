/**
 * 📄 FraudShield Revolutionary - PDF Generation Service
 * 
 * Invoice and document PDF generation
 * Features:
 * - Invoice PDF generation
 * - Report generation
 * - Custom templates
 * - Styling and branding
 */

export interface InvoiceData {
  id: string;
  user: {
    name: string;
    email: string;
    company_name: string;
  };
  amount: number;
  currency: string;
  status: string;
  created_date: Date;
  due_date: Date;
  period_start: Date;
  period_end: Date;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  total: number;
  subtotal: number;
  tax?: number;
  tax_rate?: number;
}

export class PDFService {
  
  async generateInvoicePDF(invoice: InvoiceData): Promise<Uint8Array> {
    // Generate HTML content for the invoice
    const htmlContent = this.generateInvoiceHTML(invoice);
    
    // In a real implementation, you would use a library like puppeteer or jsPDF
    // For now, we'll create a simple text-based PDF representation
    const pdfContent = this.htmlToPDF(htmlContent);
    
    return new TextEncoder().encode(pdfContent);
  }

  private generateInvoiceHTML(invoice: InvoiceData): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fatura ${invoice.id} - FraudShield Revolutionary</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }
    
    .invoice-info {
      text-align: right;
    }
    
    .invoice-title {
      font-size: 28px;
      color: #333;
      margin: 0;
    }
    
    .invoice-number {
      color: #666;
      margin: 5px 0;
    }
    
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
    }
    
    .billing-info {
      flex: 1;
    }
    
    .billing-info h3 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .billing-info p {
      margin: 5px 0;
      color: #666;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    
    .items-table th,
    .items-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }
    
    .items-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    
    .items-table .amount {
      text-align: right;
    }
    
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e1e5e9;
    }
    
    .total-row.final {
      font-weight: bold;
      font-size: 18px;
      border-bottom: 3px solid #667eea;
      color: #333;
    }
    
    .payment-info {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    
    .payment-info h3 {
      color: #667eea;
      margin-bottom: 15px;
    }
    
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status.paid {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status.pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status.failed {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    
    .period-info {
      background-color: #e3f2fd;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .period-info h4 {
      margin: 0 0 10px 0;
      color: #1976d2;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 15px;
      }
      
      .header {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🛡️ FraudShield Revolutionary</div>
      <p style="margin: 5px 0; color: #666;">Proteção contra fraudes em tempo real</p>
    </div>
    <div class="invoice-info">
      <h1 class="invoice-title">FATURA</h1>
      <p class="invoice-number">#${invoice.id}</p>
      <span class="status ${invoice.status}">${this.getStatusText(invoice.status)}</span>
    </div>
  </div>

  <div class="billing-section">
    <div class="billing-info">
      <h3>Dados do Cliente</h3>
      <p><strong>${invoice.user.name}</strong></p>
      <p>${invoice.user.company_name}</p>
      <p>${invoice.user.email}</p>
    </div>
    
    <div class="billing-info">
      <h3>Informações da Fatura</h3>
      <p><strong>Data de Emissão:</strong> ${this.formatDate(invoice.created_date)}</p>
      <p><strong>Data de Vencimento:</strong> ${this.formatDate(invoice.due_date)}</p>
      <p><strong>Moeda:</strong> ${invoice.currency.toUpperCase()}</p>
    </div>
  </div>

  <div class="period-info">
    <h4>Período de Cobrança</h4>
    <p>${this.formatDate(invoice.period_start)} - ${this.formatDate(invoice.period_end)}</p>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Descrição</th>
        <th style="text-align: center;">Quantidade</th>
        <th style="text-align: right;">Valor Unitário</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: center;">${item.quantity.toLocaleString()}</td>
          <td class="amount">${this.formatCurrency(item.rate, invoice.currency)}</td>
          <td class="amount">${this.formatCurrency(item.amount, invoice.currency)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>${this.formatCurrency(invoice.subtotal, invoice.currency)}</span>
    </div>
    ${invoice.tax ? `
      <div class="total-row">
        <span>Impostos (${invoice.tax_rate}%):</span>
        <span>${this.formatCurrency(invoice.tax, invoice.currency)}</span>
      </div>
    ` : ''}
    <div class="total-row final">
      <span>Total:</span>
      <span>${this.formatCurrency(invoice.total, invoice.currency)}</span>
    </div>
  </div>

  <div class="payment-info">
    <h3>Informações de Pagamento</h3>
    <p><strong>Status:</strong> <span class="status ${invoice.status}">${this.getStatusText(invoice.status)}</span></p>
    ${invoice.status === 'paid' ? 
      '<p style="color: #28a745;"><strong>✓ Pagamento processado com sucesso</strong></p>' : 
      '<p>O pagamento será processado automaticamente usando o método cadastrado em sua conta.</p>'
    }
  </div>

  <div class="footer">
    <p><strong>FraudShield Revolutionary</strong></p>
    <p>Obrigado por confiar em nossos serviços de proteção contra fraudes!</p>
    <p>Em caso de dúvidas, entre em contato: <strong>billing@fraudshield.revolutionary</strong></p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e1e5e9;">
    <p style="font-size: 12px;">
      Esta é uma fatura gerada automaticamente pelo sistema FraudShield Revolutionary.<br>
      Documento gerado em ${this.formatDate(new Date())}
    </p>
  </div>
</body>
</html>`;
  }

  private htmlToPDF(html: string): string {
    // In a real implementation, this would use a proper HTML to PDF converter
    // For now, we'll create a simplified text representation
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F1 18 Tf
50 750 Td
(FraudShield Revolutionary - Fatura) Tj
0 -30 Td
/F1 12 Tf
(Esta e uma representacao simplificada da fatura) Tj
0 -20 Td
(Para visualizar a fatura completa, acesse o dashboard) Tj
0 -40 Td
(Data de geracao: ${new Date().toLocaleDateString('pt-BR')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000000380 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
456
%%EOF`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'failed': 'Falhou',
      'draft': 'Rascunho',
      'open': 'Em Aberto',
      'void': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  // Generate usage report PDF
  async generateUsageReportPDF(data: {
    user: any;
    period: { start: Date; end: Date };
    usage: {
      total_requests: number;
      fraud_detected: number;
      fraud_rate: number;
      top_countries: Array<{ country: string; count: number }>;
      daily_usage: Array<{ date: Date; requests: number; fraud: number }>;
    };
  }): Promise<Uint8Array> {
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Uso - FraudShield</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .stats { display: flex; justify-content: space-around; margin: 30px 0; }
    .stat-box { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .chart { margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ FraudShield Revolutionary</h1>
    <h2>Relatório de Uso</h2>
    <p>${data.user.company_name} | ${this.formatDate(data.period.start)} - ${this.formatDate(data.period.end)}</p>
  </div>

  <div class="stats">
    <div class="stat-box">
      <h3>${data.usage.total_requests.toLocaleString()}</h3>
      <p>Total de Requests</p>
    </div>
    <div class="stat-box">
      <h3>${data.usage.fraud_detected.toLocaleString()}</h3>
      <p>Fraudes Detectadas</p>
    </div>
    <div class="stat-box">
      <h3>${(data.usage.fraud_rate * 100).toFixed(2)}%</h3>
      <p>Taxa de Fraude</p>
    </div>
  </div>

  <h3>Países com Mais Atividade</h3>
  <table>
    <tr><th>País</th><th>Requests</th></tr>
    ${data.usage.top_countries.map(country => 
      `<tr><td>${country.country}</td><td>${country.count.toLocaleString()}</td></tr>`
    ).join('')}
  </table>

  <h3>Uso Diário</h3>
  <table>
    <tr><th>Data</th><th>Requests</th><th>Fraudes</th></tr>
    ${data.usage.daily_usage.map(day => 
      `<tr>
        <td>${this.formatDate(day.date)}</td>
        <td>${day.requests.toLocaleString()}</td>
        <td>${day.fraud.toLocaleString()}</td>
       </tr>`
    ).join('')}
  </table>
</body>
</html>`;

    return new TextEncoder().encode(this.htmlToPDF(htmlContent));
  }
}