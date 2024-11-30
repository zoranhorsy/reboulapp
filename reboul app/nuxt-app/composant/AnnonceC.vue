<script setup lang="ts">
import 'animate.css';
const blurAmount = ref(0.7);
const isHovered = ref(false);
const Titre = "REBOULSTORE2.0"
</script>

<template>
  <body>
<div
    :style="{ filter: isHovered ? `blur(${blurAmount}px)` : 'blur(0)', transition: 'all 300ms ease' }"
     @mouseenter="isHovered = true"
     @mouseleave="isHovered = false"
     class="container1">
  <h1 :style="{ padding: '10px' }" >REBOUL STORE 2.0</h1>
  <p class="description">Curating the finest in technical sportswear and contemporary urban design from Stone Island and CP Company.</p>
  <NuxtLink to="/products">
  <div class="Shopbutton">
    <p class="textb">Shop Now</p>
    <img class="arrow" src="public/Arrow 1.svg">
  </div>
  </NuxtLink>
</div>
  </body>
</template>

<style scoped>
body {
  position: relative;

}
.container1 {
  padding: 30px;
  height: 450px;
  background-image: url("public/Publicity1.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.Shopbutton:hover { animation: pulse 2s infinite; }

h1 {
  color: white;
  font-size: 40px;
  font-family: Inter, sans-serif;
  font-weight: 300;
  position: relative;
  top: 50px;
}
.description {
  color: white;
  font-family: Inter, sans-serif;
  font-weight: 300;
  position: relative;
  top: 50px;
  display: flex;
  line-height: 2;
  text-decoration: none;
  padding: 10px;
}
.Shopbutton {
  position: relative;
  display: flex;
  top: 50px;
  text-align: center;
  border: solid white;
  width: 165px;
  height: fit-content;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  float: left;
}
.textb {
  color: white;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter, sans-serif;
  height: 40px;
}
.arrow {
   display: flex;
  padding: 10px;
}

</style>