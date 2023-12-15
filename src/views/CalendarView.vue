<template>
  <div class="content-wrapper">
    <div class="calendar-container">
      <DatePicker
        class="calendar"
        v-model="date"
        mode="dateTime"
        is24hr
        :color="selectedColor"
        :attributes="attributes"
        :rules="rules"
        :is-dark="userStore.state.darkmode"
        :expanded="expanded"
        :columns="columns"
      >
        <template #footer>
          <div class="input-wrappper">
            <PrimeInputText v-model="todoContent"></PrimeInputText>
            <button @click="createNewTodo">new entry</button>
            <button @click="editTodos">Edit todos</button>
          </div>
        </template>
      </DatePicker>

      <div>
        <div v-for="todo of todos" :key="todo">
          <div>
            {{ todo.desciption }} <br />
            {{ todo.dates }}
            {{ new Date(todo.dates).getUTCDate() }}
            {{ new Date(todo.dates).getUTCMonth() + 1 }}
            {{ new Date(todo.dates).getUTCFullYear() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { ref, onUpdated, computed } from 'vue'
import { useScreens } from 'vue-screen-utils'

import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'

const userStore = useUserStore()

async function editTodos() {
  const { data, error } = await supabase
    .from('cats_info')

    .update({
      todos: JSON.stringify(todos.value)
    })
    .eq('cat_id', 'df85dea5-8fbc-43a9-a974-5cdf4df0db8e')
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data[0].todos)
    todos.value = JSON.parse(data[0].todos)
    console.log(todos.value)
  }
}

const date = ref(new Date())
const rules = ref({
  minutes: [0, 15, 30, 45]
})
onUpdated(() => {
  // let x = JSON.stringify(todos.value)
  // console.log(x)
  // let y = JSON.parse(x)
  // console.log(y)
})
// const date = ref(date)
function createNewTodo() {
  todos.value.push({
    desciption: todoContent.value,
    isComplete: false,
    dates: date.value,
    color: 'teal'
  })
  // console.log(todos)
}
const todoContent = ref('')
const todos = ref([
  {
    desciption: 'example description',
    text: 'efefefefefefef',
    isComplete: false,
    dates: new Date(2023, 11, 16, 15, 30),
    color: 'pink'
  }
])

const attributes = computed(() => [
  ...todos.value.map((todo) => ({
    dates: todo.dates,
    dot: {
      color: todo.color,
      ...(todo.isComplete && { class: 'opacit-75' })
    },
    popover: {
      label: todo.desciption
    }
  }))
])

const selectedColor = ref('teal')

// const attributes = ref([
//   {
//     highlight: true,
//     dates: new Date(2023, 11, 16),
//     customData: {
//       header: 'blabliblubb',
//       text: 'efwsfrgergrgggrg wefef '
//     },
//     popover: {
//       label: 'bla'
//     }
//   },
//   {
//     dot: true,
//     dates: new Date(2023, 12, 24),
//     customData: {
//       header: 'blabliblubb',
//       text: 'efwsfrgergrgggrg wefef '
//     }
//   }
// ])
// const date = new Date()

const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '800px'
})
const expanded = mapCurrent({ lg: false }, true)
const columns = mapCurrent({ lg: 2 }, 1)
</script>
<style scoped>
/* .calendar-container {
  height: 500px;
} */
h1 {
  margin-top: 12rem;
}
.content-wrapper {
  display: grid;
  justify-items: center;
  width: 100%;
}
.calendar-container {
  width: 80vw;
  display: grid;
  justify-items: center;
}
.input-wrappper {
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 600px) {
  .calendar-container {
    width: 400px;
  }
}

@media screen and (min-width: 800px) {
  .calendar-container {
    width: 600px;
  }
}
</style>
