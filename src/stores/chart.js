import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useGoodsStore } from "./goods";

export const useChartStore = defineStore("chart",()=>{    
    const goodsStore = useGoodsStore()

    const categoryDistributionOption = ref(null)

    

    function setCategoryDistributionOption(){
        const dataCat = goodsStore.categoryDistribution
        console.log(dataCat);
        
        categoryDistributionOption.value = dataCat.map(item=>({
            value: item.total,
            name: item.name,})
        )
    }

    return {
    categoryDistributionOption,
    setCategoryDistributionOption,
    }
    }, {
    persist: {
        storage: localStorage
        }
    }
)
