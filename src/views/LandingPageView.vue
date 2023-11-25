<template>
  <!-- <div class="content-wrapper">
    <h1>Landing Page</h1>
    <svg class="icon logo" data-cy="logo">
      <use xlink:href="@/assets/icons.svg#catshield" fill="currentcolor" />
    </svg>
    <h1 class="headline" data-cy="headline">Cat Herder</h1>
    <p class="intro-text" data-cy="intro-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet sem turpis. Maecenas
      consectetur varius nibh, id porttitor magna interdum a. Phasellus laoreet tortor a sapien
      semper, id egestas ipsum imperdiet. Aliquam a enim nec mi fermentum sollicitudin.
    </p>
    <Button
      label="Log in"
      class="btn-login"
      data-cy="btn-login"
      @click="router.push('/login')"
      raised
    />
  </div> -->
  <LandingPage></LandingPage>
</template>

<script setup>
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
// const router = useRouter()
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
}
.logo {
  color: var(--dark);
}
.headline {
  padding-top: 2rem;
}
.intro-text {
  width: 70%;
  text-align: left;
  padding-block: 3rem;
}
.btn-login {
  height: 2.5rem;
  width: 70%;
}

@media screen and (min-width: 600px) {
  .intro-text {
    width: 40rem;
  }
  .btn-login {
    width: 10rem;
  }
}
</style>
