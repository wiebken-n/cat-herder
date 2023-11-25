import './assets/base-style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'

// import Slider from 'primevue/slider'
// import Knob from 'primevue/knob'
import Button from 'primevue/button'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

/* Prime Vue Components */
// app.component('Slider', Slider)
// app.component('Knob', Knob)
app.component('Button', Button)
app.mount('#app')
