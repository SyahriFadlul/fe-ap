<script setup>
import { useUserStore } from '@/stores/user';
import baseTable from '../../components/baseTable.vue';
import { onMounted, watch, ref } from 'vue';
import { IconEye, IconTrash, IconPlus, IconSortAscending, IconSortDescending, IconFilter } from '@tabler/icons-vue';
import Paginate from 'vuejs-paginate-next';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const columns = [
  { key: 'username', label: 'Username' },
  { key: 'role', label: 'Role' },
];

async function clickCallback(page){
  router.push({
    name: 'user.index',
    query: {...route.query, page}
  })  
}

const userQuery = ref('')
watch(userQuery, async (newVal) => {
  if(newVal === ''){
    let page = 1
    if(parseInt(route.query.page) !== 1){
      router.push({ name: 'user.index', query: { ...route.query, page } })

      return
    }
    await userStore.fetchUsers(page)
  }
})

const isAscending = ref(true)

watch(isAscending, (value) => {
  userStore.userItems.sort((a, b) => {
    return value
      ? a.username.localeCompare(b.username)   // A → Z
      : b.username.localeCompare(a.username)   // Z → A
  })
})

// function deleteUser(item){
//   Swal.fire({
//     title: 'Yakin ingin menghapus?',
//     text: `User: ${item.username}`,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Ya, hapus!',
//     cancelButtonText: 'Batal',
//   }).then(async (result) => {
//     if (result.isConfirmed) {
//       try {
//         await userStore.deleteUser(item.id)
//         Swal.fire({
//           title: 'Dihapus!',
//           text: 'User berhasil dihapus.',
//           icon: 'success',
//           timer: 1500,
//           showConfirmButton: false,
//         })        
//       } catch (error) {
//         console.log(error);
        
//         Swal.fire({
//           title: 'Gagal!',
//           text: 'Terjadi kesalahan saat menghapus.',
//           icon: 'error',
//         })
//       }
//     }
//   })
// }

onMounted( async ()=>{
  if (userStore.userItems.length < 1) {
    await userStore.fetchUsers()
  }
})
</script>
<template>
	<div>        
		<div></div>
		<div class="uk-flex uk-flex-bottom">
			<input type="text" class="search uk-text-italic" placeholder="Cari berdasarkan nama pengguna" v-model="userQuery"
      @input="userStore.getUserSearch($event.target.value)">
			<div class="uk-margin-medium-left">
				<!-- <button class="btn-fs uk-margin-small-right"><icon-filter :size="18"/></button> -->
				<button class="btn-fs" @click="()=> isAscending = !isAscending" uk-tooltip="Urutkan Berdasarkan Abjad">
          <icon-sort-ascending :size="18" v-show="isAscending"/>
          <icon-sort-descending :size="18" v-show="!isAscending"/>
        </button>
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
					<button @click="userStore.showDetails(item)" class="uk-margin-small-right btn-edit"><IconEye :size="18"/></button>
					<button @click="userStore.deleteUser(item)" class="btn-del" 
          v-if="item.id !== authStore.user.id"><IconTrash :size="18"/></button>
				</template>
			</baseTable>
		</div>
    <paginate
      v-model="userStore.pagination.currentPage"
      :page-count="userStore.pagination.totalPage"
      :page-range="3"
      :margin-pages="3"
      :click-handler="clickCallback"
      :prev-text="'Sebelumnya'"
      :next-text="'Selanjutnya'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    />
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
