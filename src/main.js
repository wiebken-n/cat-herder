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
import PrimeMultiSelect from 'primevue/multiselect'
import PrimeTabView from 'primevue/tabview'
import PrimeTabPanel from 'primevue/tabpanel'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeInputSwitch from 'primevue/inputswitch'

import { setupCalendar } from 'v-calendar'
import 'v-calendar/style.css'

import primevuede from '@/assets/primevuede.json'
/* <<<<<<<<<<<< Prime Vue Component imports */
import './assets/base-style.css'

const primevueDeLoc = primevuede.de

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { locale: primevueDeLoc })
app.use(ToastService)
app.use(ConfirmationService)

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
app.component('PrimeMultiSelect', PrimeMultiSelect)
app.component('PrimeTabView', PrimeTabView)
app.component('PrimeTabPanel', PrimeTabPanel)
app.component('PrimeInputNumber', PrimeInputNumber)
app.component('PrimeInputSwitch', PrimeInputSwitch)
// app.component('FileUpload', FileUpload)

/* <<<<<<< Prime Vue Components */

app.mount('#app')
