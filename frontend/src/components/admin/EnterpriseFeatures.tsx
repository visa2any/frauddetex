'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnterpriseFeaturesProps {
  onFeatureAction: (feature: string, action: string) => void;
}

export default function EnterpriseFeatures({ onFeatureAction }: EnterpriseFeaturesProps) {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([
    'advanced_analytics',
    'compliance_monitoring',
    'security_center',
    'api_management',
    'white_label',
    'custom_integrations'
  ]);

  const enterpriseFeatures = [
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Analytics avançados com machine learning e predições',
      icon: '📊',
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'compliance_monitoring',
      name: 'Compliance Monitoring',
      description: 'Monitoramento automático de compliance LGPD, PCI DSS, SOC 2',
      icon: '✅',
      status: 'active',
      category: 'compliance'
    },
    {
      id: 'security_center',
      name: 'Security Center',
      description: 'Centro de segurança com threat intelligence e SOC',
      icon: '🛡️',
      status: 'active',
      category: 'security'
    },
    {
      id: 'api_management',
      name: 'API Management',
      description: 'Gestão avançada de APIs com rate limiting e analytics',
      icon: '🔌',
      status: 'active',
      category: 'integration'
    },
    {
      id: 'white_label',
      name: 'White Label',
      description: 'Solução white label para revendedores',
      icon: '🏷️',
      status: 'active',
      category: 'business'
    },
    {
      id: 'custom_integrations',
      name: 'Custom Integrations',
      description: 'Integrações customizadas com sistemas legados',
      icon: '🔗',
      status: 'active',
      category: 'integration'
    },
    {
      id: 'ai_models',
      name: 'Custom AI Models',
      description: 'Modelos de IA customizados para seu negócio',
      icon: '🧠',
      status: 'inactive',
      category: 'ai'
    },
    {
      id: 'dedicated_support',
      name: 'Dedicated Support',
      description: 'Suporte dedicado 24/7 com SLA garantido',
      icon: '🎧',
      status: 'active',
      category: 'support'
    },
    {
      id: 'multi_tenant',
      name: 'Multi-Tenant',
      description: 'Arquitetura multi-tenant para isolamento de dados',
      icon: '🏢',
      status: 'active',
      category: 'architecture'
    },
    {
      id: 'audit_trail',
      name: 'Audit Trail',
      description: 'Rastreamento completo de todas as ações',
      icon: '📝',
      status: 'active',
      category: 'compliance'
    },
    {
      id: 'disaster_recovery',
      name: 'Disaster Recovery',
      description: 'Recuperação de desastres com RTO/RPO otimizados',
      icon: '🔄',
      status: 'active',
      category: 'infrastructure'
    },
    {
      id: 'performance_monitoring',
      name: 'Performance Monitoring',
      description: 'Monitoramento de performance em tempo real',
      icon: '⚡',
      status: 'active',
      category: 'monitoring'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      analytics: 'bg-blue-100 text-blue-800',
      compliance: 'bg-green-100 text-green-800',
      security: 'bg-red-100 text-red-800',
      integration: 'bg-purple-100 text-purple-800',
      business: 'bg-yellow-100 text-yellow-800',
      ai: 'bg-indigo-100 text-indigo-800',
      support: 'bg-pink-100 text-pink-800',
      architecture: 'bg-orange-100 text-orange-800',
      infrastructure: 'bg-teal-100 text-teal-800',
      monitoring: 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleFeatureToggle = (featureId: string) => {
    if (activeFeatures.includes(featureId)) {
      setActiveFeatures(activeFeatures.filter(id => id !== featureId));
      onFeatureAction(featureId, 'deactivate');
    } else {
      setActiveFeatures([...activeFeatures, featureId]);
      onFeatureAction(featureId, 'activate');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Enterprise Features</span>
            </span>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              {activeFeatures.length} Ativas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enterpriseFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className={`bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 transition-colors ${
                  activeFeatures.includes(feature.id) ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h3 className="font-medium text-white">{feature.name}</h3>
                        <Badge className={`text-xs ${getCategoryColor(feature.category)}`}>
                          {feature.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`text-xs ${
                        activeFeatures.includes(feature.id)
                          ? 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white'
                          : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      {activeFeatures.includes(feature.id) ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFeatureAction(feature.id, 'configure')}
                      className="text-xs border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>📈</span>
              <span>Performance Enterprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Uptime SLA</span>
                <span className="text-green-400 font-medium">99.99%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Response Time</span>
                <span className="text-blue-400 font-medium">&lt; 50ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Throughput</span>
                <span className="text-purple-400 font-medium">10K req/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Data Retention</span>
                <span className="text-yellow-400 font-medium">7 anos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>🔧</span>
              <span>Configurações Avançadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                onClick={() => onFeatureAction('api_config', 'configure')}
              >
                🔌 Configurar APIs
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                onClick={() => onFeatureAction('compliance_config', 'configure')}
              >
                ✅ Configurar Compliance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                onClick={() => onFeatureAction('security_config', 'configure')}
              >
                🛡️ Configurar Segurança
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                onClick={() => onFeatureAction('white_label_config', 'configure')}
              >
                🏷️ Configurar White Label
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 