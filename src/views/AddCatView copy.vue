<!-- <template>
  <div class="content-wrapper">
    <header><h1 class="headline" data-cy="headline">Füge eine Katze hinzu</h1></header>
    <form>
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
          outlined
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
      <article>
        <div>
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
          </svg>
          <label class="label label-info" for="input-cat-food "
            >Welches Futter bekommt deine Katze?
            <span class="info-optional">(optional)</span></label
          >
        </div>
        <PrimeTextArea
          v-model="catsStore.state.currentCat.food_info"
          id="input-cat-food"
          class="input-cat-food input input-area"
        ></PrimeTextArea>
      </article>
      <article>
        <div>
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#medical" fill="currentcolor"></use>
          </svg>
          <label class="label label-info" for="input-cat-health"
            >Hat deine Katze gesundheitlichen Besonderheiten?
            <span class="info-optional">(optional)</span></label
          >
        </div>
        <PrimeTextArea
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.health_info"
        ></PrimeTextArea>
      </article>
      <article>
        <div>
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#cloud-lightning" fill="currentcolor"></use>
          </svg>
          <label class="label label-info" for="input-cat-behaviour"
            ><span>Hat deine Katze Verhaltensbesonderheiten?</span>
            <span class="info-optional">(optional)</span>
          </label>
        </div>
        <PrimeTextArea
          id="input-cat-behaviour"
          class="input-cat-behaviour input input-area"
          v-model="catsStore.state.currentCat.behaviour_info"
        ></PrimeTextArea>
      </article>
      <PrimeButton @click="addCat" class="btn-submit" label="Füge deine Katze hinzu"></PrimeButton>
    </form>
    <PrimeDialog
      v-model:visible="pickAvatarVisible"
      modal
      header="Wähle einen Avatarbild aus"
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
import { supabase } from '../supabase'
import { onUnmounted, onBeforeMount } from 'vue'
import router from '../router'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const formError = ref('')
const catsStore = useCatsStore()
const pickAvatarVisible = ref(false)
const avatarNumbers = []

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
  let name = catsStore.state.currentCat.name
  let birthday = catsStore.state.currentCat.birthday
  let avatar = catsStore.state.currentCat.avatar
  if (name.length < 1 || birthday.length < 1 || avatar.length < 1) {
    toastData.summary = 'Nicht alle Daten vorhanden'
    toastData.detail = 'Bitte fülle alle Pflichtfelder aus!'
    addCatToast()
    return
  }
  if (name.length > 20) {
    toastData.summary = 'Name zu lang'
    toastData.detail = 'Der Name darf maximal 20 Zeichen lang sein'
    addCatToast()
    return
  }
  if (
    catsStore.state.currentCat.food_info.length > 2000 ||
    catsStore.state.currentCat.health_info.length > 2000 ||
    catsStore.state.currentCat.behaviour_info.length > 2000
  ) {
    toastData.summary = 'Text zu lang'
    toastData.detail =
      'Die Texte zu Futter, Gesundheit und Verhalten dürfen jeweils maximal 2000 Zeichen lang sein!'
    addCatToast()
    return
  }
  const { data, error } = await supabase
    .from('cats')
    .insert([{ name, birthday, avatar }])
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
    addCatInfo(data.id)
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
  let food_info = catsStore.state.currentCat.food_info
  let health_info = catsStore.state.currentCat.health_info
  let behaviour_info = catsStore.state.currentCat.behaviour_info
  let cat_id = catId
  const { data, error } = await supabase
    .from('cats_info')
    .insert([
      {
        cat_id: cat_id,
        food_info: food_info,
        health_info: health_info,
        behaviour_info: behaviour_info
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
  catsStore.state.currentCat.id = ''
  catsStore.state.currentCat.name = ''
  catsStore.state.currentCat.avatar = ''
  catsStore.state.currentCat.birthday = ''
  catsStore.state.currentCat.food_info = ''
  catsStore.state.currentCat.health_info = ''
  catsStore.state.currentCat.behaviour_info = ''
}
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
  gap: 1rem;
  text-align: start;
}

header {
  width: 80vw;
  text-align: left;
}
.headline {
  text-align: center;
  font-size: 1.75rem;
  padding-bottom: 1rem;
}

form {
  width: 80vw;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-bottom: 2rem;
  position: relative;
}

form > article {
  width: 80vw;
  display: grid;
  gap: 0.4rem;
}

article > div {
  padding-left: 0.25rem;
  display: flex;
  gap: 1rem;
  align-items: center;
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

.btn-submit {
  width: 80vw;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--dark);
}
.input-area {
  height: 7rem;
}

@media screen and (min-width: 600px) {
  header,
  form,
  form > article,
  form > article > *,
  .btn-submit {
    width: 70vw;
  }
}

@media screen and (min-width: 700px) {
  header,
  form,
  form > article,
  form > article > *,
  .btn-submit {
    width: 500px;
  }
}

@media screen and (min-width: 1200px) {
  header,
  form,
  form > article,
  form > article > *,
  .btn-submit {
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
.cat-image-show:hover {
  scale: 1.05;
  box-shadow: 0 0 10px 2px var(--hover-shadow);
}

.cat-avatar {
  width: 7.5rem;
  height: 7.5rem;
  background: var(--background-cat-avatar);
  border-radius: 100%;
  padding: 0.5rem;
  box-shadow: 0 0 10px 2px var(--card-shadow);
}

.cat-avatar-dummy {
  color: var(--cat-avatar-dummy);
  background: var(--old-rose-darker);
}
.svg-img {
  scale: 0.5;
  transform: translate(50%, 50%);
}

.pick-avatar-button {
  background-color: transparent;
  border: 0 transparent solid;
}
.cat-image:hover {
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
</style> -->
