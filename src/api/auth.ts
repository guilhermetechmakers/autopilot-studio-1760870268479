import { api } from '@/lib/api';
import type { 
  AuthResponse, 
  SignInInput, 
  SignUpInput 
} from '@/types/auth';

// Authentication API service
export const authApi = {
  // Sign in with email/password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', credentials);
    
    // Store token in localStorage (in production, use httpOnly cookies)
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.token); // Placeholder for refresh token
    }
    
    return response;
  },

  // Sign up with email/password
  signUp: async (data: SignUpInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.token);
    }
    
    return response;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await api.post('/auth/signout', {});
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get<AuthResponse>('/auth/me');
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  },

  // Password reset request
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/password-reset/request', { email });
  },

  // Password reset confirm
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/password-reset/confirm', {
      token,
      password: newPassword,
    });
  },

  // Email verification
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/verify-email/resend', { email });
  },

  // OAuth SSO - Google
  signInWithGoogle: async (): Promise<void> => {
    // Redirect to OAuth provider
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/google`;
  },

  // OAuth SSO - GitHub
  signInWithGithub: async (): Promise<void> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/github`;
  },

  // OAuth SSO - Microsoft
  signInWithMicrosoft: async (): Promise<void> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/microsoft`;
  },

  // Handle OAuth callback
  handleOAuthCallback: async (provider: string, code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/auth/${provider}/callback`, { code });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.token);
    }
    
    return response;
  },

  // 2FA - Generate TOTP secret
  generateTOTP: async (): Promise<{ secret: string; qrCode: string }> => {
    return api.post<{ secret: string; qrCode: string }>('/auth/2fa/generate', {});
  },

  // 2FA - Enable TOTP
  enableTOTP: async (token: string): Promise<{ backupCodes: string[] }> => {
    return api.post<{ backupCodes: string[] }>('/auth/2fa/enable', { token });
  },

  // 2FA - Verify TOTP
  verifyTOTP: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/2fa/verify', { token });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  // 2FA - Disable TOTP
  disableTOTP: async (password: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/2fa/disable', { password });
  },
};
