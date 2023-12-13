<template>
  <div class="content-wrapper">
    <header>
      <img class="cat-avatar" :src="imageUrl(catsStore.state.currentCat.avatar)" alt="cat avatar" />
      <div class="header-text-wrapper">
        <h1>{{ catsStore.state.currentCat.name }}</h1>
        <h2>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }} alt</h2>
      </div>
    </header>
    <div v-if="ownerId === userStore.state.userId" class="user-content-container">
      <div class="herder-output-container">
        <div class="herder-data-container" v-for="herder of herderProfiles" :key="herder.id">
          <PrimeButton
            class="user-tag"
            :label="herder.username"
            @click="confirmRemoveHerder(herder)"
            confirmRemoveHerder
            rounded
          >
          </PrimeButton>
        </div>

        <Toast />
        <PrimeConfirmDialog />
      </div>
      <div class="herder-input-container">
        <PrimeDropdown
          v-model="selectedHerder"
          :options="userStore.state.herders"
          optionLabel="username"
          placeholder="Wähle einen Nutzer aus"
          class="herder-dropdown w-full md:w-14rem"
        />
        <PrimeButton
          label="Füge diese Nutzer als Herder hinzu"
          @click="addHerder(selectedHerder.id)"
          outlined
        />
      </div>
    </div>
    <div v-if="ownerId !== userStore.state.userId" class="user-content-container">
      <div div class="herder-output-container">
        <PrimeTag
          class="user-tag owner-name"
          :value="catsStore.state.currentCat.profiles.username"
          rounded
        ></PrimeTag>
      </div>
    </div>
    <div class="cat-content">
      <div class="info-segment">
        <div class="info-segment-header">
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
          </svg>
          <h2>Futterinfo</h2>
        </div>
        <p v-if="!stateEdit.food">{{ catsStore.state.currentCat.cats_info[0].food_info }}</p>
        <PrimeTextArea
          v-if="stateEdit.food"
          id="input-cat-food"
          class="input-cat-food input input-area"
          v-model="catsStore.state.currentCat.cats_info[0].food_info"
          autoResize
        ></PrimeTextArea>
        <svg
          v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
          @click="editFood()"
          class="icon icon-edit"
        >
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
        <p v-if="!stateEdit.health">{{ catsStore.state.currentCat.cats_info[0].health_info }}</p>
        <PrimeTextArea
          v-if="stateEdit.health"
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.cats_info[0].health_info"
          autoResize
        ></PrimeTextArea>
        <svg
          @click="editHealth()"
          v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
          class="icon icon-edit"
        >
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
        <p v-if="!stateEdit.behaviour">
          {{ catsStore.state.currentCat.cats_info[0].behaviour_info }}
        </p>
        <PrimeTextArea
          v-if="stateEdit.behaviour"
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.cats_info[0].behaviour_info"
          autoResize
        ></PrimeTextArea>
        <svg
          @click="editBehaviour()"
          class="icon icon-edit"
          v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
        >
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
import { onBeforeMount, reactive, onUnmounted, ref, computed } from 'vue'
import { supabase } from '../supabase'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const confirm = useConfirm()
const toast = useToast()

const route = useRoute()
const catsStore = useCatsStore()
const userStore = useUserStore()
const selectedHerder = ref('none')
catsStore.state.currentCat.id = route.params.id

const stateEdit = reactive({
  food: false,
  health: false,
  behaviour: false
})

// const owner = computed(() => catsStore.state.currentCat.profiles)
// const ownerName = ref('')

const herderProfiles = computed(() => {
  return catsStore.state.currentCat.catHerderProfiles
})
const ownerId = computed(() => catsStore.state.currentCat.profiles.id)

function imageUrl(catAvatar) {
  return new URL(`/src/assets/images/cat-avatar_${catAvatar}.webp`, import.meta.url).href
}

const confirmRemoveHerder = (herder) => {
  confirm.require({
    message: `Möchtest du ${herder.username} als Herder für ${catsStore.state.currentCat.name} entfernen?`,
    header: 'Herder entfernen',

    accept: () => {
      toast.add({
        severity: 'success',
        summary: 'Herder entfernt',
        detail: `Du hast ${herder.username} als Herder entfernt`,
        life: 3000
      })
      removeHerder(herder.id)
    },
    reject: () => {}
  })
}

async function editCatInfo() {
  const { data, error } = await supabase
    .from('cats_info')

    .update({
      food_info: catsStore.state.currentCat.cats_info[0].food_info,
      health_info: catsStore.state.currentCat.cats_info[0].health_info,
      behaviour_info: catsStore.state.currentCat.cats_info[0].behaviour_info
    })
    .eq('cat_id', catsStore.state.currentCat.id)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
  }
}
async function editFood() {
  if (stateEdit.food) {
    await editCatInfo()
  }
  stateEdit.food = !stateEdit.food
}
async function editHealth() {
  if (stateEdit.health) {
    editCatInfo()
  }
  stateEdit.health = !stateEdit.health
}

async function editBehaviour() {
  if (stateEdit.behaviour) {
    editCatInfo()
  }
  stateEdit.behaviour = !stateEdit.behaviour
}

