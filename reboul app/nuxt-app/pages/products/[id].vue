<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { useCartStore } from '~/stores/useCartStore'
import { ref, computed, watch, onMounted } from 'vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

// États
const selectedSize = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)
const isZoomed = ref(false)
const zoomPos = ref({ x: 0, y: 0 })

// Obtenir le produit
const product = computed(() => {
  return productStore.products.find(p => p.id === route.params.id)
})

// Calcul du stock total
const totalStock = computed(() => {
  if (!product.value) return 0
  return Object.values(product.value.sizeStock).reduce((sum, stock) => sum + stock, 0)
})

// Stock disponible pour la taille sélectionnée
const availableStock = computed(() => {
  if (!product.value || !selectedSize.value) return 0
  return product.value.sizeStock[selectedSize.value] || 0
})

// Tailles avec leur statut
const sizesWithStock = computed(() => {
  if (!product.value) return []
  return Object.entries(product.value.sizeStock).map(([size, stock]) => ({
    size,
    stock,
    status: getStockStatus(stock),
    available: stock > 0
  }))
})

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Rupture de stock', class: 'out-of-stock' }
  if (stock < 5) return { text: `${stock} disponible${stock > 1 ? 's' : ''}`, class: 'low-stock' }
  return { text: 'En stock', class: 'in-stock' }
}

// Quantité maximum
const maxQuantity = computed(() => Math.min(availableStock.value, 10))

// Gestion du zoom
const handleZoom = (event: MouseEvent) => {
  if (!isZoomed.value) return
  const image = event.target as HTMLImageElement
  const rect = image.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  zoomPos.value = { x, y }
}

const changeImage = (index: number) => {
  currentImageIndex.value = index
  isZoomed.value = false
}

const addToCart = () => {
  if (!selectedSize.value || !product.value) {
    alert('Veuillez sélectionner une taille')
    return
  }

  if (!availableStock.value) {
    alert('Stock insuffisant')
    return
  }

  try {
    cartStore.addToCart(product.value, quantity.value, selectedSize.value)
    navigateTo('/')
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    alert('Erreur lors de l\'ajout au panier')
  }
}

// Reset quantity on size change
watch(selectedSize, () => {
  quantity.value = 1
})

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div v-if="product" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white w-full max-w-4xl rounded-xl overflow-hidden">
      <div class="relative p-6">
        <!-- Close Button -->
        <NuxtLink to="/" class="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          ✕
        </NuxtLink>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Images Section -->
          <div class="product-images">
            <div class="main-image-container"
                 @mousemove="handleZoom"
                 @mouseenter="isZoomed = true"
                 @mouseleave="isZoomed = false">
              <div class="badges">
                <span v-if="totalStock === 0" class="badge out-of-stock">
                  Rupture de stock
                </span>
                <span v-else-if="selectedSize && availableStock < 5 && availableStock > 0"
                      class="badge low-stock">
                  Plus que {{ availableStock }} en stock
                </span>
              </div>

              <img :src="product.images[currentImageIndex]"
                   :alt="product.name"
                   class="main-image"
                   :class="{ 'zoomed': isZoomed }"
                   :style="{
                     transform: isZoomed ? 'scale(2)' : 'scale(1)',
                     transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                   }">
            </div>

            <div class="thumbnail-gallery">
              <img v-for="(image, index) in product.images"
                   :key="index"
                   :src="image"
                   :alt="`${product.name} - vue ${index + 1}`"
                   @click="changeImage(index)"
                   :class="['thumbnail', { active: currentImageIndex === index }]">
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h1 class="text-2xl font-bold">{{ product.name }}</h1>
            <p class="text-xl mt-2">{{ product.price }} €</p>
            <p class="text-gray-600 mt-4">{{ product.description }}</p>

            <!-- Size Selection -->
            <div class="mt-6">
              <h3 class="text-sm font-medium mb-2">Taille</h3>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="sizeInfo in sizesWithStock"
                        :key="sizeInfo.size"
                        @click="selectedSize = sizeInfo.size"
                        :class="[
                          'size-button',
                          sizeInfo.status.class,
                          {
                            'active': selectedSize === sizeInfo.size,
                            'disabled': !sizeInfo.available
                          }
                        ]"
                        :disabled="!sizeInfo.available">
                  <span class="size">{{ sizeInfo.size }}</span>
                  <span class="stock-status">{{ sizeInfo.status.text }}</span>
                </button>
              </div>
            </div>

            <!-- Quantity Selection -->
            <div v-if="selectedSize && availableStock > 0" class="mt-6">
              <h3 class="text-sm font-medium mb-2">Quantité</h3>
              <select v-model="quantity" class="w-24 border rounded-lg p-2">
                <option v-for="n in maxQuantity" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <!-- Add to Cart Button -->
            <button @click="addToCart"
                    :disabled="!selectedSize || availableStock === 0"
                    class="w-full py-3 bg-black text-white rounded-lg mt-6 disabled:opacity-50">
              {{ !selectedSize ? 'Sélectionnez une taille' :
                availableStock === 0 ? 'Rupture de stock' :
                    'Ajouter au panier' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  aspect-ratio: 1;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.out-of-stock {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.badge.low-stock {
  background: rgba(245, 158, 11, 0.9);
  color: white;
}

.thumbnail-gallery {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.thumbnail {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 0.375rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
}

.size-button {
  position: relative;
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.375rem;
  text-align: center;
  transition: all 0.2s;
}

.size-button:hover:not(.disabled) {
  border-color: #000;
}

.size-button.active {
  border-color: #000;
  background: #000;
  color: white;
}

.size-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stock-status {
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.size-button:hover .stock-status {
  opacity: 1;
}

@media (max-width: 768px) {
  .product-images {
    gap: 0.5rem;
  }

  .thumbnail {
    width: 4rem;
    height: 4rem;
  }
}
</style>