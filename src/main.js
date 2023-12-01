/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'

/* Prime Vue Component imports >>>>>>>> */

// import Slider from 'primevue/slider'
// import Knob from 'primevue/knob'
import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimeTextArea from 'primevue/textarea'
import PrimeCalendar from 'primevue/calendar'
// import FileUpload from 'primevue/fileupload'

import './assets/base-style.css'

/* <<<<<<<<<<<< Prime Vue Component imports */

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

/* Prime Vue Components >>>>>>>> */

// app.component('Slider', Slider)
// app.component('Knob', Knob)
app.component('PrimeButton', PrimeButton)
app.component('PrimeInputText', PrimeInputText)
app.component('PrimeTextArea', PrimeTextArea)
app.component('PrimeCalendar', PrimeCalendar)
// app.component('FileUpload', FileUpload)

/* <<<<<<< Prime Vue Components */

app.mount('#app')
