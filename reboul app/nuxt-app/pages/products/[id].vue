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

// Calcul du stock disponible pour la taille sélectionnée
const availableStock = computed(() => {
  if (!product.value) return 0
  if (!selectedSize.value) return totalStock.value
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

// Statut du stock
const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Rupture de stock', class: 'out-of-stock' }
  if (stock < 5) return { text: `${stock} disponible${stock > 1 ? 's' : ''}`, class: 'low-stock' }
  return { text: 'En stock', class: 'in-stock' }
}

// Quantité maximum sélectionnable
const maxQuantity = computed(() => {
  return Math.min(availableStock.value, 10)
})

// Gestion du zoom
const handleZoom = (event: MouseEvent) => {
  if (!isZoomed.value) return

  const image = event.target as HTMLImageElement
  const rect = image.getBoundingClientRect()

  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  zoomPos.value = { x, y }
}

// Gestion des images
const changeImage = (index: number) => {
  currentImageIndex.value = index
  isZoomed.value = false
}

// Ajouter au panier
const addToCart = () => {
  if (!selectedSize.value) {
    alert('Veuillez sélectionner une taille')
    return
  }

  if (!availableStock.value) {
    alert('Stock insuffisant')
    return
  }

  try {
    cartStore.addToCart(product.value, quantity.value, selectedSize.value)
    alert('Produit ajouté au panier')
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    alert('Erreur lors de l\'ajout au panier')
  }
}

// Réinitialiser la quantité quand on change de taille
watch(selectedSize, () => {
  quantity.value = 1
})

// Charger les données
onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div class="product-page">
    <!-- Loading State -->
    <div v-if="!product" class="loading">
      Chargement du produit...
    </div>

    <div v-else class="product-container">
      <!-- Images Section -->
      <div class="product-images">
        <div
            class="main-image-container"
            @mousemove="handleZoom"
            @mouseenter="isZoomed = true"
            @mouseleave="isZoomed = false"
        >
          <!-- Badges modifiés -->
          <div class="badges">
    <span v-if="totalStock === 0" class="badge out-of-stock">
      Rupture de stock
    </span>
            <span v-else-if="selectedSize && availableStock < 5 && availableStock > 0" class="badge low-stock">
      Plus que {{ availableStock }} en stock pour cette taille
    </span>
            <span v-else-if="totalStock < 5" class="badge low-stock">
      Plus que {{ totalStock }} en stock
    </span>
          </div>

          <img
              :src="product.images[currentImageIndex]"
              :alt="product.name"
              class="main-image"
              :class="{ 'zoomed': isZoomed }"
              :style="{
              transform: isZoomed ? 'scale(2)' : 'scale(1)',
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
            }"
          >
        </div>

        <div class="thumbnail-gallery">
          <img
              v-for="(image, index) in product.images"
              :key="index"
              :src="image"
              :alt="`${product.name} - vue ${index + 1}`"
              @click="changeImage(index)"
              :class="['thumbnail', { active: currentImageIndex === index }]"
          >
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">{{ product.price }} €</p>
        <p class="description">{{ product.description }}</p>

        <!-- Size Selection -->
        <div class="size-section">
          <h3 class="size-title">Sélectionner une taille</h3>

          <div class="size-grid">
            <button
                v-for="sizeInfo in sizesWithStock"
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
                :disabled="!sizeInfo.available"
            >
              <span class="size">{{ sizeInfo.size }}</span>
              <span class="stock-status">{{ sizeInfo.status.text }}</span>
            </button>
          </div>
        </div>

        <!-- Quantity -->
        <div v-if="selectedSize && availableStock > 0" class="quantity-section">
          <h3 class="quantity-title">Quantité</h3>
          <select v-model="quantity" class="quantity-select">
            <option v-for="n in maxQuantity" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- Add to Cart -->
        <button
            @click="addToCart"
            class="add-to-cart"
            :disabled="!selectedSize || availableStock === 0"
        >
          {{ !selectedSize ? 'Sélectionnez une taille' :
            availableStock === 0 ? 'Rupture de stock' :
                'Ajouter au panier' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  top: 100px;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* Image Section */
.product-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 600px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.3s ease-out;
}

.main-image.zoomed {
  cursor: zoom-out;
}

/* Badges */
.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.badge.low-stock {
  background: rgba(255, 136, 0, 0.9);
  color: white;
}

.badge.out-of-stock {
  background: rgba(255, 68, 68, 0.9);
  color: white;
}

/* Thumbnails */
.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-info h1 {
  font-size: 28px;
  margin: 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

/* Size Section */
.size-section {
  margin-top: 32px;
}

.size-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 8px;
}

.size-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.size-button .size {
  font-size: 14px;
  font-weight: 500;
}

.size-button .stock-status {
  font-size: 10px;
  position: absolute;
  bottom: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.size-button:hover .stock-status {
  opacity: 1;
}

.size-button:hover:not(.disabled) {
  background: #f8f8f8;
  border-color: #999;
}

.size-button.active {
  background: #000;
  border-color: #000;
  color: white;
}

.size-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #fafafa;
}

.size-button.out-of-stock {
  border-color: #e5e5e5;
  color: #999;
}

.size-button.low-stock {
  border-color: #e5e5e5;
}

.size-button.in-stock {
  border-color: #e5e5e5;
}

/* State colors only show on hover for a cleaner look */
.size-button:hover.out-of-stock {
  color: #dc2626;
  border-color: #dc2626;
}

.size-button:hover.low-stock {
  color: #ffffff;
  border-color: #d97706;
}

.size-button:hover.in-stock {
  color: #000;
  border-color: #000;
}

/* Quantity Section */
.quantity-section {
  margin-top: 20px;
}

.quantity-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.quantity-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

/* Add to Cart Button */
.add-to-cart {
  margin-top: 12px;
  padding: 16px 32px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart:hover:not(:disabled) {
  background: #333;
}

.add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }

  .main-image-container {
    height: 400px;
  }

  .product-info {
    padding: 0 10px;
  }

  .size-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>