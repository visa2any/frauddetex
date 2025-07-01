import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function APIPage() {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/fraud/analyze',
      description: 'Analisa uma transação em busca de fraudes',
      status: 'stable'
    },
    {
      method: 'GET',
      path: '/api/v1/fraud/history',
      description: 'Histórico de análises de fraude',
      status: 'stable'
    },
    {
      method: 'POST',
      path: '/api/v1/behavioral/profile',
      description: 'Cria perfil biométrico comportamental',
      status: 'beta'
    },
    {
      method: 'GET',
      path: '/api/v1/threats/community',
      description: 'Obtém dados de ameaças da comunidade',
      status: 'stable'
    }
  ];

  const libraries = [
    {
      language: 'JavaScript/Node.js',
      name: '@frauddetex/js',
      install: 'npm install @frauddetex/js',
      icon: '📦'
    },
    {
      language: 'Python',
      name: 'frauddetex-python',
      install: 'pip install frauddetex',
      icon: '🐍'
    },
    {
      language: 'PHP',
      name: 'frauddetex/php',
      install: 'composer require frauddetex/php',
      icon: '🐘'
    },
    {
      language: 'Java',
      name: 'com.frauddetex:sdk',
      install: 'maven dependency',
      icon: '☕'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔌 API Reference FraudDetex
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Integre detecção de fraudes em tempo real em sua aplicação com nossa API RESTful
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/docs/quickstart">
                🚀 Início Rápido
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Link href="/demo">
                🎯 Testar API
              </Link>
            </Button>
          </div>
        </div>

        {/* Authentication */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔐</span>
              <span>Autenticação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm mb-4">
              <div className="text-green-400 mb-2"># Obtenha sua API Key no dashboard</div>
              <div>curl -H "Authorization: Bearer YOUR_API_KEY" \</div>
              <div className="ml-4">https://api.frauddetex.com/v1/fraud/analyze</div>
            </div>
            <p className="text-gray-600">
              Todas as requisições devem incluir sua API Key no header Authorization. 
              Obtenha sua chave no <Link href="/dashboard" className="text-blue-600 hover:underline">dashboard</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>Endpoints Principais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={endpoint.method === 'POST' ? 'default' : 'secondary'}
                        className={endpoint.method === 'POST' ? 'bg-green-600' : 'bg-blue-600'}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <Badge variant={endpoint.status === 'stable' ? 'default' : 'secondary'}>
                      {endpoint.status === 'stable' ? '✅ Stable' : '🧪 Beta'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDKs */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📚</span>
              <span>SDKs e Bibliotecas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {libraries.map((lib, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{lib.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lib.language}</h3>
                      <p className="text-sm text-gray-600">{lib.name}</p>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-2 text-white font-mono text-sm">
                    {lib.install}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Example */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💻</span>
              <span>Exemplo de Uso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
              <div className="text-green-400 mb-2">// JavaScript/Node.js</div>
              <div className="mb-4">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">fraudDetex</span> = <span className="text-blue-300">require</span>(<span className="text-green-300">'@frauddetex/js'</span>);
              </div>
              <div className="mb-4">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">client</span> = <span className="text-blue-300">new</span> <span className="text-yellow-300">fraudDetex</span>.<span className="text-blue-300">Client</span>(<span className="text-green-300">'YOUR_API_KEY'</span>);
              </div>
              <div className="mb-4">
                <span className="text-blue-300">const</span> <span className="text-yellow-300">result</span> = <span className="text-blue-300">await</span> <span className="text-yellow-300">client</span>.<span className="text-blue-300">analyzeFraud</span>({'{'}
              </div>
              <div className="ml-4 mb-2">
                <span className="text-yellow-300">transactionId</span>: <span className="text-green-300">'tx_123'</span>,
              </div>
              <div className="ml-4 mb-2">
                <span className="text-yellow-300">amount</span>: <span className="text-orange-300">299.99</span>,
              </div>
              <div className="ml-4 mb-2">
                <span className="text-yellow-300">currency</span>: <span className="text-green-300">'BRL'</span>,
              </div>
              <div className="ml-4 mb-2">
                <span className="text-yellow-300">paymentMethod</span>: <span className="text-green-300">'credit_card'</span>
              </div>
              <div className="mb-4">{'});'}</div>
              <div className="text-green-400">
                // result.fraudScore: 0-100<br/>
                // result.decision: 'approve' | 'reject' | 'review'
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Rate Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1,000</div>
                <div className="text-sm text-gray-600">Requisições/minuto</div>
                <div className="text-xs text-gray-500">Plano Starter</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000</div>
                <div className="text-sm text-gray-600">Requisições/minuto</div>
                <div className="text-xs text-gray-500">Plano Pro</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                <div className="text-sm text-gray-600">Requisições/minuto</div>
                <div className="text-xs text-gray-500">Plano Enterprise</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🆘 Precisa de Ajuda?
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa equipe de desenvolvedores está pronta para ajudar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  📞 Suporte Técnico
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Link href="/docs">
                  📚 Documentação
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}