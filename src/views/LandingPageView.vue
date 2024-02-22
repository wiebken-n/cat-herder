<template>
  <div class="content-wrapper">
    <div v-if="!impressumActive" class="l-content-wrapper">
      <SiteLogo class="logo-component" />

      <div class="intro-text" data-cy="intro-text">
        <h2>Koordiniere die Betreuung deiner Katzen</h2>
        <div class="paw-icon-container">
          <svg class="cat-icon">
            <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
          </svg>
        </div>
        <h3>einfach und interaktiv</h3>
      </div>

      <PrimeButton
        data-cy="open-login-btn"
        label="Anmelden"
        class="btn-open-modal"
        icon="pi pi-user"
        @click="visible = true"
      >
        <span>Anmelden</span>
        <svg class="paw-icon">
          <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor"></use>
        </svg>
      </PrimeButton>
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
        <button @click="impressumActive = !impressumActive" class="impressum-link">
          Impressum
        </button>
      </div>
    </div>
    <div v-if="impressumActive" class="impressum">
      <ImpressumView @backToLanding="impressumActive = !impressumActive" fromLanding="true" />
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UserAuth from '@/components/UserAuth.vue'
import SiteLogo from '../components/SiteLogo.vue'
import ImpressumView from './ImpressumView.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useDeletionStore } from '../stores/useDeletionStore'

const visible = ref(false)
const impressumActive = ref(false)

const deletionStore = useDeletionStore()
const toast = useToast()

const throwToastUserDeletion = () => {
  toast.add({
    severity: 'warn',
    summary: 'Account gelöscht',
    detail: 'Dieser Nutzeraccount wurde gelöscht',
    life: 7000
  })
}

onMounted(() => {
  // throws infotoast if login with user with pending deletionrequest tries to log in
  if (deletionStore.state.deletionActive === true) {
    throwToastUserDeletion()
    deletionStore.state.deletionActive = false
  }
})
</script>

<style scoped>
.content-wrapper {
  margin: 0;
  padding: 0;
}
.l-content-wrapper {
  background-color: var(--card-background);
  display: grid;
  /* grid-template-rows: 40fr 15fr 15fr 30fr; */
  align-items: center;
  justify-items: center;
  height: 100vh;
}

.logo-component {
  margin-top: 8vh;
  font-size: 0.525rem;
}

.intro-text {
  width: 20rem;
  text-align: center;

  font-family: 'Roboto-Regular';
  display: flex;

  flex-direction: column;
}

h2 {
  font-size: 1.9em;
  font-family: 'Roboto-Condensed';
  margin-bottom: 1.4rem;
  font-weight: 500;
}

h3 {
  margin-top: 1.4rem;
  font-size: 1.3em;
  font-weight: 350;
  font-family: 'Roboto-Condensed';
}

.paw-icon-container {
  margin-block: 0rem;
  width: 3.5rem;
  height: 3.5rem;

  margin-inline: auto;
  padding: 0.75rem;
  background-color: hsl(4, 15%, 67%);
  border-radius: 100px;
  scale: 1;
}
.paw-icon {
  color: var(--background-clr);
  height: 1.5rem;
  width: 1.5rem;
  margin: 0;
  padding: 0;
}
.cat-icon {
  color: var(--background-clr);
  height: 2rem;
  width: 2rem;
  margin: 0;
  padding: 0;
}

.btn-open-modal {
  height: 3rem;
  width: 18rem;
  display: flex;
  justify-content: center;
  gap: 1.125rem;
  font-family: 'Roboto-Regular';
  font-size: 1.125rem;
  align-items: center;
}

img {
  height: 200px;
}
.impressum-link-wrapper {
  margin-top: auto;
  height: 2.75rem;
  background-color: hsl(4, 15%, 77%);
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

@media screen and (max-width: 350px) {
  .intro-text {
    width: 85vw;
  }
}

@media screen and (min-width: 400px) {
  .intro-text {
    width: 20rem;
  }
}
@media screen and (min-width: 600px) {
  .intro-text {
    width: 20rem;
  }
  .btn-open-modal {
    height: 3rem;
    width: 18rem;
  }
  .btn-login {
    width: 10rem;
  }
}
</style>
