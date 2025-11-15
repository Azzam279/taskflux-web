import { defineStore } from 'pinia'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
  duration?: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastMessage[],
    lastId: 0,
  }),

  actions: {
    show(message: string, variant: ToastVariant = 'info', duration = 3000) {
      const id = ++this.lastId

      this.toasts.push({ id, message, variant, duration })

      setTimeout(() => {
        this.remove(id)
      }, duration)
    },

    remove(id: number) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },
  },
})
