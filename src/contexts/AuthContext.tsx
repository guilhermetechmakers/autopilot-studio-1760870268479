import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import type { AuthContextType, AuthState, SignInInput, SignUpInput } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const signIn = async (credentials: SignInInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.signIn(credentials);
      
      if (response.requiresTwoFactor) {
        // Redirect to 2FA verification page
        navigate('/verify-2fa');
        toast.info('Please enter your 2FA code');
        return;
      }

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (data: SignUpInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.signUp(data);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Account created successfully!');
      toast.info('Please check your email to verify your account');
      navigate('/verify-email');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authApi.signOut();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear state anyway
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      navigate('/login');
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authApi.signInWithGoogle();
    } catch (error) {
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      await authApi.signInWithGithub();
    } catch (error) {
      toast.error('Failed to sign in with GitHub');
      throw error;
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      await authApi.signInWithMicrosoft();
    } catch (error) {
      toast.error('Failed to sign in with Microsoft');
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authApi.refreshToken();
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await signOut();
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
