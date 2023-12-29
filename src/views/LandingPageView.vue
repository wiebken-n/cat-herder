<template>
  <div v-if="!impressumActive" class="l-content-wrapper">
    <SiteLogo class="logo-component" />
    <div class="paw-icon-container">
      <svg class="paw-icon">
        <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor"></use>
      </svg>
    </div>
    <div class="intro-text" data-cy="intro-text">
      <h2>
        <span>Du willst die Betreuung deiner Katzen vereinfachen?</span>
        <span>Dann bist du hier genau richtig!</span>
      </h2>

      <!-- <div class="paw-icon-container">
        <svg class="paw-icon">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
      </div> -->
      <!-- <span>Willommen!</span> -->
      <!-- <span class="info-text"
        >Cat Herder hilft dir dabei, die Versorgung deiner Katzen zu koordinieren. Du kannst die
        wichtigsten Daten für deine Katze angeben, Termine anlegen, Notizen erstellen und dies alles
        mit deinen Cat-Sittern teilen.</span
      > -->
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
  grid-template-rows: 40fr 15fr 15fr 30fr;
  align-items: center;
  justify-items: center;
  height: 100vh;
}

.logo-component {
  margin-top: 7vh;
  font-size: 0.525rem;
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
  width: 18rem;
  text-align: left;

  font-size: 1.1rem;
  font-family: 'Roboto-Regular';
  display: flex;

  flex-direction: column;
}
.intro-text h2 {
  margin: 0;
  margin-inline: auto;
  width: 18rem;
  font-family: 'Roboto-Regular';
  font-size: 1.125rem;
  text-align: center;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  line-height: 1.5rem;
  gap: 0.5rem;
  margin-block: 0.75rem;
  margin-top: 2rem;
  /* background-color: var(--card-background); */
  padding: 1.5rem;
  border-radius: var(--border-radius);
  color: var(--text-off);
  border: 2px solid var(--primary);
  /* box-shadow: 0 0 4px 2px var(--card-shadow); */
  /* letter-spacing: -0.6px; */
}

.intro-text .info-text {
  margin-inline: 1rem;
  line-height: 1.5rem;
  border: 2px solid var(--primary);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-block: 1rem;
  font-size: 0.9rem;
}
.paw-icon-container {
  margin-block: 0rem;
  width: 3.5rem;
  height: 3.5rem;

  margin-inline: auto;
  padding: 0.75rem;
  background-color: var(--old-rose);
  /* box-shadow: inline 0 0 0px 2px var(--old-rose-light); */
  border-radius: 100px;
  scale: 1.125;
}
.paw-icon {
  color: var(--background-clr);
  height: 2rem;
  width: 2rem;
  margin: 0;
  padding: 0;
}

.btn-open-modal {
  height: 3rem;
  width: 18rem;
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
  font-family: 'Roboto-Regular';
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
  /* .intro-text {
    width: 15rem;
  } */
  .btn-open-modal {
    height: 3rem;
    width: 18rem;
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
