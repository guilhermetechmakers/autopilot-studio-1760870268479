// Intake Types for AI-Assisted Intake Wizard

export interface IntakeForm {
  id: string;
  status: 'draft' | 'in_progress' | 'completed' | 'qualified' | 'disqualified';
  qualification_score?: number;
  
  // Step 1: Company Information
  company_name: string;
  company_website?: string;
  company_size?: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
  industry?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_role?: string;
  
  // Step 2: Project Goals
  project_name: string;
  project_description: string;
  project_goals: string[];
  success_metrics?: string[];
  target_audience?: string;
  
  // Step 3: Budget & Timeline
  budget_range: 'under_10k' | '10k_25k' | '25k_50k' | '50k_100k' | '100k_plus' | 'flexible';
  budget_notes?: string;
  timeline: 'urgent' | '1_3_months' | '3_6_months' | '6_12_months' | 'flexible';
  timeline_notes?: string;
  start_date?: string;
  deadline?: string;
  
  // Step 4: Technical Details
  tech_stack_preferences?: string[];
  existing_systems?: string[];
  integration_requirements?: string[];
  technical_constraints?: string;
  
  // Step 5: Stakeholders & Files
  stakeholders?: Stakeholder[];
  files?: IntakeFile[];
  additional_notes?: string;
  
  // AI Assistance
  ai_suggestions?: AISuggestion[];
  ai_questions?: AIQuestion[];
  ai_summary?: string;
  
  // Metadata
  created_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  auto_saved_at?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email?: string;
  decision_maker: boolean;
}

export interface IntakeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploaded_at: string;
}

export interface AISuggestion {
  id: string;
  field: string;
  suggestion: string;
  reasoning?: string;
  confidence: number;
  applied: boolean;
  created_at: string;
}

export interface AIQuestion {
  id: string;
  question: string;
  field?: string;
  answered: boolean;
  answer?: string;
  created_at: string;
}

export interface QualificationResult {
  score: number;
  status: 'qualified' | 'disqualified' | 'needs_review';
  factors: QualificationFactor[];
  recommendation: string;
  next_steps: string[];
}

export interface QualificationFactor {
  name: string;
  score: number;
  weight: number;
  reasoning: string;
}

export interface CreateIntakeInput {
  contact_name: string;
  contact_email: string;
  company_name?: string;
}

export interface UpdateIntakeInput {
  id: string;
  data: Partial<IntakeForm>;
}

export interface IntakeAIRequest {
  intake_id: string;
  context: Partial<IntakeForm>;
  action: 'suggest' | 'clarify' | 'summarize' | 'qualify';
  field?: string;
}

export interface IntakeAIResponse {
  suggestions?: AISuggestion[];
  questions?: AIQuestion[];
  summary?: string;
  qualification?: QualificationResult;
}

export interface GenerateProposalFromIntakeInput {
  intake_id: string;
  template_id?: string;
  auto_send?: boolean;
}

export interface ScheduleDiscoveryInput {
  intake_id: string;
  preferred_dates: string[];
  preferred_times: string[];
  duration_minutes: number;
  notes?: string;
}
