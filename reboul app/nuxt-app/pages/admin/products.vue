<script setup>
import { useProductStore } from '~/stores/useProductStore'
import { ref, computed } from 'vue'
import ImageUpload from '~/composant/ImageUpload.vue'
import CategoryManager from "~/composant/CategoryManager.vue";


const productStore = useProductStore()
const errors = ref({})

// État initial du formulaire
const editingProduct = ref({
  id: '',
  name: '',
  price: 0,
  description: '',
  images: [''],
  category: '',
  categories: [],
  sizeStock: {
    'S': 0,
    'M': 0,
    'L': 0,
    'XL': 0,
    '44': 0
  }
})

const isEditing = ref(false)
const availableSizes = ['S', 'M', 'L', 'XL', '44']
const categories = ['t-shirts', 'sweaters', 'pants', 'outerwear']

// Fonction pour vérifier le statut du stock d'une taille
const getSizeStockStatus = (stock) => {
  if (stock === 0) return { text: 'Rupture', class: 'out-of-stock' }
  if (stock < 5) return { text: 'Stock bas', class: 'low-stock' }
  return { text: 'En stock', class: 'in-stock' }
}

// Validation du formulaire
const validateForm = () => {
  errors.value = {}

  if (!editingProduct.value.name?.trim()) {
    errors.value.name = 'Le nom est requis'
  }

  if (!editingProduct.value.price || editingProduct.value.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0'
  }

  if (!editingProduct.value.description?.trim()) {
    errors.value.description = 'La description est requise'
  }

  if (!editingProduct.value.category) {
    errors.value.category = 'La catégorie est requise'
  }

  // Vérification qu'au moins une taille a du stock
  const hasStock = Object.values(editingProduct.value.sizeStock)
      .some(stock => stock > 0)

  if (!hasStock) {
    errors.value.stock = 'Au moins une taille doit avoir du stock'
  }

  return Object.keys(errors.value).length === 0
}

// Actions
const addProduct = async () => {
  if (!validateForm()) return
  try {
    await productStore.addProduct(editingProduct.value)
    resetForm()
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error)
  }
}

const editProduct = (product) => {
  isEditing.value = true
  editingProduct.value = {
    ...product,
    sizeStock: { ...product.sizeStock }
  }
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

const deleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      alert(`Erreur lors de la suppression : ${error.message}`)
    }
  }
}

const resetForm = () => {
  editingProduct.value = {
    id: '',
    name: '',
    price: 0,
    description: '',
    images: [''],
    category: '',
    sizeStock: Object.fromEntries(availableSizes.map(size => [size, 0]))
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
    <h1>Administration des Produits</h1>

    <!-- Formulaire -->
    <div class="product-form">
      <h2>{{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>

      <!-- Champs de base -->
      <div class="form-group">
        <label>Nom</label>
        <input
            type="text"
            v-model="editingProduct.name"
            :class="{ 'error': errors.name }"
        >
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>Prix</label>
        <input
            type="number"
            v-model="editingProduct.price"
            step="0.01"
            :class="{ 'error': errors.price }"
        >
        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="editingProduct.description"
            :class="{ 'error': errors.description }"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label>Image du produit</label>
        <ImageUpload v-model="editingProduct.images" />
      </div>
      <div class="form-group row">
      <CategoryManager v-model="editingProduct.categories" />

      <!-- Gestion du stock par taille -->
        <div class="form-group">
        <label>Stock par taille</label>
        <div class="size-stock-grid">
          <div
              v-for="size in availableSizes"
              :key="size"
              class="size-stock-input"
          >
            <label>{{ size }}</label>
            <input
                type="number"
                v-model.number="editingProduct.sizeStock[size]"
                min="0"
                class="stock-input"
            >
            <span
                class="stock-status"
                :class="getSizeStockStatus(editingProduct.sizeStock[size]).class"
            >
              {{ getSizeStockStatus(editingProduct.sizeStock[size]).text }}
            </span>
          </div>
        </div>
        </div>
        <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
      </div>

      <div class="form-actions">
        <button
            @click="isEditing ? updateProduct() : addProduct()"
            class="primary"
        >
          {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button
            v-if="isEditing"
            @click="resetForm"
            class="cancel"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="products-list">
      <h2>Produits existants</h2>

      <div v-if="productStore.loading" class="loading">
        Chargement...
      </div>

      <table v-else>
        <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
          <th>Prix</th>
          <th>Categories</th>
          <th>Stock par taille</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in productStore.products" :key="product.id">
          <td>
            <img
                :src="product.images[0]"
                :alt="product.name"
                class="product-thumbnail"
            >
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }} €</td>
          <td>{{ product.categories?.[0]?.name || 'Non catégorisé' }} </td>
          <td>
            <div class="size-stock-display">
              <div
                  v-for="size in availableSizes"
                  :key="size"
                  class="size-stock-item"
              >
                <span class="size-label">{{ size }}:</span>
                <span
                    :class="getSizeStockStatus(product.sizeStock[size]).class"
                >
                    {{ product.sizeStock[size] || 0 }}
                  </span>
              </div>
            </div>
          </td>
          <td>
            <button @click="editProduct(product)" class="edit">Modifier</button>
            <button @click="deleteProduct(product.id)" class="delete">
              Supprimer
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  top: 100px;
}

.product-form {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  border-color: #f44336 !important;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.size-stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.size-stock-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stock-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stock-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  text-align: center;
}

.out-of-stock {
  background: #fee2e2;
  color: #dc2626;
}

.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.in-stock {
  background: #dcfce7;
  color: #16a34a;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.primary {
  background: #000;
  color: white;
}

button.cancel {
  background: #666;
  color: white;
}

button.edit {
  background: #2196F3;
  color: white;
}

button.delete {
  background: #f44336;
  color: white;
}

.size-stock-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-stock-item {
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
}

.size-label {
  font-weight: 500;
  margin-right: 4px;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.loading {
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .size-stock-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  table {
    display: block;
    overflow-x: auto;
  }
}

.form-group.row {
  @apply flex gap-4;
}

.form-group.row > * {
  @apply flex-1;
}
</style>

