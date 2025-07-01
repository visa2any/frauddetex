'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-300 text-lg">
              Última atualização: 1º de Janeiro de 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">1. Informações Coletadas</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  O FraudDetex coleta diferentes tipos de informações para fornecer e melhorar nossos serviços:
                </p>
                
                <div className="ml-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Informações de Conta</h4>
                    <p>Nome, email, telefone, dados de faturamento e preferências de conta.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Dados de Transação</h4>
                    <p>Informações sobre transações processadas, incluindo valores, timestamps e metadados relevantes para detecção de fraude.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Biometria Comportamental</h4>
                    <p>Padrões de movimento do mouse, dinâmica de digitação, timing de cliques e outros indicadores comportamentais.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Dados Técnicos</h4>
                    <p>Endereços IP, informações do dispositivo, logs de sistema e dados de performance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">2. Uso das Informações</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>Utilizamos suas informações para:</p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Fornecer serviços de detecção de fraude em tempo real</li>
                  <li>Melhorar a precisão dos nossos algoritmos de machine learning</li>
                  <li>Personalizar a experiência do usuário</li>
                  <li>Processar pagamentos e faturamento</li>
                  <li>Fornecer suporte técnico</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Comunicar atualizações importantes do serviço</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">3. Proteção de Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Implementamos medidas rigorosas de segurança para proteger suas informações:
                </p>
                
                <div className="ml-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Criptografia</h4>
                    <p>Todos os dados são criptografados em trânsito (TLS 1.3) e em repouso (AES-256).</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Acesso Restrito</h4>
                    <p>Apenas funcionários autorizados têm acesso aos dados, com autenticação multi-fator obrigatória.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Monitoramento 24/7</h4>
                    <p>Sistemas de monitoramento contínuo detectam e respondem a ameaças em tempo real.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Auditoria Regular</h4>
                    <p>Auditorias de segurança independentes são realizadas trimestralmente.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">4. Compartilhamento de Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Não vendemos seus dados pessoais. Compartilhamos informações apenas nas seguintes situações:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li><strong>Com seu consentimento explícito</strong></li>
                  <li><strong>Para cumprir obrigações legais</strong> (ordens judiciais, regulamentações)</li>
                  <li><strong>Com fornecedores de serviços</strong> que assinaram acordos de confidencialidade</li>
                  <li><strong>Em caso de fusão ou aquisição</strong> (com notificação prévia)</li>
                  <li><strong>Para proteger direitos e segurança</strong> (prevenção de fraudes, investigações)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">5. Seus Direitos (LGPD/GDPR)</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Você tem os seguintes direitos sobre seus dados pessoais:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Acesso</h4>
                    <p className="text-sm">Solicitar cópia dos seus dados</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Retificação</h4>
                    <p className="text-sm">Corrigir dados incorretos</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Exclusão</h4>
                    <p className="text-sm">Solicitar remoção dos dados</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Portabilidade</h4>
                    <p className="text-sm">Exportar seus dados</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Oposição</h4>
                    <p className="text-sm">Opor-se ao processamento</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Limitação</h4>
                    <p className="text-sm">Restringir o processamento</p>
                  </div>
                </div>
                
                <p className="mt-4">
                  Para exercer qualquer desses direitos, entre em contato conosco através de: 
                  <a href="mailto:privacidade@frauddetex.com" className="text-red-400 hover:text-red-300 ml-1">
                    privacidade@frauddetex.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">6. Retenção de Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Mantemos seus dados pelo tempo necessário para:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li><strong>Dados de conta:</strong> Enquanto sua conta estiver ativa + 5 anos</li>
                  <li><strong>Dados de transação:</strong> 7 anos (requisitos regulatórios)</li>
                  <li><strong>Biometria comportamental:</strong> 30 dias (processamento) + 1 ano (análise)</li>
                  <li><strong>Logs de sistema:</strong> 2 anos (segurança e auditoria)</li>
                </ul>
                
                <p>
                  Após os períodos de retenção, os dados são excluídos de forma segura e irreversível.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">7. Cookies e Tecnologias Similares</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Utilizamos cookies e tecnologias similares para:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Essenciais</h4>
                    <p className="text-sm">Funcionamento básico do site</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Performance</h4>
                    <p className="text-sm">Análise de uso e otimização</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Segurança</h4>
                    <p className="text-sm">Detecção de fraudes e proteção</p>
                  </div>
                </div>
                
                <p>
                  Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">8. Transferências Internacionais</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Seus dados podem ser processados em servidores localizados no Brasil, Estados Unidos e União Europeia. 
                  Todas as transferências seguem salvaguardas adequadas, incluindo:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Cláusulas Contratuais Padrão aprovadas pela ANPD</li>
                  <li>Certificações de adequação (Privacy Shield sucessor)</li>
                  <li>Avaliações de adequação da União Europeia</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">9. Contato</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Para questões relacionadas à privacidade, entre em contato:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Encarregado de Dados (DPO)</h4>
                    <p>Email: dpo@frauddetex.com</p>
                    <p>Telefone: +55 11 1234-5678</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Endereço</h4>
                    <p>FraudDetex Tecnologia Ltda.</p>
                    <p>Av. Paulista, 1000 - São Paulo/SP</p>
                    <p>CEP: 01310-100</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">10. Alterações na Política</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Esta política pode ser atualizada periodicamente. Quando isso acontecer:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Notificaremos por email sobre mudanças substanciais</li>
                  <li>Atualizaremos a data da &quot;última atualização&quot;</li>
                  <li>Manteremos versões anteriores disponíveis por 2 anos</li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400">
                    <strong>Importante:</strong> Ao continuar usando nossos serviços após alterações, 
                    você concorda com a política atualizada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}