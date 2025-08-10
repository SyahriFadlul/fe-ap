import axios from "axios";
import { defineStore } from "pinia";

export const useSettingStore = defineStore('setting',{
    state: () => ({
        isSidebarExpanded: true,
        notificationPermission: false,
    }),
    getters:{
        permission: (state) => state.notificationPermission,
    },
    actions:{
        toggleSidebar(){
            this.isSidebarExpanded = !this.isSidebarExpanded
            console.log(this.isSidebarExpanded);
        },
        async requestNotificationPermission() {
            const result = await Notification.requestPermission()
            this.notificationPermission = result

            // const res = await axios.get('/api/expiring-goods')
            // const expiringItems = res.data

            // if (expiringItems.length > 0 && this.notificationPermission === 'granted') {
            //     const msg = `Ada ${expiringItems.length} barang yang akan kedaluwarsa dalam 7 hari!`
            //     this.sendNotification('Perhatian Inventori', msg)
            // }

            // const { data: notifications } = await axios.get('/api/notifications')

            // notifications.forEach(notif => {
            //     const payload = {
            //     title: notif.title,
            //     body: notif.message,
            //     icon: '/icons/favicon.ico'
            //     }

            //     if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            //         navigator.serviceWorker.controller.postMessage(payload)
            //     } else {
            //         new Notification(payload.title, {
            //             body: payload.body,
            //             icon: payload.icon
            //         })
            //     }

            // })
        },
        // sendNotification(title, body) {
        //     const icon = new URL('@/assets/icons/favicon.ico', import.meta.url).href
        //     const payload = { title, body, icon }

        //     if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        //         navigator.serviceWorker.controller.postMessage(payload)
        //     } else {
        //         // fallback langsung dari halaman (kalau SW belum aktif)
        //         new Notification(title, { body: body, icon: payload.icon })
        //     }
        // },
        sendNotification(){
            if (this.permission !== 'granted') {
                alert('Notifikasi belum diizinkan!')
                return
            }

            new Notification('Halo dari Vue.js!', {
                body: 'Ini adalah pesan notifikasi contoh.',
                icon: new URL('@/assets/icons/favicon.ico', import.meta.url).href
            })
        },
    },
    persist: {
        storage: localStorage
    },
})