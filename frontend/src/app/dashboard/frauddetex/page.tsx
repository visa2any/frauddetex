'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FraudDetex } from '@/components/fraud/FraudDetex';
import { RealTimeMetrics } from '@/components/fraud/RealTimeMetrics';
import { BehavioralInsights } from '@/components/fraud/BehavioralInsights';
import { ThreatIntelligenceFeed } from '@/components/fraud/ThreatIntelligenceFeed';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FraudResult {
  fraud_score: number;
  decision: 'approve' | 'reject' | 'review';
  confidence: number;
  explanation: any[];
  processing_time_ms: number;
  community_threat_score: number;
  model_version: string;
  timestamp: string;
}

export default function FraudDetexPage() {
  const [analysisHistory, setAnalysisHistory] = useState<FraudResult[]>([]);
  const [currentMode, setCurrentMode] = useState<'demo' | 'live'>('demo');

  const handleFraudResult = (result: FraudResult) => {
    setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'text-green-600 bg-green-100';
      case 'reject': return 'text-red-600 bg-red-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🔍 FraudDetex - Detecção de Fraude em Tempo Real
              </h1>
              <p className="text-gray-300">
                Sistema avançado de detecção de fraude com IA explicável e biometria comportamental
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Sistema Ativo
              </Badge>
              <Button
                variant={currentMode === 'demo' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('demo')}
                size="sm"
                className="text-xs"
              >
                Modo Demo
              </Button>
              <Button
                variant={currentMode === 'live' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('live')}
                size="sm"
                className="text-xs"
              >
                Modo Live
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="detector" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="detector" className="text-white data-[state=active]:bg-blue-600">
              🔍 Detector
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-blue-600">
              📊 Métricas
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-white data-[state=active]:bg-blue-600">
              🧠 Insights
            </TabsTrigger>
            <TabsTrigger value="threats" className="text-white data-[state=active]:bg-blue-600">
              🚨 Ameaças
            </TabsTrigger>
          </TabsList>

          {/* Main Fraud Detector */}
          <TabsContent value="detector" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main FraudDetex Component */}
              <div className="xl:col-span-3">
                <FraudDetex 
                  onResult={handleFraudResult}
                  autoStart={currentMode === 'live'}
                />
              </div>

              {/* Analysis History Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📈</span>
                      <span>Histórico de Análises</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Nenhuma análise realizada ainda
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {analysisHistory.map((result, index) => (
                          <div key={index} className="border rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getDecisionColor(result.decision)}>
                                {result.decision === 'approve' ? 'Aprovado' :
                                 result.decision === 'reject' ? 'Rejeitado' : 'Revisão'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(result.timestamp).toLocaleTimeString('pt-BR')}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">Score:</span>
                                <span className="font-medium ml-1">{result.fraud_score}%</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Confiança:</span>
                                <span className="font-medium ml-1">
                                  {(result.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Tempo:</span>
                                <span className="font-medium ml-1">{result.processing_time_ms}ms</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Ameaça:</span>
                                <span className="font-medium ml-1">{result.community_threat_score}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {analysisHistory.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setAnalysisHistory([])}
                      >
                        Limpar Histórico
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📊</span>
                      <span>Estatísticas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">
                          {analysisHistory.filter(r => r.decision === 'approve').length}
                        </p>
                        <p className="text-green-600 text-xs">Aprovadas</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-red-800">
                          {analysisHistory.filter(r => r.decision === 'reject').length}
                        </p>
                        <p className="text-red-600 text-xs">Rejeitadas</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="font-medium text-yellow-800">
                          {analysisHistory.filter(r => r.decision === 'review').length}
                        </p>
                        <p className="text-yellow-600 text-xs">Em Revisão</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-800">
                          {analysisHistory.length > 0 ? 
                            Math.round(analysisHistory.reduce((acc, r) => acc + r.processing_time_ms, 0) / analysisHistory.length) : 0}ms
                        </p>
                        <p className="text-blue-600 text-xs">Tempo Médio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Real-time Metrics */}
          <TabsContent value="metrics">
            <RealTimeMetrics />
          </TabsContent>

          {/* Behavioral Insights */}
          <TabsContent value="insights">
            <BehavioralInsights />
          </TabsContent>

          {/* Threat Intelligence */}
          <TabsContent value="threats">
            <ThreatIntelligenceFeed />
          </TabsContent>
        </Tabs>

        {/* System Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">🧠 Engine de ML</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Edge Computing (WebAssembly)</li>
                    <li>• Modelos pré-treinados locais</li>
                    <li>• Latência &lt; 100ms</li>
                    <li>• Processamento offline</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">👆 Biometria Comportamental</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Análise de padrões de mouse</li>
                    <li>• Cadência de digitação</li>
                    <li>• Pressão de clique</li>
                    <li>• Padrões de scroll</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">🌐 Inteligência Comunitária</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Rede P2P de ameaças</li>
                    <li>• Sharing de indicadores</li>
                    <li>• Reputação de IPs/devices</li>
                    <li>• Threat intelligence</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <p className="text-sm text-center">
                  <strong>🚀 FraudDetex</strong> combina múltiplas tecnologias avançadas para oferecer 
                  detecção de fraude em tempo real com explicabilidade completa das decisões de IA.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}