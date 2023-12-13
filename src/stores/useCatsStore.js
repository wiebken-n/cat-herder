import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
const userStore = useUserStore()
const router = useRouter()
export const useCatsStore = defineStore('cats', () => {
  const state = reactive({
    cats: {},
    herdedCats: {},
    currentCat: {
      user_id: '',
      id: '',
      name: '',
      avatar: '',
      birthday: '',
      food_info: '',
      health_info: '',
      behaviour_info: '',
      herder_connections: '',
      catHerderProfiles: '',
      herders: '',
      herderProfiles: '',
      profiles: {
        id: '',
        username: ''
      },
      cats_info: [{ food_info: '' }, { health_info: '' }, { behaviour_info: '' }]

      // age: '',
      // description: ''
    },
    orderBy: 'created_at',
    fetchError: ''
  })

  const fetchCats = async () => {
    const { data, error } = await supabase
      .from('cats')
      .select(
        `id, name, avatar, user_id, birthday, herder_connections(id, herder_id, cat_id), cats_info(food_info, health_info, behaviour_info)`
      )
      .eq('user_id', userStore.state.userId)

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

  const fetchHerdedCats = async () => {
    const { data, error } = await supabase
      .from('cats')
      .select(
        `id, name, avatar, user_id, birthday, herder_connections(id, herder_id, cat_id), cats_info(food_info, health_info, behaviour_info), profiles(id, username)`
      )

      .neq('user_id', userStore.state.userId)
      .order(state.orderBy, { ascending: false })
    if (error) {
      state.fetchError = 'could not fetch cats'
      console.log(error)
      state.herdedCats = {}
    }
    if (data) {
      state.herdedCats = data
      state.fetchError = null
    }
  }

  const fetchCat = async (id) => {
    const { data, error } = await supabase
      .from('cats')
      .select(
        `id, name, avatar, user_id, birthday, herder_connections(id, herder_id, cat_id), cats_info(food_info, health_info, behaviour_info), profiles(id, username)`
      )
      .eq('id', id)
      .single()

    if (error) {
      router.push('/')
      return
    }
    if (data) {
      // console.log(data)
      state.currentCat = data
      if (data.herder_connections) {
        const herderIds = []
        for (let connection of data.herder_connections) {
          herderIds.push(connection.herder_id)
        }
        state.currentCat.catHerderProfiles = await fetchCatHerderProfiles(herderIds)
      }
    }
  }

  async function fetchCatHerderProfiles(idArray) {
    let { data, error } = await supabase.from('profiles').select('id, username').in('id', idArray)

    if (data) {
      if (data.length > 0) {
        return data
        // const userData = await userStore.fetchUser(data[0].user_active)
      }
    }
    if (error) {
      console.log(error)
    }
  }

  // const fetchCatInfo = async (id) => {
  //   const { data, error } = await supabase.from('cats_info').select().eq('cat_id', id).single()
  //   if (error) {
  //     state.fetchError = error
  //     console.log(error)
  //     return
  //   }
  //   if (data) {
  //     state.currentCat.food_info = data.food_info
  //     state.currentCat.health_info = data.health_info
  //     state.currentCat.behaviour_info = data.behaviour_info
  //   }
  // }

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
    fetchHerdedCats,
    fetchCat,
    // fetchCatInfo,
    getAge
  }
})
