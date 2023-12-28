<template>
  <div class="content-wrapper">
    <Toast />
    <header>
      <img
        tabindex="0"
        class="cat-avatar"
        :src="imageUrl(catsStore.state.currentCat.avatar)"
        alt="cat avatar"
      />
      <div class="header-text-wrapper">
        <h1>{{ catsStore.state.currentCat.name }}</h1>
        <h2 class="subheader">
          <!-- <span>{{ catsStore.getAge(catsStore.state.currentCat.birthday) }} alt</span> -->
          <span
            ><span v-if="ownerId !== userStore.state.userId"
              >{{ catsStore.state.currentCat.profiles.username }}'s Katze</span
            >
            <span v-else>Deine Katze</span>
          </span>
        </h2>
      </div>
    </header>
    <!-- <div class="menu-wrapper site-menu-wrapper">
      <PrimeTabMenu tabindex="0" v-model:activeIndex="activeMenuItem" :model="menuItems" />
    </div> -->
    <nav class="cat-view-menu-wrapper menu-wrapper">
      <PrimeButton
        @click="activeMenuItem = 0"
        :class="{ activeMenuButton: activeMenuItem === 0 }"
        unstyled
        label="Überblick"
        class="menu-btn"
      />

      <PrimeButton
        @click="activeMenuItem = 1"
        :class="{ activeMenuButton: activeMenuItem === 1 }"
        unstyled
        label="Infos"
        class="menu-btn"
      />

      <PrimeButton
        @click="activeMenuItem = 2"
        :class="{ activeMenuButton: activeMenuItem === 2 }"
        unstyled
        label="Termine"
        class="menu-btn"
      />

      <PrimeButton
        @click="activeMenuItem = 4"
        :class="{ activeMenuButton: activeMenuItem === 4 }"
        unstyled
        label="Notes"
        class="menu-btn"
      />
      <PrimeButton
        v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
        @click="activeMenuItem = 3"
        :class="{ activeMenuButton: activeMenuItem === 3 }"
        unstyled
        label="Herder"
        class="menu-btn"
      />
    </nav>

    <div v-if="activeMenuItem === 0" class="cat-overview-container">
      <CatOverview></CatOverview>
    </div>
    <div v-if="activeMenuItem === 1" class="cat-info-container">
      <nav class="cat-info-menu-wrapper menu-wrapper">
        <div class="buffer"></div>
        <PrimeButton
          @click="activeCatInfoMenuItem = 0"
          :class="{ activeMenuButton: activeCatInfoMenuItem === 0 }"
          unstyled
          label="Futter"
          class="menu-btn"
        />
        <div class="buffer"></div>

        <PrimeButton
          @click="activeCatInfoMenuItem = 1"
          :class="{ activeMenuButton: activeCatInfoMenuItem === 1 }"
          unstyled
          label="Gesundheit"
          class="menu-btn"
        />
        <div class="buffer"></div>

        <PrimeButton
          @click="activeCatInfoMenuItem = 2"
          :class="{ activeMenuButton: activeCatInfoMenuItem === 2 }"
          unstyled
          label="Verhalten"
          class="menu-btn"
        />
        <div class="buffer"></div>

        <PrimeButton
          @click="activeCatInfoMenuItem = 3"
          :class="{ activeMenuButton: activeCatInfoMenuItem === 3 }"
          unstyled
          label="Spiel"
          class="menu-btn"
        />
        <div class="buffer"></div>
      </nav>
      <div v-if="activeCatInfoMenuItem === 0" class="cat-content cat-content-food">
        <CatDataCard
          class="catdata"
          :edit="stateEdit.food_varieties"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.food_varieties"
          :hasContent="true"
          headline="Fütterungsform"
          @editMode="handleCardEditModeOn('food_varieties')"
          @dataSaved="handleCardDataSaved('food_varieties')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#meat" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeMultiSelect
              v-model="catsStore.state.currentCat.food_varieties"
              :options="resourcesStore.options.foodVarieties"
              optionLabel="content"
              placeholder="Wähle die Futtervariante(n) aus"
              id="input-cat-inoutdoor"
              :maxSelectedLabels="4"
              class="multiselect"
            />
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          :edit="stateEdit.feeding_times"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.feeding_times"
          :hasContent="true"
          :isNoArray="true"
          suffix=" pro Tag"
          headline="Mahlzeiten pro Tag"
          @editMode="handleCardEditModeOn('feeding_times')"
          @dataSaved="handleCardDataSaved('feeding_times')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#calendar-icon" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeDropdown
              v-model="catsStore.state.currentCat.feeding_times"
              :options="resourcesStore.options.feedingTimes"
              optionLabel="content"
              placeholder="Wähle eine Anzahl aus"
              id="feeding-selection"
              class="dropdown"
            />
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          id="food_info"
          :edit="stateEdit.food_info"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.food_info"
          headline="Futterinfo"
          @editMode="handleCardEditModeOn('food_info')"
          @dataSaved="handleCardDataSaved('food_info')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeTextArea
              v-if="stateEdit.food_info"
              class="input input-area"
              v-model="catsStore.state.currentCat.food_info"
              autoResize
            ></PrimeTextArea>
          </template>
          ></CatDataCard
        >
      </div>
      <div v-if="activeCatInfoMenuItem === 1" class="cat-content cat-content-health">
        <CatDataCard
          class="catdata"
          :edit="stateEdit.weight"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.weight"
          headline="Gewicht"
          :hasContent="false"
          suffix="kg"
          @editMode="handleCardEditModeOn('weight')"
          @dataSaved="handleCardDataSaved('weight')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#scale" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeInputNumber
              class="input-box"
              v-model="catsStore.state.currentCat.weight"
              inputId="weight"
              suffix=" kg"
              :minFractionDigits="1"
              :maxFractionDigits="2"
            />
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          id="health_info"
          :edit="stateEdit.health_info"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.health_info"
          headline="Infos zur Gesundheit"
          :hasContent="false"
          @editMode="handleCardEditModeOn('health_info')"
          @dataSaved="handleCardDataSaved('health_info')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#medical" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeTextArea
              v-if="stateEdit.health_info"
              id="input-cat-health"
              class="input-cat-health input input-area"
              v-model="catsStore.state.currentCat.health_info"
              autoResize
            ></PrimeTextArea>
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          :edit="stateEdit.drugs"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.drugs"
          :hasContent="true"
          :isNoArray="true"
          headline="Medikamentengabe"
          @editMode="handleCardEditModeOn('drugs')"
          @dataSaved="handleCardDataSaved('drugs')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#drugs" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeDropdown
              v-model="catsStore.state.currentCat.drugs"
              :options="resourcesStore.options.drugs"
              class="dropdown"
              optionLabel="content"
              placeholder="Wähle eine Option aus"
              id="drugs"
            />
          </template>
          ></CatDataCard
        >

        <CatDataCard
          class="catdata"
          id="drugs_info"
          :edit="stateEdit.drugs_info"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.drugs_info"
          headline="Infos zu den Medikamenten"
          :hasContent="false"
          @editMode="handleCardEditModeOn('drugs_info')"
          @dataSaved="handleCardDataSaved('drugs_info')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#pillbox" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeTextArea
              id="input-cat-health"
              class="input-cat-health input input-area"
              v-model="catsStore.state.currentCat.drugs_info"
              autoResize
            ></PrimeTextArea>
          </template>
          ></CatDataCard
        >
      </div>
      <div v-if="activeCatInfoMenuItem === 2" class="cat-content cat-content-behaviour">
        <CatDataCard
          class="catdata"
          :edit="stateEdit.in_outdoor"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.in_outdoor"
          :hasContent="true"
          :isNoArray="true"
          headline="Drinnen- oder Draußenkatze?"
          @editMode="handleCardEditModeOn('in_outdoor')"
          @dataSaved="handleCardDataSaved('in_outdoor')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#open-door" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeDropdown
              v-model="catsStore.state.currentCat.in_outdoor"
              :options="resourcesStore.options.inoutdoor"
              optionLabel="content"
              placeholder="Wähle eine Option aus"
              id="input-cat-inoutdoor"
              class="dropdown"
            />
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          id="behaviour_info"
          :edit="stateEdit.behaviour_info"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.behaviour_info"
          headline="Infos zum Verhalten"
          :hasContent="false"
          @editMode="handleCardEditModeOn('behaviour')"
          @dataSaved="handleCardDataSaved('behaviour')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#cloud-lightning" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeTextArea
              v-if="stateEdit.behaviour_info"
              class="input input-area"
              v-model="catsStore.state.currentCat.behaviour_info"
              autoResize
            ></PrimeTextArea>
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          :edit="stateEdit.personality"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.personality"
          :hasContent="true"
          headline="Infos zur Persönlichkeit"
          @editMode="handleCardEditModeOn('personality')"
          @dataSaved="handleCardDataSaved('personality')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#even-scales" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeMultiSelect
              class="multiselect"
              v-model="catsStore.state.currentCat.personality"
              :options="resourcesStore.options.personality"
              optionLabel="content"
              placeholder="Wähle passende Optionen aus"
              id="input-cat-personality"
              :maxSelectedLabels="10"
            />
          </template>
          ></CatDataCard
        >
      </div>
      <div v-if="activeCatInfoMenuItem === 3" class="cat-content cat-content-play">
        <CatDataCard
          class="catdata"
          :edit="stateEdit.playtimes"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.playtimes"
          :hasContent="true"
          :isNoArray="true"
          headline="Spielfrequenz?"
          @editMode="handleCardEditModeOn('playtimes')"
          @dataSaved="handleCardDataSaved('playtimes')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#ball" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeDropdown
              v-model="catsStore.state.currentCat.playtimes"
              :options="resourcesStore.options.playtimes"
              optionLabel="content"
              placeholder="Wähle eine Option aus"
              id="input-cat-playtimes"
              class="dropdown"
            />
          </template>
          ></CatDataCard
        >
        <CatDataCard
          class="catdata"
          id="play_info"
          :edit="stateEdit.play_info"
          :user-is-owner="catsStore.state.currentCat.user_id === userStore.state.userId"
          :dataContent="catsStore.state.currentCat.play_info"
          headline="Infos zur Art des Spielens"
          :hasContent="false"
          @editMode="handleCardEditModeOn('play_info')"
          @dataSaved="handleCardDataSaved('play_info')"
          ><template #icon>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor"></use>
            </svg>
          </template>
          <template #card-input>
            <PrimeTextArea
              class="input input-area"
              v-model="catsStore.state.currentCat.play_info"
              autoResize
            ></PrimeTextArea>
          </template>
          ></CatDataCard
        >
      </div>
    </div>
    <div v-if="activeMenuItem === 2">
      <CalendarComponent />
    </div>
    <div v-if="activeMenuItem === 3" class="herder-container">
      <div v-if="ownerId !== userStore.state.userId" class="user-content-container">
        <div div class="herder-output-container">
          <PrimeTag
            class="user-tag owner-name"
            :value="catsStore.state.currentCat.profiles.username"
            rounded
          ></PrimeTag>
        </div>
      </div>
      <div v-if="ownerId === userStore.state.userId" class="user-content-container">
        <div class="herder-output-container">
          <p class="no-herders-info" v-if="herderProfiles === undefined">
            Du hast {{ catsStore.state.currentCat.name }} noch keine Herder zugewiesen
          </p>
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

          <PrimeConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
              <div class="dialog-container">
                <h3 class="dialog-header">{{ message.header }}</h3>
                <div class="dialog-text-container">
                  <p class="dialog-text">{{ message.message }}</p>
                </div>

                <div class="button-container">
                  <PrimeButton label="Herder entfernen" @click="acceptCallback"></PrimeButton>
                  <PrimeButton label="Zurück" @click="rejectCallback" outlined></PrimeButton>
                </div>
              </div>
            </template>
          </PrimeConfirmDialog>
        </div>
        <div class="herder-input-container">
          <PrimeDropdown
            v-model="selectedHerder"
            :options="userStore.state.herders"
            optionLabel="username"
            placeholder="Wähle einen Nutzer aus"
            class="herder-dropdown"
          />
          <PrimeButton
            label="Füge diese Nutzer als Herder hinzu"
            @click="addHerder(selectedHerder.id)"
          />
        </div>
      </div>
    </div>
    <div v-if="activeMenuItem === 4" class="notes-container">
      <NotesComponent></NotesComponent>
    </div>
  </div>
