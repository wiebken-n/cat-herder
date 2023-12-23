<template>
  <div v-if="!impressumActive" class="l-content-wrapper">
    <SiteLogo class="logo-component" />

    <div class="intro-text" data-cy="intro-text">
      <span>Willommen!</span>
      <span>Cat Herder hilft dir dabei, die Versorgung deiner Katzen zu koordinieren</span>
    </div>

    <PrimeButton
      label="Anmelden"
      class="btn-open-modal"
      icon="pi pi-user"
      @click="visible = true"
    />
    <PrimeDialog
      v-model:visible="visible"
      modal
      header="Login"
      :style="{ width: '500px' }"
      :breakpoints="{ '1000px': '500px', '600px': '500px', '550px': '90vw' }"
    >
      <UserAuth></UserAuth>
    </PrimeDialog>
    <div class="impressum-link-wrapper">
      <button @click="impressumActive = !impressumActive" class="impressum-link">Impressum</button>
      <!-- <a class="impressum-link" @click="impressumActive = !impressumActive">Impressum</a> -->
    </div>
  </div>
  <div v-if="impressumActive" class="impressum">
    <ImpressumView @backToLanding="impressumActive = !impressumActive" fromLanding="true" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserAuth from '@/components/UserAuth.vue'
import SiteLogo from '../components/SiteLogo.vue'
import ImpressumView from './ImpressumView.vue'
const visible = ref(false)
const impressumActive = ref(false)

// function imageUrl() {
//   return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
// }
</script>

<style scoped>
.l-content-wrapper {
  display: grid;
  grid-template-rows: 45fr 15fr 15fr 25fr;
  align-items: center;
  justify-items: center;
  height: 100vh;
}

.logo-component {
  margin-top: 7vh;
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
  width: 250px;
}
img {
  height: 200px;
}
.impressum-link-wrapper {
  margin-top: auto;
  height: 2.55rem;
  background-color: var(--card-background);
  width: 100vw;
  position: relative;
}
.impressum-link {
  font-family: 'Roboto-Slab';
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  transform: translateX(-50%);
  transition: all 100ms ease-in-out;
}
.impressum-link:hover,
.impressum-link:focus {
  cursor: pointer;
  font-weight: 500;
}

@media screen and (min-width: 600px) {
  .intro-text {
    width: 400px;
  }
  .btn-open-modal {
    height: 2.5rem;
    width: 250px;
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
