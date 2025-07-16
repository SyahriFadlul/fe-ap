import axios from "axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user',{
    state: () => ({
        userList: [],
        pagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
    }),
    getters:{
        userItems: (state) => state.userList,
    },
    actions:{
        async getUsers(page = 1){
            axios.get(`api/user?page=${page}`)
            .then( res => {
                this.userList = res.data
                this.pagination.currentPage = res.data.current_page
                this.pagination.perPage = res.data.per_page
                this.pagination.totalItems = res.data.total
                this.pagination.totalPage = res.data.to
                this.pagination.lastPage = res.data.last_page
                console.log(this.userList)
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