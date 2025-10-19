export interface ClientPortalProject {
  id: string;
  name: string;
  description: string;
  client_name: string;
  status: 'active' | 'launch' | 'completed' | 'on_hold';
  progress: number;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  created_at: string;
  updated_at: string;
}

export interface ClientPortalMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  type: 'document' | 'code' | 'design' | 'other';
  status: 'pending_approval' | 'approved' | 'rejected' | 'revision_requested';
  file_url?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalAction {
  deliverable_id: string;
  action: 'approve' | 'reject' | 'request_revision';
  notes?: string;
}

export interface SharedAsset {
  id: string;
  project_id: string;
  name: string;
  type: 'file' | 'loom' | 'document' | 'link';
  url: string;
  description?: string;
  size?: number;
  mime_type?: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ClientPortalInvoice {
  id: string;
  project_id: string;
  milestone_id?: string;
  invoice_number: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  payment_method?: string;
  line_items: InvoiceLineItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface MeetingMinute {
  id: string;
  project_id: string;
  title: string;
  date: string;
  attendees: string[];
  summary: string;
  action_items: ActionItem[];
  recording_url?: string;
  transcript?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ClientMessage {
  id: string;
  project_id: string;
  sender_name: string;
  sender_role: 'client' | 'team';
  message: string;
  created_at: string;
  read_at?: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  type: 'milestone' | 'status' | 'deliverable' | 'general';
  created_at: string;
}