</template>

<script setup>
import { useCatsStore } from '../stores/useCatsStore'
import { useUserStore } from '../stores/useUserStore'
import { useResourcesStore } from '../stores/useResourcesStore'
import CalendarComponent from '@/components/CalendarComponent.vue'
import NotesComponent from '@/components/NotesComponent.vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, reactive, onUnmounted, ref, computed } from 'vue'
import { supabase } from '../supabase'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import CatDataCard from '@/components/CatDataCard.vue'
import CatOverview from '@/components/CatOverview.vue'

const confirm = useConfirm()
const toast = useToast()

const route = useRoute()
const catsStore = useCatsStore()
const userStore = useUserStore()
const resourcesStore = useResourcesStore()
const selectedHerder = ref('none')
catsStore.state.currentCat.id = route.params.id

function imageUrl(catAvatar) {
  return new URL(`/src/assets/images/cat-avatar_${catAvatar}.webp`, import.meta.url).href
}

// const menuItems = ref([
//   // { label: 'Überblick' },
//   // { label: 'Infos' },
//   // { label: 'Termine' },
//   // { label: 'Herder' }
// ])

const activeMenuItem = ref(catsStore.state.currentCatActiveMenuItems.menuOne)
const activeCatInfoMenuItem = ref(catsStore.state.currentCatActiveMenuItems.menuTwo)
// const catInfoMenuItems = ref([
//   { label: 'Futter' },
//   { label: 'Gesundheit' },
//   { label: 'Verhalten' },
//   { label: 'Spiel' }
// ])

