<template>
  <div class="content-wrapper-calendar">
    <div class="calendar-container">
      <DatePicker
        class="calendar"
        v-model="date"
        is24hr
        :color="selectedColor"
        :attributes="attributes"
        :rules="rules"
        :is-dark="userStore.state.darkmode"
        highlight="true"
        expanded
        ref="calendar"
        @didMove="handleDidMove"
      >
        <template #footer>
          <div class="input-wrappper">
            <PrimeButton
              class="button-add-todo"
              label="Neuer Termin"
              @click="handleAddTodo"
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
          <span class="p-float-label todo-input todo-input-header">
            <PrimeInputText
              class="input-field input"
              id="todo-header"
              v-model.trim="todoHeaderContent"
            />
            <label
              class="float-label_label"
              :class="{ labelUp: todoHeaderContent }"
              for="todo-header"
              >Art des Termins</label
            >
          </span>
          <span class="p-float-label todo-input">
            <PrimeTextArea
              id="todo-content"
              class="input input-area"
              v-model="todoContent"
              label="Termininhalt"
              rows="10"
            ></PrimeTextArea>
            <label for="todo-content" :class="{ labelUp: todoContent }" class="float-label_label"
              >Terminbeschreibung
            </label>
          </span>
          <div class="date-selector-wrapper">
            <label v-if="repeatingDate" for="date-selector">Terminstart:</label>
            <label v-else for="date-selector">Terminzeitpunkt:</label>

            <PrimeCalendar
              class="input"
              id="date-selectior"
              v-model="date"
              dateFormat="dd/mm/yy"
              showTime
              hourFormat="24"
              showIcon
            />
          </div>

          <div class="toggle-wrapper">
            <PrimeInputSwitch v-model="repeatingDate" id="repeatingDateToggle" /><label
              for="repeatingDateToggle"
              >Termin wiederholt sich</label
            >
          </div>

          <div v-if="repeatingDate" class="repeating-date-container">
            <!-- <p id="description-frequency">Gib hier die Wiederholungsfrequenz an:</p> -->
            <div class="freqency-selection-wrapper">
              <label class="label-repeat-frequency" for="repeat-category"
                >Häufigkeit der Wiederholung:</label
              >
              <PrimeDropdown
                v-model="repeatCategory"
                :options="repeatCategoryOptions"
                optionLabel="content"
                placeholder="Wähle eine Option aus"
                id="repeat-category"
              />
              <PrimeInputNumber
                v-if="repeatCategory"
                v-model="repeatNumber"
                mode="decimal"
                showButtons
                id="repeat-number"
                prefix="Wiederholung alle "
                :suffix="` ` + repeatCategory.content"
                :min="repeatMinMax.min"
                :max="repeatMinMax.max"
              />
              <PrimeMultiSelect
                v-if="repeatCategory.content === 'Wochen'"
                v-model="selectedWeekdays"
                :options="repeatWeekdayCategoryOptions"
                optionLabel="content"
                placeholder="Jeweils am:"
                id="repeat-weekdays"
                :maxSelectedLabels="4"
                class="multiselect"
              />
              <!-- <PrimeInputNumber
                v-model="repeatNumber"
                mode="decimal"
                showButtons
                id="repeat-number"
                prefix=" Wiederholung alle "
                :min="repeatMinMax.min"
                :max="repeatMinMax.max"
              /> -->

              <label class="label-repeat-end" for="input-repeat-end"
                >Ende der Wiederholungen:</label
              >
              <PrimeCalendar
                class="input"
                id="input-repeat-end"
                showTime
                hourFormat="24"
                v-model="repeatingDateEnd"
                dateFormat="dd/mm/yy"
                showIcon
              />
            </div>
          </div>

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
                  (new Date(todo.dates.start).getMonth() + 1 === shownDate.month &&
                    new Date(todo.dates?.start).getFullYear() === shownDate.year) ||
                  todo.editActive === true ||
                  (new Date(todo.dates).getMonth() + 1 === shownDate.month &&
                    new Date(todo.dates).getFullYear() === shownDate.year) ||
                  checkIfRepeatDateCurrentMonth(todo)
                "
              >
                <TodoCardRepeatingDate
                  v-if="todo.dates?.start"
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="handleEditActive(todo)"
                  @editTodo="
                    (todoHeader, todoDescription, currentDate, currentEndDate) =>
                      handleEditRepeating(
                        todoHeader,
                        todoDescription,
                        currentDate,
                        currentEndDate,
                        todo
                      )
                  "
                  @checkboxClicked="(checkboxState) => handleCheckboxChange(checkboxState, todo)"
                  class="todo-card"
                ></TodoCardRepeatingDate>
                <TodoCard
                  v-else
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="handleEditActive(todo)"
                  @editTodo="
                    (todoHeader, todoDescription, currentDate) =>
                      handleEdit(todoHeader, todoDescription, currentDate, todo)
                  "
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
                  (new Date(todo.dates.start).getDate() ===
                    new Date(new Date(date).setHours(10)).getDate() &&
                    new Date(todo.dates.start).getMonth() + 1 === shownDate.month &&
                    new Date(todo.dates.start).getFullYear() === shownDate.year &&
                    date !== null) ||
                  checkIfRepeatDateToday(todo) ||
                  todo.editActive === true ||
                  (new Date(todo.dates).getDate() ===
                    new Date(new Date(date).setHours(10)).getDate() &&
                    new Date(todo.dates).getMonth() + 1 === shownDate.month &&
                    new Date(todo.dates).getFullYear() === shownDate.year)
                "
              >
                <TodoCardRepeatingDate
                  v-if="todo.dates?.start"
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="handleEditActive(todo)"
                  @editTodo="
                    (todoHeader, todoDescription, currentDate, currentEndDate) =>
                      handleEditRepeating(
                        todoHeader,
                        todoDescription,
                        currentDate,
                        currentEndDate,
                        todo
                      )
                  "
                  @checkboxClicked="(checkboxState) => handleCheckboxChange(checkboxState, todo)"
                  class="todo-card"
                ></TodoCardRepeatingDate>
                <TodoCard
                  v-else
                  :todo="todo"
                  :cat-user-id="catsStore.state.currentCat.user_id"
                  :user-id="userStore.state.userId"
                  :created-by="todo.created_by"
                  :creator-name="todo.profiles.username"
                  :completed="todo.completed"
                  @deleteTodo="deleteTodoDialog(todo)"
                  @editActive="handleEditActive(todo)"
                  @editTodo="
                    (todoHeader, todoDescription, currentDate) =>
                      handleEdit(todoHeader, todoDescription, currentDate, todo)
                  "
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
            <div class="confirm-dialog-container">
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
import TodoCard from '@/components/TodoCard.vue'
import TodoCardRepeatingDate from './TodoCardRepeatingDate.vue'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

