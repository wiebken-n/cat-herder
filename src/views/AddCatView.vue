<template>
  <div class="content-wrapper">
    <header><h1 class="headline" data-cy="headline">Füge Deine Katze hinzu</h1></header>
    <form>
      <!-- <article class="input-picture-wrapper">
        <CatAvatar size="4" @imgurl="(e) => (imgUrl = e)"></CatAvatar>
      </article> -->
      <article class="input-name-wrapper">
        <div>
          <label class="label" for="input-cat-name"> Wie heißt deine Katze?</label>
          <svg width="1rem" height="1rem" class="icon">
            <use xlink:href="@/assets/icons.svg#heart" fill="currentcolor"></use>
          </svg>
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
          <label class="label" for="input-cat-birthday"> Wann wurde deine Katze geboren?</label>
          <svg width="1rem" height="1rem" class="icon">
            <use xlink:href="@/assets/icons.svg#birthday-cake" fill="currentcolor"></use>
          </svg>
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
          <label class="label" for="input-cat-food ">Welches Futter bekommt deine Katze?</label>
          <svg width="1rem" height="1rem" class="icon">
            <use xlink:href="@/assets/icons.svg#food-bowl" fill="currentcolor"></use>
          </svg>
        </div>
        <PrimeTextArea
          v-model="catsStore.state.currentCat.food_info"
          id="input-cat-food"
          class="input-cat-food input input-area"
        ></PrimeTextArea>
      </article>
      <article>
        <div>
          <label class="label" for="input-cat-health"
            >Welche gesundheitlichen Besonderheiten hat deine Katze?</label
          >
          <svg width="1rem" height="1rem" class="icon">
            <use xlink:href="@/assets/icons.svg#medical" fill="currentcolor"></use>
          </svg>
        </div>
        <PrimeTextArea
          id="input-cat-health"
          class="input-cat-health input input-area"
          v-model="catsStore.state.currentCat.health_info"
        ></PrimeTextArea>
      </article>
      <article>
        <div>
          <label class="label" for="input-cat-behaviour"
            >Welche Verhaltensbesonderheiten hat deine Katze?</label
          >
          <svg width="1rem" height="1rem" class="icon">
            <use xlink:href="@/assets/icons.svg#cloud-lightning" fill="currentcolor"></use>
          </svg>
        </div>
        <PrimeTextArea
          id="input-cat-behaviour"
          class="input-cat-behaviour input input-area"
          v-model="catsStore.state.currentCat.behaviour_info"
        ></PrimeTextArea>
      </article>
      <PrimeButton @click="addCat" class="btn-submit" label="Füge deine Katze hinzu"></PrimeButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import CatAvatar from '../components/CatAvatar.vue'
import { useCatsStore } from '../stores/useCatsStore'
import { supabase } from '../supabase'
const formError = ref('')
const catsStore = useCatsStore()

const addCat = async () => {
  let name = catsStore.state.currentCat.name
  let birthday = catsStore.state.currentCat.birthday
  console.log(name, birthday)
  const { data, error } = await supabase.from('cats').insert([{ name, birthday }]).select()

  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    catsStore.state.currentCat.id = data[0].id
    console.log(data)
    formError.value = ''
    addFood(data[0].id)
    addHealth(data[0].id)
    addBehaviour(data[0].id)
  }
}

const addFood = async (catId) => {
  let food_info = catsStore.state.currentCat.food_info
  let cat_id = catId
  const { data, error } = await supabase.from('food').insert([{ cat_id, food_info }]).select()
  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    console.log(data)
    formError.value = ''
  }
}

const addHealth = async (catId) => {
  let health_info = catsStore.state.currentCat.health_info
  let cat_id = catId
  const { data, error } = await supabase.from('health').insert([{ cat_id, health_info }]).select()
  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    console.log(data)
    formError.value = ''
  }
}
const addBehaviour = async (catId) => {
  let behaviour_info = catsStore.state.currentCat.behaviour_info
  let cat_id = catId
  const { data, error } = await supabase
    .from('behaviour')
    .insert([{ cat_id, behaviour_info }])
    .select()
  if (error) {
    console.log(error)
    formError.value = error
    return
  }
  if (data) {
    console.log(data)
    formError.value = ''
  }
}
// const imgUrl = ref('')
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
  width: 70vw;
  text-align: left;
}
.headline {
  align-self: start;
}

form {
  width: 70vw;
  display: grid;
  gap: 2rem;
  padding-bottom: 2rem;
}
form > article {
  width: 70vw;
  display: grid;
  gap: 0.4rem;
}

article > div {
  display: flex;
  gap: 0.8rem;
}

.btn-submit {
  width: 70vw;
}
.icon {
  color: var(--dark);
}
.input-area {
  height: 7rem;
}
@media screen and (min-width: 600px) {
  header {
    width: 500px;
  }
  form {
    width: 500px;
  }
  form > article > * {
    width: 500px;
  }
  .btn-submit {
    width: 500px;
  }
}

@media screen and (min-width: 1200px) {
  form > article > * {
    width: 500px;
  }
}
</style>
