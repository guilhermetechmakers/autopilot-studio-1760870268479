export interface Task {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  acceptance_criteria?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  priority: Task['priority'];
  assignee_id?: string;
  due_date?: string;
}