// dayjs.extend(weekOfYear)

// const week = weekOfYear()
//import dayjs from 'dayjs' // ES 2015

const toast = useToast()
const confirm = useConfirm()

const userStore = useUserStore()
const catsStore = useCatsStore()

const calendar = ref(null)

const todoHeaderContent = ref('')
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
const activeMenuItem = ref(catsStore.state.currentCatActiveMenuItems.menuTwo)

const repeatingDate = ref(false)
// let repeatingDateLabel = ref('Einmaliger Termin')
const date = ref(new Date())

const repeatingDateEnd = ref(new Date(date.value + 1))
const rules = ref({
  minutes: [0, 15, 30, 45]
})

const repeatCategory = ref('')
const repeatCategoryOptions = ref([
  { content: 'Tage' },
  { content: 'Wochen' },
  { content: 'Monate' }
])

const repeatNumber = ref(0)

const repeatWeekdayCategoryOptions = [
  { content: 'Montag' },
  { content: 'Dienstag' },
  { content: 'Mittwoch' },
  { content: 'Donnerstag' },
  { content: 'Freitag' },
  { content: 'Samstag' },
  { content: 'Sonntag' }
]

const selectedWeekdays = ref([])

const repeatMinMax = computed(() => {
  if (repeatCategory.value.content === 'Tage') {
    return { min: 1, max: 30 }
  }
  if (repeatCategory.value.content === 'Wochen') {
    return { min: 1, max: 30 }
  }
  if (repeatCategory.value.content === 'Monate') {
    return { min: 1, max: 30 }
  } else return { min: 0, max: 0 }
})

