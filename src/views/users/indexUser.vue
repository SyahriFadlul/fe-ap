<script setup>
import { useUserStore } from '@/stores/user';
import baseTable from '../../components/baseTable.vue';
import { onMounted,watch } from 'vue';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const userStore = useUserStore()

const columns = [
  { key: 'username', label: 'Username' },
  { key: 'note', label: 'Catatan' },
];

function deleteUser(item){
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: `User: ${item.username}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await userStore.deleteUser(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'User berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })        
      } catch (error) {
        console.log(error);
        
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus.',
          icon: 'error',
        })
      }
    }
  })
}

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
				<RouterLink :to="{name: 'user.create'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>User</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="userStore.userItems" class="table">
				<template #actions="{ item }">
					<button @click="edit(item)" class="uk-margin-small-right btn-edit"><IconEdit :size="18"/></button>
					<button @click="deleteUser(item)" class="btn-del"><IconTrash :size="18"/></button>
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
