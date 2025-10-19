export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  metadata?: MessageMetadata;
}

export interface SourceCitation {
  type: 'repo' | 'proposal' | 'intake' | 'document';
  title: string;
  excerpt: string;
  url?: string;
}

export interface MessageMetadata {
  action?: CopilotAction;
  status?: 'pending' | 'completed' | 'error';
  result?: unknown;
}

export type CopilotAction = 
  | 'draft_spec'
  | 'create_ticket'
  | 'summarize_meeting'
  | 'suggest_acceptance_criteria'
  | 'analyze_feedback'
  | 'generate_change_request';

export interface CopilotContext {
  projectId?: string;
  repoFiles?: RepoFile[];
  proposals?: ProposalSummary[];
  intakeData?: IntakeData;
  recentMessages?: string[];
}

export interface RepoFile {
  path: string;
  content: string;
  language: string;
  lastModified: string;
}

export interface ProposalSummary {
  id: string;
  title: string;
  scope: string;
  budget: number;
  timeline: string;
}

export interface IntakeData {
  companyName: string;
  goals: string[];
  budget: number;
  timeline: string;
  techStack: string[];
}

export interface CopilotRequest {
  message: string;
  action?: CopilotAction;
  context?: CopilotContext;
}

export interface CopilotResponse {
  message: string;
  sources?: SourceCitation[];
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  type: CopilotAction;
  label: string;
  description: string;
}

export interface StreamChunk {
  delta: string;
  done: boolean;
  sources?: SourceCitation[];
}
