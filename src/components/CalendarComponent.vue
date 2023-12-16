<template>
  <div class="content-wrapper-calendar">
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
        expanded
        ref="calendar"
        @didMove="handleDidMove"
      >
        <template #footer>
          <div
            class="input-wrappper"
            v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
          >
            <!-- <div class="select-time">
              <h3>Uhrzeit:</h3>
              <div class="time-input-container">
                <PrimeInputNumber class="input-time" v-model="time.hour" :min="0" :max="24" />:
                <PrimeInputNumber class="input-time" v-model="time.minute" :min="0" :max="60" />
              </div>
            </div> -->
            <PrimeButton
              class="button-add-todo"
              label="Neuer Termin"
              @click="addNewTodo = !addNewTodo"
            ></PrimeButton>
          </div>
        </template>
      </DatePicker>
      <PrimeDialog
        v-model:visible="addNewTodo"
        modal
        header="Lege einen neuen Termin an"
        :style="{ width: '600px' }"
        :breakpoints="{ '650px': '500px', '600px': '90vw' }"
      >
        <div class="dialog-content">
          <span class="p-float-label todo-input">
            <PrimeTextArea
              id="todo-content"
              class="input input-area"
              v-model="todoContent"
              label="Termininhalt"
              rows="10"
            ></PrimeTextArea>
            <label for="todo-content" :class="{ labelUp: todoContent }" class="float-label_label"
              >Terminbeschreibung</label
            >
          </span>
          <PrimeButton class="button-send" label="Absenden" @click="createNewTodo"></PrimeButton>
        </div>
      </PrimeDialog>
      <div class="todo-output-container">
        <div class="menu-wrapper">
          <PrimeTabMenu v-model:activeIndex="activeMenuItem" :model="menuItems" />
        </div>
        <div v-if="activeMenuItem === 1" class="dates-month-wrapper">
          <div v-for="todo of todos" :key="todo">
            <div
              v-if="
                new Date(todo.dates).getUTCMonth() + 1 === shownDate.month &&
                new Date(todo.dates).getUTCFullYear() === shownDate.year
              "
            >
              <div class="todo-contentwrapper">
                <p class="todo-date">
                  <span>
                    {{
                      getTime(
                        new Date(todo.dates).getUTCHours(),
                        new Date(todo.dates).getUTCMinutes()
                      )
                    }}</span
                  >

                  <span>|</span>
                  <span>
                    {{
                      getDate(
                        new Date(todo.dates).getUTCDate(),
                        new Date(todo.dates).getUTCMonth() + 1,
                        new Date(todo.dates).getUTCFullYear()
                      )
                    }}</span
                  >
                </p>
                <p class="todo-date"></p>

                <p class="todo-description">{{ todo.desciption }}</p>
                <button
                  v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
                  class="delete-todo-button"
                  @click="deleteTodo(todo)"
                >
                  <svg class="trash-icon">
                    <use xlink:href="@/assets/icons.svg#trash" fill="currentcolor"></use>
                  </svg>
                </button>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div v-if="activeMenuItem === 0" class="dates-day-wrapper">
          <div v-for="todo of todos" :key="todo">
            <div
              v-if="
                new Date(todo.dates).getUTCDate() ===
                  new Date(new Date(date).setHours(10)).getUTCDate() &&
                new Date(todo.dates).getUTCMonth() + 1 === shownDate.month &&
                new Date(todo.dates).getUTCFullYear() === shownDate.year
              "
            >
              <div class="todo-contentwrapper">
                <p class="todo-date">
                  <span>
                    {{
                      getTime(
                        new Date(todo.dates).getUTCHours(),
                        new Date(todo.dates).getUTCMinutes()
                      )
                    }}</span
                  >

                  <span>|</span>
                  <span>
                    {{
                      getDate(
                        new Date(todo.dates).getUTCDate(),
                        new Date(todo.dates).getUTCMonth() + 1,
                        new Date(todo.dates).getUTCFullYear()
                      )
                    }}</span
                  >
                </p>
                <p class="todo-date"></p>

                <p class="todo-description">{{ todo.desciption }}</p>
                <button
                  v-if="catsStore.state.currentCat.user_id === userStore.state.userId"
                  class="delete-todo-button"
                  @click="deleteTodoDialog(todo)"
                >
                  <svg class="trash-icon">
                    <use xlink:href="@/assets/icons.svg#trash" fill="currentcolor"></use>
                  </svg>
                </button>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div class="confimation-wrapper">
        <PrimeConfirmDialog group="headless">
          <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="dialog-container">
              <h3 class="dialog-header">{{ message.header }}</h3>
              <div class="dialog-text-container">
                <p class="dialog-text">{{ message.message }}</p>
              </div>

              <div class="button-container">
                <PrimeButton label="Termin löschen" @click="acceptCallback"></PrimeButton>
                <PrimeButton label="Zurück" @click="rejectCallback" outlined></PrimeButton>
              </div>
            </div>
          </template>
        </PrimeConfirmDialog>
        <Toast />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { ref, computed, onBeforeMount } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
import { useCatsStore } from '../stores/useCatsStore'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const userStore = useUserStore()
const catsStore = useCatsStore()

const calendar = ref(null)

const addNewTodo = ref(false)
const menuItems = ref([{ label: 'Termine an diesem Tag' }, { label: 'Termine in diesem Monat' }])
const activeMenuItem = ref(0)

