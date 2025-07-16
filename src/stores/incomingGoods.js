import axios from "axios";
import { defineStore } from "pinia";

export const useIncomingGoodsStore = defineStore('incomingGoods',{
    state: () => ({
        incomingGoodsList: [],
        pagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
    }),
    getters:{
        incomingGoodsItemList: (state) => state.incomingGoodsList,
    },
    actions:{        
        async getIncomingGoodsData(){
            axios.get('api/incoming-goods')
            .then( (res) => {       
                console.log(res.data.data)                
                this.incomingGoodsList = res.data.data
                this.pagination.currentPage = res.data.current_page
                this.pagination.perPage = res.data.per_page
                this.pagination.totalItems = res.data.total
                this.pagination.totalPage = res.data.to
                this.pagination.lastPage = res.data.last_page
            })
            .catch( err => console.log(err))            
        },
        async downloadGoods(){
            axios.get('api/goods/get-pdf', {
                params: {
                    stock_min: 20,
                }
            })
            .then( res => {
                console.log(res)                
                // const url = window.URL.createObjectURL(new Blob([res.data]));
                // const link = document.createElement('a');
                // link.href = url;
                // link.setAttribute('download', `goods_${id}.zip`);
                // document.body.appendChild(link);
                // link.click();
            })
            .catch( err => console.log(err))
        },
    }
})