const stateEdit = reactive({
  food_info: false,
  health_info: false,
  behaviour: false,
  personality: false,
  feeding_times: false,
  in_outdoor: false,
  food_varieties: false,
  weight: false,
  drugs: false,
  drugs_info: false,
  playtimes: false,
  play_info: false
})

function handleCardEditModeOn(status) {
  stateEdit[status] = true
}

function handleCardDataSaved(status) {
  editCatInfo(status)
}

const herderProfiles = computed(() => {
  return catsStore.state.currentCat.catHerderProfiles
})
const ownerId = computed(() => catsStore.state.currentCat.profiles.id)

const confirmRemoveHerder = (herder) => {
  confirm.require({
    group: 'headless',
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

async function editCatInfo(status) {
  let cat = catsStore.state.currentCat
  const mandatoryFields = {
    name: 'Name',
    birthday: 'Geburtstag',
    weight: 'Gewicht',
    in_outdoor: 'Drinnen- oder Draußenkatze?',
    food_varieties: 'Fütterungsform',
    feeding_times: 'Mahlzeiten pro Tag',
    drugs: 'Medikamentengabe',
    personality: 'Persönlichkeit',
    playtimes: 'Spielbedarf'
  }

  //// "!!!!!!"
  const optionalFields = {
    food_info: 'Infos zum Futter',
    health_info: 'Infos zur Gesundheit',
    behaviour_info: 'Infos zum Verhalten',
    drugs_info: 'Infos zu Medikamenten',
    play_info: 'Infos zum Spielen'
  }

  if (cat.weight === null || undefined) {
    cat.weight = 0
  }
  if (
    cat.name.length < 1 ||
    cat.birthday.length < 1 ||
    cat.avatar.length < 1 ||
    cat.weight.length < 1 ||
    cat.in_outdoor.length < 1 ||
    cat.food_varieties.length < 1 ||
    cat.feeding_times.length < 1 ||
    cat.drugs.length < 1 ||
    cat.personality.length < 1 ||
    cat.playtimes.length < 1
    // || cat.breed.length < 1
  ) {
    toast.add({
      severity: 'warn',
      summary: `${mandatoryFields[status]} ist ein Pflichtfeld`,
      detail: 'Bitte fülle alle Pflichtfelder aus!',
      life: 3000
    })
    return
  }

  if (cat.name.length < 1) {
    stateEdit[status] = true
    toast.add({
      severity: 'warn',
      summary: 'Name zu kurz',
      detail: 'Der Name darf maximal 20 Zeichen lang sein',
      life: 3000
    })
    return
  }
  if (
    cat.food_info.length > 3000 ||
    cat.health_info.length > 3000 ||
    cat.behaviour_info.length > 3000 ||
    cat.drugs_info.length > 3000 ||
    cat.play_info.length > 3000
  ) {
    stateEdit[status] = true
    toast.add({
      severity: 'warn',
      summary: `${optionalFields[status]} - Text zu lang`,
      detail:
        'Die Texte zu Futter, Gesundheit, Medikamenten, Verhalten und Spielen dürfen jeweils maximal 3000 Zeichen lang sein!',
      life: 3000
    })

    return
  }

  const { data, error } = await supabase
    .from('cats_info')

    .update({
      weight: cat.weight, // txt
      in_outdoor: JSON.stringify(cat.in_outdoor), // JSON {content: txt}
      food_varieties: JSON.stringify(cat.food_varieties), //JSON  [{content: txt}]
      feeding_times: JSON.stringify(cat.feeding_times), // // {content: txt}
      food_info: cat.food_info, // txt
      drugs: JSON.stringify(cat.drugs), // JSON {content: txt}
      drugs_info: cat.drugs_info, //txt
      personality: JSON.stringify(cat.personality), //JSON content-array > txt
      playtimes: JSON.stringify(cat.playtimes), // JSON {content: txt}
      play_info: cat.play_info, //opt ae txt
      health_info: cat.health_info, //opt ae txt
      behaviour_info: cat.behaviour_info //opt ae txt
    })
    .eq('cat_id', catsStore.state.currentCat.id)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    stateEdit[status] = false
    // console.log(data)
  }
}
// async function editFood() {
//   if (stateEdit.food) {
//     await editCatInfo()
//   }
//   stateEdit.food = !stateEdit.food
// }
// async function editHealth() {
//   if (stateEdit.health) {
//     editCatInfo()
//   }
//   stateEdit.health = !stateEdit.health
// }

// async function editBehaviour() {
//   if (stateEdit.behaviour) {
//     editCatInfo()
//   }
//   stateEdit.behaviour = !stateEdit.behaviour
// }

async function addHerder(herderId) {
  if (selectedHerder.value === 'none') {
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

async function fetchCatInfos(id) {
  const { data, error } = await supabase.from('cats_info').select().eq('cat_id', id).single()
  if (error) {
    console.log(error)
  }
  if (data) {
    let cat = catsStore.state.currentCat

    cat.behaviour_info = data.behaviour_info
    cat.drugs = JSON.parse(data.drugs)
    cat.drugs_info = data.drugs_info
    cat.feeding_times = JSON.parse(data.feeding_times)
    cat.food_info = data.food_info
    cat.food_varieties = JSON.parse(data.food_varieties)
    cat.health_info = data.health_info
    cat.in_outdoor = JSON.parse(data.in_outdoor)
    cat.personality = JSON.parse(data.personality)
    cat.play_info = data.play_info
    cat.playtimes = JSON.parse(data.playtimes)
    cat.weight = data.weight
  }
}

document.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX
})
document.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX

  checkIfSwipe()
})

