<template>
  <div class="content-wrapper">
    <header class="header">
      <h1 class="user-greeting" data-cy="user-greeting">
        Willkommen {{ userStore.state.username }}!
      </h1>

      <div class="requests-info" v-if="incomingHerderRequests">
        <PrimeButton @click="router.push('/herder')" class="button-incoming-request" unstyled>
          <svg>
            <use xlink:href="@/assets/icons.svg#bell" fill="currentcolor"></use>
          </svg>
        </PrimeButton>

        <div class="request-tooltip">
          <p>Du hast offene Verbindungs-Anfragen!</p>
        </div>
      </div>
    </header>

    <article class="cat-overview content-wrapper-owned-cats" data-cy="cat-overview">
      <h2 class="cat-overview-headline" data-cy="cat-overview-headline">Deine Katzen</h2>
      <article
        v-for="cat of catsStore.state.cats"
        class="cat-info"
        data-cy="cat-info"
        :key="cat.id"
        tabindex="0"
        @keyup.enter="router.push({ name: 'cat', params: { id: cat.id } })"
        @click="router.push({ name: 'cat', params: { id: cat.id } })"
      >
        <img v-if="cat.avatar" class="cat-avatar no-selection" :src="imageUrl(cat.avatar)" alt="" />
        <svg v-else alt="cat avatar" class="cat-avatar no-selection" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>

        <p class="cat-name">{{ cat.name }}</p>
        <p class="cat-age">{{ catsStore.getAge(cat.birthday) }} alt</p>

        <svg
          v-if="checkTodaysTodos(cat.todos)"
          alt="todo alert"
          class="alert-icon"
          tabindex="0"
          @keyup.enter="handleTodoClick(cat.id)"
          @click="handleTodoClick(cat.id)"
        >
          <use xlink:href="@/assets/icons.svg#alert" fill="currentcolor"></use>
        </svg>
        <div class="todo-tooltip">
          <p>{{ cat.name }} hat heute Termine</p>
        </div>
      </article>

      <PrimeButton
        label="Füge eine Katze hinzu"
        class="btn-add-cat"
        data-cy="add-cat-btn"
        @click="router.push('/add-cat')"
        outlined
      >
        <template #default>
          <p>Füge eine Katze hinzu</p>
          <svg class="icon logo" width="1.5em" height="1.5em" data-cy="logo">
            <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor" />
          </svg>
        </template>
      </PrimeButton>
    </article>
    <article class="cat-overview content-wrapper-herded-cats" data-cy="cat-overview">
      <h2 class="cat-overview-headline" data-cy="cat-overview-headline">Von dir betreute Katzen</h2>
      <article v-if="catsStore.state.herdedCats.length < 1" class="no-herded-cats">
        <p>Du betreust noch keine Katzen</p>
        <svg class="icon logo" width="1.5em" height="1.5em" data-cy="logo">
          <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor" />
        </svg>
      </article>
      <article
        v-for="cat of catsStore.state.herdedCats"
        class="cat-info"
        data-cy="cat-info"
        :key="cat.id"
        tabindex="0"
        @keyup.enter="router.push({ name: 'cat', params: { id: cat.id } })"
        @click="router.push({ name: 'cat', params: { id: cat.id } })"
      >
        <img v-if="cat.avatar" class="cat-avatar no-selection" :src="imageUrl(cat.avatar)" alt="" />
        <svg v-else alt="cat avatar" class="cat-avatar no-selection" data-cy="cat-avatar">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="cat-name">{{ cat.name }}</p>
        <p class="cat-age">{{ catsStore.getAge(cat.birthday) }} alt</p>
        <svg
          v-if="checkTodaysTodos(cat.todos)"
          alt="todo alert"
          class="alert-icon"
          tabindex="0"
          @keyup.enter="handleTodoClick(cat.id)"
        >
          <use xlink:href="@/assets/icons.svg#alert" fill="currentcolor"></use>
        </svg>
        <div class="todo-tooltip">
          <p>Für {{ cat.name }} gibt es heute offene Termine</p>
        </div>
      </article>
    </article>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { supabase } from '@/supabase'
import { useCatsStore } from '@/stores/useCatsStore'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

const userStore = useUserStore()
const router = useRouter()

const catsStore = useCatsStore()

const session = ref()
const user_id = ref('')

const incomingHerderRequests = ref(false)

userStore.$subscribe(() => {
  if (userStore.connectionData.loading === 3) {
    userStore.combineConnectionData()
  }
})
function imageUrl(catAvatar) {
  return new URL(`/src/assets/images/cat-avatar_${catAvatar}.webp`, import.meta.url).href
}

