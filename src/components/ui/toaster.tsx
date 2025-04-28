import { useToast } from "./use-toast";
import { Toast } from "./toastComponent";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:max-w-[420px] p-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => console.log(`Toast ${toast.id} closed`)} />
      ))}
    </div>
  );
} 