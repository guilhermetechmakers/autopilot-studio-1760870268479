import { JWTService, TokenStorageService } from '@/services/jwtService';
import { RateLimitService } from '@/services/rateLimitService';
import { SecurityService } from '@/services/securityService';

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when token is refreshed
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Refresh access token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = TokenStorageService.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    if (data.token) {
      TokenStorageService.setAccessToken(data.token);
      
      // Log security event
      SecurityService.logEvent({
        type: 'token_refresh',
        severity: 'low',
      });
      
      return data.token;
    }

    throw new Error('No token in refresh response');
  } catch (error) {
    // Clear tokens on refresh failure
    TokenStorageService.clearTokens();
    
    // Log security event
    SecurityService.logEvent({
      type: 'failed_login',
      severity: 'medium',
      metadata: { reason: 'token_refresh_failed' },
    });
    
    // Redirect to login
    window.location.href = '/login';
    throw error;
  }
}

/**
 * Enhanced fetch wrapper with error handling, token refresh, and rate limiting
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${endpoint}`;
  
  // Check rate limit
  const rateLimitResult = RateLimitService.checkApiCall(endpoint);
  if (!rateLimitResult.allowed) {
    const retryAfter = RateLimitService.formatRetryAfter(rateLimitResult.retryAfter || 60);
    throw new Error(`Rate limit exceeded. Please try again in ${retryAfter}`);
  }

  // Get access token
  let token = TokenStorageService.getAccessToken();

  // Check if token needs refresh
  if (token && JWTService.needsRefresh(token)) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        token = await refreshAccessToken();
        onTokenRefreshed(token);
      } catch (error) {
        throw error;
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for ongoing refresh to complete
      token = await new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve);
      });
    }
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Add device ID for tracking
  const deviceId = localStorage.getItem('device_id');
  if (deviceId) {
    config.headers = {
      ...config.headers,
      'X-Device-ID': deviceId,
    };
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Try to refresh token once
      if (!isRefreshing && token) {
        isRefreshing = true;
        
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          
          // Retry original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          
          const retryResponse = await fetch(url, config);
          
          if (!retryResponse.ok) {
            throw new Error(`API Error: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        } catch (error) {
          isRefreshing = false;
          TokenStorageService.clearTokens();
          window.location.href = '/login';
          throw error;
        }
      } else {
        TokenStorageService.clearTokens();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API Error: ${response.status}`;
      
      // Log security event for suspicious errors
      if (response.status === 403 || response.status === 429) {
        SecurityService.logEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          metadata: { 
            endpoint,
            status: response.status,
            message: errorMessage,
          },
        });
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Log failed requests
    if (error instanceof Error) {
      console.error('API Request failed:', {
        endpoint,
        error: error.message,
      });
    }
    throw error;
  }
}

// API utilities
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  
  post: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T = void>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
