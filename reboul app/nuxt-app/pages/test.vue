<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'

const cart = useCartStore()

// Produit de test
const testProduct = {
  id: "1",
  name: "T-Shirt Premium",
  description: "T-Shirt en coton bio",
  price: 49.99,
  images: ["/images/tshirt-1.jpg"],
  category: "t-shirts",
  sizes: ["S", "M", "L", "XL"],
  inStock: true
}

// Fonction pour ajouter au panier
const addToCart = () => {
  cart.addToCart(testProduct, 1, "M")
  console.log("Article ajouté !", cart.items)
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-xl mb-4">Test du Panier</h1>

    <button
        @click="addToCart"
        class="bg-black text-white px-4 py-2 rounded"
    >
      Ajouter au panier
    </button>

    <div class="mt-4">
      <p>Nombre d'articles dans le panier : {{ cart.totalItems }}</p>
      <p>Total : {{ cart.totalPrice }}€</p>
    </div>
  </div>
</template>