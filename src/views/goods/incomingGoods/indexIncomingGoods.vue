<script setup>
import { useIncomingGoodsStore } from '@/stores/incomingGoods';
import { onMounted, ref, watch } from 'vue';
import baseTable from '@/components/baseTable.vue';
import { IconFilter, IconSortAscending, IconPlus, IconEye, IconTrash } from '@tabler/icons-vue';
import Paginate from 'vuejs-paginate-next';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import VueDatePicker from '@vuepic/vue-datepicker';

const incomingGoodsStore = useIncomingGoodsStore()
const route = useRoute()
const router = useRouter()

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
  router.push({
    name: 'incomingGoods.index',
    query: {...route.query, page}
  })  
}

function deleteIncomingGoods(item){
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
        await incomingGoodsStore.deleteIncomingGoods(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'Barang berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
		const page = 1
		router.push({
			name:'incomingGoods.index',
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
})

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Tutup dropdown kalau klik di luar
const handleClickOutside = (e) => {
  if (!e.target.closest(".uk-inline")) {
    showDropdown.value = false;
  }
};

function applyFilter(){
  
}

const rows = [
  {
    fields: [
      { label: 'Nama Supplier', component: 'input', props: { type: 'text', value: 'PT Kimia Farma', disabled: true } }
    ]
  },
  {
    fields: [
      { label: 'Satuan', component: 'input', props: { type: 'text', value: 'Botol', disabled: true } },
      { label: 'Isi per Satuan', component: 'input', props: { type: 'text', value: '100 ml', disabled: true } },
      { label: 'Jumlah', component: 'input', props: { type: 'text', value: '5', disabled: true } },
    ]
  },
]
const tableItems = [
  { batch: 'B123', qty: 5, price: '20.000' },
  { batch: 'B124', qty: 3, price: '22.000' },
]
const columns2 = [
  { key: 'batch', label: 'Batch' },
  { key: 'qty', label: 'Qty' },
  { key: 'price', label: 'Harga' },
];

watch(()=> route.query.page,
  async (page)=>{

    incomingGoodsStore.pagination.currentPage = parseInt(page)    
    await incomingGoodsStore.getIncomingGoodsData(parseInt(page))
  }
)

onMounted( async () => {
  if (incomingGoodsStore.incomingGoodsItemList.length < 1){
    await incomingGoodsStore.getIncomingGoodsData()
  }
	console.log(incomingGoodsStore.incomingGoodsItemList);
	console.log(typeof incomingGoodsStore.pagination.currentPage);
	
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
        <RouterLink :to="{name: 'incomingGoods.create'}">
          <button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang Masuk</button>
        </RouterLink>
      </div>
    </div>
    
      
		<div class="uk-flex uk-overflow-auto uk-margin-small-top">
			<baseTable :columns="columns" :data="incomingGoodsStore.incomingGoodsItemList" class="table">
				<template #amount="{item}">
					<span>Rp.{{ rupiahNum(item.amount) }}</span>
				</template>
				<template #actions="{ item }">
					<button @click="incomingGoodsStore.showDetails(item)" class="uk-margin-small-right btn-edit"><IconEye :size="18"/></button>
					<button @click.stop="deleteIncomingGoods(item)" class="btn-del"><IconTrash :size="18"/></button>
				</template>
			</baseTable>
		</div> 
    <paginate
    v-model="incomingGoodsStore.pagination.currentPage"
      :page-count="incomingGoodsStore.pagination.totalPage"
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
  color: black;
}
.tet > th {
  color: black !important;
}
</style>