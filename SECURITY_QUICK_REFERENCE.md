# Security Features - Quick Reference Guide

## 🚀 Quick Start

### Import Services
```typescript
import { JWTService, TokenStorageService } from '@/services/jwtService';
import { PasswordService } from '@/services/passwordService';
import { TwoFactorService } from '@/services/twoFactorService';
import { RateLimitService } from '@/services/rateLimitService';
import { SessionService } from '@/services/sessionService';
import { SecurityService } from '@/services/securityService';
```

---

## 🔐 JWT & Tokens

### Check Token Status
```typescript
const token = TokenStorageService.getAccessToken();
const isExpired = JWTService.isExpired(token);
const needsRefresh = JWTService.needsRefresh(token);
```

### Get User Info from Token
```typescript
const userId = JWTService.getUserId(token);
const role = JWTService.getUserRole(token);
const metadata = JWTService.getMetadata(token);
```

### Store/Clear Tokens
```typescript
TokenStorageService.setTokens(accessToken, refreshToken);
TokenStorageService.clearTokens();
```

---

## 🔑 Passwords

### Validate Password
```typescript
const { isValid, errors } = PasswordService.validate(password);
if (!isValid) {
  errors.forEach(error => console.log(error));
}
```

### Check Strength
```typescript
const strength = PasswordService.calculateStrength(password);
// Returns: { score: 0-4, label, feedback[], color }
```

### Generate Strong Password
```typescript
const password = PasswordService.generatePassword(16);
```

### Check if Compromised
```typescript
const isCompromised = await PasswordService.checkCompromised(password);
```

---

## 🛡️ Two-Factor Authentication

### Setup 2FA
```typescript
// Generate secret
const secret = TwoFactorService.generateSecret();

// Generate QR code URL
const qrUrl = TwoFactorService.generateQRCodeURL(secret, userEmail);

// Generate backup codes
const codes = TwoFactorService.generateBackupCodes();
```

### Validate Token
```typescript
const isValidFormat = TwoFactorService.validateTokenFormat(token);
const result = TwoFactorService.validateToken(token);
```

### Download Backup Codes
```typescript
TwoFactorService.downloadBackupCodes();
```

### Get Time Remaining
```typescript
const seconds = TwoFactorService.getRemainingTime();
const progress = TwoFactorService.getWindowProgress();
```

---

## ⏱️ Rate Limiting

### Check Limits
```typescript
// Pre-configured checks
const loginResult = RateLimitService.checkLogin(email);
const resetResult = RateLimitService.checkPasswordReset(email);
const twoFactorResult = RateLimitService.checkTwoFactor(userId);

// Custom check
const result = RateLimitService.check(key, {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 30 * 60 * 1000,
});
```

### Handle Rate Limit
```typescript
if (!result.allowed) {
  const message = RateLimitService.formatRetryAfter(result.retryAfter);
  toast.error(`Too many attempts. Try again in ${message}`);
  return;
}
```

### Reset Limit
```typescript
RateLimitService.reset(key);
```

---

## 📊 Session Management

### Initialize Session
```typescript
SessionService.initialize();
```

### Track Activity
```typescript
SessionService.trackActivity('page_view', { page: '/dashboard' });
SessionService.trackActivity('button_click', { button: 'submit' });
```

### Check Session Status
```typescript
const isIdle = SessionService.isIdle();
const idleTime = SessionService.getIdleTime();
const info = SessionService.getSessionInfo();
```

### Extend Session
```typescript
await SessionService.extendSession();
```

### End Session
```typescript
SessionService.endSession();
```

### Listen to Events
```typescript
window.addEventListener('session:idle', () => {
  toast.warning('Session is idle');
});

window.addEventListener('session:expiring', (event) => {
  const timeLeft = event.detail.timeLeft;
  toast.warning(`Session expires in ${timeLeft}s`);
});
```

---

## 🔍 Security Monitoring

### Log Events
```typescript
SecurityService.logEvent({
  type: 'login',
  severity: 'low',
  userId: user.id,
  metadata: { /* custom data */ },
});
```

### Detect Anomalies
```typescript
const result = SecurityService.detectAnomalies(userId);
if (result.isAnomalous) {
  console.log('Score:', result.score);
  console.log('Reasons:', result.reasons);
  console.log('Severity:', result.severity);
}
```

### Generate Report
```typescript
const report = SecurityService.generateSecurityReport(userId);
console.log('Total events:', report.totalEvents);
console.log('High severity:', report.eventsBySeverity.high);
console.log('Recommendations:', report.recommendations);
```

### Input Validation
```typescript
const clean = SecurityService.sanitizeInput(userInput);
const isValidUrl = SecurityService.isValidRedirectUrl(url);
const isValidEmail = SecurityService.isValidEmail(email);
```

### Listen to Anomalies
```typescript
window.addEventListener('security:anomaly', (event) => {
  const { severity, reasons } = event.detail;
  if (severity === 'high' || severity === 'critical') {
    toast.error('Suspicious activity detected!');
  }
});
```

