/**
 * Rate Limiting Service
 * Client-side rate limiting for API calls and user actions
 * Note: Server-side rate limiting is still required for security
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export class RateLimitService {
  private static storage = new Map<string, RateLimitEntry>();

  /**
   * Default rate limit configurations
   */
  static readonly CONFIGS = {
    LOGIN: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
    },
    PASSWORD_RESET: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    },
    EMAIL_VERIFICATION: {
      maxAttempts: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    },
    TWO_FACTOR: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
    },
    API_CALL: {
      maxAttempts: 60,
      windowMs: 60 * 1000, // 1 minute
    },
  };

  /**
   * Check if action is allowed under rate limit
   */
  static check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = this.storage.get(key);

    // Check if blocked
    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.blockedUntil),
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    // No previous attempts or window expired
    if (!entry || now - entry.firstAttempt > config.windowMs) {
      this.storage.set(key, {
        attempts: 1,
        firstAttempt: now,
      });

      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetAt: new Date(now + config.windowMs),
      };
    }

    // Within window
    const remaining = config.maxAttempts - entry.attempts;

    if (remaining > 0) {
      // Increment attempts
      entry.attempts++;
      this.storage.set(key, entry);

      return {
        allowed: true,
        remaining: remaining - 1,
        resetAt: new Date(entry.firstAttempt + config.windowMs),
      };
    }

    // Rate limit exceeded
    const blockedUntil = now + (config.blockDurationMs || config.windowMs);
    entry.blockedUntil = blockedUntil;
    this.storage.set(key, entry);

    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(blockedUntil),
      retryAfter: Math.ceil((blockedUntil - now) / 1000),
    };
  }

  /**
   * Record a failed attempt
   */
  static recordAttempt(key: string, config: RateLimitConfig): RateLimitResult {
    return this.check(key, config);
  }

  /**
   * Reset rate limit for a key
   */
  static reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clear all rate limits (useful for testing)
   */
  static clearAll(): void {
    this.storage.clear();
  }

  /**
   * Get current status for a key
   */
  static getStatus(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      return {
        allowed: true,
        remaining: config.maxAttempts,
        resetAt: new Date(now + config.windowMs),
      };
    }

    // Check if blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.blockedUntil),
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    // Check if window expired
    if (now - entry.firstAttempt > config.windowMs) {
      return {
        allowed: true,
        remaining: config.maxAttempts,
        resetAt: new Date(now + config.windowMs),
      };
    }

    const remaining = config.maxAttempts - entry.attempts;

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      resetAt: new Date(entry.firstAttempt + config.windowMs),
    };
  }

  /**
   * Format retry-after message
   */
  static formatRetryAfter(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  /**
   * Check login rate limit
   */
  static checkLogin(identifier: string): RateLimitResult {
    return this.check(`login:${identifier}`, this.CONFIGS.LOGIN);
  }

  /**
   * Check password reset rate limit
   */
  static checkPasswordReset(email: string): RateLimitResult {
    return this.check(`password-reset:${email}`, this.CONFIGS.PASSWORD_RESET);
  }

  /**
   * Check email verification rate limit
   */
  static checkEmailVerification(email: string): RateLimitResult {
    return this.check(`email-verify:${email}`, this.CONFIGS.EMAIL_VERIFICATION);
  }

  /**
   * Check 2FA rate limit
   */
  static checkTwoFactor(userId: string): RateLimitResult {
    return this.check(`2fa:${userId}`, this.CONFIGS.TWO_FACTOR);
  }

  /**
   * Check API call rate limit
   */
  static checkApiCall(endpoint: string): RateLimitResult {
    return this.check(`api:${endpoint}`, this.CONFIGS.API_CALL);
  }

  /**
   * Clean up expired entries (call periodically)
   */
  static cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.storage.forEach((entry, key) => {
      // Remove if window expired and not blocked
      if (!entry.blockedUntil && now - entry.firstAttempt > 60 * 60 * 1000) {
        keysToDelete.push(key);
      }
      // Remove if block expired
      if (entry.blockedUntil && entry.blockedUntil < now) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.storage.delete(key));
  }
}

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    RateLimitService.cleanup();
  }, 5 * 60 * 1000);
}
