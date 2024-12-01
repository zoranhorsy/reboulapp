<script setup lang="ts">

</script>

<template>

<div class="containerNews">
  <h1>JOIN OUR NEWSLETTERS</h1>
  <p>Get early access to new drops, exclusive releases, and member-only benefits.</p>
  <div class="inputform">
  <input placeholder="Your E-mail"  />
    <div class="subbutton"><h2>Subscribe</h2></div>
  </div>
</div>
</template>

<style scoped>

.containerNews {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 380px;
  background: #1D1D1D;
}
.containerNews:hover, .subbutton:hover { animation: pulse 2s; }
h1 {
  color: white;
  text-align: center;
  font-family: Inter, sans-serif;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}
p {
  color: white;
  text-align: center;
  font-family: Inter, sans-serif;
  font-weight: 400;
  margin-top: 10px;

}
input {
  margin-top: 30px;
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  padding: 5px 20px;
  background-color: transparent;
  border-bottom: 1px solid white;
  color: white;
}
.inputform {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.subbutton {
  margin-top: 30px;
  background-color: transparent;
  border: white 1px solid;
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
h2 {
  color: white;
  text-align: center;
  font-family: Inter, sans-serif;
  font-weight: 400;
  justify-content: center;
  font-size: 18px;
}
</style>