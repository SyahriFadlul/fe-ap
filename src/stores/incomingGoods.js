import axios from "axios";
import { defineStore } from "pinia";
import { useGoodsStore } from "./goods";

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
        cartPagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
        selectedIncomingGoods:{
            id: '',
            name: '',
            supplier_id: '',
            batch_number: '',
            qty: '',
            unit_id: '',
            price_per_line: '',
            expiry_date: '',
        },
        incomingGoodsCart:[],
    }),
    getters:{
        incomingGoodsItemList: (state) => state.incomingGoodsList,
        selectedItem: (state) => state.selectedIncomingGoods,
        paginatedCart(state){
            const start = (state.cartPagination.currentPage - 1) * state.cartPagination.perPage;
            const end = start + state.cartPagination.perPage;
            return state.incomingGoodsCart.slice(start, end);
        },
        cartTotalPage: (state) => Math.ceil(state.incomingGoodsCart.length / state.cartPagination.perPage),
        selectedCartItemId: (state) => state.selectedIncomingGoods.id,
        selectedCartItemName: (state) => state.selectedIncomingGoods.name,
        selectedCartItemSupplier: (state) => state.selectedIncomingGoods.supplier_id,
        selectedCartItemBatchNumber: (state) => state.selectedIncomingGoods.batch_number,
        selectedCartItemQty: (state) => state.selectedIncomingGoods.qty,
        selectedCartItemUnit: (state) => state.selectedIncomingGoods.unit_id,
        selectedCartItemPrice: (state) => state.selectedIncomingGoods.price_per_line,
        selectedCartItemExpiryDate: (state) => state.selectedIncomingGoods.expiry_date,
        btnAbleToAdd(state){
            const keysToCompare = ['id', 'supplier_id', 'batch_number']
            return state.incomingGoodsCart.some(item =>
                keysToCompare.every(key => 
                    item[key] === state.selectedIncomingGoods[key]
                )
            )
        }
    },
    actions:{        
        async getIncomingGoodsData(){
            axios.get('api/incoming-goods')
            .then( (res) => {       
                console.log(res.data.data)                
                this.incomingGoodsList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.to
                this.pagination.lastPage = res.data.meta.last_page
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
        showDetails(item){
            this.incomingGoodsItemList = item
        },
        btnAddItemToCart(data,details){
            const goodsStore = useGoodsStore()
            goodsStore.resGoodsQuery = []
            console.log(data);
            console.log(details);
            const exists = this.incomingGoodsCart.some( item =>
                item.id === this.selectedIncomingGoods.id &&
                item.supplier_id === this.selectedIncomingGoods.supplier_id ||
                item.batch_number === this.selectedIncomingGoods.batch_number 
            )
            if(!exists){
                this.incomingGoodsCart.push(this.selectedIncomingGoods)
                this.selectedIncomingGoods = []
            }
            // const exists = this.incomingGoodsCart.some( item =>
            //     item.id === data.id &&
            //     item.supplier_id === details.supplier_id &&
            //     item.batch_number === details.batch_number 
            // )
            // if(!exists){
            //     this.incomingGoodsCart.push({
            //         ...data,
            //         ...details
            //     })
            // }
        },
        setCartPage(page) {
            this.cartPagination.currentPage = page
        },
    },
    persist: {
        storage: localStorage
    },
})