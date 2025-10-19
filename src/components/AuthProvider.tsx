/**
 * Enhanced AuthProvider Component
 * Wraps the application with authentication context and session management
 */

import { ReactNode, useEffect } from 'react';
import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';
import { SessionService } from '@/services/sessionService';
import { SecurityService } from '@/services/securityService';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize session tracking
    SessionService.initialize();

    // Listen for session events
    const handleSessionIdle = () => {
      toast.warning('Your session is idle. Please interact with the page to stay logged in.');
    };

    const handleSessionExpiring = (event: CustomEvent) => {
      const timeLeft = event.detail.timeLeft;
      toast.warning(
        `Your session will expire in ${Math.floor(timeLeft / 60)} minutes. Click here to extend.`,
        {
          duration: 10000,
          action: {
            label: 'Extend',
            onClick: () => SessionService.extendSession(),
          },
        }
      );
    };

    const handleSessionExtend = async () => {
      try {
        // Trigger token refresh via auth context
        const event = new CustomEvent('auth:refresh');
        window.dispatchEvent(event);
        toast.success('Session extended successfully');
      } catch (error) {
        toast.error('Failed to extend session');
      }
    };

    const handleSecurityAnomaly = (event: CustomEvent) => {
      const { severity } = event.detail;
      
      if (severity === 'high' || severity === 'critical') {
        toast.error(
          'Suspicious activity detected on your account. Please review your security settings.',
          {
            duration: 10000,
            action: {
              label: 'Review',
              onClick: () => window.location.href = '/settings?tab=security',
            },
          }
        );
      }
    };

    // Add event listeners
    window.addEventListener('session:idle', handleSessionIdle as EventListener);
    window.addEventListener('session:expiring', handleSessionExpiring as EventListener);
    window.addEventListener('session:extend', handleSessionExtend);
    window.addEventListener('security:anomaly', handleSecurityAnomaly as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('session:idle', handleSessionIdle as EventListener);
      window.removeEventListener('session:expiring', handleSessionExpiring as EventListener);
      window.removeEventListener('session:extend', handleSessionExtend);
      window.removeEventListener('security:anomaly', handleSecurityAnomaly as EventListener);
      SessionService.endSession();
    };
  }, []);

  // Log security event on mount
  useEffect(() => {
    SecurityService.logEvent({
      type: 'login',
      severity: 'low',
    });
  }, []);

  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}
