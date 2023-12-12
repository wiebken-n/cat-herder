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

    <h2 class="username">{{ user.username }}</h2>
    <!-- {{ props.connectionStatus }} -->

    <div class="button-wrapper">
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
        @click="deleteRequest(props.user)"
        outlined
      ></PrimeButton>
      <PrimeButton
        class="connection-btn"
        v-if="props.connectionStatus === 'pending incoming'"
        @click="acceptRequest(props.user)"
        label="Anfrage annehmen"
        outlined
      ></PrimeButton>
      <PrimeButton
        class="connection-btn"
        v-if="props.connectionStatus === 'pending outgoing'"
        label="Anfrage zurücknehmen"
        @click="deleteRequest(props.user)"
        outlined
      ></PrimeButton>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  user: Object,
  connectionStatus: String
})
const emit = defineEmits(['interaction'])

async function sendRequest(user) {
  const { data, error } = await supabase
    .from('user_connections')
    .insert([{ user_passive: user.id }])
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
  emit('interaction')
  return
}

async function acceptRequest(user) {
  const userId = user.id
  const { data, error } = await supabase
    .from('user_connections')
    .update({ connected: true })
    .eq('user_active', userId)

  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
  emit('interaction')
  return
}

async function deleteRequest(user) {
  const { data, error } = await supabase
    .from('user_connections')
    .delete()
    .or(`user_active.eq.${user.id},user_passive.eq.${user.id}`)

  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
  emit('interaction')
  return
}

// function checkConnectionStatus(user) {
//   const status = ref('no connection')
//   // check if that user has send a request to current user
//   for (const entry of props.passiveRequests.value) {
//     if (user.id === entry.user_active) {
//       status.value = 'pending incoming'
//     }
//   }
//   // check if that user has been send a request by current user
//   for (const entry of props.activeRequests.value) {
//     if (user.id === entry.user_passive) {
//       status.value = 'pending outgoing'
//     }
//   }

//   for (const entry of props.connections.value) {
//     if (user.id === entry.user_active || user.id === entry.user_passive) {
//       status.value = 'connected'
//     }
//   }
//   return status.value
// }
</script>

<style scoped>
.user-info-element {
  background-color: rgb(238, 238, 238);
  border: 2px solid var(--primary);
  display: grid;
  grid-template-columns: 2rem auto;
  row-gap: 0.5rem;
  align-items: center;
  justify-items: center;
  padding: 1rem;
  width: 100%;
  position: relative;
  border-radius: 10px;
}
.user-icon {
  height: 2rem;
  width: 2rem;
}
.username {
  font-size: 1.5rem;
  padding-left: 1.5rem;
  margin-right: auto;
  margin-block: 0;
}
.button-wrapper {
  width: 100%;
  display: flex;
  position: relative;
  grid-column: 1 / 3;
}
.connection-btn {
  width: 100%;
}
</style>
