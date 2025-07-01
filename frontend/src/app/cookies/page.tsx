import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CookiesPage() {
  const cookieTypes = [
    {
      type: 'Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      duration: 'Sessão',
      canDisable: false,
      examples: ['Autenticação', 'Configurações de segurança', 'Preferências de idioma']
    },
    {
      type: 'Funcionais',
      description: 'Melhoram a experiência do usuário',
      duration: '30 dias',
      canDisable: true,
      examples: ['Lembrar login', 'Configurações de interface', 'Histórico de preferências']
    },
    {
      type: 'Analíticos',
      description: 'Nos ajudam a entender como você usa o site',
      duration: '2 anos',
      canDisable: true,
      examples: ['Google Analytics', 'Métricas de performance', 'Mapas de calor']
    },
    {
      type: 'Marketing',
      description: 'Personalizam anúncios e conteúdo',
      duration: '1 ano',
      canDisable: true,
      examples: ['Pixel do Facebook', 'Google Ads', 'Remarketing']
    }
  ];

  const specificCookies = [
    {
      name: 'auth-token',
      purpose: 'Autenticação do usuário',
      type: 'Essencial',
      duration: '30 dias',
      provider: 'FraudDetex'
    },
    {
      name: '_ga',
      purpose: 'Análise de tráfego',
      type: 'Analítico',
      duration: '2 anos',
      provider: 'Google Analytics'
    },
    {
      name: '_gid',
      purpose: 'Análise de tráfego',
      type: 'Analítico',
      duration: '24 horas',
      provider: 'Google Analytics'
    },
    {
      name: 'preferences',
      purpose: 'Configurações do usuário',
      type: 'Funcional',
      duration: '1 ano',
      provider: 'FraudDetex'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍪 Política de Cookies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entenda como usamos cookies para melhorar sua experiência e proteger seus dados.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última atualização: 1º de Janeiro de 2024
          </p>
        </div>

        {/* What are cookies */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>❓</span>
              <span>O que são Cookies?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você 
              visita um site. Eles nos ajudam a:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Manter você logado em sua conta</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Lembrar suas preferências e configurações</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Melhorar a segurança da plataforma</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Analisar como você usa nosso site</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Personalizar conteúdo e anúncios</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Types of cookies */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📝</span>
              <span>Tipos de Cookies que Usamos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{cookie.type}</h3>
                    {cookie.canDisable ? (
                      <Badge variant="outline" className="border-blue-500 text-blue-600">
                        Opcional
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Necessário
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{cookie.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <strong>Duração:</strong> {cookie.duration}
                  </div>
                  <div>
                    <strong className="text-xs text-gray-700">Exemplos:</strong>
                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                      {cookie.examples.map((example, exIndex) => (
                        <li key={exIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specific cookies table */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Lista Detalhada de Cookies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Nome</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Finalidade</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Tipo</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Duração</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Provedor</th>
                  </tr>
                </thead>
                <tbody>
                  {specificCookies.map((cookie, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{cookie.name}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{cookie.purpose}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Badge 
                          variant="outline"
                          className={
                            cookie.type === 'Essencial' ? 'border-red-500 text-red-600' :
                            cookie.type === 'Analítico' ? 'border-blue-500 text-blue-600' :
                            'border-green-500 text-green-600'
                          }
                        >
                          {cookie.type}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{cookie.duration}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{cookie.provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Third party cookies */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔗</span>
              <span>Cookies de Terceiros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Usamos o Google Analytics para entender como os visitantes interagem com nosso site.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Número de visitantes e páginas visualizadas</li>
                  <li>• Tempo gasto no site</li>
                  <li>• Fonte de tráfego</li>
                  <li>• Comportamento de navegação</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Serviços de Marketing</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Utilizamos cookies de plataformas de marketing para personalizar anúncios.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Facebook Pixel para remarketing</li>
                  <li>• Google Ads para segmentação</li>
                  <li>• LinkedIn Insight Tag para B2B</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie management */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Como Gerenciar Cookies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Configurações do Navegador</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Você pode controlar cookies através das configurações do seu navegador:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Chrome:</strong> Configurações > Privacidade e segurança > Cookies</li>
                  <li>• <strong>Firefox:</strong> Configurações > Privacidade e segurança</li>
                  <li>• <strong>Safari:</strong> Preferências > Privacidade</li>
                  <li>• <strong>Edge:</strong> Configurações > Cookies e permissões do site</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Central de Preferências</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Você pode ajustar suas preferências de cookies a qualquer momento:
                </p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    🛠️ Gerenciar Preferências de Cookies
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ferramentas de Opt-out</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Para cookies de análise e marketing, você pode usar:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                  <li>• <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Facebook Ad Settings</a></li>
                  <li>• <a href="http://optout.aboutads.info/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Digital Advertising Alliance Opt-out</a></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact of disabling */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚠️ Impacto da Desativação de Cookies
            </h2>
            <div className="text-left max-w-2xl mx-auto">
              <p className="text-gray-600 mb-4">
                Ao desativar cookies, algumas funcionalidades podem ser afetadas:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Você pode precisar fazer login a cada visita</li>
                <li>• Configurações personalizadas podem ser perdidas</li>
                <li>• Alguns recursos do site podem não funcionar corretamente</li>
                <li>• Você pode ver anúncios menos relevantes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📞 Dúvidas sobre Cookies?
            </h2>
            <p className="text-gray-600 mb-6">
              Entre em contato conosco para esclarecimentos sobre nossa política de cookies
            </p>
            <div className="space-y-2">
              <p className="text-blue-600 font-medium">privacy@frauddetex.com</p>
              <p className="text-sm text-gray-500">Resposta em até 48 horas</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}