import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CompliancePage() {
  const regulations = [
    {
      name: 'LGPD',
      fullName: 'Lei Geral de Proteção de Dados',
      country: 'Brasil',
      status: 'Compliant',
      description: 'Conformidade total com a legislação brasileira de proteção de dados'
    },
    {
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      country: 'União Europeia',
      status: 'Compliant',
      description: 'Atendemos todos os requisitos do regulamento europeu'
    },
    {
      name: 'PCI DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      country: 'Global',
      status: 'Level 1',
      description: 'Máximo nível de certificação para processamento de pagamentos'
    },
    {
      name: 'SOX',
      fullName: 'Sarbanes-Oxley Act',
      country: 'Estados Unidos',
      status: 'Compliant',
      description: 'Conformidade com controles financeiros e auditoria'
    }
  ];

  const frameworks = [
    {
      name: 'ISO 27001',
      description: 'Sistema de Gestão de Segurança da Informação',
      status: 'Certificado',
      validUntil: '2025-03-15'
    },
    {
      name: 'SOC 2 Type II',
      description: 'Controles de Segurança, Disponibilidade e Confidencialidade',
      status: 'Auditado',
      validUntil: '2024-12-31'
    },
    {
      name: 'NIST Framework',
      description: 'Framework de Cibersegurança do NIST',
      status: 'Implementado',
      validUntil: 'Contínuo'
    },
    {
      name: 'OWASP',
      description: 'Práticas de Segurança em Aplicações Web',
      status: 'Implementado',
      validUntil: 'Contínuo'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✅ Centro de Compliance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Atendemos às principais regulamentações globais de segurança, privacidade e proteção de dados.
          </p>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-50 rounded-lg p-6 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Compliance Score</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-sm text-gray-600">Certificações</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Países Atendidos</div>
          </div>
        </div>

        {/* Regulations Compliance */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚖️</span>
              <span>Conformidade Regulatória</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regulations.map((reg, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{reg.name}</h3>
                      <p className="text-sm text-gray-600">{reg.fullName}</p>
                      <p className="text-xs text-gray-500">{reg.country}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ✅ {reg.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reg.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Frameworks */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🏗️</span>
              <span>Frameworks de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frameworks.map((framework, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{framework.name}</h3>
                      <p className="text-sm text-gray-600">{framework.description}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-500 text-blue-600">
                      {framework.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Válido até: {framework.validUntil}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Processing */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Processamento de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Base Legal (LGPD)</h3>
                <p className="text-gray-600 mb-3">
                  Processamos dados pessoais com base no legítimo interesse para prevenção de fraudes, 
                  conforme Art. 7º, IX da LGPD.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Detecção e prevenção de fraudes</li>
                  <li>• Análise de comportamento para segurança</li>
                  <li>• Melhoria contínua dos algoritmos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Direitos dos Titulares</h3>
                <p className="text-gray-600 mb-3">
                  Garantimos todos os direitos previstos na LGPD e GDPR:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Acesso aos dados</li>
                    <li>✅ Correção de dados</li>
                    <li>✅ Exclusão de dados</li>
                    <li>✅ Portabilidade</li>
                  </ul>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Oposição ao tratamento</li>
                    <li>✅ Revogação do consentimento</li>
                    <li>✅ Informações sobre uso</li>
                    <li>✅ Não discriminação</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Transferência Internacional</h3>
                <p className="text-gray-600">
                  Quando necessário, realizamos transferências internacionais de dados apenas para 
                  países com nível adequado de proteção ou mediante cláusulas contratuais padrão.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Reports */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>Relatórios de Auditoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">SOC 2 Type II Report 2024</h4>
                  <p className="text-sm text-gray-600">Auditoria de controles de segurança</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Disponível</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">ISO 27001 Certificate</h4>
                  <p className="text-sm text-gray-600">Certificado de gestão de segurança</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Válido</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">PCI DSS Attestation</h4>
                  <p className="text-sm text-gray-600">Certificado de conformidade PCI</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Level 1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact DPO */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👨‍💼 Encarregado de Proteção de Dados (DPO)
            </h2>
            <p className="text-gray-600 mb-6">
              Para questões sobre privacidade, proteção de dados ou exercício de direitos
            </p>
            <div className="space-y-2">
              <p className="text-blue-600 font-medium">dpo@frauddetex.com</p>
              <p className="text-sm text-gray-500">Resposta em até 72 horas</p>
            </div>
            <div className="mt-6">
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                📄 Ler Política de Privacidade Completa
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}