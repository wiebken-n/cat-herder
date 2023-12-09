<template>
  <div class="content-wrapper" @mouseleave="deactivateMenu">
    <div class="burger-container">
      <svg @click="activateMenu" alt="burger-menu-icon" class="burger" data-cy="burger">
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
            <li @click="goToPage('/')">Impressum</li>
          </ul>
        </div>
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
.menuactive {
  visibility: visible;
  width: 15rem;
  height: 20rem;
  border-radius: 0 0 0 var(--border-radius);
  position: relative;
  background-color: var(--accent);
  opacity: 0.95;
}
.content-wrapper {
  width: 100%;
  display: grid;
  justify-content: right;
  align-content: start;
}
.burger {
  position: absolute;
  height: 2.5rem;
  width: 2.5rem;
  right: 10px;
  top: 10px;
  z-index: 1;
  transition: all 200ms ease;
  scale: 1;
}

.burger:hover {
  scale: 1.05;
  transform-origin: center;
  color: var(--alert-dark);
  cursor: pointer;
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
  width: 80%;
}
li:hover {
  color: var(--dark);
  border-bottom: 10px var(--secondary) solid;
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const menuActive = ref(false)

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
</script>
