/**
 * Security Service
 * Handles security-related operations including anomaly detection,
 * input sanitization, and security monitoring
 */

import { SessionService } from './sessionService';

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'suspicious_activity' | 'rate_limit' | 'token_refresh';
  timestamp: Date;
  userId?: string;
  deviceId: string;
  ipAddress?: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnomalyDetectionResult {
  isAnomalous: boolean;
  score: number;
  reasons: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityService {
  private static readonly EVENTS_KEY = 'security_events';
  private static readonly MAX_EVENTS = 100;

  /**
   * Log security event
   */
  static logEvent(event: Omit<SecurityEvent, 'timestamp' | 'deviceId' | 'userAgent'>): void {
    const deviceInfo = SessionService.getDeviceInfo();
    
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
      deviceId: deviceInfo.deviceId,
      userAgent: deviceInfo.userAgent,
    };

    const events = this.getEvents();
    events.push(fullEvent);

    // Keep only recent events
    if (events.length > this.MAX_EVENTS) {
      events.shift();
    }

    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));

    // Check for anomalies
    if (event.severity === 'high' || event.severity === 'critical') {
      this.checkForAnomalies();
    }
  }

  /**
   * Get security events
   */
  static getEvents(): SecurityEvent[] {
    const stored = localStorage.getItem(this.EVENTS_KEY);
    if (!stored) return [];

    try {
      const events = JSON.parse(stored);
      return events.map((e: SecurityEvent) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Clear security events
   */
  static clearEvents(): void {
    localStorage.removeItem(this.EVENTS_KEY);
  }

  /**
   * Detect anomalies in user behavior
   */
  static detectAnomalies(userId: string): AnomalyDetectionResult {
    const events = this.getEvents().filter(e => e.userId === userId);
    const reasons: string[] = [];
    let score = 0;

    // Check for multiple failed login attempts
    const recentFailedLogins = events.filter(
      e => e.type === 'failed_login' && 
      Date.now() - e.timestamp.getTime() < 60 * 60 * 1000 // Last hour
    ).length;

    if (recentFailedLogins >= 3) {
      score += 30;
      reasons.push(`${recentFailedLogins} failed login attempts in the last hour`);
    }

    // Check for login from new device
    const deviceIds = new Set(events.filter(e => e.type === 'login').map(e => e.deviceId));
    const currentDeviceId = SessionService.getDeviceId();
    
    if (!deviceIds.has(currentDeviceId) && events.length > 0) {
      score += 20;
      reasons.push('Login from new device');
    }

    // Check for unusual activity patterns
    const recentEvents = events.filter(
      e => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    if (recentEvents.length > 50) {
      score += 15;
      reasons.push('Unusually high activity');
    }

    // Check for rapid token refreshes (possible token theft)
    const recentRefreshes = events.filter(
      e => e.type === 'token_refresh' &&
      Date.now() - e.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    ).length;

    if (recentRefreshes > 3) {
      score += 40;
      reasons.push('Multiple token refresh attempts');
    }

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score >= 70) severity = 'critical';
    else if (score >= 50) severity = 'high';
    else if (score >= 30) severity = 'medium';

    return {
      isAnomalous: score >= 30,
      score,
      reasons,
      severity,
    };
  }

  /**
   * Check for anomalies and emit event if found
   */
  private static checkForAnomalies(): void {
    const events = this.getEvents();
    if (events.length === 0) return;

    // Get unique user IDs
    const userIds = new Set(events.filter(e => e.userId).map(e => e.userId!));

    userIds.forEach(userId => {
      const result = this.detectAnomalies(userId);
      
      if (result.isAnomalous) {
        const event = new CustomEvent('security:anomaly', {
          detail: result,
        });
        window.dispatchEvent(event);
      }
    });
  }

  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Validate URL to prevent open redirect
   */
  static isValidRedirectUrl(url: string): boolean {
    try {
      const parsed = new URL(url, window.location.origin);
      
      // Only allow same-origin redirects
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /**
   * Check if IP address is suspicious (placeholder)
   */
  static isSuspiciousIP(ip: string): boolean {
    // In production, this would check against a blacklist or use a service
    // For now, just validate format
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return !ipv4Regex.test(ip);
  }

  /**
   * Generate security report
   */
  static generateSecurityReport(userId?: string): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentAnomalies: AnomalyDetectionResult[];
    recommendations: string[];
  } {
    const events = userId 
      ? this.getEvents().filter(e => e.userId === userId)
      : this.getEvents();

    // Count by type
    const eventsByType: Record<string, number> = {};
    events.forEach(e => {
      eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
    });

    // Count by severity
    const eventsBySeverity: Record<string, number> = {};
    events.forEach(e => {
      eventsBySeverity[e.severity] = (eventsBySeverity[e.severity] || 0) + 1;
    });

    // Check for anomalies
    const recentAnomalies: AnomalyDetectionResult[] = [];
    if (userId) {
      const anomaly = this.detectAnomalies(userId);
      if (anomaly.isAnomalous) {
        recentAnomalies.push(anomaly);
      }
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (eventsByType.failed_login > 3) {
      recommendations.push('Consider enabling two-factor authentication');
    }
    
    if (eventsBySeverity.high > 0 || eventsBySeverity.critical > 0) {
      recommendations.push('Review recent security events');
    }
    
    if (!userId) {
      recommendations.push('Enable security monitoring for all users');
    }

    return {
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      recentAnomalies,
      recommendations,
    };
  }

  /**
   * Check password against common patterns
   */
  static hasCommonPattern(password: string): boolean {
    const patterns = [
      /^(.)\1+$/, // All same character
      /^(012|123|234|345|456|567|678|789|890)+/, // Sequential numbers
      /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i, // Sequential letters
      /^(qwerty|asdfgh|zxcvbn)+/i, // Keyboard patterns
    ];

    return patterns.some(pattern => pattern.test(password));
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if user agent is suspicious
   */
  static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }

  /**
   * Get security recommendations for user
   */
  static getSecurityRecommendations(user: {
    has2FA: boolean;
    passwordLastChanged?: Date;
    lastLogin?: Date;
  }): string[] {
    const recommendations: string[] = [];

    if (!user.has2FA) {
      recommendations.push('Enable two-factor authentication for better security');
    }

    if (user.passwordLastChanged) {
      const daysSinceChange = (Date.now() - user.passwordLastChanged.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceChange > 90) {
        recommendations.push('Consider changing your password (last changed over 90 days ago)');
      }
    }

    if (user.lastLogin) {
      const daysSinceLogin = (Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLogin > 30) {
        recommendations.push('Review your recent account activity');
      }
    }

    return recommendations;
  }
}
