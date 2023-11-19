<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
// import UserAccount from '@/components/UserAccount.vue'
import UserAuth from '@/components/UserAuth.vue'
import { supabase } from '@/supabase'
import { useUserStore } from './stores/useUserStore'

const userStore = useUserStore()

const session = ref('')
const userId = ref('')

onMounted(() => {
  console.log('before fetch: ')
  console.log(session)
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    console.log('after fetch: ')
    console.log(data.session)
    userId.value = data.session.user.id
    userStore.state.userId = data.session.user.id
    console.log(userId.value)
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <!-- <UserAccount v-if="session" :session="session" /> -->
    <RouterView v-if="session" :session="session" />
    <UserAuth v-else />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
