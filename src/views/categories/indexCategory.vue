<script setup>
import { useCategoryStore } from '@/stores/category';
import baseTable from '../../components/baseTable.vue';
import { onMounted } from 'vue';
import { IconEye, IconTrash, IconPlus, IconSortAscending, IconFilter } from '@tabler/icons-vue';
import Swal from 'sweetalert2';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import Paginate from 'vuejs-paginate-next';

const categoryStore = useCategoryStore()
const route = useRoute()

function deleteCategory(item){
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: `Kategori: ${item.name}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await categoryStore.deleteCategory(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'Kategori berhasil dihapus.',
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

const columns = [
  { key: 'name', label: 'Nama Kategori' },
  { key: 'note', label: 'Catatan' },
];

async function clickCallback(page){
  router.push({
    name: 'category.index',
    query: {...route.query, page}
  })  
}

watch(()=> route.query.page,
  async (page)=>{
    categoryStore.pagination.currentPage = page    
    await categoryStore.fetchCategories(page)
  }
)

onMounted( async ()=>{
	if (categoryStore.categoryItems.length < 1){
    await categoryStore.fetchCategories()
  }
})
</script>
<template>
	<div>        
		<div></div>
		<div class="uk-flex uk-flex-bottom">
			<input type="text" class="search uk-text-italic" placeholder="Cari kategori">
			<div class="uk-margin-medium-left">
				<button class="btn-fs uk-margin-small-right"><icon-filter :size="18"/></button>
				<button class="btn-fs"><icon-sort-ascending :size="18"/></button>
			</div>
			<div class="uk-margin-auto-left">
				<RouterLink :to="{name: 'category.create'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Kategori</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="categoryStore.categoryItems" class="table">
				<template #actions="{ item }">
					<button @click="categoryStore.detailCategory(item)" class="uk-margin-small-right btn-edit" uk-tooltip="Lihat Detail Item"><IconEye :size="18"/></button>
					<button @click="deleteCategory(item)" class="btn-del" uk-tooltip="Hapus Item"><IconTrash :size="18"/></button>
				</template>
			</baseTable>
		</div>
		<paginate
		v-model="categoryStore.pagination.currentPage"
		:page-count="categoryStore.pagination.totalPage"
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
.btn:hover {
  background: #e6e6e6;
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
