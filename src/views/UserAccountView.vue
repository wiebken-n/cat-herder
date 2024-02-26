<script setup>
import { supabase } from '../supabase'
import { onBeforeMount, ref, reactive, toRefs, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps(['session'])
const { session } = toRefs(props)

const userStore = useUserStore()

const router = useRouter()

const toast = useToast()
const confirm = useConfirm()

const formInfo = reactive({
  summary: '',
  detail: '',
  severity: 'warn'
})

const loading = ref(true)

const deleteDialogOpen = ref(false)

const feedbackText = ref('')
const showToast = () => {
  toast.add({
    severity: `${formInfo.severity}`,
    summary: `${formInfo.summary}`,
    detail: `${formInfo.detail}`,
    life: 3000
  })
}

// adjusts button text according to loading state
const btnValue = computed(() => {
  if (userStore.fetchState.loading) {
    return 'In Bearbeitung'
  } else return 'Speichern'
})

// checks if user name already exists in database (name has to be unique)
async function checkIfNameExists() {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('username', userStore.state.username)

  if (error) {
    console.log(error)
  }
  if (data) {
    if (data.length >= 1) {
      return true
    } else return false
  }
}

// checks validity of username-input and saves new name if valid
async function updateProfile() {
  if (userStore.state.demo_role === true) {
    toast.add({
      severity: 'warn',
      summary: 'Namensänderung nicht möglich',
      detail: 'Der Name des Demo-Nutzeraccounts kann nicht geändert werden.',
      life: 5000
    })
    return
  }
  // validity checks
  if (userStore.state.usernameOld === userStore.state.username) {
    formInfo.detail = 'Du hast den selben Namen angegeben!'
    formInfo.summary = 'Keiner Änderung des Namens'
    showToast()
    return
  }
  let nameExists = await checkIfNameExists()
  if (nameExists) {
    formInfo.detail = 'Dieser Name ist leider schon vergeben - bitte wähle einen anderen Namen!'
    formInfo.summary = 'Name schon vergeben'
    userStore.state.username = userStore.state.usernameOld
    showToast()
    return
  }
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

  // updates name in database
  try {
    userStore.fetchState.loading = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: userStore.state.username,
      avatar_url: userStore.state.avatar_url,
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

// signs out user
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

function deleteUserDialog() {
  confirm.require({
    group: 'headless',
    message: `Möchstest du deinen Account endgültig löschen?`,
    header: 'Account löschen',

    accept: () => {
      if (userStore.state.demo_role === true) {
        toast.add({
          severity: 'warn',
          summary: 'Löschen nicht möglich',
          detail: 'Der Demo-Nutzeraccount kann nicht gelöscht werden.',
          life: 5000
        })
        return
      }
      toast.add({
        severity: 'info',
        summary: 'Accountlöschung',
        detail:
          'Dein Account wird nun gelöscht. Sobald dies erfolgt ist, wirst du per Email informiert!',
        life: 5000
      })
      addDeletionRequest()
    },
    reject: () => {}
  })
}

const addDeletionRequest = async () => {
  const { data, error } = await supabase
    .from('deletion_requests')
    .insert([{ feedback: feedbackText.value }])
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    await deleteCats()
    await deleteHerderConnections()
    await deleteUserConnections()
    await changeUserData()
    setTimeout(() => {
      signOut()
    }, 5000)
  }
}

const changeUserData = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ username: userStore.state.username + ' (gelöscht)', account_deleted: true })
    .eq('id', userStore.state.userId)
  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
}

const deleteCats = async () => {
  const { data, error } = await supabase
    .from('cats')
    .delete()
    .eq('user_id', userStore.state.userId)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
  }
}

const deleteHerderConnections = async () => {
  const { data, error } = await supabase
    .from('herder_connections')
    .delete()
    .eq('herder_id', userStore.state.userId)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
  }
}

