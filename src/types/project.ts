export interface Project {
  id: string;
  name: string;
  description: string;
  client_name: string;
  status: 'intake' | 'proposal' | 'active' | 'launch' | 'completed' | 'archived';
  budget: number;
  timeline: string;
  progress: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  client_name: string;
  budget: number;
  timeline: string;
  user_id: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  client_name?: string;
  status?: Project['status'];
  budget?: number;
  timeline?: string;
  progress?: number;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  payment_trigger: boolean;
  amount?: number;
  created_at: string;
  updated_at: string;
}
