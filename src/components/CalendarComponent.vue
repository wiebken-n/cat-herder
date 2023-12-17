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
          <div class="input-wrappper">
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

        <div v-if="activeMenuItem === 0" class="dates-month-wrapper">
          <div class="todo-container">
            <div class="no-todos"><p>keine Termine vorhanden</p></div>
            <div class="todo-card-wrapper" v-for="todo of todos" :key="todo">
              <div
                v-if="
                  new Date(todo.date).getMonth() + 1 === shownDate.month &&
                  new Date(todo.date).getFullYear() === shownDate.year
                "
              >
                <TodoCard
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="date = new Date(todo.date)"
                  @editTodo="(todoDescription) => handleEdit(todoDescription, todo)"
                  @checkboxClicked="(checkboxState) => handleCheckboxChange(checkboxState, todo)"
                  class="todo-card"
                ></TodoCard>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeMenuItem === 1" class="dates-day-wrapper">
          <div class="todo-container">
            <div class="no-todos"><p>keine Termine vorhanden</p></div>
            <div v-for="todo of todos" :key="todo" class="todo-card-wrapper">
              <div
                v-if="
                  new Date(todo.date).getDate() ===
                    new Date(new Date(date).setHours(10)).getDate() &&
                  new Date(todo.date).getMonth() + 1 === shownDate.month &&
                  new Date(todo.date).getFullYear() === shownDate.year
                "
              >
                <TodoCard
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="date = new Date(todo.date)"
                  @editTodo="(todoDescription) => handleEdit(todoDescription, todo)"
                  @checkboxClicked="(checkboxState) => handleCheckboxChange(checkboxState, todo)"
                  class="todo-card"
                ></TodoCard>
              </div>
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
import { supabase } from '../supabase'
import { useUserStore } from '../stores/useUserStore'
import { useCatsStore } from '../stores/useCatsStore'
import { useToast } from 'primevue/usetoast'
import TodoCard from './TodoCard.vue'

const toast = useToast()
const confirm = useConfirm()

const userStore = useUserStore()
const catsStore = useCatsStore()

const calendar = ref(null)

const todoContent = ref('')

const todos = ref([
  // {
  // id: uuid,
  // cat_id: uui,
  // created_by: uui,
  // content: string,
  // completed: bool
  // date: Date,
  //time: Date,
  //
  //  }
])

const addNewTodo = ref(false)
const menuItems = ref([{ label: 'Termine in diesem Monat' }, { label: 'Termine an diesem Tag' }])
const activeMenuItem = ref(0)

const date = ref(new Date())
const rules = ref({
  minutes: [0, 15, 30, 45]
})

const shownDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
})

function handleDidMove(pages) {
  shownDate.value.month = pages[0].month
  shownDate.value.year = pages[0].year
}

async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select(`id, cat_id, content, created_by, completed, created_at, date, profiles(id, username)`)
    .eq('cat_id', catsStore.state.currentCat.id)
  if (error) {
    console.log(error)
  }
  if (data) {
    todos.value = data
    sortTodos()
  }
}

async function handleEdit(todoDescription, todo) {
  if (todoDescription.length < 1 || todoDescription.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Text ungültig',
      detail: 'Bitte gib einen zwischen 1 und 500 Zeichen langen Text ein ',
      life: 3000
    })
    return
  }
  todoContent.value = todoDescription
  const { data, error } = await supabase
    .from('todos')
    .update([
      {
        content: todoContent.value,
        date: date.value
      }
    ])
    .eq('id', todo.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    todoContent.value = ''
    getTodos()
  }
}

async function handleCheckboxChange(checkboxState, todo) {
  const { data, error } = await supabase
    .from('todos')
    .update([
      {
        completed: checkboxState
      }
    ])
    .eq('id', todo.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    getTodos()
  }
}

async function deleteTodo(todo) {
  const { data, error } = await supabase.from('todos').delete().eq('id', todo.id).select()

  if (error) {
    console.log(error)
  }
  if (data) {
    getTodos()
  }
}

async function createNewTodo() {
  if (todoContent.value.length < 1 || todoContent.value.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Text ungültig',
      detail: 'Bitte gib einen zwischen 1 und 500 Zeichen langen Text ein ',
      life: 3000
    })
    return
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([
      {
        cat_id: catsStore.state.currentCat.id,
        content: todoContent.value,
        date: date.value
      }
    ])
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
  }
  getTodos()
  todoContent.value = ''
  addNewTodo.value = false
}

function sortTodos() {
  todos.value = todos.value.sort(compareDateCreated)

  function compareDateCreated(a, b) {
    if (a.date < b.date) {
      return -1
    } else if (a.date > b.date) {
      return 1
    }
    return 0
  }
}

const attributes = computed(() => {
  if (todos.value === null) {
    return null
  } else {
    return [
      ...todos.value.map((todo) => ({
        dates: todo.date,
        dot: {
          color: todo.completed ? 'primary' : 'rose',
          ...(todo.completed && { class: 'opacit-75' })
        },
        popover: {
          label: todo.content
        }
      }))
    ]
  }
})

const selectedColor = ref('primary')

const deleteTodoDialog = (todo) => {
  confirm.require({
    group: 'headless',
    message: `Möchtest du den Termin löschen`,
    header: 'Termin löschen',

    accept: () => {
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
.todo-container {
  background-color: var(--card-background);
  box-shadow: 0 0 4px 2px var(--card-shadow);

  padding: 1rem;
  min-height: 10rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
}

.no-todos > p {
  color: var(--text);
  font-family: 'Roboto-Slab';
  position: absolute;
  margin: 0;
  top: 49%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.todo-card-wrapper {
  z-index: 2;
}
.todo-card {
  margin-block: 0.5rem;
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
  .calendar-container,
  .dialog-container {
    width: 400px;
  }
}

@media screen and (min-width: 800px) {
  .calendar-container {
    width: 600px;
  }
  .dialog-container {
    width: 630px;
  }
}
</style>
