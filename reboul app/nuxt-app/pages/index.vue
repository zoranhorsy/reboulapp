<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { useCartStore } from '~/stores/useCartStore'
import { ref, computed, onMounted } from 'vue'

const productStore = useProductStore()
const cartStore = useCartStore()
const showModal = ref(false)
const selectedProduct = ref(null)
const selectedSize = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)

const heroSlides = [
  {
    image: '/hero1.jpg',
    title: 'Collection Premium',
    subtitle: 'Découvrez notre sélection de vêtements haut de gamme'
  },
  {
    image: '/hero2.jpg',
    title: 'Nouvelle Collection',
    subtitle: 'Explorez nos dernières créations'
  },
  {
    image: '/hero3.jpg',
    title: 'Édition Limitée',
    subtitle: 'Des pièces uniques pour un style unique'
  }
]

const currentSlide = ref(0)
const categories = [
  { name: 'T-Shirts', image: '/categories/tshirts.jpg', slug: 't-shirts' },
  { name: 'Sweaters', image: '/categories/sweaters.jpg', slug: 'sweaters' },
  { name: 'Pants', image: '/categories/pants.jpg', slug: 'pants' },
  { name: 'Outerwear', image: '/categories/outerwear.jpg', slug: 'outerwear' }
]

const emailNewsletter = ref('')
const instagramPosts = [
  { image: '/instagram/post1.jpg', likes: 124, link: '#' },
  { image: '/instagram/post2.jpg', likes: 231, link: '#' },
  { image: '/instagram/post3.jpg', likes: 543, link: '#' },
  { image: '/instagram/post4.jpg', likes: 332, link: '#' }
]

const featuredProducts = computed(() => {
  if (!productStore.products?.length) return []
  return productStore.products.slice(0, 4)
})

const availableStock = computed(() => {
  if (!selectedProduct.value) return 0
  if (!selectedSize.value) {
    // Retourne le total du stock si aucune taille n'est sélectionnée
    return Object.values(selectedProduct.value.sizeStock).reduce((sum, stock) => sum + stock, 0)
  }
  return selectedProduct.value.sizeStock[selectedSize.value] || 0
})

