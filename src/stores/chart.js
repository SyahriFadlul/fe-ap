import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useGoodsStore } from "./goods";
import axios from "axios";

export const useChartStore = defineStore("chart",()=>{    
    const goodsStore = useGoodsStore()

    const categoryDistributionOption = ref(null)
    const dashboardData = ref({})

    const totalQty = computed(() => dashboardData.value.total_qty || 0)
    const currentIncomingGoods = computed(() => dashboardData.value.current_incoming_goods || 0)
    const currentOutgoingGoods = computed(() => dashboardData.value.current_outgoing_goods || 0)
    const percentageChangeIncoming = computed(() => dashboardData.value.percentage_change?.incoming || 0)
    const percentageChangeOutgoing = computed(() => dashboardData.value.percentage_change?.outgoing || 0)
    const labelsGraph = computed(() => dashboardData.value.bar_graph_data?.labels || [])
    const incomingDataGraph = computed(() => dashboardData.value.bar_graph_data?.incoming || [])
    const outgoingDataGraph = computed(() => dashboardData.value.bar_graph_data?.outgoing || [])
    const supplierChartLegend = computed(() => dashboardData.value?.supplier_stats?.legend || [])
    const supplierChartSeries = computed(() => dashboardData.value?.supplier_stats?.series || [])
    const expiringSoonCount = computed(() => dashboardData.value?.expiring_soon_count || 0)
    const goodsBelowMinStock = computed(() => dashboardData.value?.goods_below_min_stock || 0)

    function setCategoryDistributionOption(){
        const dataCat = goodsStore.categoryDistribution
        console.log(dataCat);
        
        categoryDistributionOption.value = dataCat.map(item=>({
            value: item.total,
            name: item.name,})
        )
    }

    async function fetchDashboardData() {
        await axios.get('api/dashboard-data')
        .then(res => dashboardData.value = res.data)
        .catch(err => console.log(err)
        )
        
    }

    return {
    categoryDistributionOption,
    setCategoryDistributionOption,
    dashboardData,
    fetchDashboardData,
    totalQty,
    currentIncomingGoods,
    currentOutgoingGoods,
    percentageChangeIncoming,
    percentageChangeOutgoing,
    labelsGraph,
    incomingDataGraph,
    outgoingDataGraph,
    supplierChartLegend,
    supplierChartSeries,
    expiringSoonCount,
    goodsBelowMinStock
    }
    }, {
    persist: {
        storage: localStorage
        }
    }
)