const calculateRepeatingDate = computed(() => {
  const weekdayDictionary = {
    Montag: 2,
    Dienstag: 3,
    Mittwoch: 4,
    Donnerstag: 5,
    Freitag: 6,
    Samstag: 7,
    Sonntag: 1
  }

  if (repeatCategory.value.content === 'Tage') {
    const dates = {
      start: date.value,
      repeat: {
        every: [repeatNumber.value, 'days'],
        until: repeatingDateEnd.value
      }
    }
    return dates
  }

  if (repeatCategory.value.content === 'Wochen') {
    let weekDayArray = []
    // let weeksOrMonth = repeatCategory.value.content === 'Wochen' ? 'weeks' : 'month'
    for (let item of selectedWeekdays.value) {
      weekDayArray.push(weekdayDictionary[item.content])
    }
    const dates = {
      start: date.value,
      repeat: {
        every: [repeatNumber.value, 'weeks'],
        weekdays: weekDayArray,
        until: repeatingDateEnd.value
      }
    }

    return dates
  }

  if (repeatCategory.value.content === 'Monate') {
    // let dayArray = []
    // let weeksOrMonth = repeatCategory.value.content === 'Wochen' ? 'weeks' : 'month'
    // for (let item of selectedWeekdays.value) {
    //   dayArray.push(weekdayDictionary[item.content])
    // }
    const day = new Date(date.value).getDate()
    const dates = {
      start: date.value,
      repeat: {
        every: [repeatNumber.value, 'months'],
        days: day,
        until: repeatingDateEnd.value
      }
    }
    return dates
  }

  return null
})

const currentRepeatingDate = ref(calculateRepeatingDate)
const shownDate = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
})

function handleDidMove(pages) {
  shownDate.value.month = pages[0].month
  shownDate.value.year = pages[0].year
}

// function toggleRepeatingDate() {
//   repeatingDate.value = !repeatingDate.value
//   repeatingDateLabel.value = !repeatingDate.value ? 'Einmaliger Termin' : 'Termin wiederholt sich'
// }
async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select(
      `id, cat_id, header, content, created_by, completed, created_at, dates, profiles(id, username)`
    )
    .eq('cat_id', catsStore.state.currentCat.id)
  if (error) {
    console.log(error)
  }
  if (data) {
    todos.value = data
    sortTodos()
  }
}

function handleEditActive(todo) {
  todo.editActive = true
  date.value = new Date(todo.dates)
}

async function handleEditRepeating(todoHeader, todoDescription, currentDate, currentEndDate, todo) {
  // if (!date.value) {
  //   toast.add({
  //     severity: 'warn',
  //     summary: 'Kein Datum',
  //     detail: 'Bitte wähle ein Datum aus',
  //     life: 3000
  //   })
  //   return
  // }
  if (new Date(currentDate.value) > new Date(currentEndDate.value)) {
    toast.add({
      severity: 'warn',
      summary: 'Wiederholungszeitraum ungültig',
      detail: 'Das Ende der Terminwiederholung muss vor dem ersten Termin liegen',
      life: 3000
    })
    return
  }
  if (todoHeader.length < 1 || todoHeader.length > 30) {
    toast.add({
      severity: 'warn',
      summary: 'Überschrift ungültig',
      detail: 'Die Überschrift des Termins muss zwischen 1 und 30 Zeichen lang sein',
      life: 3000
    })
    return
  }
  if (todoDescription.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Beschreibung ungültig',
      detail: 'Die Beschreibung des Termins kann maximal 500 Zeichen lang sein',
      life: 3000
    })
    return
  }
  todoHeaderContent.value = todoHeader
  todoContent.value = todoDescription
  const newTodoDates = {}

  newTodoDates.repeat = todo.dates.repeat
  newTodoDates.start = currentDate.value
  newTodoDates.repeat.until = currentEndDate.value
  const { data, error } = await supabase
    .from('todos')
    .update([
      {
        header: todoHeaderContent.value,
        content: todoContent.value,
        dates: JSON.stringify(newTodoDates)
      }
    ])
    .eq('id', todo.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    toast.add({
      severity: 'success',
      summary: 'Termin geändert',
      detail: 'Du hast den Termin geändert',
      life: 3000
    })
    todoContent.value = ''
    todoHeaderContent.value = ''
    todo.editActive = false

    getTodos()
  }
}

