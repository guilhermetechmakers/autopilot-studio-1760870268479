import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Clock,
  MessageSquare,
  Paperclip,
  GitCommit,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskSelect: (taskId: string, selected: boolean) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  medium: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
  high: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  urgent: 'bg-accent-red/20 text-accent-red border-accent-red',
};

const statusColors = {
  backlog: 'bg-muted/10 text-muted border-muted/20',
  todo: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  in_progress: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
  review: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  done: 'bg-accent-green/10 text-accent-green border-accent-green/20',
};

const statusLabels = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export default function TaskList({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskSelect,
  onTaskEdit,
  onTaskDelete,
}: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isSelected = selectedTasks.includes(task.id);
        const isOverdue =
          task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

        return (
          <Card
            key={task.id}
            className={cn(
              'transition-all duration-200 hover:shadow-md',
              'bg-card border-border',
              isSelected && 'ring-2 ring-accent-green'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onTaskSelect(task.id, checked as boolean)}
                  className="mt-1"
                />

                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Title and badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <h3 className="font-medium leading-tight mb-2">{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusColors[task.status])}
                        >
                          {statusLabels[task.status]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', priorityColors[task.priority])}
                        >
                          {task.priority}
                        </Badge>
                        {task.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-accent-purple/10 text-accent-purple border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskEdit(task)}>
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTaskDelete(task.id)}>
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-muted line-clamp-2">{task.description}</p>
                  )}

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                    {task.assignee_id && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee_avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assignee_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee_name || 'Unassigned'}</span>
                      </div>
                    )}

                    {task.due_date && (
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          isOverdue && 'text-accent-red'
                        )}
                      >
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}

                    {task.estimated_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {task.actual_hours || 0}/{task.estimated_hours}h
                        </span>
                      </div>
                    )}

                    {task.comments && task.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{task.comments.length}</span>
                      </div>
                    )}

                    {task.attachments && task.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        <span>{task.attachments.length}</span>
                      </div>
                    )}

                    {task.commits && task.commits.length > 0 && (
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        <span>{task.commits.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p>No tasks found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
