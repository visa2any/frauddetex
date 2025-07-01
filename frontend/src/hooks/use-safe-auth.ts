'use client';

import { useAuth } from '@/contexts/auth-context';

// Hook seguro que não quebra durante SSG
export function useSafeAuth() {
  try {
    return useAuth();
  } catch (error) {
    // Fallback para SSG - retorna estado padrão
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => ({ success: false, error: 'Auth not available during SSG' }),
      logout: () => {},
      signup: async () => ({ success: false, error: 'Auth not available during SSG' }),
      updateUser: () => {}
    };
  }
}