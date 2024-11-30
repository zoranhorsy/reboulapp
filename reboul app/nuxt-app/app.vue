<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
<ToastContainer />
</template>
<style scoped>
</style>

<script setup lang="ts">
import { useCartStore } from "~/stores/useCartStore";
const cart = useCartStore();


// Charger le panier au démarrage
onMounted(() => {
  cart.loadFromLocalStorage()
})


import {useFavicon} from "@vueuse/core";
import ToastContainer from "~/composant/assets/ToastContainer.vue";
const icon = useFavicon();
icon.value = "logo_black.png";


</script>

