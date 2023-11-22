import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', () => {
  const state = reactive({
    userId: ''
  })

  return {
    state
  }
})


