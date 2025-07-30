import axios from "axios";
import { defineStore } from "pinia";
import { useGoodsStore } from "./goods";
import { data } from "uikit";

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
        selectedIncomingGoodsItems: null,//vue select
        selectedIncomingGoods:{ 
            goods_id: null,
            goods: '',
            batch_number: '',
            qty: 1,
            conversion_qty: 1,
            unit_id: null,
            unit_price: null,
            expiry_date: null,
        },
        incomingGoodsCart:[],
        incomingGoodsForm: {
            id: null,
            invoice: '',
            supplier_id: null,
            received_date: '',
            items: [], // atau incomingGoodsCart
        },
        editingTempId: null,
        editing: false, //untuk halaman detail/edit incoming goods
        errors:[],
    }),
    getters:{
        incomingGoodsItemList: (state) => state.incomingGoodsList,
        selectedItem: (state) => state.selectedIncomingGoods,
        paginatedCart(state){
            const start = (state.cartPagination.currentPage - 1) * state.cartPagination.perPage;
            const end = start + state.cartPagination.perPage;
            return state.incomingGoodsForm.items.slice(start, end);
        },
        cartTotalPage: (state) => Math.ceil(state.incomingGoodsForm.items.length / state.cartPagination.perPage),
        selectedCartItemId: (state) => state.selectedIncomingGoods.id,
        selectedCartItemName: (state) => state.selectedIncomingGoods.name,
        selectedCartItemSupplier: (state) => state.selectedIncomingGoods.supplier_id,
        selectedCartItemBatchNumber: (state) => state.selectedIncomingGoods.batch_number,
        selectedCartItemQty: (state) => state.selectedIncomingGoods.qty,
        selectedCartItemUnit: (state) => state.selectedIncomingGoods.unit_id,
        selectedCartItemPrice: (state) => state.selectedIncomingGoods.unit_price,
        selectedCartItemExpiryDate: (state) => state.selectedIncomingGoods.expiry_date,
        btnAbleToAdd(state){
            const keysToCompare = ['id', 'supplier_id', 'batch_number']
            return state.incomingGoodsCart.some(item =>
                keysToCompare.every(key => 
                    item[key] === state.selectedIncomingGoods[key]
                )
            )
        },
        totalAmount(state){
            // console.log(state.incomingGoodsForm.items.reduce((sum, item) => {
            //     return sum + (item.qty * item.unit_price)
            // },0));
            console.log(state.incomingGoodsForm.items);
            
            return state.incomingGoodsForm.items.reduce((sum, item) => {
                return sum + (item.qty * item.unit_price)}, 0)
        },
        isEditing: (state) => state.editingTempId !== null,
    },
    actions:{        
        async getIncomingGoodsData(page = 1){
            axios.get(`api/incoming-goods?page=${page}`)
            .then( (res) => {       
                console.log(res.data.data)                
                this.incomingGoodsList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.last_page
                this.pagination.lastPage = res.data.meta.last_page
            })
            .catch( err => console.log(err))            
        },
        async createIncomingGoods(){
            const data = this.incomingGoodsForm
            console.log(this.totalAmount);
            
            await axios.post('api/incoming-goods', {
                supplier_id: data.supplier_id,
                invoice: data.invoice,
                received_date: data.received_date,
                amount: this.totalAmount,
                items: data.items,
            }).then(res => console.log(res.statusText)
            )
            .catch(err => {
                if(err.status === 500){
                    throw 'Terjadi kesalahan saat menyimpan transaksi. Coba lagi nanti.'
                }                
                throw err
            })
        },
        async updateIncomingGoods(){
            const data = this.incomingGoodsForm
            console.log(this.totalAmount);
            
            await axios.put(`api/incoming-goods/${this.incomingGoodsForm.id}`, {
                supplier_id: data.supplier_id,
                invoice: data.invoice,
                received_date: data.received_date,
                amount: this.totalAmount,
                items: data.items,
            }).then(res => console.log(res)
            )
            .catch(err => {
                console.log(err);
                
                if(err.status === 500){
                    throw 'Terjadi kesalahan saat merubah transaksi. Coba lagi nanti.'
                }
                if(err.response && err.response.status === 422){
                    this.errors = err.response.data.error
                }
                throw err
            })
        },
        async deleteIncomingGoods(id){
            await axios.delete(`api/incoming-goods/${id}`)
            .then( res => {
                console.log(res.status);
            })
            .catch( err => {throw err})
        },
        async editCartItem(data){
            this.selectedIncomingGoods = data
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
            this.clearCart()
            this.clearCurrentItem()
            const {invoice, items, received_date, supplier_id, id} = item
            console.log(item);
            this.incomingGoodsForm.id = id
            this.incomingGoodsForm.invoice = invoice
            this.incomingGoodsForm.received_date = received_date
            this.incomingGoodsForm.supplier_id = supplier_id
            this.incomingGoodsForm.items = items
            this.router.push({
                name:'incomingGoods.detail',
                params:{id:id}
            })
        },
        async editIncomingGoods(){
            this.editing = true
        },
        addItemToCart() {
            console.log(this.selectedIncomingGoods);
            console.log(this.selectedIncomingGoodsItems);
            const data = {
                ...this.selectedIncomingGoods,
                goods_id: this.selectedIncomingGoodsItems.goods_id,
                goods: this.selectedIncomingGoodsItems.goods,
            }               
            console.log(data);
                     
            this.incomingGoodsForm.items.push({
                ...data,
                tempId: `${Date.now()} - ${Math.random().toString(36).substring(2,5)}`
            })
            
            this.clearCurrentItem()
        },
        editItemFromCart(item) { //item = incominggoodsform
            console.log(item);
            const{goods_id, goods, tempId,...rest} = item
            this.selectedIncomingGoodsItems = {goods_id, goods}
            this.selectedIncomingGoods = { ...rest} // isi form
            this.editingTempId = item.tempId
        },
        saveEditedItemToCart() {
            const index = this.incomingGoodsForm.items.findIndex(item => item.tempId === this.editingTempId)
            if (index !== -1) {
                this.incomingGoodsForm.items.splice(index, 1, {
                ...this.selectedIncomingGoods,
                goods_id: this.selectedIncomingGoodsItems.goods_id,
                goods: this.selectedIncomingGoodsItems.goods,
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
            this.incomingGoodsForm.items = this.incomingGoodsForm.items.filter(item => item.tempId !== data.tempId)
        },
        setCartPage(page) {
            this.cartPagination.currentPage = page
        },
        clearCurrentItem(){
            this.selectedIncomingGoods = {
                goods_id: null,
                goods: '',
                batch_number: '',
                qty: 1,
                conversion_qty: 1,
                unit_id: null,
                unit_price: null,
                expiry_date: null,
            }
            this.selectedIncomingGoodsItems = null
        },
        clearCart(){ //hapus data di table
            this.incomingGoodsForm = {
                invoice: '',
                supplier_id: null,
                received_date: '',
                items: [],
            }
        }
    },
    persist: {
        storage: localStorage
    },
})