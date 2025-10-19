/**
 * JWT Service
 * Handles JWT token operations including validation, decoding, and expiration checks
 */

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expiration
  jti?: string; // JWT ID for tracking
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  /**
   * Decode JWT token without verification (for client-side inspection only)
   */
  static decode(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded as JWTPayload;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Get token expiration time in seconds
   */
  static getExpirationTime(token: string): number | null {
    const payload = this.decode(token);
    return payload?.exp || null;
  }

  /**
   * Get time until token expires (in seconds)
   */
  static getTimeUntilExpiration(token: string): number | null {
    const exp = this.getExpirationTime(token);
    if (!exp) return null;

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, exp - now);
  }

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   */
  static needsRefresh(token: string): boolean {
    const timeLeft = this.getTimeUntilExpiration(token);
    if (timeLeft === null) return true;

    // Refresh if less than 5 minutes remaining
    return timeLeft < 300;
  }

  /**
   * Extract user ID from token
   */
  static getUserId(token: string): string | null {
    const payload = this.decode(token);
    return payload?.sub || null;
  }

  /**
   * Extract user role from token
   */
  static getUserRole(token: string): string | null {
    const payload = this.decode(token);
    return payload?.role || null;
  }

  /**
   * Validate token structure (basic client-side validation)
   */
  static isValidStructure(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      // Try to decode each part
      atob(parts[0]); // Header
      atob(parts[1]); // Payload
      // Signature is not decoded on client
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get token metadata
   */
  static getMetadata(token: string): {
    userId: string | null;
    email: string | null;
    role: string | null;
    issuedAt: Date | null;
    expiresAt: Date | null;
    isExpired: boolean;
    needsRefresh: boolean;
  } {
    const payload = this.decode(token);

    return {
      userId: payload?.sub || null,
      email: payload?.email || null,
      role: payload?.role || null,
      issuedAt: payload?.iat ? new Date(payload.iat * 1000) : null,
      expiresAt: payload?.exp ? new Date(payload.exp * 1000) : null,
      isExpired: this.isExpired(token),
      needsRefresh: this.needsRefresh(token),
    };
  }
}

/**
 * Token Storage Service
 * Handles secure token storage with support for both localStorage and httpOnly cookies
 */
export class TokenStorageService {
  private static readonly ACCESS_TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USE_COOKIES = false; // Set to true in production with backend support

  /**
   * Store access token
   */
  static setAccessToken(token: string): void {
    if (this.USE_COOKIES) {
      // In production, this would be set by the server as httpOnly cookie
      // Client-side code cannot set httpOnly cookies
      console.warn('Cookie storage should be handled by server');
    } else {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    if (this.USE_COOKIES) {
      // Cannot read httpOnly cookies from JavaScript
      // Token will be sent automatically with requests
      return null;
    }
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Store refresh token
   */
  static setRefreshToken(token: string): void {
    if (this.USE_COOKIES) {
      console.warn('Cookie storage should be handled by server');
    } else {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    if (this.USE_COOKIES) {
      return null;
    }
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Store token pair
   */
  static setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Clear all tokens
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('user');
  }

  /**
   * Check if user has valid tokens
   */
  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    return !JWTService.isExpired(accessToken);
  }
}
