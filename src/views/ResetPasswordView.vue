<template>
  <div class="content-wrapper">
    <header>
      <h1>Passwort ändern</h1>
    </header>
    <Toast></Toast>
    <form @submit.prevent="changePassword()">
      <p>Bitte gib hier dein neues Passwort ein:</p>
      <span class="p-float-label input-password">
        <PrimeInputText
          class="input-field"
          required
          type="password"
          id="user-password"
          label="Password"
          v-model.trim="password"
          autocomplete="on"
        />
        <label :class="{ labelUp: password }" class="float-label_label" for="user-email"
          >Passwort</label
        ></span
      >
      <PrimeButton
        label="Neues Passwort speichern"
        class="button-submit"
        type="submit"
      ></PrimeButton>
    </form>
  </div>
</template>
<script setup>
import { supabase } from '../supabase'
import { onBeforeMount, onMounted, ref, toRefs } from 'vue'
import { useUserStore } from '../stores/useUserStore'
import { useDeletionStore } from '../stores/useDeletionStore'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const deletionStore = useDeletionStore()

const props = defineProps(['session'])
const { session } = toRefs(props)

const userStore = useUserStore()

const router = useRouter()

const toast = useToast()
const password = ref('')

const changePassword = async () => {
  if (userStore.state.demo_role === true) {
    toast.add({
      severity: 'warn',
      summary: 'Password kann nicht geändert werden',
      detail: 'Das Passwort für den Demo-Nutzer kann nicht geändert werden.',
      life: 4000
    })
    return
  }
  if (password.value.length < 8 || password.value.length > 40) {
    toast.add({
      severity: 'warn',
      summary: 'Passwort ungültig',
      detail: 'Das Password muss zwischen 8 und 40 Zeichen lang sein',
      life: 4000
    })
    return
  }
  const { data, error } = await supabase.auth.updateUser({ password: password.value })
  if (error) {
    console.log(error)
  }
  if (data) {
    toast.add({
      severity: 'success',
      summary: 'Passwort gespeichert',
      detail: 'Dein Passwort wurde geändert',
      life: 4000
    })
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
}

async function signOut() {
  const { error, data } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
}

const checkIfUserActive = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userStore.state.userId)
    .eq('account_deleted', true)

  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    if (data.length > 0) {
      deletionStore.state.deletionActive = true
      signOut()
      router.push('/welcome')
      setTimeout(() => {
        toast.add({
          severity: 'warn',
          summary: 'Account geschlossen',
          detail: 'Dieser Account ist inaktiv und wird in Kürze gelöscht werden',
          life: 5000
        })
      }, 1000)
    }
  }
}

onBeforeMount(async () => {
  userStore.getProfile(session)
})

onMounted(async () => {
  await checkIfUserActive()
})
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
  position: relative;
  padding-inline: 1rem;
  font-size: 1rem;
}
header {
  width: 70vw;
  padding-bottom: 3rem;
  text-align: center;
}
form {
  display: grid;
  justify-items: left;
  gap: 0.5rem;
  width: 70vw;
  position: relative;
}
form > * {
  width: 100%;
}
form p {
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 500;
}
.input-field {
  width: 100%;
  height: 3rem;
}
.float-label_label {
  color: var(--text);
  font-size: 1rem;
  padding-inline: 0.5rem;
  font-family: 'Roboto-Light';
}

.input-field:focus + .float-label_label {
  background: var(--hover-label-bg-on-background);
  transform: translateY(0.55rem);
  color: var(--primary);
}

.labelUp {
  color: var(--text-off);
  background: var(--hover-label-bg-on-background);
  transform: translateY(0.55rem);
}

@media screen and (min-width: 600px) {
  header {
    width: 500px;
  }
  form {
    width: 500px;
  }
}
</style>
