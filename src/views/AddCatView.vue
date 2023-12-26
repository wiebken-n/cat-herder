<template>
  <div class="content-wrapper">
    <header><h1 class="headline" data-cy="headline">Füge eine Katze hinzu</h1></header>
    <div class="card menu-container">
      <div class="number-menu-container">
        <PrimeButton
          @click="activeMenuItem = 0"
          rounded
          label="1"
          :outlined="activeMenuItem !== 0"
        />
        <PrimeButton
          @click="activeMenuItem = 1"
          rounded
          label="2"
          :outlined="activeMenuItem !== 1"
        />
        <PrimeButton
          @click="activeMenuItem = 2"
          rounded
          label="3"
          :outlined="activeMenuItem !== 2"
        />
        <PrimeButton
          @click="activeMenuItem = 3"
          rounded
          label="4"
          :outlined="activeMenuItem !== 3"
        />
      </div>
      <!-- <PrimeTabMenu v-model:activeIndex="activeMenuItem" :model="menuItems" /> -->
    </div>
    <form>
      <div
        class="site-one site-container"
        :class="{ containeractive: activeMenuItem === 0 }"
        v-if="activeMenuItem === 0"
      >
        <article class="input-avatar-wrapper">
          <div class="image-container">
            <svg
              v-if="!catsStore.state.currentCat.avatar"
              alt="cat avatar"
              class="cat-avatar cat-image-show cat-avatar-dummy"
              data-cy="cat-avatar"
              @click="pickAvatarVisible = true"
            >
              <use
                class="svg-img"
                xlink:href="@/assets/icons.svg#cat-sitting"
                fill="currentcolor"
              ></use>
            </svg>
            <img
              v-else
              class="cat-image-show cat-avatar"
              :src="imageUrl(catsStore.state.currentCat.avatar)"
              alt="cat avatar"
              @click="pickAvatarVisible = true"
            />
          </div>

          <PrimeButton
            class="button-avatar-selection"
            label="Wähle einen Avatar aus"
            icon="pi pi-external-link"
            @click="pickAvatarVisible = true"
          />
        </article>

        <article class="input-name-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#heart" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-name"> Wie heißt deine Katze?</label>
          </div>
          <PrimeInputText
            id="input-cat-name"
            class="input-cat-name input"
            data-cy="input-cat-name"
            v-model="catsStore.state.currentCat.name"
          />
        </article>
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#birthday-cake" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-birthday"> Wann wurde deine Katze geboren?</label>
          </div>
          <PrimeCalendar
            class="input"
            id="input-cat-birthday"
            v-model="catsStore.state.currentCat.birthday"
            view="month"
            dateFormat="mm/yy"
            showIcon
          />
        </article>

        <article class="input-breed-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
            </svg>
            <label class="label" for="catbreed-selection">
              Um welche Art von Katze handelt es sich?</label
            >
          </div>
          <PrimeDropdown
            v-model="catsStore.state.currentCat.breed"
            :options="resourcesStore.options.catbreeds"
            optionLabel="content"
            placeholder="Wähle eine Bezeichnung aus"
            id="catbreed-selection"
          />
        </article>
        <article class="input-inoutdoor-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#open-door" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-inoutdoor">
              Lebt deine Katze drinnen und/oder draußen?</label
            >
          </div>
          <PrimeDropdown
            v-model="catsStore.state.currentCat.in_outdoor"
            :options="resourcesStore.options.inoutdoor"
            optionLabel="content"
            placeholder="Wähle eine Option aus"
            id="input-cat-inoutdoor"
          />
        </article>

        <div class="button-wrapper">
          <PrimeButton outlined class="button-nav button-right" @click="activeMenuItem = 1">
            <span>weiter</span
            ><svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-right" fill="currentcolor"></use>
            </svg>
          </PrimeButton>
        </div>
      </div>

      <div
        class="site-one site-container"
        :class="{ containeractive: activeMenuItem === 1 }"
        v-if="activeMenuItem === 1"
      >
        <article class="input-weight-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#scale" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-weight"> Wie viel wiegt deine Katze?</label>
          </div>
          <PrimeInputNumber
            v-model="catsStore.state.currentCat.weight"
            class="input input-text"
            inputId="weight"
            suffix=" kg"
            :minFractionDigits="1"
            :maxFractionDigits="2"
          />

          <!-- <PrimeInputText
              id="input-cat-name"
              class="input-cat-name input"
              data-cy="input-cat-name"
              v-model="catsStore.state.currentCat.weight"
            /> -->
        </article>
        <article class="input-food-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#meat" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-food">
              Welche Art(en) von Futter bekommt deine Katze?</label
            >
          </div>
          <PrimeMultiSelect
            v-model="catsStore.state.currentCat.food_varieties"
            :options="resourcesStore.options.foodVarieties"
            optionLabel="content"
            placeholder="Wähle die Futtervariante(n) aus"
            id="input-cat-inoutdoor"
            :maxSelectedLabels="4"
            class="multiselect"
          />
        </article>
        <article class="input-feeding-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#calendar-icon" fill="currentcolor"></use>
            </svg>
            <label class="label" for="feeding-selection">
              Wie viele Mahlzeiten bekommt deine Katze pro Tag?</label
            >
          </div>
          <PrimeDropdown
            v-model="catsStore.state.currentCat.feeding_times"
            :options="resourcesStore.options.feedingTimes"
            optionLabel="content"
            placeholder="Wähle eine Anzahl aus"
            id="feeding-selection"
          />
        </article>
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-food "
              >Beschreibe hier bitte die einzelnen Mahlzeiten:
              <span class="info-optional">(optional)</span></label
            >
          </div>
          <PrimeTextArea
            v-model="catsStore.state.currentCat.food_info"
            id="input-cat-food"
            class="input-cat-food input input-area"
          ></PrimeTextArea>
        </article>

        <div class="button-wrapper">
          <PrimeButton outlined class="button-nav button-left" @click="activeMenuItem = 0">
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-left" fill="currentcolor"></use></svg
            ><span>zurück</span>
          </PrimeButton>
          <PrimeButton outlined class="button-nav button-right" @click="activeMenuItem = 2">
            <span>weiter</span
            ><svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-right" fill="currentcolor"></use>
            </svg>
          </PrimeButton>
        </div>
      </div>

      <div
        class="site-one site-container"
        :class="{ containeractive: activeMenuItem === 2 }"
        v-if="activeMenuItem === 2"
      >
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#drugs" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-food "
              >Bekommt deine Katze Medikamente?
            </label>
          </div>
          <PrimeDropdown
            v-model="catsStore.state.currentCat.drugs"
            :options="resourcesStore.options.drugs"
            optionLabel="content"
            placeholder="Wähle eine Option aus"
            id="drugs"
          />
        </article>
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#pillbox" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-food "
              >Beschreibe hier die Medikamente: <span class="info-optional">(optional)</span></label
            >
          </div>
          <PrimeTextArea
            v-model="catsStore.state.currentCat.drugs_info"
            class="input-area"
            id="drugs-details"
          />
        </article>
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#medical" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-health"
              >Beschreibe hier eventuelle gesundheitliche Besonderheiten:
              <span class="info-optional">(optional)</span></label
            >
          </div>
          <PrimeTextArea
            id="input-cat-health"
            class="input-cat-health input input-area"
            v-model="catsStore.state.currentCat.health_info"
          ></PrimeTextArea>
        </article>

        <div class="button-wrapper">
          <PrimeButton outlined class="button-nav button-left" @click="activeMenuItem = 1">
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-left" fill="currentcolor"></use></svg
            ><span>zurück</span>
          </PrimeButton>
          <PrimeButton outlined class="button-nav button-right" @click="activeMenuItem = 3">
            <span>weiter</span
            ><svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-right" fill="currentcolor"></use>
            </svg>
          </PrimeButton>
        </div>
      </div>

      <div
        class="site-one site-container"
        :class="{ containeractive: activeMenuItem === 3 }"
        v-if="activeMenuItem === 3"
      >
        <article class="input-personality-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#even-scales" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-personality">
              Welches Verhalten zeigt deine Katze?</label
            >
          </div>
          <PrimeMultiSelect
            class="multiselect"
            v-model="catsStore.state.currentCat.personality"
            :options="resourcesStore.options.personality"
            optionLabel="content"
            placeholder="Wähle passende Optionen aus"
            id="input-cat-personality"
            :maxSelectedLabels="10"
          />
        </article>

        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#cloud-lightning" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-behaviour"
              ><span>Beschreibe hier eventuelle Verhaltensbesonderheiten:</span>
              <span class="info-optional">(optional)</span>
            </label>
          </div>
          <PrimeTextArea
            id="input-cat-behaviour"
            class="input-cat-behaviour input input-area"
            v-model="catsStore.state.currentCat.behaviour_info"
          ></PrimeTextArea>
        </article>

        <article class="input-playtimes-wrapper">
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#ball" fill="currentcolor"></use>
            </svg>
            <label class="label" for="input-cat-playtimes">
              Wie häufig spielst du mit deiner Katze?</label
            >
          </div>
          <PrimeDropdown
            v-model="catsStore.state.currentCat.playtimes"
            :options="resourcesStore.options.playtimes"
            optionLabel="content"
            placeholder="Wähle passende Optionen aus"
            id="input-cat-playtimes"
          />
        </article>
        <article>
          <div>
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#pawprint" fill="currentcolor"></use>
            </svg>
            <label class="label label-info" for="input-cat-play"
              >Beschreibe hier wie du mit deiner Katze spielst:
              <span class="info-optional">(optional)</span></label
            >
          </div>
          <PrimeTextArea
            id="input-cat-play"
            class="input-cat-play input input-area"
            v-model="catsStore.state.currentCat.play_info"
          ></PrimeTextArea>
        </article>
        <PrimeButton @click="addCat" class="btn-submit" label="Speichere deine Katze"></PrimeButton>
        <div class="button-wrapper">
          <PrimeButton outlined class="button-nav button-left" @click="activeMenuItem = 2">
            <svg class="icon">
              <use xlink:href="@/assets/icons.svg#chevrons-left" fill="currentcolor"></use></svg
            ><span>zurück</span>
          </PrimeButton>
        </div>
      </div>
    </form>
    <PrimeDialog
      v-model:visible="pickAvatarVisible"
      modal
      header="Wähle ein Avatarbild aus"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="avatars-container">
        <div class="avatar-wrapper" v-for="number of avatarNumbers" :key="number">
          <button class="pick-avatar-button" @click="selectAvatar(number)">
            <img
              class="cat-image cat-image-show cat-avatar selection-cat-avatar"
              :src="imageUrl(number)"
              :alt="'Katzenavatar Nr. ' + number"
            />
          </button>
        </div>
      </div>
    </PrimeDialog>
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCatsStore } from '../stores/useCatsStore'
import { useResourcesStore } from '../stores/useResourcesStore'
import { supabase } from '../supabase'
import { onUnmounted, onBeforeMount } from 'vue'
import router from '../router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const formError = ref('')
const catsStore = useCatsStore()
const resourcesStore = useResourcesStore()

