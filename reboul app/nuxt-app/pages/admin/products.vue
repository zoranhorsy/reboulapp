<script setup lang="ts">
import { useProductStore } from '~/stores/useProductStore'
import { ref, watch } from "vue"

// État pour la validation
const errors = ref({})
const imagePreview = ref('')
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const showPreview = ref(false)
const isEditing = ref(false)
const showImagePreview = ref(false)
const zoom = ref(1)
const openPreview = () => {
  showImagePreview.value = true
  zoom.value = 1
}

const closePreview = () => {
  showImagePreview.value = false
}
// État pour le formulaire d'ajout/modification
const editingProduct = ref({
  id: '',
  name: '',
  price: 0,
  description: '',
  images: [''],
  category: '',
  sizeStock: {}, // Nouvel objet pour le stock par taille
})

const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchProducts()
})

// Watcher pour mettre à jour la prévisualisation
watch(editingProduct, () => {
  updatePreview()
}, { deep: true })

const updatePreview = () => {
  // Mettre à jour les données de la prévisualisation
  // en fonction des modifications du produit en cours d'édition
}

const validateForm = () => {
  errors.value = {};

  if (!editingProduct.value.name?.trim()) {
    errors.value.name = 'Le nom est requis';
  }
console.log('Form Data being validated')
  if (!editingProduct.value.price || editingProduct.value.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0';
  }

  if (!editingProduct.value.description?.trim()) {
    errors.value.description = 'La description est requise';
  }

  if (!editingProduct.value.category) {
    errors.value.category = 'La catégorie est requise';
  }

  if (!editingProduct.value.sizes.length) {
    errors.value.sizes = 'Au moins une taille doit être sélectionnée';
  }

  if (editingProduct.value.stock === undefined || editingProduct.value.stock < 0) {
    errors.value.stock = 'Le stock doit être un nombre positif'
  }

  return Object.keys(errors.value).length === 0
};

// Fonctions pour gérer les produits
const addProduct = async () => {
  if (!validateForm()) return;
  try {
    console.log('Product to be added:', JSON.stringify(editingProduct.value));
    await productStore.addProduct(editingProduct.value); // Soumet les données si valide
    resetForm(); // Réinitialise le formulaire après ajout réussi
    showPreview.value = false;
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
  }
};

const editProduct = (product) => {
  console.log('Editing product:', product) // Debug
  isEditing.value = true
  // Copie profonde du produit pour éviter les références
  editingProduct.value = JSON.parse(JSON.stringify(product))
  // Mise à jour de la prévisualisation d'image
  imagePreview.value = product.images[0]
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
};

const deleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const resetForm = () => {
  editingProduct.value = {
    id: '', // Réinitialisation de l'ID
    name: '',
    price: 0,
    description: '',
    images: [''],
    category: '',
    sizeStock: initializeSizeStock()
  }
  isEditing.value = false
  showPreview.value = false
  imagePreview.value = ''
  selectedFile.value = null
  errors.value = {}
}

// Gestion des images
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:3002/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    editingProduct.value.images.push(`http://localhost:3002${data.url}`);
    imagePreview.value = editingProduct.value.images[0];
  } catch (error) {
    console.error('Erreur upload:', error);
  }
};

const handleImageUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Format non supporté. Utilisez JPG, PNG ou GIF.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image trop volumineuse. Maximum 5MB.');
        continue;
      }
      await uploadImage(file);
    }
  }
};

const deleteImage = async (index: number) => {
  if (editingProduct.value.images[index]) {
    await productStore.deleteImage(editingProduct.value.images[index]);
    editingProduct.value.images.splice(index, 1);
    if (index === 0) {
      imagePreview.value = editingProduct.value.images[0] || '';
    }
  }
};

const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  const file = e.dataTransfer?.files[0];
  if (file?.type.startsWith('image/')) {
    selectedFile.value = file;
    await uploadImage(file);
  }
};

// Gestion du drag & drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

/// PREVIEW

const previewProduct = () => {
  if (validateForm()) {
    showPreview.value = true
  }
}


const categories = ['t-shirts', 'sweaters', 'pants', 'outerwear']
const availableSizes = ['S', 'M', 'L', 'XL', '44']

// Initialiser le stock pour chaque taille
const initializeSizeStock = () => {
  const stockObj = {}
  availableSizes.forEach(size => {
    stockObj[size] = 0
  })
  return stockObj
}
// Calcul du stock total
const getTotalStock = (product) => {
  return Object.values(product.sizeStock || {}).reduce((sum, stock) => sum + (stock || 0), 0)
}

// Fonction pour obtenir le statut du stock pour une taille
const getSizeStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Rupture', class: 'out-of-stock' }
  if (stock < 5) return { text: 'Stock bas', class: 'low-stock' }
  return { text: 'En stock', class: 'in-stock' }
}

</script>

