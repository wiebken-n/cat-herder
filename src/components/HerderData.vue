<template>
  <div>
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
    <h2>{{ user.username }}</h2>
    {{ props.connectionStatus }}

    <div></div>
    <div>
      <PrimeButton
        v-if="props.connectionStatus === 'no connection'"
        @click="sendRequest(props.user)"
        label="Verbindung anfragen"
      ></PrimeButton>
      <PrimeButton
        v-if="props.connectionStatus === 'connected'"
        label="Verbindung trennen"
        @click="deleteRequest(props.user)"
      ></PrimeButton>
      <PrimeButton
        v-if="props.connectionStatus === 'pending incoming'"
        @click="acceptRequest(props.user)"
        label="Anfrage annehmen"
      ></PrimeButton>
      <PrimeButton
        v-if="props.connectionStatus === 'pending outgoing'"
        label="Anfrage zurücknehmen"
        @click="deleteRequest(props.user)"
      ></PrimeButton>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  //   passiveRequests: Array,
  //   activeRequests: Array,
  //   connections: Array,
  user: Object,
  connectionStatus: String
})

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
.user-info-wrapper {
  display: grid;
  gap: 1rem;
}
.user-info-element {
  border: 2px solid var(--secondary);
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  padding: 1rem;
}
.user-icon {
  height: 2rem;
  width: 2rem;
}
</style>
