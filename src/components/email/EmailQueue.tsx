/**
 * Email Queue Component
 * 
 * Component for managing email queue and viewing email status
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmailQueue, useRetryEmail, useCancelEmail } from '@/hooks/useEmail';
import { Mail, RefreshCw, X, Eye, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { EmailQueueItem, EmailStatus } from '@/types/email';

const statusConfig: Record<
  EmailStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: <Clock className="h-3 w-3" />,
  },
  sent: {
    label: 'Sent',
    variant: 'default',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  delivered: {
    label: 'Delivered',
    variant: 'default',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    icon: <XCircle className="h-3 w-3" />,
  },
  bounced: {
    label: 'Bounced',
    variant: 'destructive',
    icon: <XCircle className="h-3 w-3" />,
  },
};

export function EmailQueue() {
  const [selectedEmail, setSelectedEmail] = useState<EmailQueueItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: queue, isLoading } = useEmailQueue();
  const retryMutation = useRetryEmail();
  const cancelMutation = useCancelEmail();

  const handleViewDetails = (email: EmailQueueItem) => {
    setSelectedEmail(email);
    setDetailsOpen(true);
  };

  const handleRetry = (id: string) => {
    retryMutation.mutate(id);
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!queue || queue.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Mail className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Emails in Queue</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            All emails have been processed. New emails will appear here when they are queued.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Email Queue</h2>
              <p className="text-muted-foreground mt-1">
                {queue.length} email{queue.length !== 1 ? 's' : ''} in queue
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((email) => {
                const config = statusConfig[email.status];
                const recipients = Array.isArray(email.request.to)
                  ? email.request.to.join(', ')
                  : email.request.to;

                return (
                  <TableRow key={email.id}>
                    <TableCell>
                      <Badge variant={config.variant} className="gap-1">
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{recipients}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {email.request.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{email.request.templateType}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(email.createdAt), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {email.attempts} / {email.maxAttempts}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(email)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {email.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(email.id)}
                            disabled={retryMutation.isPending}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        {email.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(email.id)}
                            disabled={cancelMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>
              View detailed information about this email
            </DialogDescription>
          </DialogHeader>

          {selectedEmail && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={statusConfig[selectedEmail.status].variant} className="gap-1">
                      {statusConfig[selectedEmail.status].icon}
                      {statusConfig[selectedEmail.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Template Type</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedEmail.request.templateType}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Recipients</label>
                <p className="mt-1 text-sm">
                  {Array.isArray(selectedEmail.request.to)
                    ? selectedEmail.request.to.join(', ')
                    : selectedEmail.request.to}
                </p>
              </div>

              {selectedEmail.request.cc && selectedEmail.request.cc.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CC</label>
                  <p className="mt-1 text-sm">{selectedEmail.request.cc.join(', ')}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="mt-1 text-sm font-medium">{selectedEmail.request.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-sm">
                    {format(new Date(selectedEmail.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                {selectedEmail.sentAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sent</label>
                    <p className="mt-1 text-sm">
                      {format(new Date(selectedEmail.sentAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
              </div>

              {selectedEmail.scheduledAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scheduled For</label>
                  <p className="mt-1 text-sm">
                    {format(new Date(selectedEmail.scheduledAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Attempts: {selectedEmail.attempts} / {selectedEmail.maxAttempts}
                </label>
              </div>

              {selectedEmail.error && (
                <div>
                  <label className="text-sm font-medium text-destructive">Error</label>
                  <p className="mt-1 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    {selectedEmail.error}
                  </p>
                </div>
              )}

              {selectedEmail.request.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <pre className="mt-1 text-xs bg-card p-3 rounded-lg border overflow-x-auto">
                    {JSON.stringify(selectedEmail.request.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedEmail.status === 'failed' && (
                  <Button
                    onClick={() => {
                      handleRetry(selectedEmail.id);
                      setDetailsOpen(false);
                    }}
                    disabled={retryMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                )}
                {selectedEmail.status === 'pending' && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancel(selectedEmail.id);
                      setDetailsOpen(false);
                    }}
                    disabled={cancelMutation.isPending}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
