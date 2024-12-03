<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import type { Product } from '~/types/product'
import ImageUpload from '~/composant/ImageUpload.vue'
import CategoryManager from "~/composant/CategoryManager.vue"
import ProductPreviewModal from '~/composant/ProductPreviewModal.vue'

const productStore = useProductStore()
const errors = ref<Record<string, string>>({})
const showPreview = ref(false)
const previewProduct = computed(() => ({
  ...editingProduct.value,
  name: editingProduct.value.name || 'Nouveau produit',
  price: editingProduct.value.price || 0,
  description: editingProduct.value.description || 'Aucune description',
  status: editingProduct.value.status || 'draft'
}))

const handleStatusUpdate = async (product) => {
  try {
    const newStatus = product.status === 'draft' ? 'active' : 'draft';
    await productStore.updateProductStatus(product.id, newStatus);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

const editingProduct = ref<Product>({
  id: '',
  name: '',
  price: 0,
  description: '',
  images: [''],
  categories: [],
  sizeStock: {
    'S': 0,
    'M': 0,
    'L': 0,
    'XL': 0,
    '44': 0
  },
  status: 'draft'
})

const isEditing = ref(false)
const availableSizes = ['S', 'M', 'L', 'XL', '44'] as const

const getSizeStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Rupture', class: 'out-of-stock' }
  if (stock < 5) return { text: 'Stock bas', class: 'low-stock' }
  return { text: 'En stock', class: 'in-stock' }
}

const validateForm = () => {
  errors.value = {}
  if (!editingProduct.value.name?.trim()) errors.value.name = 'Le nom est requis'
  if (!editingProduct.value.price || editingProduct.value.price <= 0) errors.value.price = 'Le prix doit être supérieur à 0'
  if (!editingProduct.value.description?.trim()) errors.value.description = 'La description est requise'

  const hasStock = Object.values(editingProduct.value.sizeStock).some(stock => stock > 0)
  if (!hasStock) errors.value.stock = 'Au moins une taille doit avoir du stock'

  return Object.keys(errors.value).length === 0
}

const addProduct = async () => {
  if (!validateForm()) return
  try {
    await productStore.addProduct(editingProduct.value)
    resetForm()
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error)
  }
}

const editProduct = (product: Product) => {
  isEditing.value = true
  editingProduct.value = { ...product, sizeStock: { ...product.sizeStock } }
}

