<script setup>
import { useGoodsStore } from '@/stores/goods'
import { onMounted, ref, watch } from 'vue'
import baseTable from '../../components/baseTable.vue'
import Paginate from 'vuejs-paginate-next';
import { IconDownload, IconBox, IconPlus } from '@tabler/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts' 
import { CountTo } from 'vue3-count-to';
import debounce from 'lodash.debounce';

const goodsStore = useGoodsStore()

const page = 10

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
    // top: '5%',
    // left: 'center',
    show: false,
  },
  series: [
    {
      name: 'Access From',
      bottom: '80%',
      type: 'pie',
      height:'50%',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
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
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
});

// function onClickHandler(page) {
//     console.log(page)
// }

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
  await goodsStore.getGoods(page)  
}

const currentPage = ref(1);

onMounted( async ()=>{
  if(goodsStore.goodsItems.length < 1){
    await goodsStore.getGoods()
  }
    
})
</script>
<template>
  <div class="main-goods uk-background-muted">
    <div class="uk-flex">
      <div class="info-card uk-margin-medium-right uk-background-default">
        <div class="info-ttl">Total jenis barang</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="5000" :duration="1000" separator="" /></div>
          <IconBox :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
      </div>                
      <div class="info-card">
        <v-chart class="chart" :option="option" style="width: 100px; height: 50px !important;" />
      </div>
    </div>
    <hr class="uk-divider uk-margin-small">
    <div class="uk-flex uk-margin-small-top">
      <div class="">
        <input type="text" class="search uk-text-italic" placeholder="Cari barang..." v-model="goodsStore.searchQuery">
      </div>
      <div class="uk-margin-auto-left">
        <RouterLink :to="{name: 'createGoods'}">
          <button class="btn-add uk-flex uk-flex-middle"><icon-plus :size="18"/>Barang</button>
        </RouterLink>
      </div>
    </div>

    <div class="uk-overflow-auto uk-flex">      
      <baseTable :columns="columns" :data="goodsStore.goodsItems" class="table">
        <template #actions="{ item }">
          <button @click="edit(item)" class="">Edit</button>
          <button @click="remove(item)" class="">Hapus</button>
        </template>
      </baseTable>
    </div>

    <paginate
      v-model="page"
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

/* .page-item {
} */
</style>