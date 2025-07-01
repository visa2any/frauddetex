'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSafeAuth } from '@/hooks/use-safe-auth';

const PLANS = {
  community: {
    name: 'Community',
    price: 'Grátis',
    requests: '10.000',
    features: ['Detecção básica de fraudes', 'Compartilhamento comunitário', 'Suporte padrão']
  },
  smart: {
    name: 'Smart',
    price: 'R$ 0,05/req',
    requests: '100.000',
    features: ['Detecção avançada', 'Edge processing', 'Biometria comportamental', 'Suporte prioritário']
  },
  enterprise: {
    name: 'Enterprise',
    price: 'R$ 0,02/req',
    requests: '1.000.000',
    features: ['Todos recursos Smart', 'Modelos customizados', 'Suporte dedicado', 'SLA garantido']
  },
  insurance: {
    name: 'Insurance',
    price: '1% do valor',
    requests: '500.000',
    features: ['Todos recursos Enterprise', 'Garantia de seguro', 'Reembolso de fraudes']
  }
};

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    plan: 'smart'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isAuthenticated } = useSafeAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      setStep(2);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        plan: formData.plan
      });

      if (result.success) {
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const selectPlan = (planId: string) => {
    setFormData(prev => ({ ...prev, plan: planId }));
  };

  const handleSocialSignup = async (provider: string) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      // Simular signup social
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você integraria com providers reais
      console.log(`Signup with ${provider} - Feature coming soon!`);
      setError(`Cadastro com ${provider} será implementado em breve!`);
    } catch (err) {
      setError(`Erro ao criar conta com ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Branding & Features */}
          <div className="text-center lg:text-left space-y-8">
            <div>
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-white text-3xl font-bold">🛡️</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-2xl opacity-20 blur-xl"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    FraudDetex
                  </h1>
                  <p className="text-orange-300/70 font-medium">Enterprise Security</p>
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Proteja seu Negócio desde o Primeiro Dia
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Cadastre-se agora e tenha acesso ao sistema mais avançado de detecção de fraudes do mercado.
              </p>
            </div>

            {/* Enterprise Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="font-semibold text-white mb-2">Deploy Instantâneo</h3>
                <p className="text-sm text-slate-400">Configuração em menos de 5 minutos</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">💰</div>
                <h3 className="font-semibold text-white mb-2">ROI Garantido</h3>
                <p className="text-sm text-slate-400">Retorno do investimento em 30 dias</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">🌐</div>
                <h3 className="font-semibold text-white mb-2">Integração Universal</h3>
                <p className="text-sm text-slate-400">API REST e SDKs para todas as linguagens</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">🔒</div>
                <h3 className="font-semibold text-white mb-2">Certificações SOC 2</h3>
                <p className="text-sm text-slate-400">Compliance total LGPD, PCI DSS</p>
              </div>
            </div>

            {/* Plans Preview */}
            <div className="pt-8 border-t border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Planos Disponíveis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400 mb-1">Community</div>
                  <div className="text-sm text-slate-400">Grátis - 10K req/mês</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400 mb-1">Smart</div>
                  <div className="text-sm text-slate-400">R$ 0,05/req - 100K req/mês</div>
                  <Badge className="mt-1 bg-orange-500 text-white text-xs">Recomendado</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {step === 1 ? 'Criar sua conta' : 'Escolher plano'}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    🚀 Grátis
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {step === 1 
                    ? 'Comece a detectar fraudes em segundos' 
                    : 'Selecione o plano ideal para suas necessidades'
                  }
                </p>
                
                {/* Progress indicator */}
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      1
                    </div>
                    <div className={`h-1 w-12 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {step === 1 && (
                  <>
                    {/* Social Signup Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleSocialSignup('Google')}
                        disabled={isSubmitting || isLoading}
                        variant="outline"
                        className="w-full h-12 text-left justify-start space-x-3 border-gray-300 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continuar com Google</span>
                      </Button>

                      <Button
                        onClick={() => handleSocialSignup('Microsoft')}
                        disabled={isSubmitting || isLoading}
                        variant="outline"
                        className="w-full h-12 text-left justify-start space-x-3 border-gray-300 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#f25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
                          <path fill="#00a4ef" d="M24 11.4H12.6V0H24v11.4z"/>
                          <path fill="#7fba00" d="M11.4 24H0V12.6h11.4V24z"/>
                          <path fill="#ffb900" d="M24 24H12.6V12.6H24V24z"/>
                        </svg>
                        <span>Continuar com Microsoft</span>
                      </Button>

                      <Button
                        onClick={() => handleSocialSignup('GitHub')}
                        disabled={isSubmitting || isLoading}
                        variant="outline"
                        className="w-full h-12 text-left justify-start space-x-3 border-gray-300 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span>Continuar com GitHub</span>
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Ou crie conta com email</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {step === 1 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Nome Completo
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            placeholder="João Silva"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="company" className="text-sm font-medium text-gray-700">
                            Empresa
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            placeholder="Minha Empresa Ltda"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Corporativo
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                          placeholder="joao@minhaempresa.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Senha
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirmar Senha
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 h-12"
                      >
                        <span className="mr-2">🚀</span>
                        Continuar
                      </Button>
                    </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(PLANS).map(([key, plan]) => (
                      <div
                        key={key}
                        onClick={() => selectPlan(key)}
                        className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.plan === key
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        {key === 'smart' && (
                          <Badge className="absolute -top-2 left-4 bg-orange-500">Recomendado</Badge>
                        )}
                        
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{plan.name}</h3>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">{plan.price}</div>
                            <div className="text-xs text-gray-500">{plan.requests} req/mês</div>
                          </div>
                        </div>
                        
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {formData.plan === key && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="w-full"
                    >
                      Voltar
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 h-12"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Criando conta...
                        </div>
                      ) : (
                        <>
                          <span className="mr-2">🛡️</span>
                          <span>Criar Conta Empresarial</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
                </form>

                {/* Enterprise Features */}
                {step === 1 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-gray-600">
                        Já tem uma conta? {' '}
                        <Link href="/login" className="text-red-600 hover:text-red-500 font-medium">
                          Fazer login
                        </Link>
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <span className="mr-1">🔒</span>
                          SSL/TLS
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">🛡️</span>
                          2FA Incluído
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">✅</span>
                          LGPD Compliant
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-green-900/20 backdrop-blur rounded-lg border border-green-500/20">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <span className="mr-2">🎁</span>
                Teste Grátis por 30 Dias
              </h3>
              <div className="text-sm text-green-200 space-y-1">
                <p><strong>✓</strong> 10.000 transações incluídas</p>
                <p><strong>✓</strong> Todos os recursos premium</p>
                <p><strong>✓</strong> Suporte prioritário</p>
                <p className="text-xs text-green-300 mt-2">
                  🎯 Sem cartão de crédito necessário
                </p>
              </div>
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-slate-300 hover:text-white text-sm flex items-center justify-center">
                <span className="mr-2">←</span>
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}