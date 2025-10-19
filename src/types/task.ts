export interface Task {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  acceptance_criteria?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  tags?: string[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  subtasks?: Subtask[];
  commits?: TaskCommit[];
  pull_requests?: TaskPullRequest[];
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface TaskCommit {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  url?: string;
}

export interface TaskPullRequest {
  id: string;
  number: number;
  title: string;
  status: 'open' | 'closed' | 'merged';
  url: string;
  created_at: string;
}

export interface CreateTaskInput {
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  priority: Task['priority'];
  assignee_id?: string;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignee_id?: string;
  acceptance_criteria?: string[];
  estimated_hours?: number;
  due_date?: string;
  tags?: string[];
}

export interface TaskFilters {
  status?: Task['status'][];
  priority?: Task['priority'][];
  assignee_id?: string[];
  project_id?: string;
  search?: string;
  tags?: string[];
}
