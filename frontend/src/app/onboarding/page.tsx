'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist';

export default function OnboardingPage() {
  const [showTour, setShowTour] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);
  const router = useRouter();

  const handleTourComplete = () => {
    setShowTour(false);
    setShowChecklist(true);
    
    // Save tour completion to localStorage
    localStorage.setItem('fraudshield_tour_completed', 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    setShowChecklist(true);
    
    // Save tour skip to localStorage
    localStorage.setItem('fraudshield_tour_skipped', 'true');
  };

  const handleChecklistComplete = () => {
    setShowChecklist(false);
    
    // Save checklist completion to localStorage
    localStorage.setItem('fraudshield_onboarding_completed', 'true');
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  // Check if user has already completed onboarding
  useEffect(() => {
    const tourCompleted = localStorage.getItem('fraudshield_tour_completed');
    const tourSkipped = localStorage.getItem('fraudshield_tour_skipped');
    const onboardingCompleted = localStorage.getItem('fraudshield_onboarding_completed');
    
    if (onboardingCompleted) {
      router.push('/dashboard');
      return;
    }
    
    if (tourCompleted || tourSkipped) {
      setShowTour(false);
      setShowChecklist(true);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">FraudShield Revolutionary</h1>
                <p className="text-sm text-gray-500">Setup da sua conta</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Pular para Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showTour && !showChecklist && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl">✓</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Setup Completo!</h2>
              <p className="text-gray-600 mt-2">
                Sua conta FraudShield está configurada e pronta para uso.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              🚀 Acessar Dashboard
            </button>
          </div>
        )}

        {showChecklist && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Vamos configurar sua conta!
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete estes passos rápidos para aproveitar ao máximo o FraudShield Revolutionary. 
                Cada etapa é importante para garantir que você tenha a melhor experiência possível.
              </p>
            </div>
            
            <OnboardingChecklist onComplete={handleChecklistComplete} />
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-gray-900">&lt;100ms</div>
                <div className="text-gray-600">Tempo de resposta</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-gray-900">99.7%</div>
                <div className="text-gray-600">Precisão de detecção</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-gray-600">Proteção global</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tour overlay */}
      {showTour && (
        <OnboardingTour 
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
      
      {/* Help section */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💬</div>
            <div>
              <h4 className="font-medium text-gray-900">Precisa de ajuda?</h4>
              <p className="text-sm text-gray-600">
                Nossa equipe está disponível 24/7
              </p>
            </div>
          </div>
          <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
            💬 Falar com Suporte
          </button>
        </div>
      </div>
    </div>
  );
}