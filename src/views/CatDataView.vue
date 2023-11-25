<template>
  <!-- <div>
    <p>{{ props.name }}</p>
    <p>{{ props.age }}</p>
    <p>{{ props.description }}</p>
  </div> -->
  <div v-if="!editMode">
    <h2>{{ catsStore.state.currentCat.id }}</h2>
    <h1>{{ catsStore.state.currentCat.name }}</h1>
    <h1>{{ catsStore.state.currentCat.age }}</h1>
    <h1>{{ catsStore.state.currentCat.description }}</h1>

    <Button @click="editMode = true">Edit</Button>
    <Button @click="deleteCat()">Delete</Button>
    <p>{{ formError }}</p>

    <div v-for="food of foodData.description" :key="food.id">{{ food.description }}</div>
    <div><input type="text" name="new-food" id="new-food" v-model="foodData.newFood" /></div>
    <div><Button @click="addFood()">add food</Button></div>
  </div>
  <div v-if="editMode">
    <h2>{{ catId }}</h2>
    <input type="text" name="catName" id="catAge" v-model="catData.name" />
    <br />
    <input type="text" name="catAge" id="catAge" v-model="catData.age" />

    <br /><input
      type="text"
      name="catDescription"
      id="catDescription"
      v-model="catData.description"
    />
    <br />
    <!-- <h1>{{ catData.name }}</h1>
    <h1>{{ catData.age }}</h1>
    <h1>{{ catData.description }}</h1> -->
    <Button @click="updateCat()">Update</Button>
  </div>
  <div>
    <Button @click="router.push('/')">back to home</Button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, reactive, onUpdated } from 'vue'
import { supabase } from '@/supabase'
import { useCatsStore } from '../stores/useCatsStore'

const catsStore = useCatsStore()

const catData = reactive({
  name: '',
  age: '',
  description: ''
})
const foodData = reactive({
  newFood: '',
  description: '',
  fooditems: []
})

const editMode = ref(false)
const formError = ref('')
const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
// const props = defineProps({
//   name: String,
//   age: Number,
//   description: String
// })

const catId = route.params.id
catsStore.state.currentCat.id = route.params.id

const fetchCat = async () => {
  const { data, error } = await supabase.from('cats').select().eq('id', catId).single()
  if (error) {
    router.push('/')
    return
  }
  if (data) {
    console.log(data)
  }
  ;(catData.name = data.name), (catData.age = data.age), (catData.description = data.description)
}
// const fetchCats = async () => {
//   const { data, error } = await supabase
//     .from('cats')
//     .select()
//     // .eq('user_id', userStore.state.userId)
//     .order(orderBy.value, { ascending: false })
//   if (error) {
//     fetchError.value = 'could not fetch cats'
//     console.log(error)
//     cats.value = {}
//   }
//   if (data) {
//     cats.value = data
//     fetchError.value = null
//   }
// }
const fetchFood = async () => {
  console.log(catId)
  const { data, error } = await supabase.from('food').select().eq('cat_id', catId)
  if (error) {
    errorMessage.value = error
    console.log(error)
    return
  }
  if (data) {
    console.log(data)
    errorMessage.value = null
  }
  foodData.description = data
}

const addFood = async () => {
  let description = foodData.newFood
  let cat_id = catId
  console.log(cat_id + ', ' + description)
  const { data, error } = await supabase.from('food').insert([{ cat_id, description }])

  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    console.log(data)
    formError.value = ''
  }
  fetchFood()
}

const deleteCat = async () => {
  const { data, error } = await supabase.from('cats').delete().eq('id', catId)

  if (error) {
    console.log(error)
    formError.value = error
    return
  }

  if (data) {
    console.log(data)

    return
  }
  router.push('/')
}
const updateCat = async () => {
  if (!catData.name || !catData.age || !catData.description) {
    formError.value = 'please fill out all fields'
    return
  }
  let name = catData.name
  let age = catData.age
  let description = catData.description
  const { data, error } = await supabase
    .from('cats')
    .update({ name, age, description })
    .eq('id', catId)
    .select()
  if (error) {
    console.log(error)
    formError.value = 'That went wrong'
  }
  if (data) {
    console.log(data)
    editMode.value = false
    fetchCat()
  }
}
onBeforeMount(() => {
  catsStore.fetchCat()
  fetchFood()
})
onUpdated(() => {})
</script>
