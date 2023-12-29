<template>
  <div class="todo-content-container" v-if="props.todo">
    <div class="header-wrapper">
      <PrimeTag class="user-tag" :value="props.creatorName" rounded></PrimeTag>

      <p class="todo-date">
        <!-- <span>Start: </span> -->
        <!-- <span>
          {{ getTime(new Date(currentDate).getHours(), new Date(currentDate).getMinutes()) }}</span
        >
        <span>|</span> -->
        <span>
          {{
            getDate(
              new Date(currentDate).getDate(),
              new Date(currentDate).getMonth() + 1,
              new Date(currentDate).getFullYear()
            )
          }}</span
        >
        <span>-</span>
        <!-- <span>Ende: </span> -->
        <!-- <span>
          {{
            getTime(new Date(currentEndDate).getHours(), new Date(currentEndDate).getMinutes())
          }}</span
        >
        <span>|</span> -->
        <span>
          {{
            getDate(
              new Date(currentEndDate).getDate(),
              new Date(currentEndDate).getMonth() + 1,
              new Date(currentEndDate).getFullYear()
            )
          }}</span
        >
      </p>
      <!-- <p class="todo-date">
      
      </p> -->
      <p class="repeating-info">
        <span>
          alle
          <span class="repeat-info-number">{{ props.todo?.dates?.repeat?.every?.[0] }}</span>
          {{ repeatCategories[props.todo?.dates?.repeat?.every?.[1]] }}
          <span
            v-if="repeatCategories[props.todo?.dates?.repeat?.every?.[1]] === 'Monate'"
            class="month-repeat-info"
          >
            am {{ props.todo?.dates?.repeat?.days }}.</span
          > </span
        ><span>|</span>
        <span>
          {{
            getTime(
              new Date(props.todo?.dates?.start).getHours(),
              new Date(props.todo?.dates?.start).getMinutes()
            )
          }}</span
        >
      </p>
      <div class="weekdays-container">
        <PrimeTag
          class="repeat-info-weekdays"
          v-for="day of props.todo?.dates?.repeat?.weekdays"
          :key="day"
          >{{ repeatDays[day] }}</PrimeTag
        >
      </div>
    </div>
    <div class="todo-header-wrapper">
      <p v-if="!editState" class="todo-header">{{ props.todo.header }}</p>
      <label for="todo-header" v-if="editState" class="label">Art des Termins </label>
      <PrimeInputText
        v-if="editState"
        class="input-field input"
        id="todo-header"
        v-model.trim="todoHeader"
      />

      <!-- <PrimeTextArea
   
      id="todo-content"
      class="input input-area"
      v-model="todoDescription"
      label="Terminbeschreibung"
      rows="10"
    ></PrimeTextArea> -->
    </div>
    <div class="todo-content-wrapper">
      <p v-if="!editState" class="todo-description">{{ props.todo.content }}</p>

      <label for="todo-content" v-if="editState" class="label">Terminbeschreibung</label>

      <PrimeTextArea
        v-if="editState"
        id="todo-content"
        class="input input-area"
        v-model="todoDescription"
        label="Termininhalt"
        rows="5"
      ></PrimeTextArea>
    </div>

    <div class="date-edit-container" v-if="editState">
      <div>
        <label for="input-repeat-start" class="label">Start der Wiederholungen</label>

        <PrimeCalendar
          class="input todo-card-datepicker"
          id="input-repeat-start"
          showTime
          hourFormat="24"
          v-model="currentDate"
          dateFormat="dd/mm/yy"
          showIcon
        />
      </div>
      <div>
        <label for="input-repeat-start" class="label">Ende der Wiederholungen</label>

        <PrimeCalendar
          class="input todo-card-datepicker"
          id="input-repeat-end"
          showTime
          hourFormat="24"
          v-model="currentEndDate"
          dateFormat="dd/mm/yy"
          showIcon
        />
      </div>
    </div>
    <div class="interaction-wrapper">
      <!-- <PrimeCheckbox
        v-if="!editState"
        v-model="checkboxState"
        :binary="true"
        @click="emit('checkboxClicked', !checkboxState)"
      /> -->
      <div class="button-wrapper" v-if="catUserId === userId || createdBy === userId">
        <button v-if="catUserId === userId" class="delete-todo-button" @click="emit('deleteTodo')">
          <svg class="icon">
            <use xlink:href="@/assets/icons.svg#trash" fill="currentcolor"></use>
          </svg>
        </button>
        <button v-if="createdBy === userId" class="edit-todo-button" @click="editClicked(todo)">
          <svg class="icon">
            <use
              v-if="editState"
              xlink:href="@/assets/icons.svg#save-data"
              fill="currentcolor"
            ></use>

            <use v-else xlink:href="@/assets/icons.svg#edit" fill="currentcolor"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  todo: Object,
  catUserId: String,
  userId: String,
  createdBy: String,
  creatorName: String,
  completed: Boolean
})

