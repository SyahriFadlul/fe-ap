import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './axios'


import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css'
import 'uikit/dist/js/uikit'
import '../node_modules/nprogress/nprogress.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
pinia.use(({ store }) =>{
    store.router = markRaw(router)
    // store.$subscribe((state) => {
    //     localStorage.setItem('appState', JSON.stringify(state));
    //   })
})
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(vSelect)
app.use(VueDatePicker)
// app.use(NumberAnimation)
UIkit.use(Icons)

app.mount('#app')
