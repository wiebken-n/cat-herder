/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'

/* Prime Vue Component imports >>>>>>>> */

import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimeTextArea from 'primevue/textarea'
import PrimeCalendar from 'primevue/calendar'
import PrimeDialog from 'primevue/dialog'
import PrimeMenubar from 'primevue/menubar'
import PrimeTag from 'primevue/tag'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import PrimeDropdown from 'primevue/dropdown'
import PrimeConfirmDialog from 'primevue/confirmdialog'
import PrimeTabMenu from 'primevue/tabmenu'
import PrimeCheckbox from 'primevue/checkbox'
import Tooltip from 'primevue/tooltip'

import { setupCalendar } from 'v-calendar'
import 'v-calendar/style.css'

import './assets/base-style.css'
/* <<<<<<<<<<<< Prime Vue Component imports */

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.use(setupCalendar, {})

/* Prime Vue Components >>>>>>>> */

app.component('PrimeButton', PrimeButton)
app.component('PrimeInputText', PrimeInputText)
app.component('PrimeTextArea', PrimeTextArea)
app.component('PrimeCalendar', PrimeCalendar)
app.component('PrimeDialog', PrimeDialog)
app.component('PrimeMenubar', PrimeMenubar)
app.component('PrimeTag', PrimeTag)
app.component('PrimeDropdown', PrimeDropdown)
app.component('PrimeConfirmDialog', PrimeConfirmDialog)
app.component('Toast', Toast)
app.component('PrimeTabMenu', PrimeTabMenu)
app.component('PrimeCheckbox', PrimeCheckbox)
// app.component('FileUpload', FileUpload)

/* <<<<<<< Prime Vue Components */

app.mount('#app')