let touchstartX = 0
let touchendX = 0

function checkIfSwipe() {
  if (activeMenuItem.value === 1) {
    if (touchendX < touchstartX) {
      if (touchendX + 150 < touchstartX) {
        if (activeCatInfoMenuItem.value < 3) {
          activeCatInfoMenuItem.value++
        } else if (activeCatInfoMenuItem.value === 3) {
          activeMenuItem.value++
        }
      }
    }
    if (touchendX > touchstartX) {
      if (touchendX - 150 > touchstartX) {
        if (activeCatInfoMenuItem.value > 0) {
          activeCatInfoMenuItem.value--
        } else if (activeCatInfoMenuItem.value === 0) {
          activeMenuItem.value--
        }
      }
    }
  } else {
    if (touchendX < touchstartX) {
      if (touchendX + 150 < touchstartX) {
        if (activeMenuItem.value < 3) {
          activeMenuItem.value++
        }
      }
    }
    if (touchendX > touchstartX) {
      if (touchendX - 150 > touchstartX) {
        if (activeMenuItem.value > 0) {
          activeMenuItem.value--
        }
      }
    }
  }
}

onUnmounted(() => {
  catsStore.state.currentCat = {
    user_id: '',
    id: '',
    name: '',
    avatar: '',
    birthday: '',
    breed: '',

    cat_id: '',
    weight: 0,
    in_outdoor: { content: '' },
    food_varieties: [],
    feeding_times: { content: '' },
    food_info: '',
    drugs: { content: '' },
    drugs_info: '',
    personality: [],
    playtimes: { content: '' },
    play_info: '',
    health_info: '',
    behaviour_info: '',

    herder_connections: '',
    catHerderProfiles: '',
    herders: '',
    herderProfiles: '',
    profiles: {
      id: '',
      username: ''
    }
  }
})

