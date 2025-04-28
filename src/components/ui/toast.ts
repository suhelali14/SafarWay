import { useState, useCallback } from "react";

export interface Toast {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

export interface ToastActionElement {
  altText: string;
  action: () => void;
  children: React.ReactNode;
}

type ToastProps = Pick<
  Toast,
  "title" | "description" | "variant" | "action"
>;

// Toast hook for components
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", action }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant, action }]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
      
      return id;
    },
    []
  );

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => 
      id ? prev.filter((toast) => toast.id !== id) : []
    );
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}

// Singleton toast for direct import usage
let toasts: Toast[] = [];
let listeners: Function[] = [];

const addToast = (toast: ToastProps): string => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, ...toast };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 5000);
  
  return id;
};

const dismissToast = (id?: string) => {
  toasts = id 
    ? toasts.filter(toast => toast.id !== id)
    : [];
  listeners.forEach(listener => listener(toasts));
};

const subscribe = (listener: Function) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// Export standalone toast object
export const toast = {
  success: (props: string | Omit<ToastProps, "variant">) => 
    addToast(typeof props === 'string' 
      ? { title: props, variant: "success" } 
      : { ...props, variant: "success" }),
  error: (props: string | Omit<ToastProps, "variant">) => 
    addToast(typeof props === 'string' 
      ? { title: props, variant: "destructive" } 
      : { ...props, variant: "destructive" }),
  info: (props: string | Omit<ToastProps, "variant">) => 
    addToast(typeof props === 'string' 
      ? { title: props, variant: "default" } 
      : { ...props, variant: "default" }),
  dismiss: dismissToast,
  subscribe,
  get toasts() {
    return toasts;
  }
};