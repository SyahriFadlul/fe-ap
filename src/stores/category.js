import axios from "axios";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore('category',{
    state: () => ({
        categoryList: [],
        pagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
    }),
    getters:{
        categoryItems: (state) => state.categoryList,
    },
    actions:{
        async getCategories(page = 1){
            axios.get(`api/category?page=${page}`)
            .then( res => {
                this.categoryList = res.data.data
                this.pagination.currentPage = res.data.current_page
                this.pagination.perPage = res.data.per_page
                this.pagination.totalItems = res.data.total
                this.pagination.totalPage = res.data.to
                this.pagination.lastPage = res.data.last_page
                console.log(this.categoryList)
            })
            .catch( err => console.log(err)
            )
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

        async getIncomingGoodsData(){
            axios.get('api/incoming-goods')
            .then( res => console.log(res.data))
            .catch( err => console.log(err))            
        }
    }
})