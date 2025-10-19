import type {
  TimeEntry,
  Timesheet,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
  TimesheetApprovalInput,
  TimeTrackingStats,
  TimesheetExport,
} from '@/types/timetracking';

const ACTIVE_TIMER_KEY = 'active_timer';
const OFFLINE_ENTRIES_KEY = 'offline_time_entries';

// Timer service with concurrency control
class TimeTrackingService {
  private activeTimer: TimeEntry | null = null;
  private timerInterval: number | null = null;

  constructor() {
    // Restore active timer from localStorage on init
    this.restoreActiveTimer();
  }

  private restoreActiveTimer() {
    const stored = localStorage.getItem(ACTIVE_TIMER_KEY);
    if (stored) {
      try {
        this.activeTimer = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to restore active timer:', error);
        localStorage.removeItem(ACTIVE_TIMER_KEY);
      }
    }
  }

  private saveActiveTimer() {
    if (this.activeTimer) {
      localStorage.setItem(ACTIVE_TIMER_KEY, JSON.stringify(this.activeTimer));
    } else {
      localStorage.removeItem(ACTIVE_TIMER_KEY);
    }
  }

  // Get active timer
  getActiveTimer(): TimeEntry | null {
    return this.activeTimer;
  }

  // Start timer with concurrency control (only one timer at a time)
  async startTimer(input: CreateTimeEntryInput): Promise<TimeEntry> {
    // Check if there's already an active timer
    if (this.activeTimer) {
      throw new Error('A timer is already running. Please stop the current timer first.');
    }

    const newEntry: TimeEntry = {
      id: `temp_${Date.now()}`, // Temporary ID until synced with server
      user_id: 'current_user', // Will be set by backend
      task_id: input.task_id,
      project_id: input.project_id,
      description: input.description,
      start_time: new Date().toISOString(),
      is_billable: input.is_billable,
      status: 'running',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.activeTimer = newEntry;
    this.saveActiveTimer();

    // Start interval to update duration
    this.startTimerInterval();

    // Try to sync with server (handle offline case)
    try {
      // API call would go here
      // const serverEntry = await api.post('/time-entries', newEntry);
      // this.activeTimer = serverEntry;
      // this.saveActiveTimer();
    } catch (error) {
      // If offline, keep local timer and queue for sync
      this.queueOfflineEntry(newEntry);
    }

    return newEntry;
  }

  // Stop active timer
  async stopTimer(): Promise<TimeEntry> {
    if (!this.activeTimer) {
      throw new Error('No active timer to stop');
    }

    const endTime = new Date().toISOString();
    const startTime = new Date(this.activeTimer.start_time);
    const durationMinutes = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 60000);

    const stoppedEntry: TimeEntry = {
      ...this.activeTimer,
      end_time: endTime,
      duration_minutes: durationMinutes,
      status: 'stopped',
      updated_at: endTime,
    };

    this.stopTimerInterval();
    this.activeTimer = null;
    this.saveActiveTimer();

    // Try to sync with server
    try {
      // API call would go here
      // const serverEntry = await api.put(`/time-entries/${stoppedEntry.id}`, stoppedEntry);
      // return serverEntry;
    } catch (error) {
      // If offline, queue for sync
      this.queueOfflineEntry(stoppedEntry);
    }

    return stoppedEntry;
  }

  // Get current timer duration in minutes
  getCurrentDuration(): number {
    if (!this.activeTimer) return 0;
    
    const startTime = new Date(this.activeTimer.start_time);
    const now = new Date();
    return Math.floor((now.getTime() - startTime.getTime()) / 60000);
  }

  // Format duration as HH:MM:SS
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private startTimerInterval() {
    this.timerInterval = setInterval(() => {
      // Trigger UI update (listeners would handle this)
      if (this.activeTimer) {
        this.activeTimer.updated_at = new Date().toISOString();
      }
    }, 1000);
  }

  private stopTimerInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Queue offline entries for later sync
  private queueOfflineEntry(entry: TimeEntry) {
    const stored = localStorage.getItem(OFFLINE_ENTRIES_KEY);
    const queue: TimeEntry[] = stored ? JSON.parse(stored) : [];
    queue.push(entry);
    localStorage.setItem(OFFLINE_ENTRIES_KEY, JSON.stringify(queue));
  }

  // Sync offline entries when back online
  async syncOfflineEntries(): Promise<void> {
    const stored = localStorage.getItem(OFFLINE_ENTRIES_KEY);
    if (!stored) return;

    const queue: TimeEntry[] = JSON.parse(stored);
    const synced: string[] = [];

    for (const entry of queue) {
      try {
        // API call would go here
        // await api.post('/time-entries/sync', entry);
        synced.push(entry.id);
      } catch (error) {
        console.error('Failed to sync entry:', entry.id, error);
      }
    }

    // Remove synced entries from queue
    const remaining = queue.filter(e => !synced.includes(e.id));
    if (remaining.length > 0) {
      localStorage.setItem(OFFLINE_ENTRIES_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(OFFLINE_ENTRIES_KEY);
    }
  }

  // Cleanup on service destruction
  destroy() {
    this.stopTimerInterval();
  }
}

// Export singleton instance
export const timeTrackingService = new TimeTrackingService();

// Mock API functions (replace with actual API calls)
export const timeTrackingApi = {
  // Time entries
  getTimeEntries: async (_filters?: {
    user_id?: string;
    project_id?: string;
    task_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TimeEntry[]> => {
    // Mock data
    return [];
  },

  createTimeEntry: async (input: CreateTimeEntryInput): Promise<TimeEntry> => {
    return timeTrackingService.startTimer(input);
  },

  updateTimeEntry: async (_input: UpdateTimeEntryInput): Promise<TimeEntry> => {
    // API call would go here
    throw new Error('Not implemented');
  },

  deleteTimeEntry: async (_id: string): Promise<void> => {
    // API call would go here
  },

  // Timesheets
  getTimesheets: async (_filters?: {
    user_id?: string;
    status?: Timesheet['status'];
    week_start?: string;
  }): Promise<Timesheet[]> => {
    // Mock data
    return [];
  },

  getTimesheetById: async (_id: string): Promise<Timesheet> => {
    // API call would go here
    throw new Error('Not implemented');
  },

  submitTimesheet: async (_id: string): Promise<Timesheet> => {
    // API call would go here
    throw new Error('Not implemented');
  },

  approveTimesheet: async (_input: TimesheetApprovalInput): Promise<Timesheet> => {
    // API call would go here
    throw new Error('Not implemented');
  },

  // Stats
  getTimeTrackingStats: async (): Promise<TimeTrackingStats> => {
    // Mock data
    return {
      total_hours_today: 6.5,
      total_hours_week: 32.5,
      total_hours_month: 142.0,
      billable_hours_week: 28.0,
      billable_hours_month: 128.0,
      active_timer: timeTrackingService.getActiveTimer() || undefined,
    };
  },

  // Export
  exportTimesheet: async (_input: TimesheetExport): Promise<Blob> => {
    // API call would go here
    throw new Error('Not implemented');
  },
};
