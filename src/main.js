import './assets/scss/main.scss'
import './assets/scss/iconfont.scss'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {registerSW} from 'virtual:pwa-register'

// Register the service worker for PWA
registerSW({immediate: true})

createApp(App).use(router).mount('#app')