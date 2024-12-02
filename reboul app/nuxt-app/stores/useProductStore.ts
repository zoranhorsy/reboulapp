import { defineStore } from 'pinia'
import { Product } from "~/types/product";
import {categories} from "@vueuse/metadata";

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        loading: false,
        error: null
    }),

    actions: {
        async fetchProducts() {
            this.loading = true
            try {
                const response = await fetch('http://localhost:3002/api/products')
                this.products = await response.json()
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.loading = false
            }
        },

        async addProduct(product) {
            const productToAdd = { ...product,
            categories: product.categories || []
            }
                JSON.stringify(product)
            try {
                const response = await fetch('http://localhost:3002/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
                if (!response.ok) {
                    console.error('Failed response:', await response.text());
                    throw new Error('Erreur lors de l\'ajout: ' + response.statusText);
                }

                const newProduct = await response.json();
                this.products.push(newProduct)
            } catch (error) {
                console.error('Error adding product:', error)
            }
        },

        async updateProduct(id, updatedProduct) {
            try {
                // Créer une copie du produit sans l'image si c'est une base64
                const productToUpdate = { ...updatedProduct,
                    sizeStock: updatedProduct.sizeStock || {} }
                    categories: updatedProduct.categories || []
                if (productToUpdate.images[0]?.startsWith('data:image')) {
                    // Si c'est une nouvelle image en base64, on pourrait :
                    // 1. Soit la stocker ailleurs et ne garder que l'URL
                    // 2. Soit temporairement utiliser une URL de placeholder
                    productToUpdate.images[0] = 'https://via.placeholder.com/150'
                }

                const response = await fetch(`http://localhost:3002/api/products/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productToUpdate)
                })
                const updated = await response.json()
                const index = this.products.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.products[index] = updated
                }
            } catch (error) {
                console.error('Error updating product:', error)
            }
        },

        async deleteProduct(id) {
            try {
                await fetch(`http://localhost:3002/api/products/${id}`, {
                    method: 'DELETE'
                })
                this.products = this.products.filter(p => p.id !== id)
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        },

        async deleteImage(imageUrl: string) {
            try {
                const filename = imageUrl.split('/').pop();
                await fetch(`http://localhost:3002/api/upload/${filename}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Erreur suppression image:', error);
            }
        },
        checkStock(productId: string, size: string) {
            const product = this.products.find(p => p.id === productId)
            return product?.sizeStock?.[size] || 0
        }
    }


})

