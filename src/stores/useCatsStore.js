import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
const router = useRouter()
export const useCatsStore = defineStore('cats', () => {
  const state = reactive({
    cats: {},
    currentCat: {
      id: '',
      name: '',
      age: '',
      description: ''
    },
    orderBy: 'created_at',
    fetchError: ''
  })

  const fetchCats = async () => {
    const { data, error } = await supabase
      .from('cats')
      .select()
      // .eq('user_id', userStore.state.userId)
      .order(state.orderBy, { ascending: false })
    if (error) {
      state.fetchError = 'could not fetch cats'
      console.log(error)
      state.cats = {}
    }
    if (data) {
      state.cats = data
      state.fetchError = null
      console.log(state.cats)
    }
  }

  const fetchCat = async () => {
    const { data, error } = await supabase
      .from('cats')
      .select()
      .eq('id', state.currentCat.id)
      .single()
    if (error) {
      console.log(state.currentCat.id)
      router.push('/')
      return
    }
    if (data) {
      console.log(data)
    }
    ;(state.currentCat.name = data.name),
      (state.currentCat.age = data.age),
      (state.currentCat.description = data.description)
  }

  return {
    state,
    fetchCats,
    fetchCat
  }
})
