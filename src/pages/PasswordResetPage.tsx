import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Sparkles, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
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
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

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
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Password reset request error:', error);
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
              <Link to="/login">
                <Button variant="ghost" className="w-full">
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
            <CardContent>
              <Link to="/login">
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90">
                  Sign In
                </Button>
              </Link>
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
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-background"
                    {...confirmForm.register('password')}
                    disabled={isSubmitting}
                  />
                  {confirmForm.formState.errors.password && (
                    <p className="text-xs text-accent-red">
                      {confirmForm.formState.errors.password.message}
                    </p>
                  )}
                  <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="bg-background"
                    {...confirmForm.register('confirmPassword')}
                    disabled={isSubmitting}
                  />
                  {confirmForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-accent-red">
                      {confirmForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-green text-background hover:bg-accent-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background"
                  {...requestForm.register('email')}
                  disabled={isSubmitting}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-xs text-accent-red">
                    {requestForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent-green text-background hover:bg-accent-green/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Link to="/login">
                <Button variant="ghost" className="w-full">
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
