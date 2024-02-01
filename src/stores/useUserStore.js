import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()
  const state = reactive({
    userId: '',
    username: '',
    usernameOld: '',
    avatar_url: '',
    herderConnections: '',
    herders: '',
    darkmode: false,
    demo_role: ''
  })
  const fetchState = reactive({
    loading: false,
    error: '',
    status: ''
  })

  async function getProfile(session) {
    try {
      fetchState.loading = true
      const { user } = session.value

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, darkmode, demo_role`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        ;(state.username = data.username),
          (state.avatar_url = data.avatar_url),
          (state.darkmode = data.darkmode),
          (state.demo_role = data.demo_role)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      fetchState.loading = false
      state.usernameOld = state.username

      // sends user to user account site if they have not added an username
      if (state.username === null) {
        router.push('./user')
      }
    }
  }
  async function fetchUser(userId) {
    let { data, error } = await supabase.from('profiles').select().eq('id', userId)
    if (error) {
      console.log(error)
    }
    if (data) {
      return data
    }
  }

  async function fetchHerders() {
    let { data, error } = await supabase.from('user_connections').select().eq('connected', true)

    if (data) {
      const cacheArray = []
      for (let item of data) {
        cacheArray.push(item.user_passive)
        cacheArray.push(item.user_active)
      }
      state.herderConnections = cacheArray.filter((id) => id !== state.userId && id !== null)
      fetchHerderProfiles()
    }
    if (error) {
      console.log(error)
    }
  }

  async function fetchHerderProfiles() {
    let { data, error } = await supabase.from('profiles').select().in('id', state.herderConnections)

    if (data) {
      state.herders = data

      if (data.length > 0) {
        // const userData = await userStore.fetchUser(data[0].user_active)
      }
    }
    if (error) {
      console.log(error)
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  const connectionData = reactive({
    loading: 0,
    connections: {
      connected: {},
      outgoing: {},
      incoming: {},
      combined: {},
      combinedIds: {}
    },
    users: {
      userdata: {}
    }
  })

  async function fetchConnections() {
    let { data, error } = await supabase.from('user_connections').select().eq('connected', true)

    if (data) {
      connectionData.connections.connected = data
      connectionData.loading++
    }
    if (error) {
      console.log(error)
    }
  }

  async function fetchOutgoingRequests() {
    let { data, error } = await supabase
      .from('user_connections')
      .select()
      .eq('user_active', state.userId)
      .eq('connected', false)

    if (error) {
      console.log(error)
    }

    if (data) {
      connectionData.connections.outgoing = data
      connectionData.loading++
      if (data.length > 0) {
        //      }
      }
    }
  }
  async function fetchIncomingRequests() {
    let { data, error } = await supabase
      .from('user_connections')
      .select()
      .eq('user_passive', state.userId)
      .eq('connected', false)
    if (error) {
      console.log(error)
    }
    if (data) {
      connectionData.connections.incoming = data
      connectionData.loading++
    }
  }

  async function fetchAllConnections() {
    await fetchConnections()
    await fetchOutgoingRequests()
    await fetchIncomingRequests()
  }

  function combineConnectionData() {
    connectionData.loading = 0
    const combinedConnections = connectionData.connections.connected
      .concat(connectionData.connections.outgoing)
      .concat(connectionData.connections.incoming)
    connectionData.connections.combined = combinedConnections

    extractUserIdsFromConnections()
    getUserData()
  }

  function extractUserIdsFromConnections() {
    const ids = []
    for (let connection of connectionData.connections.combined) {
      if (connection.user_passive !== state.userId && connection.user_passive !== null) {
        ids.push(connection.user_passive)
      }
      if (connection.user_active !== state.userId && connection.user_active !== null)
        ids.push(connection.user_active)
    }
    connectionData.connections.combinedIds = ids
  }

  async function getUserData() {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .in('id', connectionData.connections.combinedIds)
    if (error) {
      console.log(error)
    }
    if (data) {
      connectionData.users.userdata = data
    }
  }

  onBeforeMount(async () => {
    await fetchHerders()
    await fetchAllConnections()
  })

  return {
    state,
    fetchState,
    getProfile,
    fetchUser,
    fetchHerders,
    fetchHerderProfiles,
    connectionData,
    fetchConnections,
    fetchOutgoingRequests,
    fetchIncomingRequests,
    fetchAllConnections,
    combineConnectionData
  }
})