const emit = defineEmits(['deleteTodo', 'editActive', 'editTodo', 'checkboxClicked'])
// const checkboxState = ref(props.completed)

const editState = ref(false)

let todoDescription = props.todo.content
let todoHeader = props.todo.header

const currentDate = ref(null)

const currentEndDate = ref(null)

currentDate.value = props.todo.dates.start

if (props.todo.dates.repeat.until) {
  currentEndDate.value = props.todo.dates.repeat.until
}
function editClicked() {
  if (!editState.value) {
    emit('editActive')
  }
  if (editState.value) {
    emit('editTodo', todoHeader, todoDescription, currentDate, currentEndDate)
  }
  editState.value = !editState.value
}

function getDate(day, month, year) {
  return day + '.' + month + '.' + year
}

function getTime(hour, minute) {
  return hour + ':' + minute + ' ' + 'Uhr'
}

const repeatCategories = {
  days: 'Tage',
  weeks: 'Wochen',
  months: 'Monate'
}
const repeatDays = {
  1: 'Sonntag',
  2: 'Montag',
  3: 'Dienstag',
  4: 'Mittwoch',
  5: 'Donnerstag',
  6: 'Freitag',
  7: 'Samstag'
}
</script>

<style scoped>
.todo-content-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 1rem;
  /* color: var(--cat-card-text);
  background-color: var(--cat-card-background); */
  border-radius: var(--border-radius);
  /* transition: all 200ms ease-in-out; */
  background-color: var(--background-clr);
  color: var(--text);
  border: 2px solid var(--border-catdata-card);
}

/* .todo-content-container:hover,
.todo-content-container:focus {
  background-color: var(--cat-card-background-hover);
} */

.todo-content-container > p {
  margin: 0;
}

.header-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-family: 'Roboto-Regular';
  align-items: center;
}

p {
  font-size: 0.95rem;
  overflow-wrap: break-word;
  word-break: break-all;
  padding-inline: 0.5rem;
}

.user-tag {
  color: var(--cat-card-text);
  background-color: var(--primary-darker);
  /* transition: all 200ms ease-in-out; */
  grid-column: 1;
  justify-self: start;
  align-self: flex-start;
  padding: 0.25rem;
  padding-inline: 0.5rem;
}

/* .todo-content-container:hover * .user-tag,
.todo-content-container:focus * .user-tag {
  background-color: var(--primary-darker-dark);
} */

.todo-date {
  /* font-family: 'Roboto-Slab'; */
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin: 0;
  grid-column: 2;
  justify-self: end;
}
.repeating-info {
  /* font-family: 'Roboto-Slab'; */
  grid-row: 2;
  grid-column: 1/3;
  justify-self: end;
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  margin-bottom: 0;
  margin-top: 0.2rem;
}
.repeating-info p {
  text-align: end;
  margin: 0;
}
.repeat-info-number::after {
  content: ' ';
}
.weekdays-container {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  grid-column: 2;
  gap: 0.3rem;
}
.repeat-info-weekdays {
  color: var(--cat-card-text);
  background-color: var(--primary-darker);
  /* transition: all 200ms ease-in-out; */
  border-radius: 20px;
  /* margin-top: 0.3rem; */
}

/* .todo-content-container:focus * .repeat-info-weekdays,
.todo-content-container:hover * .repeat-info-weekdays {
  background-color: var(--primary-darker-dark);
} */

/* .repeat-info-weekdays + .repeat-info-weekdays {
  margin-left: 0.25rem;
} */
.todo-content-wrapper,
.todo-header-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.label {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: end;
}
.todo-header-wrapper {
  margin-top: 0rem;
  margin-bottom: 0.25rem;
}
.todo-content-wrapper {
  margin-bottom: 1rem;
}
.todo-header,
.todo-description {
  margin: 0;
}

.todo-header {
  font-family: 'Roboto-Slab';
}
.todo-description {
  align-self: flex-start;
  padding-block: 0.25rem;
}

.date-edit-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.date-edit-container > div {
  gap: 0.125rem;
  display: flex;
  flex-direction: column;
}

.interaction-wrapper {
  padding-inline: 0.5rem;

  display: flex;
  justify-content: space-between;
}
.button-wrapper {
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  gap: 0.25rem;
}
.edit-todo-button,
.delete-todo-button {
  background: none;
  border: none;
  width: min-content;
}
.icon {
  color: var(--primary-darker);
  height: 1.5rem;
  width: 1.25rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.delete-todo-button:hover > .icon,
.delete-todo-button:focus > .icon,
.edit-todo-button:hover > .icon,
.edit-todo-button:focus > .icon {
  scale: 1.05;
  color: var(--old-rose-darker);
}
</style>
