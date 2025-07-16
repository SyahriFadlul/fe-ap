<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './views/components/Sidebar.vue';
import { IconMenu2, IconRefresh, IconBell } from '@tabler/icons-vue'
import { useRoute } from 'vue-router';
import { watch, ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore()

onMounted( async () => {
  
})
</script>
<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