const updateProduct = async () => {
  if (!validateForm()) return
  try {
    await productStore.updateProduct(editingProduct.value.id, editingProduct.value)
    isEditing.value = false
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
  try {
    await productStore.deleteProduct(id)
  } catch (error) {
    alert(`Erreur lors de la suppression : ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
  }
}

const resetForm = () => {
  editingProduct.value = {
    id: '',
    name: '',
    price: 0,
    description: '',
    images: [''],
    categories: [],
    sizeStock: Object.fromEntries(availableSizes.map(size => [size, 0])) as Record<string, number>,
    status: 'draft'
  }
  isEditing.value = false
  errors.value = {}
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div class="admin-page">
    <h1 class="text-2xl font-bold mb-6">Administration des Produits</h1>

    <div class="product-form">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">
          {{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}
        </h2>
        <div class="flex gap-3">
          <button
              @click="editingProduct.status = editingProduct.status === 'draft' ? 'active' : 'draft'"
              :class="['status-btn', editingProduct.status]"
          >
            {{ editingProduct.status === 'draft' ? 'Brouillon' : 'Publié' }}
          </button>
          <button @click="showPreview = true" class="preview-btn">
            Aperçu
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Nom</label>
        <input type="text" v-model="editingProduct.name" :class="{ 'error': errors.name }">
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>Prix</label>
        <input type="number" v-model="editingProduct.price" step="0.01" :class="{ 'error': errors.price }">
        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="editingProduct.description" :class="{ 'error': errors.description }"></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label>Image du produit</label>
        <ImageUpload v-model="editingProduct.images" />
      </div>

      <div class="form-group row">
        <CategoryManager v-model="editingProduct.categories" />
        <div class="form-group">
          <label>Stock par taille</label>
          <div class="size-stock-grid">
            <div v-for="size in availableSizes" :key="size" class="size-stock-input">
              <label>{{ size }}</label>
              <input type="number" v-model.number="editingProduct.sizeStock[size]" min="0" class="stock-input">
              <span :class="['stock-status', getSizeStockStatus(editingProduct.sizeStock[size]).class]">
                {{ getSizeStockStatus(editingProduct.sizeStock[size]).text }}
              </span>
            </div>
          </div>
        </div>
        <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
      </div>

      <div class="form-actions">
        <button @click="isEditing ? updateProduct() : addProduct()" class="primary">
          {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button v-if="isEditing" @click="resetForm" class="cancel">
          Annuler
        </button>
      </div>
    </div>

    <div class="products-list">
      <h2>Produits existants</h2>
      <table v-if="!productStore.loading">
        <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
          <th>Prix</th>
          <th>Categories</th>
          <th>Stock par taille</th>
          <th>Etat</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in productStore.products" :key="product.id">
          <td>
            <img :src="product.images[0] || '/placeholder.png'" :alt="product.name" class="product-thumbnail">
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }} €</td>
          <td>{{ product.categories?.[0]?.name || 'Non catégorisé' }}</td>
          <td>
            <div class="size-stock-display">
              <div v-for="size in availableSizes" :key="size" class="size-stock-item">
                <span class="size-label">{{ size }}:</span>
                <span :class="getSizeStockStatus(product.sizeStock[size]).class">
                    {{ product.sizeStock[size] || 0 }}
                  </span>
              </div>
            </div>
          </td>
          <td>
            <button
                @click="handleStatusUpdate(product)"
                :class="[
        'status-badge',
        product.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600'
      ]"
            >
              {{ product.status === 'draft' ? 'Brouillon' : 'Publié' }}
            </button>
          </td>
          <td>
            <button @click="editProduct(product)" class="edit">Modifier</button>
            <button @click="deleteProduct(product.id)" class="delete">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-else class="flex justify-center py-12">
        <span class="loading"></span>
      </div>
    </div>

    <ProductPreviewModal
        :show="showPreview"
        :product="previewProduct"
        @close="showPreview = false"
    />
  </div>
</template>

<style scoped>
.admin-page {
  @apply max-w-7xl mx-auto p-6 relative top-[100px] bg-gray-50;
}

.product-form {
  @apply bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100;
}

.form-group {
  @apply mb-5;
}

.form-group label {
  @apply block mb-2 text-sm font-medium text-gray-700;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  @apply w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none;
}

.error {
  @apply border-red-400 ring-2 ring-red-100;
}

.error-message {
  @apply text-red-500 text-xs mt-1.5;
}

.size-stock-grid {
  @apply grid grid-cols-2 md:grid-cols-5 gap-4 mt-3;
}

.size-stock-input {
  @apply flex flex-col gap-2 bg-gray-50 p-3 rounded-lg;
}

.stock-input {
  @apply p-2.5 border border-gray-200 rounded-lg text-center;
}

.stock-status {
  @apply text-xs py-1.5 px-3 rounded-lg text-center font-medium;
}

.out-of-stock {
  @apply bg-red-50 text-red-600;
}

.low-stock {
  @apply bg-yellow-50 text-yellow-600;
}

.in-stock {
  @apply bg-green-50 text-green-600;
}

.form-actions {
  @apply flex gap-3 mt-6 justify-end;
}

button {
  @apply px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm;
}

button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

button.cancel {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

button.edit {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

button.delete {
  @apply text-red-600 hover:bg-red-50;
}

.status-btn {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-colors;
}

.status-btn.draft {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200;
}

.status-btn.active {
  @apply bg-green-50 text-green-600 hover:bg-green-100 border border-green-200;
}

.preview-btn {
  @apply bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium;
}

.size-stock-display {
  @apply flex flex-wrap gap-2;
}

.size-stock-item {
  @apply text-sm p-2 rounded-lg bg-gray-50 font-medium;
}

.product-thumbnail {
  @apply w-16 h-16 object-cover rounded-lg shadow-sm;
}

table {
  @apply w-full bg-white rounded-xl overflow-hidden shadow-sm;
}

th, td {
  @apply p-4 text-left border-b border-gray-100;
}

th {
  @apply bg-gray-50 text-sm font-medium text-gray-600;
}

.form-group.row {
  @apply flex gap-6;
}

.form-group.row > * {
  @apply flex-1;
}

.loading {
  @apply w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin;
}

@media (max-width: 768px) {
  .admin-page {
    @apply px-4;
  }

  .product-form {
    @apply p-4;
  }

  .form-group.row {
    @apply flex-col gap-4;
  }

  .form-actions {
    @apply flex-col gap-2;
  }

  button {
    @apply w-full;
  }
}
</style>