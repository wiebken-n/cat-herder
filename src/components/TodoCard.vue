<template>
  <div class="todo-content-container">
    <div class="header-wrapper">
      <PrimeTag class="user-tag" :value="props.creatorName" rounded></PrimeTag>

      <p class="todo-date">
        <span>
          {{ getTime(new Date(currentDate).getHours(), new Date(currentDate).getMinutes()) }}</span
        >
        <span>|</span>
        <span>
          {{
            getDate(
              new Date(currentDate).getDate(),
              new Date(currentDate).getMonth() + 1,
              new Date(currentDate).getFullYear()
            )
          }}</span
        >
      </p>
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
        rows="10"
      ></PrimeTextArea>
    </div>

    <div class="todo-date-edit-wrapper" v-if="editState">
      <label for="input-repeat-start" class="label">Terminzeitpunkt</label>

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

    <div class="interaction-wrapper">
      <PrimeCheckbox
        v-if="!editState"
        v-model="checkboxState"
        :binary="true"
        @click="emit('checkboxClicked', !checkboxState)"
      />
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

const checkboxState = ref(props.completed)

const editState = ref(false)

let todoDescription = props.todo.content
let todoHeader = props.todo.header

const currentDate = ref(null)

currentDate.value = props.todo.dates

function editClicked() {
  if (!editState.value) {
    emit('editActive')
  }
  if (editState.value) {
    emit('editTodo', todoHeader, todoDescription, currentDate)
  }
  editState.value = !editState.value
}

function getDate(day, month, year) {
  return day + '.' + month + '.' + year
}

function getTime(hour, minute) {
  return hour + ':' + minute + ' ' + 'Uhr'
}
</script>

<style scoped>
.todo-content-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--cat-card-text);
  background-color: var(--cat-card-background);
  border-radius: var(--border-radius);
  transition: all 200ms ease-in-out;
}

.todo-content-container:hover,
.todo-content-container:focus {
  background-color: var(--cat-card-background-hover);
}
.todo-content-container > p {
  margin: 0;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
p {
  font-size: 0.95rem;
  overflow-wrap: break-word;
}
.user-tag {
  color: var(--cat-card-text);
  background-color: var(--primary-darkest);
  transition: all 200ms ease-in-out;
}
/* .todo-content-container:hover * .user-tag,
.todo-content-container:focus * .user-tag {
  background-color: var(--primary-darker-dark);
} */
.todo-date {
  font-family: 'Roboto-Regular';
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin: 0;
}
.todo-content-wrapper,
.todo-header-wrapper,
.todo-date-edit-wrapper {
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
  margin-top: 1rem;
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
  overflow-wrap: break-word;
  word-break: break-all;
}

.todo-date-edit-wrapper {
  margin-bottom: 1.25rem;
}
.interaction-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
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
  color: var(--cat-card-text);
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

/* .todo-content-wrapper,
.todo-header-wrapper, */

/* .todo-content-wrapper p {
  width: 98%;
} */
/* @media screen and (min-width: 500px) {
  .todo-content-wrapper p {
    width: 70vw;
  }
}
@media screen and (min-width: 600px) {
  .todo-content-wrapper p {
    width: 400px;
  }
}
@media screen and (min-width: 800px) {
  .todo-content-wrapper p {
    width: 550px;
  }
} */
</style>
