<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
// import UserAccount from '@/components/UserAccount.vue'
import UserAuth from '@/components/UserAuth.vue'
import { supabase } from '@/supabase'
import { useUserStore } from './stores/useUserStore'
import NavComponent from './components/NavComponent.vue'
import LandingPage from './components/LandingPage.vue'

const userStore = useUserStore()

const session = ref('')
const userId = ref('')
const landingPageShow = ref(true)

onMounted(() => {
  console.log('before fetch: ')
  console.log(session)

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.log(error)
    }
    if (data) {
      session.value = data.session
      console.log('after fetch: ')
      console.log(data.session)
      userId.value = data.session.user.id
      userStore.state.userId = data.session.user.id
      console.log(userId.value)
    }
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="container">
    <div v-if="landingPageShow">
      <LandingPage class="landingpage" @toLogin="landingPageShow = false" />
    </div>
    <div v-else>
      <NavComponent
        class="nav-component"
        data-cy="nav-component"
        v-if="session"
        :session="session"
      />
      <RouterView class="routerview" v-if="session" :session="session" />
      <UserAuth v-else />
    </div>
  </div>
</template>

<style scoped>
.nav-component {
  position: absolute;
}
.routerview,
.landingpage {
  padding-top: 1rem;
}
</style>
