<template>
  <div class="logo-wrapper">
    <img class="logo" :src="imageUrl()" alt="Bild einer Katze mit Hut" />
    <h1 class="headline" data-cy="headline">Cat Herder</h1>
  </div>
</template>

<script setup>
function imageUrl() {
  return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
}
</script>
<style scoped>
.logo-wrapper {
  scale: 1;
  display: grid;
  justify-items: center;
}
.logo {
  height: 21.6em;
  padding-right: 1.25em;
}
.headline {
  font-size: 5em;
  font-weight: 700;
  letter-spacing: -1px;
  margin-top: 0.25em;
}
</style>
