# Core Security Features Implementation

## Overview

This document describes the comprehensive security implementation for Autopilot Studio, including JWT session management, password hashing, two-factor authentication (2FA), rate limiting, session management, and anomaly detection.

## Table of Contents

1. [JWT Service](#jwt-service)
2. [Password Service](#password-service)
3. [Two-Factor Authentication Service](#two-factor-authentication-service)
4. [Rate Limiting Service](#rate-limiting-service)
5. [Session Management Service](#session-management-service)
6. [Security Service](#security-service)
7. [API Integration](#api-integration)
8. [Usage Examples](#usage-examples)
9. [Security Best Practices](#security-best-practices)

---

## JWT Service

### Location
`src/services/jwtService.ts`

### Features

#### Token Management
- **Decode JWT tokens** - Client-side token inspection (payload only)
- **Expiration checking** - Verify if tokens are expired
- **Automatic refresh detection** - Identify when tokens need refreshing
- **Metadata extraction** - Extract user ID, role, and other claims

#### Token Storage
- **Secure storage** - Support for both localStorage and httpOnly cookies
- **Token pair management** - Handle access and refresh tokens
- **Automatic cleanup** - Clear tokens on logout

### Key Methods

```typescript
// Decode token
const payload = JWTService.decode(token);

// Check if expired
const isExpired = JWTService.isExpired(token);

// Check if needs refresh (< 5 minutes remaining)
const needsRefresh = JWTService.needsRefresh(token);

// Get token metadata
const metadata = JWTService.getMetadata(token);

// Token storage
TokenStorageService.setTokens(accessToken, refreshToken);
TokenStorageService.clearTokens();
```

### Configuration

```typescript
// Switch to httpOnly cookies in production
private static readonly USE_COOKIES = false; // Set to true with backend support
```

---

## Password Service

### Location
`src/services/passwordService.ts`

### Features

#### Password Validation
- **Minimum length** - 8 characters required
- **Complexity requirements** - Uppercase, lowercase, numbers, special characters
- **Common password detection** - Reject commonly used passwords
- **Pattern detection** - Identify sequential or repeated characters

#### Password Strength Calculation
- **5-level scoring** - Very Weak, Weak, Fair, Strong, Very Strong
- **Real-time feedback** - Suggestions for improvement
- **Visual indicators** - Color-coded strength display

#### Security Features
- **Password generation** - Generate strong random passwords
- **Breach detection** - Check against Have I Been Pwned API
- **Client-side hashing** - SHA-256 for demonstration (server-side required)

### Key Methods

```typescript
// Validate password
const { isValid, errors } = PasswordService.validate(password);

// Calculate strength
const strength = PasswordService.calculateStrength(password);
// Returns: { score, label, feedback, color }

// Generate strong password
const password = PasswordService.generatePassword(16);

// Check if compromised
const isCompromised = await PasswordService.checkCompromised(password);
```

### Password Requirements

```typescript
MIN_LENGTH = 8
MAX_LENGTH = 128
REQUIRE_UPPERCASE = true
REQUIRE_LOWERCASE = true
REQUIRE_NUMBER = true
REQUIRE_SPECIAL = true
SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
```

---

## Two-Factor Authentication Service

### Location
`src/services/twoFactorService.ts`

### Features

#### TOTP Management
- **Secret generation** - Create Base32 secrets
- **QR code generation** - Generate otpauth:// URLs
- **Token validation** - Verify 6-digit codes
- **Time-based windows** - 30-second TOTP windows

#### Backup Codes
- **Code generation** - Create 10 backup codes
- **Format validation** - XXXX-XXXX format
- **Downloadable recovery** - Export codes as text file

#### User Experience
- **Setup instructions** - Step-by-step guide
- **App recommendations** - List of supported authenticator apps
- **Time remaining indicator** - Show TOTP window progress

### Key Methods

```typescript
// Generate TOTP secret
const secret = TwoFactorService.generateSecret();

// Generate QR code URL
const qrUrl = TwoFactorService.generateQRCodeURL(secret, email);

// Validate token format
const isValid = TwoFactorService.validateTokenFormat(token);

// Generate backup codes
const codes = TwoFactorService.generateBackupCodes(10);

// Download backup codes
TwoFactorService.downloadBackupCodes(codes);

// Get remaining time in TOTP window
const remaining = TwoFactorService.getRemainingTime();
```

### TOTP Configuration

```typescript
TOTP_WINDOW = 30 seconds
TOTP_DIGITS = 6
TOTP_ALGORITHM = 'SHA1'
```

---

## Rate Limiting Service

### Location
`src/services/rateLimitService.ts`

### Features

#### Client-Side Rate Limiting
- **Configurable limits** - Set max attempts and time windows
- **Automatic blocking** - Block after limit exceeded
- **Retry-after tracking** - Calculate when to retry
- **Per-action limits** - Different limits for different actions

#### Pre-configured Limits
- **Login** - 5 attempts per 15 minutes
- **Password reset** - 3 attempts per hour
- **Email verification** - 5 attempts per hour
- **2FA** - 5 attempts per 15 minutes
- **API calls** - 60 per minute

### Key Methods

```typescript
// Check rate limit
const result = RateLimitService.check(key, config);
// Returns: { allowed, remaining, resetAt, retryAfter }

// Pre-configured checks
const loginResult = RateLimitService.checkLogin(email);
const resetResult = RateLimitService.checkPasswordReset(email);
const twoFactorResult = RateLimitService.checkTwoFactor(userId);

// Reset limit
RateLimitService.reset(key);

// Format retry message
const message = RateLimitService.formatRetryAfter(seconds);
```

### Configuration Example

```typescript
const config: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
};
```

---

## Session Management Service

### Location
`src/services/sessionService.ts`

### Features

#### Session Tracking
- **Activity monitoring** - Track user interactions
- **Idle detection** - Detect inactive sessions
- **Device fingerprinting** - Unique device identification
- **Session statistics** - Duration, activity counts

#### Session Security
- **Automatic timeout** - 30-minute idle timeout
- **Expiry warnings** - Alert 5 minutes before expiry
- **Session extension** - Allow users to extend sessions
- **Multi-device tracking** - Track sessions across devices

### Key Methods

```typescript
// Initialize session
SessionService.initialize();

// Track activity
SessionService.trackActivity('user_action', { metadata });

// Get session info
const info = SessionService.getSessionInfo();

// Check if idle
const isIdle = SessionService.isIdle();

// Get idle time
const idleSeconds = SessionService.getIdleTime();

// Extend session
await SessionService.extendSession();

// End session
SessionService.endSession();
```

### Session Events

```typescript
// Listen for session events
window.addEventListener('session:idle', handleIdle);
window.addEventListener('session:expiring', handleExpiring);
window.addEventListener('session:extend', handleExtend);
```

### Configuration

```typescript
IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes
SESSION_WARNING_TIME = 5 * 60 * 1000 // 5 minutes
```

---

## Security Service

### Location
`src/services/securityService.ts`

### Features

#### Security Event Logging
- **Event tracking** - Log all security-relevant events
- **Severity levels** - Low, Medium, High, Critical
- **Event types** - Login, logout, failed login, suspicious activity
- **Metadata storage** - Store context with events

#### Anomaly Detection
- **Behavioral analysis** - Detect unusual patterns
- **Failed login detection** - Track failed attempts
- **New device detection** - Alert on new devices
- **Token abuse detection** - Identify token theft attempts

#### Input Validation
- **XSS prevention** - Sanitize user input
- **URL validation** - Prevent open redirects
- **Email validation** - Verify email format
- **Pattern detection** - Identify suspicious patterns

### Key Methods

```typescript
// Log security event
SecurityService.logEvent({
  type: 'login',
  severity: 'low',
  userId: user.id,
  metadata: { /* ... */ },
});

// Detect anomalies
const result = SecurityService.detectAnomalies(userId);
// Returns: { isAnomalous, score, reasons, severity }

// Sanitize input
const clean = SecurityService.sanitizeInput(userInput);

// Validate URL
const isValid = SecurityService.isValidRedirectUrl(url);

// Generate security report
const report = SecurityService.generateSecurityReport(userId);

// Get recommendations
const recommendations = SecurityService.getSecurityRecommendations(user);
```

### Security Events

```typescript
// Listen for anomalies
window.addEventListener('security:anomaly', (event) => {
  const { score, reasons, severity } = event.detail;
  // Handle anomaly
});
```

---

## API Integration

### Location
`src/lib/api.ts`

### Enhanced Features

#### Automatic Token Refresh
- **Proactive refresh** - Refresh before expiration
- **Retry on 401** - Automatically retry with new token
- **Queue management** - Handle concurrent requests during refresh

#### Rate Limiting Integration
- **Per-endpoint limits** - Track API call rates
- **Automatic throttling** - Prevent excessive requests
- **User feedback** - Show retry-after messages

#### Security Headers
- **Device tracking** - Add X-Device-ID header
- **Authorization** - Bearer token authentication
- **Content-Type** - JSON by default

### Usage

```typescript
// All API calls automatically include:
// - Token refresh logic
// - Rate limiting
// - Security event logging
// - Device tracking

const data = await api.get('/users/me');
const result = await api.post('/projects', projectData);
```

---

## Usage Examples

### Complete Authentication Flow

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { PasswordService } from '@/services/passwordService';
import { RateLimitService } from '@/services/rateLimitService';

function LoginForm() {
  const { signIn } = useAuth();
  
  const handleSubmit = async (data: SignInInput) => {
    // Check rate limit
    const rateLimit = RateLimitService.checkLogin(data.email);
    
    if (!rateLimit.allowed) {
      toast.error(`Too many attempts. Try again in ${RateLimitService.formatRetryAfter(rateLimit.retryAfter!)}`);
      return;
    }
    
    try {
      await signIn(data);
      // Success - tokens stored automatically
    } catch (error) {
      // Error handled by auth context
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Password Strength Indicator

```typescript
import { PasswordService } from '@/services/passwordService';

function PasswordInput() {
  const [password, setPassword] = useState('');
  const strength = PasswordService.calculateStrength(password);
  
  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="strength-indicator">
        <div 
          className="strength-bar"
          style={{ 
            width: `${(strength.score / 4) * 100}%`,
            backgroundColor: strength.color,
          }}
        />
        <span>{strength.label}</span>
        <ul>
          {strength.feedback.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### 2FA Setup

```typescript
import { TwoFactorService } from '@/services/twoFactorService';
import { authApi } from '@/api/auth';

function TwoFactorSetup() {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  
  const handleSetup = async () => {
    // Generate TOTP secret
    const response = await authApi.generateTOTP();
    setSecret(response.secret);
    setQrCode(response.qrCode);
  };
  
  const handleVerify = async (token: string) => {
    // Validate format
    if (!TwoFactorService.validateTokenFormat(token)) {
      toast.error('Invalid token format');
      return;
    }
    
    // Enable 2FA
    const result = await authApi.enableTOTP(token);
    
    // Download backup codes
    TwoFactorService.downloadBackupCodes(result.backupCodes);
    
    toast.success('2FA enabled successfully!');
  };
  
  return <div>{/* QR code and verification UI */}</div>;
}
```

### Session Management

```typescript
import { SessionService } from '@/services/sessionService';

function SessionMonitor() {
  const [sessionInfo, setSessionInfo] = useState(SessionService.getSessionInfo());
  
  useEffect(() => {
    // Update session info periodically
    const interval = setInterval(() => {
      setSessionInfo(SessionService.getSessionInfo());
    }, 1000);
    
    // Listen for session events
    const handleIdle = () => {
      toast.warning('Session is idle');
    };
    
    window.addEventListener('session:idle', handleIdle);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('session:idle', handleIdle);
    };
  }, []);
  
  return (
    <div>
      <p>Idle time: {SessionService.formatIdleTime(sessionInfo.idleTime)}</p>
      <p>Device: {sessionInfo.deviceInfo.deviceName}</p>
    </div>
  );
}
```

### Security Monitoring

```typescript
import { SecurityService } from '@/services/securityService';

function SecurityDashboard() {
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    const userId = 'current-user-id';
    const securityReport = SecurityService.generateSecurityReport(userId);
    setReport(securityReport);
    
    // Listen for anomalies
    const handleAnomaly = (event: CustomEvent) => {
      const { severity, reasons } = event.detail;
      
      if (severity === 'high' || severity === 'critical') {
        toast.error('Suspicious activity detected!');
      }
    };
    
    window.addEventListener('security:anomaly', handleAnomaly);
    
    return () => {
      window.removeEventListener('security:anomaly', handleAnomaly);
    };
  }, []);
  
  return (
    <div>
      <h2>Security Report</h2>
      {report && (
        <>
          <p>Total Events: {report.totalEvents}</p>
          <p>High Severity: {report.eventsBySeverity.high || 0}</p>
          <ul>
            {report.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
```

---

## Security Best Practices

### Token Management

1. **Always use HTTPS in production**
2. **Store tokens in httpOnly cookies** (server-side implementation required)
3. **Implement short access token TTL** (15 minutes recommended)
4. **Use refresh tokens for long-lived sessions**
5. **Rotate refresh tokens** on each use
6. **Revoke tokens** on logout and password change

### Password Security

1. **Never store passwords in plain text**
2. **Always hash on server-side** (bcrypt or Argon2)
3. **Use strong password requirements**
4. **Check against breach databases**
5. **Implement password history** (prevent reuse)
6. **Require password change** after suspicious activity

### 2FA Implementation

1. **Encourage 2FA for all users**
2. **Provide backup codes**
3. **Support multiple 2FA methods** (TOTP, SMS, hardware keys)
4. **Rate limit 2FA attempts**
5. **Log all 2FA events**
6. **Allow recovery process** with identity verification

### Rate Limiting

1. **Implement both client and server-side**
2. **Use different limits for different endpoints**
3. **Provide clear error messages**
4. **Log rate limit violations**
5. **Consider IP-based limiting** on server
6. **Implement exponential backoff**

### Session Management

1. **Track session activity**
2. **Implement idle timeouts**
3. **Warn before session expiry**
4. **Allow session extension**
5. **Support multi-device sessions**
6. **Provide session management UI**

### Security Monitoring

1. **Log all security events**
2. **Implement anomaly detection**
3. **Alert on suspicious activity**
4. **Provide security dashboard**
5. **Regular security audits**
6. **Incident response plan**

---

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
VITE_API_URL=https://api.autopilot-studio.com

# Security (Server-side)
JWT_SECRET=your-secret-key-here
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Email Service
EMAIL_SERVICE_API_KEY=your-email-service-key
EMAIL_FROM=noreply@autopilot-studio.com
```

---

## Testing

### Unit Tests

```typescript
// JWT Service
describe('JWTService', () => {
  it('should decode valid token', () => {
    const token = 'valid.jwt.token';
    const payload = JWTService.decode(token);
    expect(payload).toBeDefined();
  });
  
  it('should detect expired token', () => {
    const expiredToken = 'expired.jwt.token';
    expect(JWTService.isExpired(expiredToken)).toBe(true);
  });
});

// Password Service
describe('PasswordService', () => {
  it('should validate strong password', () => {
    const { isValid } = PasswordService.validate('StrongP@ss123');
    expect(isValid).toBe(true);
  });
  
  it('should reject weak password', () => {
    const { isValid } = PasswordService.validate('weak');
    expect(isValid).toBe(false);
  });
});

// Rate Limiting
describe('RateLimitService', () => {
  it('should allow requests within limit', () => {
    const result = RateLimitService.check('test', { maxAttempts: 5, windowMs: 60000 });
    expect(result.allowed).toBe(true);
  });
  
  it('should block after limit exceeded', () => {
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      RateLimitService.check('test', { maxAttempts: 5, windowMs: 60000 });
    }
    
    // 6th request should be blocked
    const result = RateLimitService.check('test', { maxAttempts: 5, windowMs: 60000 });
    expect(result.allowed).toBe(false);
  });
});
```

---

## Troubleshooting

### Common Issues

#### Token Refresh Loop
**Problem**: Infinite token refresh attempts
**Solution**: Check token expiration times and refresh logic

#### Rate Limit False Positives
**Problem**: Users blocked unnecessarily
**Solution**: Adjust rate limit thresholds and windows

#### Session Timeout Too Aggressive
**Problem**: Users logged out too quickly
**Solution**: Increase idle timeout or implement activity tracking

#### 2FA Setup Fails
**Problem**: QR code not scanning
**Solution**: Verify secret format and otpauth:// URL structure

---

## Future Enhancements

- [ ] WebAuthn / FIDO2 support
- [ ] Biometric authentication
- [ ] Magic link authentication
- [ ] Device trust scoring
- [ ] Behavioral biometrics
- [ ] Advanced anomaly detection with ML
- [ ] Security key support
- [ ] SMS 2FA option
- [ ] Push notification 2FA
- [ ] Session recording for security audits

---

## Conclusion

This comprehensive security implementation provides enterprise-grade authentication and session management for Autopilot Studio. All services are designed to work together seamlessly while maintaining security best practices.

For questions or issues, please refer to the main documentation or contact the development team.
