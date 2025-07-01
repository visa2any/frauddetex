'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FraudDetex from '@/components/fraud/FraudDetex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DemoPage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);

  const handleFraudResult = (result: any) => {
    setAnalysisCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
            🚀 Demo Interativo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Teste o <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">FraudDetex</span> em Ação
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experimente nossa detecção de fraude em tempo real. Veja como analisamos transações 
            com IA explicável, biometria comportamental e inteligência comunitária.
          </p>
          
          {!demoStarted && (
            <Button 
              onClick={() => setDemoStarted(true)}
              className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-3"
            >
              🎯 Iniciar Demo Gratuito
            </Button>
          )}
        </div>

        {/* Demo Instructions */}
        {!demoStarted && (
          <div className="mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>📋</span>
                  <span>Como Funciona o Demo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">1. Análise Automática</h3>
                    <p className="text-gray-400 text-sm">
                      O sistema gerará transações simuladas e analisará cada uma em tempo real
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">👆</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">2. Biometria Comportamental</h3>
                    <p className="text-gray-400 text-sm">
                      Seus padrões de mouse e teclado serão coletados para análise biométrica
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">3. Resultados Explicáveis</h3>
                    <p className="text-gray-400 text-sm">
                      Veja exatamente por que cada decisão foi tomada com IA explicável
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Demo Interface */}
        {demoStarted && (
          <div className="space-y-8">
            {/* Demo Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{analysisCount}</div>
                  <div className="text-sm text-gray-400">Análises Realizadas</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">98.7%</div>
                  <div className="text-sm text-gray-400">Precisão</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">&lt;50ms</div>
                  <div className="text-sm text-gray-400">Latência Média</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">5</div>
                  <div className="text-sm text-gray-400">Fatores Analisados</div>
                </CardContent>
              </Card>
            </div>

            {/* FraudDetex Component */}
            <FraudDetex 
              autoStart={true}
              onResult={handleFraudResult}
              className="bg-slate-800/30 rounded-lg"
            />

            {/* Demo Features */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Recursos Demonstrados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-4 block">🧠</span>
                    <h3 className="text-white font-semibold mb-2">Edge Computing</h3>
                    <p className="text-gray-400 text-sm">
                      Processamento local com WebAssembly
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-4 block">👆</span>
                    <h3 className="text-white font-semibold mb-2">Biometria Comportamental</h3>
                    <p className="text-gray-400 text-sm">
                      Análise de padrões únicos do usuário
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-4 block">🌐</span>
                    <h3 className="text-white font-semibold mb-2">Inteligência Comunitária</h3>
                    <p className="text-gray-400 text-sm">
                      Rede P2P de detecção de ameaças
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <h3 className="text-white font-semibold mb-2">IA Explicável</h3>
                    <p className="text-gray-400 text-sm">
                      Decisões transparentes e auditáveis
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Impressionado com os Resultados?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Implemente o FraudDetex em sua empresa e tenha proteção 24/7 contra fraudes 
                com tecnologia de ponta e latência ultra-baixa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => window.location.href = '/signup'}
                >
                  🚀 Começar Agora
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Ver Planos e Preços
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}