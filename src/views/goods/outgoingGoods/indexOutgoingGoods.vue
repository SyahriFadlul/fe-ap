<script setup>
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import { onMounted, ref } from 'vue';
import baseTable from '@/views/components/baseTable.vue';
import { IconFilter, IconSortAscending, IconPlus } from '@tabler/icons-vue';

const incomingGoodsStore = useIncomingGoodsStore()

const columns = [
  { key: 'received_date', label: 'Tanggal Penerimaan' },
  { key: 'invoice', label: 'Nomor Faktur' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Total' },
];

onMounted( async () => {
	await incomingGoodsStore.getIncomingGoodsData()
	console.log(incomingGoodsStore.incomingGoodsItemList);
	
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
				<RouterLink :to="{name: 'createOutgoingGoods'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang Keluar</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="incomingGoodsStore.incomingGoodsItemList" class="table">
				<template #actions="{ item }">
					<button @click="edit(item)" class="">Edit</button>
					<button @click="remove(item)" class="">Hapus</button>
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

.table{
	width: 100%;
  font-size: 12px;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 10px;
}

</style>