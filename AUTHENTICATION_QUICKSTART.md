# Authentication Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide shows you how to use the authentication system in your components.

## Basic Usage

### 1. Sign In a User

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginButton() {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true
      });
      // User is now signed in and redirected to dashboard
    } catch (error) {
      // Error is automatically shown via toast
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Sign In</button>;
}
```

### 2. Sign Up a New User

```tsx
import { useAuth } from '@/contexts/AuthContext';

function SignupButton() {
  const { signUp } = useAuth();

  const handleSignup = async () => {
    try {
      await signUp({
        email: 'newuser@example.com',
        password: 'Password123!',
        full_name: 'John Doe'
      });
      // User is created and redirected to email verification
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}
```

### 3. Sign Out

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useAuth();

  return <button onClick={signOut}>Sign Out</button>;
}
```

### 4. Check Authentication Status

```tsx
import { useAuth } from '@/contexts/AuthContext';

function UserGreeting() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome, {user?.full_name}!</div>;
}
```

### 5. Check User Role

```tsx
import { useAuthUser } from '@/hooks/useAuthUser';

function AdminPanel() {
  const { isAdmin, isManager } = useAuthUser();

  if (!isAdmin && !isManager) {
    return <div>Access denied</div>;
  }

  return <div>Admin/Manager content</div>;
}
```

## OAuth SSO

### Sign In with Google/GitHub/Microsoft

```tsx
import { useAuth } from '@/contexts/AuthContext';

function SSOButtons() {
  const { signInWithGoogle, signInWithGithub, signInWithMicrosoft } = useAuth();

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithGithub}>Sign in with GitHub</button>
      <button onClick={signInWithMicrosoft}>Sign in with Microsoft</button>
    </div>
  );
}
```

## Protected Routes

### Protect a Route

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';

// In your router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Admin-Only Route

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## Form Validation

### Using Zod Schema

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib/validations/auth';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data) => {
    // data is validated and type-safe
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

## Password Strength Indicator

```tsx
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

function PasswordInput() {
  const [password, setPassword] = useState('');

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrengthIndicator password={password} />
    </div>
  );
}
```

## Two-Factor Authentication

### 2FA Settings Component

```tsx
import { TwoFactorSettings } from '@/components/auth/TwoFactorSettings';

function SecuritySettings() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <TwoFactorSettings
      isEnabled={is2FAEnabled}
      onStatusChange={setIs2FAEnabled}
    />
  );
}
```

## API Calls (Direct)

If you need to call auth APIs directly:

```tsx
import { authApi } from '@/api/auth';

// Request password reset
await authApi.requestPasswordReset('user@example.com');

// Verify email
await authApi.verifyEmail(token);

// Resend verification
await authApi.resendVerification('user@example.com');

// Generate 2FA
const { secret, qrCode } = await authApi.generateTOTP();

// Enable 2FA
const { backupCodes } = await authApi.enableTOTP(verificationCode);
```

## Common Patterns

### Conditional Rendering Based on Auth

```tsx
import { useAuth } from '@/contexts/AuthContext';

function NavBar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.full_name}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

### Role-Based Component Rendering

```tsx
import { useAuthUser } from '@/hooks/useAuthUser';

function FeatureList() {
  const { isAdmin, isManager, isDeveloper } = useAuthUser();

  return (
    <div>
      {/* Everyone sees this */}
      <Feature name="Dashboard" />
      
      {/* Only managers and admins */}
      {(isManager || isAdmin) && <Feature name="Reports" />}
      
      {/* Only admins */}
      {isAdmin && <Feature name="User Management" />}
      
      {/* Only developers */}
      {isDeveloper && <Feature name="API Keys" />}
    </div>
  );
}
```

### Loading State

```tsx
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green" />
      </div>
    );
  }

  return <YourApp />;
}
```

## Error Handling

Errors are automatically handled by the auth context and shown via toast notifications. You can also handle them manually:

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function CustomErrorHandling() {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(credentials);
    } catch (error) {
      // Custom error handling
      if (error.message.includes('invalid')) {
        toast.error('Invalid credentials. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };
}
```

## TypeScript Types

All authentication types are available:

```tsx
import type {
  AuthResponse,
  SignInInput,
  SignUpInput,
  AuthState,
  AuthContextType
} from '@/types/auth';

import type { User } from '@/types/user';
```

## Environment Setup

Add to your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Testing

### Mock Authentication in Tests

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

// Wrap your component in AuthProvider for tests
const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

// Use in tests
render(<YourComponent />, { wrapper });
```

## Best Practices

1. **Always use the auth context** - Don't store auth state locally
2. **Handle loading states** - Check `isLoading` before rendering
3. **Use protected routes** - Don't manually check auth in components
4. **Use type-safe forms** - Always use Zod validation
5. **Handle errors gracefully** - Provide user feedback
6. **Check roles properly** - Use `useAuthUser` hook for role checks
7. **Don't expose tokens** - Let the context handle token management
8. **Use SSO when possible** - Better UX and security

## Common Issues

### Issue: User not authenticated after login
**Solution**: Check that tokens are being stored correctly and the API is returning the expected response.

### Issue: Protected route not working
**Solution**: Ensure the route is wrapped in `<ProtectedRoute>` and `<AuthProvider>` is at the root.

### Issue: Form validation not working
**Solution**: Make sure you're using `zodResolver` with the correct schema.

### Issue: OAuth redirect not working
**Solution**: Verify OAuth callback URLs are configured correctly in the provider settings.

## Need Help?

- 📚 Read the full documentation: `docs/AUTHENTICATION.md`
- 🔍 Check the implementation guide: `AUTHENTICATION_IMPLEMENTATION.md`
- ✅ Review the completion report: `AUTHENTICATION_COMPLETE.md`

## Quick Reference

```tsx
// Auth Context
const { signIn, signUp, signOut, user, isAuthenticated, isLoading } = useAuth();

// User Hook
const { user, isAdmin, isManager, isDeveloper, isClient } = useAuthUser();

// API Service
import { authApi } from '@/api/auth';

// Validation Schemas
import { signInSchema, signUpSchema, passwordResetRequestSchema } from '@/lib/validations/auth';

// Components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { TwoFactorSettings } from '@/components/auth/TwoFactorSettings';
```

---

**Happy Coding! 🚀**
