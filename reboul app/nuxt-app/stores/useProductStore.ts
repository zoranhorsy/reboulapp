import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        loading: false,
        error: null as Error | null
    }),

    actions: {
        async fetchProducts() {
            this.loading = true
            try {
                const response = await fetch('http://localhost:3002/api/products')
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
                this.products = await response.json()
            } catch (error) {
                this.error = error as Error
                throw error
            } finally {
                this.loading = false
            }
        },

        async uploadImage(base64Image: string) {
            const response = await fetch('http://localhost:3002/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image })
            })
            if (!response.ok) throw new Error('Upload failed')
            return await response.json()
        },

        async addProduct(product: Product) {
            try {
                let imageUrl = product.images[0]
                if (imageUrl?.startsWith('data:image')) {
                    const uploadedImage = await this.uploadImage(imageUrl)
                    imageUrl = uploadedImage.url
                }

                const productToAdd = {
                    ...product,
                    images: [imageUrl],
                    categories: product.categories || []
                }

                const response = await fetch('http://localhost:3002/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productToAdd)
                })

                if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
                const newProduct = await response.json()
                this.products.push(newProduct)
            } catch (error) {
                this.error = error as Error
                throw error
            }
        },

        async updateProduct(id: string, updatedProduct: Product) {
            try {
                let imageUrl = updatedProduct.images[0]
                if (imageUrl?.startsWith('data:image')) {
                    const uploadedImage = await this.uploadImage(imageUrl)
                    imageUrl = uploadedImage.url
                }

                const productToUpdate = {
                    ...updatedProduct,
                    images: [imageUrl],
                    sizeStock: updatedProduct.sizeStock || {},
                    categories: updatedProduct.categories || []
                }

                const response = await fetch(`http://localhost:3002/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productToUpdate)
                })

                if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
                const updated = await response.json()
                const index = this.products.findIndex(p => p.id === id)
                if (index !== -1) this.products[index] = updated
            } catch (error) {
                this.error = error as Error
                throw error
            }
        },

        async deleteProduct(id: string) {
            try {
                const response = await fetch(`http://localhost:3002/api/products/${id}`, {
                    method: 'DELETE'
                })
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
                this.products = this.products.filter(p => p.id !== id)
            } catch (error) {
                this.error = error as Error
                throw error
            }
        },

        async deleteImage(imageUrl: string) {
            try {
                const filename = imageUrl.split('/').pop()
                const response = await fetch(`http://localhost:3002/api/upload/${filename}`, {
                    method: 'DELETE'
                })
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
            } catch (error) {
                this.error = error as Error
                throw error
            }
        },

        checkStock(productId: string, size: string): number {
            return this.products.find(p => p.id === productId)?.sizeStock?.[size] || 0
        },
        async updateProductStatus(productId: string, newStatus: 'draft' | 'active') {
            try {
                const response = await fetch(`http://localhost:3002/api/products/${productId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) throw new Error('Failed to update status');

                // Mise à jour locale
                const productIndex = this.products.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                    this.products[productIndex].status = newStatus;
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour du status:', error);
                throw error;
            }
        }
    }
})