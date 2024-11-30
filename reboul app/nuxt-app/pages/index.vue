<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const productStore = useProductStore()

// Données pour le slider hero
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
const isSliding = ref(false)

// Catégories
const categories = [
  { name: 'T-Shirts', image: '/categories/tshirts.jpg', slug: 't-shirts' },
  { name: 'Sweaters', image: '/categories/sweaters.jpg', slug: 'sweaters' },
  { name: 'Pants', image: '/categories/pants.jpg', slug: 'pants' },
  { name: 'Outerwear', image: '/categories/outerwear.jpg', slug: 'outerwear' }
]

// Newsletter
const emailNewsletter = ref('')
const newsletterStatus = ref('')
const isValidEmail = ref(true)

// Instagram Feed
const instagramPosts = [
  { image: '/instagram/post1.jpg', likes: 124, link: '#' },
  { image: '/instagram/post2.jpg', likes: 231, link: '#' },
  { image: '/instagram/post3.jpg', likes: 543, link: '#' },
  { image: '/instagram/post4.jpg', likes: 332, link: '#' }
]

// Products
const featuredProducts = computed(() => {
  if (!productStore.products?.length) return []
  return productStore.products
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
})

// Méthodes
const nextSlide = () => {
  if (isSliding.value) return
  isSliding.value = true
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  setTimeout(() => isSliding.value = false, 600)
}

const prevSlide = () => {
  if (isSliding.value) return
  isSliding.value = true
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
  setTimeout(() => isSliding.value = false, 600)
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const subscribeNewsletter = () => {
  if (!emailNewsletter.value) {
    newsletterStatus.value = 'Veuillez entrer une adresse email'
    isValidEmail.value = false
    return
  }

  if (!validateEmail(emailNewsletter.value)) {
    newsletterStatus.value = 'Adresse email invalide'
    isValidEmail.value = false
    return
  }

  newsletterStatus.value = 'Merci pour votre inscription !'
  isValidEmail.value = true
  emailNewsletter.value = ''
  setTimeout(() => newsletterStatus.value = '', 3000)
}

onMounted(async () => {
  // Charger les produits
  await productStore.fetchProducts()

  // Démarrer le slider automatique
  const interval = setInterval(nextSlide, 5000)
  onUnmounted(() => clearInterval(interval))
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
            <NuxtLink to="/products" class="cta-button">
              Découvrir
            </NuxtLink>
          </div>
        </div>
      </div>
      <button class="slider-nav prev" @click="prevSlide">&lt;</button>
      <button class="slider-nav next" @click="nextSlide">&gt;</button>
      <div class="slider-dots">
        <span v-for="(_, index) in heroSlides"
              :key="index"
              :class="{ active: currentSlide === index }"
              @click="currentSlide = index">
        </span>
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
             class="product-card">
          <div class="product-image">
            <img :src="product.images?.[0]" :alt="product.name">
            <div class="product-overlay">
              <NuxtLink :to="`/products/${product.id}`" class="view-button">
                Voir le produit
              </NuxtLink>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price }} €</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Concept Section -->
    <section class="concept">
      <div class="concept-content">
        <h2>Notre Concept</h2>
        <div class="concept-grid">
          <div class="concept-item">
            <i class="icon quality"></i>
            <h3>Qualité Premium</h3>
            <p>Des matériaux soigneusement sélectionnés pour une qualité exceptionnelle.</p>
          </div>
          <div class="concept-item">
            <i class="icon sustainable"></i>
            <h3>Mode Durable</h3>
            <p>Une production responsable respectueuse de l'environnement.</p>
          </div>
          <div class="concept-item">
            <i class="icon design"></i>
            <h3>Design Unique</h3>
            <p>Des créations originales pour un style qui vous ressemble.</p>
          </div>
        </div>
      </div>
    </section>

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
          <input
              type="email"
              v-model="emailNewsletter"
              placeholder="Votre adresse email"
              :class="{ 'invalid': !isValidEmail }"
          >
          <button @click="subscribeNewsletter">S'inscrire</button>
        </div>
        <p class="newsletter-status" :class="{ 'error': !isValidEmail }">
          {{ newsletterStatus }}
        </p>
      </div>
    </section>
  </div>
</template>
<style>
/* Base */
.home {
  width: 100%;
}

/* Hero Slider */
.hero-slider {
  position: relative;
  height: 80vh;
  overflow: hidden;
}

.slides-container {
  height: 100%;
  display: flex;
  transition: transform 0.6s ease;
}

.slide {
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 8px;
}

.slide-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
}

.slider-nav.prev { left: 1rem; }
.slider-nav.next { right: 1rem; }

.slider-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.slider-dots span {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
}

.slider-dots span.active {
  background: white;
}

/* Categories */
.categories {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.categories h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover img {
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Featured Products */
.featured-products {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.view-button {
  color: #dddddd;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  position: relative;
  height: 300px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

/* Concept Section */
.concept {
  background: #f8f8f8;
  padding: 4rem 2rem;
}

.concept-content {
  max-width: 1200px;
  margin: 0 auto;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.concept-item {
  text-align: center;
  padding: 2rem;
}

/* Instagram Feed */
.instagram-feed {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.instagram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.instagram-post {
  position: relative;
  aspect-ratio: 1;
}

.instagram-post img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instagram-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.instagram-post:hover .instagram-overlay {
  opacity: 1;
}

/* Newsletter */
.newsletter {
  background: #000;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.newsletter-form input {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 4px;
}

.newsletter-form input.invalid {
  border: 2px solid red;
}

.newsletter-form button {
  padding: 1rem 2rem;
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.newsletter-status {
  margin-top: 1rem;
  height: 20px;
}

.newsletter-status.error {
  color: red;
}

/* Responsive */
@media (max-width: 768px) {
  .slide-content h1 {
    font-size: 2rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .concept-grid {
    grid-template-columns: 1fr;
  }
}
</style>