const deleteUserConnections = async () => {
  const { data, error } = await supabase
    .from('user_connections')
    .delete()
    .or(`user_active.eq.${userStore.state.userId},user_passive.eq.${userStore.state.userId}`)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
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
        <h1>Hier kannst du deinen Namen ändern, {{ userStore.state.usernameOld }}</h1>
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
      <div class="button-wrapper">
        <PrimeButton
          type="submit"
          class="button primary block"
          :label="btnValue"
          :disabled="userStore.fetchState.loading"
        ></PrimeButton>

        <PrimeButton
          class="button block"
          @click="signOut"
          :disabled="userStore.fetchState.loading"
          outlined
          label="Nutzer Abmelden"
        ></PrimeButton>
        <PrimeButton
          class="button block button-delete-account"
          @click="deleteDialogOpen = true"
          :disabled="userStore.fetchState.loading"
          text
          label="Account löschen"
        ></PrimeButton>
      </div>
      <Toast />
    </form>
    <PrimeDialog
      v-model:visible="deleteDialogOpen"
      modal
      header="Account löschen"
      :style="{ width: '600px' }"
      :breakpoints="{ '650px': '500px', '600px': '90vw' }"
    >
      <div class="delete-dialog-content">
        <p>
          <span>
            Ich bedanke mich dafür, dass du Cat Herder genutzt hast. Wenn du möchtest, kannst du mir
            im Textfeld unten Feedback hinterlassen.</span
          >
          <span> Ich wünsche dir und deinen felinen Freunden alles Gute!</span>
        </p>
        <p>
          Die Löschung des Accounts kann etwas Zeit in Anspruch nehmen - du bekommst eine Nachricht
          per Email, sobald die Löschung durchgeführt wurde.
        </p>

        <PrimeTextArea
          id="feedback"
          class="input input-area"
          v-model="feedbackText"
          rows="4"
        ></PrimeTextArea>
        <PrimeButton @click="deleteUserDialog()" label="Account löschen"></PrimeButton>
        <p class="warning-text">
          Die Löschung deines Nutzeraccounts ist endgültig - der Account ist nicht
          wiederherstellbar.
        </p>
      </div>
    </PrimeDialog>
    <PrimeConfirmDialog group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="dialog-container">
          <div class="confirm-dialog-container">
            <h3 class="dialog-header">{{ message.header }}</h3>
            <div class="dialog-text-container">
              <p class="dialog-text text-delete">{{ message.message }}</p>
            </div>

            <div class="button-container">
              <PrimeButton
                class="danger-button"
                severity="warning"
                label="Account löschen"
                @click="acceptCallback"
              ></PrimeButton>
              <PrimeButton label="Zurück" @click="rejectCallback" outlined></PrimeButton>
            </div>
          </div>
        </div>
      </template>
    </PrimeConfirmDialog>
    <Toast />
  </div>
</template>

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

.button {
  width: 100%;
  text-align: center;
  padding: 0.75rem;
}

.button-delete-account {
  margin-top: 0.75rem;
}
.button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.delete-dialog-content {
  padding-inline: 1rem;
  display: grid;
}
.warning-text {
  color: var(--alert);
  padding: 1rem;
  border: 1px solid var(--alert);
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 3rem;
}

#feedback {
  width: 100%;
  margin-bottom: 1rem;
}
.text-delete {
  font-size: 1.125rem;
}

.dialog-container {
  border-radius: var(--border-radius);
  display: grid;
  grid-template-columns: 1;
  justify-items: center;
  min-height: max-content;
  width: 85vw;
  background-color: var(--card-background);
  position: relative;
  padding: 1rem;
}
.dialog-container > h3 {
  margin-block: 0.5rem;
  width: 100%;
  text-align: center;
}
.dialog-text-container {
  width: 100%;
  padding-inline: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: left;
  font-weight: 500;
}
.button-container {
  padding-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.danger-button {
  background-color: var(--alert);
  border-color: var(--alert-dark);
}

.danger-button:hover {
  background-color: var(--alert-dark);
}
@media screen and (min-width: 600px) {
  header {
    width: 500px;
  }
  form {
    width: 500px;
  }
  .dialog-container {
    width: 500px;
  }
}

@media screen and (min-width: 1000px) {
  .dialog-container {
    width: 600px;
  }
}
</style>