async function handleEdit(todoHeader, todoDescription, currentDate, todo) {
  if (!currentDate.value) {
    toast.add({
      severity: 'warn',
      summary: 'Kein Datum',
      detail: 'Bitte wähle ein Datum aus',
      life: 3000
    })

    return
  }
  if (todoHeader.length < 1 || todoHeader.length > 30) {
    toast.add({
      severity: 'warn',
      summary: 'Überschrift ungültig',
      detail: 'Die Überschrift des Termins muss zwischen 1 und 30 Zeichen lang sein',
      life: 3000
    })
    return
  }
  if (todoDescription.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Beschreibung ungültig',
      detail: 'Die Beschreibung des Termins kann maximal 500 Zeichen lang sein',
      life: 3000
    })
    return
  }
  todoHeaderContent.value = todoHeader
  todoContent.value = todoDescription
  const { data, error } = await supabase
    .from('todos')
    .update([
      {
        header: todoHeaderContent.value,
        content: todoContent.value,
        dates: JSON.stringify(currentDate.value)
      }
    ])
    .eq('id', todo.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    toast.add({
      severity: 'success',
      summary: 'Termin geändert',
      detail: 'Du hast den Termin geändert',
      life: 3000
    })
    todoContent.value = ''
    todoHeaderContent.value = ''
    todo.editActive = false

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

async function handleAddTodo() {
  if (date.value === null) {
    // toast.add({
    //   severity: 'warn',
    //   summary: 'Kein Datum',
    //   detail: 'Bitte wähle ein Datum aus',
    //   life: 3000
    // })
    // return
    date.value = new Date()
  }

  addNewTodo.value = !addNewTodo.value
}

async function createNewTodo() {
  if (todoHeaderContent.value.length < 1 || todoHeaderContent.value.length > 30) {
    toast.add({
      severity: 'warn',
      summary: 'Überschrift ungültig',
      detail: 'Die Überschrift des Termins kann zwischen 1 und 30 Zeichen lang sein',
      life: 3000
    })
    return
  }
  if (todoContent.value.length > 500) {
    toast.add({
      severity: 'warn',
      summary: 'Beschreibung ungültig',
      detail: 'Die Beschreibung des Termins kann maximal 500 Zeichen lang sein',
      life: 3000
    })
    return
  }

  if (repeatingDate.value === true) {
    date.value = currentRepeatingDate.value

    if (currentRepeatingDate.value === null) {
      toast.add({
        severity: 'warn',
        summary: 'Fehlende Angaben',
        detail: 'Bitte wähle Angaben zur Terminwiederholung aus',
        life: 3000
      })
      return
    }
    if (new Date(date.value.start) > new Date(date.value.repeat.until)) {
      toast.add({
        severity: 'warn',
        summary: 'Wiederholungszeitraum ungültig',
        detail: 'Das Ende der Terminwiederholung muss vor dem ersten Termin liegen',
        life: 3000
      })
      return
    }
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([
      {
        cat_id: catsStore.state.currentCat.id,
        header: todoHeaderContent.value,
        content: todoContent.value,
        dates: JSON.stringify(date.value)
      }
    ])
    .select()
  if (error) {
    console.log(error)
  }
  if (data) {
    toast.add({
      severity: 'success',
      summary: 'Termin angelegt',
      detail: 'Du hast einen neuen Termin angelegt',
      life: 3000
    })
  }
  getTodos()
  todoContent.value = ''
  todoHeaderContent.value = ''
  addNewTodo.value = false
  date.value = new Date()
  repeatingDateEnd.value = new Date(date.value + 1)
  repeatingDate.value = false
  repeatCategory.value = ''
  repeatNumber.value = 0
  selectedWeekdays.value = []
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
  for (let todo of todos.value) {
    if (todo.dates[0] === '{') {
      todo.dates = JSON.parse(todo.dates)
      todo.dates.repeat.until = new Date(todo.dates.repeat.until)
      todo.dates.start = new Date(todo.dates.start)
    } else if (todo.dates[0] !== '{') {
      todo.dates = new Date(JSON.parse(todo.dates))
    }
  }
}
// const attributes = [
//   {
//     key: 'test',

//     dot: 'purple',
//     dates: {
//       start: '2024-01-01T12:00:20.000Z',
//       repeat: { every: [1, 'weeks'], weekdays: [2], until: new Date('2024-01-30T12:05:20.000Z') }
//     }
//   }
// ]

const attributes = computed(() => {
  if (todos.value === null) {
    return null
  } else {
    const attributesArray = []
    for (let todo of todos.value) {
      const attribute = {}
      if (todo.dates.repeat) {
        const startdate =
          new Date(todo.dates.start).getDate() +
          '.' +
          (new Date(todo.dates.start).getMonth() + 1) +
          '.' +
          new Date(todo.dates.start).getFullYear()
        let startDateFix = JSON.parse(JSON.stringify(todo.dates.start))

        attribute.dates = {
          repeat: todo.dates.repeat,
          start: new Date(startDateFix).setHours(1)
        }

        // attribute.dot = {
        //   color: 'yellow'
        // }
        attribute.dot = {
          color: 'indigo'
          // fillMode: 'light'
        }
        attribute.popover = {
          label: todo.header + '  (' + 'seit ' + startdate + ')'
        }
        attributesArray.push(attribute)
      } else {
        attribute.dates = todo.dates
        ;(attribute.dot = {
          color: todo.completed ? 'primary' : 'rose'
          // fillMode: 'light'
        }),
          (attribute.popover = {
            label: todo.header
          })
        attributesArray.push(attribute)
      }
    }
    return attributesArray
  }
})

const selectedColor = ref('primary')

const deleteTodoDialog = (todo) => {
  confirm.require({
    group: 'headless',
    message: `Möchtest du den Termin löschen?`,
    header: 'Termin löschen',

    accept: () => {
      deleteTodo(todo)
      toast.add({
        severity: 'info',
        summary: 'Termin gelöscht',
        detail: 'Du hast den Termin gelöscht',
        life: 3000
      })
    },
    reject: () => {}
  })
}

function checkIfRepeatDateCurrentMonth(todo) {
  let cacheDate = dayjs(todo.dates.start).hour(1)

  if (!todo.dates?.repeat?.until) {
    return false
  }

  if (todo.dates.repeat.every[1] === 'days') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'day')
      if (
        dayjs(cacheDate).month() + 1 === shownDate.value.month &&
        dayjs(cacheDate).year() === shownDate.value.year &&
        cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)
      ) {
        return true
      }
    }
  }
  if (todo.dates.repeat.every[1] === 'weeks') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      // for (let day of todo.dates.repeat.weekdays)
      for (let i = todo.dates.repeat.weekdays.length - 1; i >= 0; i--) {
        cacheDate = cacheDate.day(todo.dates.repeat.weekdays[i] - 1)
        if (
          dayjs(cacheDate).month() + 1 === shownDate.value.month &&
          dayjs(cacheDate).year() === shownDate.value.year &&
          cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)
        ) {
          return true
        }
      }
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'week')
    }
  }

  if (todo.dates.repeat.every[1] === 'months') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'month')
      if (
        dayjs(cacheDate).month() + 1 === shownDate.value.month &&
        dayjs(cacheDate).year() === shownDate.value.year &&
        cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)
      ) {
        return true
      }
    }
  }
  return false
}

