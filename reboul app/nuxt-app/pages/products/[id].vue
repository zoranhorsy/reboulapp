<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { useCartStore } from '~/stores/useCartStore'
import { ref, computed, onMounted } from 'vue'

// Stores et Route
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

// États locaux de base
const selectedSize = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)

// États pour le zoom
const isZoomed = ref(false)
const zoomPosition = ref({ x: 0, y: 0 })
const zoomLevel = ref(2)

// États pour les fonctionnalités avancées
const isFavorite = ref(false)
const recentlyViewed = ref([])
const showReviews = ref(false)
const showSizeGuide = ref(false)

// Obtenir le produit
const product = computed(() => {
  return productStore.products.find(p => p.id === route.params.id)
})

// Stock status computed
const stockStatus = computed(() => {
  if (!product.value) return { text: '', class: '' }

  const stock = product.value.stock
  console.log('Stock actuel:', stock) // Pour déboguer

  if (stock === 0) {
    return {
      text: 'Rupture de stock',
      class: 'out-of-stock',
      available: false
    }
  }

  if (stock < 5) {
    return {
      text: `Plus que ${stock} en stock !`,
      class: 'low-stock',
      available: true
    }
  }

  return {
    text: 'En stock',
    class: 'in-stock',
    available: true
  }
})

// Maximum quantity selector based on available stock
const maxQuantity = computed(() => {
  if (!product.value) return 0
  return Math.min(product.value.stock, 10) // Maximum 10 ou le stock disponible
})



// Charger les données
onMounted(async () => {
  await productStore.fetchProducts()
})

// Ajouter au panier
// Ajouter au panier
const addToCart = () => {
  if (!selectedSize.value) {
    alert('Veuillez sélectionner une taille')
    return
  }

  if (!product.value || product.value.stock < quantity.value) {
    alert('Stock insuffisant')
    return
  }

  try {
    cartStore.addToCart(product.value, quantity.value, selectedSize.value)
    alert('Produit ajouté au panier')
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
  }
}

// Avis clients simulés
const reviews = ref([
  { id: 1, author: "Jean D.", rating: 5, comment: "Excellent produit !" },
  { id: 2, author: "Marie L.", rating: 4, comment: "Très satisfaite" }
])




// Produits recommandés
const recommendedProducts = computed(() => {
  if (!product.value) return []
  return productStore.products
      .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
      .slice(0, 4)
})

