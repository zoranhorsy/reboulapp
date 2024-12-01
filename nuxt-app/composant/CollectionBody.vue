<script setup lang="ts">
import 'animate.css';
const magasin1 = "Reboul Store"
const magasin2 = "Les Minots"
const magasin3 = "Utility Shop"
const showElement = ref();
const hideElement = ref(false);

</script>

<template>
<body>
  <section>
<div class="cardGrid">

    <NuxtLink to="/products">
  <div class="card-img3">
    <p :style="{ textTransform: 'uppercase', fontSize: '18px' }"
    v-show="showElement">
                            {{ magasin1 }}
    </p>
  </div>                                                                  </NuxtLink>
  <div class="card-img3">
      <p :style="{ textTransform: 'uppercase', fontSize: '18px' }"
      v-if="hideElement">
                                {{ magasin2 }}
          </p>
    </div>
  <div class="card-img3">
    <p :style="{ textTransform: 'uppercase', fontSize: '18px' }"
    v-if="hideElement">
                                    {{ magasin3 }}
    </p>
    </div>

  <div class="card-img3">
    <p :style="{ textTransform: 'uppercase', fontSize: '18px' }"
       v-if="hideElement">
      {{ magasin3 }}
    </p>
  </div>
</div>
  </section>
</body>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
   }
h1 {
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 2rem;
  font-weight: 200;
}

.cardGrid {
  display: flex;
  flex-direction: row;
  flex-shrink: 1;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 50px;
  height: auto;

}

.card-img3 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  background-image: url("public/imagearrivals.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px 5px 5px 5px;
  box-shadow: rgba(23, 23, 23, 0.57) 0px 0px 4px 0px;
}

.card-img3:hover {
  animation: pulse 1.5s;
}
p {
  display: flex;
  flex-direction: row;
  font-family: Inter, sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  justify-content: center;
  color: white;
}



</style>