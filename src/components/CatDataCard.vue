<template>
  <div class="info-segment">
    <div class="info-segment-header">
      <slot name="icon"></slot>
      <h2>{{ props.headline }}</h2>
    </div>
    <div class="output-container" v-if="!props.edit && props.dataContent">
      <div class="card-output content-object" v-if="props.hasContent">
        <div class="chip-container" v-if="props.isNoArray">
          <span class="chips">{{ props.dataContent.content }} {{ props.suffix }} </span>
        </div>
        <div class="chip-container" v-else>
          <span class="chips" v-for="element of props.dataContent" :key="element"
            >{{ element.content }} {{ props.suffix }}
          </span>
        </div>
      </div>
      <div v-else class="card-output no-content-object">
        <div
          class="chip-container"
          v-if="
            (typeof props.dataContent === 'string' || typeof props.dataContent === 'number') &&
            props.dataContent.length < 10
          "
        >
          <span class="chips">{{ props.dataContent }} {{ props.suffix }}</span>
        </div>
        <div
          v-if="
            (typeof props.dataContent === 'string' || typeof props.dataContent === 'number') &&
            props.dataContent.length >= 10
          "
        >
          <p>{{ props.dataContent }}</p>
        </div>
        <div v-if="typeof props.dataContent !== 'string' && typeof props.dataContent !== 'number'">
          <p v-for="item of props.dataContent" :key="item">{{ item }} {{ props.suffix }}</p>
        </div>
      </div>
    </div>
    <div v-if="!props.edit && !props.dataContent"><p>(noch) keine Angabe vorhanden</p></div>
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
  dataContent: [String, Object, Number, Array],
  hasContent: Boolean,
  isNoArray: Boolean,
  suffix: String
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
}
.info-segment p {
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
.chip-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-evenly;
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
