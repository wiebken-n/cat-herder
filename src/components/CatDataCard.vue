<template>
  <div class="info-segment">
    <div class="info-segment-header">
      <slot name="icon"></slot>
      <h2>{{ props.headline }}</h2>
    </div>
    <div class="card-output" v-if="!props.edit">
      <div v-if="typeof props.content === 'string' || typeof props.content === 'number'">
        <p>{{ props.content }}</p>
      </div>
      <div v-else>
        <p v-for="item of props.content" :key="item">{{ props.content }}</p>
      </div>
    </div>
    <slot v-if="props.edit" name="card-input"> </slot>

    <svg v-if="props.userIsOwner && !props.edit" @click="emit('editMode')" class="icon icon-edit">
      <use xlink:href="@/assets/icons.svg#edit" fill="currentcolor"></use>
    </svg>
    <svg v-if="props.userIsOwner && props.edit" @click="emit('dataSaved')" class="icon icon-edit">
      <use xlink:href="@/assets/icons.svg#save-data" fill="currentcolor"></use>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  edit: Boolean,
  userIsOwner: Boolean,
  headline: String,
  content: String
})

const emit = defineEmits(['editMode', 'dataSaved'])
</script>

<style scoped>
.info-segment {
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 1rem;
  /* border: 2px solid var(--primary); */
  position: relative;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
}
.info-segment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: max-content;
}

h2 {
  color: var(--primary);
  font-size: 1.1rem;
  top: -0.8rem;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-darker);
}
.info-segment > p {
  padding-bottom: 0.5rem;
  padding-inline: 0.5rem;
  inline-size: 100%;
  overflow-wrap: break-word;
  hyphens: manual;
}

.icon-edit {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

@media screen and (min-width: 700px) {
  .info-segment-header {
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
