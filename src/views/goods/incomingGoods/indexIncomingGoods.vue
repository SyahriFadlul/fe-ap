<script setup>
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import { onMounted, ref } from 'vue';
import baseTable from '@/components/baseTable.vue';
import { IconFilter, IconSortAscending, IconPlus } from '@tabler/icons-vue';
import Paginate from 'vuejs-paginate-next';

const incomingGoodsStore = useIncomingGoodsStore()

const columns = [
  { key: 'received_date', label: 'Tanggal Penerimaan' },
  { key: 'invoice', label: 'Nomor Faktur' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Total' },
];

const rupiahNum = function (num) {
  let price = String(num);
  price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return price + ",00";
};

async function clickCallback(page){
  await incomingGoodsStore.getIncomingGoodsData(page)  
}

onMounted( async () => {
  if (incomingGoodsStore.incomingGoodsItemList.length < 1){
    await incomingGoodsStore.getIncomingGoodsData()
  }
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
				<RouterLink :to="{name: 'createIncomingGoods'}">
					<button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang Masuk</button>
				</RouterLink>
			</div>
		</div>
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="incomingGoodsStore.incomingGoodsItemList" class="table" @row-click="incomingGoodsStore.showDetails">
				<template #amount="{item}">
					<span>Rp.{{ rupiahNum(item.amount) }}</span>
				</template>
				<template #actions="{ item }">
					<button @click="edit(item)" class="">Edit</button>
					<button @click="remove(item)" class="">Hapus</button>
				</template>
			</baseTable>
		</div> 
    <paginate
      :page-count="incomingGoodsStore.pagination.totalPage"
      :page-range="3"
      :margin-pages="3"
      :click-handler="clickCallback"
      :prev-text="'Sebelumnya'"
      :next-text="'Selanjutnya'"
      :container-class="'pagination'"
      :page-class="'page-item'"
      class="uk-margin-auto-right"
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

.pagination {
  display: flex;
  justify-self: end;
  margin-top: 5px;
}

</style>