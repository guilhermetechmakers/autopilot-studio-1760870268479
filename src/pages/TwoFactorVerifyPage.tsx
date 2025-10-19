import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Sparkles, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authApi } from "@/api/auth";
import { totpSchema, type TOTPFormData } from "@/lib/validations/auth";

export default function TwoFactorVerifyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TOTPFormData>({
    resolver: zodResolver(totpSchema),
    defaultValues: { token: '' },
  });

  const onSubmit = async (data: TOTPFormData) => {
    setIsSubmitting(true);
    try {
      await authApi.verifyTOTP(data.token);
      toast.success('2FA verification successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
      console.error('2FA verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-accent-green" />
            <span className="text-2xl font-bold">Autopilot Studio</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Two-Factor Authentication</h1>
          <p className="text-muted">Enter the 6-digit code from your authenticator app</p>
        </div>

        <Card className="bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-accent-blue/10 p-4 w-fit">
              <Shield className="h-12 w-12 text-accent-blue" />
            </div>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the verification code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  onChange={(value) => setValue('token', value)}
                  disabled={isSubmitting}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {errors.token && (
                <p className="text-xs text-accent-red text-center">{errors.token.message}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-accent-green text-background hover:bg-accent-green/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted">
                  Lost access to your authenticator?
                </p>
                <Link to="/login" className="text-sm text-accent-green hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
