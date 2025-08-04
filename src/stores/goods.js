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
        selectedGoods:[],
        total_stock: 0,
        search: '',
        offset: 0,
        limit: 10,
        resGoodsQuery: [],
        searchLoading:  false,
        errors: [],
        categoryDistribution: [],
        currentItemBatches:[],
        goodsBatches: [],
        batchPagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
        editing: false, //buat halaman detail barang
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
        error: (state) => state.errors,
        totalStock: (state) => state.total_stock,
        inStockVueSelect(state){ //untuk page.outgoinggoods
            const batches = state.currentItemBatches?.batches || []
            const availableBatches = batches.filter(item => item.qty > 0)
            console.log(batches);
            
            return availableBatches
        }
    },
    actions:{
        async fetchGoods(page = 1){
            this.categoryDistribution = []
            this.goodsList = []
            
            axios.get(`api/goods?page=${page}`)
            .then( res => {
                this.goodsList = res.data.data
                this.pagination.currentPage = res.data.meta.pagination.current_page
                this.pagination.perPage = res.data.meta.pagination.per_page
                this.pagination.totalItems = res.data.meta.pagination.total
                this.pagination.totalPage = res.data.meta.pagination.last_page
                this.pagination.lastPage = res.data.meta.pagination.last_page
                this.total_stock = res.data.meta.total_stock
                this.categoryDistribution = res.data.meta.category_distribution
                console.log(res.data)
            })
            .catch( err => console.log(err)
            )
        },
        async createGoods(data){
            this.errors = []
            await axios.post('api/goods', {
                name: data.name,
                category_id: data.category_id,
                base_unit_id: data.base_unit_id,
                medium_unit_id: data.medium_unit_id,
                large_unit_id: data.large_unit_id,
                conversion_medium_to_base: data.conversion_medium_to_base,
                conversion_large_to_medium: data.conversion_large_to_medium,
                shelf_location: data.shelf_location,
            })
            .then( async () =>{
                this.UIkit.notification({
                    message: 'Barang berhasil ditambahkan!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                }) 
                this.router.push('/goods')
                await this.fetchGoods()
            })
            .catch( err =>{ 
                if(err.status === 422){
                    this.errors = err.response.data.errors
                    console.log(this.errors.name[0]);       
                }
                console.log(err.message);
                
            })
        },
        async detailGoods(data){
            this.selectedGoods = data
            console.log(data);
            if(this.currentItemBatches.id !== data.id){
                await this.fetchCurrentItemBatches(data.id)
            }
            this.router.push({
                name:'goods.detail',
                params:{id:data.id}
            })
        },
        async editGoods(){
            this.editing = true
        },
        async updateGoods(data){
            await axios.put(`api/goods/${this.selectedGoods.id}`, data)
            .then(async res => {
                await this.fetchGoods()
                console.log(res.status)
                
            })
            .catch( err => {throw err})
        },
        async deleteGoods(id){
            await axios.delete(`api/goods/${id}`)
            .then( res => {
                const page = 1
                this.router.push({
                    name: 'goods.index',
                    query: {...this.route.query, page}
                })
                
            })
            .catch( err => {throw err})
        },
        async fetchCurrentItemBatches(id,isFifo){
            await axios.post(`api/goods/${id}/batches`, {
                fifo:isFifo
            })
            .then( res => {
                this.currentItemBatches= res.data
                console.log(res.data)}
            )
            .catch( err => console.log(err))
        },
        async fetchGoodsBatches(){
            await axios.get('api/goods-batches')
            .then( res => {
                this.goodsBatches = res.data.data
                this.batchPagination.currentPage = res.data.meta.current_page
                this.batchPagination.perPage = res.data.meta.per_page
                this.batchPagination.totalItems = res.data.meta.total
                this.batchPagination.totalPage = res.data.meta.last_page
                this.batchPagination.lastPage = res.data.meta.last_page
                console.log(res)}
            )
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

            // v-select search,
        getSelectSearch: debounce(function (query, loading) {
            if (!query.length) return
            this._fetchGoodsSelect(query, loading)
        }, 350),
    },
    persist: {
        storage: localStorage
    },
})