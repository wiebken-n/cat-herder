<template>
  <div class="nav-content-wrapper" @mouseleave="deactivateMenu">
    <div class="burger-container">
      <svg
        @click="activateMenu"
        :class="{ burgeractive: menuActive }"
        alt="burger-menu-icon"
        class="burger"
        data-cy="burger"
      >
        <use xlink:href="@/assets/icons.svg#burger" fill="currentcolor"></use>
      </svg>
    </div>
    <transition>
      <nav v-if="menuActive" class="nav-container" :class="{ menuactive: menuActive }">
        <div class="nav-wrapper" :class="{ navactive: menuActive }">
          <ul>
            <li @click="goToPage('/')">Home</li>
            <li @click="goToPage('/add-cat')">Neue Katze</li>
            <li @click="goToPage('/herder')">Cat Herder</li>
            <li @click="goToPage('/user')">Einstellungen</li>
            <li @click="goToPage('/impressum')">Impressum</li>
            <li></li>
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
  visibility: hidden;
  width: 15rem;
  height: 20rem;
  border-radius: 0 0 0 var(--border-radius);
  position: relative;
  visibility: hidden;
  background-color: transparent;
  transition: all 300ms ease-in;
}

.darkmode-toggle {
  background-color: transparent;
  border-color: transparent;
  position: absolute;
  bottom: 0.5rem;
  left: 1.25rem;
}
.darkmode-toggle-icon {
  z-index: 1;
  height: 2rem;
  width: 2rem;
  color: var(--darkmode-icon);
  transition: all 200ms ease-in-out;
}
.darkmode-toggle:hover > .darkmode-toggle-icon {
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
  opacity: 0.95;
}
.nav-content-wrapper {
  width: 100%;
  display: grid;
  justify-content: right;
  align-content: start;
}
.burger {
  position: absolute;
  height: 2.75rem;
  width: 2.75rem;
  right: 10px;
  top: 10px;
  z-index: 1;
  transition: all 200ms ease;
  scale: 1;
  color: var(--burger-icons);
}

.burger:hover {
  scale: 1.05;
  transform-origin: center;
  color: var(--burger-icons-hover);
  cursor: pointer;
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
  transition: all 300ms ease-in-out;
}
ul {
  padding-top: 1.5rem;
}
li {
  color: var(--nav-text);
  width: 80%;
}
li:hover {
  color: var(--nav-text-hover);
  border-bottom: 10px var(--primary) solid;
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePrimeVue } from 'primevue/config'
import { useUserStore } from '@/stores/useUserStore.js'
import { supabase } from '../supabase'
const userStore = useUserStore()

const router = useRouter()

const menuActive = ref(false)
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

const activateMenu = function () {
  menuActive.value = !menuActive.value
}
const deactivateMenu = function () {
  setTimeout(() => {
    menuActive.value = false
  }, '1000')
}
const goToPage = function (path) {
  router.push(path)
  menuActive.value = !menuActive.value
}

function toggleDarkmode() {
  if (!userStore.state.darkmode) {
    document.body.classList.toggle('darkmode')
    PrimeVue.changeTheme(themeInfo.light.name, themeInfo.dark.name, themeInfo.dark.link, () => {})
    userStore.state.darkmode = !userStore.state.darkmode
    changeDarkmodeSetting()

    return
  }
  if (userStore.state.darkmode) {
    document.body.classList.toggle('darkmode')
    PrimeVue.changeTheme(themeInfo.dark.name, themeInfo.light.name, themeInfo.light.link, () => {})
    userStore.state.darkmode = !userStore.state.darkmode
    changeDarkmodeSetting()

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

onMounted(() => {
  setTimeout(() => {
    if (userStore.state.darkmode) {
      document.body.classList.toggle('darkmode')
      PrimeVue.changeTheme(themeInfo.light.name, themeInfo.dark.name, themeInfo.dark.link, () => {})
    }
  }, 1000)
})
</script>
