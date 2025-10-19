import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskComment,
  Subtask,
} from '@/types/task';

// Mock data for development
const mockTasks: Task[] = [
  {
    id: '1',
    project_id: 'project1',
    milestone_id: 'milestone1',
    title: 'Implement user authentication flow',
    description: 'Build complete authentication system with JWT tokens and refresh mechanism',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 'user1',
    assignee_name: 'John Doe',
    assignee_avatar: 'https://github.com/shadcn.png',
    acceptance_criteria: [
      'User can login with email and password',
      'JWT tokens are properly generated and validated',
      'Refresh token mechanism works correctly',
    ],
    estimated_hours: 16,
    actual_hours: 8,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['authentication', 'security', 'backend'],
    comments: [
      {
        id: 'comment1',
        task_id: '1',
        user_id: 'user2',
        user_name: 'Jane Smith',
        user_avatar: 'https://github.com/shadcn.png',
        content: 'Make sure to implement rate limiting on login attempts',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    subtasks: [
      { id: 'sub1', task_id: '1', title: 'Set up JWT library', completed: true, created_at: new Date().toISOString() },
      { id: 'sub2', task_id: '1', title: 'Create login endpoint', completed: true, created_at: new Date().toISOString() },
      { id: 'sub3', task_id: '1', title: 'Implement refresh token logic', completed: false, created_at: new Date().toISOString() },
    ],
    commits: [
      {
        id: 'commit1',
        sha: 'abc123',
        message: 'feat: add JWT token generation',
        author: 'John Doe',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        url: 'https://github.com/example/repo/commit/abc123',
      },
    ],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    project_id: 'project1',
    title: 'Design dashboard UI components',
    description: 'Create reusable UI components for the dashboard',
    status: 'review',
    priority: 'medium',
    assignee_id: 'user2',
    assignee_name: 'Jane Smith',
    assignee_avatar: 'https://github.com/shadcn.png',
    estimated_hours: 12,
    actual_hours: 11,
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['ui', 'design', 'frontend'],
    attachments: [
      {
        id: 'attach1',
        task_id: '2',
        file_name: 'dashboard-mockup.fig',
        file_url: 'https://example.com/files/mockup.fig',
        file_size: 2048000,
        uploaded_by: 'user2',
        uploaded_at: new Date().toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    project_id: 'project1',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples',
    status: 'todo',
    priority: 'low',
    estimated_hours: 8,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['documentation', 'api'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    project_id: 'project1',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'backlog',
    priority: 'urgent',
    estimated_hours: 20,
    tags: ['devops', 'infrastructure'],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    project_id: 'project1',
    title: 'Implement payment integration',
    description: 'Integrate Stripe payment processing',
    status: 'done',
    priority: 'high',
    assignee_id: 'user1',
    assignee_name: 'John Doe',
    assignee_avatar: 'https://github.com/shadcn.png',
    estimated_hours: 24,
    actual_hours: 22,
    tags: ['payments', 'integration', 'backend'],
    pull_requests: [
      {
        id: 'pr1',
        number: 42,
        title: 'Add Stripe payment integration',
        status: 'merged',
        url: 'https://github.com/example/repo/pull/42',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// API functions
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...mockTasks];

  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((task) => filters.status!.includes(task.status));
    }
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((task) => filters.priority!.includes(task.priority));
    }
    if (filters.assignee_id && filters.assignee_id.length > 0) {
      filtered = filtered.filter((task) =>
        task.assignee_id ? filters.assignee_id!.includes(task.assignee_id) : false
      );
    }
    if (filters.project_id) {
      filtered = filtered.filter((task) => task.project_id === filters.project_id);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((task) =>
        task.tags?.some((tag) => filters.tags!.includes(tag))
      );
    }
  }

  return filtered;
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTasks.find((task) => task.id === id) || null;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newTask: Task = {
    id: `task-${Date.now()}`,
    ...input,
    status: 'todo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockTasks.push(newTask);
  return newTask;
};

export const updateTask = async (input: UpdateTaskInput): Promise<Task> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockTasks.findIndex((task) => task.id === input.id);
  if (index === -1) {
    throw new Error('Task not found');
  }

  mockTasks[index] = {
    ...mockTasks[index],
    ...input,
    updated_at: new Date().toISOString(),
  };

  return mockTasks[index];
};

export const deleteTask = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockTasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }

  mockTasks.splice(index, 1);
};

export const addTaskComment = async (
  taskId: string,
  content: string
): Promise<TaskComment> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const comment: TaskComment = {
    id: `comment-${Date.now()}`,
    task_id: taskId,
    user_id: 'current-user',
    user_name: 'Current User',
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const task = mockTasks.find((t) => t.id === taskId);
  if (task) {
    task.comments = [...(task.comments || []), comment];
  }

  return comment;
};

export const addSubtask = async (taskId: string, title: string): Promise<Subtask> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const subtask: Subtask = {
    id: `subtask-${Date.now()}`,
    task_id: taskId,
    title,
    completed: false,
    created_at: new Date().toISOString(),
  };

  const task = mockTasks.find((t) => t.id === taskId);
  if (task) {
    task.subtasks = [...(task.subtasks || []), subtask];
  }

  return subtask;
};

export const toggleSubtask = async (taskId: string, subtaskId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const task = mockTasks.find((t) => t.id === taskId);
  if (task && task.subtasks) {
    const subtask = task.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
    }
  }
};
