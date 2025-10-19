import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  LayoutGrid,
  List,
  Plus,
  Sparkles,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskList from '@/components/tasks/TaskList';
import TaskDetailPanel from '@/components/tasks/TaskDetailPanel';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import AIAssistantWidget from '@/components/tasks/AIAssistantWidget';
import TaskTimerWidget from '@/components/tasks/TaskTimerWidget';
import { getTasks, createTask, updateTask, deleteTask } from '@/api/tasks';
import type { Task, TaskFilters as TaskFiltersType, CreateTaskInput } from '@/types/task';

export default function TasksPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogStatus, setCreateDialogStatus] = useState<Task['status'] | undefined>();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);

  // Mock data for filters
  const mockProjects = [
    { id: 'project1', name: 'Autopilot Studio' },
    { id: 'project2', name: 'Client Portal' },
  ];

  const mockUsers = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
  ];

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

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

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      const newTask = await createTask(input);
      setTasks([...tasks, newTask]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    }
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!selectedTask) return;

    try {
      const updated = await updateTask({ id: selectedTask.id, ...updates });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTask(updated);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

  const handleTaskSelect = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const handleBulkAction = (action: 'delete' | 'status' | 'assignee') => {
    if (selectedTasks.length === 0) {
      toast.error('No tasks selected');
      return;
    }
    toast.info(`Bulk ${action} action for ${selectedTasks.length} tasks`);
    // Implement bulk actions here
  };

  const handleAISuggest = () => {
    if (selectedTask) {
      setShowAIAssistant(true);
    }
  };

  const handleAcceptAISuggestions = (suggestions: string[]) => {
    if (selectedTask) {
      handleUpdateTask({ acceptance_criteria: suggestions });
      setShowAIAssistant(false);
      toast.success('AI suggestions applied');
    }
  };

  const handleStopTimer = (totalSeconds: number) => {
    if (activeTimer) {
      const hours = totalSeconds / 3600;
      handleUpdateTask({
        actual_hours: (activeTimer.actual_hours || 0) + hours,
      });
      toast.success(`Logged ${hours.toFixed(2)} hours`);
      setActiveTimer(null);
    }
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tasks & Tickets</h1>
            <p className="text-muted">Manage tasks with AI assistance and time tracking</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="text-accent-purple"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-accent-green hover:bg-accent-green/90">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total Tasks</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-accent-blue/10 p-3">
                  <CheckSquare className="h-5 w-5 text-accent-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">In Progress</p>
                  <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
                </div>
                <div className="rounded-lg bg-accent-yellow/10 p-3">
                  <Clock className="h-5 w-5 text-accent-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Completed</p>
                  <p className="text-2xl font-bold mt-1">{stats.completed}</p>
                </div>
                <div className="rounded-lg bg-accent-green/10 p-3">
                  <CheckSquare className="h-5 w-5 text-accent-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Overdue</p>
                  <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
                </div>
                <div className="rounded-lg bg-accent-red/10 p-3">
                  <Clock className="h-5 w-5 text-accent-red" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          projects={mockProjects}
          users={mockUsers}
        />

        {/* View Toggle and Bulk Actions */}
        <div className="flex items-center justify-between">
          <Tabs value={view} onValueChange={(v) => setView(v as 'board' | 'list')}>
            <TabsList className="bg-card">
              <TabsTrigger value="board" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent-green/10 text-accent-green">
                {selectedTasks.length} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTasks([])}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={showAIAssistant || activeTimer ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto"></div>
                <p className="text-muted mt-4">Loading tasks...</p>
              </div>
            ) : view === 'board' ? (
              <TaskBoard
                tasks={filteredTasks}
                onTaskClick={setSelectedTask}
                onCreateTask={(status) => {
                  setCreateDialogStatus(status);
                  setCreateDialogOpen(true);
                }}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                selectedTasks={selectedTasks}
                onTaskClick={setSelectedTask}
                onTaskSelect={handleTaskSelect}
                onTaskEdit={setSelectedTask}
                onTaskDelete={handleDeleteTask}
              />
            )}
          </div>

          {/* Sidebar Widgets */}
          {(showAIAssistant || activeTimer) && (
            <div className="space-y-4">
              {showAIAssistant && selectedTask && (
                <AIAssistantWidget
                  taskTitle={selectedTask.title}
                  taskDescription={selectedTask.description}
                  onAcceptSuggestions={handleAcceptAISuggestions}
                  onClose={() => setShowAIAssistant(false)}
                />
              )}

              {activeTimer && (
                <TaskTimerWidget
                  taskId={activeTimer.id}
                  taskTitle={activeTimer.title}
                  existingTime={(activeTimer.actual_hours || 0) * 3600}
                  onStop={handleStopTimer}
                />
              )}
            </div>
          )}
        </div>

        {/* Task Detail Panel */}
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
            onAISuggest={handleAISuggest}
          />
        )}

        {/* Create Task Dialog */}
        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateTask={handleCreateTask}
          projects={mockProjects}
          users={mockUsers}
          defaultStatus={createDialogStatus}
        />
      </div>
    </DashboardLayout>
  );
}