// Liens de partage social
const shareLinks = computed(() => {
  const url = window.location.href
  const title = product.value?.name
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${url}&media=${product.value?.images[0]}&description=${title}`
  }
})

// Fonctions
const handleZoom = (event: MouseEvent) => {
  if (!isZoomed.value) return

  const image = event.target as HTMLImageElement
  const rect = image.getBoundingClientRect()

  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  zoomPosition.value = { x, y }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}


  if (product.value) {
    cartStore.addToCart(product.value, quantity.value, selectedSize.value)
    alert('Produit ajouté au panier')
  }


const updateRecentlyViewed = () => {
  const recentProducts = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  if (product.value && !recentProducts.includes(product.value.id)) {
    recentProducts.unshift(product.value.id)
    localStorage.setItem('recentlyViewed', JSON.stringify(recentProducts.slice(0, 5)))
  }
}

// Lifecycle hooks
onMounted(async () => {
  await productStore.fetchProducts()
  updateRecentlyViewed()
})
</script>

<template>
  <div class="product-page">
    <!-- Loading State -->
    <div v-if="!product" class="loading">
      Chargement du produit...
    </div>

    <div v-else class="product-container">
<!--      &lt;!&ndash; Promotion Banner &ndash;&gt;-->
<!--      <div v-if="promoInfo.isOnSale" class="promo-banner">-->
<!--        <span class="promo-text">-->
<!--          {{ promoInfo.discountPercent }}% DE RÉDUCTION ! Offre se termine dans-->
<!--          {{ Math.ceil((promoInfo.endDate - new Date()) / (1000 * 60 * 60 * 24)) }} jours-->
<!--        </span>-->
<!--      </div>-->

      <!-- Left Side: Images with Zoom -->
      <div class="product-images">
        <div
            class="image-zoom-container"
            @mousemove="handleZoom"
            @mouseenter="isZoomed = true"
            @mouseleave="isZoomed = false"
        >
          <!-- Badges -->
          <div class="badges">
    <span
        v-if="stockStatus.text"
        class="badge"
        :class="stockStatus.class"
    >
              {{ stockStatus.text }}
            </span>
          </div>

          <img
              :src="product.images[currentImageIndex]"
              :alt="product.name"
              class="main-image"
              :class="{ 'zoomed': isZoomed }"
              :style="{
              transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }"
          >
        </div>

        <div class="thumbnail-gallery">
          <img
              v-for="(image, index) in product.images"
              :key="index"
              :src="image"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
              class="thumbnail"
          >
        </div>
      </div>

      <!-- Right Side: Product Info -->
      <div class="product-info">
        <!-- Header with Favorite -->
        <div class="product-header">
          <h1>{{ product.name }}</h1>
          <button
              @click="toggleFavorite"
              class="favorite-button"
              :class="{ active: isFavorite }"
          >
            ♥
          </button>
        </div>

        <!-- Prix et Stock -->
        <div class="price-stock-info">
          <p class="price">{{ product.price }} €</p>
          <p class="stock-text" :class="stockStatus.class">
            {{ stockStatus.text }}
          </p>
        </div>

        <p class="description">{{ product.description }}</p>

        <!-- Social Share -->
        <div class="social-share">
          <p>Partager:</p>
          <div class="share-buttons">
            <a :href="shareLinks.facebook" target="_blank" class="share-button facebook">Facebook</a>
            <a :href="shareLinks.twitter" target="_blank" class="share-button twitter">Twitter</a>
            <a :href="shareLinks.pinterest" target="_blank" class="share-button pinterest">Pinterest</a>
          </div>
        </div>

        <!-- Size Guide Button -->
        <button @click="showSizeGuide = true" class="size-guide-button">
          Guide des tailles
        </button>

        <!-- Tailles - ne s'affiche que si le produit est en stock -->
        <div v-if="stockStatus.available" class="size-selector">
          <p class="label">Taille</p>
          <div class="size-buttons">
            <button
                v-for="size in product.sizes"
                :key="size"
                :class="{ active: selectedSize === size }"
                @click="selectSize(size)"
                class="size-button"
            >
              {{ size }}
            </button>
          </div>
        </div>



        <!-- Message de rupture de stock -->
        <div v-else class="out-of-stock-message">
          Ce produit est actuellement indisponible
        </div>

        <!-- Quantité - seulement si en stock et taille sélectionnée -->
        <div v-if="stockStatus.available && selectedSize" class="quantity-selector">
          <p class="label">Quantité</p>
          <select
              v-model="quantity"
          >
            <option
                v-for="n in maxQuantity"
                :key="n"
                :value="n"
            >
              {{ n }}
            </option>
          </select>
        </div>

        <!-- Bouton Ajouter au panier -->
        <button
            @click="addToCart"
            class="add-to-cart"
            :disabled="!stockStatus.available"
        >
          {{ stockStatus.available ? 'Ajouter au panier' : 'Rupture de stock' }}
        </button>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <button @click="showReviews = !showReviews" class="reviews-toggle">
            Voir les avis ({{ reviews.length }})
          </button>
          <div v-if="showReviews" class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review">
              <div class="review-header">
                <span class="review-author">{{ review.author }}</span>
                <div class="review-rating">
                  ★★★★★
                  <span :style="{ width: (review.rating * 20) + '%' }"></span>
                </div>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Products -->
    <div class="recommended-products" v-if="recommendedProducts.length > 0">
      <h2>Vous aimerez aussi</h2>
      <div class="recommended-grid">
        <div
            v-for="prod in recommendedProducts"
            :key="prod.id"
            class="recommended-card"
        >
          <img :src="prod.images[0]" :alt="prod.name">
          <div class="recommended-info">
            <h3>{{ prod.name }}</h3>
            <p>{{ prod.price }} €</p>
            <NuxtLink :to="`/products/${prod.id}`" class="view-more">
              Voir le produit
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Size Guide Modal -->
    <div v-if="showSizeGuide" class="modal">
      <div class="modal-content">
        <h2>Guide des tailles</h2>
        <table class="size-table">
          <tr>
            <th>Taille</th>
            <th>Tour de poitrine</th>
            <th>Tour de taille</th>
            <th>Tour de hanches</th>
          </tr>
          <tr v-for="size in ['S', 'M', 'L', 'XL']" :key="size">
            <td>{{ size }}</td>
            <td>{{ size === 'S' ? '88-92' : size === 'M' ? '92-96' : size === 'L' ? '96-100' : '100-104' }}</td>
            <td>{{ size === 'S' ? '76-80' : size === 'M' ? '80-84' : size === 'L' ? '84-88' : '88-92' }}</td>
            <td>{{ size === 'S' ? '94-98' : size === 'M' ? '98-102' : size === 'L' ? '102-106' : '106-110' }}</td>
          </tr>
        </table>
        <button @click="showSizeGuide = false" class="close-modal">Fermer</button>
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

/* Promo Banner */
.promo-banner {
  background: #ff4444;
  color: white;
  text-align: center;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}

/* Product Container */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* Image Section */
.image-zoom-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.main-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  transition: transform 0.1s ease;
  cursor: zoom-in;
}

.main-image.zoomed {
  cursor: zoom-out;
}

/* Styles des badges */
.badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}


.thumbnail-gallery {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
}

/* Product Info */
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.favorite-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s;
}

.favorite-button.active {
  color: #ff4444;
}

.price-info {
  margin: 20px 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  margin-right: 10px;
}

.stock-info {
  font-size: 14px;
  color: #666;
}
.stock-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 10px;
}
/* États du stock */
.out-of-stock {
  background: rgba(255, 68, 68, 0.9);
  color: white;
}

.low-stock {
  background: rgba(255, 136, 0, 0.9);
  color: white;
}

.in-stock {
  background: rgba(39, 174, 96, 0.9);
  color: white;
}

.limited-stock {
  color: #ffaa00;
  background: #fff9e6;
}

/* Quantité */
.quantity-selector {
  margin: 20px 0;
}

.quantity-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
}

/* Prix et stock */
.price-stock-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

.stock-text {
  font-size: 14px;
}

.stock-info.low {
  color: #ff4444;
}

/* Social Share */
.social-share {
  margin: 20px 0;
}

.share-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.share-button {
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.facebook { background: #3b5998; }
.twitter { background: #1da1f2; }
.pinterest { background: #bd081c; }

/* Size Selection */
.size-guide-button {
  background: none;
  border: none;
  text-decoration: underline;
  color: #666;
  cursor: pointer;
  padding: 0;
  margin-bottom: 15px;
}

.size-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
}

.size-button.active {
  background: black;
  color: white;
  border-color: black;
}

/* Quantity Selection */
.quantity-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

/* Bouton ajouter au panier */
.add-to-cart {
  width: 100%;
  padding: 15px;
  background: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}
.add-to-cart:hover {
  background: #333;
}

.add-to-cart:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Reviews Section */
.reviews-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.review {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.review-rating {
  position: relative;
  color: #ddd;
}

.review-rating span {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  color: gold;
}

/* Size Guide Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
}

.size-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.size-table th,
.size-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

/* Recommended Products */
.recommended-products {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #eee;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.recommended-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.recommended-card:hover {
  transform: translateY(-5px);
}

.recommended-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recommended-info {
  padding: 15px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }

  .main-image {
    height: 400px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
    overflow-x: auto;
  }

  .share-buttons {
    flex-wrap: wrap;
  }

  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.out-of-stock-message {
  padding: 12px;
  background: #fff5f5;
  color: #e53e3e;
  border-radius: 4px;
  text-align: center;
  margin: 20px 0;
}

</style>