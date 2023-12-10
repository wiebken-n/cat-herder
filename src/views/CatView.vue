import CatsView from './CatsView.vue';
<template>
  <div class="content-wrapper">
    <header>
      <img
        class="cat-avatar"
        :src="`../src/assets/images/cat-avatar_` + catsStore.state.currentCat.avatar + `.webp`"
        alt="cat avatar"
      />
      <div class="header-text-wrapper">
        <h1>{{ catsStore.state.currentCat.name }}</h1>
        <h2>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }} alt</h2>
      </div>
    </header>
    <div v-if="ownerId === userStore.state.userId">
      Herders:
      <PrimeTag
        class="user-tag"
        v-for="herder of userStore.state.herders"
        :value="herder.username"
        :key="herder.id"
        rounded
      ></PrimeTag>
      <PrimeTag class="user-tag" value="Füge einen Herder hinzu" rounded></PrimeTag>
    </div>
    <div v-else>
      Owner:
      <PrimeTag class="user-tag" :value="userStore.state.username" rounded></PrimeTag>
    </div>
    <div class="cat-content">
      <div class="info-segment">
        <div class="info-segment-header">
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
          </svg>
          <h2>Futterinfo</h2>
        </div>
        <p v-if="!stateEdit.food">{{ catsStore.state.currentCat.food_info }}</p>
        <PrimeTextArea
          v-if="stateEdit.food"
          id="input-cat-food"
          class="input-cat-food input input-area"
          v-model="catsStore.state.currentCat.food_info"
          autoResize
        ></PrimeTextArea>
        <svg @click="editFood()" class="icon icon-edit">
          <use
            v-if="!stateEdit.food"
            xlink:href="@/assets/icons.svg#edit"
            fill="currentcolor"
          ></use>
          <use
            v-if="stateEdit.food"
            xlink:href="@/assets/icons.svg#save-data"
            fill="currentcolor"
          ></use>
        </svg>
      </div>
      <div class="info-segment">
        <div class="info-segment-header">
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#medical" fill="currentcolor"></use>
          </svg>
          <h2>Infos zur Gesundheit</h2>
        </div>
        <p v-if="!stateEdit.health">{{ catsStore.state.currentCat.health_info }}</p>
        <PrimeTextArea
          v-if="stateEdit.health"
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.health_info"
          autoResize
        ></PrimeTextArea>
        <svg @click="editHealth()" class="icon icon-edit">
          <use
            v-if="!stateEdit.health"
            xlink:href="@/assets/icons.svg#edit"
            fill="currentcolor"
          ></use>
          <use
            v-if="stateEdit.health"
            xlink:href="@/assets/icons.svg#save-data"
            fill="currentcolor"
          ></use>
        </svg>
      </div>
      <div class="info-segment">
        <div class="info-segment-header">
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#cloud-lightning" fill="currentcolor"></use>
          </svg>
          <h2>Infos zum Verhalten</h2>
        </div>
        <p v-if="!stateEdit.behaviour">{{ catsStore.state.currentCat.behaviour_info }}</p>
        <PrimeTextArea
          v-if="stateEdit.behaviour"
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.behaviour_info"
          autoResize
        ></PrimeTextArea>
        <svg @click="editBehaviour()" class="icon icon-edit">
          <use
            v-if="!stateEdit.behaviour"
            xlink:href="@/assets/icons.svg#edit"
            fill="currentcolor"
          ></use>
          <use
            v-if="stateEdit.behaviour"
            xlink:href="@/assets/icons.svg#save-data"
            fill="currentcolor"
          ></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCatsStore } from '../stores/useCatsStore'

import { useUserStore } from '../stores/useUserStore'
import { useRoute } from 'vue-router'
import { onBeforeMount, reactive, onUnmounted, ref } from 'vue'
import { supabase } from '../supabase'

const route = useRoute()
const catsStore = useCatsStore()
const userStore = useUserStore()

