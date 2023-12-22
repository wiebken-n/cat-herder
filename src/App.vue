<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
// import UserAccount from '@/components/UserAccount.vue'
import UserAuth from '@/components/UserAuth.vue'
import { supabase } from '@/supabase'
import { useUserStore } from './stores/useUserStore'
import NavComponent from '@/components/NavComponent.vue'
import LandingPageView from '@/views/LandingPageView.vue'
import LogoComponent from '@/components/LogoComponent.vue'

const userStore = useUserStore()

const session = ref('')
const userId = ref('')

onMounted(() => {
  // console.log('before fetch: ')
  // console.log(session)

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      // console.log(error)
    }
    if (data) {
      session.value = data.session
      // console.log('after fetch: ')
      // console.log(data.session)
      userId.value = data.session.user.id
      userStore.state.userId = data.session.user.id
      // console.log(userId.value)
    }
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    // console.log(session.value)
  })
})
</script>

<template>
  <div class="container">
    <div v-if="!session">
      <LandingPageView />
    </div>
    <div v-else>
      <LogoComponent
        class="logo-component"
        data-cy="logo-component"
        v-if="session"
        :session="session"
      />
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
  z-index: 1;
  width: max-content;
  right: 0px;
  top: 0px;
}
.logo-component {
  position: absolute;
  z-index: 1;
  width: 2rem;
  height: 2rem;
  left: 5px;
  top: 5px;
}
</style>
