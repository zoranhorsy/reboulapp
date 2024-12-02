<script setup>
const categories = ref([
  { id: 1, name: 'T-shirts', slug: 't-shirts' },
  { id: 2, name: 'Sweaters', slug: 'sweaters' },
  { id: 3, name: 'Pants', slug: 'pants' },
  { id: 4, name: 'Outerwear', slug: 'outerwear' }
])

const newCategory = ref('')
const editingCategory = ref(null)
const searchQuery = ref('')

const filteredCategories = computed(() => {
  return categories.value.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const addCategory = () => {
  if (!newCategory.value.trim()) return

  const slug = newCategory.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

  categories.value.push({
    id: Date.now(),
    name: newCategory.value,
    slug
  })
  newCategory.value = ''
}

const startEdit = (category) => {
  editingCategory.value = { ...category }
}

const saveEdit = () => {
  const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
  if (index !== -1) {
    categories.value[index] = {
      ...editingCategory.value,
      slug: editingCategory.value.name.toLowerCase().replace(/\s+/g, '-')
    }
  }
  editingCategory.value = null
}

const deleteCategory = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}

const toggleCategory = (category) => {
  emit('update:modelValue', [category])
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

</script>

<template>
  <div class="categories-manager">
    <div class="add-category">
      <input
          v-model="newCategory"
          @keyup.enter="addCategory"
          placeholder="Nouvelle catégorie..."
          class="category-input"
      >
      <button @click="addCategory" class="add-btn">Ajouter</button>
    </div>

    <input
        v-model="searchQuery"
        placeholder="Rechercher une catégorie..."
        class="search-input"
    >

    <div class="categories-list">
      <div v-for="category in filteredCategories"
           :key="category.id"
           class="category-item"
           :class="{ 'selected': modelValue.includes(category) }"
           @click="toggleCategory(category)">
        <span>{{ category.name }}</span>
        <div class="actions" @click.stop>
          <button @click="startEdit(category)" class="edit-btn">✎</button>
          <button @click="deleteCategory(category.id)" class="delete-btn">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-manager {
  @apply w-full max-w-md mx-auto p-4;
}

.add-category, .search-input {
  @apply mb-4;
}

.category-input, .search-input, .edit-input {
  @apply w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.add-btn {
  @apply mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
  transition-colors w-full;
}

.category-item {
  @apply flex items-center justify-between p-3 border rounded-lg mb-2 bg-white;
}

.actions {
  @apply flex gap-2;
}

.edit-btn, .delete-btn, .save-btn, .cancel-btn {
  @apply p-1 rounded-full w-8 h-8 flex items-center justify-center transition-colors;
}

.edit-btn {
  @apply text-blue-500 hover:bg-blue-100;
}

.delete-btn {
  @apply text-red-500 hover:bg-red-100;
}

.save-btn {
  @apply text-green-500 hover:bg-green-100;
}

.cancel-btn {
  @apply text-gray-500 hover:bg-gray-100;
}

.category-item {
  @apply flex items-center justify-between p-3 border rounded-lg mb-2 bg-white
  cursor-pointer hover:bg-gray-100 transition-colors;
}

.category-item.selected {
  @apply bg-blue-500 text-white;
}

.category-item.selected .actions button {
  @apply text-white hover:bg-blue-600;
}
</style>