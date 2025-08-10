<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { IconMenu2, IconRefresh, IconBell } from '@tabler/icons-vue'
import { useRoute } from 'vue-router';
import { watch, ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useSettingStore } from './stores/setting';
import './echo.js';

const authStore = useAuthStore()
const settingStore = useSettingStore()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('[SW] Registered', reg))
    .catch(err => console.error('[SW] Register Failed:', err));
}

onMounted( async () => {
  if(settingStore.permission === null){
    await settingStore.requestNotificationPermission()
  }
  if (settingStore.permission === 'granted') {
    window.Echo.channel('inventory')
      .listen('.InventoryEvent', (event) => {
        new Notification(event.title, {
          body: event.message,
          icon: '@assets/icons/favicon.ico'
        })
      })
    }
  // window.Echo.channel('testing')
  //   .listen('test-event', (e) => {
  //       console.log('Terima event:', e.message);
  //       settingStore.sendNotification('judul', e.message)
  //   });
    // console.log(window.Echo);
    // console.log("Listening...")
    // window.Echo.channel('testing')
    // .listen('.test-event', (e) => {
    //   console.log("Terima Event!", e)
    // });
    // console.log(window.Echo.connector.pusher.connection.state)

    // const connection = window.Echo.connector.pusher.connection

  // connection.bind('connected', () => {
  //   console.log('✅ Pusher Connected!');
  //   window.Echo.channel('testing')
  //     .listen('test-event', (e) => {
  //       console.log('📢 Terima Event:', e);
  //     });
  // });
})
</script>
<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
