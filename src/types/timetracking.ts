export interface TimeEntry {
  id: string;
  user_id: string;
  task_id?: string;
  project_id?: string;
  description: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  is_billable: boolean;
  status: 'running' | 'stopped' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Timesheet {
  id: string;
  user_id: string;
  project_id?: string;
  week_start: string;
  week_end: string;
  total_hours: number;
  billable_hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  entries: TimeEntry[];
  created_at: string;
  updated_at: string;
}

export interface CreateTimeEntryInput {
  task_id?: string;
  project_id?: string;
  description: string;
  is_billable: boolean;
}

export interface UpdateTimeEntryInput {
  id: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  is_billable?: boolean;
}

export interface TimesheetApprovalInput {
  timesheet_id: string;
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

export interface TimeTrackingStats {
  total_hours_today: number;
  total_hours_week: number;
  total_hours_month: number;
  billable_hours_week: number;
  billable_hours_month: number;
  active_timer?: TimeEntry;
}

export interface TimesheetExport {
  timesheet_id: string;
  format: 'csv' | 'pdf' | 'quickbooks';
  include_details: boolean;
}
