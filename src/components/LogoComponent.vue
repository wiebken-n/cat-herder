<template>
  <svg class="icon logo" data-cy="logo">
    <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor" />
  </svg>
</template>

<style scoped>
.logo {
  color: var(--dark);
  height: 2rem;
  width: 2rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.logo:hover {
  color: var(--alert-dark);
  scale: 1.1;
}
</style>
