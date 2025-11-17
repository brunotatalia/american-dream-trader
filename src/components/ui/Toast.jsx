import { useEffect } from 'react'

import Button from './Button'

const VARIANT_CLASSES = {
  info: 'border-accent-info/40',
  success: 'border-accent-success/40',
  danger: 'border-accent-danger/40',
  warning: 'border-accent-warning/40',
}

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast.duration) return undefined

    const timeout = window.setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timeout)
  }, [onDismiss, toast.duration, toast.id])

  return (
    <div
      className={`flex w-full items-start justify-between gap-4 rounded-xl border bg-background-elevated/80 px-4 py-3 shadow-lg backdrop-blur-sm ${VARIANT_CLASSES[toast.variant] ?? VARIANT_CLASSES.info}`}
    >
      <div>
        {toast.title ? <p className="font-semibold text-text-primary">{toast.title}</p> : null}
        {toast.description ? <p className="text-sm text-text-secondary">{toast.description}</p> : null}
      </div>
      <Button variant="ghost" size="sm" onClick={() => onDismiss(toast.id)}>
        Dismiss
      </Button>
    </div>
  )
}
