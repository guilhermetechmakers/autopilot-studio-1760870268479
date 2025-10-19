# Authentication System Documentation

## Overview

Autopilot Studio implements a comprehensive authentication system with the following features:

- **Email/Password Authentication** with secure password hashing
- **OAuth SSO** (Google, GitHub, Microsoft)
- **JWT Token Management** with access and refresh tokens
- **Email Verification** with resend capability
- **Password Reset** with secure token-based flow
- **Two-Factor Authentication (2FA)** using TOTP
- **Role-Based Access Control (RBAC)**
- **Protected Routes** with authentication guards
- **Session Management** with automatic token refresh

## Architecture

### Components

```
src/
├── api/
│   └── auth.ts                 # Authentication API service
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx         # Route guard component
│       ├── PasswordStrengthIndicator.tsx
│       └── TwoFactorSettings.tsx      # 2FA management UI
├── contexts/
│   └── AuthContext.tsx         # Global auth state management
├── hooks/
│   └── useAuthUser.ts          # Custom hook for user data
├── lib/
│   └── validations/
│       └── auth.ts             # Zod validation schemas
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── PasswordResetPage.tsx
│   ├── EmailVerificationPage.tsx
│   └── TwoFactorVerifyPage.tsx
└── types/
    └── auth.ts                 # TypeScript type definitions
```

## Features

### 1. Email/Password Authentication

**Sign Up:**
- Full name, email, and password required
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Real-time password strength indicator
- Terms acceptance required
- Automatic email verification sent

**Sign In:**
- Email and password authentication
- "Remember me" option
- Forgot password link
- Redirects to intended page after login

### 2. OAuth SSO

Supported providers:
- **Google** - OAuth 2.0
- **GitHub** - OAuth 2.0
- **Microsoft** - OAuth 2.0

Implementation:
```typescript
// Redirect to OAuth provider
await authApi.signInWithGoogle();
await authApi.signInWithGithub();
await authApi.signInWithMicrosoft();

// Handle callback
await authApi.handleOAuthCallback(provider, code);
```

### 3. JWT Token Management

**Token Storage:**
- Access tokens stored in `localStorage` (or HttpOnly cookies in production)
- Refresh tokens for automatic token renewal
- Automatic token refresh on 401 responses

**Token Flow:**
```typescript
// Sign in - receives tokens
const { token, refreshToken } = await authApi.signIn(credentials);

// Automatic refresh when expired
const newToken = await authApi.refreshToken();

// Sign out - clears all tokens
await authApi.signOut();
```

### 4. Email Verification

**Features:**
- Verification email sent on signup
- Token-based verification
- Resend capability with 60-second cooldown
- Expired token handling
- Status states: pending, verifying, success, expired

**Usage:**
```typescript
// Verify email with token
await authApi.verifyEmail(token);

// Resend verification email
await authApi.resendVerification(email);
```

### 5. Password Reset

**Two-Step Flow:**

1. **Request Reset:**
   - User enters email
   - Reset link sent to email
   - Token expires after TTL

2. **Confirm Reset:**
   - User clicks link with token
   - Enters new password
   - Password strength validation
   - Confirmation required

**Usage:**
```typescript
// Request password reset
await authApi.requestPasswordReset(email);

// Reset password with token
await authApi.resetPassword(token, newPassword);
```

### 6. Two-Factor Authentication (2FA)

**TOTP Implementation:**
- QR code generation for authenticator apps
- Manual secret entry option
- 6-digit verification codes
- Backup codes for recovery
- Enable/disable with password confirmation

**Setup Flow:**
1. Generate TOTP secret and QR code
2. Scan with authenticator app
3. Verify with 6-digit code
4. Receive backup codes
5. 2FA enabled

**Usage:**
```typescript
// Generate TOTP secret
const { secret, qrCode } = await authApi.generateTOTP();

// Enable 2FA with verification
const { backupCodes } = await authApi.enableTOTP(token);

// Verify 2FA code during login
await authApi.verifyTOTP(token);

// Disable 2FA
await authApi.disableTOTP(password);
```

### 7. Protected Routes

**Implementation:**
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

**Features:**
- Automatic redirect to login if unauthenticated
- Preserves intended destination
- Loading state during auth check
- Admin-only route protection
- Role-based access control

### 8. Role-Based Access Control (RBAC)

**User Roles:**
- `admin` - Full system access
- `manager` - Project management access
- `developer` - Development access
- `client` - Client portal access

