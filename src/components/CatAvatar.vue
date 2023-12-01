<script setup>
import { ref, toRefs, watch } from 'vue'
import { supabase } from '../supabase'
import { onUpdated } from 'vue'

const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path', 'imgurl'])
const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('catavatars').download(src.value)
    console.log(data)
    console.log(error)

    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files

  if (files.value[0].size >= 4000000) {
    throw new Error('Bitte wähle ein Bild mit einer maximalen Dateigröße von 4MB aus.')
  }
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`
    console.log(filePath)
    src.value = filePath
    const { error: uploadError } = await supabase.storage.from('catavatars').upload(filePath, file)

    if (uploadError) throw uploadError
    emit('update:path', filePath)
    emit('upload')
    emit('imgurl', filePath)
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}
onUpdated(() => {
  downloadImage()
})

watch(path, () => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div class="avatar-content-wrapper">
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      :style="{ height: size + 'em', width: size + 'em' }"
    />
    <div v-else class="avatar no-image" :style="{ height: size + 'em', width: size + 'em' }">
      <svg width="2rem" height="2rem" class="icon">
        <use xlink:href="@/assets/icons.svg#cat-sitting" fill="currentcolor"></use>
      </svg>
    </div>
    <div>
      <PrimeButton class="button-upload" outlined>
        <label class="primary block" for="single">
          {{ uploading ? 'Lade hoch ...' : 'Füge ein Bild hinzu' }}
        </label>
        <svg width="2rem" height="1rem" class="icon">
          <use xlink:href="@/assets/icons.svg#upload" fill="currentcolor"></use>
        </svg>
      </PrimeButton>

      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<style scoped>
.avatar-content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 1rem;
  justify-content: left;
  gap: 2vw;
}
.button-upload {
  margin: 0;
}
.avatar {
  border: 2px solid var(--dark);
  /* box-shadow: 0 0 5px 0 var(--hover-shadow); */
  border-radius: 90rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
