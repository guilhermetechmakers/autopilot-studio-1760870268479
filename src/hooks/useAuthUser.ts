import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to access the authenticated user
 * Provides easy access to user data and authentication state
 */
export function useAuthUser() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isDeveloper: user?.role === 'developer',
    isClient: user?.role === 'client',
  };
}
