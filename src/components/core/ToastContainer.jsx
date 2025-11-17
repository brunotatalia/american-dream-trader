import Toast from '@/components/ui/Toast'
import { useNotifications } from '@/hooks/useNotifications'

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3 md:bottom-8 md:right-8">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  )
}

