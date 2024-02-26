<template>
  <div class="content-wrapper">
    <header><h1>Deine Co-Herder</h1></header>
    <div class="connected-herders-info">
      <form class="form-search-user" @submit.prevent>
        <PrimeInputText
          @keyup.enter="searchUser"
          v-model="userName"
          class="usersearch-input"
        ></PrimeInputText>
        <PrimeButton
          @click="searchUser"
          label="Suche einen Herder"
          class="usersearch-button"
        ></PrimeButton>
      </form>

      <div class="user-info-container">
        <div class="info-no-connections" v-if="userStore.connectionData.users.userdata.length == 0">
          <p>Du bist noch nicht mit anderen Herdern verbunden</p>
        </div>
        <div class="user-info" v-for="user of userStore.connectionData.users.userdata" :key="user">
          <HerderData
            tabindex="0"
            :user="user"
            :connectionStatus="checkConnectionStatus(user)"
            @interaction="userStore.fetchAllConnections()"
            :showButton="false"
            @click="userInteraction(user)"
            @keyup.enter="userInteraction(user)"
          />
          <div v-if="user === activeUser">
            <PrimeDialog :header="user.username" v-model:visible="userContextMenu">
              <HerderDataContext
                :user="user"
                :connectionStatus="checkConnectionStatus(user)"
                @interaction="userStore.fetchAllConnections()"
                @connectionDeleted="throwToastDeleted(user)"
                @connectionEstablished="throwToastAdded(user)"
                @requestSend="throwToastRequestSend(user)"
                @requestDeleted="throwToastRequestDeleted(user)"
                :showButton="true"
            /></PrimeDialog>
          </div>
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
                tabindex="0"
                :user="user"
                :connectionStatus="checkConnectionStatus(user)"
                @interaction="userStore.fetchAllConnections()"
                :showButton="false"
                @click="userInteraction(user)"
                @keyup.enter="userInteraction(user)"
              />
              <div v-if="user === activeUser">
                <PrimeDialog :header="user.username" v-model:visible="userContextMenu">
                  <HerderDataContext
                    :user="user"
                    :connectionStatus="checkConnectionStatus(user)"
                    @interaction="userStore.fetchAllConnections()"
                    @connectionDeleted="throwToastDeleted(user)"
                    @connectionEstablished="throwToastAdded(user)"
                    @requestSend="throwToastRequestSend(user)"
                    @requestDeleted="throwToastRequestDeleted(user)"
                    @messageSend="throwToastMessageSend(user)"
                    :showButton="true"
                /></PrimeDialog>
              </div>
            </div>
          </div>
        </PrimeDialog>
      </article>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
import { useToast } from 'primevue/usetoast'
import HerderDataContext from '@/components/HerderDataContext.vue'
import HerderData from '@/components/HerderData.vue'

const toast = useToast()

const userStore = useUserStore()

const userName = ref('')

userStore.$subscribe(() => {
  if (userStore.connectionData.loading === 3) {
    userStore.combineConnectionData()
  }
})

// const loading = ref(0)

const usersFound = ref(false)
const userContextMenu = ref(false)
const userSearchResults = reactive({})
const activeUser = ref('')
// const passiveRequests = reactive({})
// const activeRequests = reactive({})
// const connections = reactive({})

// const allConnections = reactive({})
// const allConnectionIds = reactive({})
// const allConnectionUsers = reactive({})

// const noUserFound = ref(false)

const noUserFound = () => {
  toast.add({
    severity: 'info',
    summary: 'Achtung',
    detail: 'Es wurde kein Nutzer gefunden',
    life: 3000
  })
}

const throwToastDeleted = (user) => {
  toast.add({
    severity: 'info',
    summary: 'Verbindung getrennt',
    detail: `Du hast die Verbindung mit ${user.username} getrennt`,
    life: 3000
  })
}
const throwToastAdded = (user) => {
  toast.add({
    severity: 'info',
    summary: 'Verbindung hergestellt',
    detail: `Du bist nun mit ${user.username} verbunden`,
    life: 3000
  })
}
const throwToastRequestSend = (user) => {
  toast.add({
    severity: 'info',
    summary: 'Anfrage gesendet',
    detail: `Du hast eine Verbindungsanfrage an ${user.username} gesendet`,
    life: 3000
  })
}
const throwToastMessageSend = (user) => {
  toast.add({
    severity: 'info',
    summary: 'Nachricht gesendet',
    detail: `Du hast eine Nachricht an ${user.username} gesendet`,
    life: 3000
  })
}
const throwToastRequestDeleted = (user) => {
  toast.add({
    severity: 'info',
    summary: 'Anfrage gelöscht',
    detail: `Du hast deine Verbindungsanfrage an ${user.username} gelöscht`,
    life: 3000
  })
}
async function searchUser() {
  if (userName.value.length < 2 || userName.value.length > 20) {
    toast.add({
      severity: 'info',
      summary: 'Achtung',
      detail: 'Bitte gib für die Suche zwischen 2 und 20 Zeichen ein',
      life: 3000
    })
    return
  }
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .ilike('username', `%${userName.value}%`)
    .neq('id', userStore.state.userId)
    .neq('account_deleted', true)

  if (error) {
    console.log(error)
  }
  if (data) {
    userSearchResults.value = data
    if (data.length < 1) {
      noUserFound()
    } else usersFound.value = true
  }
}

function userInteraction(user) {
  activeUser.value = user
  userContextMenu.value = !userContextMenu.value
}

function checkConnectionStatus(user) {
  const status = ref('no connection')
  // check if that user has send a request to current user
  for (const entry of userStore.connectionData.connections.incoming) {
    if (user.id === entry.user_active) {
      status.value = 'pending incoming'
    }
  }
  // check if that user has been send a request by current user
  for (const entry of userStore.connectionData.connections.outgoing) {
    if (user.id === entry.user_passive) {
      status.value = 'pending outgoing'
    }
  }

  for (const entry of userStore.connectionData.connections.connected) {
    if (user.id === entry.user_active || user.id === entry.user_passive) {
      status.value = 'connected'
    }
  }
  return status.value
}

onBeforeMount(async () => {
  await userStore.fetchAllConnections()
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
  gap: 0.5rem;
}

.user-info-container {
  margin-top: 3px;
  padding: 1.25rem;
  display: grid;
  gap: 1.25rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
}
.info-no-connections {
  font-weight: 500;
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

  .info-no-connections {
    grid-column: 1 / 3;
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