// function fillMenu() {
//   if (catsStore.state.currentCat.user_id === userStore.state.userId) {
//     menuItems.value = [
//       { label: 'Überblick' },
//       { label: 'Infos' },
//       { label: 'Termine' },
//       { label: 'Herder' }
//     ]
//   } else {
//     menuItems.value = [{ label: 'Überblick' }, { label: 'Infos' }, { label: 'Termine' }]
//   }
// }
onBeforeMount(async () => {
  await catsStore.fetchCat(route.params.id)
  await fetchCatInfos(route.params.id)
  // fillMenu()
})

onUnmounted(() => {
  catsStore.state.currentCatActiveMenuItems = {
    menuOne: 0,
    menuTwo: 0
  }
})
</script>

<style scoped>
.user-tag {
  font-size: 1rem;
  padding-inline: 1rem;
  font-family: 'Roboto-Slab';
}

.content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
  text-align: start;
  position: relative;
  padding-bottom: 2rem;
}
header {
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cat-avatar {
  grid-column: 1;
  grid-row: 1 / 4;
  margin-inline: 0.25rem;
  scale: 1;
  width: 7.5rem;
  height: 7.5rem;
  background-color: var(--background-cat-avatar);
  background: var(--background-cat-avatar);
  border-radius: 100%;
  padding: 0.5rem;
  box-shadow: 0 0 10px 2px var(--card-shadow);
}
.cat-avatar:hover,
.cat-avatar:focus {
  animation: tilt-shaking 0.25s 2 ease-in-out;
}

.header-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-text-wrapper > h1 {
  font-size: 1.75rem;
  margin-bottom: 0.125rem;
}

.menu-wrapper,
.site-menu-wrapper,
.cat-info-menu-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.site-menu-wrapper {
  margin-bottom: 1.5rem;
}

.cat-view-menu-wrapper {
  padding-block: 0.25rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
  display: grid;

  grid-template-columns: min-content min-content min-content min-content min-content;
  grid-template-rows: 1fr;
  margin-bottom: 1.5rem;
}
.cat-view-menu-wrapper > .menu-btn {
  font-size: 1rem;
  padding-inline: calc(0.75rem + 1.125vw);
}

.cat-view-menu-wrapper .buffer {
  width: auto;
  border-bottom: 2px solid var(--underline-inactive-menu);
}

.cat-info-menu-wrapper {
  padding-block: 0.25rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  display: grid;
  grid-template-columns: 2fr min-content 1fr min-content 1fr min-content 1fr min-content 2fr;
  grid-template-rows: 1fr;
}

.menu-btn {
  background: none;
  border: none;
  display: block;
  padding-inline: 0.6rem;
  /* border-top: 2px solid var(--underline-inactive-menu); */
  border-bottom: 2px solid var(--underline-inactive-menu);
  border-radius: 0;
  font-size: 0.98rem;
  color: var(--text-inactive);
  font-family: 'Roboto-Medium';
  /* font-weight: 600; */
  letter-spacing: -0.125px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  padding-block: 0.6rem;
}

.menu-btn:active {
  color: var(--text-inactive);
  background-color: rgba(65, 165, 190, 0.384);
}
.buffer {
  width: auto;
  border-bottom: 2px solid transparent;
  /* border-bottom: 2px solid var(--underline-inactive-menu); */
}
.activeMenuButton {
  color: var(--text);
  /* border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius); */
  border-bottom: 2px solid var(--cat-card-background);
}

/* .activeMenuButton:focus {
   color: var(--cat-card-text);
   border-radius: var(--border-radius);
} */
.user-content-container {
  width: 80vw;
  display: grid;
  position: relative;
  gap: 0.75rem;
}
.no-herders-info {
  color: var(--text);
  background-color: transparent;
  border: 2px solid var(--primary);
  padding-inline: 1.25rem;
  padding-block: 0.9rem;
  border-radius: 50px;
  font-family: 'Roboto-Regular';
  opacity: 0.95;
  text-align: center;
}
.herder-output-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 0;
}

