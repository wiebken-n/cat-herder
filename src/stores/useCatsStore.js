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
      birthday: '',
      food_info: '',
      health_info: '',
      behaviour_info: '',

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

  const fetchCat = async (id) => {
    const { data, error } = await supabase.from('cats').select().eq('id', id).single()
    console.log(id)
    if (error) {
      console.log(id)
      router.push('/')
      return
    }
    if (data) {
      console.log(data)
      state.currentCat.name = data.name
      state.currentCat.id = data.id
      state.currentCat.birthday = data.birthday
      console.log(state.currentCat)
    }
  }

  function getAge(birthday) {
    console.log(birthday)
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
    console.log(age.getFullYear() - 1970)
    let ageMonth = 0
    if (ageYears < 1) {
      ageMonth = currentMonth - birthMonth
      console.log(currentMonth + '; ' + birthMonth)
      if (currentMonth < birthMonth) {
        ageMonth = 12 - birthMonth + currentMonth
        console.log(ageMonth + 'xxx')
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
    getAge
  }
})
