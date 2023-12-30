<template>
  <div class="nav-content-wrapper no-selection" @mouseleave="deactivateMenu">
    <div class="burger-container" v-if="!menuAlwaysActive">
      <PrimeButton
        :class="{ burgeractive: menuActive }"
        @click="activateMenu('click')"
        @keyup.enter="activateMenu('enter')"
        class="burger-button"
        aria-label="Seitennavigation"
      >
        <svg
          :class="{ burgeractive: menuActive }"
          alt="burger-menu-icon"
          class="burger"
          data-cy="burger"
        >
          <use xlink:href="@/assets/icons.svg#burger" fill="currentcolor"></use>
        </svg>
      </PrimeButton>
    </div>
    <transition>
      <nav
        v-if="menuActive || menuAlwaysActive"
        class="nav-container"
        :class="{ menuactive: menuActive || menuAlwaysActive }"
      >
        <div class="nav-wrapper" :class="{ navactive: menuActive || menuAlwaysActive }">
          <ul>
            <li
              tabindex="0"
              :class="{ linkactive: activeRoute('home') }"
              @keyup.enter="goToPage('/')"
              @click="goToPage('/')"
            >
              Home
            </li>
            <li
              tabindex="0"
              :class="{ linkactive: activeRoute('add-cat') }"
              @keyup.enter="goToPage('/add-cat')"
              @click="goToPage('/add-cat')"
            >
              Neue Katze
            </li>
            <li
              tabindex="0"
              :class="{ linkactive: activeRoute('herder') }"
              @keyup.enter="goToPage('/herder')"
              @click="goToPage('/herder')"
            >
              Cat Herder
            </li>
            <li
              tabindex="0"
              :class="{ linkactive: activeRoute('user') }"
              @keyup.enter="goToPage('/user')"
              @click="goToPage('/user')"
            >
              Einstellungen
            </li>
            <li
              tabindex="0"
              :class="{ linkactive: activeRoute('impressum') }"
              @keyup.enter="goToPage('/impressum')"
              @click="goToPage('/impressum')"
            >
              Impressum
            </li>
          </ul>
        </div>
        <button @click="toggleDarkmode()" class="darkmode-toggle">
          <svg class="darkmode-toggle-icon">
            <use
              v-if="!userStore.state.darkmode"
              class="darkmode-icon"
              xlink:href="@/assets/icons.svg#moon"
              fill="currentcolor"
            ></use>
            <use
              v-if="userStore.state.darkmode"
              class="darkmode-icon"
              xlink:href="@/assets/icons.svg#sun"
              fill="currentcolor"
            ></use>
          </svg>
        </button>
      </nav>
    </transition>
  </div>
</template>

<style scoped>
.nav-container {
  width: 15rem;
  height: 20rem;
  border-radius: 0 0 0 var(--border-radius);
  position: relative;
  visibility: hidden;
  background-color: transparent;
  transition: all 300ms ease-in;
  z-index: 2;
}

.darkmode-toggle {
  background-color: transparent;
  border-color: transparent;
  position: absolute;
  bottom: 1.25rem;
  left: 1.5rem;
  height: 2.75rem;
  width: 2.75rem;
  padding: 0;
}
.darkmode-toggle-icon {
  z-index: 3;
  height: 2rem;
  width: 2rem;
  color: var(--darkmode-icon);
  transition: all 200ms ease-in-out;
}
.darkmode-toggle:hover > .darkmode-toggle-icon,
.darkmode-toggle:focus > .darkmode-toggle-icon {
  scale: 1.1;
  color: var(--burger-icons-hover);
}
.menuactive {
  visibility: visible;
  width: 15rem;
  height: 20rem;
  border-radius: 0 0 0 var(--border-radius);
  position: relative;
  background-color: var(--nav-background);
  border-left: 1.5px solid var(--nav-border);
  border-bottom: 1.5px solid var(--nav-border);
  opacity: 0.97;
}
.nav-content-wrapper {
  width: 100%;
  display: grid;
  justify-content: right;
  align-content: start;
}
.burger {
  height: 2.75rem;
  width: 2.75rem;
  z-index: 3;
  transition: all 200ms ease;
  scale: 1;
  color: var(--burger-icons);
}
.burger-button {
  height: 2.75rem;
  width: 2.75rem;
  padding: 0;
  right: 10px;
  top: 10px;
  position: absolute;
  border: transparent;
  background-color: transparent;
  outline: none;
  scale: 1;
  z-index: 4;
  transition: all 200ms ease;
}

.burger-button:hover,
.burger-button:focus {
  scale: 1.05;
  transform-origin: center;
}
.burger-button:focus .burger {
  color: var(--burger-bg);
}
.burger-button:focus {
  box-shadow: none;
}

.burger-button:hover .burger,
.burger-button:hover .burger {
  scale: 1.05;
  transform-origin: center;
  color: var(--burger-icons-hover);
  cursor: pointer;
  border: none;
  outline: none;
}

.burgeractive {
  color: var(--burger-bg);
}

