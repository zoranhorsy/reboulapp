<template>
  <div>
    <Header />
    <main>
      <slot />
    </main>
  </div>
</template>







<script setup lang="ts">
import Header from "~/composant/Header.vue";
</script>