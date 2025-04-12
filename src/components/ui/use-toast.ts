import { useState, useCallback } from "react";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default" }: Toast) => {
      setToasts(prev => [...prev, { title, description, variant }]);
      setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 3000);
    },
    []
  );

  return { toast, toasts };
} 