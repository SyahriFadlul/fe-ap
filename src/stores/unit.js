import axios from "axios";
import { defineStore } from "pinia";
import {useOutgoingGoodsStore} from './outgoingGoods';

export const useUnitStore = defineStore('unit',{
    state: () => ({
        unitList: [],
        unitsGoods: [],
        selectedUnitPrice: null,
        conversions: {
            medium : null,
            large : null,
        }
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

                this.selectedUnitPrice = res.data.batches[0].selling_price
                console.log(res.data.batches[0].selling_price);
                this.conversions.medium = res.data.conversion_medium_to_base
                this.conversions.large = res.data.conversion_large_to_medium
                
                // console.log(this.unitsGoods)
            })
            .catch( err => console.log(err))
        },
        async getUnitPrice(id){
            const outgoingGoodsStore = useOutgoingGoodsStore()
            const priceDefault = this.selectedUnitPrice || 0
            console.log(priceDefault);
            
            const selectedUnit = this.unitsGoods.find(unit => unit.id === outgoingGoodsStore.selectedOutgoingGoods.unit_id);
            console.log(selectedUnit.status);
            
            if(selectedUnit.status === 'large'){ 
                // outgoingGoodsStore.selectedOutgoingGoods.unit_price = 
                outgoingGoodsStore.selectedOutgoingGoods.unit_price = priceDefault * this.conversions.medium * this.conversions.large
                // log
                return;
            }
            else if(selectedUnit.status === 'medium'){
                outgoingGoodsStore.selectedOutgoingGoods.unit_price = priceDefault * this.conversions.medium
                return;
            }
            else {
                outgoingGoodsStore.selectedOutgoingGoods.unit_price = priceDefault
                return;
            }
            console.log(selectedUnit);
            // console.log(selectedUnit);
            
            
            outgoingGoodsStore.selectedOutgoingGoods.unit_price = this.selectedUnitPrice
            
            // if (selectedUnit) {
            //     selectedUnitPrice = selectedUnit.price
            // } else {
            //     selectedUnitPrice = null
            // }
        }
    },
    persist: {
        storage: localStorage
    },
})