const pickAvatarVisible = ref(false)
const avatarNumbers = []

const activeMenuItem = ref(0)

const toastData = reactive({
  severity: 'warn',
  summary: 'Warnung',
  detail: ''
})

const addCatToast = () => {
  toast.add({
    severity: toastData.severity,
    summary: toastData.summary,
    detail: toastData.detail,
    life: 3000
  })
}

function createAvatarNumbers() {
  for (let i = 1; i < 10; i++) {
    avatarNumbers.push(i)
  }
}

function selectAvatar(number) {
  catsStore.state.currentCat.avatar = number
  pickAvatarVisible.value = false
}

function imageUrl(catAvatar) {
  return new URL(`/src/assets/images/cat-avatar_${catAvatar}.webp`, import.meta.url).href
}

const addCat = async () => {
  let cat = catsStore.state.currentCat
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
    cat.playtimes.length < 1 ||
    cat.breed.length < 1
  ) {
    toastData.summary = 'Nicht alle Daten vorhanden'
    toastData.detail = 'Bitte fülle alle Pflichtfelder aus!'
    addCatToast()
    return
  }
  if (cat.length > 20) {
    toastData.summary = 'Name zu lang'
    toastData.detail = 'Der Name darf maximal 20 Zeichen lang sein'
    addCatToast()
    return
  }
  if (
    cat.food_info.length > 3000 ||
    cat.health_info.length > 3000 ||
    cat.behaviour_info.length > 3000 ||
    cat.drugs_info.length > 3000 ||
    cat.play_info.length > 3000
  ) {
    toastData.summary = 'Text zu lang'
    toastData.detail =
      'Die Texte zu Futter, Gesundheit, Medikamenten, Verhalten und Spielen dürfen jeweils maximal 3000 Zeichen lang sein!'
    addCatToast()
    return
  }
  const { data, error } = await supabase
    .from('cats')
    .insert([{ name: cat.name, birthday: cat.birthday, avatar: cat.avatar, breed: cat.breed }])
    .select()
    .single()

  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    catsStore.state.currentCat.id = data.id
    formError.value = ''
    await addCatInfo(data.id)
    toastData.severity = 'success'
    toastData.summary = 'Katze gespeichert'
    toastData.detail = 'Deine Katze wurde hinzugefügt!'
    addCatToast()
    setTimeout(() => {
      router.push({ name: 'cat', params: { id: catsStore.state.currentCat.id } })
    }, 1500)
  }
}

