<template>
  <div class="user-info-element">
    <svg class="user-icon">
      <use
        v-if="props.connectionStatus === 'no connection'"
        xlink:href="@/assets/icons.svg#user"
        fill="currentcolor"
      ></use>
      <use
        v-if="
          props.connectionStatus === 'pending incoming' ||
          props.connectionStatus === 'pending outgoing'
        "
        xlink:href="@/assets/icons.svg#user-pending"
        fill="currentcolor"
      ></use>
      <use
        v-if="props.connectionStatus === 'connected'"
        xlink:href="@/assets/icons.svg#user-added"
        fill="currentcolor"
      ></use>
    </svg>

    <!-- <h2 class="username">{{ user.username }}</h2> -->
    <!-- {{ props.connectionStatus }} -->
    <div class="connetion-info">
      <p class="connetion-info">{{ userConnectionStatus }}</p>
      <!-- {{ props.connectionStatus }} -->
    </div>
    <div class="message-text-wrapper" v-if="messageText && !requestSend">
      <p>{{ messageText }}</p>
    </div>

    <div v-if="showButton" class="button-wrapper">
      <PrimeButton
        class="connection-btn"
        v-if="props.connectionStatus === 'no connection'"
        @click="sendRequest(props.user)"
        label="Verbindung anfragen"
      ></PrimeButton>

      <PrimeButton
        class="connection-btn"
        v-if="props.connectionStatus === 'connected'"
        label="Verbindung trennen"
        outlined
        @click="deleteConnection(props.user)"
      ></PrimeButton>

      <div class="incoming-button-wrapper" v-if="props.connectionStatus === 'pending incoming'">
        <PrimeButton
          class="connection-btn"
          @click="acceptRequest(props.user)"
          label="Anfrage annehmen"
        ></PrimeButton>
        <PrimeButton
          class="connection-btn"
          label="Anfrage ablehnen"
          outlined
          @click="deleteConnection(props.user)"
        ></PrimeButton>
      </div>

      <PrimeButton
        class="connection-btn"
        v-if="props.connectionStatus === 'pending outgoing'"
        label="Anfrage zurücknehmen"
        outlined
        @click="deleteRequest(props.user)"
      ></PrimeButton>
    </div>
    <div class="message-wrapper" v-if="requestSend">
      <p>Du kannst deiner Anfrage eine Nachricht beifügen:</p>
      <PrimeTextArea
        id="message"
        class="input input-area"
        v-model="messageText"
        label="Nachricht"
        rows="4"
      ></PrimeTextArea>
      <PrimeButton
        @click="sendMessage()"
        class="connection-btn"
        label="Nachricht senden"
      ></PrimeButton>
    </div>
    <div class="confimation-wrapper">
      <PrimeConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
          <div class="dialog-container">
            <h3 class="dialog-header">{{ message.header }}</h3>
            <div class="dialog-text-container">
              <p class="dialog-text">{{ message.message }}</p>
            </div>

            <div class="button-container">
              <PrimeButton label="Herder entfernen" @click="acceptCallback"></PrimeButton>
              <PrimeButton label="Zurück" @click="rejectCallback" outlined></PrimeButton>
            </div>
          </div>
        </template>
      </PrimeConfirmDialog>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { supabase } from '../supabase'
import { useConfirm } from 'primevue/useconfirm'
import { ref, onBeforeMount } from 'vue'
import { useCatsStore } from '../stores/useCatsStore'
import { useUserStore } from '../stores/useUserStore'

const catsStore = useCatsStore()
const userStore = useUserStore()

const confirm = useConfirm()

const userConnectionStatus = ref('')

const requestSend = ref(false)
const messageText = ref('')
const connectionId = ref('')

const deleteConnection = (user) => {
  confirm.require({
    group: 'headless',
    message: `Möchtest du die Verbindung mit ${user.username} wirklich trennen?`,
    header: 'Herder entfernen',

    accept: () => {
      emit('connectionDeleted')
      emit('interaction')
      deleteUserConnection(user)
    },
    reject: () => {}
  })
}

function connection() {
  setTimeout(() => {
    if (props.connectionStatus === 'connected') {
      userConnectionStatus.value = 'Ihr seid verbunden'
    }
    if (props.connectionStatus === 'no connection') {
      userConnectionStatus.value = 'Ihr seid nicht verbunden'
    }
    if (props.connectionStatus === 'pending incoming') {
      userConnectionStatus.value = 'Du hast eine Verbindungsanfrage bekommen'
    }
    if (props.connectionStatus === 'pending outgoing') {
      userConnectionStatus.value = 'Du hast eine Verbindungsanfrage gesendet'
    } else return
  }, 100)
}

async function fetchConnection() {
  const { data, error } = await supabase
    .from('user_connections')
    .select()
    .eq('user_active', props.user.id)

    .single()

  if (error) {
    console.log(error)
    return
  }
  if (data) {
    // console.log(data)
    if (data.message) {
      messageText.value = data.message
    }
    // console.log(messageText.value)
  }
}
onBeforeMount(async () => {
  connection()
  if (props.connectionStatus === 'pending incoming') {
    await fetchConnection()
  }
})

