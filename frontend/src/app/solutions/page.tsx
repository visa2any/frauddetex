'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const solutions = [
  {
    id: 'fintech',
    title: 'Fintech & Pagamentos Digitais',
    icon: '💳',
    description: 'Proteção completa para fintechs, bancos digitais e processadores de pagamento.',
    challenges: [
      'Account takeover em massa',
      'Fraudes no PIX e TED',
      'Synthetic identity fraud',
      'Money laundering digital',
      'Compliance regulatório',
      'Falsos positivos altos'
    ],
    solutions: [
      'Biometria comportamental em tempo real',
      'IA explicável para compliance',
      'Análise de rede neural para ML',
      'Edge computing <50ms',
      'Inteligência coletiva P2P',
      'Dashboard executivo avançado'
    ],
    results: {
      fraud_reduction: '94%',
      false_positives: '0.3%',
      roi: '450%',
      compliance: '100%'
    },
    case_study: {
      company: 'TechPay',
      size: '50M+ transações/mês',
      challenge: 'Fraudes custavam R$ 2.3M mensais com 85% falsos positivos',
      solution: 'Implementação completa FraudShield em 24h',
      results: [
        'R$ 2.3M economizados em 6 meses',
        '94% redução em fraudes reais',
        '0.3% taxa de falsos positivos',
        '23% aumento na conversão'
      ]
    },
    features: [
      'API REST sub-50ms',
      'SDK para principais linguagens',
      'Webhook em tempo real',
      'Dashboard compliance',
      'Relatórios regulatórios',
      'Alertas customizáveis'
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Marketplace',
    icon: '🛒',
    description: 'Proteção end-to-end para lojas online, marketplaces e plataformas de e-commerce.',
    challenges: [
      'Chargebacks fraudulentos',
      'Account takeover de clientes',
      'Fraudes no checkout',
      'Bot attacks e scraping',
      'Fake reviews e sellers',
      'Return fraud'
    ],
    solutions: [
      'Proteção de checkout inteligente',
      'Detecção de bots avançada',
      'Análise comportamental de compra',
      'Verificação de identidade suave',
      'Proteção de conta contínua',
      'Sistema de scoring adaptativo'
    ],
    results: {
      chargeback_reduction: '87%',
      conversion_increase: '23%',
      bot_detection: '99.8%',
      cart_abandonment: '-35%'
    },
    case_study: {
      company: 'ShopSecure',
      size: '1M+ pedidos/mês',
      challenge: 'Chargebacks custavam R$ 800K mensais, conversão baixa por fricção',
      solution: 'Proteção invisível em toda jornada de compra',
      results: [
        '87% redução em chargebacks',
        '23% aumento na conversão',
        'R$ 1.2M economizados anualmente',
        '95% satisfação do cliente'
      ]
    },
    features: [
      'Checkout protection',
      'Bot mitigation',
      'User journey analysis',
      'Real-time scoring',
      'A/B testing integrado',
      'Merchant dashboard'
    ]
  },
  {
    id: 'banking',
    title: 'Banking & Instituições Financeiras',
    icon: '🏦',
    description: 'Soluções enterprise para bancos tradicionais, digitais e cooperativas de crédito.',
    challenges: [
      'Regulamentação BACEN',
      'Compliance PCI DSS',
      'Fraudes em crédito',
      'Money laundering',
      'Insider threats',
      'Legacy system integration'
    ],
    solutions: [
      'Compliance automático BACEN',
      'IA explicável para auditoria',
      'Integração legacy via API',
      'Monitoramento 24/7',
      'Threat intelligence banking',
      'Executive reporting'
    ],
    results: {
      regulatory_compliance: '100%',
      audit_success: '100%',
      fraud_prevention: '96%',
      operational_efficiency: '+40%'
    },
    case_study: {
      company: 'BankTech',
      size: '200M+ transações/mês',
      challenge: 'Auditoria PCI DSS reprovada, compliance BACEN em risco',
      solution: 'IA explicável + compliance automático',
      results: [
        '100% aprovação PCI DSS',
        'Zero apontamentos BACEN',
        'R$ 5M economizados em multas',
        '40% redução em custos operacionais'
      ]
    },
    features: [
      'Regulatory reporting',
      'Audit trail completo',
      'Legacy integration',
      'Executive dashboards',
      'Risk modeling',
      'Compliance automation'
    ]
  },
  {
    id: 'insurance',
    title: 'Seguros & InsurTech',
    icon: '🛡️',
    description: 'Proteção especializada contra fraudes em seguros, claims e underwriting.',
    challenges: [
      'Claims fraudulentos',
      'Exaggerated claims',
      'Identity fraud',
      'Premium fraud',
      'Provider fraud',
      'Complex investigations'
    ],
    solutions: [
      'Claims analysis automation',
      'Pattern recognition ML',
      'Network analysis fraud rings',
      'Document verification AI',
      'Investigation workflow',
      'Predictive risk modeling'
    ],
    results: {
      claims_fraud_detection: '92%',
      investigation_time: '-60%',
      false_claims_reduction: '78%',
      cost_savings: 'R$ 15M+'
    },
    case_study: {
      company: 'InsurTech Pro',
      size: '10M+ análises/mês',
      challenge: 'Fraudes em sinistros custavam R$ 5M anuais',
      solution: 'IA para análise automática de claims',
      results: [
        'R$ 5M economizados em sinistros',
        '92% detecção de fraudes',
        '60% redução em tempo de investigação',
        'ROI de 380% no primeiro ano'
      ]
    },
    features: [
      'Claims automation',
      'Document analysis',
      'Fraud ring detection',
      'Investigation tools',
      'Risk assessment',
      'Regulatory compliance'
    ]
  }
];

