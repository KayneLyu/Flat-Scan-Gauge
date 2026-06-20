import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@renderer/router';
import I18n from '@renderer/i18n';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
const pinia = createPinia()

app.use(I18n)
app.use(router)
app.provide('$i18n', I18n)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')
