<template>
  <div class="content-wrapper">
    <header><h1>Herders</h1></header>
    <form class="form-search-user" @submit.prevent>
      <PrimeInputText v-model.trim="userName"></PrimeInputText>
      <PrimeButton @click="searchUser" label="Suche einen Herder"></PrimeButton>
    </form>
    <article class="user-info-wrapper">
      <Toast position="top-center" />
      <div
        @click="acceptRequest(user)"
        class="user-info-element"
        v-for="user of userSearchResults.value"
        :key="user"
      >
        <svg class="user-icon">
          <use
            v-if="checkConnectionStatus(user) === 'no connection'"
            xlink:href="@/assets/icons.svg#user"
            fill="currentcolor"
          ></use>
          <use
            v-if="
              checkConnectionStatus(user) === 'pending incoming' ||
              checkConnectionStatus(user) === 'pending outgoing'
            "
            xlink:href="@/assets/icons.svg#user-pending"
            fill="currentcolor"
          ></use>
          <use
            v-if="checkConnectionStatus(user) === 'connected'"
            xlink:href="@/assets/icons.svg#user-added"
            fill="currentcolor"
          ></use>
        </svg>
        <h2>{{ user.username }}</h2>
        <p>{{ checkConnectionStatus(user) }}</p>
      </div>
    </article>
    <PrimeButton @click="addUser()">Add user</PrimeButton>
    <PrimeButton @click="fetchPassiveRequests()"></PrimeButton>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const userStore = useUserStore()

const userName = ref('')

const userSearchResults = reactive({})
const passiveRequests = reactive({})
const activeRequests = reactive({})
const connections = reactive({})

// const noUserFound = ref(false)

const noUserFound = () => {
  toast.add({
    severity: 'info',
    summary: 'Achtung',
    detail: 'Es wurde kein Nutzer gefunden',
    life: 3000
  })
}

async function searchUser() {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .textSearch('username', userName.value)
    .neq('id', userStore.state.userId)

  if (error) {
    console.log(error)
  }
  if (data) {
    userSearchResults.value = data
    if (data.length < 1) {
      noUserFound()
    }
  }
}

async function addUser(userId) {
  const { data, error } = await supabase
    .from('user_connections')
    .insert([{ user_passive: userId }])
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

async function fetchPassiveRequests() {
  let { data, error } = await supabase
    .from('user_connections')
    .select()
    .eq('user_passive', userStore.state.userId)
    .eq('connected', false)
  if (error) {
    console.log(error)
  }
  if (data) {
    passiveRequests.value = data
  }
}

function checkConnectionStatus(user) {
  const status = ref('no connection')
  // check if that user has send a request to current user
  for (const entry of passiveRequests.value) {
    if (user.id === entry.user_active) {
      status.value = 'pending incoming'
    }
  }
  // check if that user has been send a request by current user
  for (const entry of activeRequests.value) {
    if (user.id === entry.user_passive) {
      status.value = 'pending outgoing'
    }
  }

  for (const entry of connections.value) {
    if (user.id === entry.user_active || user.id === entry.user_passive) {
      status.value = 'connected'
    }
  }
  return status.value
}

async function fetchActiveRequests() {
  let { data, error } = await supabase
    .from('user_connections')
    .select()
    .eq('user_active', userStore.state.userId)
    .eq('connected', false)

  if (error) {
    console.log(error)
  }

  if (data) {
    activeRequests.value = data

    if (data.length > 0) {
      // const userData = await userStore.fetchUser(data[0].user_active)
    }
  }
}
async function fetchConnections() {
  let { data, error } = await supabase.from('user_connections').select().eq('connected', true)

  if (data) {
    connections.value = data
    if (data.length > 0) {
      // const userData = await userStore.fetchUser(data[0].user_active)
    }
  }
  if (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await fetchPassiveRequests()
  await fetchActiveRequests()
  await fetchConnections()
})
</script>
<style scoped>
.content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: start;
  position: relative;
  padding-bottom: 2rem;
}

.content-wrapper > * {
  width: 70vw;
}
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

/* .content-wrapper > * > * {
  width: 100%;
} */
</style>
