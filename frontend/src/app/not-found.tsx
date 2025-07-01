'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                404
              </div>
              <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-500/20 blur-sm">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Página Não Encontrada
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Oops! A página que você está procurando não existe ou foi movida.
            </p>
            <p className="text-gray-400">
              Não se preocupe, acontece com os melhores de nós. Vamos te ajudar a voltar ao caminho certo.
            </p>
          </div>

          {/* Navigation Options */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Para onde você gostaria de ir?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  asChild 
                  className="bg-red-500 hover:bg-red-600 text-white h-auto p-4"
                >
                  <Link href="/" className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">🏠</span>
                    <span className="font-medium">Página Inicial</span>
                    <span className="text-xs text-red-100">Voltar ao início</span>
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white h-auto p-4"
                >
                  <Link href="/demo" className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">🎯</span>
                    <span className="font-medium">Demo Gratuito</span>
                    <span className="text-xs">Testar nossa tecnologia</span>
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white h-auto p-4"
                >
                  <Link href="/dashboard" className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                    <span className="text-xs">Acessar sua conta</span>
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white h-auto p-4"
                >
                  <Link href="/blog" className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">📚</span>
                    <span className="font-medium">Blog</span>
                    <span className="text-xs">Ler nossos artigos</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Suggestions */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-white mb-4">
                🔍 Páginas Mais Procuradas
              </h4>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  href="/pricing" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  Preços
                </Link>
                <Link 
                  href="/solutions" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  Soluções
                </Link>
                <Link 
                  href="/signup" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  Criar Conta
                </Link>
                <Link 
                  href="/login" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/dashboard/frauddetex" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  FraudDetex
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Ainda não encontrou o que procura?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="mailto:suporte@frauddetex.com" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                📧 Entre em contato conosco
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link 
                href="/blog" 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                📖 Consulte nossa documentação
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}