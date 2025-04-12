import { useEffect } from 'react';
import { useUI } from '../../lib/hooks/useUI';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

const NotificationIcon = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const NotificationColors = {
  success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  error: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200',
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useUI();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const Icon = NotificationIcon[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'flex w-96 items-center gap-3 rounded-lg p-4 shadow-lg',
        NotificationColors[type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0 hover:bg-transparent"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}; 