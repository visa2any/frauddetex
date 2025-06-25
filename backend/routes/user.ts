/**
 * 👤 FraudShield Revolutionary - User Management Routes
 * 
 * User profile and account management
 * Features:
 * - Profile management
 * - Settings configuration
 * - API key management
 * - Account preferences
 * - Security settings
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { AuthService } from "../middleware/auth.ts";
// Error classes
class ValidationError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

// Validation helpers
function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      throw new ValidationError(`Field '${field}' is required`);
    }
  }
}

function validateTypes(data: any, types: Record<string, string>): void {
  for (const [field, expectedType] of Object.entries(types)) {
    if (data[field] !== undefined && typeof data[field] !== expectedType) {
      throw new ValidationError(`Field '${field}' must be of type ${expectedType}`);
    }
  }
}

export const userRoutes = new Router();

let dbService: DatabaseService;
let authService: AuthService;

export function initializeUserServices(db: DatabaseService, auth: AuthService) {
  dbService = db;
  authService = auth;
}

/**
 * GET /api/v1/user/profile
 * Get current user profile
 */
userRoutes.get("/profile", async (ctx: Context) => {
  const user = ctx.user!;

  try {
    // Get additional user stats
    const stats = await dbService.getFraudStats(user.id, 30);

    ctx.response.body = {
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan,
        created_at: user.created_at,
        is_active: user.is_active
      },
      usage: {
        current: user.usage_count,
        limit: user.usage_limit,
        percentage: Math.round((user.usage_count / user.usage_limit) * 100)
      },
      stats: {
        total_transactions: stats.total_transactions || 0,
        fraud_detected: stats.fraud_detected || 0,
        fraud_rate: stats.fraud_rate || 0,
        avg_processing_time: stats.avg_processing_time || 0,
        accuracy: stats.accuracy || 0
      },
      api_key: {
        key: maskApiKey(user.api_key),
        created_at: user.created_at
      }
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve user profile", { error: error.message });
  }
});

/**
 * PUT /api/v1/user/profile
 * Update user profile
 */
userRoutes.put("/profile", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  // Validate input
  validateTypes(requestBody, {
    company_name: 'string',
    preferences: 'object'
  });

  try {
    // Update allowed fields only
    const updateData: any = {};
    
    if (requestBody.company_name && requestBody.company_name.trim()) {
      updateData.company_name = requestBody.company_name.trim();
    }

    // In production, this would update the database
    console.log(`Updating profile for user ${user.email}:`, updateData);

    ctx.response.body = {
      message: "Profile updated successfully",
      updated_fields: Object.keys(updateData),
      user: {
        id: user.id,
        email: user.email,
        company_name: updateData.company_name || user.company_name,
        plan: user.plan
      }
    };

  } catch (error) {
    throw new ValidationError("Failed to update profile", { error: error.message });
  }
});

/**
 * POST /api/v1/user/change-password
 * Change user password
 */
userRoutes.post("/change-password", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateRequired(requestBody, ['current_password', 'new_password']);
  validateTypes(requestBody, {
    current_password: 'string',
    new_password: 'string'
  });

  // Validate new password strength
  if (requestBody.new_password.length < 8) {
    throw new ValidationError("New password must be at least 8 characters long");
  }

  if (requestBody.current_password === requestBody.new_password) {
    throw new ValidationError("New password must be different from current password");
  }

  try {
    // Verify current password (simplified for demo)
    const isValidPassword = requestBody.current_password === "current_password"; // Mock verification

    if (!isValidPassword) {
      throw new ValidationError("Current password is incorrect");
    }

    // Hash new password (simplified for demo)
    const newPasswordHash = "hashed_" + requestBody.new_password;

    // In production, update password in database
    console.log(`Password changed for user ${user.email}`);

    ctx.response.body = {
      message: "Password changed successfully",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("Failed to change password", { error: error.message });
  }
});

/**
 * POST /api/v1/user/regenerate-api-key
 * Generate new API key
 */
userRoutes.post("/regenerate-api-key", async (ctx: Context) => {
  const user = ctx.user!;

  try {
    const newApiKey = generateApiKey();

    // In production, update API key in database and invalidate old one
    console.log(`API key regenerated for user ${user.email}`);

    ctx.response.body = {
      message: "API key regenerated successfully",
      new_api_key: newApiKey,
      old_api_key: maskApiKey(user.api_key),
      created_at: new Date().toISOString(),
      warning: "Save this key securely. It won't be shown again."
    };

  } catch (error) {
    throw new ValidationError("Failed to regenerate API key", { error: error.message });
  }
});

/**
 * GET /api/v1/user/settings
 * Get user settings and preferences
 */
