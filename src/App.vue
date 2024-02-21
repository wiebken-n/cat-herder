<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { supabase } from '@/supabase'
import { useUserStore } from './stores/useUserStore'
import NavComponent from '@/components/NavComponent.vue'
import LandingPageView from '@/views/LandingPageView.vue'
import LogoComponent from '@/components/LogoComponent.vue'

const userStore = useUserStore()
const session = ref('')
const userId = ref('')

onMounted(() => {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      // console.log(error)
    }
    if (data) {
      session.value = data.session
      userId.value = data.session?.user?.id
      userStore.state.userId = data.session?.user?.id
      // console.log(userId.value)
    }
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    userId.value = _session?.user?.id
    userStore.state.userId = _session?.user?.id
  })
})
</script>

<template>
  <div class="container">
    <div v-if="!session">
      <LandingPageView />
    </div>
    <div v-else>
      <LogoComponent class="logo-component" data-cy="logo-component" :session="session" />
      <NavComponent class="nav-component" data-cy="nav-component" :session="session" />
      <RouterView class="routerview" :session="session" />
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
  z-index: 2;
  width: 2rem;
  height: 2rem;
  left: 5px;
  top: 5px;
}
</style>
