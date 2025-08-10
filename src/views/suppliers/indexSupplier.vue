<script setup>
import { useSupplierStore } from '@/stores/supplier';
import baseTable from '../../components/baseTable.vue';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IconEye, IconTrash, IconPlus, IconSortAscending, IconFilter } from '@tabler/icons-vue';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

const supplierStore = useSupplierStore()

const columns = [
  { key: 'company_name', label: 'Nama Instansi' },
  { key: 'company_phone', label: 'Telepon Instansi' },
  { key: 'contact_person_name', label: 'Kontak Person' },
  { key: 'contact_person_phone', label: 'Telepon Kontak Person' },
  { key: 'note', label: 'Catatan' },
];

async function clickCallback(page){
  router.push({
    name: 'supplier.index',
    query: {...route.query, page}
  })  
}

function deleteSupplier(item){
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: `Supplier: ${item.name}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await supplierStore.deleteSupplier(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'Supplier berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })        
      } catch (error) {
        console.log(error);
        
        Swal.fire({
          title: 'Gagal!',
          text: error.response.data.message,
          icon: 'error',
        })
      }
    }
  })
}

onMounted( async ()=>{
  supplierStore.editing = false
  if (supplierStore.supplierItems.length < 1){
    await supplierStore.fetchSuppliers()
  }
})
</script>
<template>
	<div>        
		<div></div>
		<div class="uk-flex uk-flex-bottom">
			<input type="text" class="search uk-text-italic" placeholder="Cari supplier">
			<div class="uk-margin-medium-left">
				<button class="btn-fs uk-margin-small-right"><icon-filter :size="18"/></button>
				<button class="btn-fs"><icon-sort-ascending :size="18"/></button>
			</div>
			<div class="uk-margin-auto-left">
				<RouterLink :to="{name: 'supplier.create'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Supplier</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="supplierStore.supplierList" class="table">
				<template #actions="{ item }">
					<button @click="supplierStore.detailSupplier(item)" class="uk-margin-small-right btn-edit"><IconEye :size="18"/></button>
					<button @click="deleteSupplier(item)" class="btn-del"><IconTrash :size="18"/></button>
				</template>
			</baseTable>
		</div>
    <paginate
      :page-count="supplierStore.pagination.totalPage"
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
