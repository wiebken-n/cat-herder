<template>
  <div class="content-wrapper">
    <header><h1>Deine Co-Herder</h1></header>
    <div class="connected-herders-info">
      <form class="form-search-user" @submit.prevent>
        <PrimeInputText v-model="userName" class="usersearch-input"></PrimeInputText>
        <PrimeButton
          @click="searchUser()"
          label="Suche einen Herder"
          class="usersearch-button"
        ></PrimeButton>
      </form>

      <div class="user-info-container">
        <div class="user-info" v-for="user of allConnectionUsers.value" :key="user">
          <HerderData
            :user="user"
            :connectionStatus="checkConnectionStatus(user)"
            @interaction="fetchAllConnections"
          />
        </div>
      </div>

      <article class="user-info-wrapper">
        <Toast position="top-center" />
        <PrimeDialog
          v-model:visible="usersFound"
          modal
          header="Folgende Nutzer wurden gefunden"
          :style="{ width: '50rem' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          class="searchresult-dialog"
        >
          <div
            class="user-info-container dialog-content"
            :class="{ justOneUser: userSearchResults.value.length < 2 }"
          >
            <div class="user-info" v-for="user of userSearchResults.value" :key="user">
              <HerderData
                :user="user"
                :connectionStatus="checkConnectionStatus(user)"
                @interaction="fetchAllConnections"
              />
            </div>
          </div>
        </PrimeDialog>
      </article>
    </div>
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

const usersFound = ref(false)
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
    console.log(data)
    userSearchResults.value = data
    if (data.length < 1) {
      noUserFound()
    } else usersFound.value = true
  }
}

function extractUserIdsFromConnections() {
  const ids = []
  for (let connection of allConnections.value) {
    if (connection.user_passive !== userStore.state.userId && connection.user_passive !== null) {
      ids.push(connection.user_passive)
    }
    if (connection.user_active !== userStore.state.userId && connection.user_active !== null)
      ids.push(connection.user_active)
  }
  allConnectionIds.value = ids
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

async function fetchAllConnections() {
  await fetchActiveRequests()
  await fetchConnections()
  await fetchPassiveRequests()
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
  if (loading.value === 3) {
    setTimeout(() => {
      combineConnectionData()
    }, 100)
  }
})

function combineConnectionData() {
  loading.value = 0
  const combinedConnections = passiveRequests.value
    .concat(activeRequests.value)
    .concat(connections.value)
  allConnections.value = combinedConnections

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
  // await fetchAllConnections()
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
  text-align: center;
  position: relative;
  padding-bottom: 2rem;
}
.connected-herders-info {
  width: 80vw;
}
.form-search-user {
  width: 100%;
  margin-bottom: 1.5rem;
  display: grid;
}

.user-info-container {
  padding: 1.25rem;
  display: grid;
  gap: 1.5rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
}

.usersearch-input {
  width: 100%;
}
.usersearch-button {
  width: 100%;
}
.dialog-content {
  padding-block: 1rem;
}

.user-info-wrapper {
  display: grid;
}

.user-info {
  width: 100%;
}
@media screen and (min-width: 500px) {
  .connected-herders-info {
    width: 350px;
  }
}

@media screen and (min-width: 700px) {
  .connected-herders-info {
    width: 70vw;
  }
  .user-info-container {
    grid-template-columns: 1fr 1fr;
  }
  .justOneUser {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .justOneUser > * {
    width: 400px;
  }
}
@media screen and (min-width: 800px) {
  .form-search-user {
    grid-template-columns: 2fr 1fr;
    gap: 0.5rem;
  }
}
@media screen and (min-width: 1000px) {
  .connected-herders-info {
    width: 800px;
  }
}
</style>
