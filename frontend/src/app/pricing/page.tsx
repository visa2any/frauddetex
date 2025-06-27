'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';

const plans = [
  {
    name: 'Community',
    price: 'Gratuito',
    monthlyPrice: 0,
    description: 'Para desenvolvedores e pequenos projetos',
    features: [
      '10.000 requests mensais grátis',
      'Detecção básica de fraude',
      'Dashboard web básico',
      'Suporte por email',
      'Documentação completa',
      'SDKs principais (JS, Python, PHP)'
    ],
    limitations: [
      'Sem análise comportamental',
      'Sem relatórios avançados',
      'Sem suporte prioritário'
    ],
    cta: 'Começar Grátis',
    popular: false,
    security: '🛡️ Proteção Básica'
  },
  {
    name: 'Smart Protection',
    price: 'R$ 199',
    monthlyPrice: 199,
    description: 'Para empresas que levam segurança a sério',
    features: [
      '100.000 requests mensais inclusos',
      'R$ 0,05 por request adicional',
      'Biometria comportamental avançada',
      'Análise de risco em tempo real',
      'Dashboard executivo completo',
      'Relatórios customizáveis',
      'Integração com sistemas existentes',
      'Suporte prioritário 24/7',
      'Garantia de reembolso 30 dias'
    ],
    limitations: [],
    cta: 'Proteger Agora',
    popular: true,
    security: '🔒 Proteção Avançada'
  },
  {
    name: 'Enterprise Shield',
    price: 'R$ 799',
    monthlyPrice: 799,
    description: 'Máxima proteção para grandes volumes',
    features: [
      '1.000.000 requests mensais inclusos',
      'R$ 0,03 por request adicional',
      'IA explicável e auditável',
      'Inteligência coletiva P2P',
      'Edge computing < 50ms',
      'Compliance automático',
      'Implementação dedicada',
      'Suporte técnico especializado',
      'SLA 99.9% uptime',
      'Customizações avançadas'
    ],
    limitations: [],
    cta: 'Solicitar Demo',
    popular: false,
    security: '🛡️ Blindagem Corporativa'
  },
  {
    name: 'Insurance Grade',
    price: 'Consultar',
    monthlyPrice: 0,
    description: 'Proteção de nível bancário e seguradoras',
    features: [
      'Requests ilimitados',
      'Infraestrutura dedicada',
      'Conformidade PCI DSS',
      'Auditoria independente',
      'Implementação on-premise',
      'Modelo de IA personalizado',
      'Suporte 24/7 especializado',
      'Garantia de uptime 99.99%',
      'Treinamento da equipe'
    ],
    limitations: [],
    cta: 'Falar com Especialista',
    popular: false,
    security: '🏦 Segurança Bancária'
  }
];

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'CTO, TechPay',
    company: 'Fintech (50M+ transações/mês)',
    content: 'Reduziu fraudes em 94% e economizou R$ 2.3M em 6 meses. A detecção em tempo real é impressionante.',
    avatar: '👨‍💼',
    metrics: '94% menos fraudes'
  },
  {
    name: 'Ana Costa',
    role: 'Head of Security, BankTech',
    company: 'Banco Digital',
    content: 'Primeira vez que vejo IA explicável funcionando na prática. Compliance adorou a transparência.',
    avatar: '👩‍💼',
    metrics: '100% compliance'
  },
  {
    name: 'Roberto Lima',
    role: 'CEO, ShopSecure',
    company: 'E-commerce (1M+ pedidos/mês)',
    content: 'ROI de 450% no primeiro ano. Clientes confiam mais, conversão subiu 23%.',
    avatar: '👨‍💻',
    metrics: '450% ROI'
  }
];

