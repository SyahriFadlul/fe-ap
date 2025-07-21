import axios from "axios";
import { defineStore } from "pinia";
import debounce from "lodash.debounce";

export const useGoodsStore = defineStore('goods',{
    state: () => ({
        goodsList: [],
        pagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
        search: '',
        offset: 0,
        limit: 10,
        resGoodsQuery: [],
        searchLoading:false,
    }),
    getters:{
        goodsItems: (state) => state.goodsList,
        goodsNames(){
            let names = this.goodsList.map(item => item.name)
            
            console.log(names);
            
            return names
        },
        filtered: (state) => state.goodsList.filter(item=>item.name.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())),
        paginated(){
            return this.filtered.slice(this.offset, this.limit + this.offset)
        },
        hasNextPage(){
            const nextOffset = this.limit + this.offset
            return Boolean(this.filtered.slice(nextOffset, this.limit + nextOffset).length)
        },
        result: (state) => state.resGoodsQuery,
        sloading: (state) => state.searchLoading,
    },
    actions:{
        async getGoods(page = 1){
            axios.get(`api/goods?page=${page}`)
            .then( res => {
                this.goodsList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.to
                this.pagination.lastPage = res.data.meta.last_page
                console.log(res.data)
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

        // async getSelectSearch(query,loading){
        //     console.log(query);
            
        //     loading(true)
        //     // await axios.get(`api/goods/select?search=${query}`)
        //     // then( res => {
        //     //     console.log(res)
        //     //     this.resGoodsQuery = res.data
        //     // })
        //     // .catch(err => console.log(err))
            
        // },
        async _fetchGoodsSelect(query, loading) {
            loading(true)
            await axios.get(`/api/goods/select?search=${query}`)
            .then( res => {
                this.resGoodsQuery = res.data
            })
            .catch( err => {
                console.error(err)
            })
            .finally()
                loading(false)
        },

            // Fungsi yang dipakai oleh v-select, dibungkus debounce
        getSelectSearch: debounce(function (query, loading) {
            if (!query.length) return
            this._fetchGoodsSelect(query, loading)
        }, 350),
    },
    persist: {
        storage: localStorage
    },
})