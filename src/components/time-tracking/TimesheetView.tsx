import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Download, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Timesheet } from '@/types/timetracking';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import TimeEntryList from './TimeEntryList';
import { exportTimesheet } from '@/services/timesheetExportService';

interface TimesheetViewProps {
  timesheet: Timesheet;
  onSubmit?: (id: string) => void;
  onExport?: (id: string, format: 'csv' | 'pdf' | 'quickbooks') => void;
  className?: string;
}

export default function TimesheetView({ timesheet, onSubmit, onExport, className }: TimesheetViewProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'quickbooks'>('pdf');

  const handleSubmit = () => {
    if (confirm('Submit this timesheet for approval?')) {
      onSubmit?.(timesheet.id);
      toast.success('Timesheet submitted for approval');
    }
  };

  const handleExport = () => {
    try {
      exportTimesheet(timesheet, exportFormat);
      toast.success(`Timesheet exported as ${exportFormat.toUpperCase()}`);
      onExport?.(timesheet.id, exportFormat);
    } catch (error) {
      toast.error('Failed to export timesheet');
      console.error('Export error:', error);
    }
  };

  const getStatusBadge = (status: Timesheet['status']) => {
    const variants: Record<Timesheet['status'], { className: string; label: string; icon: typeof Clock }> = {
      draft: { className: 'bg-muted text-muted', label: 'Draft', icon: Clock },
      submitted: { className: 'bg-accent-blue/10 text-accent-blue', label: 'Submitted', icon: Send },
      approved: { className: 'bg-accent-green/10 text-accent-green', label: 'Approved', icon: CheckCircle },
      rejected: { className: 'bg-accent-red/10 text-accent-red', label: 'Rejected', icon: XCircle },
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={cn('border-0 gap-1', variant.className)}>
        <Icon className="h-3 w-3" />
        {variant.label}
      </Badge>
    );
  };

  const billablePercentage = timesheet.total_hours > 0
    ? Math.round((timesheet.billable_hours / timesheet.total_hours) * 100)
    : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Timesheet Header */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent-purple" />
                Week of {format(new Date(timesheet.week_start), 'MMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {format(new Date(timesheet.week_start), 'MMM d')} - {format(new Date(timesheet.week_end), 'MMM d, yyyy')}
              </CardDescription>
            </div>
            {getStatusBadge(timesheet.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background">
              <div className="text-sm text-muted mb-1">Total Hours</div>
              <div className="text-2xl font-bold">{timesheet.total_hours.toFixed(1)}h</div>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <div className="text-sm text-muted mb-1">Billable Hours</div>
              <div className="text-2xl font-bold text-accent-green">{timesheet.billable_hours.toFixed(1)}h</div>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <div className="text-sm text-muted mb-1">Billable Rate</div>
              <div className="text-2xl font-bold">{billablePercentage}%</div>
            </div>
          </div>

          {/* Billable Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Billable vs Total</span>
              <span className="font-medium">{timesheet.billable_hours.toFixed(1)}h / {timesheet.total_hours.toFixed(1)}h</span>
            </div>
            <Progress value={billablePercentage} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {timesheet.status === 'draft' && (
              <Button onClick={handleSubmit} className="bg-accent-green text-background hover:bg-accent-green/90">
                <Send className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            )}

            <div className="flex gap-2 flex-1 md:flex-initial">
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="quickbooks">QuickBooks</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Rejection Reason */}
          {timesheet.status === 'rejected' && timesheet.rejection_reason && (
            <div className="p-4 rounded-lg bg-accent-red/10 border border-accent-red/20">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-accent-red mt-0.5" />
                <div>
                  <div className="font-semibold text-accent-red mb-1">Rejected</div>
                  <p className="text-sm">{timesheet.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Info */}
          {timesheet.status === 'approved' && timesheet.approved_at && (
            <div className="p-4 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-accent-green mt-0.5" />
                <div>
                  <div className="font-semibold text-accent-green mb-1">Approved</div>
                  <p className="text-sm text-muted">
                    Approved on {format(new Date(timesheet.approved_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Entries */}
      <TimeEntryList entries={timesheet.entries} />
    </div>
  );
}
