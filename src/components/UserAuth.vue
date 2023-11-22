<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value
    })
    if (error) throw error
    alert('Check your email for the login link!')
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
  <div class="content-wrapper">
    <img alt="" name="svguse:/icons.svg#catshield" src="" />
    <svg class="icon">
      <use xlink:href="@/assets/icons.svg#catshield" fill="currentcolor" />
    </svg>
    <h1 class="header">CatGuardian</h1>
    <h2>Die App rund um die Versorgung Deiner Katze</h2>
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
    <!-- <div>
      <h1>CatGuardian - Die App um deine Katze bestmöglich zu versorgen</h1>
      <h2>So true!</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec urna metus. Sed aliquet
        rhoncus neque, id aliquet justo maximus in. Morbi a velit diam. Mauris non enim orci. Sed
        bibendum magna eget augue commodo lacinia. Pellentesque blandit magna eget sem tristique,
        vitae pellentesque turpis condimentum. Integer dictum, dui sed semper volutpat, nisi augue
        pellentesque ante, eget fringilla arcu dolor sed nibh. Donec sagittis imperdiet odio,
        fermentum dictum nisl sodales eu. Donec id ultrices lacus. Vestibulum ullamcorper pharetra
        hendrerit. Curabitur ut tincidunt nisl, sit amet pharetra erat. Curabitur in nulla nunc.
        Phasellus blandit, massa sed dapibus accumsan, nunc urna dapibus lacus, id scelerisque lorem
        elit ac leo. Aliquam feugiat accumsan interdum. Fusce eros mauris, placerat vel porttitor
        non, laoreet vitae est. Sed non ipsum enim.
      </p>
    </div> -->
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
.header {
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
</style>
