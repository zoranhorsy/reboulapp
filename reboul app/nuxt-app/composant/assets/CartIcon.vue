<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'

const cart = useCartStore()
const itemCount = computed(() => cart.totalItems)


console.log('Items:', cart.items)
console.log('Total:', cart.totalItems)
</script>

<template>
  <div class="carticon">
      <!--    Icone panier-->
    <span class="text-2xl text-black">
      <img src="public/cart.svg" alt="logo" :style="{ width: '30px' }" >
    </span>
    <!-- Badge - simplifié -->

  </div>
</template>

<style scoped>
.badge {
  position: relative;
  top: -15px;
  right: 10px;
  color: white;
  border-radius: 10px;
  min-width: 10px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
background-color: #df1d1d;
  padding: 5px;
  font-size: 0.9rem;
}

.carticon {
  position: relative;
  display: inline-flex;
}
</style>