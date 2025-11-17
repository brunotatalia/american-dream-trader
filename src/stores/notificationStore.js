import { create } from 'zustand'

let idCounter = 0

export const useNotificationStore = create((set) => ({
  toasts: [],
  addToast: ({ title, description, variant = 'info', duration = 4000 }) => {
    const id = ++idCounter
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, title, description, variant, duration, createdAt: Date.now() },
      ],
    }))
    return id
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}))
