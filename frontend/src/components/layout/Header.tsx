'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  variant?: 'homepage' | 'dashboard' | 'pricing' | 'billing' | 'blog' | 'solutions';
}

export default function Header({ variant = 'homepage' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useSafeAuth();

  // Navegação pública (sem Dashboard)
  const publicNavigationItems = [
    { href: '/solutions', label: 'Soluções', icon: '🎯' },
    { href: '/pricing', label: 'Preços', icon: '💰' },
    { href: '/blog', label: 'Blog', icon: '📚' }
  ];

  // Navegação autenticada (com Dashboard)
  const authenticatedNavigationItems = [
    { href: '/solutions', label: 'Soluções', icon: '🎯' },
    { href: '/pricing', label: 'Preços', icon: '💰' },
    { href: '/blog', label: 'Blog', icon: '📚' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' }
  ];

  const navigationItems = isAuthenticated ? authenticatedNavigationItems : publicNavigationItems;

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">🛡️</span>
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg opacity-20 blur-md"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight">FraudDetex</span>
              <span className="text-xs text-orange-300/70 font-medium tracking-wide">FRAUD DETECTION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors font-medium"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-slate-300">
                    Olá, <span className="text-white font-medium">{user?.name}</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-500 text-slate-400 hover:bg-slate-700 hover:text-white"
                  onClick={logout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white border-0" 
                  asChild
                >
                  <Link href="/signup">🛡️ Proteger Agora</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-center text-sm text-slate-300 mb-3">
                      Olá, <span className="text-white font-medium">{user?.name}</span>
                      <Badge variant="outline" className="ml-2 border-green-500 text-green-400">
                        {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                      asChild
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-slate-500 text-slate-400 hover:bg-slate-700 hover:text-white"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white border-0" 
                      asChild
                    >
                      <Link href="/signup">🛡️ Proteger Agora</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}