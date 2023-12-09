<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')
const linkSend = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })
    if (error) throw error
    alert('Check your email for the login link!')
    linkSend.value = true
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="!linkSend" class="content-wrapper">
    <svg class="icon">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg>
    <h1 class="header">CatHerder</h1>

    <form class="signup-form" @submit.prevent="handleLogin">
      <p class="description">
        Gib unten deine E-Mail Adresse ein um einen Login-Link zugeschickt zu bekommen
      </p>
      <div class="form-input">
        <input class="inputField" required type="email" placeholder="Your email" v-model="email" />
        <input
          type="submit"
          class="button block btn-submit"
          data-cy="login-submit-button"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
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
}
.form-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1px;
}
.form-input > * {
  height: 3rem;
}
/* .header {
} */

h1 {
  color: var(--dark);
  border-radius: 25px;
  padding: 1.25rem;
  padding-block: 1.5rem;
}
.icon {
  color: var(--dark);
}
</style>
