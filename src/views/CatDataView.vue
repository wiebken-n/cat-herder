<template>
  <!-- <div>
    <p>{{ props.name }}</p>
    <p>{{ props.age }}</p>
    <p>{{ props.description }}</p>
  </div> -->
  <div v-if="!editMode">
    <h2>{{ catId }}</h2>
    <h1>{{ catData.name }}</h1>
    <h1>{{ catData.age }}</h1>
    <h1>{{ catData.description }}</h1>
    <button @click="editMode = true">Edit</button>
    <button @click="deleteCat()">Delete</button>
    <p>{{ formError }}</p>
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
    <button @click="updateCat()">Update</button>
  </div>
  <div>
    <button @click="router.push('/')">back to home</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, reactive, onUpdated } from 'vue'
import { supabase } from '@/supabase'

const catData = reactive({
  name: '',
  age: '',
  description: ''
})
const editMode = ref(false)
const formError = ref('')
const route = useRoute()
const router = useRouter()
// const props = defineProps({
//   name: String,
//   age: Number,
//   description: String
// })

const catId = route.params.id

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
  fetchCat()
})
onUpdated(() => {})
</script>
