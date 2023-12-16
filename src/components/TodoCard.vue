<template>
  <div class="todo-contentwrapper">
    <p class="todo-date">
      <span>
        {{
          getTime(new Date(props.todo.dates).getHours(), new Date(todo.dates).getMinutes())
        }}</span
      >

      <span>|</span>
      <span>
        {{
          getDate(
            new Date(props.todo.dates).getDate(),
            new Date(props.todo.dates).getMonth() + 1,
            new Date(props.todo.dates).getFullYear()
          )
        }}</span
      >
    </p>
    <p class="todo-date"></p>

    <p v-if="!editState" class="todo-description">{{ props.todo.desciption }}</p>
    <PrimeTextArea
      v-if="editState"
      id="todo-content"
      class="input input-area"
      v-model="todoDescription"
      label="Termininhalt"
      rows="10"
    ></PrimeTextArea>
    <div class="button-wrapper" v-if="catUserId === userId">
      <button class="delete-todo-button" @click="emit('deleteTodo')">
        <svg class="trash-icon">
          <use xlink:href="@/assets/icons.svg#trash" fill="currentcolor"></use>
        </svg>
      </button>
      <button class="delete-todo-button" @click="editClicked(todo)">
        <svg class="trash-icon">
          <use v-if="editState" xlink:href="@/assets/icons.svg#save-data" fill="currentcolor"></use>

          <use v-else xlink:href="@/assets/icons.svg#edit" fill="currentcolor"></use>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  todo: Object,
  catUserId: String,
  userId: String
})

const editState = ref(false)

// const todoDescription = ref(props.todo.desciption)
let todoDescription = props.todo.desciption

function editClicked() {
  if (!editState.value) {
    emit('editActive')
  }
  if (editState.value) {
    emit('editTodo', todoDescription)
  }
  editState.value = !editState.value
}
const emit = defineEmits(['deleteTodo', 'editActive', 'editTodo'])

function getDate(day, month, year) {
  return day + '.' + month + '.' + year
}

function getTime(hour, minute) {
  return hour + ':' + minute + ' ' + 'Uhr'
}
</script>

<style scoped>
.todo-contentwrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--cat-card-text);
  background-color: var(--cat-card-background);
  border-radius: var(--border-radius);
  transition: all 200ms ease-in-out;
}
.todo-contentwrapper:hover {
  background-color: var(--cat-card-background-hover);
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

.button-wrapper {
  align-self: flex-end;
  display: flex;
  gap: 0.25rem;
}
.delete-todo-button {
  background: none;
  border: none;
  width: min-content;
}
.trash-icon {
  color: var(--cat-card-text);
  height: 1.5rem;
  width: 1.25rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}
.delete-todo-button:hover > .trash-icon {
  scale: 1.05;
  color: var(--old-rose-darker);
}
</style>
