'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '🎉 Bem-vindo ao FraudShield!',
      description: 'Vamos fazer um tour rápido para você conhecer as principais funcionalidades da nossa plataforma de detecção de fraudes.',
      component: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Você está protegido!</h3>
            <p className="text-gray-600">
              Nossa IA detecta fraudes em tempo real com precisão de 99.7%
            </p>
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            <Badge variant="secondary">⚡ &lt;100ms</Badge>
            <Badge variant="secondary">🧠 IA Avançada</Badge>
            <Badge variant="secondary">🌍 Global</Badge>
          </div>
        </div>
      )
    },
    {
      id: 'api-key',
      title: '🔑 Sua API Key',
      description: 'Esta é sua chave de acesso para integrar com nossa API. Mantenha-a segura!',
      component: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-600">fs_demo_key_123456789abcdef</span>
              <Button size="sm" variant="outline">
                📋 Copiar
              </Button>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>💡 Dica:</strong> Use esta chave no header <code>X-API-Key</code> das suas requisições.
            </p>
          </div>
        </div>
      ),
      action: {
        label: 'Copiar API Key',
        onClick: () => {
          navigator.clipboard.writeText('fs_demo_key_123456789abcdef');
          setCompletedSteps(prev => [...prev, 'api-key']);
        }
      }
    },
    {
      id: 'first-request',
      title: '🚀 Primeira Detecção',
      description: 'Vamos fazer sua primeira chamada de detecção de fraude!',
      component: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2 text-gray-400"># Exemplo de requisição:</div>
            <div>curl -X POST http://localhost:8000/api/v1/fraud/detect \</div>
            <div>  -H &quot;X-API-Key: fs_demo_key_123456789abcdef&quot; \</div>
            <div>  -H &quot;Content-Type: application/json&quot; \</div>
            <div>  -d &apos;{`{`}</div>
            <div>    &quot;transaction_id&quot;: &quot;test_123&quot;,</div>
            <div>    &quot;amount&quot;: 500,</div>
            <div>    &quot;user_id&quot;: &quot;demo_user&quot;,</div>
            <div>    &quot;payment_method&quot;: &quot;card&quot;</div>
            <div>  {`}`}&apos;</div>
          </div>
          <Button className="w-full" onClick={() => setCompletedSteps(prev => [...prev, 'first-request'])}>
            🧪 Testar API
          </Button>
        </div>
      ),
      action: {
        label: 'Fazer Teste',
        onClick: () => {
          // Simulate API call
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, 'first-request']);
          }, 1000);
        }
      }
    },
    {
      id: 'dashboard',
      title: '📊 Dashboard e Métricas',
      description: 'Monitore todas suas transações e estatísticas de fraude em tempo real.',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-xs text-green-600">Transações Seguras</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-red-600">Fraudes Bloqueadas</div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>💡 Dica:</strong> Configure alertas personalizados para ser notificado sobre atividades suspeitas.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: '✨ Recursos Avançados',
      description: 'Descubra tudo que o FraudShield pode fazer por você.',
      component: (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <span className="text-2xl">🧠</span>
            <div>
              <div className="font-medium">Biometria Comportamental</div>
              <div className="text-sm text-gray-600">Análise de padrões de mouse e teclado</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <span className="text-2xl">🌐</span>
            <div>
              <div className="font-medium">Edge Computing</div>
              <div className="text-sm text-gray-600">Detecção ultra-rápida em múltiplas regiões</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <span className="text-2xl">🤝</span>
            <div>
              <div className="font-medium">Inteligência Comunitária</div>
              <div className="text-sm text-gray-600">Proteção colaborativa contra ameaças</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <span className="text-2xl">🔍</span>
            <div>
              <div className="font-medium">IA Explicável</div>
              <div className="text-sm text-gray-600">Entenda como cada decisão foi tomada</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: '🆘 Suporte e Recursos',
      description: 'Sempre que precisar de ajuda, estamos aqui para você!',
      component: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <span className="text-xl">📚</span>
              <div>
                <div className="font-medium">Documentação</div>
                <div className="text-sm text-gray-600">Guias completos e exemplos de código</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <span className="text-xl">💬</span>
              <div>
                <div className="font-medium">Chat de Suporte</div>
                <div className="text-sm text-gray-600">Resposta em menos de 5 minutos</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <span className="text-xl">👥</span>
              <div>
                <div className="font-medium">Comunidade</div>
                <div className="text-sm text-gray-600">Conecte-se com outros desenvolvedores</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isStepCompleted = completedSteps.includes(currentStepData.id);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              {isStepCompleted && (
                <Badge variant="default" className="bg-green-500">
                  ✓ Completo
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              ✕
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="flex space-x-1 mt-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <p className="text-gray-600 mt-2">{currentStepData.description}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="mb-6">
            {currentStepData.component}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                ← Anterior
              </Button>
              
              {currentStepData.action && !isStepCompleted && (
                <Button
                  variant="secondary"
                  onClick={currentStepData.action.onClick}
                >
                  {currentStepData.action.label}
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleSkip}>
                Pular Tutorial
              </Button>
              
              <Button onClick={handleNext}>
                {isLastStep ? '🎉 Finalizar' : 'Próximo →'}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">
              {currentStep + 1} de {steps.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}