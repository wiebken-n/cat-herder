<script setup>
import { supabase } from '../supabase'
import { onBeforeMount, ref, toRefs, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore'

const userStore = useUserStore()

onBeforeMount(() => {
  userStore.getProfile(session)
})

const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(true)

const btnValue = computed(() => {
  if (userStore.fetchState.loading) {
    return 'Loading'
  } else return 'Update'
})

async function updateProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: userStore.state.username,
      avatar_url: userStore.state.avatar_url,
      full_name: userStore.state.full_name,
      updated_at: new Date()
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    userStore.state.usernameOld = userStore.state.username

    loading.value = false
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


</script>

<template>
  <div class="content-wrapper">
    <header>
      <h1 v-if="!userStore.state.usernameOld">Bitte ergänze deine Daten!</h1>
      <h1 v-else>Hier kannst du deine Nutzerdaten ändern, {{ userStore.state.usernameOld }}</h1>
    </header>
    <form class="form-widget" @submit.prevent="updateProfile">
      <span class="p-float-label">
        <PrimeInputText class="input-field" id="email" v-model="session.user.email" disabled />
        <label :class="{ labelUp: session.user.email }" class="float-label_label" for="email"
          >Email</label
        >
      </span>
      <span class="p-float-label input-username">
        <PrimeInputText class="input-field" id="username" v-model="userStore.state.username" />
        <label
          class="float-label_label"
          :class="{ labelUp: userStore.state.username }"
          for="username"
          >Username</label
        >
      </span>
      <span class="p-float-label">
        <PrimeInputText class="input-field" id="full-name" v-model="userStore.state.full_name" />
        <label
          for="full-name"
          class="float-label_label"
          :class="{ labelUp: userStore.state.full_name }"
          >Full Name</label
        >
      </span>
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
          ><p>Sign Out</p></PrimeButton
        >
      </div>
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