function checkIfRepeatDateToday(todo) {
  const filterDate = dayjs(date.value)
  let cacheDate = dayjs(todo.dates.start).hour(1)

  if (!todo.dates?.repeat?.until) {
    return false
  }
  if (todo.dates.repeat.every[1] === 'days') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'day')
      if (
        dayjs(cacheDate).date() === dayjs(filterDate).date() &&
        dayjs(cacheDate).month() === dayjs(filterDate).month() &&
        dayjs(cacheDate).year() === dayjs(filterDate).year()
      ) {
        return true
      }
    }
  }
  if (todo.dates.repeat.every[1] === 'weeks') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      // for (let day of todo.dates.repeat.weekdays)
      for (let i = todo.dates.repeat.weekdays.length - 1; i >= 0; i--) {
        cacheDate = cacheDate.day(todo.dates.repeat.weekdays[i] - 1)
        if (
          dayjs(cacheDate).date() === dayjs(filterDate).date() &&
          dayjs(cacheDate).month() === dayjs(filterDate).month() &&
          dayjs(cacheDate).year() === dayjs(filterDate).year() &&
          cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)
        ) {
          return true
        }
      }
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'week')
    }
  }

  if (todo.dates.repeat.every[1] === 'months') {
    while (cacheDate <= dayjs(new Date(todo.dates.repeat.until)).hour(23)) {
      cacheDate = cacheDate.add(todo.dates.repeat.every[0], 'month')
      if (
        dayjs(cacheDate).date() === dayjs(filterDate).date() &&
        dayjs(cacheDate).month() === dayjs(filterDate).month() &&
        dayjs(cacheDate).year() === dayjs(filterDate).year()
      ) {
        return true
      }
    }
  }
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
  z-index: 1;
  margin-bottom: 0.5rem;
}
.dialog-content {
  display: grid;
  height: min-content;
  justify-items: center;
  position: relative;
  width: 100%;
}

