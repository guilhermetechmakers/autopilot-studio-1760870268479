import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api/auth";

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'expired' | 'error';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Verify token on mount if present
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus('verifying');
    try {
      await authApi.verifyEmail(verificationToken);
      setStatus('success');
      toast.success('Email verified successfully!');
    } catch (error) {
      setStatus('expired');
      toast.error('Verification failed. The link may have expired.');
      console.error('Email verification error:', error);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      toast.success('Verification email sent!');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      toast.error('Failed to resend verification email');
      console.error('Resend verification error:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Verifying state
  if (status === 'verifying') {
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
              <div className="mx-auto mb-4">
                <Loader2 className="h-12 w-12 text-accent-green animate-spin" />
              </div>
              <CardTitle>Verifying your email...</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
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
              <CardTitle>Email verified!</CardTitle>
              <CardDescription>Your email has been successfully verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                You can now access all features of Autopilot Studio
              </p>
              <Link to="/dashboard">
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Expired/Error state
  if (status === 'expired' || status === 'error') {
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
              <div className="mx-auto mb-4 rounded-full bg-accent-red/10 p-4 w-fit">
                <XCircle className="h-12 w-12 text-accent-red" />
              </div>
              <CardTitle>Link expired</CardTitle>
              <CardDescription>This verification link has expired or is invalid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">
                Request a new verification link to continue
              </p>

              <div className="space-y-2 text-left">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isResending}
                />
              </div>

              <Button
                onClick={handleResendVerification}
                className="w-full bg-accent-green text-background hover:bg-accent-green/90"
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Request New Link'
                )}
              </Button>

              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Pending state (default)
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
            <div className="mx-auto mb-4 rounded-full bg-accent-yellow/10 p-4 w-fit">
              <Clock className="h-12 w-12 text-accent-yellow" />
            </div>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted">
              Click the link in the email to verify your account. 
              If you don't see it, check your spam folder.
            </p>

            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isResending}
              />
            </div>

            <Button
              onClick={handleResendVerification}
              variant="outline"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>

            <Link to="/login">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
