import axios from "axios";
import { defineStore } from "pinia";

export const useUnitStore = defineStore('unit',{
    state: () => ({
        unitList: [],
    }),
    getters:{
        unitItems: (state) => state.unitList,
    },
    actions:{
        async getUnits(){
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
        }
    },
    persist: {
        storage: localStorage
    },
})