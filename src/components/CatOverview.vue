<template>
  <div class="content-wrapper-cat-overview">
    <div class="info-container">
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#birthday-cake" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Alter:</span>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }} alt
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Rasse: </span> {{ catsStore.state.currentCat.breed?.content }}
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#scale" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Gewicht: </span>{{ catsStore.state.currentCat.weight }} kg
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#open-door" fill="currentcolor"></use>
        </svg>
        <p>
          <span class="info-element-text">Haltung:</span
          >{{ catsStore.state.currentCat.in_outdoor?.content }}
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#meat" fill="currentcolor"></use>
        </svg>
        <p class="food-list info-element-text">
          <span>Futter:</span>
          <span
            class="itemlist-item"
            v-for="item of catsStore.state.currentCat.food_varieties"
            :key="item"
          >
            {{ item?.content }}
          </span>
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#calendar-icon" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Fütterung: </span>{{ catsStore.state.currentCat.feeding_times?.content }} x pro Tag
        </p>
      </div>
      <div class="info-element" v-if="catsStore.state.currentCat.drugs?.content !== 'Nein'">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#drugs" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Medikamente:</span> {{ catsStore.state.currentCat.drugs?.content }}
        </p>
      </div>
      <div class="info-element">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Spielbedarf:</span> {{ catsStore.state.currentCat.playtimes?.content }}
        </p>
      </div>
      <div class="info-element" v-if="catsStore.state.currentCat.vet?.name">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#stetho" fill="currentcolor"></use>
        </svg>
        <p class="info-element-text">
          <span>Tierarzt:</span> {{ catsStore.state.currentCat.vet.name }},
          {{ catsStore.state.currentCat.vet.street }}, {{ catsStore.state.currentCat.vet.city }},
          Tel. {{ catsStore.state.currentCat.vet.phone }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCatsStore } from '@/stores/useCatsStore'

const catsStore = useCatsStore()
</script>

<style scoped>
.content-wrapper-cat-overview {
  width: 80vw;
}
.info-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.125rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding-inline: 1rem;
  padding-block: 0.25rem;
  box-shadow: 0 0 4px 2px var(--card-shadow);
}
.info-element {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 5.5fr;
  align-items: center;
  /* justify-items: center; */
}

.info-element ~ .info-element {
  border-top: 1.5px solid var(--card-shadow);
}
.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-darker);
}
.info-element > p {
  display: flex;
  flex-wrap: wrap;
  font-family: 'Roboto-Slab';
}

.info-element p > span:first-of-type {
  margin-right: 0.75rem;
  color: var(--text-off);
  font-weight: 550;
  font-family: 'Roboto-Slab';
  font-size: 1rem;
}
.info-element p {
  font-family: 'Raleway';
  font-weight: 450;
}

.info-element-text {
  font-size: 0.95rem;
}
.itemlist-item ~ .itemlist-item {
  padding-left: 0.25rem;
}
.info-element .itemlist-item::after {
  content: ', ';
}
.info-element .itemlist-item:last-of-type::after {
  content: '';
}

svg {
  margin-inline: auto;
}

@media screen and (min-width: 500px) {
  .content-wrapper-cat-overview {
    width: 400px;
  }
}

@media screen and (min-width: 700px) {
  .content-wrapper-cat-overview {
    width: 450px;
  }
}

@media screen and (min-width: 1000px) {
  .content-wrapper-cat-overview {
    width: 500px;
  }
  /* .info-container {
    grid-template-columns: 1fr 1fr;
    gap: 0.125rem;
  } */
}
@media screen and (min-width: 1200px) {
  /* .content-wrapper-cat-overview {
    width: 800px;
  } */

  .content-wrapper-cat-overview {
    width: 600px;
  }
}
</style>