// const time = ref({
//   hour: 0,
//   minute: 0
// })
const shownDate = ref({
  year: new Date().getUTCFullYear(),
  month: new Date().getUTCMonth() + 1,
  day: new Date().getUTCDate()
})

function handleDidMove(pages) {
  shownDate.value.month = pages[0].month
  shownDate.value.year = pages[0].year
}
async function getTodos() {
  const { data, error } = await supabase
    .from('cats_info')
    .select('todos')
    .eq('cat_id', catsStore.state.currentCat.id)

  if (error) {
    console.log(error)
  }
  if (data) {
    if (data[0].todos === null) {
      todos.value = null
      return
    }
    todos.value = JSON.parse(data[0].todos)
    sortTodos()
  }
}
async function editTodos() {
  const { data, error } = await supabase
    .from('cats_info')

    .update({
      todos: JSON.stringify(todos.value)
    })
    .eq('cat_id', catsStore.state.currentCat.id)
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    todos.value = JSON.parse(data[0].todos)
    sortTodos()
  }
}

function deleteTodo(todo) {
  //   for (let singleTodo of todos.value) {
  for (let i = 0; i < todos.value.length; i++) {
    if (todos.value[i] === todo) {
      todos.value.splice(i, 1)
      editTodos()
    }
  }
}

const date = ref(new Date())
const rules = ref({
  minutes: [0, 15, 30, 45]
})

const todoContent = ref('')

function createNewTodo() {
  if (todoContent.value.length < 1 || todoContent.value.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Text ungültig',
      detail: 'Bitte gib einen zwischen 1 und 500 Zeichen langen Text ein ',
      life: 3000
    })
  }
  if (todos.value === null) {
    todos.value = [
      { desciption: todoContent.value, isComplete: false, dates: date.value, color: 'teal' }
    ]
  } else {
    todos.value.push({
      desciption: todoContent.value,
      isComplete: false,
      dates: date.value,
      color: 'teal'
    })
  }
  sortTodos()
  editTodos()
  todoContent.value = ''
  addNewTodo.value = false
}
// todos: [ {dates: "", }]
function sortTodos() {
  todos.value = todos.value.sort(compareDateCreated)

  function compareDateCreated(a, b) {
    if (a.dates < b.dates) {
      return -1
    } else if (a.dates > b.dates) {
      return 1
    }
    return 0
    // console.log(a)
    // console.log(b)
    // return a.dates - b.dates
  }
}
const todos = ref([
  {
    // desciption: '',
    // text: '',
    // isComplete: false,
    // dates: new Date(),
    // color: 'pink',
    //time: ""
  }
])

function getDate(day, month, year) {
  return day + '.' + month + '.' + year
}

function getTime(hour, minute) {
  return hour + ':' + minute + ' ' + 'Uhr'
}

const attributes = computed(() => {
  if (todos.value === null) {
    return null
  } else {
    return [
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
    ]
  }
})

const selectedColor = ref('teal')

const deleteTodoDialog = (todo) => {
  confirm.require({
    group: 'headless',
    message: `Möchtest du den Termin löschen`,
    header: 'Termin löschen',

    accept: () => {
      // console.log('deleted')
      deleteTodo(todo)
      toast.add({
        severity: 'success',
        summary: 'Termin gelöscht',
        detail: 'Du hast den Termin gelöscht',
        life: 3000
      })
    },
    reject: () => {}
  })
}

onBeforeMount(() => {
  getTodos()
})
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
</script>
<style scoped>
.content-wrapper-calendar {
  display: grid;
  justify-items: center;
  width: 80vw;
  position: relative;
  padding-bottom: 2rem;
}
.calendar-container {
  display: grid;
  justify-items: center;
  width: 100%;
}
.input-wrappper {
  display: flex;
  flex-direction: column;
}
.dialog-content {
  display: grid;
  height: min-content;
  justify-items: center;
  position: relative;
  width: 100%;
}

.todo-input {
  margin-top: 1rem;
  width: 90%;
}
.input-area {
  width: 100%;
  height: 7rem;
}
.float-label_label {
  color: var(--text);
  font-size: 1rem;
  padding-inline: 0.5rem;
}

.input-area:focus + .float-label_label {
  background-color: var(--background-clr);
  transform: translateY(0.55rem);
  color: var(--primary);
}

.labelUp {
  color: var(--text-off);
  background-color: var(--background-clr);
  transform: translateY(0.55rem);
}

.button-send {
  margin-top: 1rem;
  width: 90%;
}
.todo-output-container {
  color: var(--text);
  margin-top: 1rem;
  width: 100%;
}
.menu-wrapper {
  display: flex;
  justify-content: center;
  padding-bottom: 1.25rem;
}
.todo-contentwrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
}

.todo-contentwrapper > p {
  margin: 0;
}

.todo-date {
  font-family: 'Roboto-Slab';
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.todo-description {
  align-self: flex-start;
  padding-block: 0.25rem;
}
.delete-todo-button {
  align-self: flex-end;

  background: none;
  border: none;
  width: min-content;
}
.trash-icon {
  height: 1.25rem;
  width: 1.25rem;
  scale: 1;
  transition: all 200ms ease-in-out;
  color: var(--text);
}
.delete-todo-button:hover > .trash-icon {
  scale: 1.05;
  color: var(--alert-dark);
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
