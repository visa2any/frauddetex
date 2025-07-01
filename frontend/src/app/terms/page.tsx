'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-300 text-lg">
              Última atualização: 1º de Janeiro de 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">1. Aceitação dos Termos</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Ao acessar e usar o FraudDetex, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400">
                    <strong>Importante:</strong> Estes termos constituem um acordo legal entre você e a FraudDetex Tecnologia Ltda.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">2. Descrição do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  O FraudDetex é uma plataforma de detecção de fraudes que oferece:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">🧠 Análise em Tempo Real</h4>
                    <p className="text-sm">Detecção instantânea de transações fraudulentas usando machine learning avançado.</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">👆 Biometria Comportamental</h4>
                    <p className="text-sm">Análise de padrões únicos de comportamento do usuário para autenticação.</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">🌐 Inteligência Comunitária</h4>
                    <p className="text-sm">Rede colaborativa de proteção contra ameaças conhecidas.</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">🔍 IA Explicável</h4>
                    <p className="text-sm">Decisões transparentes e auditáveis com explicações detalhadas.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">3. Elegibilidade e Registro</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Para usar nossos serviços, você deve:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Ter pelo menos 18 anos de idade</li>
                  <li>Ter capacidade legal para celebrar contratos</li>
                  <li>Fornecer informações precisas e completas durante o registro</li>
                  <li>Manter suas informações de conta atualizadas</li>
                  <li>Ser responsável pela segurança da sua conta</li>
                </ul>
                
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">
                    <strong>Proibido:</strong> Criar múltiplas contas, usar informações falsas ou compartilhar credenciais de acesso.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">4. Uso Aceitável</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Você concorda em usar o FraudDetex apenas para fins legais e de acordo com estes termos. É proibido:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">❌ Atividades Proibidas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Violar leis aplicáveis</li>
                      <li>• Tentar burlar sistemas de segurança</li>
                      <li>• Fazer engenharia reversa</li>
                      <li>• Distribuir malware ou vírus</li>
                      <li>• Usar para atividades fraudulentas</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">✅ Uso Adequado</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Proteger transações legítimas</li>
                      <li>• Seguir melhores práticas</li>
                      <li>• Respeitar limites de API</li>
                      <li>• Reportar problemas de segurança</li>
                      <li>• Usar para fins comerciais legais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">5. Planos e Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Starter</h4>
                    <p className="text-sm">R$ 299/mês</p>
                    <p className="text-xs text-gray-400">Até 10K transações</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Professional</h4>
                    <p className="text-sm">R$ 899/mês</p>
                    <p className="text-xs text-gray-400">Até 100K transações</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Enterprise</h4>
                    <p className="text-sm">Personalizado</p>
                    <p className="text-xs text-gray-400">Volume ilimitado</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Condições de Pagamento:</h4>
                  <ul className="ml-4 space-y-1 list-disc text-sm">
                    <li>Pagamentos são processados mensalmente via cartão de crédito ou boleto</li>
                    <li>Cobrança antecipada no início de cada período</li>
                    <li>Preços podem ser alterados com aviso prévio de 30 dias</li>
                    <li>Sem reembolsos por serviços já utilizados</li>
                    <li>Suspensão por atraso superior a 5 dias úteis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">6. Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  O FraudDetex e todos os seus componentes são protegidos por direitos autorais, 
                  marcas registradas e outras leis de propriedade intelectual.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Nossa Propriedade</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Algoritmos de machine learning</li>
                      <li>• Interface do usuário</li>
                      <li>• Documentação e manuais</li>
                      <li>• Marca "FraudDetex"</li>
                      <li>• Tecnologias proprietárias</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Seus Direitos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Licença de uso não exclusiva</li>
                      <li>• Dados inseridos permanecem seus</li>
                      <li>• Resultados de análise são seus</li>
                      <li>• Configurações personalizadas</li>
                      <li>• Integrações desenvolvidas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">7. Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    <strong>AVISO IMPORTANTE:</strong> O FraudDetex é uma ferramenta de apoio à decisão. 
                    A responsabilidade final pelas decisões de negócio permanece com o usuário.
                  </p>
                </div>
                
                <p>
                  Nossa responsabilidade é limitada a:
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Fornecimento do serviço conforme descrito</li>
                  <li>Disponibilidade de 99.9% (SLA)</li>
                  <li>Suporte técnico durante horário comercial</li>
                  <li>Correção de bugs reportados</li>
                </ul>
                
                <p>
                  <strong>Não somos responsáveis por:</strong>
                </p>
                
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Perdas decorrentes de decisões baseadas em nossas análises</li>
                  <li>Falhas em detectar 100% das fraudes</li>
                  <li>Problemas causados por integração inadequada</li>
                  <li>Interrupções por motivos de força maior</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">8. Rescisão</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Por sua parte</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Cancelamento a qualquer momento</li>
                      <li>• Aviso prévio não obrigatório</li>
                      <li>• Acesso até o fim do período pago</li>
                      <li>• Export de dados disponível por 30 dias</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Por nossa parte</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Violação destes termos</li>
                      <li>• Atividade fraudulenta ou ilegal</li>
                      <li>• Não pagamento por 30 dias</li>
                      <li>• Aviso prévio de 30 dias (quando aplicável)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    <strong>Após rescisão:</strong> Dados são mantidos por 90 dias para exportação, 
                    depois excluídos permanentemente conforme nossa Política de Privacidade.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">9. Suporte e SLA</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <h4 className="font-semibold text-white mb-2">Disponibilidade</h4>
                    <p className="text-2xl font-bold text-green-400">99.9%</p>
                    <p className="text-xs text-gray-400">Uptime garantido</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <h4 className="font-semibold text-white mb-2">Tempo de Resposta</h4>
                    <p className="text-2xl font-bold text-blue-400">&lt;4h</p>
                    <p className="text-xs text-gray-400">Suporte crítico</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <h4 className="font-semibold text-white mb-2">Latência de API</h4>
                    <p className="text-2xl font-bold text-purple-400">&lt;100ms</p>
                    <p className="text-xs text-gray-400">P95 global</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Canais de Suporte:</h4>
                  <ul className="ml-4 space-y-1 list-disc text-sm">
                    <li>📧 Email: suporte@frauddetex.com (24/7)</li>
                    <li>💬 Chat: Disponível no painel (horário comercial)</li>
                    <li>📞 Telefone: +55 11 1234-5678 (emergências)</li>
                    <li>📚 Documentação: docs.frauddetex.com</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">10. Disposições Gerais</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Lei Aplicável</h4>
                    <p className="text-sm">
                      Estes termos são regidos pelas leis brasileiras. 
                      Foro da comarca de São Paulo/SP.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Alterações</h4>
                    <p className="text-sm">
                      Podemos modificar estes termos com aviso prévio de 30 dias. 
                      Uso continuado implica aceitação.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Integralidade</h4>
                    <p className="text-sm">
                      Estes termos constituem o acordo completo entre as partes, 
                      substituindo acordos anteriores.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Severabilidade</h4>
                    <p className="text-sm">
                      Se alguma cláusula for inválida, as demais 
                      permanecem em vigor.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Contato Legal</h4>
                  <p className="text-sm">
                    FraudDetex Tecnologia Ltda.<br/>
                    CNPJ: 12.345.678/0001-90<br/>
                    Av. Paulista, 1000 - São Paulo/SP<br/>
                    CEP: 01310-100<br/>
                    Email: legal@frauddetex.com
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