<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/useCartStore'
import CartIcon from "~/composant/assets/CartIcon.vue"

const cart = useCartStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const headerOpacity = ref(1)
const isDragging = ref(false)
let startY = 0
let currentY = 0

const handleScroll = () => {
  const scrollPosition = window.scrollY
  headerOpacity.value = Math.max(0.7, 1 - scrollPosition / 200)
}

const toggleCart = () => {
  if (isCartOpen.value) {
    const sheet = document.querySelector('.cart-sheet')
    sheet?.classList.add('closing')
    setTimeout(() => {
      isCartOpen.value = false
      sheet?.classList.remove('closing')
    }, 200)
  } else {
    isCartOpen.value = true
  }
}

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '0.00 €'
  return Number(price).toFixed(2) + ' €'
}

const updateQuantity = (productId: string, size: string, quantity: number) => {
  cart.updateQuantity(productId, size, quantity)
}

const removeItem = (productId: string, size: string) => {
  cart.removeFromCart(productId, size)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header" :style="{
    backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  }">
    <div class="headergroup">
      <NuxtLink to="/">
        <nuxt-img src="/logo_black.png" alt="logo" class="logo" format="webp" />
      </NuxtLink>
      <nuxt-img src="/TYPO.svg" alt="logo" class="typo" />
    </div>

    <div class="right-section">
      <button class="menu-button" @click="isMenuOpen = !isMenuOpen">
        <div class="burger" :class="{ 'open': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <button @click="toggleCart" class="cart-link">
        <CartIcon />
        <span v-if="cart.totalItems" class="cart-count">{{ cart.totalItems }}</span>
      </button>
    </div>
  </header>

  <!-- Cart Modal -->
  <div v-show="isCartOpen" class="cart-modal">
    <div class="cart-backdrop" @click="toggleCart"></div>
    <div class="cart-sheet">
      <div class="cart-handle"></div>

      <div class="cart-content">
        <div class="cart-header">
          <h2>Mon Panier</h2>
          <button @click="toggleCart" class="close-btn">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" fill="none" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div v-if="!cart.items.length" class="empty-cart">
          <p>Votre panier est vide</p>
          <button @click="toggleCart" class="continue-btn">Continuer mes achats</button>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cart.items" :key="`${item.product.id}-${item.size}`" class="cart-item">
            <img :src="item.product.images[0]" :alt="item.product.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.product.name }}</h3>
              <p class="size">Taille: {{ item.size }}</p>
              <p class="price">{{ formatPrice(item.product.price) }}</p>

              <div class="item-actions">
                <div class="quantity-control">
                  <button @click="updateQuantity(item.product.id, item.size, item.quantity - 1)"
                          :disabled="item.quantity <= 1">－</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.product.id, item.size, item.quantity + 1)">＋</button>
                </div>
                <button @click="removeItem(item.product.id, item.size)" class="remove-btn">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cart.items.length" class="cart-footer">
        <div class="total">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <NuxtLink to="/checkout" class="checkout-btn" @click="toggleCart">
          Commander
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Menu -->
  <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>
  <nav class="menu" :class="{ 'menu-open': isMenuOpen }">
    <div class="menu-handle"></div>
    <div class="menu-content">
      <NuxtLink @click="isMenuOpen = false" to="/products" class="menu-item">Reboul Adultes</NuxtLink>
      <NuxtLink @click="isMenuOpen = false" to="/admin/products" class="menu-item">ADMIN</NuxtLink>
      <button @click="isMenuOpen = false; toggleCart()" class="menu-item">MON PANIER</button>
    </div>
  </nav>
</template>

<style scoped>
.header {
  height: 70px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 50;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.headergroup {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  width: 60px;
  height: auto;
}

.typo {
  height: 25px;
  width: 200px;
}

.menu-button {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
}

.burger span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #333;
  margin-bottom: 6px;
  transition: all 0.3s;
}

.burger.open span:first-child {
  transform: rotate(45deg) translate(6px, 6px);
}

.burger.open span:nth-child(2) {
  opacity: 0;
}

.burger.open span:last-child {
  transform: rotate(-45deg) translate(6px, -6px);
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  top: -5px;
  border: none;
  background: none;
  cursor: pointer;
}

.menu {
  position: fixed;
  padding: 10px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px 24px 0 0;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 70;
  box-shadow: 0 -5px 40px rgba(0, 0, 0, 0.1);

}

.menu-handle {
  width: 36px;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  margin: 12px auto;
}

.menu-content {
  padding: 8px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  all: unset;
  font-size: 17px;
  font-weight: 500;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.04);
  color: #000;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  width: calc(100% - 32px);
}

.menu-item:active {
  background: rgba(0, 0, 0, 0.08);
}

.menu.menu-open {
  transform: translateY(0);
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 60;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #FF3B30;
  color: white;
  font-size: 11px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu.menu-open {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .header {
    padding: 0 12px;
  }

  .typo {
    width: 200px;
    height: 18px;
  }

  .logo {
    width: 60px;
  }
}

.cart-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.cart-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

}

.cart-sheet {
  display: flex;
  position: fixed;
  right: 10px;
  top: 10px;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  max-height: 650px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  overflow: scroll;
  border-radius: 10px;
  padding: 10px;
}


.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  -webkit-overflow-scrolling: touch;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cart-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  padding: 8px;
  margin: -8px;
  border: none;
  background: none;
}

.close-icon {
  width: 24px;
  height: 24px;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.continue-btn {
  margin-top: 16px;
  padding: 12px 24px;
  background: black;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
}

.cart-items {
  padding: 16px 0;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-weight: 600;
  margin-bottom: 4px;
}

.size {
  color: #666;
  font-size: 14px;
}

.price {
  font-weight: 500;
  margin: 8px 0;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 8px;
}

.quantity-control button {
  border: none;
  background: none;
  font-size: 16px;
  padding: 4px 8px;
  color: #666;
}

.quantity-control button:disabled {
  opacity: 0.5;
}

.remove-btn {
  color: #ff3b30;
  border: none;
  background: none;
  font-size: 14px;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 16px;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 16px;
  background: black;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .cart-sheet {
    max-width: none;
  }
}

/* Ajustez ces styles dans le fichier existant */

.cart-sheet {
  /* ... styles existants ... */
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-sheet.closing {
  animation: slideOut 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff3b30;
  width: 18px;
  height: 18px;
  font-size: 11px;
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

</style>