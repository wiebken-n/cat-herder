import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('users', () => {
  const state = reactive({
    userId: '',
    username: '',
    usernameOld: '',
    avatar_url: '',
    full_name: ''
  })
  const fetchState = reactive({
    loading: false,
    error: '',
    status: ''
  })

  async function getProfile(session) {
    console.log(fetchState)
    try {
      fetchState.loading = true
      const { user } = session.value

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, full_name`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        ;(state.username = data.username),
          (state.avatar_url = data.avatar_url),
          (state.full_name = data.full_name)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      fetchState.loading = false
      state.usernameOld = state.username
    }
  }

  return {
    state,
    fetchState,
    getProfile
  }
})
