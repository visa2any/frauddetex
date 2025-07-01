import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SecurityPage() {
  const certifications = [
    {
      name: 'PCI DSS Level 1',
      description: 'Compliance para processamento de pagamentos',
      icon: '🔒',
      status: 'Certificado'
    },
    {
      name: 'ISO 27001',
      description: 'Gestão de segurança da informação',
      icon: '🏆',
      status: 'Certificado'
    },
    {
      name: 'SOC 2 Type II',
      description: 'Controles de segurança e disponibilidade',
      icon: '✅',
      status: 'Auditado'
    },
    {
      name: 'LGPD Compliant',
      description: 'Conformidade com a Lei Geral de Proteção de Dados',
      icon: '🛡️',
      status: 'Verificado'
    }
  ];

  const securityFeatures = [
    {
      title: 'Criptografia End-to-End',
      description: 'Todos os dados são criptografados em trânsito e em repouso usando AES-256',
      icon: '🔐'
    },
    {
      title: 'Zero Trust Architecture',
      description: 'Arquitetura de confiança zero com verificação contínua',
      icon: '🚫'
    },
    {
      title: 'Auditoria Contínua',
      description: 'Logs detalhados de todas as atividades para compliance',
      icon: '📊'
    },
    {
      title: 'Detecção de Anomalias',
      description: 'IA monitora comportamentos suspeitos 24/7',
      icon: '🔍'
    },
    {
      title: 'Backup Redundante',
      description: 'Backups automáticos em múltiplas regiões geográficas',
      icon: '💾'
    },
    {
      title: 'Penetration Testing',
      description: 'Testes de penetração trimestrais por empresa terceira',
      icon: '🛡️'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔒 Centro de Segurança
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sua segurança é nossa prioridade. Conheça as medidas que tomamos para proteger seus dados e operações.
          </p>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-green-50 rounded-lg p-6 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Uptime SLA</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">&lt;50ms</div>
            <div className="text-sm text-gray-600">Tempo de Resposta</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Monitoramento</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Vazamentos de Dados</div>
          </div>
        </div>

        {/* Certifications */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🏆</span>
              <span>Certificações e Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{cert.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {cert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>Recursos de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔐</span>
              <span>Proteção de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Criptografia</h3>
                <p className="text-gray-600">
                  Utilizamos criptografia AES-256 para dados em repouso e TLS 1.3 para dados em trânsito. 
                  Todas as chaves são gerenciadas por HSMs certificados FIPS 140-2 Level 3.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Anonimização</h3>
                <p className="text-gray-600">
                  Dados pessoais são anonimizados para análise de ML. Implementamos técnicas de 
                  differential privacy para proteger a privacidade individual.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Retenção de Dados</h3>
                <p className="text-gray-600">
                  Seguimos políticas rígidas de retenção. Dados são automaticamente purged 
                  após o período de retenção definido por lei ou contrato.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Contact */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚨 Reporte Vulnerabilidades
            </h2>
            <p className="text-gray-600 mb-6">
              Encontrou uma vulnerabilidade? Entre em contato conosco imediatamente.
            </p>
            <div className="space-y-2">
              <p className="text-red-600 font-medium">security@frauddetex.com</p>
              <p className="text-sm text-gray-500">Resposta garantida em 2 horas</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}