const addCatInfo = async (catId) => {
  let cat = catsStore.state.currentCat
  let cat_id = catId

  const { data, error } = await supabase
    .from('cats_info')
    .insert([
      {
        cat_id: cat_id, // UUID
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
      }
    ])
    .select()
    .single()
  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    formError.value = ''
  }
}

function emptyCatData() {
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
    behaviour_info: ''
  }
}

let touchstartX = 0
let touchendX = 0

function checkIfSwipe() {
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

document.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX
  checkIfSwipe()
})

onBeforeMount(() => {
  createAvatarNumbers()
  emptyCatData()
})

onUnmounted(() => {
  emptyCatData()
})
</script>

<style scoped>
.content-wrapper {
  padding-inline: 2rem;
  display: grid;
  justify-items: center;
  /* gap: 1rem; */
  text-align: start;
}

header {
  text-align: left;
}
.headline {
  text-align: center;
  font-size: 1.75rem;
  padding-bottom: 1rem;
}
.number-menu-container {
  display: flex;
  gap: calc(1.5vw + 1rem);
  justify-content: center;
}
.number-menu-container > button {
  width: 1.25rem;
  height: 1.25rem;
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  font-family: 'Roboto-Medium';
  box-shadow: 0 0 3px 1px var(--card-shadow);
  transition: all 200ms ease-in-out;
}