export default function SolutionsPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="solutions" />

        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-400 text-sm font-medium">🎯 Soluções por Setor</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              Proteção Anti-Fraude <br />
              <span className="text-purple-400">Personalizada por Setor</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Soluções especializadas para diferentes indústrias, com <strong className="text-white">casos de uso específicos</strong> e 
              <strong className="text-white"> ROI comprovado</strong> em cada setor.
            </p>

            {/* Industry Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">1000+</div>
                <div className="text-sm text-slate-400">Empresas Protegidas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">R$ 50M+</div>
                <div className="text-sm text-slate-400">Economia Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">94%</div>
                <div className="text-sm text-slate-400">Redução Média Fraudes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">450%</div>
                <div className="text-sm text-slate-400">ROI Médio</div>
              </div>
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="space-y-24">
            {solutions.map((solution, index) => (
              <div key={solution.id} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-12 items-center`}>
                {/* Solution Content */}
                <div className="flex-1">
                  <div className="text-6xl mb-6">{solution.icon}</div>
                  
                  <h2 className="text-4xl font-bold text-white mb-6">
                    {solution.title}
                  </h2>
                  
                  <p className="text-xl text-slate-300 mb-8">
                    {solution.description}
                  </p>

                  {/* Key Results */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {Object.entries(solution.results).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">{value}</div>
                        <div className="text-xs text-slate-400 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      Ver Caso de Uso
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Solicitar Demo
                    </Button>
                  </div>
                </div>

                {/* Case Study Card */}
                <div className="flex-1 max-w-lg">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                          Caso de Sucesso
                        </Badge>
                        <div className="text-slate-400 text-sm">{solution.case_study.size}</div>
                      </div>
                      
                      <CardTitle className="text-xl text-white">
                        {solution.case_study.company}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-red-400 mb-2">🚨 Desafio</h4>
                          <p className="text-sm text-slate-300">{solution.case_study.challenge}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-2">⚡ Solução</h4>
                          <p className="text-sm text-slate-300">{solution.case_study.solution}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-green-400 mb-2">✅ Resultados</h4>
                          <ul className="space-y-1">
                            {solution.case_study.results.map((result, idx) => (
                              <li key={idx} className="text-sm text-slate-300 flex items-start">
                                <span className="text-green-400 mr-2">•</span>
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Funcionalidades por Setor
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Cada solução é otimizada para os desafios específicos do seu setor
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-slate-800/30 rounded-lg">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-white font-semibold">Funcionalidade</th>
                    {solutions.map((solution) => (
                      <th key={solution.id} className="text-center p-4 text-white font-semibold">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">{solution.icon}</span>
                          <span className="text-sm">{solution.title.split(' ')[0]}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Biometria Comportamental',
                    'IA Explicável',
                    'Edge Computing',
                    'Compliance Automático',
                    'Dashboard Executivo',
                    'API Real-time',
                    'Inteligência Coletiva',
                    'Relatórios Customizados'
                  ].map((feature, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="p-4 text-slate-300 font-medium">{feature}</td>
                      {solutions.map((solution) => (
                        <td key={solution.id} className="p-4 text-center">
                          <span className="text-green-400 text-xl">✓</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 max-w-4xl mx-auto">
              <CardContent className="p-12">
                <div className="text-4xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Pronto para Proteger Seu Setor?
                </h3>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Descubra como o FraudShield pode ser personalizado para os desafios específicos 
                  da sua indústria. Comece com uma demo gratuita.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-3">
                    🎯 Solicitar Demo Personalizada
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-3"
                  >
                    📞 Falar com Especialista
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-sm text-slate-400">
                  <div className="flex items-center justify-center">
                    <span className="mr-2">✅</span>
                    Demo em 24h
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-2">✅</span>
                    Implementação em 48h
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-2">✅</span>
                    Suporte especializado
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}