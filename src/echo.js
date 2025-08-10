import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//   wsHost: window.location.hostname, // atau langsung 'localhost'
//   wsPort: 6001,
//   wssPort: 6001,
//   forceTLS: false,
//   encrypted: false,
//   disableStats: true,
//   enabledTransports: ['ws', 'wss'],
// })
console.log('Key:', import.meta.env.VITE_PUSHER_APP_KEY);
console.log('Cluster:', import.meta.env.VITE_PUSHER_APP_CLUSTER);
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],

});
