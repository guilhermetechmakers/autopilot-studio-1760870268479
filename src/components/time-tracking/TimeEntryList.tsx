import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, MoreVertical, Edit, Trash2, DollarSign } from 'lucide-react';
import type { TimeEntry } from '@/types/timetracking';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TimeEntryListProps {
  entries: TimeEntry[];
  onUpdate?: (entry: TimeEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function TimeEntryList({ entries, onUpdate, onDelete, className }: TimeEntryListProps) {
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editIsBillable, setEditIsBillable] = useState(true);

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setEditDescription(entry.description);
    setEditIsBillable(entry.is_billable);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;

    const updatedEntry: TimeEntry = {
      ...editingEntry,
      description: editDescription,
      is_billable: editIsBillable,
      updated_at: new Date().toISOString(),
    };

    onUpdate?.(updatedEntry);
    setIsEditDialogOpen(false);
    setEditingEntry(null);
    toast.success('Time entry updated');
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      onDelete?.(id);
      toast.success('Time entry deleted');
    }
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: TimeEntry['status']) => {
    const variants: Record<TimeEntry['status'], { className: string; label: string }> = {
      running: { className: 'bg-accent-green/10 text-accent-green', label: 'Running' },
      stopped: { className: 'bg-muted text-muted', label: 'Stopped' },
      submitted: { className: 'bg-accent-blue/10 text-accent-blue', label: 'Submitted' },
      approved: { className: 'bg-accent-green/10 text-accent-green', label: 'Approved' },
      rejected: { className: 'bg-accent-red/10 text-accent-red', label: 'Rejected' },
    };

    const variant = variants[status];
    return (
      <Badge variant="outline" className={cn('border-0', variant.className)}>
        {variant.label}
      </Badge>
    );
  };

  if (entries.length === 0) {
    return (
      <Card className={cn('bg-card', className)}>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted" />
          <h3 className="text-lg font-semibold mb-2">No time entries yet</h3>
          <p className="text-sm text-muted">Start tracking time to see your entries here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('bg-card', className)}>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Billable</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-background/50">
                    <TableCell>
                      <div className="font-medium">{entry.description}</div>
                      {entry.task_id && (
                        <div className="text-xs text-muted mt-1">Task: {entry.task_id}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      {format(new Date(entry.start_time), 'MMM d, yyyy')}
                      <div className="text-xs">
                        {format(new Date(entry.start_time), 'h:mm a')}
                        {entry.end_time && ` - ${format(new Date(entry.end_time), 'h:mm a')}`}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatDuration(entry.duration_minutes)}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>
                      {entry.is_billable ? (
                        <DollarSign className="h-4 w-4 text-accent-green" />
                      ) : (
                        <span className="text-xs text-muted">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.status === 'stopped' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(entry)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(entry.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>Update the time entry details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-billable">Billable</Label>
              <Switch
                id="edit-billable"
                checked={editIsBillable}
                onCheckedChange={setEditIsBillable}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
