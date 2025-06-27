'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Silva',
    role: 'CTO',
    company: 'TechPay',
    industry: 'Fintech',
    volume: '50M+ transações/mês',
    content: 'O FraudShield revolucionou nossa operação. Reduziu fraudes em 94% e economizou R$ 2.3M em apenas 6 meses. A detecção em tempo real é impressionante e a IA explicável nos deu a confiança que precisávamos.',
    avatar: '👨‍💼',
    metrics: {
      fraud_reduction: '94%',
      savings: 'R$ 2.3M',
      timeframe: '6 meses'
    },
    featured: true
  },
  {
    id: 2,
    name: 'Ana Costa',
    role: 'Head of Security',
    company: 'BankTech',
    industry: 'Banco Digital',
    volume: '200M+ transações/mês',
    content: 'Primeira vez que vejo IA explicável funcionando na prática. O compliance adorou a transparência das decisões. Implementação foi super rápida e o suporte técnico é excepcional.',
    avatar: '👩‍💼',
    metrics: {
      compliance: '100%',
      implementation: '24h',
      transparency: 'Total'
    },
    featured: true
  },
  {
    id: 3,
    name: 'Roberto Lima',
    role: 'CEO',
    company: 'ShopSecure',
    industry: 'E-commerce',
    volume: '1M+ pedidos/mês',
    content: 'ROI de 450% no primeiro ano. Nossos clientes confiam mais no checkout, conversão subiu 23%. O sistema não só previne fraudes, mas melhora a experiência do usuário.',
    avatar: '👨‍💻',
    metrics: {
      roi: '450%',
      conversion: '+23%',
      timeframe: '1 ano'
    },
    featured: true
  },
  {
    id: 4,
    name: 'Marina Santos',
    role: 'CFO',
    company: 'InsurTech Pro',
    industry: 'Seguros',
    volume: '10M+ análises/mês',
    content: 'Detectou esquemas sofisticados que passavam despercebidos. Economia de R$ 5M em sinistros fraudulentos. A biometria comportamental é um diferencial incrível.',
    avatar: '👩‍💼',
    metrics: {
      detection: '99.2%',
      savings: 'R$ 5M',
      accuracy: '99.2%'
    },
    featured: false
  },
  {
    id: 5,
    name: 'Diego Ferreira',
    role: 'VP Technology',
    company: 'CryptoExchange',
    industry: 'Crypto',
    volume: '5M+ trades/mês',
    content: 'Proteção essencial contra ataques sofisticados. Edge computing com menos de 50ms é perfeito para trading de alta frequência. Zero falsos positivos em operações legítimas.',
    avatar: '👨‍💻',
    metrics: {
      response_time: '<50ms',
      false_positives: '0%',
      availability: '99.99%'
    },
    featured: false
  },
  {
    id: 6,
    name: 'Lucia Oliveira',
    role: 'Security Manager',
    company: 'RetailChain',
    industry: 'Varejo',
    volume: '500K+ transações/dia',
    content: 'Implementação mais fácil que já vi. Dashboard intuitivo, alertas precisos, e a economia já pagou o investimento 3x. Recomendo para qualquer empresa que leva segurança a sério.',
    avatar: '👩‍💼',
    metrics: {
      payback: '3x',
      alerts: '99.8%',
      setup_time: '<2h'
    },
    featured: false
  }
];

const companies = [
  { name: 'TechPay', logo: '🏦', category: 'Fintech' },
  { name: 'BankTech', logo: '🏛️', category: 'Banking' },
  { name: 'ShopSecure', logo: '🛒', category: 'E-commerce' },
  { name: 'InsurTech Pro', logo: '🛡️', category: 'Insurance' },
  { name: 'CryptoExchange', logo: '₿', category: 'Crypto' },
  { name: 'RetailChain', logo: '🏪', category: 'Retail' },
  { name: 'PaymentHub', logo: '💳', category: 'Payments' },
  { name: 'SecureBank', logo: '🔐', category: 'Banking' }
];

const industryStats = [
  { industry: 'Fintech', companies: '150+', avg_reduction: '92%' },
  { industry: 'E-commerce', companies: '300+', avg_reduction: '89%' },
  { industry: 'Banking', companies: '75+', avg_reduction: '96%' },
  { industry: 'Insurance', companies: '50+', avg_reduction: '94%' },
  { industry: 'Crypto', companies: '25+', avg_reduction: '98%' }
];

interface TestimonialsSectionProps {
  variant?: 'homepage' | 'pricing' | 'full';
  limit?: number;
}

export default function TestimonialsSection({ 
  variant = 'homepage', 
  limit 
}: TestimonialsSectionProps) {
  const displayTestimonials = limit 
    ? testimonials.slice(0, limit)
    : variant === 'homepage' 
      ? testimonials.filter(t => t.featured)
      : testimonials;

  if (variant === 'full') {
    return (
      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-green-400 text-sm font-medium">✅ Casos de Sucesso Reais</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Empresas que <span className="text-green-400">Economizaram Milhões</span><br />
              com o FraudShield
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Veja como diferentes setores estão usando nossa tecnologia para combater fraudes
              e proteger seus negócios com resultados comprovados.
            </p>

            {/* Trust Stats */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">1000+</div>
                <div className="text-sm text-slate-400">Empresas Protegidas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">R$ 50M+</div>
                <div className="text-sm text-slate-400">Economia Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99.7%</div>
                <div className="text-sm text-slate-400">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Empresas que Confiam no FraudShield
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {companies.map((company, index) => (
                <div key={index} className="flex items-center space-x-3 bg-slate-800/30 rounded-lg px-6 py-3">
                  <span className="text-2xl">{company.logo}</span>
                  <div>
                    <div className="font-medium text-white">{company.name}</div>
                    <div className="text-xs text-slate-400">{company.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Stats */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Resultados por Setor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {industryStats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-white mb-2">{stat.avg_reduction}</div>
                    <div className="text-sm text-slate-300 mb-1">{stat.industry}</div>
                    <div className="text-xs text-slate-400">{stat.companies} empresas</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`bg-slate-800/50 border-slate-700 ${testimonial.featured ? 'ring-2 ring-green-500/20' : ''}`}>
                <CardContent className="p-6">
                  {testimonial.featured && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20 mb-4">
                      ⭐ Caso Destaque
                    </Badge>
                  )}
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                      <div className="text-xs text-slate-500">{testimonial.company} • {testimonial.industry}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-4 italic text-sm">&quot;{testimonial.content}&quot;</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    Volume: {testimonial.volume}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-green-400 text-sm font-medium">✅ Resultados Comprovados</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            O que Nossos Clientes Estão Dizendo
          </h2>
          
          <p className="text-slate-300 max-w-2xl mx-auto">
            Veja como empresas de diferentes setores estão economizando milhões e protegendo seus negócios.
          </p>
        </div>

        {/* Companies */}
        {variant === 'pricing' && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 opacity-60">
            {companies.slice(0, 6).map((company, index) => (
              <div key={index} className="flex items-center space-x-2 text-slate-400">
                <span className="text-lg">{company.logo}</span>
                <span className="text-sm font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-slate-800/50 border-slate-700">
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
                
                <p className="text-slate-300 mb-4 italic text-sm">"{testimonial.content}"</p>
                
                <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                  {Object.values(testimonial.metrics)[0]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}