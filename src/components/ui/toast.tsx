import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  onClose: () => void;
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center justify-between rounded-lg border p-4 shadow-lg",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
          : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
      )}
    >
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-4 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 