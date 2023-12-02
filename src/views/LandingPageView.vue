<template>
  <div class="content-wrapper">
    <svg class="icon logo" data-cy="logo">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg>
    <h1 class="headline" data-cy="headline">Cat Herder</h1>
    <p class="intro-text" data-cy="intro-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet sem turpis. Maecenas
      consectetur varius nibh, id porttitor magna interdum a. Phasellus laoreet tortor a sapien
      semper, id egestas ipsum imperdiet. Aliquam a enim nec mi fermentum sollicitudin.
    </p>
    <PrimeButton label="Open" class="btn-open-modal" icon="pi pi-user" @click="visible = true" />
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
  width: 70%;
  text-align: left;
  padding-block: 3rem;
}
.btn-open-modal {
  height: 2.5rem;
  width: 70%;
}

@media screen and (min-width: 600px) {
  .intro-text {
    width: 40rem;
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
