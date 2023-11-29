<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore'

const userStore = useUserStore()

const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(true)

onMounted(() => {
  getProfile()
})

const btnValue = computed(() => {
  if (loading.value) {
    return 'Loading'
  } else return 'Update'
})

async function getProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, avatar_url, full_name`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      ;(userStore.state.username = data.username),
        (userStore.state.avatar_url = data.avatar_url),
        (userStore.state.full_name = data.full_name)
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
    userStore.state.usernameOld = userStore.state.username
  }
}

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
      <h1>Hier kannst du deine Nutzerdaten ändern, {{ userStore.state.usernameOld }}</h1>
    </header>
    <form class="form-widget" @submit.prevent="updateProfile">
      <span class="p-float-label">
        <InputText class="input-field" id="email" v-model="session.user.email" disabled />
        <label class="float-label_label" for="email">Email</label>
      </span>
      <span class="p-float-label input-username">
        <InputText class="input-field" id="username" v-model="userStore.state.username" />
        <label class="float-label_label" for="username">Username</label>
      </span>
      <span class="p-float-label">
        <InputText class="input-field" id="full-name" v-model="userStore.state.full_name" />
        <label
          :class="{ floatLabelActive: userStore.state.full_name.length <= 0 }"
          for="full-name"
          class="float-label_label"
          >Full Name</label
        >
      </span>
      <div class="button-wrapper">
        <Button type="submit" class="button primary block" :disabled="loading"
          ><p>{{ btnValue }}</p></Button
        >

        <Button class="button block" @click="signOut" :disabled="loading" outlined
          ><p>Sign Out</p></Button
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
}
.float-label_label {
  font-size: 1rem;
  transform: translateY(-0.55rem);
}

.floatLabelActive {
  font-weight: 500;
  /* color: var(--primary); */
  font-style: italic;
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
