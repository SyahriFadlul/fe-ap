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


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
pinia.use(({ store }) =>{
    store.router = markRaw(router)
    // store.$subscribe((state) => {
    //     localStorage.setItem('appState', JSON.stringify(state));
    //   })
})
app.use(router)
// app.use(NumberAnimation)
UIkit.use(Icons)

app.mount('#app')
