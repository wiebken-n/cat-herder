<template>
  <div class="notes-content-wrapper">
    <PrimeButton
      @click="addNewNote = true"
      class="button-add-note"
      label="Neue Notiz"
    ></PrimeButton>
    <PrimeDialog
      v-model:visible="addNewNote"
      modal
      header="Lege eine neue Notiz an"
      :style="{ width: '600px' }"
      :breakpoints="{ '650px': '500px', '600px': '90vw' }"
    >
      <div class="dialog-content">
        <span class="p-float-label note-input-wrapper">
          <PrimeTextArea
            class="input input-area note-input"
            id="note-content"
            v-model="noteContent"
            autoResize
            rows="7"
          ></PrimeTextArea>
          <label for="note-content" :class="{ labelUp: noteContent }" class="float-label_label"
            >Notizinhalt
          </label>
        </span>
        <PrimeButton
          @click="handleSaveNote"
          label="Notiz speichern"
          class="button-save-note"
        ></PrimeButton>
      </div>
    </PrimeDialog>
    <div class="notes-container">
      <NoteCardComponent
        class="note-card"
        v-for="note of pinnedNotes"
        :key="note"
        :content="note.content"
        :pinned="note.pinned"
        :creator-name="note.profiles.username"
        :created-by="note.created_by"
        :created-at="note.created_at"
        :userId="userStore.state.userId"
        :catUserId="catsStore.state.currentCat.user_id"
        @pinClicked="togglePin(note)"
        @noteEdited="(currentContent) => handleNoteEdit(currentContent, note)"
        @noContent="throwToastNoContent()"
        @contentTooLong="throwToastContentTooLong()"
        @deleteNote="openDeleteDialog(note)"
      >
      </NoteCardComponent>
      <NoteCardComponent
        class="note-card"
        v-for="note of unpinnedNotes"
        :key="note"
        :content="note.content"
        :pinned="note.pinned"
        :creator-name="note.profiles.username"
        :created-by="note.created_by"
        :created-at="note.created_at"
        :userId="userStore.state.userId"
        :catUserId="catsStore.state.currentCat.user_id"
        @pinClicked="togglePin(note)"
        @noteEdited="(currentContent) => handleNoteEdit(currentContent, note)"
        @noContent="throwToastNoContent()"
        @contentTooLong="throwToastContentTooLong()"
        @deleteNote="openDeleteDialog(note)"
      >
      </NoteCardComponent>
    </div>
    <PrimeConfirmDialog group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="dialog-container">
          <h3 class="dialog-header">{{ message.header }}</h3>
          <div class="dialog-text-container">
            <p class="dialog-text">{{ message.message }}</p>
          </div>

          <div class="dialog-button-container">
            <PrimeButton label="Termin löschen" @click="acceptCallback"></PrimeButton>
            <PrimeButton label="Zurück" @click="rejectCallback" outlined></PrimeButton>
          </div>
        </div>
      </template>
    </PrimeConfirmDialog>
    <!-- <div class="xxx">xxx</div> -->
  </div>
</template>

<script setup>
import { useCatsStore } from '../stores/useCatsStore'
import { useUserStore } from '../stores/useUserStore'
import { onBeforeMount, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { supabase } from '../supabase'
import NoteCardComponent from '@/NoteCardComponent.vue'

const catsStore = useCatsStore()
const userStore = useUserStore()

const confirm = useConfirm()
const toast = useToast()

const addNewNote = ref(false)

const noteContent = ref('')
const pinnedNotes = ref([])
const unpinnedNotes = ref([])

function throwToastContentTooLong() {
  toast.add({
    severity: 'warn',
    summary: 'Notizinhalt zu lang',
    detail: 'Die Notiz kann maximal 3000 Zeichen lang sein',
    life: 3000
  })
}

function throwToastNoContent() {
  toast.add({
    severity: 'warn',
    summary: 'Kein Notizinhalt',
    detail: 'Du hast keinen Notiztext eingegeben',
    life: 3000
  })
}

async function handleSaveNote() {
  if (noteContent.value.length < 1) {
    throwToastNoContent()
    return
  }
  if (noteContent.value.length > 3000) {
    throwToastContentTooLong()
    return
  }
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        cat_id: catsStore.state.currentCat.id,
        content: noteContent.value
      }
    ])
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    noteContent.value = ''
    toast.add({
      severity: 'success',
      summary: 'Notiz gespeichert',
      detail: 'Du hast eine neue Notiz erstellt',
      life: 3000
    })
    addNewNote.value = false
    await getNotes()
  }
}

