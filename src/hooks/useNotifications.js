import { useCallback } from 'react'

import { useNotificationStore } from '@/stores/notificationStore'

export function useNotifications() {
  const { toasts, addToast, removeToast, clearAll } = useNotificationStore()

  const notify = useCallback(
    (payload) =>
      addToast({
        variant: 'info',
        ...payload,
      }),
    [addToast],
  )

  return {
    toasts,
    notify,
    addToast,
    removeToast,
    clearAll,
  }
}
