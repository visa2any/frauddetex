'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthResult, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<AuthResult>;
  updateUser: (userData: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Verificar se há token armazenado e validar usuário
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Validar token e obter dados do usuário
        // Por enquanto, simulando um usuário válido
        const mockUser: User = {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Usuário Demo',
          role: 'user',
          permissions: [
            { type: 'read', resource: 'dashboard', granted: true },
            { type: 'write', resource: 'transactions', granted: true }
          ],
          preferences: {
            theme: 'dark',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: true,
              sms: false,
              dashboard: true,
              highRiskAlerts: true
            }
          },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isActive: true
        };

        setUser(mockUser);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('auth-token');
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Simulação de login - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validação básica
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email e senha são obrigatórios'
        };
      }

      if (credentials.email === 'demo@frauddetex.com' && credentials.password === 'demo123') {
        const mockUser: User = {
          id: 'user-demo',
          email: credentials.email,
          name: 'Usuário Demo',
          role: 'admin',
          permissions: [
            { type: 'read', resource: 'dashboard', granted: true },
            { type: 'write', resource: 'transactions', granted: true },
            { type: 'admin', resource: 'settings', granted: true }
          ],
          preferences: {
            theme: 'dark',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: true,
              sms: true,
              dashboard: true,
              highRiskAlerts: true
            }
          },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isActive: true
        };

        const token = 'demo-auth-token-' + Date.now();
        
        // Armazenar token
        localStorage.setItem('auth-token', token);
        document.cookie = `auth-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 dias

        setUser(mockUser);

        return {
          success: true,
          user: mockUser,
          token,
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
      } else {
        return {
          success: false,
          error: 'Credenciais inválidas. Use demo@frauddetex.com / demo123'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Simulação de cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validações básicas
      if (!userData.email || !userData.password || !userData.name) {
        return {
          success: false,
          error: 'Todos os campos são obrigatórios'
        };
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres'
        };
      }

      const mockUser: User = {
        id: 'user-' + Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'user',
        permissions: [
          { type: 'read', resource: 'dashboard', granted: true },
          { type: 'write', resource: 'transactions', granted: true }
        ],
        preferences: {
          theme: 'dark',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            sms: false,
            dashboard: true,
            highRiskAlerts: true
          }
        },
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const token = 'auth-token-' + Date.now();
      
      // Armazenar token
      localStorage.setItem('auth-token', token);
      document.cookie = `auth-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;

      setUser(mockUser);

      return {
        success: true,
        user: mockUser,
        token,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-token');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signup,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;