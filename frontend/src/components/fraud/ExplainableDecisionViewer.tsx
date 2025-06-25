'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp,
  Shield,
  Clock,
  MapPin,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskScoreMeter } from './RiskScoreMeter';

interface FeatureContribution {
  name: string;
  value: number;
  contribution: number;
  importance: number;
  description: string;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface AlternativeScenario {
  scenario: string;
  score: number;
  probability: number;
  description: string;
}

interface RecentDecision {
  id: string;
  timestamp: Date;
  riskScore: number;
  decision: 'APPROVE' | 'REVIEW' | 'BLOCK';
  confidence: number;
  explanation: string[];
  processingTime: number;
  location: string;
}

interface ExplainableDecisionViewerProps {
  decision: RecentDecision;
}

export function ExplainableDecisionViewer({ decision }: ExplainableDecisionViewerProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureContribution | null>(null);

  // Generate realistic feature contributions
  const generateFeatureContributions = (): FeatureContribution[] => {
    const features: FeatureContribution[] = [
      {
        name: 'IP Reputation',
        value: 0.23,
        contribution: 25,
        importance: 85,
        description: 'IP address reputation analysis based on historical fraud data',
        category: 'Network',
        impact: decision.riskScore > 50 ? 'negative' : 'positive'
      },
      {
        name: 'Email Domain Age',
        value: 0.18,
        contribution: 20,
        importance: 75,
        description: 'Age of email domain and registration patterns',
        category: 'Identity',
        impact: decision.riskScore > 60 ? 'negative' : 'positive'
      },
      {
        name: 'Behavioral Biometrics',
        value: 0.15,
        contribution: 18,
        importance: 92,
        description: 'Mouse movement, keystroke dynamics, and interaction patterns',
        category: 'Behavior',
        impact: decision.riskScore > 70 ? 'negative' : 'positive'
      },
      {
        name: 'Device Fingerprint',
        value: 0.12,
        contribution: 15,
        importance: 68,
        description: 'Unique device characteristics and browser settings',
        category: 'Device',
        impact: 'neutral'
      },
      {
        name: 'Transaction Velocity',
        value: 0.10,
        contribution: 12,
        importance: 55,
        description: 'Frequency and timing of recent transactions',
        category: 'Temporal',
        impact: decision.riskScore > 50 ? 'negative' : 'positive'
      },
      {
        name: 'Geographic Consistency',
        value: 0.08,
        contribution: 8,
        importance: 45,
        description: 'Location consistency between IP, billing, and shipping',
        category: 'Geographic',
        impact: 'positive'
      },
      {
        name: 'Amount Deviation',
        value: 0.06,
        contribution: 7,
        importance: 40,
        description: 'Deviation from typical transaction amounts',
        category: 'Financial',
        impact: decision.riskScore > 60 ? 'negative' : 'neutral'
      },
      {
        name: 'Time Pattern Analysis',
        value: 0.05,
        contribution: 5,
        importance: 35,
        description: 'Transaction timing patterns and anomalies',
        category: 'Temporal',
        impact: 'neutral'
      },
      {
        name: 'Community Intelligence',
        value: 0.03,
        contribution: 3,
        importance: 25,
        description: 'Insights from community threat sharing network',
        category: 'Community',
        impact: decision.riskScore > 70 ? 'negative' : 'positive'
      }
    ];

    return features.sort((a, b) => b.importance - a.importance);
  };

  const featureContributions = generateFeatureContributions();

  const alternativeScenarios: AlternativeScenario[] = [
    {
      scenario: 'Trusted Device',
      score: Math.max(0, decision.riskScore - 30),
      probability: 0.25,
      description: 'Se fosse um dispositivo previamente confiável'
    },
    {
      scenario: 'Known IP Range',
      score: Math.max(0, decision.riskScore - 20),
      probability: 0.15,
      description: 'Se o IP fosse de uma faixa conhecida e confiável'
    },
    {
      scenario: 'Verified Email',
      score: Math.max(0, decision.riskScore - 25),
      probability: 0.20,
      description: 'Se o email fosse verificado e estabelecido'
    },
    {
      scenario: 'Normal Hours',
      score: Math.max(0, decision.riskScore - 10),
      probability: 0.40,
      description: 'Se a transação fosse em horário comercial'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVE': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'REVIEW': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'BLOCK': return <Shield className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Network': return <Activity className="h-4 w-4" />;
      case 'Identity': return <Eye className="h-4 w-4" />;
      case 'Behavior': return <Brain className="h-4 w-4" />;
      case 'Device': return <Zap className="h-4 w-4" />;
      case 'Temporal': return <Clock className="h-4 w-4" />;
      case 'Geographic': return <MapPin className="h-4 w-4" />;
      case 'Financial': return <TrendingUp className="h-4 w-4" />;
      case 'Community': return <Target className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Decision Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Decisão Final</p>
                <div className="flex items-center mt-1">
                  {getDecisionIcon(decision.decision)}
                  <span className="ml-2 text-lg font-bold">{decision.decision}</span>
                </div>
              </div>
              <RiskScoreMeter score={decision.riskScore} size="md" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confiança</p>
                <p className="text-2xl font-bold">{(decision.confidence * 100).toFixed(1)}%</p>
              </div>
              <Progress value={decision.confidence * 100} className="w-16" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo de Processamento</p>
                <p className="text-2xl font-bold">{decision.processingTime.toFixed(0)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Fatores de Risco</TabsTrigger>
          <TabsTrigger value="explanation">Explicação</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Feature Contributions */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Análise de Fatores de Risco
              </CardTitle>
              <CardDescription>
                Contribuição de cada fator para a decisão final (ordenado por importância)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureContributions.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFeature?.name === feature.name 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(feature.category)}
                          <span className="font-medium">{feature.name}</span>
                          <Badge 
                            variant="outline" 
                            className={getImpactColor(feature.impact)}
                          >
                            {feature.impact === 'positive' ? '+' : feature.impact === 'negative' ? '-' : '='}
                            {feature.contribution}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Importância</span>
                            <span className="font-medium">{feature.importance}%</span>
                          </div>
                          <Progress value={feature.importance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Detail Panel */}
          <AnimatePresence>
            {selectedFeature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getCategoryIcon(selectedFeature.category)}
                      <span className="ml-2">{selectedFeature.name}</span>
                      <Badge className="ml-2" variant="secondary">
                        {selectedFeature.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Valor</p>
                        <p className="text-lg font-bold">{selectedFeature.value.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Contribuição</p>
                        <p className="text-lg font-bold">{selectedFeature.contribution}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Impacto</p>
                        <Badge className={getImpactColor(selectedFeature.impact)}>
                          {selectedFeature.impact}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700">{selectedFeature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Human-Readable Explanation */}
        <TabsContent value="explanation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Explicação Detalhada
              </CardTitle>
              <CardDescription>
                Análise em linguagem natural da decisão tomada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Resumo da Decisão</h4>
                  <p className="text-blue-800">
                    O sistema analisou esta transação e atribuiu um risco de <strong>{decision.riskScore}%</strong>, 
                    resultando na decisão de <strong>{decision.decision}</strong> com {(decision.confidence * 100).toFixed(1)}% de confiança.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Fatores Principais:</h4>
                  {decision.explanation.map((explanation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{explanation}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Recomendação</h4>
                  <p className="text-green-800">
                    {decision.decision === 'APPROVE' 
                      ? 'Esta transação apresenta baixo risco e pode ser aprovada automaticamente.'
                      : decision.decision === 'REVIEW'
                      ? 'Esta transação apresenta risco moderado e deve ser revisada manualmente antes da aprovação.'
                      : 'Esta transação apresenta alto risco e deve ser bloqueada para proteção contra fraude.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alternative Scenarios */}
        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Análise de Cenários Alternativos
              </CardTitle>
              <CardDescription>
                Como o score mudaria em diferentes cenários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alternativeScenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario.scenario}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium">{scenario.scenario}</h5>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {scenario.score}%
                        </div>
                        <div className="text-sm text-gray-500">
                          vs {decision.riskScore}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Progress value={scenario.score} className="h-2" />
                      </div>
                      <Badge variant="outline">
                        {(scenario.probability * 100).toFixed(0)}% prob.
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline da Decisão
              </CardTitle>
              <CardDescription>
                Processo detalhado de análise e decisão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '0ms', event: 'Request recebido', description: 'Dados da transação capturados' },
                  { time: '5ms', event: 'Validação inicial', description: 'Campos obrigatórios verificados' },
                  { time: '12ms', event: 'Behavioral analysis', description: 'Padrões comportamentais analisados' },
                  { time: '18ms', event: 'IP reputation check', description: 'Reputação do IP verificada' },
                  { time: '25ms', event: 'Community intelligence', description: 'Consulta à rede colaborativa' },
                  { time: '32ms', event: 'ML inference', description: 'Modelo de machine learning executado' },
                  { time: '38ms', event: 'Feature aggregation', description: 'Fatores de risco combinados' },
                  { time: `${decision.processingTime.toFixed(0)}ms`, event: 'Decisão final', description: `${decision.decision} com ${(decision.confidence * 100).toFixed(1)}% confiança` }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-16 text-right text-sm font-mono text-gray-500 mt-1">
                      {step.time}
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h5 className="font-medium">{step.event}</h5>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}