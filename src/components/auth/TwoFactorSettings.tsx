import { useState } from "react";
import { toast } from "sonner";
import { Shield, Loader2, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authApi } from "@/api/auth";

interface TwoFactorSettingsProps {
  isEnabled: boolean;
  onStatusChange?: (enabled: boolean) => void;
}

export function TwoFactorSettings({ isEnabled, onStatusChange }: TwoFactorSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [setupStep, setSetupStep] = useState<'generate' | 'verify' | 'complete'>('generate');
  const [totpSecret, setTotpSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.generateTOTP();
      setTotpSecret(response.secret);
      setQrCode(response.qrCode);
      setSetupStep('verify');
    } catch (error) {
      toast.error('Failed to generate 2FA setup');
      console.error('2FA generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.enableTOTP(verificationCode);
      setBackupCodes(response.backupCodes);
      setSetupStep('complete');
      toast.success('Two-factor authentication enabled!');
      onStatusChange?.(true);
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
      console.error('2FA verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.disableTOTP(disablePassword);
      toast.success('Two-factor authentication disabled');
      setIsDialogOpen(false);
      setDisablePassword('');
      onStatusChange?.(false);
    } catch (error) {
      toast.error('Failed to disable 2FA. Check your password.');
      console.error('2FA disable error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autopilot-studio-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  if (isEnabled) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent-green/10 p-2">
                <Shield className="h-5 w-5 text-accent-green" />
              </div>
              <div>
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Extra security for your account</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent-green" />
              <span className="text-sm text-accent-green font-medium">Enabled</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">
            Your account is protected with two-factor authentication. You'll need to enter a code
            from your authenticator app when signing in.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Disable Two-Factor Authentication
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Enter your password to disable 2FA for your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-background"
                  />
                </div>
                <Button
                  onClick={handleDisable2FA}
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    'Disable 2FA'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted/10 p-2">
            <Shield className="h-5 w-5 text-muted" />
          </div>
          <div>
            <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {setupStep === 'generate' && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Protect your account with two-factor authentication. You'll need to enter a code from
              your authenticator app each time you sign in.
            </p>
            <Button
              onClick={handleEnable2FA}
              className="w-full bg-accent-green text-background hover:bg-accent-green/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Enable Two-Factor Authentication'
              )}
            </Button>
          </div>
        )}

        {setupStep === 'verify' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div className="flex justify-center p-4 bg-background rounded-lg">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted">Or enter this code manually:</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-background rounded text-sm font-mono">
                    {totpSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(totpSecret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Enter the 6-digit code from your app</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                    disabled={isLoading}
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
              </div>

              <Button
                onClick={handleVerify2FA}
                className="w-full bg-accent-green text-background hover:bg-accent-green/90"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify and Enable'
                )}
              </Button>
            </div>
          </div>
        )}

        {setupStep === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 rounded-full bg-accent-green/10 p-4 w-fit">
                <CheckCircle className="h-12 w-12 text-accent-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2FA Enabled Successfully!</h3>
              <p className="text-sm text-muted">
                Save these backup codes in a safe place. You can use them to access your account if
                you lose your authenticator device.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Backup Codes</Label>
              <div className="p-4 bg-background rounded-lg space-y-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <code className="text-sm font-mono">{code}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                className="flex-1"
              >
                Download Codes
              </Button>
              <Button
                onClick={() => {
                  setSetupStep('generate');
                  setIsDialogOpen(false);
                }}
                className="flex-1 bg-accent-green text-background hover:bg-accent-green/90"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
