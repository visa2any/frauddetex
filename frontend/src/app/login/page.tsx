'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSafeAuth } from '@/hooks/use-safe-auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'demo@frauddetex.com',
    password: 'demo123',
    rememberMe: false
  });
  const [error, setError] = useState('');
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FraudDetex</h1>
          <p className="text-blue-200">Fraud Detection System</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Entrar na sua conta
            </CardTitle>
            <p className="text-gray-600 text-center">
              Entre com suas credenciais para acessar o dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                    Criar conta
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-lg border border-white/20">
          <h3 className="text-white font-medium mb-2">🧪 Credenciais Demo</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <p><strong>Email:</strong> demo@frauddetex.com</p>
            <p><strong>Senha:</strong> demo123</p>
          </div>
          <p className="text-xs text-blue-300 mt-2">Os campos já estão preenchidos automaticamente!</p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-200 hover:text-white text-sm">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}