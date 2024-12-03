<script setup lang="ts">
defineProps<{
  show: boolean
  product: any
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click="emit('close')">
      <div class="modal-wrapper">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="emit('close')">
            <Icon name="ph:x" class="w-6 h-6" />
          </button>

          <div class="grid grid-cols-2 gap-8">
            <div class="image-section">
              <img
                  :src="product.images[0] || '/placeholder.png'"
                  :alt="product.name"
                  class="preview-image"
              >
            </div>

            <div class="content-section">
             <span
                 :class="['status-badge', product.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600']"
             >
               {{ product.status === 'draft' ? 'Brouillon' : 'Publié' }}
             </span>

              <h2>{{ product.name }}</h2>
              <p class="price">{{ product.price }}€</p>
              <p class="description">{{ product.description }}</p>

              <div class="stock-grid">
                <div v-for="(stock, size) in product.sizeStock" :key="size" class="stock-item">
                  <span class="size">{{ size }}</span>
                  <span class="stock-count">{{ stock || 0 }}</span>
                </div>
              </div>

              <div class="categories" v-if="product.categories?.length">
               <span v-for="cat in product.categories" :key="cat.id" class="category-tag">
                 {{ cat.name }}
               </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4;
}

.modal-wrapper {
  @apply relative max-w-5xl w-full;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-xl overflow-hidden relative;
}

.close-btn {
  @apply absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10;
}

.image-section {
  @apply h-[500px] bg-gray-50;
}

.preview-image {
  @apply w-full h-full object-contain;
}

.content-section {
  @apply p-8 flex flex-col gap-4;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium w-fit;
}

h2 {
  @apply text-2xl font-medium mt-2;
}

.price {
  @apply text-xl font-medium text-blue-600;
}

.description {
  @apply text-gray-600 leading-relaxed;
}

.stock-grid {
  @apply grid grid-cols-3 gap-3 mt-4;
}

.stock-item {
  @apply flex flex-col gap-1 bg-gray-50 p-3 rounded-lg text-center;
}

.size {
  @apply text-sm font-medium;
}

.stock-count {
  @apply text-gray-600;
}

.categories {
  @apply flex flex-wrap gap-2 mt-4;
}

.category-tag {
  @apply bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600;
}

@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .image-section {
    height: 300px;
  }

  .content-section {
    padding: 20px;
  }
}

.fade-enter-active, .fade-leave-active {
  @apply transition-opacity duration-200;
}
.fade-enter-from, .fade-leave-to {
  @apply opacity-0;
}
</style>