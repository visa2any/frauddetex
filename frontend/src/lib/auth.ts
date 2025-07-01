/**
 * 🔐 FraudDetex - Enterprise Authentication System
 * Secure user authentication and authorization
 */

import type { User, UserRole } from '../types';
import { FraudDetectionError, ErrorCode } from './error-handler';
import { Logger } from './logger';

// ============================================================================
// AUTHENTICATION CONSTANTS
// ============================================================================

const AUTH_TOKEN_KEY = 'frauddetex_auth_token';
const USER_DATA_KEY = 'frauddetex_user_data';
const TOKEN_EXPIRY_KEY = 'frauddetex_token_expiry';

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export class AuthService {
  private logger: Logger;
  private currentUser: User | null = null;

  constructor() {
    this.logger = new Logger('AuthService');
    this.loadUserFromStorage();
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      this.logger.info('User login attempt', { email });

      // Validate input
      if (!email || !password) {
        throw new FraudDetectionError(
          'Email and password are required',
          ErrorCode.MISSING_REQUIRED_FIELD
        );
      }

      // Mock authentication - replace with actual API call
      const user = await this.mockAuthenticate(email, password);
      
      // Generate token
      const token = this.generateToken(user);
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

      // Store authentication data
      this.storeAuthData(user, token, expiresAt);
      this.currentUser = user;

      this.logger.security('auth', 'User login successful', 'low', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return user;
    } catch (error) {
      this.logger.error('Login failed', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Logout current user
   */
  logout(): void {
    try {
      const userId = this.currentUser?.id;
      
      this.clearAuthData();
      this.currentUser = null;

      this.logger.security('auth', 'User logout', 'low', { userId });
    } catch (error) {
      this.logger.error('Logout failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.currentUser) {
      return false;
    }

    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime || Date.now() > parseInt(expiryTime)) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<void> {
    if (!this.currentUser) {
      throw new FraudDetectionError(
        'No user logged in',
        ErrorCode.AUTH_FAILED
      );
    }

    try {
      // Mock token refresh - replace with actual API call
      const newToken = this.generateToken(this.currentUser);
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());

      this.logger.info('Token refreshed', { userId: this.currentUser.id });
    } catch (error) {
      this.logger.error('Token refresh failed', {
        userId: this.currentUser.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new FraudDetectionError(
        'Failed to refresh token',
        ErrorCode.TOKEN_EXPIRED
      );
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Mock authentication (replace with actual API)
   */
  private async mockAuthenticate(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock user database
    const users: Record<string, { password: string; user: User }> = {
      'admin@frauddetex.com': {
        password: 'admin123',
        user: {
          id: 'user_admin_001',
          email: 'admin@frauddetex.com',
          name: 'Administrator',
          role: 'admin',
          permissions: [],
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          preferences: {
            theme: 'light',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: true,
              sms: false,
              dashboard: true,
              highRiskAlerts: true
            }
          }
        }
      },
      'analyst@frauddetex.com': {
        password: 'analyst123',
        user: {
          id: 'user_analyst_001',
          email: 'analyst@frauddetex.com',
          name: 'Fraud Analyst',
          role: 'analyst',
          permissions: [],
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
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
          }
        }
      },
      'user@frauddetex.com': {
        password: 'user123',
        user: {
          id: 'user_standard_001',
          email: 'user@frauddetex.com',
          name: 'Standard User',
          role: 'user',
          permissions: [],
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          preferences: {
            theme: 'light',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: false,
              sms: false,
              dashboard: true,
              highRiskAlerts: false
            }
          }
        }
      }
    };

    const userData = users[email.toLowerCase()];
    if (!userData || userData.password !== password) {
      throw new FraudDetectionError(
        'Invalid email or password',
        ErrorCode.AUTH_FAILED
      );
    }

    return userData.user;
  }

  /**
   * Generate authentication token
   */
  private generateToken(user: User): string {
    // In production, use proper JWT or secure token generation
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    };

    // Simple base64 encoding for demo (use proper JWT in production)
    return btoa(JSON.stringify(tokenData));
  }

  /**
   * Store authentication data
   */
  private storeAuthData(user: User, token: string, expiresAt: number): void {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    } catch (error) {
      this.logger.error('Failed to store auth data', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    try {
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      this.logger.error('Failed to clear auth data', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Load user from storage
   */
  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (userData && expiryTime && Date.now() < parseInt(expiryTime)) {
        this.currentUser = JSON.parse(userData);
        this.logger.info('User loaded from storage', {
          userId: this.currentUser?.id
        });
      } else if (userData) {
        // Token expired, clear data
        this.clearAuthData();
      }
    } catch (error) {
      this.logger.error('Failed to load user from storage', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      this.clearAuthData();
    }
  }
}

// ============================================================================
// AUTHORIZATION UTILITIES
// ============================================================================

/**
 * Check if user has permission for specific action
 */
export function hasPermission(user: User | null, action: string): boolean {
  if (!user) return false;

  const permissions: Record<UserRole, string[]> = {
    admin: ['*'], // Admin has all permissions
    analyst: [
      'fraud:view',
      'fraud:analyze',
      'reports:view',
      'reports:create',
      'transactions:view',
      'users:view'
    ],
    user: [
      'fraud:view',
      'transactions:view:own'
    ],
    viewer: [
      'fraud:view',
      'reports:view'
    ]
  };

  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes('*') || userPermissions.includes(action);
}

/**
 * Require authentication middleware
 */
export function requireAuth(): User {
  const authService = new AuthService();
  
  if (!authService.isAuthenticated()) {
    throw new FraudDetectionError(
      'Authentication required',
      ErrorCode.AUTH_FAILED
    );
  }

  const user = authService.getCurrentUser();
  if (!user) {
    throw new FraudDetectionError(
      'Invalid authentication state',
      ErrorCode.AUTH_FAILED
    );
  }

  return user;
}

/**
 * Require specific role middleware
 */
export function requireRole(role: UserRole): User {
  const user = requireAuth();
  
  if (user.role !== role && user.role !== 'admin') {
    throw new FraudDetectionError(
      'Insufficient permissions',
      ErrorCode.INSUFFICIENT_PERMISSIONS
    );
  }

  return user;
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const authService = new AuthService();
export default authService;