// stores/useCartStore.ts

import { defineStore } from 'pinia'
import { useToastStore } from './useToastStore'  // Import du store des toasts

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        promoCode: '',
        promoDiscount: 0,
    }),

    actions: {
        // Ajouter au panier
        addToCart(product: Product, quantity: number, size: string) {
            const existingItem = this.items.find(
                item => item.product.id === product.id && item.size === size
            )

            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                this.items.push({ product, quantity, size })
            }

            // Sauvegarder dans localStorage
            this.saveToLocalStorage()

            // Afficher le toast de confirmation
            const toastStore = useToastStore()
            toastStore.showToast(`${product.name} ajouté au panier`)
        },

        // Supprimer du panier
        removeFromCart(productId: string, size: string) {
            // Trouver l'item avant de le supprimer pour avoir son nom
            const itemToRemove = this.items.find(
                item => item.product.id === productId && item.size === size
            )

            if (itemToRemove) {
                // Supprimer l'item
                this.items = this.items.filter(
                    item => !(item.product.id === productId && item.size === size)
                )

                // Sauvegarder dans localStorage
                this.saveToLocalStorage()

                // Afficher le toast de confirmation
                const toastStore = useToastStore()
                toastStore.showToast(`${itemToRemove.product.name} retiré du panier`)
            }
        },

        // Mettre à jour la quantité
        updateQuantity(productId: string, size: string, quantity: number) {
            const item = this.items.find(
                item => item.product.id === productId && item.size === size
            )

            if (item) {
                item.quantity = quantity
                this.saveToLocalStorage()

                // Afficher le toast de confirmation
                const toastStore = useToastStore()
                toastStore.showToast(`Quantité mise à jour pour ${item.product.name}`)
            }
        },

        // Sauvegarder dans localStorage
        saveToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        },

        // Charger depuis localStorage
        loadFromLocalStorage() {
            const saved = localStorage.getItem('cart')
            if (saved) {
                this.items = JSON.parse(saved)
            }
        },

        applyPromoCode(code: string) {
            /// EXEMPLES DE CODE PROMO
            const promoCodes = {
                'WELCOME10': 10,
                'SUMMER20': 20,
                'WINTER30': 30
            }

            if (code in promoCodes) {
                this.promoCode = code
                this.promoDiscount = promoCodes[code]

                const toastStore = useToastStore()
                toastStore.showToast(`Code promo ${code} appliqué : -${this.promoDiscount}%`, 'success')
            } else {
                const toastStore = useToastStore()
                toastStore.showToast('Code promo invalide', 'error')
            }
        },
        removePromoCode() {
            this.promoCode = ''
            this.promoDiscount = 0
            const toastStore = useToastStore()
            toastStore.showToast('Code promo retiré', 'success')
        }
    },

    getters: {

        totalItems: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: state => state.items.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        ),
        discountAmount: state => {
            return (state.totalPrice * state.promoDiscount) / 100
        },
        finalPrice: state => {
            return state.totalPrice - state.discountAmount
        }
    },
})