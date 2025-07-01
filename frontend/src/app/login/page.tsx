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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'demo@frauddetex.com',
    password: 'demo123',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useSafeAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (result.success) {
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro interno do servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialLogin = async (provider: string) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      // Simular login social
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você integraria com providers reais
      console.log(`Login with ${provider} - Feature coming soon!`);
      setError(`Login com ${provider} será implementado em breve!`);
    } catch (err) {
      setError(`Erro ao fazer login com ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
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
                Proteja seu Negócio com IA Avançada
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Sistema líder mundial em detecção de fraudes com explicabilidade total e proteção em tempo real.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold text-white mb-2">Detecção em Tempo Real</h3>
                <p className="text-sm text-slate-400">Análise instantânea com resposta em &lt;50ms</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">🧠</div>
                <h3 className="font-semibold text-white mb-2">IA Explicável</h3>
                <p className="text-sm text-slate-400">Entenda cada decisão com transparência total</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">👆</div>
                <h3 className="font-semibold text-white mb-2">Biometria Comportamental</h3>
                <p className="text-sm text-slate-400">Análise de padrões únicos de usuário</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="text-2xl mb-3">🔒</div>
                <h3 className="font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-sm text-slate-400">Conformidade LGPD, PCI DSS, ISO 27001</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">94%</div>
                <div className="text-sm text-slate-400">Taxa de Detecção</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">&lt;1%</div>
                <div className="text-sm text-slate-400">Falsos Positivos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">50M+</div>
                <div className="text-sm text-slate-400">Transações Protegidas</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Entrar na sua conta
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    🔒 Seguro
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Acesse o dashboard mais avançado de detecção de fraudes
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSocialLogin('Google')}
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
                    onClick={() => handleSocialLogin('Microsoft')}
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
                    onClick={() => handleSocialLogin('GitHub')}
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
                    <span className="px-2 bg-white text-gray-500">Ou continue com email</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  )}

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
                      placeholder="seu.email@empresa.com"
                    />
                  </div>

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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                      />
                      <span className="ml-2 text-sm text-gray-600">Manter-me logado</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-500 font-medium">
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 h-12"
                  >
                    {isSubmitting || isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Entrando...
                      </div>
                    ) : (
                      <>
                        <span>🔓</span>
                        <span className="ml-2">Entrar no FraudDetex</span>
                      </>
                    )}
                  </Button>
                </form>

                {/* Enterprise Features */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Não tem uma conta? {' '}
                      <Link href="/signup" className="text-red-600 hover:text-red-500 font-medium">
                        Criar conta empresarial
                      </Link>
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">🔒</span>
                        SSL/TLS
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🛡️</span>
                        2FA Disponível
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">✅</span>
                        SOC 2
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-900/20 backdrop-blur rounded-lg border border-blue-500/20">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <span className="mr-2">🧪</span>
                Credenciais Demo (Pré-preenchidas)
              </h3>
              <div className="text-sm text-blue-200 space-y-1">
                <p><strong>Email:</strong> demo@frauddetex.com</p>
                <p><strong>Senha:</strong> demo123</p>
                <p className="text-xs text-blue-300 mt-2">
                  ✨ Acesso total ao dashboard com dados simulados
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