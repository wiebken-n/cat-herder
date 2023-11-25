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
const userStore = useUserStore()
</script>
<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
  padding-inline: 1rem;
  background-color: white;
}
.user-greeting {
  text-align: center;
  font-size: 1.5rem;
  padding-bottom: 1rem;
}

.cat-overview {
  background-color: rgb(219, 219, 219);
  display: grid;
  grid-template-columns: 90%;
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
