<script setup>
import { useGoodsStore } from '@/stores/goods';
import { onMounted, ref, provide } from 'vue';
import { IconBox, IconPackageImport, IconPackageExport, IconHourglassLow } from '@tabler/icons-vue'
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

const goodsStore = useGoodsStore()
const link = import.meta.env.VITE_API_BASE_URL
const isVisible = ref(true)
const settingStore = useSettingStore()
const authStore =useAuthStore()

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
    data: ["PT. Combi Putra", "PT. Nara Artha", "Kudamas"]
  },
  series: [
    {
      name: "Barang Masuk",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: [
        { value: 335, name: "PT. Combi Putra" },
        { value: 310, name: "PT. Nara Artha" },
        { value: 234, name: "Kudamas"},
      ],
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
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
      data: [
        2, 4, 7, 23, 25, 76, 135, 162, 32, 20, 6, 3
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    },
    {
      name: 'Barang Keluar',
      type: 'bar',
      data: [
        2, 5, 9, 26, 28, 70, 175, 182, 48, 18, 6, 2
      ],
      markPoint: {
        data: [
          { name: 'Max', value: 182, xAxis: 7, yAxis: 183 },
          { name: 'Min', value: 2, xAxis: 11, yAxis: 3 }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    }
  ]
};


onMounted( async () => {
    // await authStore.getUser()
})
</script>
<template>
  <div class="">
    <div class="uk-flex uk-flex-between">
      <div class="info-card">
        <div class="info-ttl">Total stok</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="1300" :duration="1000" separator="" /></div>
          <IconBox :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">strip/blister/tube</span>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang masuk</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="150" :duration="1000" separator="" /></div>
          <IconPackageImport :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <div>
          <span class="info-desc">vs bulan lalu</span>
          <span class="info-desc" style="color: #27ae60;font-weight: 500;"> +10%</span>
        </div>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang keluar</div>
        <div class="uk-flex uk-flex-between uk-text-center">
          <div class="info-num"><CountTo :endVal="80" :duration="1000" separator="" /></div>
          <IconPackageExport :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">vs bulan lalu</span>
        <span class="info-desc" style="color: #e74c3c;font-weight: 500;"> -10%</span>
      </div>                
      <div class="info-card">
        <div class="info-ttl">Barang Mendekati Kedaluwarsa</div>
        <div class="uk-flex uk-flex-between">
          <div class="info-num"><CountTo :endVal="0" :duration="1000" separator="" /></div>
          <IconHourglassLow :size="52" :stroke-width="1.2" class="info-img"/>
        </div>
        <span class="info-desc">dalam 30 hari kedepan</span>
      </div>                
    </div>
    <div class="uk-flex uk-margin-medium-top uk-flex-between">
        <div class="card uk-margin-small-right">
          <v-chart class="chart" :option="option2"/>
        </div>
        <div class="card uk-margin-small-left" style="">
          <v-chart class="chart" :option="option" />  
        </div>
    </div>
    <div class="uk-child-1-2" style="height: 500px;" uk-grid>
      <div class="uk-width-1-2" style="height: 500px;">
        <v-chart class="chart" :option="option2" />
      </div>
      <div class="uk-width-1-2" style="height: 500px;">
        <v-chart class="chart" :option="option" />  
      </div>
    </div>
    <button @click="settingStore.toggleSidebar">Toggle</button>

  <div v-show="settingStore.isSidebarOpen" style="background: lightblue; padding: 20px;">
    Hello Sidebar
  </div>
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