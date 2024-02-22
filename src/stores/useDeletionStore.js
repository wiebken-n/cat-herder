import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useDeletionStore = defineStore('deletion', () => {
  const state = reactive({
    deletionActive: false
  })
  return {
    state
  }
})
