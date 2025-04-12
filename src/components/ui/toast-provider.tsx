import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function ToastProvider() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => {
            // Remove toast at index
            const newToasts = [...toasts];
            newToasts.splice(index, 1);
            // TODO: Update toasts state
          }}
        />
      ))}
    </div>
  );
} 