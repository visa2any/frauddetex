'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  user_id: string;
  payment_method: string;
  fraud_score: number;
  decision: 'approve' | 'decline' | 'review';
  timestamp: Date;
  country: string;
  confidence: number;
  risk_factors: string[];
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'txn_001',
        amount: 1250.00,
        currency: 'BRL',
        user_id: 'user_abc123',
        payment_method: 'credit_card',
        fraud_score: 15,
        decision: 'approve',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        country: 'BR',
        confidence: 92,
        risk_factors: []
      },
      {
        id: 'txn_002',
        amount: 5000.00,
        currency: 'BRL',
        user_id: 'user_xyz789',
        payment_method: 'pix',
        fraud_score: 85,
        decision: 'decline',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        country: 'BR',
        confidence: 98,
        risk_factors: ['unusual_amount', 'new_device', 'velocity_check']
      },
      {
        id: 'txn_003',
        amount: 350.00,
        currency: 'BRL',
        user_id: 'user_def456',
        payment_method: 'debit_card',
        fraud_score: 35,
        decision: 'review',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        country: 'US',
        confidence: 78,
        risk_factors: ['geo_mismatch']
      },
      {
        id: 'txn_004',
        amount: 150.00,
        currency: 'BRL',
        user_id: 'user_ghi789',
        payment_method: 'credit_card',
        fraud_score: 8,
        decision: 'approve',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        country: 'BR',
        confidence: 95,
        risk_factors: []
      },
      {
        id: 'txn_005',
        amount: 2800.00,
        currency: 'BRL',
        user_id: 'user_jkl012',
        payment_method: 'wire_transfer',
        fraud_score: 72,
        decision: 'decline',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        country: 'NG',
        confidence: 89,
        risk_factors: ['high_risk_country', 'unusual_hour', 'no_history']
      },
      {
        id: 'txn_006',
        amount: 899.99,
        currency: 'BRL',
        user_id: 'user_mno345',
        payment_method: 'pix',
        fraud_score: 22,
        decision: 'approve',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        country: 'BR',
        confidence: 88,
        risk_factors: []
      },
      {
        id: 'txn_007',
        amount: 75.50,
        currency: 'BRL',
        user_id: 'user_pqr678',
        payment_method: 'credit_card',
        fraud_score: 5,
        decision: 'approve',
        timestamp: new Date(Date.now() - 22 * 60 * 1000),
        country: 'BR',
        confidence: 96,
        risk_factors: []
      },
      {
        id: 'txn_008',
        amount: 3200.00,
        currency: 'BRL',
        user_id: 'user_stu901',
        payment_method: 'wire_transfer',
        fraud_score: 68,
        decision: 'review',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        country: 'CA',
        confidence: 82,
        risk_factors: ['unusual_amount', 'international']
      }
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of new transaction
        const newTransaction: Transaction = {
          id: `txn_${Date.now()}`,
          amount: Math.floor(Math.random() * 3000) + 100,
          currency: 'BRL',
          user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
          payment_method: ['credit_card', 'debit_card', 'pix', 'wire_transfer'][Math.floor(Math.random() * 4)],
          fraud_score: Math.floor(Math.random() * 100),
          decision: Math.random() < 0.8 ? 'approve' : Math.random() < 0.7 ? 'decline' : 'review',
          timestamp: new Date(),
          country: ['BR', 'US', 'CA', 'MX', 'AR'][Math.floor(Math.random() * 5)],
          confidence: Math.floor(Math.random() * 30) + 70,
          risk_factors: []
        };

        if (newTransaction.fraud_score > 70) {
          newTransaction.decision = 'decline';
          newTransaction.risk_factors = ['high_score', 'velocity_check'];
        } else if (newTransaction.fraud_score > 40) {
          newTransaction.decision = 'review';
          newTransaction.risk_factors = ['moderate_risk'];
        }

        setTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  const getDecisionBadge = (decision: string, fraudScore: number) => {
    switch (decision) {
      case 'approve':
        return <Badge className="bg-green-100 text-green-800">✓ Aprovada</Badge>;
      case 'decline':
        return <Badge className="bg-red-100 text-red-800">✗ Bloqueada</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠ Revisão</Badge>;
      default:
        return <Badge variant="secondary">Processando</Badge>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return '💳';
      case 'debit_card':
        return '💳';
      case 'pix':
        return '⚡';
      case 'wire_transfer':
        return '🏦';
      default:
        return '💱';
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'BR': '🇧🇷',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'MX': '🇲🇽',
      'AR': '🇦🇷',
      'NG': '🇳🇬'
    };
    return flags[country] || '🌍';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>⚡</span>
            <span>Transações em Tempo Real</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                index === 0 ? 'bg-blue-50 border-blue-200 animate-pulse' : 'bg-white border-gray-200'
              } hover:shadow-md cursor-pointer`}
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.decision === 'approve' ? 'bg-green-100' :
                  transaction.decision === 'decline' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <span className="text-lg">
                    {getPaymentMethodIcon(transaction.payment_method)}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getCountryFlag(transaction.country)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {transaction.id.slice(-6)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600">
                    Score: <span className={`font-medium ${getRiskColor(transaction.fraud_score)}`}>
                      {transaction.fraud_score}
                    </span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Confiança: {transaction.confidence}%
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {formatTime(transaction.timestamp)}
                  </span>
                </div>
                
                {transaction.risk_factors.length > 0 && (
                  <div className="mt-1">
                    <div className="flex flex-wrap gap-1">
                      {transaction.risk_factors.map((factor, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                {getDecisionBadge(transaction.decision, transaction.fraud_score)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>🔄 Atualizações automáticas a cada 10s</span>
            <span>📊 {transactions.length} transações mostradas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}