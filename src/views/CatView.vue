import CatsView from './CatsView.vue';
<template>
  <div class="content-wrapper">
    <header>
      <img
        class="cat-avatar"
        :src="`../src/assets/images/cat-avatar_` + catsStore.state.currentCat.avatar + `.webp`"
        alt="cat avatar"
      />
      <h1>{{ catsStore.state.currentCat.name }}</h1>
    </header>
    <div class="cat-content">
      <p>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }}</p>
      <p>{{ catsStore.state.currentCat.food_info }}</p>
      <p>{{ catsStore.state.currentCat.health_info }}</p>
      <p>{{ catsStore.state.currentCat.behaviour_info }}</p>
    </div>
  </div>
</template>

<script setup>
import { useCatsStore } from '../stores/useCatsStore'
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'

const route = useRoute()
const catsStore = useCatsStore()
catsStore.state.currentCat.id = route.params.id

// function fetchCat() {
// let id = catId;
// const {error, data } =

// }

onBeforeMount(() => {
  console.log(route.params.id)
  catsStore.fetchCat(route.params.id)
  catsStore.fetchFoodInfo(route.params.id)
  catsStore.fetchHealthInfo(route.params.id)
  catsStore.fetchBehaviourInfo(route.params.id)
  console.log('Route: ')
  console.log(route.params)
})
</script>

<style scoped>
.content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: start;
  position: relative;
}
header {
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cat-avatar {
  width: 5rem;
  height: 5rem;
  grid-column: 1;
  grid-row: 1 / 4;
  margin-inline: 0.25rem;
  scale: 1;
}
.cat-content {
  display: grid;
  justify-items: start;
  width: 70vw;
}

@media screen and (min-width: 600px) {
  header {
    width: 500px;
  }
  .cat-content {
    width: 500px;
  }
}
</style>
