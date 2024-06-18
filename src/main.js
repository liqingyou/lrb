import './assets/scss/main.scss'
// import './assets/scss/iconfont.scss'
import * as VueZoomContainer from "vue-zoom-container";

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {registerSW} from 'virtual:pwa-register'

// Register the service worker for PWA
registerSW({immediate: true})

createApp(App).use(router).use(VueZoomContainer).mount('#app')