function checkTodaysTodos(todoarray) {
  const yearNow = new Date().getFullYear()
  const monthNow = new Date().getMonth() + 1
  const dayNow = new Date().getDate()

  if (todoarray.length > 0) {
    for (let todo of todoarray) {
      const catDates = JSON.parse(todo.dates)
      if (
        new Date(catDates).getDate() === dayNow &&
        new Date(catDates).getMonth() + 1 === monthNow &&
        new Date(catDates).getFullYear() === yearNow &&
        todo.completed === false
      ) {
        return true
      } else if (
        new Date(catDates.start).getDate() === dayNow &&
        new Date(catDates.start).getMonth() + 1 === monthNow &&
        new Date(catDates.start).getFullYear() === yearNow &&
        todo.completed === false
      ) {
        return true
      } else if (checkIfRepeatDateToday(catDates)) {
        return true
      }
    }
  }
  return false
}

function checkIfRepeatDateToday(catDates) {
  const filterDate = dayjs(new Date())

  let cacheDate = dayjs(catDates.start).hour(1)

  if (!catDates?.repeat?.until) {
    return false
  }

  if (catDates.repeat.every[1] === 'days') {
    while (cacheDate <= dayjs(new Date(catDates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(catDates.repeat.every[0], 'day')
      if (
        dayjs(cacheDate).date() === dayjs(filterDate).date() &&
        dayjs(cacheDate).month() === dayjs(filterDate).month() &&
        dayjs(cacheDate).year() === dayjs(filterDate).year()
      ) {
        return true
      }
    }
  }
  if (catDates.repeat.every[1] === 'weeks') {
    while (cacheDate <= dayjs(new Date(catDates.repeat.until)).hour(23)) {
      // for (let day of todo.dates.repeat.weekdays)
      for (let i = catDates.repeat.weekdays.length - 1; i >= 0; i--) {
        cacheDate = cacheDate.day(catDates.repeat.weekdays[i] - 1)
        if (
          dayjs(cacheDate).date() === dayjs(filterDate).date() &&
          dayjs(cacheDate).month() === dayjs(filterDate).month() &&
          dayjs(cacheDate).year() === dayjs(filterDate).year() &&
          cacheDate <= dayjs(new Date(catDates.repeat.until)).hour(23)
        ) {
          return true
        }
      }
      cacheDate = cacheDate.add(catDates.repeat.every[0], 'week')
    }
  }

  if (catDates.repeat.every[1] === 'months') {
    while (cacheDate <= dayjs(new Date(catDates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(catDates.repeat.every[0], 'month')
      if (
        dayjs(cacheDate).date() === dayjs(filterDate).date() &&
        dayjs(cacheDate).month() === dayjs(filterDate).month() &&
        dayjs(cacheDate).year() === dayjs(filterDate).year()
      ) {
        return true
      }
    }
  }
}

function handleTodoClick(catId) {
  catsStore.state.currentCatActiveMenuItems = {
    menuOne: 2,
    menuTwo: 1
  }

  router.push({ name: 'cat', params: { id: catId } })
}

onBeforeMount(async () => {
  await supabase.auth.getSession().then(({ data }) => {
    // console.log(data.session.user)
    session.value = data.session
    user_id.value = data.session.user.id
    userStore.state.userId = user_id.value
  })
  // console.log(session)
  await supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
  await userStore.getProfile(session)
  // console.log(userStore.state)
  await catsStore.fetchCats()
  await catsStore.fetchHerdedCats()
  await userStore.fetchHerders()
  await userStore.fetchAllConnections()
  if (userStore.connectionData.connections.incoming.length > 0) {
    incomingHerderRequests.value = true
  }
})
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
  align-items: start;
  padding-inline: 1rem;
  background-color: var(--background-clr);
  height: min-content;
  padding-bottom: 2rem;
}
.user-greeting {
  text-align: center;
  font-size: 1.75rem;
  padding-bottom: 1rem;
}

header {
  position: relative;
}
.incoming-request-info {
  position: absolute;
  top: 0.45rem;
  right: -2.75rem;
  width: min-content;
  height: min-content;
}
.button-incoming-request:hover + .request-tooltip {
  visibility: visible;
  opacity: 0.95;
}
.request-tooltip {
  padding: 0.5rem;
  width: 8rem;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  top: -1.5rem;
  right: 0rem;
  background-color: red;
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-family: 'Roboto-Medium';
  font-weight: 500;
  background-color: var(--tooltip-background);
  border: 2px solid var(--tooltip-border);
  color: var(--text);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: all 250ms ease-in-out;
}

.request-tooltip:after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 1.75rem 0 1.75rem 10px;
  border-color: transparent transparent transparent var(--tooltip-border);
  left: 7.7rem;
  bottom: 1.5rem;
}
.request-tooltip * {
  margin: 0;
  padding: 0;
  text-align: left;
}
.button-incoming-request {
  position: absolute;
  top: 0.45rem;
  right: -2.75rem;
  border: 0;
  background-color: var(--old-rose-darker);
  padding: 5px;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--cat-card-text);
  text-shadow: var(--alert) 0 0 10px;

  scale: 0.75;
  transition: all 200ms ease-in-out;
}
.button-incoming-request * {
  width: 1.25rem;
  height: 1.25rem;
}
.button-incoming-request:hover,
.button-incoming-request:focus {
  background-color: var(--old-rose);
  scale: 0.85;
  animation: tilt-shaking 0.25s 2 ease-in-out;
}
.request-info-icon {
  width: 2rem;
  height: 2rem;
}
.cat-overview {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  padding-top: 0.75rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
  /* width: 70vw; */
}
.cat-overview-headline {
  grid-row: 1;
  padding: 0;
  margin: 0;
}

h2 {
  font-size: 1.25rem;
  text-align: start;
}
.cat-info {
  background-color: var(--cat-card-background);
  width: 270px;
  color: var(--cat-card-text);
  display: grid;
  column-gap: 1rem;
  grid-template-columns: auto 2fr;
  grid-template-rows: 1fr 1fr;
  border-radius: var(--border-radius);
  align-items: center;
  justify-items: left;
  padding: 0.5rem;
  scale: 1;
  transition: all 200ms ease-in-out;
  position: relative;
}

.alert-icon {
  background-color: var(--primary-darkest);
  border-radius: 100%;
  color: var(--old-rose-lighter-dark);
  position: absolute;
  height: 1.75rem;
  width: 1.75rem;
  top: 4px;
  right: 5px;
  scale: 1;
  transition: all 200ms ease-in-out;
}

.alert-icon:hover,
.alert-icon:focus {
  color: var(--old-rose-darker);
  scale: 1.2;
  animation: tilt-shaking 0.25s 2 ease-in-out;
}

.todo-tooltip {
  position: absolute;
  font-family: 'Roboto-Medium';
  font-weight: 500;
  background-color: var(--tooltip-background);
  border: 2px solid var(--tooltip-border);
  color: var(--text);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  width: 9rem;
  padding-inline: 1rem;
  opacity: 0;
  top: 0;
  right: 0;
  visibility: hidden;
  transform: translate(50%, -102%);
  translate: -9% -10%;
  transition: all 200ms ease-in-out;
}
.todo-tooltip:after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 1.75rem 0 1.75rem;
  border-color: var(--tooltip-border) transparent transparent transparent;
  left: 2.6rem;
  bottom: -11px;
}
.alert-icon:hover + .todo-tooltip,
.alert-icon:focus + .todo-tooltip {
  opacity: 0.9;
  visibility: visible;
}
.cat-info > * {
  margin: 0.125rem 0;
}
.cat-info:hover,
.cat-info:focus {
  background-color: var(--cat-card-background-hover);
  box-shadow: 2px 2px 5px 0 var(--hover-shadow);
  scale: 1.02;
}

