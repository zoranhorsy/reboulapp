<script setup lang="ts">

import BrandContainer from "~/composant/BrandContainer.vue";
</script>

<template>
  <section>
<div class="containerS">
  <h1>Produits</h1>
  <h3>Categories</h3>
</div>
    <div class="flex-auto">
      <BrandContainer />
   </div>
  </section>
</template>

<style scoped>
.containerS {
  width: 100%;
  height: 558px;
  flex-wrap: wrap;
  border-radius: 20px;
  background: #1D1D1D;
  background: color(display-p3 0.112 0.112 0.112);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: Inter, sans-serif;
}
h1 {
  color: #ffffff;
  padding: 16px;
  font-weight: 200;
  margin: 8px;
}
h3 {
  color: #ffffff;
  padding: 14px;
  font-weight: 200;
  margin: 8px;
}
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>