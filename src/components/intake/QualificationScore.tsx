import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, FileText, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QualificationResult } from '@/types/intake';

interface QualificationScoreProps {
  result: QualificationResult;
  onGenerateProposal: () => void;
  onScheduleDiscovery: () => void;
  isGeneratingProposal?: boolean;
  isSchedulingDiscovery?: boolean;
}

export function QualificationScore({
  result,
  onGenerateProposal,
  onScheduleDiscovery,
  isGeneratingProposal,
  isSchedulingDiscovery,
}: QualificationScoreProps) {
  const getStatusColor = (status: QualificationResult['status']) => {
    switch (status) {
      case 'qualified':
        return 'text-accent-green border-accent-green';
      case 'needs_review':
        return 'text-accent-yellow border-accent-yellow';
      case 'disqualified':
        return 'text-accent-red border-accent-red';
    }
  };

  const getStatusIcon = (status: QualificationResult['status']) => {
    switch (status) {
      case 'qualified':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'needs_review':
      case 'disqualified':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-card border-border animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Qualification Results</span>
          <Badge variant="outline" className={cn('text-sm', getStatusColor(result.status))}>
            {getStatusIcon(result.status)}
            <span className="ml-2 capitalize">{result.status.replace('_', ' ')}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-2xl font-bold">{result.score}/100</span>
          </div>
          <Progress value={result.score} className="h-3" />
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <h4 className="text-sm font-medium mb-2">Recommendation</h4>
          <p className="text-sm text-secondary">{result.recommendation}</p>
        </div>

        {/* Qualification Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Qualification Factors</h4>
          {result.factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">{factor.name}</span>
                <span className="text-sm font-medium">{factor.score}/100</span>
              </div>
              <Progress value={factor.score} className="h-2" />
              <p className="text-xs text-muted">{factor.reasoning}</p>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recommended Next Steps</h4>
          <ul className="space-y-2">
            {result.next_steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-secondary">
                <ArrowRight className="h-4 w-4 mt-0.5 text-accent-green flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        {result.status === 'qualified' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              onClick={onGenerateProposal}
              disabled={isGeneratingProposal}
              className="flex-1 bg-accent-green hover:bg-accent-green/90 text-background"
            >
              {isGeneratingProposal ? (
                <>
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
            <Button
              onClick={onScheduleDiscovery}
              disabled={isSchedulingDiscovery}
              variant="outline"
              className="flex-1"
            >
              {isSchedulingDiscovery ? (
                <>
                  <div className="h-4 w-4 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Discovery
                </>
              )}
            </Button>
          </div>
        )}

        {result.status === 'needs_review' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              onClick={onScheduleDiscovery}
              disabled={isSchedulingDiscovery}
              className="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-background"
            >
              {isSchedulingDiscovery ? (
                <>
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Discovery Call
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
