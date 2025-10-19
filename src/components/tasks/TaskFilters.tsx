import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import type { Task, TaskFilters as TaskFiltersType } from '@/types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  projects?: { id: string; name: string }[];
  users?: { id: string; name: string }[];
}

const statusOptions: { value: Task['status']; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: Task['priority']; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function TaskFilters({
  filters,
  onFiltersChange,
  projects = [],
  users = [],
}: TaskFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusToggle = (status: Task['status']) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    onFiltersChange({ ...filters, status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handlePriorityToggle = (priority: Task['priority']) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  };

  const handleAssigneeToggle = (assigneeId: string) => {
    const currentAssignees = filters.assignee_id || [];
    const newAssignees = currentAssignees.includes(assigneeId)
      ? currentAssignees.filter((a) => a !== assigneeId)
      : [...currentAssignees, assigneeId];
    onFiltersChange({
      ...filters,
      assignee_id: newAssignees.length > 0 ? newAssignees : undefined,
    });
  };

  const handleProjectChange = (projectId: string) => {
    onFiltersChange({ ...filters, project_id: projectId === 'all' ? undefined : projectId });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const activeFilterCount =
    (filters.status?.length || 0) +
    (filters.priority?.length || 0) +
    (filters.assignee_id?.length || 0) +
    (filters.project_id ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => handleSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Project Filter */}
      {projects.length > 0 && (
        <Select
          value={filters.project_id || 'all'}
          onValueChange={handleProjectChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Status
            {filters.status && filters.status.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filters.status.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-3" align="start">
          <div className="space-y-2">
            <div className="font-medium text-sm mb-3">Filter by Status</div>
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status?.includes(option.value)}
                  onCheckedChange={() => handleStatusToggle(option.value)}
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Priority Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Priority
            {filters.priority && filters.priority.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filters.priority.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-3" align="start">
          <div className="space-y-2">
            <div className="font-medium text-sm mb-3">Filter by Priority</div>
            {priorityOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={filters.priority?.includes(option.value)}
                  onCheckedChange={() => handlePriorityToggle(option.value)}
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Assignee Filter */}
      {users.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Assignee
              {filters.assignee_id && filters.assignee_id.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.assignee_id.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3" align="start">
            <div className="space-y-2">
              <div className="font-medium text-sm mb-3">Filter by Assignee</div>
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`assignee-${user.id}`}
                    checked={filters.assignee_id?.includes(user.id)}
                    onCheckedChange={() => handleAssigneeToggle(user.id)}
                  />
                  <label
                    htmlFor={`assignee-${user.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
