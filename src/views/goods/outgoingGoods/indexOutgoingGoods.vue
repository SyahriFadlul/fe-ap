<script setup>
import { useOutgoingGoodsStore } from '@/stores/outgoingGoods';
import { onMounted, ref } from 'vue';
import baseTable from '@/components/baseTable.vue';
import { IconFilter, IconSortAscending, IconPlus, IconEye, IconTrash } from '@tabler/icons-vue';
import Swal from 'sweetalert2';

const outgoingGoodsStore = useOutgoingGoodsStore()

function deleteOutgoingGoods(item){
  Swal.fire({
    title: 'Yakin ingin menghapus transaksi?',
    text: `Invoice: ${item.invoice}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await outgoingGoodsStore.deleteOutgoingGoods(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'Barang berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
		const page = 1
		router.push({
			name:'outgoingGoods.index',
			query:{...route.query, page}
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
  { key: 'date', label: 'Tanggal Keluar' },
  { key: 'invoice', label: 'Nomor Faktur' },
  { key: 'type', label: 'Tipe Transaksi' },
  { key: 'amount', label: 'Total' },
  { key: 'note', label: 'Catatan' },
];

onMounted( async () => {
	if (outgoingGoodsStore.outgoingGoodsItemList.length < 1){
    await outgoingGoodsStore.fetchOutgoingGoods(1)
  }
	
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
				<RouterLink :to="{name: 'outgoingGoods.create'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang Keluar</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="outgoingGoodsStore.outgoingGoodsItemList" class="table">
				<template #actions="{ item }">
					<button @click="outgoingGoodsStore.showDetails(item)" class="uk-margin-small-right btn-edit"><IconEye :size="18"/></button>
					<button @click="deleteOutgoingGoods(item)" class="btn-del"><IconTrash :size="18"/></button>
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

.btn-add {
	border: none;
	padding: 8px;
	border-radius: 8px;
	background-color: #5983F6;
	color: #f0f0ff;
	font-size: 15px;
}

.table{
	width: 100%;
  font-size: 12px;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 10px;
}

</style>