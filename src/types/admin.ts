// Admin Dashboard Types

export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'developer' | 'client';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  last_login?: string;
}

export interface InviteUserInput {
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'developer' | 'client';
}

export interface UpdateUserRoleInput {
  user_id: string;
  role: 'admin' | 'manager' | 'developer' | 'client';
}

export interface Template {
  id: string;
  name: string;
  type: 'proposal' | 'sow' | 'task' | 'contract';
  description: string;
  content: string;
  variables: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateTemplateInput {
  name: string;
  type: 'proposal' | 'sow' | 'task' | 'contract';
  description: string;
  content: string;
  variables?: string[];
}

export interface UpdateTemplateInput {
  id: string;
  name?: string;
  description?: string;
  content?: string;
  variables?: string[];
  is_active?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'vercel' | 'cloudflare' | 'google' | 'microsoft' | 'quickbooks' | 'stripe';
  status: 'connected' | 'disconnected' | 'error';
  connected_at?: string;
  last_sync?: string;
  config: Record<string, unknown>;
  health_status: 'healthy' | 'warning' | 'error';
  error_message?: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  integration_name: string;
  event_type: 'sync' | 'error' | 'connect' | 'disconnect';
  message: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface AnalyticsMetrics {
  total_users: number;
  active_users: number;
  total_projects: number;
  active_projects: number;
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  total_proposals: number;
  proposals_accepted: number;
  proposals_pending: number;
  acceptance_rate: number;
  average_project_value: number;
  total_time_tracked: number;
  billable_hours: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  projects: number;
}

export interface UserActivityData {
  date: string;
  active_users: number;
  new_users: number;
}

export interface IntegrationHealth {
  integration_name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime_percentage: number;
  last_error?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface AuditLogFilters {
  user_id?: string;
  action?: string;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
}
