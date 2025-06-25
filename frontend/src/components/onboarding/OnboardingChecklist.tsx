'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: string;
}

interface OnboardingChecklistProps {
  onComplete: () => void;
}

export default function OnboardingChecklist({ onComplete }: OnboardingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'verify-email',
      title: 'Verificar Email',
      description: 'Confirme seu endereço de email para ativar todos os recursos',
      completed: false,
      icon: '📧',
      action: {
        label: 'Verificar',
        onClick: () => {
          // Simulate email verification
          updateItemStatus('verify-email', true);
        }
      }
    },
    {
      id: 'api-key',
      title: 'Copiar API Key',
      description: 'Salve sua chave de API em um local seguro',
      completed: false,
      icon: '🔑',
      action: {
        label: 'Copiar',
        onClick: () => {
          navigator.clipboard.writeText('fs_demo_key_123456789abcdef');
          updateItemStatus('api-key', true);
        }
      }
    },
    {
      id: 'first-test',
      title: 'Fazer Primeira Detecção',
      description: 'Teste nossa API com uma transação de exemplo',
      completed: false,
      icon: '🧪',
      action: {
        label: 'Testar',
        onClick: () => {
          // Simulate API test
          setTimeout(() => {
            updateItemStatus('first-test', true);
          }, 1000);
        }
      }
    },
    {
      id: 'explore-dashboard',
      title: 'Explorar Dashboard',
      description: 'Conheça as métricas e relatórios disponíveis',
      completed: false,
      icon: '📊',
      action: {
        label: 'Explorar',
        onClick: () => {
          updateItemStatus('explore-dashboard', true);
          window.location.href = '/dashboard';
        }
      }
    },
    {
      id: 'configure-alerts',
      title: 'Configurar Alertas',
      description: 'Defina notificações para atividades suspeitas',
      completed: false,
      icon: '🔔',
      action: {
        label: 'Configurar',
        onClick: () => {
          updateItemStatus('configure-alerts', true);
        }
      }
    },
    {
      id: 'read-docs',
      title: 'Ler Documentação',
      description: 'Aprenda sobre recursos avançados e melhores práticas',
      completed: false,
      icon: '📚',
      action: {
        label: 'Ler Docs',
        onClick: () => {
          updateItemStatus('read-docs', true);
          window.open('http://localhost:8000/api/v1/', '_blank');
        }
      }
    }
  ]);

  const updateItemStatus = (id: string, completed: boolean) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed } : item
      )
    );
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  useEffect(() => {
    if (completedCount === totalCount) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [completedCount, totalCount, onComplete]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>📋</span>
            <span>Lista de Onboarding</span>
          </CardTitle>
          <Badge variant={completedCount === totalCount ? "default" : "secondary"}>
            {completedCount}/{totalCount} Completo
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso do Setup</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.completed ? '✓' : item.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${
                    item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                  {item.completed && (
                    <Badge variant="default" className="bg-green-500 text-xs">
                      ✓ Feito
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${
                  item.completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
              
              {item.action && !item.completed && (
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={item.action.onClick}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    {item.action.label}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {completedCount === totalCount && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="text-center space-y-3">
              <div className="text-2xl">🎉</div>
              <h3 className="font-semibold text-green-800">
                Parabéns! Setup Completo
              </h3>
              <p className="text-green-700 text-sm">
                Você configurou com sucesso sua conta FraudShield. 
                Agora está pronto para detectar fraudes em tempo real!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/dashboard'}
              >
                🚀 Ir para Dashboard
              </Button>
            </div>
          </div>
        )}
        
        {completedCount > 0 && completedCount < totalCount && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600 text-xl">💪</div>
              <div>
                <h4 className="font-medium text-blue-800">
                  Ótimo progresso!
                </h4>
                <p className="text-blue-700 text-sm">
                  Você já completou {completedCount} de {totalCount} etapas. 
                  Continue assim para aproveitar todos os recursos do FraudShield.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}