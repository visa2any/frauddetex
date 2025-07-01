import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
  const sections = [
    {
      title: '🚀 Início Rápido',
      description: 'Comece a usar o FraudDetex em poucos minutos',
      links: [
        { href: '/docs/quickstart', label: 'Guia de Início Rápido' },
        { href: '/docs/installation', label: 'Instalação' },
        { href: '/docs/configuration', label: 'Configuração' }
      ]
    },
    {
      title: '🔧 API Reference',
      description: 'Documentação completa da API',
      links: [
        { href: '/docs/api/authentication', label: 'Autenticação' },
        { href: '/docs/api/fraud-detection', label: 'Detecção de Fraudes' },
        { href: '/docs/api/webhooks', label: 'Webhooks' }
      ]
    },
    {
      title: '🧠 Machine Learning',
      description: 'Entenda como funciona nossa IA',
      links: [
        { href: '/docs/ml/models', label: 'Modelos de ML' },
        { href: '/docs/ml/features', label: 'Features Engineering' },
        { href: '/docs/ml/explainability', label: 'IA Explicável' }
      ]
    },
    {
      title: '🔗 Integrações',
      description: 'Como integrar com outras plataformas',
      links: [
        { href: '/docs/integrations/stripe', label: 'Stripe' },
        { href: '/docs/integrations/paypal', label: 'PayPal' },
        { href: '/docs/integrations/custom', label: 'Integração Customizada' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Documentação FraudDetex
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo que você precisa saber para implementar e usar nosso sistema de detecção de fraudes
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 rounded-xl p-8 mb-12 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚀 Links Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 bg-blue-600 hover:bg-blue-700">
              <Link href="/docs/quickstart" className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Início Rápido</div>
                <div className="text-sm opacity-90">5 minutos</div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 border-blue-200 hover:bg-blue-50">
              <Link href="/docs/api" className="text-center">
                <div className="text-2xl mb-2">🔌</div>
                <div className="font-semibold">API Reference</div>
                <div className="text-sm text-gray-600">Documentação completa</div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 border-blue-200 hover:bg-blue-50">
              <Link href="/demo" className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">Demo Interativa</div>
                <div className="text-sm text-gray-600">Teste agora</div>
              </Link>
            </Button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{section.title.split(' ')[0]}</span>
                  <span>{section.title.split(' ').slice(1).join(' ')}</span>
                </CardTitle>
                <p className="text-gray-600">{section.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>📄</span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🆘 Precisa de Ajuda?
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa equipe está pronta para ajudar você a implementar o FraudDetex
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/contact">
                  📞 Falar com Suporte
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Link href="/discord">
                  💬 Comunidade Discord
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