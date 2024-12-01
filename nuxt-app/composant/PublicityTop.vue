<script setup lang="ts">

const textStyle = ref({
  color : "#ffffff",
  fontSize : "20px",
  fontWeight : "400",
  padding : "20px",
  position : "relative",
  top : "20px",
});
</script>

<template>
  <div class="publicity-top">
  <div class="top">
    <div :style="textStyle">
      NEW ARRIVALS - SALOMON XT SLATE
    </div>
  </div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  flex-direction: row;
  border-radius: 15px;
  height: 120px;
  width: 100%;
  box-shadow: 0px 0px 0px 0px black;
  background-image: url("public/salomon.png");
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  object-fit: cover;
}
.publicity-top {
  display: flex;
  flex-direction: row;
  border-radius: 15px;
  width: 100%;
  height: 100%;
}

</style>