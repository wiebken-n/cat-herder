<template>
  <div class="logo-content-wrapper">
    <button
      class="logo"
      alt="Eine Katze mit einem Cowboy-Hut"
      @click="router.push('/')"
      data-cy="logo"
      tabindex="0"
    ></button>
    <!-- <svg class="icon logo" @click="router.push('/')" data-cy="logo">
      <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
    </svg> -->
  </div>
</template>
<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function imageUrl() {
  let logoUrlGrey = new URL(`/src/assets/images/catwithhat_grey.webp`, import.meta.url).href
  let logoUrlColor = new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
  document.querySelector('html').style.setProperty('--url-logo-grey', logoUrlGrey)
  document.querySelector('html').style.setProperty('--url-logo-color', logoUrlColor)
}
onBeforeMount(() => imageUrl())
</script>

<style scoped>
.logo-content-wrapper {
  height: max-content;
}
.logo {
  height: 3.5rem;
  width: 3.5rem;
  transition: all 200ms ease-out;
  background-image: url('/catwithhat_small_grey.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--logo-bg);
  background-size: 55%;
  background-position: center;
  border-radius: 90%;
  border: none;
}
.logo:hover,
.logo:focus {
  color: var(--alert-dark);
  scale: 1.1;
  cursor: pointer;
  background-color: var(--logo-bg-hover);
  background-image: url('/catwithhat_small.webp');
  /* animation: tilt-shaking 0.25s 2 ease-in-out; */
}
/* 
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
} */

.home-button {
  background: none;
  border: none;
}
</style>
