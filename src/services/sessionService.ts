/**
 * Session Management Service
 * Handles user sessions, activity tracking, and session security
 */

import { JWTService, TokenStorageService } from './jwtService';

export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress?: string;
  location?: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isCurrentSession: boolean;
}

export interface SessionActivity {
  timestamp: Date;
  action: string;
  metadata?: Record<string, unknown>;
}

export class SessionService {
  private static readonly SESSION_KEY = 'session_id';
  private static readonly DEVICE_ID_KEY = 'device_id';
  private static readonly ACTIVITY_KEY = 'session_activity';
  private static readonly IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

  private static activityTimer: number | null = null;
  private static warningTimer: number | null = null;

  /**
   * Initialize session tracking
   */
  static initialize(): void {
    this.trackActivity('session_start');
    this.startActivityTracking();
    this.checkSessionExpiry();
  }

  /**
   * Get or create device ID
   */
  static getDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  /**
   * Generate unique device ID
   */
  private static generateDeviceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  }

  /**
   * Get device information
   */
  static getDeviceInfo(): {
    deviceId: string;
    deviceName: string;
    userAgent: string;
    platform: string;
    browser: string;
  } {
    const ua = navigator.userAgent;
    const deviceId = this.getDeviceId();

    // Parse user agent for device name
    let deviceName = 'Unknown Device';
    if (/Mobile|Android|iPhone|iPad/.test(ua)) {
      deviceName = 'Mobile Device';
    } else if (/Windows/.test(ua)) {
      deviceName = 'Windows PC';
    } else if (/Mac/.test(ua)) {
      deviceName = 'Mac';
    } else if (/Linux/.test(ua)) {
      deviceName = 'Linux PC';
    }

    // Parse browser
    let browser = 'Unknown Browser';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    return {
      deviceId,
      deviceName,
      userAgent: ua,
      platform: navigator.platform,
      browser,
    };
  }

  /**
   * Track user activity
   */
  static trackActivity(action: string, metadata?: Record<string, unknown>): void {
    const activity: SessionActivity = {
      timestamp: new Date(),
      action,
      metadata,
    };

    // Store recent activities (keep last 50)
    const activities = this.getRecentActivities();
    activities.push(activity);
    
    if (activities.length > 50) {
      activities.shift();
    }

    localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(activities));

    // Reset idle timer
    this.resetIdleTimer();
  }

  /**
   * Get recent activities
   */
  static getRecentActivities(): SessionActivity[] {
    const stored = localStorage.getItem(this.ACTIVITY_KEY);
    if (!stored) return [];

    try {
      const activities = JSON.parse(stored);
      return activities.map((a: SessionActivity) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get last activity time
   */
  static getLastActivity(): Date | null {
    const activities = this.getRecentActivities();
    if (activities.length === 0) return null;

    return activities[activities.length - 1].timestamp;
  }

  /**
   * Check if session is idle
   */
  static isIdle(): boolean {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return false;

    const idleTime = Date.now() - lastActivity.getTime();
    return idleTime > this.IDLE_TIMEOUT;
  }

  /**
   * Get idle time in seconds
   */
  static getIdleTime(): number {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return 0;

    return Math.floor((Date.now() - lastActivity.getTime()) / 1000);
  }

  /**
   * Start activity tracking
   */
  private static startActivityTracking(): void {
    // Track mouse movement
    document.addEventListener('mousemove', this.handleActivity);
    document.addEventListener('keydown', this.handleActivity);
    document.addEventListener('click', this.handleActivity);
    document.addEventListener('scroll', this.handleActivity);
  }

  /**
   * Handle user activity
   */
  private static handleActivity = (() => {
    let lastTracked = 0;
    const throttleMs = 60000; // Track at most once per minute

    return () => {
      const now = Date.now();
      if (now - lastTracked > throttleMs) {
        lastTracked = now;
        SessionService.trackActivity('user_interaction');
      }
    };
  })();

  /**
   * Reset idle timer
   */
  private static resetIdleTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    this.activityTimer = setTimeout(() => {
      this.handleIdleTimeout();
    }, this.IDLE_TIMEOUT);
  }

  /**
   * Handle idle timeout
   */
  private static handleIdleTimeout(): void {
    // Emit custom event for idle timeout
    const event = new CustomEvent('session:idle', {
      detail: { idleTime: this.getIdleTime() },
    });
    window.dispatchEvent(event);
  }

  /**
   * Check session expiry
   */
  private static checkSessionExpiry(): void {
    const token = TokenStorageService.getAccessToken();
    if (!token) return;

    const timeLeft = JWTService.getTimeUntilExpiration(token);
    if (!timeLeft) return;

    // Set warning timer
    if (timeLeft > this.SESSION_WARNING_TIME / 1000) {
      const warningDelay = (timeLeft * 1000) - this.SESSION_WARNING_TIME;
      
      this.warningTimer = setTimeout(() => {
        this.handleSessionWarning();
      }, warningDelay);
    }
  }

  /**
   * Handle session expiry warning
   */
  private static handleSessionWarning(): void {
    const event = new CustomEvent('session:expiring', {
      detail: { timeLeft: this.SESSION_WARNING_TIME / 1000 },
    });
    window.dispatchEvent(event);
  }

  /**
   * Extend session
   */
  static async extendSession(): Promise<void> {
    // This would trigger a token refresh
    const event = new CustomEvent('session:extend');
    window.dispatchEvent(event);
  }

  /**
   * End session
   */
  static endSession(): void {
    // Clear activity tracking
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Remove event listeners
    document.removeEventListener('mousemove', this.handleActivity);
    document.removeEventListener('keydown', this.handleActivity);
    document.removeEventListener('click', this.handleActivity);
    document.removeEventListener('scroll', this.handleActivity);

    // Track session end
    this.trackActivity('session_end');

    // Clear session data
    localStorage.removeItem(this.ACTIVITY_KEY);
  }

  /**
   * Get session info
   */
  static getSessionInfo(): {
    deviceInfo: ReturnType<typeof SessionService.getDeviceInfo>;
    lastActivity: Date | null;
    idleTime: number;
    isIdle: boolean;
    activities: SessionActivity[];
  } {
    return {
      deviceInfo: this.getDeviceInfo(),
      lastActivity: this.getLastActivity(),
      idleTime: this.getIdleTime(),
      isIdle: this.isIdle(),
      activities: this.getRecentActivities(),
    };
  }

  /**
   * Clear session data (for logout)
   */
  static clearSessionData(): void {
    this.endSession();
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.ACTIVITY_KEY);
    // Keep device ID for analytics
  }

  /**
   * Format idle time for display
   */
  static formatIdleTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Check if session should be refreshed
   */
  static shouldRefreshSession(): boolean {
    const token = TokenStorageService.getAccessToken();
    if (!token) return false;

    return JWTService.needsRefresh(token);
  }

  /**
   * Get session statistics
   */
  static getSessionStats(): {
    totalActivities: number;
    sessionDuration: number;
    mostCommonActions: Array<{ action: string; count: number }>;
  } {
    const activities = this.getRecentActivities();
    
    // Calculate session duration
    let sessionDuration = 0;
    if (activities.length > 0) {
      const first = activities[0].timestamp.getTime();
      const last = activities[activities.length - 1].timestamp.getTime();
      sessionDuration = Math.floor((last - first) / 1000);
    }

    // Count actions
    const actionCounts = new Map<string, number>();
    activities.forEach(a => {
      actionCounts.set(a.action, (actionCounts.get(a.action) || 0) + 1);
    });

    const mostCommonActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalActivities: activities.length,
      sessionDuration,
      mostCommonActions,
    };
  }
}
