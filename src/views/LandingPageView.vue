<template>
  <div class="content-wrapper">
    <SiteLogo class="logo-component" />
    <!-- <img class="site-logo" :src="imageUrl()" alt="Bild einer Katze mit Hut" />
    <h1 class="site-name-headline" data-cy="headline">Cat Herder</h1> -->

    <p class="intro-text" data-cy="intro-text">
      <span>Willommen!</span>
      <span>Cat Herder hilft dir dabei, die Versorgung deiner Katzen zu koordinieren</span>
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
    header="Login"
    :style="{ width: '500px' }"
    :breakpoints="{ '1000px': '500px', '600px': '500px', '550px': '90vw' }"
  >
    <UserAuth></UserAuth>
  </PrimeDialog>
</template>

<script setup>
import { ref } from 'vue'
import UserAuth from '@/components/UserAuth.vue'
import SiteLogo from '../components/SiteLogo.vue'
const visible = ref(false)

// function imageUrl() {
//   return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
// }
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
}

.logo-component {
  margin-top: 10vh;
  font-size: 0.55rem;
}

/* .site-logo {
  padding-right: 1rem;
}
.site-name-headline {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -1px;
  margin-top: 0.5rem;
} */
.intro-text {
  width: 250px;
  text-align: center;
  padding-block: 3rem;
  font-size: 1.3rem;
  font-family: 'Roboto-Slab';
  display: flex;
  flex-direction: column;
}
.btn-open-modal {
  height: 2.5rem;
  width: 70vw;
}
img {
  height: 200px;
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

/* .dialog-content-wrapper {
  border-radius: var(--border-radius);
  padding: 2rem;
  background-color: var(--background-clr);
} */
</style>
