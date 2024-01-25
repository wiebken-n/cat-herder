<template>
  <div class="info-segment">
    <div class="info-segment-header">
      <slot name="icon"></slot>
      <h2>{{ props?.headline }}</h2>
    </div>
    <div class="output-container" v-if="!props?.edit && props?.dataContent?.name">
      <div class="card-output no-content-object">
        <div class="vet-data" v-if="props?.dataContent">
          <p>{{ props?.dataContent?.name }}</p>
          <p>
            <span>{{ props?.dataContent?.street }}, {{ props?.dataContent?.city }}</span>
          </p>
          <p>Tel.: {{ props?.dataContent?.phone }}</p>
        </div>
      </div>
    </div>
    <div v-if="!props?.edit && !props?.dataContent?.name"><p>(noch) keine Angabe vorhanden</p></div>
    <slot v-if="props?.edit" name="card-input"> </slot>

    <svg
      v-if="props?.userIsOwner && !props?.edit"
      tabindex="0"
      @click="emit('editMode')"
      @keyup.enter="emit('editMode')"
      class="icon icon-edit"
    >
      <use xlink:href="@/assets/icons.svg#edit" fill="currentcolor"></use>
    </svg>
    <svg
      v-if="props?.userIsOwner && props?.edit"
      tabindex="0"
      @keyup.enter="emit('dataSaved')"
      @click="emit('dataSaved')"
      class="icon icon-edit"
    >
      <use xlink:href="@/assets/icons.svg#save-data" fill="currentcolor"></use>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  edit: Boolean,
  userIsOwner: Boolean,
  headline: String,
  dataContent: [String, Object, Number, Array]
})

const emit = defineEmits(['editMode', 'dataSaved'])
</script>

<style scoped>
/* .info-segment {
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 1rem;
  position: relative;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px 2px var(--card-shadow);
} */
.info-segment {
  width: 100%;
  padding-top: 0.25rem;
  padding-inline: 1.25rem;
  padding-bottom: 1.25rem;
  /* border: 2px solid var(--primary); */
  position: relative;
  background-color: var(--background-catdata-card);
  border: 2px solid var(--border-catdata-card);
  border-radius: var(--border-radius);
  /* box-shadow: 0 0 4px 2px var(--card-shadow); */
}
.output-container {
  width: 100%;
}
.info-segment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: max-content;
  width: 100%;
}

h2 {
  color: var(--primary);
  font-size: 1rem;
  top: -0.8rem;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-darker);
  transition: all 200ms ease-in-out;
}

.icon:hover,
.icon:focus {
  color: var(--burger-icons);
}
.info-segment p {
  padding-bottom: 0.5rem;
  padding-inline: 0.5rem;
  inline-size: 100%;
  overflow-wrap: break-word;
  word-break: break-all;
  hyphens: manual;
}

span,
p {
  font-size: 0.95rem;
}
.icon-edit {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.vet-data {
  margin-block: 1rem;
}
.vet-data p {
  margin: 0;
}
.chips {
  background: var(--chip-background);
  padding-inline: 1rem;
  padding-block: 0.75rem;
  margin-inline: 1rem;
  border-radius: 30px;
  width: fit-content;
}
@media screen and (min-width: 700px) {
  .info-segment-header {
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
