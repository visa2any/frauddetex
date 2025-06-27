'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userEmail = localStorage.getItem('user_email') || '';
    setEmail(userEmail);

    if (token) {
      verifyEmail(token);
    } else {
      setStatus('resend');
      setMessage('Verifique seu email para completar o cadastro.');
    }
  }, [searchParams, router]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verificado com sucesso! Redirecionando...');
        
        // Update user data in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.email_verified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Token de verificação inválido ou expirado.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao verificar email. Tente novamente.');
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage('Email não encontrado. Faça login novamente.');
      return;
    }

    setIsResending(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email de verificação enviado! Verifique sua caixa de entrada.');
      } else {
        setMessage(data.message || 'Erro ao enviar email de verificação.');
      }
    } catch (error) {
      setMessage('Erro ao enviar email de verificação. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        );
      case 'success':
        return (
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-2xl">✗</span>
          </div>
        );
      case 'resend':
        return (
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-2xl">📧</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'loading':
      case 'resend':
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FraudShield</h1>
          <p className="text-blue-200">Revolutionary</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Verificação de Email
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className={`text-lg mb-6 ${getStatusColor()}`}>
              {message}
            </p>

            {status === 'loading' && (
              <p className="text-gray-600 mb-4">
                Verificando seu email...
              </p>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    🎉 Sua conta foi ativada com sucesso! Você será redirecionado para o dashboard.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Ir para Dashboard
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    O link pode ter expirado ou já foi usado. Solicite um novo email de verificação.
                  </p>
                </div>
                <Button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isResending ? 'Enviando...' : 'Reenviar Email'}
                </Button>
              </div>
            )}

            {status === 'resend' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    📧 Enviamos um email de verificação para <strong>{email}</strong>. 
                    Clique no link do email para ativar sua conta.
                  </p>
                </div>
                
                <div className="text-left space-y-2">
                  <h3 className="font-medium text-gray-800">Não recebeu o email?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Verifique sua pasta de spam</li>
                    <li>• Aguarde alguns minutos</li>
                    <li>• Clique em &quot;Reenviar Email&quot; abaixo</li>
                  </ul>
                </div>

                <Button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Reenviar Email de Verificação'
                  )}
                </Button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Fazer Login
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/signup" className="text-blue-600 hover:text-blue-500">
                  Criar Conta
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/" className="text-blue-600 hover:text-blue-500">
                  Início
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-lg border border-white/20">
          <h3 className="text-white font-medium mb-2">🆘 Precisa de ajuda?</h3>
          <p className="text-blue-200 text-sm">
            Entre em contato: <a href="mailto:support@fraudshield.revolutionary" className="text-white underline">support@fraudshield.revolutionary</a>
          </p>
        </div>
      </div>
    </div>
  );
}