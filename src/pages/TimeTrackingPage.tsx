import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import TimerWidget from '@/components/time-tracking/TimerWidget';
import TimeEntryList from '@/components/time-tracking/TimeEntryList';
import TimesheetView from '@/components/time-tracking/TimesheetView';
import TimesheetApproval from '@/components/time-tracking/TimesheetApproval';
import type { TimeEntry, Timesheet, TimeTrackingStats } from '@/types/timetracking';
import { startOfWeek, endOfWeek } from 'date-fns';

export default function TimeTrackingPage() {
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  const [activeTab, setActiveTab] = useState<string>('timesheet');

  // Mock data - replace with actual API calls
  const stats: TimeTrackingStats = {
    total_hours_today: 6.5,
    total_hours_week: 32.5,
    total_hours_month: 142.0,
    billable_hours_week: 28.0,
    billable_hours_month: 128.0,
  };

  const mockEntries: TimeEntry[] = [
    {
      id: '1',
      user_id: 'user1',
      task_id: 'task1',
      project_id: 'project1',
      description: 'Implemented user authentication flow',
      start_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 120,
      is_billable: true,
      status: 'stopped',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'user1',
      task_id: 'task2',
      project_id: 'project1',
      description: 'Code review and bug fixes',
      start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      is_billable: true,
      status: 'stopped',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: 'user1',
      description: 'Team standup meeting',
      start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 30,
      is_billable: false,
      status: 'stopped',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const mockTimesheet: Timesheet = {
    id: 'timesheet1',
    user_id: 'user1',
    week_start: currentWeekStart.toISOString(),
    week_end: currentWeekEnd.toISOString(),
    total_hours: 32.5,
    billable_hours: 28.0,
    status: 'draft',
    entries: mockEntries,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockPendingTimesheets: Timesheet[] = [
    {
      id: 'timesheet2',
      user_id: 'user2',
      week_start: currentWeekStart.toISOString(),
      week_end: currentWeekEnd.toISOString(),
      total_hours: 40.0,
      billable_hours: 36.0,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      entries: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const handleUpdateEntry = (entry: TimeEntry) => {
    console.log('Update entry:', entry);
    // API call would go here
  };

  const handleDeleteEntry = (id: string) => {
    console.log('Delete entry:', id);
    // API call would go here
  };

  const handleSubmitTimesheet = (id: string) => {
    console.log('Submit timesheet:', id);
    // API call would go here
  };

  const handleExportTimesheet = (id: string, format: 'csv' | 'pdf' | 'quickbooks') => {
    console.log('Export timesheet:', id, format);
    // API call would go here
  };

  const handleApproveTimesheet = (id: string) => {
    console.log('Approve timesheet:', id);
    // API call would go here
  };

  const handleRejectTimesheet = (id: string, reason: string) => {
    console.log('Reject timesheet:', id, reason);
    // API call would go here
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Time Tracking</h1>
            <p className="text-muted">Track time, manage timesheets, and approve hours</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Today</CardTitle>
              <div className="rounded-lg bg-accent-purple/10 p-2">
                <Clock className="h-4 w-4 text-accent-purple" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_hours_today.toFixed(1)}h</div>
              <p className="text-xs text-muted mt-1">Hours tracked</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">This Week</CardTitle>
              <div className="rounded-lg bg-accent-blue/10 p-2">
                <Calendar className="h-4 w-4 text-accent-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_hours_week.toFixed(1)}h</div>
              <p className="text-xs text-muted flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stats.billable_hours_week.toFixed(1)}h billable
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">This Month</CardTitle>
              <div className="rounded-lg bg-accent-green/10 p-2">
                <TrendingUp className="h-4 w-4 text-accent-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_hours_month.toFixed(1)}h</div>
              <p className="text-xs text-muted flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3" />
                {stats.billable_hours_month.toFixed(1)}h billable
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Billable Rate</CardTitle>
              <div className="rounded-lg bg-accent-yellow/10 p-2">
                <DollarSign className="h-4 w-4 text-accent-yellow" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats.billable_hours_week / stats.total_hours_week) * 100)}%
              </div>
              <p className="text-xs text-muted mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Timer Widget */}
        <TimerWidget />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="timesheet">My Timesheet</TabsTrigger>
            <TabsTrigger value="entries">Time Entries</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals
              {mockPendingTimesheets.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-accent-yellow/10 text-accent-yellow border-0">
                  {mockPendingTimesheets.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timesheet" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Current Week</h2>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="last">Last Week</SelectItem>
                  <SelectItem value="2weeks">2 Weeks Ago</SelectItem>
                  <SelectItem value="3weeks">3 Weeks Ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TimesheetView
              timesheet={mockTimesheet}
              onSubmit={handleSubmitTimesheet}
              onExport={handleExportTimesheet}
            />
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Time Entries</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entries</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TimeEntryList
              entries={mockEntries}
              onUpdate={handleUpdateEntry}
              onDelete={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <TimesheetApproval
              timesheets={mockPendingTimesheets}
              onApprove={handleApproveTimesheet}
              onReject={handleRejectTimesheet}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