const props = defineProps({
  user: Object,
  connectionStatus: String,
  showButton: Boolean
})
const emit = defineEmits([
  'interaction',
  'connectionDeleted',
  'connectionEstablished',
  'requestSend',
  'requestDeleted',
  'messageSend'
])

async function sendRequest(user) {
  const { data, error } = await supabase
    .from('user_connections')
    .insert([{ user_passive: user.id }])
    .select()
    .single()

  if (error) {
    console.log(error)
  }
  if (data) {
    connectionId.value = data.id
    // console.log(data)
  }

  emit('requestSend')
  emit('interaction')
  requestSend.value = true
  userConnectionStatus.value = 'Du hast eine Verbindungsanfrage gesendet'

  return
}

async function sendMessage() {
  const { data, error } = await supabase
    .from('user_connections')
    .update({ message: messageText.value })
    .eq('id', connectionId.value)
    .select()

  if (error) {
    console.log(error)
    return
  }
  if (data) {
    // console.log(data)
    emit('messageSend')
    messageText.value = ''
    requestSend.value = false
  }
}
async function acceptRequest(user) {
  const userId = user.id
  const { data, error } = await supabase
    .from('user_connections')
    .update({ connected: true })
    .eq('user_active', userId)

  if (error) {
    console.log(error)
    return
  }
  if (data) {
    // console.log(data)
  }
  emit('connectionEstablished')
  emit('interaction')
  return
}

async function deleteRequest(user) {
  emit('requestDeleted')
  emit('interaction')
  deleteUserConnection(user)
  return
}

async function deleteUserConnection(user) {
  const { data, error } = await supabase
    .from('user_connections')
    .delete()
    .or(`user_active.eq.${user.id},user_passive.eq.${user.id}`)
    .select()
    .single()

  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    if (data.connected) {
      deleteHerderConnections(user.id)
    }
  }
  return
}

async function deleteHerderConnections(userId) {
  // delete connections of owned cats
  for (let cat of catsStore.state.cats) {
    for (let connection of cat.herder_connections) {
      if (userId === connection.herder_id) {
        const { data, error } = await supabase
          .from('herder_connections')
          .delete()
          .eq('herder_id', userId)
          .eq('cat_id', cat.id)
          .select()
          .single()
        if (error) {
          console.log(error)
        }
        if (data) {
          // console.log(data)
        }
      }
    }
  }

  // delete connections of cats owned by herder
  for (let cat of catsStore.state.herdedCats) {
    if (userId === cat.user_id) {
      for (let connection of cat.herder_connections) {
        if (userStore.state.userId === connection.herder_id) {
          const { data, error } = await supabase
            .from('herder_connections')
            .delete()
            .eq('herder_id', userStore.state.userId)
            .eq('cat_id', cat.id)
            .select()
            .single()
          if (error) {
            console.log(error)
          }
          if (data) {
            // console.log(data)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.user-info-element {
  /* background-color: var(--card-background);
  box-shadow: 0 0 5px 2px var(--card-shadow); */
  color: var(--text);
  display: grid;
  grid-template-columns: 2rem auto;
  row-gap: 0.5rem;
  align-items: center;
  justify-items: center;
  /* padding: 1.5rem; */
  width: 75vw;
  position: relative;
  margin-top: 3px;
  border-radius: var(--border-radius);
  transition: all 200ms ease-in-out;
}

.user-icon {
  margin-left: 0.5rem;
  color: var(--connection-icon-on-dialog);
  height: 2rem;
  width: 2rem;
}
.username {
  color: var(--text);
  font-size: 1.25rem;
  padding-left: 1.5rem;
  margin-right: auto;
  margin-block: 0;
}
.connetion-info {
  margin: 0;
  padding-left: 1rem;
  text-align: left;
  margin-right: auto;
  /* grid-column: 1 / 3; */
}
.button-wrapper {
  width: 70vw;
  display: flex;
  position: relative;
  grid-column: 1 / 3;
  margin-top: 1rem;
  position: relative;
}

.incoming-button-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  grid-column: 1 / 3;
  margin-top: 0.5rem;
}
.connection-btn {
  width: 100%;
}

.message-text-wrapper {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--background-card-message);
  border-radius: var(--border-radius);
  width: 100%;
  grid-column: 1 / 3;
  font-family: 'Raleway';
  font-style: italic;
}
.message-wrapper {
  width: 100%;
  grid-column: 1 / 3;
}
.message-wrapper * {
  width: 100%;
}
.message-wrapper p {
  padding-top: 1rem;
  /* font-family: 'Roboto-Regular'; */
}
.message-wrapper .input-area {
  margin-bottom: 0.5rem;
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
  padding-inline: 3rem;
  padding-block: 2rem;
  text-align: left;
  font-weight: 500;
}
.button-container {
  padding-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media screen and (min-width: 500px) {
  .user-info-element,
  .button-wrapper {
    width: 400px;
  }
}

@media screen and (min-width: 700px) {
  .dialog-container {
    width: 450px;
  }
}

@media screen and (min-width: 1000px) {
  .dialog-container {
    width: 600px;
  }
}
</style>
