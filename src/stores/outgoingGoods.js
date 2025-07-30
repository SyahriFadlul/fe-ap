import axios from "axios";
import { defineStore } from "pinia";

export const useOutgoingGoodsStore = defineStore('outgoingGoods',{
    state: () => ({
        outgoingGoodsList: [],
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
        selectedOutgoingGoodsItems: null,//vue select
        selectedOutgoingGoodsBatch: null,//vue select
        selectedOutgoingGoods:{ 
            id: null,
            name: '',
            batch_number: '',
            qty: 1,
            unit_id: null,
            unit_price: null,
        },
        outgoingGoodsForm: {
            date: null,
            transc_type: null,
            note: '',
            items: [], // cart/form
        },
        editingTempId: null,
    }),
    getters:{
        outgoingGoodsItemList: (state) => state.outgoingGoodsList,
        paginatedCart(state){
            const start = (state.cartPagination.currentPage - 1) * state.cartPagination.perPage;
            const end = start + state.cartPagination.perPage;
            return state.outgoingGoodsForm.items.slice(start, end);
        },
        cartTotalPage: (state) => Math.ceil(state.outgoingGoodsForm.items.length / state.cartPagination.perPage),
        totalAmount(state){
            console.log(state.outgoingGoodsForm.items);
            
            return state.outgoingGoodsForm.items.reduce((sum, item) => {
                return sum + (item.qty * item.unit_price)}, 0)
        },
        isEditing: (state) => state.editingTempId !== null,
    },
    actions:{        
        async fetchOutgoingGoods(){
            axios.get('api/outgoing-goods')
            .then( (res) => {       
                console.log(res.data.data)                
                this.outgoingGoodsList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.last_page
                this.pagination.lastPage = res.data.meta.last_page
            })
            .catch( err => console.log(err))            
        },
        async createOutgoingGoods(){
            const data = this.outgoingGoodsForm
            console.log(this.totalAmount);
            
            await axios.post('api/outgoing-goods', {
                date: data.date,
                note: data.note,
                transc_type: data.transc_type,
                amount: this.totalAmount,
                items: data.items,
            }).then(res => console.log(res)
            )
            .catch(err => {
                console.log(err);
                
                if(err.status === 500){
                    throw 'Terjadi kesalahan saat menyimpan transaksi. Coba lagi nanti.'
                }                
                throw err
            })
        },
        addItemToCart() {
            console.log(this.selectedOutgoingGoods);
            console.log(this.selectedOutgoingGoodsItems);
            console.log(this.selectedOutgoingGoodsBatch);
            console.log(this.outgoingGoodsForm);
            
            const data = {
                ...this.selectedOutgoingGoods,
                id: this.selectedOutgoingGoodsItems.id, //vue-select
                name: this.selectedOutgoingGoodsItems.name,
                batch_id: this.selectedOutgoingGoodsBatch.id,
                batch_number: this.selectedOutgoingGoodsBatch.batch_number,
            }               
            console.log(data);                     
            this.outgoingGoodsForm.items.push({
                ...data,
                tempId: `${Date.now()} - ${Math.random().toString(36).substring(2,5)}`
            })
            console.log(this.outgoingGoodsForm);
            
            
            this.clearCurrentItem()
        },
        editItemFromCart(item) { //item = outgoinggoodsform
            console.log('data:');
            
            console.log(item);
            const{id, name, batch_id, batch_number, tempId,...rest} = item
            this.selectedOutgoingGoodsItems = {id, name}
            this.selectedOutgoingGoodsBatch = {batch_id, batch_number}
            this.selectedOutgoingGoods = { ...rest} // isi form
            this.editingTempId = item.tempId
        },
        saveEditedItemToCart() {
            const index = this.outgoingGoodsForm.items.findIndex(item => item.tempId === this.editingTempId)
            if (index !== -1) {
                this.outgoingGoodsForm.items.splice(index, 1, {
                ...this.selectedOutgoingGoods,
                id: this.selectedOutgoingGoodsItems.id,
                name: this.selectedOutgoingGoodsItems.name,
                batch_id: this.selectedOutgoingGoodsBatch.id,
                batch_number: this.selectedOutgoingGoodsBatch.batch_number,
                tempId: this.editingTempId,
                })
            }
            this.editingTempId = null
            this.clearCurrentItem()
        },
        removeItemFromCart(data) {            
            console.log(data);
                        
            if (this.editingTempId === data.tempId) {
                this.clearCurrentItem()
                this.editingTempId = null
            }   
            this.outgoingGoodsForm.items = this.outgoingGoodsForm.items.filter(item => item.tempId !== data.tempId)
        },
        setCartPage(page) {
            this.cartPagination.currentPage = page
        },
        clearCurrentItem(){
            this.selectedOutgoingGoods = {
                id: null,
                name: '',
                batch_number: '',
                qty: 1,
                unit_id: null,
                unit_price: null,
            }
            this.selectedOutgoingGoodsItems = null
            this.selectedOutgoingGoodsBatch = null
        },
        clearCart(){ //hapus data di table
            this.outgoingGoodsForm = {
                transc_type: '',
                date: null,
                note: '',
                items: [],
            }
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
    },
    persist: {
        storage: localStorage
    },
})