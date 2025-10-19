export interface Proposal {
  id: string;
  project_id?: string;
  intake_id?: string;
  title: string;
  client_name: string;
  client_email: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  template_id: string;
  content: ProposalContent;
  pricing: PricingTable;
  milestones: ProposalMilestone[];
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  viewed_at?: string;
  signed_at?: string;
  expires_at?: string;
}

export interface ProposalContent {
  introduction: string;
  scope_of_work: string;
  deliverables: string[];
  timeline: string;
  assumptions: string;
  terms_and_conditions: string;
  custom_sections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface PricingTable {
  currency: string;
  items: PricingItem[];
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  discount?: number;
  total: number;
}

export interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ProposalMilestone {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  due_date: string;
  payment_percentage: number;
  payment_amount: number;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content_template: string;
  variables: TemplateVariable[];
  conditional_sections: ConditionalSection[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'list' | 'boolean';
  default_value?: string;
  required: boolean;
}

export interface ConditionalSection {
  id: string;
  condition: string;
  content: string;
}

export interface ProposalVersion {
  id: string;
  proposal_id: string;
  version: number;
  content: ProposalContent;
  pricing: PricingTable;
  milestones: ProposalMilestone[];
  created_by: string;
  created_at: string;
  change_summary: string;
}

export interface ESignature {
  id: string;
  proposal_id: string;
  provider: 'docusign' | 'hellosign' | 'internal';
  envelope_id?: string;
  status: 'pending' | 'sent' | 'delivered' | 'signed' | 'declined' | 'voided';
  signers: Signer[];
  document_url?: string;
  signed_document_url?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'company' | 'witness';
  status: 'pending' | 'sent' | 'delivered' | 'signed' | 'declined';
  signed_at?: string;
  ip_address?: string;
}

export interface ProposalComment {
  id: string;
  proposal_id: string;
  user_id: string;
  user_name: string;
  content: string;
  section?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalAuditLog {
  id: string;
  proposal_id: string;
  user_id: string;
  user_name: string;
  action: 'created' | 'updated' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'exported' | 'duplicated';
  details: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CreateProposalInput {
  title: string;
  client_name: string;
  client_email: string;
  template_id: string;
  project_id?: string;
  intake_id?: string;
  content: ProposalContent;
  pricing: PricingTable;
  milestones: ProposalMilestone[];
}

export interface UpdateProposalInput {
  id: string;
  title?: string;
  client_name?: string;
  client_email?: string;
  content?: Partial<ProposalContent>;
  pricing?: Partial<PricingTable>;
  milestones?: ProposalMilestone[];
  status?: Proposal['status'];
}

export interface SendProposalInput {
  proposal_id: string;
  recipient_email: string;
  message?: string;
  expires_in_days?: number;
}

export interface ExportProposalInput {
  proposal_id: string;
  format: 'pdf' | 'docx';
  include_pricing: boolean;
  include_terms: boolean;
}
