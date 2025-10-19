import { calculatePasswordStrength } from '@/lib/validations/auth';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);
  const percentage = (score / 6) * 100;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" style={{ 
        '--progress-background': color 
      } as React.CSSProperties} />
      <p className="text-xs" style={{ color }}>
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}