.dialog-container {
  border-radius: var(--border-radius);
  display: grid;
  grid-template-columns: 1;
  justify-items: center;
  min-height: max-content;
  width: 85vw;
  background-color: var(--card-background);
  position: relative;
  padding: 1rem;
}
.dialog-container > h3 {
  margin-block: 0.5rem;
  width: 100%;
  text-align: center;
}
.dialog-text-container {
  width: 100%;
  padding-inline: 3rem;
  padding-block: 2rem;
  text-align: left;
  font-weight: 500;
}
.button-container {
  padding-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.catdata {
  width: 100%;
}

.multiselect,
.input-box,
.dropdown {
  width: 100%;
  margin-bottom: 1rem;
}

.cat-content {
  display: grid;
  justify-items: start;
  width: 80vw;
  gap: 1rem;
  position: relative;
}
/*
.info-segment {
  display: grid;
  justify-items: start;
  width: 80vw;
  gap: 0rem;
  position: relative;
} */

h2 {
  color: var(--primary);
  font-size: 1.05rem;
  padding-bottom: 0.5rem;
}
/* .subheader {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.subheader > span {
  padding-inline: 1rem;
  padding-block: 0.25rem;
  border: 2px solid var(--nav-background);
  border-radius: 20px;
} */
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-darker);
}

