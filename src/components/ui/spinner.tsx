import { cn } from '../../lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export const Spinner = ({ className, size = 'md' }: SpinnerProps) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
}

export const LoadingOverlay = ({ loading, children }: LoadingOverlayProps) => {
  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <Spinner size="lg" />
      </div>
      <div className="pointer-events-none opacity-50">{children}</div>
    </div>
  );
}; 