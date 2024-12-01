<script setup lang="ts">
import { useToastStore } from '~/stores/useToastStore'

const toastStore = useToastStore()
</script>

<template>
  <div class="toast-container">
    <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="['toast', toast.type]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style>
.toast-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 50;
}

.toast {
  margin-bottom: 8px;
  padding: 16px;
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  border: none;
}

.toast.success {
  background-color: #000;
  color: white;
}

.toast.error {
  background-color: #000;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>