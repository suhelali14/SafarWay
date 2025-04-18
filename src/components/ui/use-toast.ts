import { useToast as useToastHook } from "./toast";

export const useToast = useToastHook;

export type { Toast, ToastActionElement } from "./toast";

// Re-export toast function for direct use
export { toast } from "./toast"; 