async function togglePin(note) {
  let newPinnedState = !note.pinned
  const { error, data } = await supabase
    .from('notes')
    .update({ pinned: newPinnedState })
    .eq('id', note.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    if (newPinnedState) {
      toast.add({
        severity: 'info',
        summary: 'Notiz gepinned',
        detail: 'Du hast diese Notiz angeheftet',
        life: 2000
      })
    } else {
      toast.add({
        severity: 'info',
        summary: 'Pin entfernt',
        detail: 'Die Notiz ist nun nicht mehr angeheftet',
        life: 2000
      })
    }
    await getNotes()
  }
}

async function handleNoteEdit(currentContent, note) {
  const { error, data } = await supabase
    .from('notes')
    .update({ content: currentContent })
    .eq('id', note.id)
    .select()

  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    toast.add({
      severity: 'info',
      summary: 'Notiz bearbeitet',
      detail: 'Du hast die Notiz bearbeitet',
      life: 3000
    })
  }

  await getNotes()
}

async function deleteNote(note) {
  const { error, data } = await supabase.from('notes').delete().eq('id', note.id).select()
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    await getNotes()
    // toast.add({
    //   severity: 'info',
    //   summary: 'Notiz gelöscht',
    //   detail: 'Du hast die Notiz gelöscht',
    //   life: 3000
    // })
  }
}

const openDeleteDialog = (note) => {
  confirm.require({
    group: 'headless',
    message: `Möchtest du die Notiz löschen?`,
    header: 'Notiz löschen',

    accept: () => {
      deleteNote(note)
      toast.add({
        severity: 'info',
        summary: 'Notiz gelöscht',
        detail: 'Du hast die Notiz gelöscht',
        life: 3000
      })
    },
    reject: () => {}
  })
}

async function getNotes() {
  await getPinnedNotes()
  await getUnpinnedNotes()
}
async function getPinnedNotes() {
  const { error, data } = await supabase
    .from('notes')
    .select(`id, cat_id, content, created_at, created_by, pinned, profiles(id, username)`)
    .order('created_at', { ascending: false })
    .eq('cat_id', catsStore.state.currentCat.id)
    .eq('pinned', true)
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    pinnedNotes.value = data
  }
}

async function getUnpinnedNotes() {
  const { error, data } = await supabase
    .from('notes')
    .select(`id, cat_id, content, created_at, created_by, pinned, profiles(id, username)`)
    .order('created_at', { ascending: false })
    .eq('cat_id', catsStore.state.currentCat.id)
    .eq('pinned', false)
  if (error) {
    console.log(error)
  }
  if (data) {
    // console.log(data)
    unpinnedNotes.value = data
  }
}

onBeforeMount(async () => {
  await getNotes()
})
</script>

<style scoped>
.notes-content-wrapper {
  display: grid;
  justify-items: center;
  text-align: start;
  position: relative;
  padding-bottom: 2rem;
  width: 100%;
  /* border: 2px solid red; */
}
.button-add-note {
  width: 100%;
}
.button-save-note {
  width: 100%;
  margin-top: 1rem;
}
.note-input-wrapper {
  margin-top: 0.75rem;
}
.note-input {
  margin-top: 0 rem;
  width: 100%;
}
.notes-container {
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.float-label_label {
  color: var(--text);
  font-size: 1rem;
  padding-inline: 0.25rem;
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

.dialog-container {
  border-radius: var(--border-radius);
  display: grid;
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
.dialog-button-container {
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media screen and (min-width: 450px) {
  .button-add-note {
    width: 400px;
  }
}
@media screen and (min-width: 600px) {
  .dialog-container,
  .notes-content-wrapper {
    width: 500px;
  }
  .button-add-note {
    width: 480px;
  }
}

@media screen and (min-width: 700px) {
  .notes-content-wrapper {
    width: 600px;
  }
}
@media screen and (min-width: 1200px) {
  .notes-content-wrapper {
    width: 1000px;
  }
  .notes-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }

  .note-card {
    width: 490px;
    height: fit-content;
  }
  .button-add-note {
    width: 550px;
  }
}
</style>
