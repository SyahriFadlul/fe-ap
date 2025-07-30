import axios from "axios";
import { defineStore } from "pinia";

export const useUnitStore = defineStore('unit',{
    state: () => ({
        unitList: [],
        unitsGoods: [],
    }),
    getters:{
        unitItems: (state) => state.unitList,
    },
    actions:{
        async fetchUnits(){
            axios.get('api/unit')
            .then( res => {
                this.unitList = res.data
                console.log(this.unitList)
            })
            .catch( err => console.log(err)
            )
        },
        async getIncomingGoodsData(){
            axios.get('api/incoming-goods')
            .then( res => console.log(res.data))
            .catch( err => console.log(err))            
        },
        async fetchGoodsUnit(id){
            await axios.get(`api/goods/${id}/unit`)
            .then( res => {
                this.unitsGoods = this.unitList.filter(item => item.id === res.data.base_unit_id ||
                    item.id === res.data.medium_unit_id ||  item.id === res.data.large_unit_id)
                
                console.log(this.unitsGoods)
            })
            .catch( err => console.log(err))
        }
    },
    persist: {
        storage: localStorage
    },
})