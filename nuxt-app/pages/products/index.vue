<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { useCartStore } from '~/stores/useCartStore'
import { onMounted, ref, computed } from 'vue'

const productStore = useProductStore()
const cartStore = useCartStore()

// Chargement des produits au montage avec gestion d'erreur
onMounted(async () => {
  try {
    await productStore.fetchProducts()
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  }
})

// État local pour les filtres
const selectedSize = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')

// Liste des tailles et catégories disponibles
const sizes = ['S', 'M', 'L', 'XL']
const categories = ['t-shirts', 'sweaters', 'pants']

// Ajout de cette ref pour gérer les tailles sélectionnées par produit
const selectedSizes = ref<{ [key: string]: string }>({})

// Produits filtrés avec vérification de l'existence des produits
const filteredProducts = computed(() => {
  if (!productStore.products) return [];

  return productStore.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSize = !selectedSize.value || (product.sizes && product.sizes.includes(selectedSize.value));
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;
    return matchesSearch && matchesSize && matchesCategory;
  });
});

// Variables réactives pour la pagination
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalItems = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// Fonctions de pagination
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const goToPage = (page: number) => {
  currentPage.value = page;
};

// Fonction pour ajouter au panier avec toast de confirmation
const addToCart = (product) => {
  if (!selectedSizes.value[product.id]) {
    alert('Veuillez sélectionner une taille')
    return
  }

  try {
    cartStore.addToCart(product, 1, selectedSizes.value[product.id])
    selectedSizes.value[product.id] = '' // Réinitialiser la sélection
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
  }
}
// Fonction pour formater le prix
const formatPrice = (price: number) => {
  return `${price.toFixed(2)} €`
}

// Nouvelle fonction pour gérer la sélection des tailles
const selectSize = (productId: string, size: string) => {
  selectedSizes.value[productId] = size
}

</script>

<template>
    <div class="products-page">
      <!-- Filtres -->
      <div class="filters">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un produit..."
            class="search-input"
        >

        <div class="filter-selects">
          <select v-model="selectedSize" class="filter-select">
            <option value="">Toutes les tailles</option>
            <option v-for="size in sizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>

          <select v-model="selectedCategory" class="filter-select">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="productStore.loading" class="loading">
        Chargement des produits...
      </div>
      <!-- Error state -->
      <div v-else-if="productStore.error" class="error">
        {{ productStore.error }}
      </div>

      <!-- Products grid -->
      <div v-else>
        <div class="products-grid">
          <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
            <img :src="product.images[0]" :alt="product.name" class="product-image">

            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="price">{{ product.price }} €</p>
              <p class="description">{{ product.description }}</p>

              <div class="sizes">
              <span v-for="size in product.sizes"
                    :key="size"
                    :class="['size-tag', { 'active': selectedSizes[product.id] === size }]"
                    @click="selectSize(product.id, size)">
                {{ size }}
              </span>
              </div>
              <button
                  @click="addToCart(product)"
                  class="add-button"
                  :disabled="!product.inStock"
              >
                {{ product.inStock ? 'Ajouter au panier' : 'Rupture de stock' }}
              </button>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
          >
            Précédent
          </button>
          <span>Page {{ currentPage }} / {{ totalPages }}</span>
          <button
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
</template>

<style>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  top: 100px;
}

.filters {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-selects {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.price {
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.sizes {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.size-tag {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-tag:hover {
  background: #e0e0e0;
}

.size-tag.active {
  background: #000;
  color: white;
}

.add-button {
  width: 100%;
  padding: 10px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:disabled {
  background: #ccc;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

@media (max-width: 768px) {
  .filter-selects {
    flex-direction: column;
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  padding: 8px 0;
}
</style>