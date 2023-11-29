<template>
  <div class="content-wrapper">
    <svg class="icon logo" @click="router.push('./')" data-cy="logo">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style scoped>
.content-wrapper {
  height: max-content;
}
.logo {
  color: var(--dark);
  height: 2rem;
  width: 2rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.logo:hover {
  color: var(--alert-dark);
  scale: 1.1;
  cursor: pointer;
}
.home-button {
  background: none;
  border: none;
}
</style>
