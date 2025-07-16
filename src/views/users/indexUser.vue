<script setup>
import { useUserStore } from '@/stores/user';
import baseTable from '../components/baseTable.vue';
import { onMounted } from 'vue';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-vue';

const userStore = useUserStore()

const columns = [
  { key: 'username', label: 'Username' },
  { key: 'note', label: 'Catatan' },
];

onMounted( async ()=>{
  await userStore.getUsers()
})
</script>
<template>
	<div>        
		<div></div>
		<div class="uk-flex uk-flex-bottom">
			<input type="text" class="search uk-text-italic" placeholder="Cari berdasarkan nomor faktur">
			<div class="uk-margin-medium-left">
				<button class="btn-fs uk-margin-small-right"><icon-filter :size="18"/></button>
				<button class="btn-fs"><icon-sort-ascending :size="18"/></button>
			</div>
			<div class="uk-margin-auto-left">
				<RouterLink :to="{name: 'createUser'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>User</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="userStore.userItems" class="table">
				<template #actions="{ item }">
					<button @click="edit(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
					<button @click="remove(item)" class="btn-del"><IconTrash :size="18"/></button>
				</template>
			</baseTable>
		</div>
	</div>
</template>
<style  scoped>
.search {
  width: 250px;
  font-size: 14px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-fs {
	border: none;
}

.btn-add {
	border: none;
	padding: 8px;
	border-radius: 8px;
	background-color: #5983F6;
	color: #f0f0ff;
	font-size: 15px;
}

.btn-edit {
  border: none;
  border-radius: 8px;
}

.table{
	width: 100%;
  font-size: 12px;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 10px;
}
</style>
