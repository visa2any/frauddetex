'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always succeed
      setIsEmailSent(true);
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🛡️</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg opacity-20 blur-md"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h1>
            <p className="text-gray-400">
              Insira seu email para receber as instruções de recuperação
            </p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      '📧 Enviar Instruções'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-400 text-2xl">✅</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Email Enviado!
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Enviamos as instruções de recuperação para:
                    </p>
                    <Badge className="bg-slate-700 text-white">
                      {email}
                    </Badge>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4">
                    <p className="text-blue-400 text-sm">
                      📬 Verifique sua caixa de entrada e pasta de spam. 
                      O email pode levar alguns minutos para chegar.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail('');
                    }}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Enviar Novamente
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="mt-6 text-center space-y-3">
                <div className="text-sm">
                  <span className="text-gray-400">Lembrou da senha? </span>
                  <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
                    Fazer Login
                  </Link>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-400">Não tem uma conta? </span>
                  <Link href="/signup" className="text-red-400 hover:text-red-300 font-medium">
                    Criar Conta
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Precisa de Ajuda?</span>
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Verifique se o email está digitado corretamente</p>
                  <p>• Confira a pasta de spam/lixo eletrônico</p>
                  <p>• O link de recuperação expira em 24 horas</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <p className="text-xs text-gray-500">
                    Ainda com problemas? Entre em contato com nosso suporte: 
                    <a href="mailto:suporte@frauddetex.com" className="text-red-400 hover:text-red-300 ml-1">
                      suporte@frauddetex.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}