<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/useCartStore'
import CartIcon from "~/composant/assets/CartIcon.vue"

const cart = useCartStore()
const isMenuOpen = ref(false)
const headerOpacity = ref(1)
const isDragging = ref(false)
let startY = 0
let currentY = 0

const handleScroll = () => {
  const scrollPosition = window.scrollY
  headerOpacity.value = Math.max(0.7, 1 - scrollPosition / 200)
}

const handleTouchStart = (e: TouchEvent) => {
  if (isMenuOpen.value) {
    isDragging.value = true
    startY = e.touches[0].clientY
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (isDragging.value) {
    currentY = e.touches[0].clientY - startY
    if (currentY < 0) currentY = 0
    if (currentY > 300) {
      closeMenu()
      return
    }
    const menu = document.querySelector('.menu') as HTMLElement
    if (menu) {
      menu.style.transform = `translateY(${currentY}px)`
    }
  }
}

const handleTouchEnd = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (currentY > 100) {
      closeMenu()
    } else {
      const menu = document.querySelector('.menu') as HTMLElement
      if (menu) {
        menu.style.transform = 'translateY(0)'
      }
    }
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  const menu = document.querySelector('.menu') as HTMLElement
  if (menu) {
    menu.style.transform = ''
  }
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

      <NuxtLink to="/cart" class="cart-link">
        <CartIcon />
        <span v-if="cart.totalItems" class="cart-count">{{ cart.totalItems }}</span>
      </NuxtLink>
    </div>
  </header>

  <!-- Bottom Sheet Menu -->
  <div
      v-if="isMenuOpen"
      class="menu-overlay"
      @click="closeMenu"
  ></div>

  <nav
      class="menu"
      :class="{ 'menu-open': isMenuOpen }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <div class="menu-handle"></div>
    <div class="menu-content">
      <NuxtLink @click="closeMenu" to="/products" class="menu-item">Reboul Adultes</NuxtLink>
      <NuxtLink @click="closeMenu" to="/admin/products" class="menu-item">ADMIN</NuxtLink>
      <NuxtLink @click="closeMenu" to="/cart" class="menu-item">MON PANIER</NuxtLink>
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
  background-color: white;
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
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bottom Sheet Menu Styles */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 60;
}

.menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 70;
  touch-action: none;
}

.menu-handle {
  width: 36px;
  height: 4px;
  background-color: #ddd;
  border-radius: 2px;
  margin: 12px auto;
}

.menu-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #f5f5f5;
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
</style>