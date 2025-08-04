<script setup>
import { IconLayoutDashboard, IconBox, IconTag, IconPackageImport, IconPackageExport,
IconUsers, IconLogout, IconBriefcase  } from '@tabler/icons-vue'
import { useSettingStore } from '@/stores/setting';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const settingStore = useSettingStore();
const authStore = useAuthStore()
const route = useRoute();

const menus = {
	dashboard: {
		name: 'Ringkasan',
		icon: IconLayoutDashboard,
		path: '/dashboard',
	},
	goods: {
		name: 'Data Barang',
		icon: IconBox,
		path: '/goods',
	},
	categories: {
		name: 'Kategori',
		icon: IconTag,
		path: '/categories',
	},
	suppliers: {
		name: 'Supplier',
		icon: IconBriefcase,
		path: '/suppliers',
	},
	incomingGoods: {
		name: 'Barang Masuk',
		icon: IconPackageImport,
		path: '/incoming-goods',
	},
	outgoingGoods: {
		name: 'Barang Keluar',
		icon: IconPackageExport,
		path: '/outgoing-goods',
	},
	users: {
		name: 'User Manajemen',
		icon: IconUsers,
		path: '/users',
	},
	// logout: {
	// 	name: 'Logout',
	// 	icon: IconLogout,
	// },
};
onMounted ( () => {
	
})
</script>
<template>
	<Transition>
		<div id="side-bar" class="sidebar  uk-background-default" uk-viewport-height>
			<div class="uk-flex uk-flex-middle uk-padding-small">
				<img src="@/assets/icons/logo.png" width="35" uk-img>
				<div style="font-size: 18px;font-weight: 500;margin-left: 2px;" v-show="settingStore.isSidebarExpanded">Apotek Cijawura</div>
			</div>
			<template v-for="(menu,index) in menus" :key="index">
				<div :class="['sbar-item uk-flex uk-flex-middle', { 'active-menu': $route.path === menu.path || $route.path.startsWith(menu.path + '/') }]">
					<RouterLink class="uk-text-decoration-none uk-padding-small sbar-item-text uk-flex uk-flex-middle" :to="menu.path">
						<component :is="menu.icon" :size="23" stroke-width="1.7"/>
						<span v-show="settingStore.isSidebarExpanded">{{ menu.name }}</span>
					</RouterLink>
				</div>
			</template>
			<button class="uk-margin-auto-top sbar-item uk-flex uk-flex-middle uk-text-decoration-none uk-padding-small btn-logout uk-flex uk-flex-middle" @click="authStore.handleLogout()">
				<IconLogout :size="23" stroke-width="1.7" />
				<span v-show="settingStore.isSidebarExpanded">Keluar</span>
			</button>
			<!-- <div :class="['sbar-item uk-flex uk-flex-middle uk-padding-small', { 'active-menu': $route.path === '/' }]">
				<RouterLink class="uk-text-decoration-none uk-padding-small sbar-item-text uk-flex uk-flex-middle" to="/">
					<IconLayoutDashboard :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">Ringkasan</span>
				</RouterLink>
			</div>
			<div class="sbar-item uk-flex uk-flex-middle uk-padding-small">            
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/goods">
					<IconBox :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">Barangs</span>
				</RouterLink>
			</div>
			<div class="sbar-item uk-flex uk-flex-middle uk-padding-small">
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/categories">
					<IconTag :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">Kategori</span>
				</RouterLink>
			</div>
			<div class="sbar-item uk-flex uk-flex-middle uk-padding-small">
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/incoming-goods">
					<IconPackageImport :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">Barang Masuk</span>
				</RouterLink>
			</div>
			<div class="sbar-item uk-flex uk-flex-middle uk-padding-small">
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/outgoing-goods">
					<IconPackageExport :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">Barang Keluar</span>
				</RouterLink>
			</div>
			<div class="sbar-item uk-flex uk-flex-middle uk-padding-small user-item uk-margin-small">
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/users">
					<IconUsers :size="23" stroke-width="1.7"/>
					<span v-show="settingStore.isSidebarExpanded">User Manajemen</span>
				</RouterLink>
			</div>
			<div class="sbar-item logout-item uk-padding-small">
				<RouterLink class="uk-text-decoration-none sbar-item-text" to="/users">
					<IconLogout/>
					<span v-show="settingStore.isSidebarExpanded">Logout</span>
				</RouterLink>
			</div> -->
		</div>
	</Transition>
</template>


<style scoped>
/* .badge {
    height: 70px;
} */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.sidebar {
	margin: 0px;
	padding:0px;
	height: 100vh;
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow-x: hidden;
}

.tog-btn {
	padding: -1px;
	width: 30px;
	height: 30px;
}

.sbar-item {
	margin: 2px 0px 2px 0px;
	border-radius: 10px;
}

.sbar-item-text{
	width: 100%;
	font-size: 14px;
	font-weight: 400;
	color: black; 
}

.sbar-item:hover {
	background-color: #F8F8F8;
	border: none;
}

.sbar-item-text:hover {
	color: black;
}

.btn-logout {
  width: 100%;
	font-size: 14px;
	font-weight: 400;
	color: black;
  border: none;
  background-color: white;
}

.btn-logout:hover {
  background-color: #F8F8F8;
	border: none;
}

.icon {
	border-left: 1px solid black;
}

.user-item {
	margin-top: auto !important;
}

.logout-item {
	margin-top: auto !important;
}

.active-menu {
	background-color: #f0f0ff !important;
	color: rgb(93, 135, 255) !important;
}

.active-menu > .sbar-item-text {
	color: #5d87ff !important;
}



</style>