.input-area {
  height: 100%;
  width: 100%;
  margin-bottom: 1rem;
}
.text-input {
  width: 100%;
  margin-bottom: 1rem;
}
@media screen and (min-width: 700px) {
  header,
  .user-content-container {
    width: 500px;
  }

  .cat-content,
  .catdata {
    width: 600px;
  }
  .menu-wrapper {
    width: 600px;
  }
  .dialog-container {
    width: 450px;
  }
}
@media screen and (min-width: 1000px) {
  header,
  .menu-wrapper,
  .cat-content,
  .catdata,
  .content-wrapper-calendar {
    width: 700px;
  }

  .user-content-container,
  .dialog-container {
    width: 600px;
  }

  .herder-input-container {
    width: 550px;
    margin-inline: auto;
  }
}
@media screen and (min-width: 1200px) {
  header,
  .menu-wrapper,
  .content-wrapper-calendar {
    width: 1000px;
  }
  .cat-info-menu-wrapper {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .cat-content {
    grid-template-columns: 1fr 1fr;
    /* grid-template-rows: 1fr 1fr auto; */
    width: 1000px;
    grid-auto-rows: minmax(0px, auto);
  }

  #food_info,
  #behaviour_info,
  #play_info {
    grid-column: 2;
    grid-row: 1 / span 3;
  }

  #health_info {
    grid-row: 2;
    grid-column: 1;
  }

  #drugs_info {
    grid-row: 2 / span 3;
    grid-column: 2;
  }

  .catdata {
    width: 490px;
  }
  /* .herder-input-container {
    gap: 1rem;
    grid-template-columns: 2fr 2fr;
  } */
}

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
}
</style>
