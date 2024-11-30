<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'

const cart = useCartStore()

const removeItem = (productId: string, size: string) => {
  cart.removeFromCart(productId, size)
}

// Correction de la fonction formatPrice pour gérer les valeurs undefined/null
const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '0.00 €'
  return Number(price).toFixed(2) + ' €'
}

const promoInput = ref('')

const applyPromo = () => {
  if (promoInput.value) {
    cart.applyPromoCode(promoInput.value.toUpperCase())
    promoInput.value = ''
  }
}

const updateQuantity = (productId: string, size: string, quantity: number) => {
  cart.updateQuantity(productId, size, quantity)
}

// Modification du produit test pour s'assurer que le prix est un nombre
const testAddItem = () => {
  const testProduct = {
    id: "test1",
    name: "Produit Test",
    price: Number(29.99), // Conversion explicite en nombre
    images: ["/placeholder.jpg"],
    sizes: ["M"],
    inStock: true
  }
  cart.addToCart(testProduct, 1, "M")
}
</script>

<template>
  <div class="cart-container">
    <h1>Mon Panier</h1>

    <!-- Si le panier est vide -->
    <div v-if="cart.items.length === 0" class="empty-cart">
      <h2>Votre panier est vide</h2>
      <NuxtLink to="/products" class="continue-shopping">
        Continuer mes achats
      </NuxtLink>
      <div>
        <button @click="testAddItem" class="test-button">
          Ajouter un produit test
        </button>
      </div>
    </div>

    <!-- Si le panier contient des articles -->
    <div v-else class="cart-content">
      <!-- Liste des articles -->
      <div class="cart-items">
        <div v-for="item in cart.items" :key="`${item.product.id}-${item.size}`" class="cart-item">
          <img :src="item.product.images[0]" :alt="item.product.name">

          <div class="item-details">
            <h3>{{ item.product.name }}</h3>
            <p class="size">Taille: {{ item.size }}</p>
            <p class="price">{{ formatPrice(item.product.price) }}</p>

            <div class="item-actions">
              <select
                  v-model="item.quantity"
                  @change="updateQuantity(item.product.id, item.size, item.quantity)"
              >
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>

              <button @click="removeItem(item.product.id, item.size)" class="remove-button">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Récapitulatif de commande -->
      <div class="order-summary">
        <h2>Récapitulatif</h2>

        <!-- Section code promo -->
        <div class="promo-section">
          <div class="promo-input">
            <input
                type="text"
                v-model="promoInput"
                placeholder="Code promo"
            >
            <button @click="applyPromo">Appliquer</button>
          </div>

          <div v-if="cart.promoDiscount > 0" class="promo-applied">
            <div class="promo-details">
              <span>Réduction ({{ cart.promoDiscount }}%)</span>
              <span>-{{ formatPrice(cart.discountAmount) }}</span>
            </div>
            <button @click="cart.removePromoCode" class="remove-promo">
              Retirer le code
            </button>
          </div>
        </div>

        <div class="price-summary">
          <div class="price-row">
            <span>Sous-total</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <div class="price-row">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
        </div>

        <div class="total-row">
          <span>Total</span>
          <span>{{ formatPrice(cart.finalPrice) }}</span>
        </div>

        <button class="checkout-button">
          Procéder au paiement
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.cart-container {
  margin: 0;
  padding: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 100px;
}

.cart-container h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  padding: 48px 0;
}

.empty-cart h2 {
  font-size: 20px;
  color: #666;
  margin-bottom: 16px;
}

.continue-shopping {
  display: inline-block;
  background: #000;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
}

.test-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.cart-item img {
  width: 96px;
  height: 96px;
  object-fit: cover;
}

.item-details {
  flex-grow: 1;
}

.item-details h3 {
  font-weight: bold;
  margin-bottom: 8px;
}

.size {
  color: #666;
  margin-bottom: 4px;
}

.item-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.item-actions select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-button {
  color: red;
  border: none;
  background: none;
  cursor: pointer;
}

.order-summary {
  background: #f5f5f5;
  padding: 24px;
  border-radius: 8px;
  height: fit-content;
}

.order-summary h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.price-summary {
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-top: 1px solid #ddd;
  padding-top: 16px;
  margin: 16px 0;
}

.checkout-button {
  width: 100%;
  padding: 12px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.checkout-button:hover {
  background: #333;
}

/* Styles existants pour la section promo */
.promo-section {
  margin: 20px 0;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.promo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.promo-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.promo-input button {
  padding: 8px 16px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.promo-applied {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.promo-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.remove-promo {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}
</style>