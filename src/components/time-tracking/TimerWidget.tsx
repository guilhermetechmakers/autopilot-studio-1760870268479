import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Play, Square, Clock } from 'lucide-react';
import { timeTrackingService } from '@/services/timeTrackingService';
import type { TimeEntry } from '@/types/timetracking';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TimerWidgetProps {
  taskId?: string;
  projectId?: string;
  compact?: boolean;
  className?: string;
}

export default function TimerWidget({ taskId, projectId, compact = false, className }: TimerWidgetProps) {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [duration, setDuration] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  // Check for active timer on mount
  useEffect(() => {
    const timer = timeTrackingService.getActiveTimer();
    setActiveTimer(timer);
    if (timer) {
      setDuration(timeTrackingService.getCurrentDuration());
    }
  }, []);

  // Update duration every second when timer is running
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setDuration(timeTrackingService.getCurrentDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleStartTimer = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      const entry = await timeTrackingService.startTimer({
        task_id: taskId,
        project_id: projectId,
        description: description.trim(),
        is_billable: isBillable,
      });

      setActiveTimer(entry);
      setDuration(0);
      setIsDialogOpen(false);
      toast.success('Timer started');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start timer');
    }
  };

  const handleStopTimer = async () => {
    try {
      await timeTrackingService.stopTimer();
      setActiveTimer(null);
      setDuration(0);
      setDescription('');
      toast.success('Timer stopped and entry saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to stop timer');
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {activeTimer ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm font-mono font-medium">{formatDuration(duration)}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStopTimer}
              className="h-8"
            >
              <Square className="h-3 w-3 mr-1" />
              Stop
            </Button>
          </>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Play className="h-3 w-3 mr-1" />
                Start Timer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Time Tracking</DialogTitle>
                <DialogDescription>
                  Track time for this task
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="billable">Billable</Label>
                  <Switch
                    id="billable"
                    checked={isBillable}
                    onCheckedChange={setIsBillable}
                  />
                </div>
                <Button onClick={handleStartTimer} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('bg-card', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-purple" />
            <h3 className="font-semibold">Time Tracker</h3>
          </div>
          {activeTimer && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-muted">Running</span>
            </div>
          )}
        </div>

        {activeTimer ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold mb-2">
                {formatDuration(duration)}
              </div>
              <p className="text-sm text-muted">{activeTimer.description}</p>
            </div>
            <Button
              onClick={handleStopTimer}
              variant="outline"
              className="w-full border-accent-red text-accent-red hover:bg-accent-red/10"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timer-description">Description</Label>
              <Input
                id="timer-description"
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="timer-billable">Billable</Label>
              <Switch
                id="timer-billable"
                checked={isBillable}
                onCheckedChange={setIsBillable}
              />
            </div>
            <Button
              onClick={handleStartTimer}
              className="w-full bg-accent-green text-background hover:bg-accent-green/90"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