.number-menu-container > button:hover,
.number-menu-container > button:focus {
  box-shadow: 0 0 4px 0px var(--text-off);
}

form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-bottom: 2rem;
  position: relative;
}

.site-container {
  margin-top: 3rem;
  display: grid;
  gap: 2rem;
  position: relative;
  /* opacity: 0; */
  /* transition: all 500ms ease-in-out; */
}
/*
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */

/*
.menufade-enter-active,
.menufade-leave-active {
  opacity: 100;
  transition: all 150ms ease-out;
  transform: translateX(0);
}

.menufade-enter-from {
  transform: translateX(-5vw);
  opacity: 0;
}
.menufade-leave-to {
  transform: translateX(5vw);
  opacity: 0;
}
*/
.site-container > article {
  display: grid;
  gap: 0.5rem;
}

article > div {
  padding-left: 0.25rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.label {
  font-family: 'Roboto-Regular';
  font-size: 1.025rem;
}
.label-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.info-optional {
  font-size: 0.9rem;
  align-self: flex-end;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--dark);
}
.input-area {
  height: 5rem;
}

.button-wrapper {
  display: flex;
}
.button-nav {
  display: flex;
  justify-content: space-between;
  width: 8rem;
  transition: all 200ms ease-in-out;
}

.button-right {
  margin-left: auto;
}
.button-nav > svg {
  color: var(--primary);
}
header,
.menu-container,
form,
form > article,
form > article > *,
.site-container,
.site-container > article,
.btn-submit,
.multiselect {
  width: 80vw;
}

@media screen and (min-width: 600px) {
  header,
  .menu-container,
  form,
  form > article,
  form > article > *,
  .site-container,
  .site-container > article,
  .btn-submit,
  .multiselect {
    width: 70vw;
  }
}

@media screen and (min-width: 700px) {
  header,
  .menu-container,
  form,
  form > article,
  form > article > *,
  .site-container,
  .site-container > article,
  .btn-submit,
  .multiselect {
    width: 500px;
  }
}

@media screen and (min-width: 1200px) {
  header,
  .menu-container,
  form,
  form > article,
  form > article > *,
  .site-container,
  .site-container > article,
  .btn-submit,
  .multiselect {
    width: 600px;
  }
}
.avatars-container {
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.image-container {
  display: grid;
  justify-content: center;
  padding-bottom: 1rem;
}
.cat-image,
.cat-image-show {
  background-color: transparent;
  border-radius: 90%;
  width: 100px;
  height: auto;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.cat-image-show:hover,
.cat-image-show:focus {
  scale: 1.05;
  box-shadow: 0 0 10px 2px var(--hover-shadow);
}

.cat-avatar {
  width: 6rem;
  height: 6rem;
  background: var(--background-cat-avatar);
  border-radius: 100%;
  padding: 0.5rem;
  box-shadow: 0 0 10px 2px var(--card-shadow);
}

.cat-avatar-dummy {
  color: var(--cat-avatar-dummy);
  background: var(--background-cat-avatar);
}
.svg-img {
  scale: 0.5;
  transform: translate(50%, 50%);
}

.pick-avatar-button {
  background-color: transparent;
  border: 0 transparent solid;
}
.cat-image:hover,
.cat-image:focus {
  box-shadow: 0 0 10px 2px var(--hover-shadow);
  scale: 1.05;
  animation: tilt-shaking 0.25s 2 ease-in-out;
}
.cat-image:active {
  box-shadow: 0 0 20px 2px var(--primary-darker);
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
