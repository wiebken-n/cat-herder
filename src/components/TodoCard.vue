<template>
  <div class="todo-contentwrapper">
    <div class="header-wrapper">
      <PrimeTag class="user-tag" :value="props.creatorName" rounded></PrimeTag>

      <p class="todo-date">
        <span>
          {{
            getTime(new Date(props.todo.date).getHours(), new Date(todo.date).getMinutes())
          }}</span
        >

        <span>|</span>
        <span>
          {{
            getDate(
              new Date(props.todo.date).getDate(),
              new Date(props.todo.date).getMonth() + 1,
              new Date(props.todo.date).getFullYear()
            )
          }}</span
        >
      </p>
    </div>

    <p class="todo-date"></p>

    <p v-if="!editState" class="todo-description">{{ props.todo.content }}</p>
    <PrimeTextArea
      v-if="editState"
      id="todo-content"
      class="input input-area"
      v-model="todoDescription"
      label="Termininhalt"
      rows="10"
    ></PrimeTextArea>
    <div class="interaction-wrapper">
      <PrimeCheckbox
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

function editClicked() {
  if (!editState.value) {
    emit('editActive')
  }
  if (editState.value) {
    emit('editTodo', todoDescription)
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

.header-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.user-tag {
  color: var(--cat-card-text);
  background-color: var(--primary-darkest);
  transition: all 200ms ease-in-out;
}
.todo-contentwrapper:hover * .user-tag {
  background-color: var(--primary-darker-dark);
}
.todo-date {
  font-family: 'Roboto-Slab';
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin: 0;
}
.todo-description {
  align-self: flex-start;
  padding-block: 0.25rem;
}
.interaction-wrapper {
  display: flex;
  justify-content: space-between;
}
.button-wrapper {
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
.edit-todo-button:hover > .icon {
  scale: 1.05;
  color: var(--old-rose-darker);
}
</style>
