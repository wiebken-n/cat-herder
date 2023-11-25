/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */

import './assets/base-style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'

/* Prime Vue Component imports >>>>>>>> */

// import Slider from 'primevue/slider'
// import Knob from 'primevue/knob'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import FileUpload from 'primevue/fileupload'

/* <<<<<<<<<<<< Prime Vue Component imports */

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

/* Prime Vue Components >>>>>>>> */

// app.component('Slider', Slider)
// app.component('Knob', Knob)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Calendar', Calendar)
app.component('FileUpload', FileUpload)

/* <<<<<<< Prime Vue Components */

app.mount('#app')