// async function fetchOwner() {
//   let { data, error } = await supabase
//     .from('profiles')
//     .select()
//     .eq('id', catsStore.state.currentCat.user_id)
//   if (error) {
//     console.log(error)
//   }

//   if (data) {
//     owner.value = data
//     ownerName.value = data[0].username
//     ownerId.value = data[0].id
//   }
// }

// async function fetchCatHerders() {
//   let { data, error } = await supabase
//     .from('herder_connections')
//     .select('herder_id')
//     .eq('cat_id', catsStore.state.currentCat.id)

//   if (error) {
//     console.log(error)
//   }
//   if (data) {
//     console.log(data)
//     catsStore.state.currentCat.herders = data
//     fetchCatHerderProfiles()
//   }
// }

// async function fetchCatHerderProfiles() {
//   const herderIds = []
//   for (let herder of catsStore.state.currentCat.herders) {
//     herderIds.push(herder.herder_id)
//   }
//   catsStore.state.currentCat.herders = herderIds
//   console.log(catsStore.state.currentCat.herders)
//   let { data, error } = await supabase
//     .from('profiles')
//     .select()
//     .in('id', catsStore.state.currentCat.herders)
//   if (error) {
//     console.log(error)
//   }
//   if (data) {
//     catsStore.state.currentCat.herderProfiles = data
//     console.log(data)
//   }
// }

async function addHerder(herderId) {
  if (selectedHerder.value === 'none') {
    // console.log('bitte wähle einen herder aus')
    toast.add({
      severity: 'warn',
      summary: 'Kein Nutzer ausgewählt',
      detail: 'Bitte wähle einen Nutzer aus!',
      life: 3000
    })
    return
  }
  for (let herder of catsStore.state.currentCat.herder_connections) {
    if (herder.herder_id === herderId) {
      toast.add({
        severity: 'warn',
        summary: 'Herder bereits hinzugefügt',
        detail: 'Du hast diesen Nutzer bereits als Herder hinzugefügt',
        life: 3000
      })
      return
    }
  }

  let { data, error } = await supabase
    .from('herder_connections')
    .insert([{ cat_id: catsStore.state.currentCat.id, herder_id: herderId }])
  if (error) {
    console.log(error)
    return
  }
  if (data) {
    // console.log(data)
  }
  await catsStore.fetchCat(route.params.id)
}

async function removeHerder(herderId) {
  let { data, error } = await supabase
    .from('herder_connections')
    .delete()
    .eq('herder_id', herderId)
    .eq('cat_id', catsStore.state.currentCat.id)

  if (error) {
    console.log(error)
    return
  }
  if (data) {
    // console.log(data)
  }
  await catsStore.fetchCat(route.params.id)
}
onUnmounted(() => {
  catsStore.state.currentCat = {
    user_id: '',
    id: '',
    name: '',
    avatar: '',
    birthday: '',
    food_info: '',
    health_info: '',
    behaviour_info: '',
    herder_connections: '',
    catHerderProfiles: '',
    herders: '',
    herderProfiles: '',
    profiles: {
      id: '',
      username: ''
    },
    cats_info: [{ food_info: '' }, { health_info: '' }, { behaviour_info: '' }]

    // age: '',
    // description: ''
  }
})
// onMounted(async () => {
//   await catsStore.fetchCat(route.params.id)
// })
onBeforeMount(async () => {
  await catsStore.fetchCat(route.params.id)
  // await catsStore.fetchCatInfo(route.params.id)

  // await fetchOwner()
  // await fetchCatHerders()
})
</script>

<style scoped>
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

.user-content-container {
  width: 70vw;
  display: grid;
  position: relative;
  gap: 0.75rem;
}

.herder-output-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 1rem;
}

.herder-input-container {
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  position: relative;
  width: 100%;
}

.cat-content {
  display: grid;
  justify-items: start;
  width: 70vw;
  gap: 1rem;
  position: relative;
}

.info-segment {
  width: 70vw;
  padding-inline: 1.25rem;
  padding-bottom: 1rem;
  /* border: 2px solid var(--primary); */
  position: relative;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
}
.info-segment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: max-content;
}

h2 {
  color: var(--primary);
  font-size: 1.1rem;
  top: -0.8rem;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-darker);
}
.info-segment > p {
  padding-bottom: 0.5rem;
  padding-inline: 0.5rem;
  inline-size: 100%;
  overflow-wrap: break-word;
  hyphens: manual;
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

  .user-content-container {
    width: 500px;
  }

  .cat-content,
  .info-segment {
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

  .user-content-container {
    width: 700px;
  }

  .cat-content,
  .info-segment {
    width: 700px;
  }
}
@media screen and (min-width: 1200px) {
  header {
    width: 1000px;
  }
  .user-content-container {
    width: 1000px;
  }
  .cat-content {
    grid-template-columns: 1fr 1fr;
    width: 1000px;
  }

  .info-segment {
    width: 500px;
  }
  .herder-input-container {
    gap: 1rem;
    grid-template-columns: 2fr 2fr;
  }
  .herder-input-container > * {
    width: 500px;
  }
}
</style>
