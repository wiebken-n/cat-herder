<template>
  <div>
    <header><h1 @click="searchUser">Herders</h1></header>
    <PrimeInputText v-model="userName"></PrimeInputText>
    <PrimeButton @click="searchUser" label="Suche einen Herder"></PrimeButton>
    <div>{{ userSearchResults }}</div>
    <PrimeButton @click="addUser()">Add user</PrimeButton>
    <PrimeButton @click="fetchPassiveRequests()"></PrimeButton>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
const userStore = useUserStore()

const userName = ref('')

const userSearchResults = reactive({})
const passiveRequests = reactive({})
const activeRequests = reactive({})

async function searchUser() {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .textSearch('username', userName.value)
  if (error) {
    console.log(error)
  }
  if (data) {
    userSearchResults.value = data
    console.log(data)
  }
}

async function addUser() {
  const { data, error } = await supabase
    .from('user_connections')
    .insert([{ user_passive: userSearchResults.value[0].id }])
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }
}

async function fetchPassiveRequests() {
  let { data, error } = await supabase
    .from('user_connections')
    .select()
    .eq('user_passive', userStore.state.userId)

  if (data) {
    passiveRequests.value = data
    console.log(data)
    if (data.length > 0) {
      const userData = await userStore.fetchUser(data[0].user_passive)
      console.log(userData)
    }
  }
  if (error) {
    console.log(error)
  }
}

async function fetchActiveRequests() {
  let { data, error } = await supabase
    .from('user_connections')
    .select()
    .eq('user_active', userStore.state.userId)

  if (data) {
    activeRequests.value = data
    console.log(data)

    if (data.length > 0) {
      const userData = await userStore.fetchUser(data[0].user_active)
      console.log(userData)
    }
  }
  if (error) {
    console.log(error)
  }
}
onMounted(async () => {
  await fetchPassiveRequests()
  await fetchActiveRequests()
})
</script>
<style scoped></style>
