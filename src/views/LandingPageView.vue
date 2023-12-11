<template>
  <div class="content-wrapper">
    <svg class="icon logo" data-cy="logo">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg>
    <h1 class="headline" data-cy="headline">Cat Herder</h1>
    <p class="intro-text" data-cy="intro-text">
      <span>
        Willommen bei Cat Herder - der App die deinen Cat-Sittern dabei hilft, deine Katzen gut zu
        versorgen!</span
      >
    </p>
    <PrimeButton
      label="Anmelden"
      class="btn-open-modal"
      icon="pi pi-user"
      @click="visible = true"
    />
  </div>
  <PrimeDialog
    v-model:visible="visible"
    modal
    header=" "
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <UserAuth></UserAuth>
  </PrimeDialog>
</template>

<script setup>
import { ref } from 'vue'
import UserAuth from '../components/UserAuth.vue'
const visible = ref(false)
</script>

<style scoped>
.slider {
  display: flex;
  align-items: center;
  align-items: center;
  height: 0.5rem;
  width: 10rem;
}
.p-slider-handle {
  align-self: center;
  justify-self: center;
}
.content-wrapper {
  display: grid;
  justify-items: center;
}
.logo {
  color: var(--dark);
}
.headline {
  padding-top: 2rem;
}
.intro-text {
  width: 250px;
  text-align: center;
  padding-block: 3rem;
  font-size: 1.3rem;
}
.btn-open-modal {
  height: 2.5rem;
  width: 70vw;
}

@media screen and (min-width: 600px) {
  .intro-text {
    width: 400px;
  }
  .btn-open-modal {
    height: 2.5rem;
    width: 400px;
  }
  .btn-login {
    width: 10rem;
  }
}

.dialog-content-wrapper {
  border-radius: var(--border-radius);
  padding: 2rem;
  background-color: var(--background-clr);
}
</style>
