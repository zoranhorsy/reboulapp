import { defineStore } from 'pinia'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error'
}

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as Toast[]
    }),

    actions: {
        showToast(message: string, type: 'success' | 'error' = 'success') {
            // Ajoutons un console.log pour débugger
            console.log('Showing toast:', message)

            const id = Date.now().toString()
            this.toasts.push({ id, message, type })

            setTimeout(() => {
                this.removeToast(id)
            }, 3000)
        },

        removeToast(id: string) {
            this.toasts = this.toasts.filter(toast => toast.id !== id)
        }
    }
})