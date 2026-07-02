import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import store from "./store"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/routes'

import './firebase'

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
})
app.use(router)
app.use(store)
app.use(ElementPlus)    
app.mount('#app')
