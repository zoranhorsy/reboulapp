<script setup lang="ts">
import { useCartStore } from '~/stores/useCartStore'

const cart = useCartStore()

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '0.00 €'
  return Number(price).toFixed(2) + ' €'
}

const removeItem = (productId: string, size: string) => {
  cart.removeFromCart(productId, size)
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
</script>

<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>Mon Panier</h1>
      <p v-if="cart.totalItems > 0" class="items-count">{{ cart.totalItems }} articles</p>
    </div>

    <div v-if="cart.items.length === 0" class="empty-state">
      <p>Votre panier est vide</p>
      <NuxtLink to="/products" class="continue-shopping">
        Continuer mes achats
      </NuxtLink>
    </div>

    <template v-else>
      <div class="cart-items">
        <div v-for="item in cart.items"
             :key="`${item.product.id}-${item.size}`"
             class="cart-item">
          <img :src="item.product.images[0]"
               :alt="item.product.name"
               class="item-image">

          <div class="item-content">
            <div class="item-info">
              <h3>{{ item.product.name }}</h3>
              <p class="size">Taille: {{ item.size }}</p>
              <p class="price">{{ formatPrice(item.product.price) }}</p>
            </div>

            <div class="item-controls">
              <div class="quantity-selector">
                <button @click="updateQuantity(item.product.id, item.size, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="quantity-btn">
                  －
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQuantity(item.product.id, item.size, item.quantity + 1)"
                        class="quantity-btn">
                  ＋
                </button>
              </div>
              <button @click="removeItem(item.product.id, item.size)"
                      class="remove-btn">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="promo-section">
        <div class="promo-input">
          <input type="text"
                 v-model="promoInput"
                 placeholder="Code promo"
                 class="promo-field">
          <button @click="applyPromo"
                  class="apply-btn"
                  :disabled="!promoInput">
            Appliquer
          </button>
        </div>

        <div v-if="cart.promoDiscount > 0" class="active-promo">
          <div class="promo-info">
            <span>Réduction ({{ cart.promoDiscount }}%)</span>
            <span>-{{ formatPrice(cart.discountAmount) }}</span>
          </div>
          <button @click="cart.removePromoCode" class="remove-promo">
            Retirer
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Sous-total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <div class="summary-row">
          <span>Livraison</span>
          <span>Gratuite</span>
        </div>
        <div class="total-row">
          <span>Total</span>
          <span>{{ formatPrice(cart.finalPrice) }}</span>
        </div>
      </div>

      <NuxtLink to="/checkout" class="checkout-btn">
        Procéder au paiement
      </NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.cart-page {
  padding: calc(70px + 1rem) 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #F2F2F7;
}

.cart-header {
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1rem;
}

.cart-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.items-count {
  color: #666;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background: white;
  border-radius: 1rem;
}

.continue-shopping {
  display: inline-block;
  background: black;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
  font-weight: 500;
  text-decoration: none;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.cart-item {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.75rem;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-info h3 {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.size {
  color: #666;
  font-size: 0.9rem;
}

.price {
  font-weight: 500;
  margin-top: 0.25rem;
}

.item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #F2F2F7;
  padding: 0.25rem;
  border-radius: 0.75rem;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  border: none;
  background: white;
  color: black;
  font-size: 1rem;
  display: grid;
  place-items: center;
}

.quantity-btn:disabled {
  opacity: 0.5;
}

.remove-btn {
  color: #FF3B30;
  background: none;
  border: none;
  font-size: 0.9rem;
  padding: 0.5rem;
  margin: -0.5rem;
}

.promo-section {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.promo-input {
  display: flex;
  gap: 0.75rem;
}

.promo-field {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #E5E5EA;
  border-radius: 0.75rem;
  background: #F2F2F7;
  font-size: 0.9rem;
}

.apply-btn {
  padding: 0.75rem 1rem;
  background: black;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
}

.apply-btn:disabled {
  opacity: 0.5;
}

.active-promo {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E5EA;
}

.promo-info {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.remove-promo {
  color: #FF3B30;
  background: none;
  border: none;
  font-size: 0.8rem;
  padding: 0;
}

.cart-summary {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #E5E5EA;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: black;
  color: white;
  text-align: center;
  border-radius: 1rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 2rem;
}

@supports (padding: max(0px)) {
  .cart-page {
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }
}
</style>