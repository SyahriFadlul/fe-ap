<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, watch } from 'vue'
import baseTable from '../../components/baseTable.vue'
import Paginate from 'vuejs-paginate-next';
import {  IconSortAscending, IconFilter, IconBox, IconPlus, IconEye, IconTrash } from '@tabler/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts' 
import { CountTo } from 'vue3-count-to';
import debounce from 'lodash.debounce';
import { useRoute, useRouter } from 'vue-router';
import { useChartStore } from '@/stores/chart';
import Swal from 'sweetalert2';


const goodsStore = useGoodsStore()
const chartStore = useChartStore()
const route = useRoute()
const router = useRouter()

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const option = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    center: '5%',
    left: 'right',
    show: false,
    orient: 'vertical'
  },
  series: [
    {
      name: 'Distribusi Kategori',
      bottom: '80%',
      type: 'pie',
      height:'100%',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: chartStore.categoryDistributionOption
    }
  ]
});

function deleteGoods(item){
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: `Barang: ${item.name}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await goodsStore.deleteGoods(item.id)
        Swal.fire({
          title: 'Dihapus!',
          text: 'Barang berhasil dihapus.',
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
  { key: 'name', label: 'Nama Barang' },
  { key: 'category', label: 'Kategori' },
  { key: 'medium_unit', label: 'Satuan' },
  { key: 'qty', label: 'Stok' },
  // { key: 'price', label: 'Harga' },
  { key: 'shelf_location', label: 'Nomor Rak' },
];

// changePage(page)
async function clickCallback(page){
  router.push({
    name: 'goods.index',
    query: {...route.query, page}
  })  
}

watch(()=> goodsStore.categoryDistribution,
    (newVal)=> {
        chartStore.categoryDistributionOption = newVal.map(item =>({
        name : item.category,
        value : item.total
        }))
    }
)

const goodsQuery = ref('')

watch(goodsQuery, async (newVal) => {
  console.log(newVal);
  
  if(newVal === ''){
    let page = 1
    if(parseInt(route.query.page) !== 1){
      router.push({ name: 'goods.index', query: { ...route.query, page } })
      return
    }
    await goodsStore.fetchGoods(page)
  }
})

watch(()=> route.query.page,
  async (page)=>{
    goodsStore.pagination.currentPage = page    
    await goodsStore.fetchGoods(page)
  }
)

onMounted( async ()=>{
  if(goodsStore.goodsItems.length < 1){
    await goodsStore.fetchGoods(1)
  }
  chartStore.setCategoryDistributionOption()
//     Swal.fire({
//   title: 'Error!',
//   text: 'Do you want to continue',
//   icon: 'error',
//   confirmButtonText: 'Cool'
// })
})
</script>
<template>
  <div class="main-goods">
    <div class="uk-flex">
      <div class="info-card uk-margin-medium-right uk-background-default">
        <div class="info-ttl">Total jenis barang</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="goodsStore.pagination.totalItems" :duration="1000" separator="" /></div>
          <IconBox :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
      </div>                
      <div class="info-card chart-card">
        Distribusi Kategori
        <v-chart class="chart" :option="option"/>
      </div>
    </div>
    <hr class="uk-divider uk-margin-small">
    <div class="uk-flex uk-margin-small-top">
      <div class="">
        <input type="text" class="search uk-text-italic" placeholder="Cari barang..." v-model="goodsQuery" 
        @input="(e)=> {
          goodsStore.getGoodsSearch(e.target.value)
          goodsQuery = e.target.value
          }
        ">
      </div>
      <!-- <div class="uk-margin-medium-left">
				<button class="btn-fs uk-margin-small-right"><icon-filter :size="18"/></button>
				<button class="btn-fs"><icon-sort-ascending :size="18"/></button>
			</div> -->
      <div class="uk-margin-auto-left">
        <RouterLink :to="{name: 'goods.create'}">
          <button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang</button>
        </RouterLink>
      </div>
    </div>

    <div class="uk-overflow-auto uk-flex">      
      <baseTable :columns="columns" :data="goodsStore.goodsItems" class="table">
        <template #actions="{ item }">
          <button @click="goodsStore.detailGoods(item)" class="uk-margin-small-right btn-edit" uk-tooltip="Lihat Detail Item"><IconEye :size="18"/></button>
					<button @click="deleteGoods(item)" class="btn-del" uk-tooltip="Hapus Item"><IconTrash :size="18"/></button>
        </template>
      </baseTable>
    </div>

    <paginate
      v-model="goodsStore.pagination.currentPage"
      :page-count="goodsStore.pagination.totalPage"
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


<style scoped>
.main-goods{
  background-color: #F0F9FF;
}
.table {
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

.info-card {
  background-color: white;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 15px;
  padding: 20px;
  width: 254px;
  height: 120px;
  justify-content: center;
}

.chart-card {
  padding: 10px;
  width: 254px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 50%; 
}

.info-num {
  font-size: 28px;
  align-self: center;
}

.info-img {
  color: #5D87FF;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background-color: #EEF3FF;
}

.btn-add {
	border: none;
	padding: 8px;
	border-radius: 8px;
	background-color: #5983F6;
	color: #f0f0ff;
	font-size: 15px;
}

.search {
  width: 250px;
  font-size: 14px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.btn-fs {
	border: 1px solid #ccc;
  border-radius: 5px;
  color: #5f27cd;
  background-color: #f0f0f5 !important;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-fs:hover {
  background-color: #d6c4ee !important;
  border-color: #b89bdd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


/* .page-item {
} */
</style>