const openModal = (product) => {
  selectedProduct.value = product
  showModal.value = true
  selectedSize.value = ''
  quantity.value = 1
  currentImageIndex.value = 0
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const addToCart = () => {
  if (!selectedSize.value || !selectedProduct.value) {
    alert('Veuillez sélectionner une taille')
    return
  }

  if (!availableStock.value) {
    alert('Stock insuffisant')
    return
  }

  cartStore.addToCart(selectedProduct.value, quantity.value, selectedSize.value)
  closeModal()
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div class="home">
    <!-- Hero Slider -->
    <section class="hero-slider">
      <div class="slides-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, index) in heroSlides"
             :key="index"
             class="slide"
             :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="slide-content">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.subtitle }}</p>
            <NuxtLink to="/products" class="cta-button">Découvrir</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories">
      <h2>Nos Catégories</h2>
      <div class="categories-grid">
        <NuxtLink v-for="category in categories"
                  :key="category.slug"
                  :to="`/products?category=${category.slug}`"
                  class="category-card">
          <img :src="category.image" :alt="category.name">
          <div class="category-overlay">
            <h3>{{ category.name }}</h3>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Nos Produits Phares</h2>
      <div class="products-grid">
        <div v-for="product in featuredProducts"
             :key="product.id"
             class="product-card"
             @click="openModal(product)">
          <div class="product-image">
            <img :src="product.images?.[0]" :alt="product.name">
            <div class="product-overlay">
              <button class="view-button">Voir le produit</button>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price }} €</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal && selectedProduct"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             @click="closeModal">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          <Transition name="modal-content">
            <div class="relative bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh] z-10"
                 @click.stop>
              <div class="relative p-6">
      <div v-if="showModal && selectedProduct"
           class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           @click="closeModal">
        <div class="bg-white max-w-4xl w-full rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
             @click.stop>
          <div class="relative p-6">
            <button @click="closeModal"
                    class="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
              ✕
            </button>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Images -->
              <div class="product-images">
                <div class="main-image-container relative">
                  <!-- Stock Badges -->
                  <div v-if="selectedProduct" class="absolute top-4 left-4 z-10 flex flex-col gap-2">
     <span v-if="availableStock === 0"
           class="bg-red-500/90 text-white px-3 py-1 rounded-md text-sm">
       Rupture de stock
     </span>
                    <span v-else-if="selectedSize && availableStock < 5"
                          class="bg-orange-500/90 text-white px-3 py-1 rounded-md text-sm">
       Plus que {{ availableStock }} en stock
     </span>
                  </div>

                  <img :src="selectedProduct.images[currentImageIndex]"
                       :alt="selectedProduct.name"
                       class="w-full aspect-square object-cover rounded-lg">
                </div>

                <!-- Thumbnails -->
                <div class="flex gap-2 mt-4">
                  <button v-for="(image, idx) in selectedProduct.images"
                          :key="idx"
                          @click="currentImageIndex = idx"
                          class="w-20 h-20 rounded-lg overflow-hidden"
                          :class="{ 'ring-2 ring-black': currentImageIndex === idx }">
                    <img :src="image"
                         :alt="selectedProduct.name"
                         class="w-full h-full object-cover">
                  </button>
                </div>
              </div>

              <!-- Info -->
              <div class="product-info">
                <h2 class="text-2xl font-bold">{{ selectedProduct.name }}</h2>
                <p class="text-xl mt-2">{{ selectedProduct.price }} €</p>
                <p class="text-gray-600 mt-4">{{ selectedProduct.description }}</p>

                <!-- Size Selection -->
                <div class="mt-6">
                  <h3 class="text-sm font-medium mb-2">Taille</h3>
                  <div class="grid grid-cols-4 gap-2">
                    <button v-for="(stock, size) in selectedProduct.sizeStock"
                            :key="size"
                            @click="selectedSize = size"
                            :class="[
                              'p-3 border rounded-lg transition',
                              selectedSize === size ? 'bg-black text-white' : '',
                              stock > 0 ? 'hover:border-black' : 'opacity-50'
                            ]"
                            :disabled="stock === 0">
                      <span class="text-sm">{{ size }}</span>
                      <span class="block text-xs mt-1">
                        {{ stock > 0 ? `${stock} en stock` : 'Rupture' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Quantity -->
                <div v-if="selectedSize && availableStock > 0" class="mt-6">
                  <h3 class="text-sm font-medium mb-2">Quantité</h3>
                  <select v-model="quantity"
                          class="w-24 border rounded-lg p-2">
                    <option v-for="n in Math.min(availableStock, 10)"
                            :key="n"
                            :value="n">
                      {{ n }}
                    </option>
                  </select>
                </div>

                <!-- Add to Cart -->
                <button @click="addToCart"
                        :disabled="!selectedSize || availableStock === 0"
                        class="w-full py-3 bg-black text-white rounded-lg mt-6
                               disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ !selectedSize ? 'Sélectionnez une taille' :
                    availableStock === 0 ? 'Rupture de stock' :
                        'Ajouter au panier' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Instagram Feed -->
    <section class="instagram-feed">
      <h2>Suivez-nous sur Instagram</h2>
      <div class="instagram-grid">
        <a v-for="post in instagramPosts"
           :key="post.image"
           :href="post.link"
           target="_blank"
           rel="noopener"
           class="instagram-post">
          <img :src="post.image" alt="Instagram post">
          <div class="instagram-overlay">
            <span class="likes">♥ {{ post.likes }}</span>
          </div>
        </a>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="newsletter-content">
        <h2>Restez informé</h2>
        <p>Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités</p>
        <div class="newsletter-form">
          <input type="email"
                 v-model="emailNewsletter"
                 placeholder="Votre adresse email"
                 class="rounded-lg">
          <button class="bg-white text-black rounded-lg">S'inscrire</button>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
/* Layout */
.home {
  @apply w-full overflow-x-hidden;
}

/* Hero Section */
.hero-slider {
  @apply relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden;
}

.slides-container {
  @apply h-full flex transition-transform duration-500;
}

.slide {
  @apply min-w-full h-full bg-cover bg-center relative;
}

.slide-content {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  text-center text-white bg-black/50 p-4 md:p-8 rounded-lg
  w-[90%] max-w-lg;
}

.slide-content h1 {
  @apply text-2xl md:text-4xl lg:text-5xl font-bold mb-2;
}

.slide-content p {
  @apply text-sm md:text-base lg:text-lg mb-4;
}

/* Sections */
.categories,
.featured-products,
.instagram-feed {
  @apply py-8 md:py-12 lg:py-16 px-4 md:px-6 max-w-7xl mx-auto;
}

.section-title {
  @apply text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center;
}

/* Grids */
.categories-grid,
.products-grid,
.instagram-grid {
  @apply grid gap-4 md:gap-6;
}

.categories-grid {
  @apply grid-cols-2 md:grid-cols-4;
}

.products-grid {
  @apply grid-cols-2 sm:grid-cols-3 lg:grid-cols-4;
}

.instagram-grid {
  @apply grid-cols-2 md:grid-cols-4;
}

/* Product Cards */
.product-card {
  @apply border border-gray-200 rounded-lg overflow-hidden
  transition-transform duration-200 hover:-translate-y-1
  cursor-pointer bg-white shadow-sm hover:shadow-md;
}

.product-image {
  @apply relative h-48 sm:h-56 md:h-64;
}

.product-image img {
  @apply w-full h-full object-cover;
}

.product-overlay {
  @apply absolute inset-0 bg-black/50 flex items-center justify-center
  opacity-0 transition-opacity duration-200;
}

.product-card:hover .product-overlay {
  @apply opacity-100;
}

.view-button {
  @apply px-4 py-2 bg-white text-black rounded-md text-sm
  transform transition-transform duration-200
  hover:scale-105;
}

.product-info {
  @apply p-3 md:p-4;
}

.product-info h3 {
  @apply text-sm md:text-base font-medium mb-1;
}

.price {
  @apply text-base md:text-lg font-semibold;
}

/* Modal */
.modal-backdrop {
  @apply fixed inset-0 bg-black/50 z-50
  flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white w-full max-w-4xl rounded-xl overflow-hidden
  max-h-[90vh] overflow-y-auto relative;
}

.modal-body {
  @apply p-4 md:p-6 lg:p-8;
}

.modal-grid {
  @apply grid md:grid-cols-2 gap-6 md:gap-8;
}

.modal-images {
  @apply space-y-4;
}

.modal-main-image {
  @apply w-full aspect-square rounded-lg object-cover;
}

.modal-thumbnails {
  @apply flex gap-2 overflow-x-auto;
}

.modal-thumbnail {
  @apply w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden
  cursor-pointer transition-opacity duration-200
  hover:opacity-80;
}

/* Newsletter */
.newsletter {
  @apply bg-black text-white py-12 md:py-16 px-4 text-center;
}

.newsletter-content {
  @apply max-w-xl mx-auto;
}

.newsletter-form {
  @apply flex flex-col sm:flex-row gap-3 mt-6;
}

.newsletter-input {
  @apply flex-1 px-4 py-2 rounded-lg border-2 border-transparent
  focus:border-white bg-white/10 text-white
  placeholder-white/60;
}

.newsletter-button {
  @apply px-6 py-2 bg-white text-black rounded-lg
  transition-colors hover:bg-gray-100;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .modal-content {
    @apply h-full max-h-full rounded-none;
  }

  .newsletter-form {
    @apply space-y-2;
  }
}

@media (min-width: 768px) {
  .product-card {
    @apply hover:border-gray-300;
  }
}

@media (min-width: 1024px) {
  .product-info {
    @apply p-5;
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>