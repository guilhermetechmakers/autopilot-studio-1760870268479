import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Loader2, CheckCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { authApi } from "@/api/auth";
import {
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  type PasswordResetRequestFormData,
  type PasswordResetConfirmFormData,
} from "@/lib/validations/auth";

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Request form
  const requestForm = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: '' },
  });

  // Confirm form
  const confirmForm = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = confirmForm.watch('password');

  const onRequestSubmit = async (data: PasswordResetRequestFormData) => {
    setIsSubmitting(true);
    try {
      await authApi.requestPasswordReset(data.email);
      setEmailSent(true);
      setResendCooldown(60); // 60 second cooldown
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Password reset request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    const email = requestForm.getValues('email');
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authApi.requestPasswordReset(email);
      setResendCooldown(60);
      toast.success('Password reset link resent to your email');
    } catch (error) {
      toast.error('Failed to resend link. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmSubmit = async (data: PasswordResetConfirmFormData) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, data.password);
      setResetComplete(true);
      toast.success('Password reset successfully!');
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error('Failed to reset password. The link may have expired.');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state after email sent
  if (emailSent && !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-accent-green" />
              <span className="text-2xl font-bold">Autopilot Studio</span>
            </Link>
          </div>

          <Card className="bg-card text-center">
            <CardHeader>
              <div className="mx-auto mb-4 rounded-full bg-accent-green/10 p-4 w-fit">
                <CheckCircle className="h-12 w-12 text-accent-green" />
              </div>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                Click the link in the email to reset your password. 
                If you don't see it, check your spam folder.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <span>Didn't receive the email?</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-accent-green hover:text-accent-green/90"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0 || isSubmitting}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                </Button>
              </div>

              <Link to="/login">
                <Button variant="ghost" className="w-full hover:bg-card/50 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show success state after password reset
  if (resetComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-accent-green" />
              <span className="text-2xl font-bold">Autopilot Studio</span>
            </Link>
          </div>

          <Card className="bg-card text-center">
            <CardHeader>
              <div className="mx-auto mb-4 rounded-full bg-accent-green/10 p-4 w-fit">
                <CheckCircle className="h-12 w-12 text-accent-green" />
              </div>
              <CardTitle>Password reset successful!</CardTitle>
              <CardDescription>
                Your password has been reset successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                You can now sign in with your new password
              </p>
              <Link to="/login">
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90 transition-all hover:scale-[1.02]">
                  Sign In Now
                </Button>
              </Link>
              <p className="text-xs text-center text-muted">
                Redirecting automatically in 3 seconds...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show confirm form if token is present
  if (token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-accent-green" />
              <span className="text-2xl font-bold">Autopilot Studio</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Set new password</h1>
            <p className="text-muted">Enter your new password below</p>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>New Password</CardTitle>
              <CardDescription>
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-background pr-10"
                      {...confirmForm.register('password')}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmForm.formState.errors.password && (
                    <p className="text-xs text-accent-red animate-fade-in">
                      {confirmForm.formState.errors.password.message}
                    </p>
                  )}
                  <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-background pr-10"
                      {...confirmForm.register('confirmPassword')}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-accent-red animate-fade-in">
                      {confirmForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-green text-background hover:bg-accent-green/90 transition-all hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full hover:bg-card/50 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show request form by default
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-accent-green" />
            <span className="text-2xl font-bold">Autopilot Studio</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </div>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background transition-all focus:ring-2 focus:ring-accent-green/20"
                  {...requestForm.register('email')}
                  disabled={isSubmitting}
                  autoFocus
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-accent-red animate-fade-in">
                    {requestForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent-green text-background hover:bg-accent-green/90 transition-all hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <Link to="/login">
                <Button variant="ghost" className="w-full hover:bg-card/50 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
