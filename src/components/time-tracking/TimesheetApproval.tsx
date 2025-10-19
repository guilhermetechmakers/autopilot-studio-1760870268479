import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import type { Timesheet } from '@/types/timetracking';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import TimesheetView from './TimesheetView';

interface TimesheetApprovalProps {
  timesheets: Timesheet[];
  onApprove?: (timesheetId: string) => void;
  onReject?: (timesheetId: string, reason: string) => void;
  className?: string;
}

export default function TimesheetApproval({ timesheets, onApprove, onReject, className }: TimesheetApprovalProps) {
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingTimesheets = timesheets.filter(t => t.status === 'submitted');

  const handleView = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setIsViewDialogOpen(true);
  };

  const handleApprove = (timesheetId: string) => {
    if (confirm('Approve this timesheet?')) {
      onApprove?.(timesheetId);
      toast.success('Timesheet approved');
      setIsViewDialogOpen(false);
    }
  };

  const handleRejectClick = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedTimesheet) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    onReject?.(selectedTimesheet.id, rejectionReason);
    toast.success('Timesheet rejected');
    setIsRejectDialogOpen(false);
    setIsViewDialogOpen(false);
    setRejectionReason('');
  };

  const getStatusBadge = (status: Timesheet['status']) => {
    const variants: Record<Timesheet['status'], { className: string; label: string }> = {
      draft: { className: 'bg-muted text-muted', label: 'Draft' },
      submitted: { className: 'bg-accent-blue/10 text-accent-blue', label: 'Pending' },
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

  if (pendingTimesheets.length === 0) {
    return (
      <Card className={cn('bg-card', className)}>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted" />
          <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
          <p className="text-sm text-muted">No timesheets pending approval</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('bg-card', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Timesheet Approvals</CardTitle>
              <CardDescription>Review and approve team timesheets</CardDescription>
            </div>
            <Badge variant="outline" className="bg-accent-yellow/10 text-accent-yellow border-0">
              {pendingTimesheets.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead>Team Member</TableHead>
                  <TableHead>Week</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTimesheets.map((timesheet) => (
                  <TableRow key={timesheet.id} className="hover:bg-background/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${timesheet.user_id}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">User {timesheet.user_id.slice(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(timesheet.week_start), 'MMM d')} - {format(new Date(timesheet.week_end), 'MMM d')}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {timesheet.total_hours.toFixed(1)}h
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-accent-green">{timesheet.billable_hours.toFixed(1)}h</span>
                        <span className="text-xs text-muted">
                          ({Math.round((timesheet.billable_hours / timesheet.total_hours) * 100)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      {timesheet.submitted_at && format(new Date(timesheet.submitted_at), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(timesheet)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(timesheet.id)}
                          className="border-accent-green text-accent-green hover:bg-accent-green/10"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectClick(timesheet)}
                          className="border-accent-red text-accent-red hover:bg-accent-red/10"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Timesheet Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Timesheet</DialogTitle>
            <DialogDescription>Review time entries and approve or reject</DialogDescription>
          </DialogHeader>
          {selectedTimesheet && (
            <div className="space-y-4">
              <TimesheetView timesheet={selectedTimesheet} />
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectClick(selectedTimesheet)}
                  className="flex-1 border-accent-red text-accent-red hover:bg-accent-red/10"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedTimesheet.id)}
                  className="flex-1 bg-accent-green text-background hover:bg-accent-green/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Timesheet</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this timesheet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Explain why this timesheet is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConfirm}
                className="flex-1 bg-accent-red text-white hover:bg-accent-red/90"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Timesheet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
