<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue';
import { IconMenu2, IconRefresh, IconBell } from '@tabler/icons-vue'
import { useRoute } from 'vue-router';
import { watch, ref, onMounted } from 'vue';
import { useSettingStore } from '@/stores/setting';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const route = useRoute()
const page = ref('')

const settingStore = useSettingStore()

watch(() => route.fullPath,
  () => {
    page.value = route.meta.title    
  }
)
onMounted( () => {
  page.value = route.meta.title
})
</script>
<template>
  <div class="uk-flex" uk-height-viewport>
<!-- SIDEBAR, LAYOUT KIRI -->
    <div id="section-sidebar" :class="['sidebar', { 'sidebar-collapsed': !settingStore.isSidebarExpanded }]">
      <Sidebar></Sidebar>
    </div>
<!-- LAYOUT KANAN -->
    <div :class="['main-wrapper uk-background-muted', { 'main-collapsed': !settingStore.isSidebarExpanded }]" style="height: 100vh;">
<!-- HEADER -->
      <div id="section-header" :class="['uk-flex uk-flex-between uk-background-muted', { 'header-collapsed': !settingStore.isSidebarExpanded }]">
        <div class="uk-flex uk-flex-middle">
          <button @click="settingStore.toggleSidebar">
            <IconMenu2 :size="20"/>
          </button>
          <button style="margin: 0px 5px 0px 5px;">
            <IconRefresh :size="20"/>
          </button>
          <div class="uk-align-baseline uk-text-capitalize" style="width: 200px;">{{page}}</div>
        </div>
        <div class="uk-flex uk-flex-middle uk-text-capitalize">
          <button class="uk-margin-small-right">
            <IconBell :size="20"/>
          </button>
          <div class="uk-align-baseline">
            Hello, {{ authStore.user.username }}
          </div>
        </div>
      </div>
<!-- MAIN CONTENT -->
      <!-- <div :class="['main-content uk-padding-small uk-background-muted', { 'main-collapsed': !settingStore.isSidebarExpanded }]" style="height: 100%;"> -->
      <div class="main-content" >
        <!-- <div id="section-header" class="uk-background-muted uk-padding-remove uk-margin-remove" uk-sticky>
          <nav class="uk-navbar uk-padding-remove uk-margin-remove" uk-navbar>
            <div class="uk-navbar-left">
              <button><IconMenu2 :size="20"/></button>
              <button style="margin: 0px 5px 0px 5px;"><IconRefresh :size="20"/></button>
            <p class="uk-width-expand uk-margin-remove uk-text-capitalize">{{page}}</p>
            </div>
            <div class="uk-navbar-right">
              <button class="uk-button uk-button-default">
                <IconBell :size="20"/>
              </button>
            </div>
          </nav>
        </div> -->
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
#section-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 1000;
  flex-direction: column;
  width: 17%;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease;
  border-right: 1px solid #eee;
}

.sidebar-collapsed {
  width: 60px !important;
}

.main-wrapper {
  margin-left: 16.1%;
  width: 85%;
  height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease;
  min-width: 0;
}


#section-header {
  /* position: fixed;
  top: 0;
  width: 83%;
  margin-left: 17%;
  height: 20px;
  z-index: 1000;
  border: 2px dashed green; 
  background-color: white;
  transition: margin-left 0.3s ease, width 0.3s ease;*/
  position: fixed;
  top: 0;
  width: calc(100% - 17%);
  height: 50px;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 10px 15px;
}

.header-collapsed {
  /* margin-left: 10px !important; */
  width: calc(100% - 46px) !important;
}

.main-content {
  /* margin-left: 17% !important;
  margin-top: 50px;
  width: 83%;
  height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease;
  border: 1px solid red;
  border: 2px dashed blue;
  overflow-y: auto; */
  /* min-height: calc(100vh - 10px); */
  margin-top: 50px; /* offset header */
  padding: 20px;
  min-width: 100% !important;
  background: #f8f8f8;
  border-radius: 15px;
}

.main-collapsed {
  margin-left: 46px !important;
  width: calc(100% - 46px) !important;
}

button {
  background: transparent;
  border: none;
}

button:hover {
  background-color:#eee;
}
</style>
