<script setup>
import { supabase } from '../supabase'
import { onBeforeMount, ref, reactive, toRefs, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const props = defineProps(['session'])
const { session } = toRefs(props)

const userStore = useUserStore()

const router = useRouter()

const toast = useToast()
const error = ref('')
const formInfo = reactive({
  summary: '',
  detail: '',
  severity: 'warn'
})

const loading = ref(true)

const showToast = () => {
  toast.add({
    severity: `${formInfo.severity}`,
    summary: `${formInfo.summary}`,
    detail: `${formInfo.detail}`,
    life: 3000
  })
}

const btnValue = computed(() => {
  if (userStore.fetchState.loading) {
    return 'Loading'
  } else return 'Absenden'
})

async function updateProfile() {
  if (userStore.state.username === null) {
    formInfo.detail = 'Dein Name muss mindestens 3 Zeichen lang sein!'
    formInfo.summary = 'Name zu kurz'
    userStore.state.username = userStore.state.usernameOld
    showToast()
    return
  }
  if (userStore.state.username.includes(' ')) {
    formInfo.detail = 'Der Name darf keine Leerzeichen enthalten!'
    formInfo.summary = 'Name enthält Leerzeichen'
    userStore.state.username = userStore.state.usernameOld
    showToast()
    return
  }

  if (userStore.state.username === null || userStore.state.username.length < 3) {
    formInfo.detail = 'Dein Name muss mindestens 3 Zeichen lang sein!'
    formInfo.summary = 'Name zu kurz'
    userStore.state.username = userStore.state.usernameOld
    showToast()
    return
  }
  if (userStore.state.username.length > 15) {
    formInfo.detail = 'Der Name kann maximal 15 Zeichen lang sein!'
    formInfo.summary = 'Name zu lang'
    userStore.state.username = userStore.state.usernameOld
    showToast()
    return
  }
  if (userStore.state.usernameOld === userStore.state.username) {
    formInfo.detail = 'Du hast den selben Namen angegeben!'
    formInfo.summary = 'Keiner Änderung des Namens'
    showToast()
    return
  }
  try {
    userStore.fetchState.loading = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: userStore.state.username,
      avatar_url: userStore.state.avatar_url,
      // full_name: userStore.state.full_name,
      updated_at: new Date()
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
    userStore.state.username = userStore.state.usernameOld
    return
  } finally {
    formInfo.detail = 'Dein Name wurde geändert!'
    formInfo.summary = 'Name geändert'
    if (userStore.state.usernameOld === null) {
      formInfo.detail = 'Dein Name wurde ergänzt!'
      formInfo.summary = 'Name gespeichert'
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    formInfo.severity = 'success'
    showToast()
    userStore.state.usernameOld = userStore.state.username

    userStore.fetchState.loading = false
    formInfo.severity = 'warn'
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  userStore.getProfile(session)
})
</script>

<template>
  <div class="content-wrapper">
    <header>
      <div v-if="!userStore.state.usernameOld">
        <h1>Bitte ergänze deinen Nutzernamen!</h1>
        <h2>(Dieser Name ist für andere Nutzer sichtbar)</h2>
      </div>
      <div v-else>
        <h1>Hier kannst du deine Namen ändern, {{ userStore.state.usernameOld }}</h1>
      </div>
    </header>
    <form class="form-widget" @submit.prevent="updateProfile">
      <span class="p-float-label">
        <PrimeInputText class="input-field" id="email" v-model="session.user.email" disabled />
        <label :class="{ labelUp: session.user.email }" class="float-label_label" for="email"
          >Email</label
        >
      </span>
      <span class="p-float-label input-username">
        <PrimeInputText class="input-field" id="username" v-model.trim="userStore.state.username" />
        <label
          class="float-label_label"
          :class="{ labelUp: userStore.state.username }"
          for="username"
          >Nutzername</label
        >
      </span>
      <!-- <span class="p-float-label">
        <PrimeInputText class="input-field" id="full-name" v-model="userStore.state.full_name" />
        <label
          for="full-name"
          class="float-label_label"
          :class="{ labelUp: userStore.state.full_name }"
          >Full Name</label
        >
      </span> -->
      <div class="button-wrapper">
        <PrimeButton
          type="submit"
          class="button primary block"
          :disabled="userStore.fetchState.loading"
          ><p>{{ btnValue }}</p></PrimeButton
        >

        <PrimeButton
          class="button block"
          @click="signOut"
          :disabled="userStore.fetchState.loading"
          outlined
          ><p>Nutzer Abmelden</p></PrimeButton
        >
      </div>
      <Toast />
      <h2>{{ error }}</h2>
    </form>
  </div>
</template>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
  position: relative;
  padding-inline: 1rem;
}
header {
  width: 70vw;
  padding-bottom: 3rem;
}

form {
  display: grid;
  justify-items: left;
  gap: 2rem;
  width: 70vw;
  position: relative;
}

form > * {
  width: 100%;
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

.button {
  width: 100%;
  text-align: center;
  padding: 0.55rem;
}
p {
  margin: 0 auto;
  padding: 0;
}
.button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

@media screen and (min-width: 600px) {
  header {
    width: 500px;
  }
  form {
    width: 500px;
  }
}
@media screen and (min-width: 1200px) {
}
</style>
