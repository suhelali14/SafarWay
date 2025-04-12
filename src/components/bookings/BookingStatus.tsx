import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Booking } from '../../lib/api/bookings';

interface BookingStatusProps {
  status: Booking['status'];
  onCancel?: () => void;
  className?: string;
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Pending',
    description: 'Your booking is pending confirmation',
  },
  CONFIRMED: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    label: 'Confirmed',
    description: 'Your booking has been confirmed',
  },
  CANCELLED: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Cancelled',
    description: 'Your booking has been cancelled',
  },
  COMPLETED: {
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Completed',
    description: 'Your tour has been completed',
  },
};

export const BookingStatus = ({
  status,
  onCancel,
  className,
}: BookingStatusProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'flex items-center gap-4 border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn('h-6 w-6', config.color)} />
      <div className="flex-1">
        <h4 className="font-medium">{config.label}</h4>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
      {status === 'PENDING' && onCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="shrink-0"
        >
          Cancel Booking
        </Button>
      )}
    </Card>
  );
};

interface BookingTimelineProps {
  status: Booking['status'];
  className?: string;
}

export const BookingTimeline = ({ status, className }: BookingTimelineProps) => {
  const statuses: Booking['status'][] = ['PENDING', 'CONFIRMED', 'COMPLETED'];
  const currentIndex = statuses.indexOf(status);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {statuses.map((s, index) => {
          const config = statusConfig[s];
          const Icon = config.icon;
          const isActive = index <= currentIndex && status !== 'CANCELLED';
          const isLast = index === statuses.length - 1;

          return (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2',
                    isActive
                      ? cn('border-primary bg-primary text-primary-foreground')
                      : 'border-muted-foreground bg-background'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {config.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    isActive ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {status === 'CANCELLED' && (
        <Card className="flex items-center gap-3 border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">
            This booking has been cancelled
          </p>
        </Card>
      )}
    </div>
  );
}; 