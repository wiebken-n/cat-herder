<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../supabase'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import SiteLogo from '@/components/SiteLogo.vue'
const toast = useToast()

const loading = ref(false)
const email = ref('')
const linkSend = ref(false)

const toastData = reactive({
  severity: 'warn',
  summary: 'Warnung',
  detail: ''
})
const throwToast = () => {
  toast.add({
    severity: toastData.severity,
    summary: toastData.summary,
    detail: toastData.detail,
    life: 4000
  })
}
// function imageUrl() {
//   return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
// }

const handleLogin = async () => {
  const textInput = document.querySelector('#user-email')
  textInput.classList.remove('p-invalid')

  if (email.value.length < 5 || email.value.length > 40) {
    textInput.classList.add('p-invalid')
    toastData.summary = 'Bitte gib eine gültige Emailadresse ein!'
    toastData.detail = 'Emailadresse ungültig'
    throwToast()
    return
  }

  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })
    if (error) throw error
    // alert('Schau in deinem Mail-Postfach nach dem Login-Link!')
    toastData.summary = 'Link versendet'
    toastData.detail = 'Der Link für die Anmeldung wurde an deine Adresse geschickt!'
    toastData.severity = 'success'
    throwToast()
    linkSend.value = true
  } catch (error) {
    if (error instanceof Error) {
      loading.value = false
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Toast />
  <div v-if="!linkSend" class="auth-content-wrapper">
    <div class="logo-wrapper"></div>
    <SiteLogo class="logo-component" />

    <form class="signup-form" @submit.prevent>
      <p class="description">
        Gib unten deine E-Mail Adresse ein um einen Login-Link zugeschickt zu bekommen
      </p>
      <div class="form-input">
        <span class="p-float-label">
          <PrimeInputText
            class="input-field"
            required
            type="email"
            id="user-email"
            label="Email"
            v-model.trim="email"
            @keyup.enter="handleLogin()"
          />
          <label :class="{ labelUp: email }" class="float-label_label" for="user-email"
            >Email</label
          ></span
        >

        <PrimeButton
          :label="loading ? 'Loading' : 'Sende einen Link'"
          :disabled="loading"
          class="button-submit"
          @click="handleLogin()"
        ></PrimeButton>
      </div>
    </form>
  </div>
  <div v-else class="auth-content-wrapper">
    <SiteLogo class="logo-component" />
    <p class="description">
      Du hast eine Email bekommen - mit dem Link in der Email kannst du dich nun einloggen!
    </p>
  </div>
</template>

<style scoped>
.auth-content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
}
.signup-form {
  padding-block: 1rem;
  display: grid;
  justify-items: center;
  max-width: 400px;
  gap: 1rem;
  position: relative;
}
.form-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1px;
  position: relative;
}
.form-input > * {
  height: 3rem;
  width: 100%;
}
.logo-component {
  color: var(--text);
  font-size: 0.3rem;
}

.description {
  text-align: center;
}
.input-field {
  width: 100%;
  height: 3rem;
}
.float-label_label {
  color: var(--text);
  font-size: 1rem;
  padding-inline: 0.5rem;
}

.input-field:focus + .float-label_label {
  background: var(--hover-label-bg);
  transform: translateY(0.55rem);
  color: var(--primary);
}

.labelUp {
  color: var(--text-off);
  background: var(--hover-label-bg);
  transform: translateY(0.55rem);
}
.button-submit {
  margin-bottom: 2rem;
  margin-top: 0.25rem;
}
</style>