---

## 🌐 API Calls

### Automatic Features
All API calls automatically include:
- Token refresh (if needed)
- Rate limiting
- Security event logging
- Device tracking
- Retry on 401

### Usage
```typescript
import { api } from '@/lib/api';

// GET request
const data = await api.get('/users/me');

// POST request
const result = await api.post('/projects', projectData);

// PUT request
const updated = await api.put('/users/123', userData);

// DELETE request
await api.delete('/projects/456');
```

---

## 🎯 Common Patterns

### Login with Rate Limiting
```typescript
const handleLogin = async (email: string, password: string) => {
  // Check rate limit
  const rateLimit = RateLimitService.checkLogin(email);
  if (!rateLimit.allowed) {
    const retry = RateLimitService.formatRetryAfter(rateLimit.retryAfter);
    toast.error(`Too many attempts. Try again in ${retry}`);
    return;
  }

  try {
    await signIn({ email, password });
    SecurityService.logEvent({ type: 'login', severity: 'low' });
  } catch (error) {
    SecurityService.logEvent({ type: 'failed_login', severity: 'medium' });
    throw error;
  }
};
```

### Password Input with Strength
```typescript
const [password, setPassword] = useState('');
const strength = PasswordService.calculateStrength(password);

return (
  <div>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <div className="strength-bar">
      <div 
        style={{ 
          width: `${(strength.score / 4) * 100}%`,
          backgroundColor: strength.color 
        }}
      />
      <span>{strength.label}</span>
    </div>
    <ul>
      {strength.feedback.map(tip => <li>{tip}</li>)}
    </ul>
  </div>
);
```

### 2FA Verification
```typescript
const handle2FAVerify = async (token: string) => {
  // Check rate limit
  const rateLimit = RateLimitService.checkTwoFactor(userId);
  if (!rateLimit.allowed) {
    toast.error('Too many attempts');
    return;
  }

  // Validate format
  if (!TwoFactorService.validateTokenFormat(token)) {
    toast.error('Invalid token format');
    return;
  }

  try {
    await authApi.verifyTOTP(token);
    toast.success('2FA verified!');
  } catch (error) {
    toast.error('Invalid code');
  }
};
```

### Session Monitor Component
```typescript
function SessionMonitor() {
  const [info, setInfo] = useState(SessionService.getSessionInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(SessionService.getSessionInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Idle: {SessionService.formatIdleTime(info.idleTime)}</p>
      <p>Device: {info.deviceInfo.deviceName}</p>
    </div>
  );
}
```

---

## ⚙️ Configuration

### JWT Service
```typescript
// Switch to httpOnly cookies in production
TokenStorageService.USE_COOKIES = true;
```

### Password Service
```typescript
PasswordService.MIN_LENGTH = 8;
PasswordService.REQUIRE_UPPERCASE = true;
PasswordService.REQUIRE_LOWERCASE = true;
PasswordService.REQUIRE_NUMBER = true;
PasswordService.REQUIRE_SPECIAL = true;
```

### Rate Limiting
```typescript
RateLimitService.CONFIGS.LOGIN = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 30 * 60 * 1000,
};
```

### Session Service
```typescript
SessionService.IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
SessionService.SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes
```

---

## 🐛 Troubleshooting

### Token Refresh Loop
```typescript
// Check if token is valid
const token = TokenStorageService.getAccessToken();
if (token && JWTService.isValidStructure(token)) {
  const metadata = JWTService.getMetadata(token);
  console.log('Token expires:', metadata.expiresAt);
}
```

### Rate Limit Issues
```typescript
// Check current status
const status = RateLimitService.getStatus(key, config);
console.log('Allowed:', status.allowed);
console.log('Remaining:', status.remaining);
console.log('Reset at:', status.resetAt);

// Reset if needed
RateLimitService.reset(key);
```

### Session Not Tracking
```typescript
// Verify initialization
SessionService.initialize();

// Check activity
const activities = SessionService.getRecentActivities();
console.log('Recent activities:', activities);
```

---

## 📚 Full Documentation

For complete documentation, see:
- `docs/SECURITY_IMPLEMENTATION.md` - Comprehensive technical guide
- `SECURITY_FEATURES_COMPLETE.md` - Implementation summary
- Inline code comments in service files

---

## 🔗 Quick Links

### Service Files
- JWT: `src/services/jwtService.ts`
- Password: `src/services/passwordService.ts`
- 2FA: `src/services/twoFactorService.ts`
- Rate Limit: `src/services/rateLimitService.ts`
- Session: `src/services/sessionService.ts`
- Security: `src/services/securityService.ts`

### Integration
- API: `src/lib/api.ts`
- Auth Provider: `src/components/AuthProvider.tsx`
- Auth Context: `src/contexts/AuthContext.tsx`

---

**Last Updated:** 2025-10-19
**Version:** 1.0.0