userRoutes.get("/settings", async (ctx: Context) => {
  const user = ctx.user!;

  try {
    // In production, these would come from a user_settings table
    const settings = {
      notifications: {
        fraud_alerts: true,
        usage_warnings: true,
        billing_notifications: true,
        security_alerts: true
      },
      api: {
        webhook_url: null,
        timeout_ms: 30000,
        retry_attempts: 3
      },
      security: {
        two_factor_enabled: false,
        ip_whitelist: [],
        require_https: true
      },
      preferences: {
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        date_format: 'DD/MM/YYYY',
        dashboard_refresh_rate: 30
      }
    };

    ctx.response.body = {
      user_id: user.id,
      settings,
      last_updated: new Date().toISOString()
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve settings", { error: error.message });
  }
});

/**
 * PUT /api/v1/user/settings
 * Update user settings
 */
userRoutes.put("/settings", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateTypes(requestBody, {
    notifications: 'object',
    api: 'object',
    security: 'object',
    preferences: 'object'
  });

  try {
    // Validate webhook URL if provided
    if (requestBody.api?.webhook_url) {
      try {
        new URL(requestBody.api.webhook_url);
      } catch {
        throw new ValidationError("Invalid webhook URL format");
      }
    }

    // Validate timeout range
    if (requestBody.api?.timeout_ms) {
      if (requestBody.api.timeout_ms < 1000 || requestBody.api.timeout_ms > 60000) {
        throw new ValidationError("Timeout must be between 1000ms and 60000ms");
      }
    }

    // In production, save settings to database
    console.log(`Settings updated for user ${user.email}:`, Object.keys(requestBody));

    ctx.response.body = {
      message: "Settings updated successfully",
      updated_sections: Object.keys(requestBody),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("Failed to update settings", { error: error.message });
  }
});

/**
 * GET /api/v1/user/activity
 * Get user activity log
 */
userRoutes.get("/activity", async (ctx: Context) => {
  const user = ctx.user!;
  const url = new URL(ctx.request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  try {
    // In production, this would query actual activity logs
    const activities = [
      {
        id: "act_001",
        type: "api_call",
        description: "Fraud detection request",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        metadata: {
          endpoint: "/api/v1/fraud/detect",
          ip_address: "192.168.1.100",
          user_agent: "FraudShield-JS/1.0.0"
        }
      },
      {
        id: "act_002",
        type: "login",
        description: "User logged in",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        metadata: {
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0..."
        }
      },
      {
        id: "act_003",
        type: "settings_change",
        description: "Updated notification preferences",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        metadata: {
          changed_fields: ["notifications.fraud_alerts"]
        }
      }
    ];

    ctx.response.body = {
      activities: activities.slice(offset, offset + limit),
      pagination: {
        limit,
        offset,
        total: activities.length,
        has_more: (offset + limit) < activities.length
      }
    };

  } catch (error) {
    throw new ValidationError("Failed to retrieve activity", { error: error.message });
  }
});

/**
 * DELETE /api/v1/user/account
 * Delete user account (soft delete)
 */
userRoutes.delete("/account", async (ctx: Context) => {
  const requestBody = await ctx.request.body({ type: "json" }).value;
  const user = ctx.user!;

  validateRequired(requestBody, ['confirmation']);
  validateTypes(requestBody, { confirmation: 'string' });

  if (requestBody.confirmation !== 'DELETE MY ACCOUNT') {
    throw new ValidationError("Account deletion confirmation does not match. Please type 'DELETE MY ACCOUNT'");
  }

  try {
    // In production, this would:
    // 1. Soft delete user account
    // 2. Anonymize personal data
    // 3. Cancel subscriptions
    // 4. Send confirmation email
    // 5. Log the deletion

    console.log(`Account deletion requested for user ${user.email}`);

    ctx.response.body = {
      message: "Account deletion has been scheduled",
      deletion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      note: "Your account will be permanently deleted in 7 days. Contact support if you change your mind."
    };

  } catch (error) {
    throw new ValidationError("Failed to process account deletion", { error: error.message });
  }
});

/**
 * GET /api/v1/user/export
 * Export user data (GDPR compliance)
 */
userRoutes.get("/export", async (ctx: Context) => {
  const user = ctx.user!;

  try {
    // In production, this would compile all user data
    const exportData = {
      user_profile: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan,
        created_at: user.created_at,
        usage_count: user.usage_count,
        usage_limit: user.usage_limit
      },
      transaction_history: [], // Would include all fraud detection requests
      billing_history: [], // Would include all billing records
      activity_logs: [], // Would include all activity logs
      settings: {}, // Would include all user settings
      export_date: new Date().toISOString(),
      format: "json"
    };

    ctx.response.headers.set("Content-Disposition", `attachment; filename="fraudshield-data-${user.id}.json"`);
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = exportData;

  } catch (error) {
    throw new ValidationError("Failed to export user data", { error: error.message });
  }
});

// Helper functions

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return "****";
  return apiKey.substring(0, 6) + "****" + apiKey.substring(apiKey.length - 4);
}

function generateApiKey(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'fs_';
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  
  return result;
}