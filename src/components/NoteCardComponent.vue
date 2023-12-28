<template>
  <div class="note-card-content-container">
    <div class="header">
      <PrimeTag rounded class="user-tag">{{ props.creatorName }}</PrimeTag>
      <span rounded class="date-created-info"
        >{{ new Date(props.createdAt).getDate() }}.{{ new Date(props.createdAt).getMonth() + 1 }}.{{
          new Date(props.createdAt).getFullYear()
        }}</span
      >

      <button class="pin-button" @click="emit('pinClicked')">
        <svg class="icon" :class="{ pinactive: props.pinned }">
          <use xlink:href="@/assets/icons.svg#pin" fill="currentcolor"></use>
        </svg>
      </button>
    </div>
    <div>
      <p v-if="!editState">{{ props.content }}</p>
      <PrimeTextArea
        v-else
        class="input input-area note-input"
        id="note-content"
        v-model="currentContent"
        autoResize
        rows="7"
      ></PrimeTextArea>
    </div>
    <div class="button-wrapper" v-if="catUserId === userId || createdBy === userId">
      <button v-if="catUserId === userId" class="delete-note-button" @click="emit('deleteNote')">
        <svg class="icon">
          <use xlink:href="@/assets/icons.svg#trash" fill="currentcolor"></use>
        </svg>
      </button>
      <button v-if="createdBy === userId" class="edit-note-button" @click="handleEditClicked()">
        <svg class="icon">
          <use v-if="editState" xlink:href="@/assets/icons.svg#save-data" fill="currentcolor"></use>

          <use v-else xlink:href="@/assets/icons.svg#edit" fill="currentcolor"></use>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

const props = defineProps({
  content: String,
  createdBy: String,
  creatorName: String,
  pinned: Boolean,
  createdAt: String,
  userId: String,
  catUserId: String
})

const currentContent = ref('')

const editState = ref(false)
const emit = defineEmits(['pinClicked', 'noteEdited', 'contentTooLong', 'noContent', 'deleteNote'])

function handleEditClicked() {
  if (!editState.value) {
    editState.value = true
  } else {
    if (currentContent.value.length > 3000) {
      emit('contentTooLong')
      return
    }
    if (currentContent.value.length < 1) {
      emit('noContent')
      return
    }
    emit('noteEdited', currentContent.value)
    editState.value = false
  }
}

onBeforeMount(() => {
  currentContent.value = props.content
})
</script>

<style scoped>
.note-card-content-container {
  /* background-color: var(--background-catdata-card); */
  border: 2px solid var(--border-catdata-card);
  /* background-color: var(--card-background); */

  /* box-shadow: 0 0 3px 2px var(--card-shadow); */
  border-radius: var(--border-radius);
  padding: 1.25rem;
  width: 100%;
}
.header {
  display: grid;
  grid-template-columns: 5fr 1fr 0.5fr;
  justify-items: flex-end;
  align-items: center;
}
.pin-button {
  border: none;
  background-color: transparent;
}
.icon {
  color: var(--text-inactive);
  width: 1.4rem;
  height: 1.4rem;
  transition: all 200ms ease-in-out;
}
.pin-button .pinactive {
  color: var(--old-rose-darker);
}
.icon:hover,
.icon:focus {
  color: var(--old-rose);
  scale: 1.05;
}

.user-tag {
  color: var(--cat-card-text);
  background-color: var(--primary-darker);
  transition: all 200ms ease-in-out;
  grid-column: 1;
  justify-self: start;
  align-self: flex-start;
  padding: 0.4rem;
  padding-inline: 0.75rem;
}
p {
  padding-block: 0.5rem;
  padding-inline: 0.25rem;
  word-break: break-all;
  font-size: 0.95rem;
}

.date-created-info {
  /* color: var(--text-on-dark);
  background-color: var(--text-inactive); */
  color: var(--text-inactive);

  font-family: 'Roboto-Light';
  font-size: 0.8rem;
  padding-right: 0.75rem;
}

.button-wrapper {
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;
}
.edit-note-button,
.delete-note-button {
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
.delete-note-button:hover > .icon,
.delete-note-button:focus > .icon,
.edit-note-button:hover > .icon,
.edit-note-button:focus > .icon {
  scale: 1.05;
  color: var(--old-rose-darker);
}

.note-input {
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  width: 100%;
}
</style>