**Usage:**
```typescript
const { user, isAdmin, isManager } = useAuthUser();

if (isAdmin) {
  // Admin-only functionality
}
```

## Usage Examples

### Basic Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { signIn, signUp, signOut, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await signIn({ email, password });
  };

  const handleSignup = async () => {
    await signUp({ email, password, full_name });
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.full_name}!</p>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  );
}
```

### Using the Auth Hook

```tsx
import { useAuthUser } from '@/hooks/useAuthUser';

function UserProfile() {
  const { user, isAdmin, isLoading } = useAuthUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.full_name}</h1>
      <p>{user?.email}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Form Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib/validations/auth';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    await signIn(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## Security Considerations

### Current Implementation (Development)

- Tokens stored in `localStorage`
- Client-side token management
- HTTPS required for production

### Production Recommendations

1. **HttpOnly Cookies:**
   - Store tokens in secure HttpOnly cookies
   - Prevents XSS attacks
   - Automatic cookie management

2. **CSRF Protection:**
   - Implement CSRF tokens
   - Validate on server-side

3. **Rate Limiting:**
   - Limit login attempts
   - Prevent brute force attacks
   - Implement exponential backoff

4. **Password Security:**
   - Use Argon2 or bcrypt for hashing
   - Minimum 8 characters
   - Complexity requirements enforced

5. **Token Security:**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh
   - Revocation support

6. **2FA Security:**
   - TOTP with 30-second window
   - Backup codes (one-time use)
   - Rate limiting on verification

7. **Session Management:**
   - Automatic logout on inactivity
   - Device tracking
   - Concurrent session limits

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Password Management
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Email Verification
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/verify-email/resend` - Resend verification email

### OAuth
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/microsoft` - Initiate Microsoft OAuth
- `POST /api/auth/{provider}/callback` - Handle OAuth callback

### Two-Factor Authentication
- `POST /api/auth/2fa/generate` - Generate TOTP secret
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/disable` - Disable 2FA

## Error Handling

All authentication functions handle errors gracefully:

```typescript
try {
  await signIn(credentials);
  // Success - handled by context
} catch (error) {
  // Error toast shown automatically
  // Error logged to console
  // User remains on login page
}
```

## Testing

### Manual Testing Checklist

- [ ] Sign up with valid credentials
- [ ] Sign up with invalid email
- [ ] Sign up with weak password
- [ ] Sign in with valid credentials
- [ ] Sign in with invalid credentials
- [ ] Request password reset
- [ ] Reset password with token
- [ ] Verify email with token
- [ ] Resend verification email
- [ ] Enable 2FA
- [ ] Sign in with 2FA
- [ ] Disable 2FA
- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] Sign in with Microsoft
- [ ] Access protected route when authenticated
- [ ] Access protected route when not authenticated
- [ ] Access admin route as non-admin
- [ ] Sign out

### Unit Testing

```typescript
// Example test structure
describe('Authentication', () => {
  it('should sign in with valid credentials', async () => {
    const result = await authApi.signIn({
      email: 'test@example.com',
      password: 'Password123!',
    });
    expect(result.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    await expect(
      authApi.signIn({
        email: 'test@example.com',
        password: 'wrong',
      })
    ).rejects.toThrow();
  });
});
```

## Troubleshooting

### Common Issues

**1. Token Expired**
- Solution: Automatic refresh handled by context
- Manual: Call `refreshAuth()` from useAuth

**2. Verification Email Not Received**
- Check spam folder
- Use resend functionality
- Verify email service configuration

**3. 2FA Code Invalid**
- Ensure time sync on device
- Check 30-second window
- Use backup codes if needed

**4. OAuth Redirect Issues**
- Verify callback URLs configured
- Check OAuth app credentials
- Ensure HTTPS in production

**5. Protected Route Access Denied**
- Check authentication status
- Verify user role
- Clear tokens and re-login

## Future Enhancements

- [ ] Biometric authentication (WebAuthn)
- [ ] Social login (Facebook, Twitter)
- [ ] Magic link authentication
- [ ] Device fingerprinting
- [ ] Session management dashboard
- [ ] Security audit logs
- [ ] Account recovery options
- [ ] Multi-device support
- [ ] Passwordless authentication
- [ ] Risk-based authentication

## Support

For issues or questions:
- Check this documentation
- Review error messages in console
- Check network requests in DevTools
- Contact support team
