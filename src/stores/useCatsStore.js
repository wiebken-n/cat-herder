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
      avatar: '',
      birthday: '',
      food_info: '',
      health_info: '',
      behaviour_info: ''

      // age: '',
      // description: ''
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
    }
  }

  const fetchCat = async (id) => {
    const { data, error } = await supabase.from('cats').select().eq('id', id).single()
    console.log(id)
    if (error) {
      router.push('/')
      return
    }
    if (data) {
      state.currentCat.name = data.name
      state.currentCat.id = data.id
      state.currentCat.birthday = data.birthday
      state.currentCat.avatar = data.avatar
    }
  }

  const fetchFoodInfo = async (id) => {
    const { data, error } = await supabase.from('food').select().eq('cat_id', id).single()
    console.log(id)
    if (error) {
      state.fetchError = error
      console.log(error)
      return
    }
    if (data) {
      state.currentCat.food_info = data.food_info
      console.log(data)
    }
  }
  const fetchHealthInfo = async (id) => {
    const { data, error } = await supabase.from('health').select().eq('cat_id', id).single()
    console.log(id)
    if (error) {
      state.fetchError = error
      console.log(error)
      return
    }
    if (data) {
      state.currentCat.health_info = data.health_info
      console.log(data)
    }
  }

  const fetchBehaviourInfo = async (id) => {
    const { data, error } = await supabase.from('behaviour').select().eq('cat_id', id).single()
    console.log(id)
    if (error) {
      state.fetchError = error
      console.log(error)
      return
    }
    if (data) {
      state.currentCat.behaviour_info = data.behaviour_info
      console.log(data)
    }
  }

  function getAge(birthday) {
    let newBirthday = new Date(birthday)
    // calculates age in years or month and returns that number + the according "label"
    if (newBirthday.length <= 0) {
      return
    }
    let birthMonth = newBirthday.getMonth()
    let currentDate = new Date()
    let currentMonth = currentDate.getMonth()
    let difference = currentDate - newBirthday
    let age = new Date(difference)
    let ageYears = Math.ceil(age.getFullYear() - 1970)
    let ageMonth = 0
    if (ageYears < 1) {
      ageMonth = currentMonth - birthMonth
      if (currentMonth < birthMonth) {
        ageMonth = 12 - birthMonth + currentMonth
      }
      let monthText = ageMonth > 1 || ageMonth === 0 ? 'Monate' : 'Monat'
      return ageMonth + ' ' + monthText
    }
    let yearText = ageYears > 1 || ageYears === 0 ? 'Jahre' : 'Jahr'
    return ageYears + ' ' + yearText
  }

  return {
    state,
    fetchCats,
    fetchCat,
    fetchFoodInfo,
    fetchHealthInfo,
    fetchBehaviourInfo,
    getAge
  }
})
