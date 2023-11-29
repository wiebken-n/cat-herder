<template>
  <div class="content-wrapper">
    <header class="header">
      <h1 class="user-greeting" data-cy="user-greeting">
        Willkommen {{ userStore.state.userName }}!
      </h1>
    </header>
    <article class="cat-overview content-wrapper-owned-cats" data-cy="cat-overview">
      <h2 class="cat-overview-headline" data-cy="cat-overview-headline">Meine Katzen:</h2>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Herders</p>
      </article>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Herders</p>
      </article>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Herders</p>
      </article>

      <Button
        label="Füge eine Katze hinzu"
        class="btn-add-cat"
        @click="router.push('/add-cat')"
        outlined
      >
        <template #default>
          <p>Füge eine Katze hinzu</p>
          <svg class="icon logo" width="1.5em" height="1.5em" data-cy="logo">
            <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor" />
          </svg>
        </template>
      </Button>
    </article>
    <article class="cat-overview content-wrapper-herded-cats" data-cy="cat-overview">
      <h2 class="cat-overview-headline" data-cy="cat-overview-headline">
        Von mir betreute Katzen:
      </h2>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Owner</p>
      </article>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Owner</p>
      </article>
      <article class="cat-info" data-cy="cat-info">
        <svg alt="cat avatar" class="cat-avatar" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">my Cat</p>
        <p class="cat-age">8</p>
        <p class="cat-herders">Owner</p>
      </article>
    </article>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/useUserStore'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref, watchEffect } from 'vue'
import { supabase } from '@/supabase'
import { useCatsStore } from '../stores/useCatsStore'

const userStore = useUserStore()
const router = useRouter()

const catsStore = useCatsStore()

const session = ref()
const fetchError = ref(null)
const user_id = ref('')
const inputName = ref('')
const inputAge = ref()
const inputDescription = ref('')

const formError = ref('')

const orderBy = ref('created_at')

onBeforeMount(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    console.log(data.session)
    user_id.value = data.session.user.id
    catsStore.fetchCats()
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    catsStore.fetchCats
  })
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
    catsStore.state.cats = {}
  }
  if (data) {
    catsStore.state.cats = data
    fetchError.value = null
  }
}
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
  padding-inline: 1rem;
  background-color: white;
  height: min-content;
}
.user-greeting {
  text-align: center;
  font-size: 1.5rem;
  padding-bottom: 1rem;
}

.cat-overview {
  background-color: rgb(235, 235, 235);
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  padding-top: 0.75rem;
  border-radius: var(--border-radius);
}
.cat-overview-headline {
  grid-row: 1;
  padding: 0;
  margin: 0;
}
.cat-info {
  background-color: var(--secondary);
  width: 270px;
  color: white;
  display: grid;
  column-gap: 1rem;
  grid-template-columns: auto 2fr;
  grid-template-rows: 1fr 1fr 1fr;
  border-radius: var(--border-radius);
  align-items: center;
  justify-items: left;
  padding: 0.5rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.cat-info:hover {
  background-color: var(--secondary-light);
  box-shadow: 2px 2px 5px 0 var(--hover-shadow);
  scale: 1.02;
}
.cat-avatar {
  width: 4rem;
  height: 4rem;
  grid-column: 1;
  grid-row: 1 / 4;
}
.cat-name {
  grid-column: 2;
  grid-row: 1;
}
.cat-age {
  grid-column: 2;
  grid-row: 2;
}
.cat-herders {
  grid-column: 2;
  grid-row: 3;
}

.content-wrapper-herded-cats {
  margin-top: 3rem;
}
.btn-add-cat {
  display: flex;

  justify-content: space-around;
  width: auto;
}

@media screen and (min-width: 600px) {
  .cat-overview {
    grid-template-columns: 1fr 1fr;
  }
  .cat-overview-headline {
    grid-column: 1 / 3;
  }
}

@media screen and (min-width: 1250px) {
  .content-wrapper {
    display: grid;
    grid-template-columns: content content;
    grid-template-rows: auto auto auto;
    align-items: center;
    justify-items: center;
    padding-inline: auto;
  }

  .header {
    grid-column: 1 / 3;
    grid-row: 1 /2;
  }
  .content-wrapper-owned-cats {
    grid-column: 1 / 2;
    grid-row: 2 /3;
  }
  .content-wrapper-herded-cats {
    margin-top: 0;
    grid-column: 2 / 3;
    grid-row: 2 /3;
  }
}

@media screen and (min-width: 1500px) {
  .content-wrapper {
    padding-inline: 7vw;
  }
}
</style>
