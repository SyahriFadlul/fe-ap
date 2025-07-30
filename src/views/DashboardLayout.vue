<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue';
import { IconMenu2, IconRefresh, IconBell } from '@tabler/icons-vue'
import { useRoute } from 'vue-router';
import { watch, ref, onMounted } from 'vue';
import { useSettingStore } from '@/stores/setting';
import { useAuthStore } from '@/stores/auth';
import { useGoodsStore } from '@/stores/goods';
import { useSupplierStore } from '@/stores/supplier';
import { useCategoryStore } from '@/stores/category';
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import { useOutgoingGoodsStore } from '@/stores/outgoingGoods';
import { useUserStore } from '@/stores/user';

const authStore = useAuthStore()
const goodsStore = useGoodsStore()
const categoryStore = useCategoryStore()
const supplierStore = useSupplierStore()
const incomingGoodsStore = useIncomingGoodsStore()
const outgoingGoodsStore = useOutgoingGoodsStore()
const userStore = useUserStore()
const route = useRoute()
const page = ref('')

const settingStore = useSettingStore()

async function refresh(page){
  if(page.toLowerCase() === 'dashboard'){
    
  }
  if(page.toLowerCase() === 'inventori'){
    await goodsStore.fetchGoods(1)
    await goodsStore.fetchGoodsBatches()
  }
  if(page.toLowerCase() === 'kategori'){
    await categoryStore.fetchCategories()
  }
  if(page.toLowerCase() === 'supplier'){
    await supplierStore.fetchSuppliers()
  }
  if(page.toLowerCase() === 'barang masuk'){
    await incomingGoodsStore.getIncomingGoodsData()
  }
  if(page.toLowerCase() === 'barang keluar'){
    await outgoingGoodsStore.fetchOutgoingGoods()
  }
  if(page.toLowerCase() === 'manajemen user'){
    await userStore.getUsers()
  }
  
}

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
    <div :class="['main-wrapper', { 'main-collapsed': !settingStore.isSidebarExpanded }]" style="height: 100vh;">
<!-- HEADER -->
      <div id="section-header" :class="['uk-flex uk-flex-between', { 'header-collapsed': !settingStore.isSidebarExpanded }]">
        <div class="uk-flex uk-flex-middle">
          <button @click="settingStore.toggleSidebar">
            <IconMenu2 :size="20"/>
          </button>
          <button style="margin: 0px 5px 0px 5px;" @click="refresh($route.meta.title)">
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
  background-color: #F0F9FF;
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
  background-color: #F0F9FF;
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
  background: #F0F9FF;
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