const trustBadges = [
  { name: 'PCI DSS Compliant', icon: '🔒' },
  { name: 'LGPD Certified', icon: '🛡️' },
  { name: 'ISO 27001', icon: '🏆' },
  { name: 'SOC 2 Type II', icon: '✅' },
  { name: '99.9% SLA', icon: '⚡' },
  { name: 'Pentesting', icon: '🔍' }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [monthlyTransactions, setMonthlyTransactions] = useState(50000);

  const calculateCost = (transactions: number): number | string => {
    if (transactions <= 10000) return 0;
    if (transactions <= 100000) return 199 + Math.max(0, (transactions - 100000)) * 0.05;
    if (transactions <= 1000000) return 799 + Math.max(0, (transactions - 1000000)) * 0.03;
    return 'Consultar';
  };

  const calculateCostNumeric = (transactions: number): number => {
    const cost = calculateCost(transactions);
    return typeof cost === 'number' ? cost : 0;
  };

  const calculateSavings = (transactions: number) => {
    const fraudRate = 0.002; // 0.2% taxa média de fraude
    const avgTransactionValue = 150;
    const potentialLoss = transactions * fraudRate * avgTransactionValue;
    const detectionRate = 0.94; // 94% detecção
    return potentialLoss * detectionRate;
  };

  return (
    <>
      <MetaTags 
        title="Preços FraudShield - Planos de Proteção Anti-Fraude | Freemium"
        description="Escolha o melhor plano de proteção anti-fraude. Começe grátis com 10K requests. Planos a partir de R$ 199/mês. ROI de 450% comprovado."
        keywords="preços anti-fraude, planos fraud detection, freemium cybersecurity, preço fraud shield, custo proteção fraude"
        url="https://fraudshield.com/pricing"
        type="website"
      />
      <StructuredData type="product" />
      <StructuredData type="faq" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="pricing" />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-red-400 text-sm font-medium">🚨 ALERTA: Fraudes custam R$ 50 bilhões/ano no Brasil</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            Pare de <span className="text-red-400">Perder Dinheiro</span><br />
            com Fraudes
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            O primeiro sistema de proteção anti-fraude com <strong>IA explicável</strong> do mundo. 
            Detecte 94% das fraudes em tempo real e economize milhões.
          </p>

          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">94%</div>
              <div className="text-sm text-slate-400">Detecção de Fraudes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">&lt;50ms</div>
              <div className="text-sm text-slate-400">Tempo de Resposta</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">450%</div>
              <div className="text-sm text-slate-400">ROI Médio</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-xs text-slate-300 font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Calculator */}
        <div className="mb-16">
          <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
                <span>🧮</span>
                <span>Calcule Sua Economia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transações mensais
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={monthlyTransactions}
                    onChange={(e) => setMonthlyTransactions(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1K</span>
                    <span className="font-bold text-white">{monthlyTransactions.toLocaleString()}</span>
                    <span>1M</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400 mb-1">Custo Mensal</div>
                    <div className="text-2xl font-bold text-white">
                      {typeof calculateCost(monthlyTransactions) === 'number' 
                        ? `R$ ${(calculateCost(monthlyTransactions) as number).toLocaleString()}`
                        : calculateCost(monthlyTransactions)
                      }
                    </div>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 text-center">
                    <div className="text-sm text-green-400 mb-1">Economia Mensal</div>
                    <div className="text-2xl font-bold text-green-400">
                      R$ {calculateSavings(monthlyTransactions).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">ROI Projetado</div>
                  <div className="text-4xl font-bold text-purple-400">
                    {Math.round((calculateSavings(monthlyTransactions) / Math.max(1, calculateCostNumeric(monthlyTransactions))) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Escolha Seu Nível de Proteção</h2>
            <p className="text-slate-300">Planos desenhados para diferentes níveis de risco e volume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative bg-slate-800/50 border-2 ${plan.popular ? 'border-red-500' : 'border-slate-700'} hover:border-red-400 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-500 text-white">Mais Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-white text-xl mb-2">{plan.name}</CardTitle>
                    <div className="text-sm text-slate-400 mb-4">{plan.security}</div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      {plan.monthlyPrice > 0 && <span className="text-slate-400">/mês</span>}
                    </div>
                    <p className="text-sm text-slate-300">{plan.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-green-400 text-sm mt-0.5">✓</span>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-slate-500 text-sm mt-0.5">✗</span>
                        <span className="text-sm text-slate-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} text-white`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Empresas Protegidas pelo FraudShield</h2>
            <p className="text-slate-300">Veja o que nossos clientes estão economizando</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                      <div className="text-xs text-slate-500">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                  
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                    {testimonial.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Urgency Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/20">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Cada Minuto Sem Proteção = Dinheiro Perdido</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Enquanto você lê isso, fraudadores estão atacando sistemas desprotegidos. 
                Não seja a próxima vítima - proteja seu negócio agora.
              </p>
              
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div>
                  <div className="text-2xl font-bold text-red-400">R$ 137.000</div>
                  <div className="text-sm text-slate-400">Perdido por hora no Brasil</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">2.3 seg</div>
                  <div className="text-sm text-slate-400">Nova tentativa de fraude</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-3">
                  🚀 Proteger Agora - Grátis por 30 Dias
                </Button>
                <p className="text-xs text-slate-400">
                  ✅ Sem compromisso • ✅ Cancelamento a qualquer momento • ✅ Garantia de reembolso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Como funciona a garantia de reembolso?",
                a: "Se não detectarmos pelo menos 80% das fraudes em 30 dias, devolvemos 100% do valor pago."
              },
              {
                q: "Quanto tempo leva para implementar?",
                a: "Implementação completa em menos de 24 horas. API REST simples, SDKs prontos para principais linguagens."
              },
              {
                q: "É compatível com meu sistema atual?",
                a: "Sim! Funciona com qualquer sistema via API REST. Integrações nativas para Shopify, WooCommerce, e principais gateways."
              },
              {
                q: "O que acontece se eu ultrapassar o limite?",
                a: "Cobramos apenas o excedente. Sem surpresas, sem bloqueios. Você continua protegido."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                  <p className="text-slate-300">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Pronto para Parar de Perder Dinheiro?</h3>
              <p className="text-slate-300 mb-6">
                Junte-se a centenas de empresas que já economizaram milhões com o FraudShield.
              </p>
              
              <div className="space-y-4">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-3 w-full">
                  🛡️ Começar Proteção Gratuita
                </Button>
                <Button variant="outline" size="lg" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white w-full">
                  📞 Falar com Especialista
                </Button>
              </div>
              
              <p className="text-xs text-slate-400 mt-4">
                🔒 Dados protegidos por criptografia militar • 🏆 Certificado ISO 27001 • ⚡ Disponível 24/7
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
        <Footer />
      </div>
    </>
  );
}