<script setup>
import {ref} from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const images = ref(props.modelValue)
watch (() => props.modelValue, (newVal) => {
  images.value = newVal
})

const emit = defineEmits(['update:modelValue'])
const isDragging = ref(false)

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  handleFile(file)
}

const handleFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImages = [...props.modelValue, e.target.result]
      emit('update:modelValue', newImages)
    }
    reader.readAsDataURL(file)
  }
}

const handleDeleteImage = (index) => {
  images.value = images.value.filter((_, i) => i !== index)
  emit('update:modelValue', images.value)
}

// Remplacer
// @click.prevent="removeImage(index)"
// par
// @click="handleDeleteImage(index)"
</script>

<template>
  <div
      :class="['upload-container', { 'is-dragging': isDragging }]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
  >
    <input
        type="file"
        class="upload-input"
        @change="e => handleFile(e.target.files[0])"
        accept="image/*"
    />

    <div v-if="modelValue.length" class="images-grid">
      <div v-for="(img, index) in modelValue" :key="index" class="image-wrapper">
        <img :src="img" alt="Aperçu" class="preview-image">
        <button
            type="button"
            class="delete-btn"
            @click="handleDeleteImage(index)"
        >
          ×
        </button>
      </div>
    </div>
    <div v-else class="upload-content">
      <span class="upload-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
      </span>
      <p class="upload-text">Glissez une image ou cliquez pour sélectionner</p>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  @apply relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-200;
}

.is-dragging {
  @apply border-blue-500 bg-blue-50;
}

.upload-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
  z-index: 1;
}
.delete-btn {
  @apply absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white;
  z-index: 2;
}

.images-grid {
  @apply w-full h-full p-2 grid grid-cols-4 gap-2 overflow-auto;
}

.image-wrapper {
  @apply relative h-24;
}

.preview-image {
  @apply w-full h-full object-cover rounded-lg;
  pointer-events: none;
}

.delete-btn {
  @apply absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white
  hover:bg-red-600 transition-colors flex items-center justify-center text-xl font-bold;
}

.upload-content {
  @apply absolute inset-0 flex flex-col items-center justify-center text-gray-500;
}

.upload-icon {
  @apply mb-2;
}

.upload-text {
  @apply text-sm;
}
</style>