<template>
  <div class="admin-page">
    <h1>Administration des Produits</h1>

    <!-- Formulaire d'ajout/modification -->
    <div class="product-form">
      <h2>{{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>

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
        <label>Images</label>
        <div class="image-upload">
          <input
              type="file"
              accept="image/*"
              multiple
              @change="handleImageUpload"
          >
          <div class="image-preview-container">
            <div
                v-for="(image, index) in editingProduct.images"
                :key="index"
                class="image-preview"
            >
              <img :src="image" :alt="`Image ${index + 1}`">
              <button @click="deleteImage(index)" class="delete-image">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ajoutez un bouton de prévisualisation -->
      <div class="form-actions">
        <button @click="previewProduct" class="preview">Prévisualiser</button>
        <!-- autres boutons... -->
      </div>

      <!-- Ajoutez la prévisualisation du produit -->
      <div v-if="showPreview" class="product-preview-overlay">
        <div class="product-preview">
          <h2>Prévisualisation du produit</h2>
          <div class="preview-content">
            <img :src="imagePreview" :alt="editingProduct.name">
            <div class="preview-details">
              <h3>{{ editingProduct.name }}</h3>
              <p class="price">{{ editingProduct.price }} €</p>
              <p class="description">{{ editingProduct.description }}</p>
              <div class="sizes-preview">
          <span v-for="size in editingProduct.sizes" :key="size" class="size-tag">
            {{ size }}
          </span>
              </div>
              <p class="category">Catégorie: {{ editingProduct.category }}</p>
            </div>
          </div>
          <div class="preview-actions">
            <button @click="showPreview = false">Retour à l'édition</button>
            <button @click="isEditing ? updateProduct() : addProduct()" class="primary">
              {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Catégorie</label>
        <select
            v-model="editingProduct.category"
            :class="{ 'error': errors.category }"
        >
          <option value="">Sélectionner une catégorie</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <div class="form-group">
        <label>Stock par taille</label>
        <div class="size-stock-grid">
          <div v-for="size in availableSizes" :key="size" class="size-stock-item">
            <span class="size-label">{{ size }}</span>
            <input
                type="number"
                v-model.number="editingProduct.sizeStock[size]"
                min="0"
                class="stock-input"
            >
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Stock</label>
        <input
            type="number"
            v-model="editingProduct.stock"
            min="0"
            :class="{ 'error': errors.stock }"
        >
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

    <div v-if="showPreview" class="product-preview-overlay">
      <div class="product-preview">
        <h2>Prévisualisation du produit</h2>
        <div class="preview-content">
          <img :src="editingProduct.images[0]" :alt="editingProduct.name">
          <div class="preview-details">
            <h3>{{ editingProduct.name }}</h3>
            <p class="price">{{ editingProduct.price }} €</p>
            <p class="description">{{ editingProduct.description }}</p>
            <div class="sizes-preview">
              <span v-for="size in editingProduct.sizes" :key="size" class="size-tag">
                {{ size }}
              </span>
            </div>
            <p class="category">Catégorie: {{ editingProduct.category }}</p>
          </div>
        </div>
        <div class="preview-actions">
          <button @click="showPreview = false">Retour à l'édition</button>
          <button @click="isEditing ? updateProduct() : addProduct()" class="primary">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
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
          <th>Catégorie</th>
          <th>Stock Par Taille</th>
          <th>Stock Total</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in productStore.products" :key="product.id">
          <td>
            <img :src="product.images[0]" :alt="product.name">
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }} €</td>
          <td>{{ product.category }}</td>
          <td>{{ product?.stock ?? 0 }}</td>
          <td>
            <div class="size-stock-list">
              <div v-for="size in availableSizes" :key="size"
                   class="size-stock-item">
                <span class="size-label">{{ size }}:</span>
                <span :class="getSizeStockStatus(product.sizeStock?.[size] || 0).class">
                {{ product.sizeStock?.[size] || 0 }}
              </span>
              </div>
            </div>
          </td>
          <td>{{ getTotalStock(product) }}</td>
          <td>
      <span :class="{
        'status-badge': true,
        'out-of-stock': !product?.stock || product.stock === 0,
        'low-stock': product?.stock > 0 && product.stock < 5,
        'in-stock': product?.stock >= 5
      }">
        {{
          !product?.stock || product.stock === 0 ? 'Rupture' :
              product.stock < 5 ? 'Stock bas' :
                  'En stock'
        }}
      </span>
          </td>
          <td>
            <button @click="editProduct(product)" class="edit">Modifier</button>
            <button @click="deleteProduct(product.id)" class="delete">Supprimer</button>
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

.sizes-checkboxes {
  display: flex;
  gap: 15px;
}

.sizes-checkboxes label {
  font-weight: normal;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

td img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 20px;
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

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  table {
    display: block;
    overflow-x: auto;
  }
}
.image-upload {
  border: 2px dashed #ddd;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.image-upload {
  border: 2px dashed #ddd;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.image-upload.dragging {
  border-color: #000;
  background: #f9f9f9;
}

.product-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.product-preview {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.preview-content {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.preview-content img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.preview-details {
  flex: 1;
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.preview-details {
  flex: 1;
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button.preview {
  background: #2196F3;
  color: white;
}

.sizes-preview {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}

.size-tag {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.size-stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.size-stock-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.size-label {
  font-weight: 500;
}

.stock-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.size-stock-list {
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

.out-of-stock { color: #dc2626; }
.low-stock { color: #d97706; }
.in-stock { color: #16a34a; }

.delete-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}.status-badge {
   padding: 4px 8px;
   border-radius: 4px;
   font-size: 12px;
   font-weight: 500;
 }



</style>