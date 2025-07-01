import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function FraudDetectionPage() {
  const features = [
    {
      title: 'Análise em Tempo Real',
      description: 'Detecção instantânea de fraudes com resposta em menos de 50ms',
      icon: '⚡',
      benefits: ['Bloqueio imediato', 'Zero latência', 'Análise contínua']
    },
    {
      title: 'IA Explicável',
      description: 'Entenda exatamente por que uma transação foi marcada como fraude',
      icon: '🧠',
      benefits: ['Transparência total', 'Fatores de risco', 'Auditoria completa']
    },
    {
      title: 'Biometria Comportamental',
      description: 'Análise de padrões únicos de comportamento do usuário',
      icon: '👆',
      benefits: ['Detecção de bots', 'Perfil único', 'Análise invisível']
    },
    {
      title: 'Machine Learning Adaptativo',
      description: 'Algoritmos que aprendem continuamente com novos padrões',
      icon: '🤖',
      benefits: ['Auto-melhoria', 'Redução de falsos positivos', 'Evolução constante']
    }
  ];

  const useCases = [
    {
      title: 'E-commerce',
      description: 'Proteja vendas online contra fraudes de cartão',
      metrics: { fraud_reduction: '94%', false_positives: '0.8%', revenue_saved: 'R$ 2.5M' },
      icon: '🛒'
    },
    {
      title: 'Fintech',
      description: 'Segurança para pagamentos e transferências digitais',
      metrics: { fraud_reduction: '96%', false_positives: '0.5%', revenue_saved: 'R$ 8.1M' },
      icon: '💳'
    },
    {
      title: 'Marketplace',
      description: 'Proteja compradores e vendedores em transações P2P',
      metrics: { fraud_reduction: '92%', false_positives: '1.2%', revenue_saved: 'R$ 1.8M' },
      icon: '🏪'
    },
    {
      title: 'Gaming',
      description: 'Combata fraudes em jogos e compras virtuais',
      metrics: { fraud_reduction: '98%', false_positives: '0.3%', revenue_saved: 'R$ 450K' },
      icon: '🎮'
    }
  ];

  const stats = [
    { label: 'Taxa de Detecção', value: '94%', description: 'Fraudes identificadas' },
    { label: 'Falsos Positivos', value: '< 1%', description: 'Transações legítimas bloqueadas' },
    { label: 'Tempo de Resposta', value: '< 50ms', description: 'Análise em tempo real' },
    { label: 'Economia Média', value: 'R$ 2.5M', description: 'Por cliente por ano' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🛡️ Detecção de Fraudes
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            O sistema mais avançado de detecção de fraudes do mundo. Proteja seu negócio com 
            IA explicável, biometria comportamental e análise em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-3">
              <Link href="/demo">
                🎯 Teste Grátis por 30 Dias
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3">
              <Link href="/contact">
                📞 Falar com Especialista
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl mb-4">
              ⚡ Recursos Avançados
            </CardTitle>
            <p className="text-center text-gray-600">
              Tecnologia de ponta para máxima proteção contra fraudes
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{feature.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <span className="text-green-500 text-sm">✅</span>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl mb-4">
              🏭 Casos de Uso
            </CardTitle>
            <p className="text-center text-gray-600">
              Proteção especializada para cada tipo de negócio
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{useCase.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                      <p className="text-gray-600 text-sm">{useCase.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{useCase.metrics.fraud_reduction}</div>
                      <div className="text-xs text-gray-600">Redução de Fraudes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{useCase.metrics.false_positives}</div>
                      <div className="text-xs text-gray-600">Falsos Positivos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{useCase.metrics.revenue_saved}</div>
                      <div className="text-xs text-gray-600">Economia Anual</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl mb-4">
              ⚙️ Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Captura</h3>
                <p className="text-sm text-gray-600">Coleta dados da transação e comportamento</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Análise</h3>
                <p className="text-sm text-gray-600">IA analisa padrões e comportamentos</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Score</h3>
                <p className="text-sm text-gray-600">Gera score de risco de 0-100</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Decisão</h3>
                <p className="text-sm text-gray-600">Aprova, rejeita ou solicita revisão</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Explicação</h3>
                <p className="text-sm text-gray-600">Fornece razões detalhadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl mb-4">
              🔌 Integração Simples
            </CardTitle>
            <p className="text-center text-gray-600">
              Implementação em minutos, não em meses
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto mb-6">
              <div className="text-green-400 mb-2">// Exemplo de integração - JavaScript</div>
              <div className="mb-2">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">fraudDetex</span> = <span className="text-blue-300">require</span>(<span className="text-green-300">'@frauddetex/js'</span>);
              </div>
              <div className="mb-4">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">client</span> = <span className="text-blue-300">new</span> <span className="text-yellow-300">FraudDetex</span>(<span className="text-green-300">'YOUR_API_KEY'</span>);
              </div>
              <div className="mb-2">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">result</span> = <span className="text-blue-300">await</span> <span className="text-yellow-300">client</span>.<span className="text-blue-300">analyze</span>({'{'}
              </div>
              <div className="ml-4 mb-1">
                <span className="text-yellow-300">transactionId</span>: <span className="text-green-300">'tx_123'</span>,
              </div>
              <div className="ml-4 mb-1">
                <span className="text-yellow-300">amount</span>: <span className="text-orange-300">299.99</span>,
              </div>
              <div className="ml-4 mb-1">
                <span className="text-yellow-300">currency</span>: <span className="text-green-300">'BRL'</span>
              </div>
              <div className="mb-4">{'});'}</div>
              <div className="text-green-400">
                // result.fraudScore: 0-100<br/>
                // result.decision: 'approve' | 'reject' | 'review'
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Suporte para mais de 15 linguagens de programação
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['JavaScript', 'Python', 'PHP', 'Java', 'C#', 'Go', 'Ruby'].map((lang) => (
                  <Badge key={lang} variant="outline" className="border-blue-200 text-blue-600">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pare de Perder Dinheiro com Fraudes
          </h2>
          <p className="text-xl opacity-90 mb-6">
            Teste gratuitamente por 30 dias e veja a diferença em sua operação
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/signup">
                🚀 Começar Teste Grátis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3">
              <Link href="/demo">
                🎯 Ver Demo ao Vivo
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}