catsStore.state.currentCat.id = route.params.id

const stateEdit = reactive({
  food: false,
  health: false,
  behaviour: false
})
const owner = reactive({})

const ownerName = ref('')
const ownerId = ref('')

async function editFood() {
  if (stateEdit.food) {
    let food_info = catsStore.state.currentCat.food_info
    let cat_id = catsStore.state.currentCat.id

    const { data, error } = await supabase
      .from('food')
      .update({ food_info: food_info })
      .eq('cat_id', cat_id)
      .select()
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
  }
  stateEdit.food = !stateEdit.food
}
async function editHealth() {
  if (stateEdit.health) {
    let health_info = catsStore.state.currentCat.health_info
    let cat_id = catsStore.state.currentCat.id

    const { data, error } = await supabase
      .from('health')
      .update({ health_info: health_info })
      .eq('cat_id', cat_id)
      .select()
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
  }
  stateEdit.health = !stateEdit.health
}

async function editBehaviour() {
  if (stateEdit.behaviour) {
    let behaviour_info = catsStore.state.currentCat.behaviour_info
    let cat_id = catsStore.state.currentCat.id

    const { data, error } = await supabase
      .from('behaviour')
      .update({ behaviour_info: behaviour_info })
      .eq('cat_id', cat_id)
      .select()
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
  }
  stateEdit.behaviour = !stateEdit.behaviour
}

async function fetchOwner() {
  let { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', catsStore.state.currentCat.userId)
  if (error) {
    console.log(error)
  }

  if (data) {
    owner.value = data
    ownerName.value = data[0].username
    ownerId.value = data[0].id
  }
}

onUnmounted(() => {
  catsStore.state.currentCat.id = ''
  catsStore.state.currentCat.name = ''
  catsStore.state.currentCat.avatar = ''
  catsStore.state.currentCat.birthday = ''
  catsStore.state.currentCat.food_info = ''
  catsStore.state.currentCat.health_info = ''
  catsStore.state.currentCat.behaviour_info = ''
})
onBeforeMount(async () => {
  await catsStore.fetchCat(route.params.id)
  await catsStore.fetchCatInfo(route.params.id)

  await fetchOwner()
})
</script>

<style scoped>
.cat-icon {
  background: url('@/assets/cat-sitting.svg') no-repeat center center;
  background-size: contain;
  width: 16px; /* Adjust the width and height as needed */
  height: 16px;
}
.user-tag {
  font-size: 1rem;
  padding-inline: 1rem;
}
.content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: start;
  position: relative;
  padding-bottom: 2rem;
}
header {
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cat-avatar {
  width: 5rem;
  height: 5rem;
  grid-column: 1;
  grid-row: 1 / 4;
  margin-inline: 0.25rem;
  scale: 1;
}

.header-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-text-wrapper > h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}
.cat-content {
  display: grid;
  justify-items: start;
  width: 70vw;
  gap: 1rem;
  position: relative;
}

.info-segment {
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 1rem;
  border: 2px solid var(--primary);
  border-radius: 10px;
  position: relative;
}
.info-segment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: max-content;
}

h2 {
  color: grey;
  font-size: 1.1rem;
  top: -0.8rem;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: grey;
}
.info-segment > p {
  padding-bottom: 0.5rem;
}

.input-area {
  height: 100%;
  width: 100%;
  margin-bottom: 1rem;
}
.icon-edit {
  position: absolute;
  right: 8px;
  bottom: 8px;
}
@media screen and (min-width: 700px) {
  header {
    width: 500px;
  }
  .cat-content {
    width: 500px;
  }

  .info-segment-header {
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
@media screen and (min-width: 1000px) {
  header {
    width: 700px;
  }
  .cat-content {
    width: 700px;
  }
}
@media screen and (min-width: 1200px) {
  header {
    width: 1000px;
  }
  .cat-content {
    grid-template-columns: 1fr 1fr;
    width: 1000px;
  }
}
</style>
