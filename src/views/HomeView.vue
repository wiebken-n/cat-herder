<script setup>
import { onBeforeMount, ref, onUpdated } from 'vue'
// import UserAccount from './components/UserAccount.vue'
// import UserAuth from './components/UserAuth.vue'

import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
// import { useUserStore } from '../stores/useUserStore'

// const userStore = useUserStore()

const router = useRouter()

const session = ref()
const fetchError = ref(null)
const cats = ref({})

const inputName = ref('')
const inputAge = ref()
const inputDescription = ref('')

const formError = ref('')

const orderBy = ref('created_at')
// const fetchPutError = ref(null)

onBeforeMount(() => {
  fetchCats()

  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
onUpdated(() => {
  fetchCats()
})

const fetchCats = async () => {
  const { data, error } = await supabase
    .from('cats')
    .select()
    // .eq('user_id', userStore.state.userId)
    .order(orderBy.value, { ascending: false })
  if (error) {
    fetchError.value = 'could not fetch cats'
    console.log(error)
    cats.value = {}
  }
  if (data) {
    cats.value = data
    fetchError.value = null
  }
}

function getCatData(cat) {
  router.push({ name: 'catdata', params: { id: cat.id } })
}

const submitData = async () => {
  if (!inputName.value || !inputAge.value || !inputDescription.value) {
    formError.value = 'Please fill out all formfields'
    return
  }

  if (typeof Math.round(inputAge.value) !== 'number') {
    formError.value = 'Please use a number for age'
    return
  }
  console.log(inputName.value, inputAge.value, inputDescription.value)

  let name = inputName.value
  let age = inputAge.value
  let description = inputDescription.value
  // let userID = userStore.state.userId
  const { data, error } = await supabase.from('cats').insert([{ name, age, description }])

  if (error) {
    console.log(error)
    formError.value = error
  }
  if (data) {
    console.log(data)
    formError.value = ''
  }
}
// console.log(supabase)
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <div>
      order by:
      <select name="select-order" id="select-order" v-model="orderBy">
        <option value="created_at">created_at</option>
        <option value="name">name</option>
        <option value="age">age</option>
      </select>
    </div>
    <div class="data-output">
      <div v-for="cat in cats" :key="cat.id">
        <!-- {{ cat }} -->
        <p>{{ cat.name }}</p>
        <p>{{ cat.age }}</p>
        <p>{{ cat.description }}</p>
        <button @click="getCatData(cat)">Clicky</button>
        <p>-----------------------------------</p>
      </div>
    </div>
    <div class="data-input">
      <form>
        <div>
          <input type="text" name="cat-name" id="cat-name" v-model="inputName" />

          <label for="cat-name">cat-name</label>
        </div>
        <div>
          <input type="text" name="cat-age" id="cat-age" v-model="inputAge" />
          <label for="cat-age">cat-age</label>
        </div>

        <div>
          <input
            type="text"
            name="cat-description"
            id="cat-description"
            v-model="inputDescription"
          />
          <label for="cat-description">cat-description</label>
        </div>
        <div>
          <button @click.prevent="submitData">Submit Cat Data</button>
        </div>
        <p>{{ formError }}</p>
      </form>
    </div>
    <!-- <UserAccount v-if="session" :session="session" />
    <UserAuth v-else /> -->
  </div>
</template>

<!-- <script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome />
  </main>../stores/useUserStore
</template> -->
