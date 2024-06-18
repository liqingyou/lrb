import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'My Vue3 PWA',
                short_name: 'Vue3PWA',
                description: 'My awesome Vue 3 Progressive Web App!',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'icons/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                swDest: 'sw.js'
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false,
                additionalData: `@import './src/assets/scss/variable.scss';`
            }
        }
    }
})
