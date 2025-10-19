import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface IntakeStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function IntakeStepIndicator({ steps, currentStep, completedSteps }: IntakeStepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    isCompleted && 'bg-accent-green text-background',
                    isCurrent && !isCompleted && 'bg-accent-blue text-background ring-4 ring-accent-blue/20',
                    !isCurrent && !isCompleted && 'bg-card text-muted border-2 border-border'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isCurrent ? 'text-foreground' : 'text-muted'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted mt-1 hidden md:block max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 mb-8">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isCompleted ? 'bg-accent-green' : 'bg-border'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
