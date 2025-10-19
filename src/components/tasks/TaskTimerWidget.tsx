import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskTimerWidgetProps {
  taskId: string;
  taskTitle: string;
  existingTime?: number; // in seconds
  onStart?: () => void;
  onPause?: () => void;
  onStop?: (totalSeconds: number) => void;
}

export default function TaskTimerWidget({
  taskId,
  taskTitle,
  existingTime = 0,
  onStart,
  onPause,
  onStop,
}: TaskTimerWidgetProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(existingTime);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    onStart?.();
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    onStop?.(seconds);
    setSeconds(0);
    setStartTime(null);
  };

  const time = formatTime(seconds);
  const totalHours = (seconds / 3600).toFixed(2);

  return (
    <Card className="bg-gradient-to-br from-accent-green/5 to-accent-blue/5 border-accent-green/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="rounded-lg bg-accent-green/10 p-1.5">
            <Clock className="h-4 w-4 text-accent-green" />
          </div>
          Time Tracking
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task Info */}
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <p className="text-sm font-medium line-clamp-1">{taskTitle}</p>
          <p className="text-xs text-muted mt-1">Task ID: {taskId}</p>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span
              className={cn(
                'text-4xl font-bold tabular-nums',
                isRunning && 'text-accent-green'
              )}
            >
              {time.hours}
            </span>
            <span className="text-2xl text-muted">:</span>
            <span
              className={cn(
                'text-4xl font-bold tabular-nums',
                isRunning && 'text-accent-green'
              )}
            >
              {time.minutes}
            </span>
            <span className="text-2xl text-muted">:</span>
            <span
              className={cn(
                'text-4xl font-bold tabular-nums',
                isRunning && 'text-accent-green'
              )}
            >
              {time.seconds}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                isRunning
                  ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                  : 'bg-muted/10 text-muted border-muted/20'
              )}
            >
              {isRunning ? 'Recording' : 'Stopped'}
            </Badge>
            <span className="text-xs text-muted">{totalHours}h total</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="flex-1 bg-accent-green hover:bg-accent-green/90"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Timer
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="flex-1"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                className="flex-1 border-accent-red text-accent-red hover:bg-accent-red/10"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Info */}
        {startTime && (
          <p className="text-xs text-muted text-center">
            Started at {new Date(startTime).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
