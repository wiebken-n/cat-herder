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
    full_name: '',
    herderConnections: '',
    herders: '',
    darkmode: false
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
        .select(`username, avatar_url, darkmode`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        console.log(data)
        ;(state.username = data.username),
          (state.avatar_url = data.avatar_url),
          (state.darkmode = data.darkmode)
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

  onBeforeMount(() => {
    fetchHerders()
  })
  return {
    state,
    fetchState,
    getProfile,
    fetchUser,
    fetchHerders,
    fetchHerderProfiles
  }
})
