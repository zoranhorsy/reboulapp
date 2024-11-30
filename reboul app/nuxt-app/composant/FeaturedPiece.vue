<script setup lang="ts">
import 'animate.css';
</script>

<template>
<div class="piececontainer">
  <h1>
    FEATURED PIECE
  </h1>
  <div class="cardcontainer">
<div class="card1">

<div class="blackcard">
  <div class="text">
  <p>Stone Island Shadow Project Jacket</p>
  <p>Outerwear</p>
  <p>1800$</p> </div>
</div>
</div>
<div class="card1">
<div class="blackcard">
  <div class="text">
  <p>Stone Island Shadow Project Jacket</p>
  <p>Outerwear</p>
  <p>1800$</p> </div>
</div>
</div>
  </div>
</div>
</template>

<style scoped>
.piececontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.cardcontainer {
  margin: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
h1 {
  font-family: Inter, sans-serif;
  font-size: 25px;
  font-weight: 400;
}
.card1 {
  display: flex;
  width: 250px;
  height: 350px;
  background-color: #d8d7d7;
  background-image: url("public/itemplaceholder.png");
  background-size: contain;
  background-position: center;
  border-radius: 10px;
}
.blackcard {
  width: 100%;
  height: 80px;
  background-color: #1D1D1D;
  top: 300px;
  position: relative;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: column;
}
p {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 100;
  text-align: center;
  color: white;
}
.card1:hover, .card2:hover, .card3:hover, .card4:hover, .card5:hover, .card6:hover, .card7:hover, .card8:hover {
  animation: pulse 2s;
}
.text {
  margin-top: 7px;
}
</style>