.nav-wrapper {
  width: 100%;
  position: absolute;
  top: 10px;
  right: 0px;
  padding-inline: 10px;
  text-align: left;
  visibility: hidden;
  color: transparent;
  transform: color 100ms ease-in-out;
}
.navactive {
  color: var(--text);
  visibility: visible;
}

ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 10px;
  font-size: 1.25rem;
  line-height: 2.5rem;
  font-family: 'Roboto-Slab';
  border-bottom: 0px transparent solid;
  transition: all 200ms ease-in-out;
}
ul {
  padding-top: 1.5rem;
}
li {
  color: var(--nav-text);
  width: 80%;
}
li:hover,
li:focus {
  color: var(--nav-text-hover);
  border-bottom: 10px var(--primary) solid;
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media screen and (min-width: 1000px) {
  /* .nav-container {
    visibility: visible;
  } */

  .menuactive {
    visibility: visible;
    width: 87vw;
    height: 3.25rem;
    border-radius: 0 0 0 var(--border-radius);
    position: relative;
    background-color: transparent;
    border-left: 1.5px solid var(--nav-border);
    border-bottom: 1.5px solid var(--nav-border);
    border: 1.5px solid transparent;
    opacity: 0.97;
  }
  .nav-wrapper {
    top: 0;
  }

  ul {
    width: 84%;
    display: flex;
    align-self: flex-start;
    justify-content: space-evenly;
    gap: calc(2rem + 2vw);
    padding-top: 0.25rem;
    margin-left: calc(10vw);
  }
  ul,
  li {
    line-height: 2.25rem;
    font-size: 1.05rem;
    padding-left: 0;
  }
  li {
    padding-inline: 5px;
    color: var(--nav-text);
    width: max-content;
    border-bottom: none;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.75rem;
    text-decoration-color: var(--nav-underline);
    font-family: 'Roboto-Regular';
  }

  li:hover,
  li:focus {
    color: var(--nav-text-hover);
    border-bottom: none;
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-thickness: 4px;
    text-decoration-color: var(--nav-underline-hover);
    font-family: 'Roboto-Regular';
  }
  .darkmode-toggle {
    position: absolute;
    scale: 0.7;
    bottom: 0.3rem;
    left: 95%;
  }
}

.linkactive {
  text-decoration-color: var(--nav-underline-hover);
}

@media screen and (min-width: 1150px) {
  .menuactive {
    width: 80vw;
  }
  ul {
    width: 82%;
  }
  .darkmode-toggle {
    left: 94.5%;
  }
}

@media screen and (min-width: 1300px) {
  .menuactive {
    width: 70vw;
  }
  ul {
    width: 80%;
  }
  /* .darkmode-toggle {
    left: 95%;
  } */
}
@media screen and (min-width: 1500px) {
  .menuactive {
    width: 100vw;
  }
  .darkmode-toggle {
    left: 97%;
  }
  ul {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }
}

@media screen and (min-width: 2000px) {
  .menuactive {
    width: 100vw;
  }
  ul {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }
  .darkmode-toggle {
    left: 98%;
  }
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePrimeVue } from 'primevue/config'
import { useUserStore } from '@/stores/useUserStore.js'
import { supabase } from '../supabase'
const userStore = useUserStore()

const route = useRoute()

const router = useRouter()

const menuActive = ref(false)
const menuAlwaysActive = ref(false)
const PrimeVue = usePrimeVue()

const themeInfo = reactive({
  light: {
    name: 'lara-light-cyan',
    link: 'current-theme'
  },
  dark: {
    name: 'lara-dark-cyan',
    link: 'current-theme'
  },
  currentLight: true,
  currentDark: false
})

const props = defineProps({
  session: Object
})

const activeRoute = function (link) {
  return route.name === link
}

const activateMenu = function (method) {
  if (method === 'enter') {
    menuActive.value = true
  } else {
    menuActive.value = !menuActive.value
  }
}

const deactivateMenu = function () {
  setTimeout(() => {
    menuActive.value = false
  }, 1500)
}

const goToPage = function (path) {
  router.push(path)
  menuActive.value = !menuActive.value
}

async function toggleDarkmode() {
  if (!userStore.state.darkmode) {
    document.body.classList.add('darkmode')
    PrimeVue.changeTheme(themeInfo.light.name, themeInfo.dark.name, themeInfo.dark.link, () => {})
    userStore.state.darkmode = !userStore.state.darkmode
    await changeDarkmodeSetting()

    return
  }
  if (userStore.state.darkmode) {
    document.body.classList.remove('darkmode')
    PrimeVue.changeTheme(themeInfo.dark.name, themeInfo.light.name, themeInfo.light.link, () => {})
    userStore.state.darkmode = !userStore.state.darkmode
    await changeDarkmodeSetting()

    return
  }
}

async function changeDarkmodeSetting() {
  const { error } = await supabase
    .from('profiles')
    .update({ darkmode: userStore.state.darkmode })
    .eq('id', userStore.state.userId)
    .select()
  if (error) {
    console.log(error)
  }
}

async function fetchDarkmodeSetting() {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', props.session.user.id)
    .single()

  if (error) {
    console.log(error)
  }
  if (data) {
    userStore.state.darkmode = data.darkmode
  }
}

async function adjustDarkMode() {
  if (userStore.state.darkmode) {
    document.body.classList.add('darkmode')
    PrimeVue.changeTheme(themeInfo.light.name, themeInfo.dark.name, themeInfo.dark.link, () => {})
  }
  if (!userStore.state.darkmode) {
    if (document.body.classList.contains('darkmode')) {
      document.body.classList.remove('darkmode')
    }
    PrimeVue.changeTheme(themeInfo.dark.name, themeInfo.light.name, themeInfo.light.link, () => {})
  }
}
const windowWidth = ref(window.innerWidth)

// const screenWidth = computed(() => {
//   console.log(windowWidth.value)
//   return windowWidth.value
// })

function onWindowSizeChange() {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 1000) {
    menuAlwaysActive.value = true
  } else menuAlwaysActive.value = false
}

onMounted(async () => {
  await fetchDarkmodeSetting()
  await adjustDarkMode()
  window.addEventListener('resize', onWindowSizeChange)
  if (window.screen.width >= 1000) {
    menuAlwaysActive.value = true
  }
})
</script>
