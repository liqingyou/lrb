import './assets/scss/main.scss'
// import './assets/scss/iconfont.scss'
import * as VueZoomContainer from "vue-zoom-container";

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {registerSW} from 'virtual:pwa-register'
import {createPinia} from 'pinia'
import mixin from './utils/mixin'
// 完整加载
import VueLuckyCanvas from '@lucky-canvas/vue'

// Register the service worker for PWA
registerSW({immediate: true})

const pinia = createPinia()

createApp(App).use(VueLuckyCanvas).mixin(mixin).use(pinia).use(router).use(VueZoomContainer).mount('#app')

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.error('Service Worker registration failed: ', err);
        });
    });
}