.todo-input {
  margin-top: 0.75rem;
  width: 90%;
}

.todo-input-header {
  margin-block: 1rem;
  width: 90%;
}
.todo-input-header .input-field {
  width: 100%;
}

.input-area {
  width: 100%;
  height: 7rem;
}

.float-label_label {
  color: var(--text);
  font-size: 1rem;
}
.input-area + .float-label_label {
  transform: translateY(0.55rem);
}
.input:focus + .float-label_label {
  background: var(--hover-label-bg);
  transform: translateY(0.55rem);
  color: var(--primary);
}

.labelUp {
  color: var(--text-off);
  background: var(--hover-label-bg);
  transform: translateY(0.55rem);
}

.button-send {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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
  padding-top: 0.125rem;
  padding-bottom: 1rem;
}
.todo-container {
  /* background-color: var(--card-background);
  box-shadow: 0 0 4px 2px var(--card-shadow); */

  /* padding: 1rem; */
  min-height: 10rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
}

.no-todos > p {
  color: var(--text);
  font-weight: 500;
  /* font-family: 'Roboto-Slab'; */
  position: absolute;
  margin: 0;
  top: 4.5rem;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.todo-card-wrapper {
  z-index: 2;
  width: 100%;
}
.todo-card {
  margin-block: 0.6rem;
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
.date-selector-wrapper {
  width: 90%;
  display: flex;
  flex-direction: column;
  margin-block: 0.5rem;
  gap: 0.25rem;
}
.date-selector-wrapper label {
  margin-top: 0rem;
  margin-bottom: 0;
  padding-left: 0.5rem;
}
.button-container {
  padding-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.toggle-wrapper {
  width: 90%;
  display: flex;
  padding-inline-start: 0.125rem;
  padding-block: 0.75rem;
  margin-top: 0.7rem;
  gap: 1rem;
  align-items: center;
  font-family: 'Roboto-Regular';
  position: relative;
}
.repeating-date-container {
  /* background-color: var(--card-background); */
  /* padding: 1rem; */
  padding-bottom: 1rem;
  border-radius: var(--border-radius);
  /* border: 2px solid var(--primary); */
  display: grid;
  justify-items: start;
  gap: 0.5rem;
  width: 90%;
  position: relative;
  align-items: center;
  margin-block: 0.5rem;
}

/* .repeating-date-container > p {
  margin-block: 0.5rem;
  font-family: 'Roboto-Medium';
} */
.freqency-selection-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  width: 100%;
  padding-top: 0.25rem;
}
.label-repeat-frequency,
.label-repeat-end {
  margin-top: 0.5rem;
  margin-bottom: -0.5rem;
  padding-left: 0.5rem;
}

.confirm-dialog-container {
  border-radius: var(--border-radius);
  justify-items: center;
  background-color: var(--card-background);
  padding: 2rem;
}

.confirm-dialog-container > h3 {
  margin-block: 0.5rem;
  width: 100%;
  text-align: center;
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
<!-- 
<style>
.todo-output-container .todo-content-container {
  width: calc((80vw / 100) * 90);
}
@media screen and (max-width: 305px) {
  .todo-output-container .todo-content-container {
    width: 225px;
  }
}
@media screen and (min-width: 600px) {
  .todo-output-container .todo-content-container {
    width: 400px;
  }
}
@media screen and (min-width: 800px) {
  .todo-output-container .todo-content-container {
    width: 600px;
  }
}
</style> -->
