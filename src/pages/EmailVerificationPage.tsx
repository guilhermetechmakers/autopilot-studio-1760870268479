import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle, XCircle, Clock } from "lucide-react";

export default function EmailVerificationPage() {
  // This would normally check URL params for verification status
  const status = 'pending' as 'pending' | 'success' | 'expired';

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
            {status === 'pending' && (
              <>
                <div className="mx-auto mb-4 rounded-full bg-accent-yellow/10 p-4 w-fit">
                  <Clock className="h-12 w-12 text-accent-yellow" />
                </div>
                <CardTitle>Verify your email</CardTitle>
                <CardDescription>
                  We've sent a verification link to your email address
                </CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="mx-auto mb-4 rounded-full bg-accent-green/10 p-4 w-fit">
                  <CheckCircle className="h-12 w-12 text-accent-green" />
                </div>
                <CardTitle>Email verified!</CardTitle>
                <CardDescription>
                  Your email has been successfully verified
                </CardDescription>
              </>
            )}
            {status === 'expired' && (
              <>
                <div className="mx-auto mb-4 rounded-full bg-accent-red/10 p-4 w-fit">
                  <XCircle className="h-12 w-12 text-accent-red" />
                </div>
                <CardTitle>Link expired</CardTitle>
                <CardDescription>
                  This verification link has expired
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'pending' && (
              <>
                <p className="text-sm text-muted">
                  Click the link in the email to verify your account. 
                  If you don't see it, check your spam folder.
                </p>
                <Button variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
              </>
            )}
            {status === 'success' && (
              <Link to="/dashboard">
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90">
                  Go to Dashboard
                </Button>
              </Link>
            )}
            {status === 'expired' && (
              <>
                <p className="text-sm text-muted">
                  Request a new verification link to continue
                </p>
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90">
                  Request New Link
                </Button>
              </>
            )}
            
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
