import { reactive } from 'vue'
import { defineStore } from 'pinia'

// export const feeding_times = reactive({})
export const useResourcesStore = defineStore('resources', () => {
  const options = reactive({
    catbreeds: [
      { content: 'Wald-und-Wiesen-Katze' },
      { content: 'Kurzhaar-Mischung' },
      { content: 'Europäisch Kurzhaar' },
      { content: 'Britisch Kurzhaar' },
      { content: 'Europäisch Langhaar' },
      { content: 'Ragdoll' },
      { content: 'Siamkatze' },
      { content: 'Perser' },
      { content: 'Maine Coon' },
      { content: 'andere' }
    ],
    inoutdoor: [{ content: 'Wohnungskatze' }, { content: 'Freigänger' }, { content: 'Streuner' }],
    sex: [{ content: 'weiblich' }, { content: 'männlich' }],
    neutered: [{ content: 'kastriert' }, { content: 'nicht kastriert' }],

    foodVarieties: [
      { content: 'Dosenfutter' },
      { content: 'Trockenfutter' },
      { content: 'Barf' },
      { content: 'Kochbarf' }
    ],
    feedingTimes: [
      { content: 1 },
      { content: 2 },
      { content: 3 },
      { content: 4 },
      { content: 5 },
      { content: 6 },
      { content: 7 },
      { content: 8 }
    ],
    drugs: [
      { content: 'nein' },
      { content: 'täglich' },
      { content: 'mehrmals täglich' },
      { content: 'unregelmäßig' },
      { content: 'selten' }
    ],
    personality: [
      { content: 'ruhig' },
      { content: 'ängstlich' },
      { content: 'freundlich' },
      { content: 'aktiv' },
      { content: 'spielfreudig' },
      { content: 'mutig' },
      { content: 'unruhig' },
      { content: 'entspannt' },
      { content: 'aggressiv' }
    ],
    playtimes: [
      { content: 'gar nicht' },
      { content: 'alle paar Tage' },
      { content: 'einmal am Tag' },
      { content: '2-3 mal am Tag' },
      { content: '3-5 mal am Tag' },
      { content: 'pausenlos!' }
    ]
  })
  return {
    options
  }
})
