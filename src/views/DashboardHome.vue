<script setup>
import { useGoodsStore } from '@/stores/goods';
import { onMounted, ref, provide } from 'vue';
import { IconBox, IconPackageImport, IconPackageExport, IconHourglassLow, IconAlertTriangle } from '@tabler/icons-vue'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent, TooltipComponent, LegendComponent,
  DatasetComponent, GridComponent, MarkLineComponent, MarkPointComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { CountTo } from 'vue3-count-to';
import { useSettingStore } from '@/stores/setting';
import { useAuthStore } from '@/stores/auth';
import { useChartStore } from '@/stores/chart';

const goodsStore = useGoodsStore()
const link = import.meta.env.VITE_API_BASE_URL
const isVisible = ref(true)
const settingStore = useSettingStore()
const authStore =useAuthStore()
const chartStore = useChartStore()

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  DatasetComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
  LegendComponent,
]);

// provide(THEME_KEY, "dark");

const option = ref({
  title: {
    text: "Analisis Supplier Barang Masuk",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    top:40,
    data: chartStore.supplierChartLegend || [],
  },
  series: [
    {
      name: "Barang Masuk",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: chartStore.supplierChartSeries || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
});

function getMarkPointData(seriesData) {
  const maxValue = Math.max(...seriesData);
  const minValue = Math.min(...seriesData);
  const maxIndex = seriesData.indexOf(maxValue);
  const minIndex = seriesData.indexOf(minValue);

  return [
    { name: 'Max', value: maxValue, xAxis: maxIndex, yAxis: maxValue },
    { name: 'Min', value: minValue, xAxis: minIndex, yAxis: minValue }
  ];
}

const option2 = {
  title: {
    text: 'Analisis Barang Masuk vs Barang Keluar',
    left:'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Barang Masuk', 'Barang Keluar'],
    bottom: 1,
  },
  // toolbox: {
  //   show: true,
  //   feature: {
  //     dataView: { show: true, readOnly: false },
  //     magicType: { show: true, type: ['line', 'bar'] },
  //     restore: { show: true },
  //     saveAsImage: { show: true }
  //   }
  // },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      // prettier-ignore
      data: chartStore.labelsGraph
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Barang Masuk',
      type: 'bar',
      data: chartStore.incomingDataGraph,
      markPoint: { data: getMarkPointData(chartStore.incomingDataGraph) },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    },
    {
      name: 'Barang Keluar',
      type: 'bar',
      data: chartStore.outgoingDataGraph,
      markPoint: { data: getMarkPointData(chartStore.outgoingDataGraph) },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    }
  ]
};


onMounted( async () => {
    // await authStore.getUser()
    await chartStore.fetchDashboardData();
})
</script>
<template>
  <div class="" v-if="chartStore.dashboardData">
    <div class="uk-flex uk-flex-between">
      <div class="info-card">
        <div class="info-ttl">Total stok</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="chartStore.totalQty" :duration="1000" separator="" /></div>
          <IconBox :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">tablet/kaplet/kapsul</span>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang masuk</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="chartStore.currentIncomingGoods" :duration="1000" separator="" /></div>
          <IconPackageImport :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <div>
          <span class="info-desc">vs bulan lalu</span>
          <span class="info-desc" 
          :style="chartStore.percentageChangeIncoming > 0 ? { color: '#27ae60' } : { color: '#e74c3c' }"> 
            {{ chartStore.percentageChangeIncoming }}%
          </span>
        </div>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang keluar</div>
        <div class="uk-flex uk-flex-between uk-text-center">
          <div class="info-num"><CountTo :endVal="chartStore.currentOutgoingGoods" :duration="1000" separator="" /></div>
          <IconPackageExport :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">vs bulan lalu</span>
        <span class="info-desc" 
          :style="chartStore.percentageChangeOutgoing > 0 ? { color: '#27ae60' } : { color: '#e74c3c' }"> 
          {{ chartStore.percentageChangeOutgoing }}%
        </span>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang Mendekati Kedaluwarsa</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="chartStore.expiringSoonCount" :duration="1000" separator="" /></div>
          <IconHourglassLow :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">dalam 30 hari kedepan</span>
      </div>                
    </div>
    <!-- <div class="info-card uk-margin-top">
      <div class="info-ttl">Jumlah Barang Stok Rendah</div>
      <div class="uk-flex uk-flex-between">
        <div class="info-num"><CountTo :endVal="chartStore.expiringSoonCount" :duration="1000" separator="" /></div>
        <IconAlertTriangle :size="52" :stroke-width="1.2" class="info-img"/>
      </div>
      <span class="info-desc">dalam 30 hari kedepan</span>
    </div>                 -->
    <div class="uk-flex uk-margin-medium-top uk-flex-between">
        <div class="card uk-margin-small-right">
          <v-chart class="chart" :option="option2"/>
        </div>
        <div class="card uk-margin-small-left" style="">
          <v-chart class="chart" :option="option" />  
        </div>
    </div>
    <!-- <div class="uk-child-1-2" style="height: 500px;" uk-grid>
      <div class="uk-width-1-2" style="height: 500px;">
        <v-chart class="chart" :option="option2" />
      </div>
      <div class="uk-width-1-2" style="height: 500px;">
        <v-chart class="chart" :option="option" />  
      </div>
    </div> -->
  </div>
</template>
<style  scoped>
.first-sect {
    
  border-radius: 10px;

}

.info-card {
  background-color: white;
  border: 1px solid rgb(241, 226, 226);
  border-radius: 15px;
  padding: 20px;
  width: 254px;
  height: 140px;
  justify-content: center;
}

.info-ttl {
  font-size: 14px;
  margin: 0;
  padding: 0;
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

.info-desc {
  font-size: 12px;
  font-weight: 500;
}

.body-info {
  display: flex;
  align-items: baseline;
}

.card {
  border-radius: 15px;
  padding: 10px;
  width: 50%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%; /* atau sesuaikan tinggi ideal */
}

.note-info {
  margin-left: 2px;
  font-size: 12px;
}

</style>