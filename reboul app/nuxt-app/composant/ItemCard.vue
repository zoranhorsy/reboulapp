<script setup lang="ts">

</script>

<template>
  <body class="colcontainer sm:w-1/2">
      <div class="cardcontainer">
        <div class="infoscard"></div>
  </div>
      <div class="cardcontainer">
        <div class="infoscard"></div>
      </div>
      <div class="cardcontainer">
        <div class="infoscard"></div>
      </div>

  </body>
</template>

<style scoped>
.colcontainer {
  background-color: none;
  height: 100%;
  margin: 1px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;

}
.cardcontainer {
  display: flex;
  background-color: #d8d7d7;
  width: 250px;
  height: 400px;
  border-radius: 5px 5px 0 0;
  box-shadow: 2px 2px 4px #d8d7d7;
}
.infoscard {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  top: 320px;
  background-color: #1D1D1D;
  width: 100%;
  height: 20%;
  border-radius: 0 0 5px 5px;
}
</style>