<script setup>
import { useOutgoingGoodsStore } from '@/stores/outgoingGoods';
import { onMounted, ref } from 'vue';
import baseTable from '@/components/baseTable.vue';
import { IconFilter, IconSortAscending, IconPlus, IconEye, IconTrash } from '@tabler/icons-vue';
import Swal from 'sweetalert2';
import VueDatePicker from '@vuepic/vue-datepicker';
import Paginate from 'vuejs-paginate-next';

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

const sortDate = ref({
  startDate: new Date(),
  endDate: new Date(),
});

function applyFilter(){
  
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
		<div class="uk-flex uk-flex-bottom">
			<input type="text" class="search uk-text-italic" placeholder="Cari berdasarkan nomor faktur">
			<div class="uk-margin-medium-left">
        <div class="uk-inline">
          <button class="btn-fs uk-margin-small-right" type="button"><icon-filter :size="18"/></button>
          <div class="uk-width-large" uk-dropdown="mode: click;">
            <div class="uk-flex uk-flex-between">
              <div class="uk-flex uk-flex-column">
                <div>Tanggal Awal</div>
                <VueDatePicker placeholder="Pilih tanggal awal" v-model="sortDate.startDate"/>
              </div>
              <div class="uk-flex uk-flex-column">
                <div>Tanggal Akhir:</div>
                <VueDatePicker placeholder="Pilih tanggal akhir" v-model="sortDate.endDate"/>
              </div>
            </div>
            <div class="uk-margin-top">
              <button class="btn-add" @click="applyFilter">Terapkan</button>
            </div>
        </div>
      </div>
        <button class="btn-fs"><icon-sort-ascending :size="18"/></button>
      </div>    
      <div class="uk-margin-auto-left uk-flex uk-flex-row uk-flex-middle">
        <button class="btn-add uk-flex uk-flex-middle uk-margin-right">Eksport Ke PDF</button>
        <button class="btn-add uk-flex uk-flex-middle uk-margin-right">Eksport Ke Excel(XLS)</button>
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
    <paginate
    v-model="outgoingGoodsStore.pagination.currentPage"
    :page-count="outgoingGoodsStore.pagination.totalPage"
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

.table{
	width: 100%;
  font-size: 12px;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 10px;
}

</style>