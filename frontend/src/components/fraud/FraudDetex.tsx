'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RiskScoreMeter from './RiskScoreMeter';
import ExplainableDecisionViewer from './ExplainableDecisionViewer';
import BehavioralBiometrics from '../../lib/behavioral-biometrics';
import EdgeML from '../../lib/edge-ml';

interface TransactionData {
  transaction_id: string;
  amount: number;
  user_id: string;
  currency: string;
  payment_method: string;
  merchant_category: string;
  metadata?: any;
}

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

interface FraudDetexProps {
  onResult?: (result: FraudResult) => void;
  autoStart?: boolean;
  className?: string;
}

export default function FraudDetex({ onResult, autoStart = false, className = '' }: FraudDetexProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [progress, setProgress] = useState(0);
  const [behavioralData, setBehavioralData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const biometricsRef = useRef<BehavioralBiometrics | null>(null);
  const edgeMLRef = useRef<EdgeML | null>(null);

  const analysisSteps = [
    { name: 'Inicializando', description: 'Preparando análise...', duration: 500 },
    { name: 'Biometria Comportamental', description: 'Coletando padrões de comportamento', duration: 1000 },
    { name: 'Análise Edge ML', description: 'Processando com IA local', duration: 800 },
    { name: 'Inteligência Comunitária', description: 'Consultando rede P2P', duration: 600 },
    { name: 'Decisão Final', description: 'Gerando resultado explicável', duration: 400 }
  ];

  useEffect(() => {
    // Initialize services
    biometricsRef.current = new BehavioralBiometrics();
    edgeMLRef.current = new EdgeML();

    // Start collecting behavioral data immediately
    if (biometricsRef.current) {
      biometricsRef.current.startCollection();
      
      // Collect behavioral data for 3 seconds
      setTimeout(() => {
        if (biometricsRef.current) {
          const data = biometricsRef.current.getBehavioralProfile();
          setBehavioralData(data);
        }
      }, 3000);
    }

    return () => {
      if (biometricsRef.current) {
        biometricsRef.current.stopCollection();
      }
    };
  }, []);

  useEffect(() => {
    if (autoStart && behavioralData && !isAnalyzing) {
      // Auto-start with sample transaction
      const sampleTransaction: TransactionData = {
        transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.random() * 1000 + 50,
        user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
        currency: 'BRL',
        payment_method: 'credit_card',
        merchant_category: 'general'
      };
      
      setTransactionData(sampleTransaction);
      startAnalysis(sampleTransaction);
    }
  }, [autoStart, behavioralData, isAnalyzing]);

  const startAnalysis = async (transaction: TransactionData) => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Step 1: Initialize
      setCurrentStep(0);
      await sleep(analysisSteps[0].duration);
      setProgress(20);

      // Step 2: Behavioral Biometrics
      setCurrentStep(1);
      let behavioralProfile = behavioralData;
      if (!behavioralProfile && biometricsRef.current) {
        behavioralProfile = biometricsRef.current.getBehavioralProfile();
      }
      await sleep(analysisSteps[1].duration);
      setProgress(40);

      // Step 3: Edge ML Analysis
      setCurrentStep(2);
      let fraudPrediction = null;
      if (edgeMLRef.current) {
        try {
          await edgeMLRef.current.initialize();
          fraudPrediction = await edgeMLRef.current.predict({
            amount: transaction.amount,
            merchant_category: transaction.merchant_category,
            payment_method: transaction.payment_method,
            user_behavioral_score: behavioralProfile?.overall_risk_score || 0.3,
            transaction_hour: new Date().getHours(),
            transaction_day_of_week: new Date().getDay()
          });
        } catch (edgeError) {
          console.warn('Edge ML failed, using fallback:', edgeError);
          fraudPrediction = generateFallbackPrediction(transaction, behavioralProfile);
        }
      } else {
        fraudPrediction = generateFallbackPrediction(transaction, behavioralProfile);
      }
      await sleep(analysisSteps[2].duration);
      setProgress(70);

      // Step 4: Community Intelligence
      setCurrentStep(3);
      const communityThreatScore = await checkCommunityThreats(transaction);
      await sleep(analysisSteps[3].duration);
      setProgress(90);

      // Step 5: Final Decision
      setCurrentStep(4);
      const finalResult = generateFinalResult(
        transaction,
        fraudPrediction,
        communityThreatScore,
        behavioralProfile
      );
      await sleep(analysisSteps[4].duration);
      setProgress(100);

      setResult(finalResult);
      if (onResult) {
        onResult(finalResult);
      }

    } catch (analysisError) {
      console.error('Analysis failed:', analysisError);
      setError('Falha na análise. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackPrediction = (transaction: TransactionData, behavioral: any) => {
    // Simple rule-based prediction for fallback
    let score = 0.2; // Base score

    // Amount-based risk
    if (transaction.amount > 5000) score += 0.4;
    else if (transaction.amount > 1000) score += 0.2;

    // Time-based risk
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) score += 0.2;

    // Behavioral risk
    if (behavioral?.overall_risk_score) {
      score += behavioral.overall_risk_score * 0.3;
    }

    // Payment method risk
    if (transaction.payment_method === 'debit_card') score += 0.1;

    score = Math.min(score, 1.0);

    return {
      fraud_probability: score,
      confidence: 0.75,
      feature_importance: {
        'amount': transaction.amount > 1000 ? 0.4 : 0.1,
        'time_of_day': hour < 6 || hour > 22 ? 0.3 : 0.1,
        'behavioral_score': behavioral?.overall_risk_score || 0.2,
        'payment_method': 0.2
      }
    };
  };

  const checkCommunityThreats = async (transaction: TransactionData): Promise<number> => {
    // Simulate community intelligence check
    await sleep(300);
    
    // Mock community threat scoring
    const factors = [
      transaction.amount > 2000 ? 0.3 : 0.1,
      Math.random() * 0.2, // Random network intelligence
      transaction.payment_method === 'credit_card' ? 0.1 : 0.2
    ];
    
    return Math.min(factors.reduce((a, b) => a + b, 0), 1.0);
  };

  const generateFinalResult = (
    transaction: TransactionData,
    mlPrediction: any,
    communityThreat: number,
    behavioral: any
  ): FraudResult => {
    const fraudScore = Math.round((mlPrediction.fraud_probability + communityThreat * 0.3) * 100);
    
    let decision: 'approve' | 'reject' | 'review';
    if (fraudScore >= 80) decision = 'reject';
    else if (fraudScore >= 50) decision = 'review';
    else decision = 'approve';

    const explanation = [
      {
        factor: 'Valor da Transação',
        impact: mlPrediction.feature_importance?.amount || 0.2,
        description: `R$ ${transaction.amount.toFixed(2)} - ${
          transaction.amount > 1000 ? 'Alto valor' : 'Valor normal'
        }`
      },
      {
        factor: 'Biometria Comportamental',
        impact: behavioral?.overall_risk_score || 0.2,
        description: behavioral ? 
          `Score: ${(behavioral.overall_risk_score * 100).toFixed(1)}%` : 
          'Dados insuficientes'
      },
      {
        factor: 'Inteligência Comunitária',
        impact: communityThreat,
        description: `Score de ameaça: ${(communityThreat * 100).toFixed(1)}%`
      },
      {
        factor: 'Horário da Transação',
        impact: mlPrediction.feature_importance?.time_of_day || 0.1,
        description: `${new Date().getHours()}h - ${
          new Date().getHours() >= 6 && new Date().getHours() <= 22 ? 
          'Horário comercial' : 'Fora do horário comercial'
        }`
      }
    ];

    return {
      fraud_score: fraudScore,
      decision,
      confidence: mlPrediction.confidence || 0.75,
      explanation,
      processing_time_ms: Date.now() - (Date.now() - 3000), // Mock processing time
      community_threat_score: Math.round(communityThreat * 100),
      model_version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleManualAnalysis = () => {
    if (!transactionData) {
      // Create sample transaction for manual test
      const sampleTransaction: TransactionData = {
        transaction_id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.random() * 2000 + 100,
        user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
        currency: 'BRL',
        payment_method: ['credit_card', 'debit_card', 'pix'][Math.floor(Math.random() * 3)],
        merchant_category: ['general', 'food', 'electronics', 'clothing'][Math.floor(Math.random() * 4)]
      };
      setTransactionData(sampleTransaction);
      startAnalysis(sampleTransaction);
    } else {
      startAnalysis(transactionData);
    }
  };

  const getStatusColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'bg-green-500';
      case 'reject': return 'bg-red-500';
      case 'review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (decision: string) => {
    switch (decision) {
      case 'approve': return 'Aprovado';
      case 'reject': return 'Rejeitado';
      case 'review': return 'Revisão';
      default: return 'Processando';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔍</span>
            <span>FraudDetex - Análise em Tempo Real</span>
            {result && (
              <Badge className={`ml-auto ${getStatusColor(result.decision)} text-white`}>
                {getStatusText(result.decision)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAnalyzing && !result && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Pronto para analisar transações em tempo real
              </p>
              <Button onClick={handleManualAnalysis} className="bg-blue-600 hover:bg-blue-700">
                🚀 Iniciar Análise Demo
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="font-medium">
                  {analysisSteps[currentStep]?.name}
                </span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <p className="text-sm text-gray-600">
                {analysisSteps[currentStep]?.description}
              </p>

              {/* Real-time steps */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {analysisSteps.map((step, index) => (
                  <div key={index} className={`text-center p-2 rounded-lg text-xs ${
                    index < currentStep ? 'bg-green-100 text-green-800' :
                    index === currentStep ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {step.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 font-medium">Erro na Análise</p>
              <p className="text-red-600 text-sm">{error}</p>
              <Button 
                onClick={handleManualAnalysis} 
                variant="outline" 
                size="sm" 
                className="mt-2 border-red-500 text-red-600 hover:bg-red-50"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && transactionData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Score Meter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Score de Fraude</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskScoreMeter 
                score={result.fraud_score} 
                confidence={result.confidence}
                decision={result.decision}
              />
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tempo de Processamento</p>
                  <p className="font-medium">{result.processing_time_ms}ms</p>
                </div>
                <div>
                  <p className="text-gray-600">Ameaça Comunitária</p>
                  <p className="font-medium">{result.community_threat_score}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Confiança</p>
                  <p className="font-medium">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Modelo</p>
                  <p className="font-medium">v{result.model_version}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💳</span>
                <span>Detalhes da Transação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID da Transação:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {transactionData.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">
                    {transactionData.currency} {transactionData.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de Pagamento:</span>
                  <span className="font-medium capitalize">
                    {transactionData.payment_method.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium capitalize">
                    {transactionData.merchant_category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-medium text-xs">
                    {new Date(result.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Explainable AI Results */}
      {result && (
        <ExplainableDecisionViewer 
          decision={result.decision}
          explanation={result.explanation}
          confidence={result.confidence}
        />
      )}

      {/* Behavioral Data Display */}
      {behavioralData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👆</span>
              <span>Biometria Comportamental</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Velocidade do Mouse</p>
                <p className="font-medium">
                  {behavioralData.mouse_velocity_avg?.toFixed(1) || 'N/A'} px/s
                </p>
              </div>
              <div>
                <p className="text-gray-600">Pressão de Clique</p>
                <p className="font-medium">
                  {behavioralData.mouse_click_pressure?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tempo de Digitação</p>
                <p className="font-medium">
                  {behavioralData.keystroke_dwell_time?.toFixed(0) || 'N/A'}ms
                </p>
              </div>
              <div>
                <p className="text-gray-600">Score de Risco</p>
                <p className="font-medium">
                  {((behavioralData.overall_risk_score || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {result && (
        <div className="flex space-x-3">
          <Button 
            onClick={handleManualAnalysis}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            🔄 Nova Análise
          </Button>
          <Button 
            onClick={() => console.log('Export result:', result)}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            📊 Exportar Resultado
          </Button>
          <Button 
            onClick={() => {
              setResult(null);
              setTransactionData(null);
              setProgress(0);
            }}
            variant="outline"
            className="border-gray-500 text-gray-600 hover:bg-gray-50"
          >
            🗑️ Limpar
          </Button>
        </div>
      )}
    </div>
  );
}