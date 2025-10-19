import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  Calendar,
  Clock,
  User,
  Paperclip,
  MessageSquare,
  GitCommit,
  GitPullRequest,
  CheckSquare,
  Plus,
  Send,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/types/task';

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onAISuggest: () => void;
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

export default function TaskDetailPanel({
  task,
  onClose,
  onUpdate,
  onAISuggest,
}: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      // API call would go here
      console.log('Add comment:', newComment);
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      // API call would go here
      console.log('Add subtask:', newSubtask);
      setNewSubtask('');
    }
  };

  const handleAddCriteria = () => {
    if (newCriteria.trim()) {
      const updated = [...(task.acceptance_criteria || []), newCriteria];
      onUpdate({ acceptance_criteria: updated });
      setNewCriteria('');
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    console.log('Toggle subtask:', subtaskId);
    // API call would go here
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: CheckSquare },
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: task.comments?.length },
    { id: 'activity', label: 'Activity', icon: Clock },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Input
              defaultValue={task.title}
              className="text-xl font-semibold border-0 px-0 focus-visible:ring-0"
              onBlur={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={task.status}
            onValueChange={(value) => onUpdate({ status: value as Task['status'] })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={task.priority}
            onValueChange={(value) => onUpdate({ priority: value as Task['priority'] })}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {task.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-accent-purple/10 text-accent-purple border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-accent-green text-accent-green'
                : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="outline" className="ml-1 bg-card">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                defaultValue={task.description}
                placeholder="Add a description..."
                className="min-h-[100px]"
                onBlur={(e) => onUpdate({ description: e.target.value })}
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignee
                </label>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
                  {task.assignee_id ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee_avatar} />
                        <AvatarFallback>{task.assignee_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee_name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </label>
                <Input
                  type="date"
                  defaultValue={task.due_date ? task.due_date.split('T')[0] : ''}
                  onChange={(e) => onUpdate({ due_date: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Hours
                </label>
                <Input
                  type="number"
                  defaultValue={task.estimated_hours}
                  placeholder="0"
                  onChange={(e) =>
                    onUpdate({ estimated_hours: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Actual Hours
                </label>
                <div className="p-2 rounded-lg bg-card text-sm">
                  {task.actual_hours || 0}h tracked
                </div>
              </div>
            </div>

            <Separator />

            {/* Acceptance Criteria */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Acceptance Criteria
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAISuggest}
                  className="text-accent-purple"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggest
                </Button>
              </div>

              <div className="space-y-2">
                {task.acceptance_criteria?.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-card">
                    <Checkbox className="mt-1" />
                    <span className="text-sm flex-1">{criteria}</span>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add acceptance criteria..."
                    value={newCriteria}
                    onChange={(e) => setNewCriteria(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCriteria()}
                  />
                  <Button size="icon" onClick={handleAddCriteria}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subtasks */}
            <div>
              <label className="text-sm font-medium mb-3 block">Subtasks</label>
              <div className="space-y-2">
                {task.subtasks?.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-lg bg-card">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    />
                    <span
                      className={cn(
                        'text-sm flex-1',
                        subtask.completed && 'line-through text-muted'
                      )}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  />
                  <Button size="icon" onClick={handleAddSubtask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({task.attachments.length})
                </label>
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted" />
                        <div>
                          <p className="text-sm font-medium">{attachment.file_name}</p>
                          <p className="text-xs text-muted">
                            {(attachment.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commits & PRs */}
            {((task.commits && task.commits.length > 0) ||
              (task.pull_requests && task.pull_requests.length > 0)) && (
              <div>
                <label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <GitCommit className="h-4 w-4" />
                  Development Activity
                </label>

                <div className="space-y-2">
                  {task.commits?.map((commit) => (
                    <div key={commit.id} className="p-3 rounded-lg bg-card">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{commit.message}</p>
                          <p className="text-xs text-muted mt-1">
                            {commit.author} • {format(new Date(commit.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        {commit.url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={commit.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {task.pull_requests?.map((pr) => (
                    <div key={pr.id} className="p-3 rounded-lg bg-card">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <GitPullRequest className="h-4 w-4" />
                            <span className="text-sm font-medium">#{pr.number}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                pr.status === 'merged' && 'bg-accent-purple/10 text-accent-purple',
                                pr.status === 'open' && 'bg-accent-green/10 text-accent-green',
                                pr.status === 'closed' && 'bg-accent-red/10 text-accent-red'
                              )}
                            >
                              {pr.status}
                            </Badge>
                          </div>
                          <p className="text-sm">{pr.title}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={pr.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            {task.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user_avatar} />
                  <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.user_name}</span>
                    <span className="text-xs text-muted">
                      {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-card text-sm">{comment.content}</div>
                </div>
              </div>
            ))}

            {(!task.comments || task.comments.length === 0) && (
              <div className="text-center py-8 text-muted">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No comments yet</p>
              </div>
            )}

            <div className="flex gap-2 sticky bottom-0 bg-background pt-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button size="icon" onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="text-center py-8 text-muted">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Activity log coming soon</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
