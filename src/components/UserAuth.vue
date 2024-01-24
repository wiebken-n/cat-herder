<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../supabase'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import SiteLogo from '@/components/SiteLogo.vue'
import router from '../router'
const toast = useToast()

const loading = ref(false)
const email = ref('')
const password = ref('')
const linkSend = ref(false)
const newAccount = ref(false)

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

const handleLoginClick = async () => {
  if (newAccount.value) {
    await handleSignUp()
  }
  if (!newAccount.value) {
    await handleSignIn()
  }
}

const handleSignIn = async () => {
  const textInput = document.querySelector('#user-email')
  const passwordInput = document.querySelector('#user-password')
  textInput.classList.remove('p-invalid')
  passwordInput.classList.remove('p-invalid')

  if (email.value.length < 5 || email.value.length > 40) {
    textInput.classList.add('p-invalid')
    toastData.summary = 'Emailadresse ungültig'
    toastData.detail = 'Bitte gib eine gültige Emailadresse ein!'
    throwToast()
    return
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: 'http://localhost:5173/'
    }
  })
  if (error) {
    console.log(error)
    toastData.summary = 'Falsches Passwort'
    toastData.detail = 'Bitte gib das korrekte Passwort ein'
    throwToast()
    return
  }
  if (data) {
    router.push('/')
  }
}

const handleSignUp = async () => {
  const textInput = document.querySelector('#user-email')
  const passwordInput = document.querySelector('#user-password')
  textInput.classList.remove('p-invalid')
  passwordInput.classList.remove('p-invalid')
  if (email.value.length < 5 || email.value.length > 40) {
    textInput.classList.add('p-invalid')
    toastData.summary = 'Bitte gib eine gültige Emailadresse ein!'
    toastData.detail = 'Emailadresse ungültig'
    throwToast()
    return
  }
  if (password.value.length < 8 || password.value.length > 40) {
    passwordInput.classList.add('p-invalid')
    toastData.summary = 'Passwort ungültig'
    toastData.detail = 'Das Password muss zwischen 8 und 40 Zeichen lang sein!'
    throwToast()
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.log(error)
    toastData.summary = 'Emailadresse schon registiert'
    toastData.detail =
      'Bitte logge dich auf dem bestehenden Account ein oder benutze eine andere Emailadresse'
    throwToast()
    return
  }
  if (data) {
    router.push('/')
  }
}

const resetPassword = async () => {
  if (email.value.length < 5 || email.value.length > 40) {
    toastData.summary = 'Emailadresse ungültig'
    toastData.detail = 'Bitte gibt eine gültige Emailadresse ein'
    throwToast()
    return
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'http://localhost:5173/password'
  })
  if (error) {
    console.log(error)
    toastData.summary = 'Emailadresse ungültig'
    toastData.detail = 'Bitte gib die Emailadresse deines Accounts ein'
    throwToast()
    return
  }
  if (data) {
    toastData.severity = 'success'
    toastData.summary = 'Email versendet'
    toastData.detail = 'Es wurde eine Email zum Zurücksetzen des Passworts versendet'
    throwToast()
    return
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
        <span class="p-float-label input-mail">
          <PrimeInputText
            class="input-field"
            required
            type="email"
            id="user-email"
            label="Email"
            v-model.trim="email"
          />
          <label :class="{ labelUp: email }" class="float-label_label" for="user-email"
            >Email</label
          ></span
        >
        <span class="p-float-label input-password">
          <PrimeInputText
            class="input-field"
            required
            type="password"
            id="user-password"
            label="Passwort"
            v-model.trim="password"
          />
          <label :class="{ labelUp: password }" class="float-label_label" for="user-email"
            >Passwort</label
          ></span
        >

        <PrimeButton
          :label="newAccount ? 'Anmelden' : 'Einloggen'"
          :disabled="loading"
          class="button-submit"
          @click="handleLoginClick()"
        ></PrimeButton>
        <div class="toggle-wrapper">
          <PrimeInputSwitch v-model="newAccount" id="newAccountToggle" /><label
            for="newAccountToggle"
            >Neuen Account erstellen</label
          >
        </div>
        <PrimeButton text label="Passwort zurücksetzen" @click="resetPassword()"></PrimeButton>
      </div>
    </form>
  </div>
  <!-- <div v-else class="auth-content-wrapper">
    <SiteLogo class="logo-component" />
    <p class="description">
      Du hast eine Email bekommen - mit dem Link in der Email kannst du dich nun einloggen!
    </p>
  </div> -->
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

.input-mail {
  margin-bottom: 0.75rem;
}
.toggle-wrapper {
  width: 90%;
  display: flex;
  padding-inline-start: 0.125rem;
  padding-block: 0.75rem;
  gap: 1rem;
  align-items: center;
  font-family: 'Roboto-Regular';
  position: relative;
  margin-bottom: 2rem;
  margin-top: 1rem;
}
.button-submit {
  margin-top: 0.75rem;
}
</style>