.cat-info:hover > .cat-avatar,
.cat-info:focus > .cat-avatar {
  scale: 1.1;
  animation: tilt-shaking 0.25s 2 ease-in-out;
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2.5deg);
  }
  50% {
    transform: rotate(0eg);
  }
  75% {
    transform: rotate(-2.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.cat-avatar {
  width: 4rem;
  height: 4rem;
  grid-column: 1;
  grid-row: 1 / 4;
  margin-inline: 0.25rem;
  scale: 1;
  background-color: var(--background-cat-avatar);
  background: var(--background-cat-avatar);
  border-radius: 45px;
  transition: all 200ms ease-in-out;
}
.cat-name {
  grid-column: 2;
  grid-row: 1;
  font-weight: 550;
}
.cat-age {
  font-family: 'Roboto-light';
  grid-column: 2;
  grid-row: 2;
}
/* .cat-herders {
  grid-column: 2;
  grid-row: 3;
} */
.no-herded-cats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 270px;
  color: var(--primary);
  height: 5.25rem;
}

.no-herded-cats > * {
  margin: 0;
}
.no-herded-cats > p {
  font-size: 1.125rem;
}
.content-wrapper-herded-cats {
  margin-top: 3rem;
}
.btn-add-cat {
  font-family: 'Raleway';
  font-weight: 550;
  width: 270px;
  display: flex;
  justify-content: space-evenly;
  scale: 1;
  transition: all 200ms ease-in-out;
}

.btn-add-cat:hover,
.btn-add-cat:focus {
  scale: 1.02;
}
@media screen and (min-width: 630px) {
  .cat-overview {
    grid-template-columns: 1fr 1fr;
  }
  .cat-overview-headline {
    grid-column: 1 / 3;
  }

  .no-herded-cats {
    width: 540px;
    margin-inline: 0.5rem;
    grid-column: 1/ 3;
  }

  .alert-icon {
    box-shadow: none;
    background-color: var(--primary-darkest);
    border-radius: 100px;
    color: var(--old-rose-lighter-dark);
    position: absolute;
    height: 1.25rem;
    width: 1.25rem;
  }
}

@media screen and (min-width: 1250px) {
  .content-wrapper {
    grid-template-rows: auto auto auto;
    align-items: start;
    justify-content: center;
    column-gap: 1.25rem;
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

@media screen and (min-width: 1350px) {
  .content-wrapper {
    column-gap: 3rem;
  }
}
</style>
