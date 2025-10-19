import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, MessageSquare, Paperclip, GitCommit, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask: (status: Task['status']) => void;
}

const statusColumns: { status: Task['status']; label: string; color: string }[] = [
  { status: 'backlog', label: 'Backlog', color: 'text-muted' },
  { status: 'todo', label: 'To Do', color: 'text-accent-blue' },
  { status: 'in_progress', label: 'In Progress', color: 'text-accent-yellow' },
  { status: 'review', label: 'Review', color: 'text-accent-purple' },
  { status: 'done', label: 'Done', color: 'text-accent-green' },
];

const priorityColors = {
  low: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  medium: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
  high: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  urgent: 'bg-accent-red/20 text-accent-red border-accent-red',
};

export default function TaskBoard({ tasks, onTaskClick, onCreateTask }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask && draggedTask.status !== status) {
      // Update task status - would call API here
      console.log('Update task status:', draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className={cn('font-semibold', column.color)}>{column.label}</h3>
                <Badge variant="outline" className="bg-card">
                  {columnTasks.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onCreateTask(column.status)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => onTaskClick(task)}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
                    'bg-card border-border'
                  )}
                >
                  <CardHeader className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium leading-tight">
                        {task.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', priorityColors[task.priority])}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    {task.description && (
                      <p className="text-xs text-muted line-clamp-2">{task.description}</p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-accent-purple/10 text-accent-purple border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{task.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-3">
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
                        {task.estimated_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimated_hours}h</span>
                          </div>
                        )}
                      </div>

                      {task.assignee_id && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee_avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assignee_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-muted text-sm">
                  No tasks in {column.label.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
