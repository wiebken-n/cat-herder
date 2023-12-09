<template>
  <div class="content-wrapper">
    <header><h1>Herders</h1></header>
    <div class="user-info-element" v-for="user of allConnectionUsers.value" :key="user.id">
      <HerderData :user="user" :connectionStatus="checkConnectionStatus(user)" />
    </div>
    <form class="form-search-user" @submit.prevent>
      <PrimeInputText v-model.trim="userName"></PrimeInputText>
      <PrimeButton @click="searchUser" label="Suche einen Herder"></PrimeButton>
    </form>
    <article class="user-info-wrapper">
      <Toast position="top-center" />
      <div class="user-info-element" v-for="user of userSearchResults.value" :key="user.id">
        <HerderData :user="user" :connectionStatus="checkConnectionStatus(user)" />
      </div>
    </article>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
import { useToast } from 'primevue/usetoast'
import HerderData from '../components/HerderData.vue'

const toast = useToast()

const userStore = useUserStore()

const userName = ref('')

const loading = ref(0)
const userSearchResults = reactive({})
const passiveRequests = reactive({})
const activeRequests = reactive({})
const connections = reactive({})
const allConnections = reactive({})
const allConnectionIds = reactive({})
const allConnectionUsers = reactive({})

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

function extractUserIdsFromConnections() {
  const ids = []
  for (let connection of allConnections.value) {
    console.log(connection)

    if (connection.user_passive !== userStore.state.userId && connection.user_passive !== null) {
      ids.push(connection.user_passive)
    }
    if (connection.user_active !== userStore.state.userId && connection.user_active !== null)
      ids.push(connection.user_active)
  }
  allConnectionIds.value = ids
  console.log(ids)
  console.log(allConnectionIds.value)
}
async function getUserData() {
  const { data, error } = await supabase.from('profiles').select().in('id', allConnectionIds.value)
  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
    allConnectionUsers.value = data
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
    loading.value++
  }
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
    loading.value++
    if (data.length > 0) {
      // const userData = await userStore.fetchUser(data[0].user_active)
    }
  }
}
async function fetchConnections() {
  let { data, error } = await supabase.from('user_connections').select().eq('connected', true)

  if (data) {
    connections.value = data
    loading.value++
  }
  if (error) {
    console.log(error)
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
watch(loading, () => {
  console.log(loading.value)
  if (loading.value === 3) {
    setTimeout(() => {
      combineConnectionData()
    }, 100)
  }
})

function combineConnectionData() {
  console.log('y')
  const combinedConnections = passiveRequests.value
    .concat(activeRequests.value)
    .concat(connections.value)
  console.log(combinedConnections)
  allConnections.value = combinedConnections
  console.log(allConnections.value)

  extractUserIdsFromConnections()
  getUserData()
}

// -------- doesn't work for using in for loop @template (fetch to slow -> renders before promise resolved) ------

// async function fetchConnectionStatus(user) {
//   let { data, error } = await supabase
//     .from('user_connections')
//     .select()
//     .or(`user_active.eq.${user.id},user_passive.eq.${user.id}`)
//     .single()

//   const status = ref('')
//   console.log(user)
//   if (data) {
//     console.log(data)
//     if (data.connected) {
//       status.value = 'connection established'
//       // return 'connection established'
//     }
//     if (!data.connected) {
//       if (data.user_active === user.id) {
//         status.value = 'incoming request'
//         // return 'incoming request'
//         // } else return 'outgoing request'
//         status.value = 'outgoing request'
//       }
//     }
//   }
//   if (error) {
//     status.value = 'no connection'
//     // return 'no connection'
//   }
//   console.log(status.value)
//   return status
// }

// async function fetchPendingConnectionStatus(user) {
//   console.log(user)
//   let { data, error } = await supabase
//     .from('user_connections')
//     .select()
//     .eq('connected', false)
//     .or(`user_active.eq.${user.id},user_passive.eq.${user.id}`)
//     .single()

//   if (data) {
//     console.log(data)
//     if (data.user_active === user.id) {
//       return 'incoming request'
//     }
//     if (data.user_passive === user.id) {
//       return 'outgoing request'
//     }
//   }

//   if (error) {
//     console.log(error)
//   }
// }

onBeforeMount(async () => {
  await fetchPassiveRequests()
  await fetchActiveRequests()
  await fetchConnections()
  console.log('x')
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
