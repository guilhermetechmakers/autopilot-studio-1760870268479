import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  ListChecks,
  Lightbulb,
  GitPullRequest,
} from 'lucide-react';
import type { CopilotAction } from '@/types/copilot';

interface ActionButtonsProps {
  onActionSelect: (action: CopilotAction) => void;
  disabled?: boolean;
}

const actions: Array<{
  type: CopilotAction;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    type: 'draft_spec',
    label: 'Draft Spec',
    icon: FileText,
    description: 'Generate technical specification',
  },
  {
    type: 'create_ticket',
    label: 'Create Ticket',
    icon: CheckSquare,
    description: 'Convert to actionable task',
  },
  {
    type: 'summarize_meeting',
    label: 'Summarize Meeting',
    icon: MessageSquare,
    description: 'Create meeting summary',
  },
  {
    type: 'suggest_acceptance_criteria',
    label: 'Acceptance Criteria',
    icon: ListChecks,
    description: 'Generate acceptance criteria',
  },
  {
    type: 'analyze_feedback',
    label: 'Analyze Feedback',
    icon: Lightbulb,
    description: 'Process client feedback',
  },
  {
    type: 'generate_change_request',
    label: 'Change Request',
    icon: GitPullRequest,
    description: 'Create change request',
  },
];

export function ActionButtons({ onActionSelect, disabled }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {actions.map((action) => (
        <Button
          key={action.type}
          variant="outline"
          className="h-auto flex-col items-start p-4 text-left hover:bg-accent-green/5 hover:border-accent-green/50 transition-all"
          onClick={() => onActionSelect(action.type)}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg bg-accent-green/10 p-2">
              <action.icon className="h-4 w-4 text-accent-green" />
            </div>
          </div>
          <span className="font-medium text-sm">{action.label}</span>
          <span className="text-xs text-muted mt-1">{action.description}</span>
        </Button>
      ))}
    </div>
  );
}
