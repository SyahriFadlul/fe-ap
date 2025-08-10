import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './axios'
import { useRoute, useRouter } from 'vue-router'
import './echo.js'


import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css'
import 'uikit/dist/js/uikit'
import '../node_modules/nprogress/nprogress.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vue-select/dist/vue-select.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
pinia.use(({ store }) => {
    store.router = markRaw(router)
    store.UIkit = markRaw(UIkit)
    store.Swal = markRaw(Swal)
    store.route = markRaw(useRoute)
    // store.$subscribe((state) => {
    //     localStorage.setItem('appState', JSON.stringify(state));
    //   })
})
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(VueDatePicker)
// app.use(NumberAnimation)
UIkit.use(Icons)

app.mount('#app')
