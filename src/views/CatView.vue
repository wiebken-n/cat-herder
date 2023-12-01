import CatsView from './CatsView.vue';
<template>
  <div>
    <h2>{{ catsStore.state.currentCat.name }}</h2>
    <h1>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }}</h1>
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
  console.log('Route: ')
  console.log(route.params)
})
</script>
