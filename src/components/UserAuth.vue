<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../supabase'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
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
function imageUrl() {
  return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
}

const handleLogin = async () => {
  if (email.value.length < 1 || email.value.length > 40) {
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
  <div v-if="!linkSend" class="content-wrapper">
    <!-- <svg class="icon">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg> -->
    <img :src="imageUrl()" alt="Bild einer Katze mit Hut" />
    <h1 class="header">CatHerder</h1>

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
  <div v-else class="content-wrapper">
    <svg class="icon">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg>
    <h1 class="header">CatHerder</h1>
    <p class="description">
      Du hast eine Email bekommen - mit dem Link in der Email kannst du dich nun einloggen!
    </p>
  </div>
</template>

<style scoped>
.content-wrapper {
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

h1 {
  color: var(--dark);
  border-radius: 25px;
  padding: 1.25rem;
  padding-block: 1.5rem;
}
.icon {
  color: var(--dark);
}
img {
  height: 200px;
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
  background-color: var(--background-clr);
  transform: translateY(0.55rem);
  color: var(--primary);
}

.labelUp {
  color: var(--text-off);
  background-color: var(--background-clr);
  transform: translateY(0.55rem);
}
.button-submit {
  margin-bottom: 2rem;
  margin-top: 0.25rem;
}
</style>
