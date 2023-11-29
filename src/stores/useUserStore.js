import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', () => {
  const state = reactive({
    userId: '',
    username: '',
    usernameOld: '',
    avatar_url: '',
    full_name: ''
  })

  return {
    state
  }
})
