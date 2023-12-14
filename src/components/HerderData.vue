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

    <div
      v-if="
        showButton &&
        (props.connectionStatus === 'no connection' ||
          props.connectionStatus === 'pending incoming' ||
          props.connectionStatus === 'pending outgoing')
      "
      class="button-wrapper"
    >
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
    <div v-if="showButton && props.connectionStatus === 'connected'" class="buffer">
      Ihr seid verbunden
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  user: Object,
  connectionStatus: String,
  showButton: Boolean
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
</script>

<style scoped>
.user-info-element {
  background-color: var(--cat-card-background);
  /* box-shadow: 0 0 5px 2px var(--card-shadow-darker); */
  color: var(--text);
  display: grid;
  grid-template-columns: 2rem auto;
  row-gap: 0.5rem;
  align-items: center;
  justify-items: center;
  padding: 1rem;
  width: 100%;
  position: relative;
  border-radius: var(--border-radius);
  transition: all 200ms ease-in-out;
}
.user-info-element:hover {
  background-color: var(--cat-card-background-hover);
}
.user-icon {
  color: var(--cat-card-text);
  height: 2rem;
  width: 2rem;
}
.username {
  color: var(--cat-card-text);
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
.buffer {
  color: var(--cat-card-text);
  font-size: 1.125rem;
  padding-left: 0.1rem;
  display: flex;
  width: 100%;
  align-items: center;
  height: 2.5rem;
  grid-column: 1 / 3;
}
.connection-btn {
  color: var(--inline-button-text);
  width: 100%;
  background-color: var(--card-background);
  transition: all 100ms ease-in-out;
}
.connection-btn:hover {
  background-color: var(--card-background-hover);
}
</style>
