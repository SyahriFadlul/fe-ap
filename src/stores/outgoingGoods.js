import axios from "axios";
import { defineStore } from "pinia";
import { useUnitStore } from "./unit";
import { toRaw } from "vue";
import { update } from "uikit";

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
            batch_number: '',
            qty: 1,
            unit_id: null, //untuk selection
            unit: [],
        },
        outgoingGoodsForm: {
            date: null,
            transc_type: null,
            note: '',
            items: [], // cart/form
        },
        editingTempId: null,
        editing: false,
        errors: [],
        fifo: false,
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
        selectedItems: (state) => state.selectedOutgoingGoods,
        isEditing: (state) => state.editingTempId !== null,
        isFifo: () => (transcType) => {
  const fifo = ['penjualan', 'keperluan internal', 'lainnya']

  if (typeof transcType !== 'string') {
    console.warn('isFifo: transcType bukan string:', transcType)
    return false
  }

  return fifo.includes(transcType.toLowerCase())
}

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
        async updateOutgoingGoods(){
            const data = this.outgoingGoodsForm
            await axios.put(`api/outgoing-goods/${data.id}`, {
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
        async deleteOutgoingGoods(id){
            await axios.delete(`api/incoming-goods/${id}`)
            .then( res => {
                console.log(res.status);
            })
            .catch( err => {throw err})
        },
        editOutgoingGoods(){
            this.editing = true
        },
        addItemToCart() {
            const unitStore = useUnitStore()
            const unitId = this.selectedOutgoingGoods.unit_id

            this.selectedOutgoingGoods.unit = unitStore.unitsGoods.find(unit => unit.id === unitId) //masukan info unit/satuan yg dipilih            
            
            const data = {
                ...this.selectedOutgoingGoods,
                goods_id: this.selectedOutgoingGoodsItems.goods_id, //vue-select
                goods: this.selectedOutgoingGoodsItems.goods,
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
        detailEditItemFromCart(item) { //item = outgoinggoodsform, halaman create
            this.editing = false
            const unitStore = useUnitStore()
            const unitId = this.selectedOutgoingGoods.unit_id

            const tempId = `${Date.now()} - ${Math.random().toString(36).substring(2,5)}`
            
            console.log(item);
            const{goods_id, goods, batch_id, batch_number} = item            
            this.selectedOutgoingGoodsItems = {goods_id, goods}
            this.selectedOutgoingGoodsBatch = {batch_id, batch_number}
            this.selectedOutgoingGoods = {
                qty: item.qty,
                unit_id: item.unit_id,
                unit: item.unit,
                unit_price: item.unit_price,
                tempId: tempId
            }
            console.log(this.selectedOutgoingGoods);
            
            
            this.editingTempId = tempId
        },
        editItemFromCart(item) { //item = outgoinggoodsform, halaman detail/edit
            this.editing = false
            const unitStore = useUnitStore()
            const unitId = this.selectedOutgoingGoods.unit_id
            
            console.log(item);
            const{goods_id, goods, batch_id, batch_number, tempId, ...rest} = item            
            this.selectedOutgoingGoodsItems = {goods_id, goods}
            this.selectedOutgoingGoodsBatch = {batch_id, batch_number}
            this.selectedOutgoingGoods = {
                qty: item.qty,
                unit_id: item.unit_id,
                unit: item.unit,
                unit_price: item.unit_price,
                tempId:{tempId},
                ...rest,
            }
            console.log(this.selectedOutgoingGoods);
            console.log(this.selectedOutgoingGoodsBatch);
            console.log(this.selectedOutgoingGoodsItems);
            
            
            this.editingTempId = item.tempId
        },
        saveEditedItemToCart() {
            const unitStore = useUnitStore()
            const unitId = this.selectedOutgoingGoods.unit_id
            const index = this.outgoingGoodsForm.items.findIndex(item => item.tempId === this.editingTempId)
            this.selectedOutgoingGoods.unit = unitStore.unitsGoods.find(unit => unit.id === unitId)
            // const {unit_id} = this.selectedOutgoingGoods
            // console.log(unit_id);
            // const unit = this.selectedOutgoingGoods.unit
            // console.log(this.selectedOutgoingGoods.tempId);
            // console.log(this.editingTempId);
            
            
            // const data = {
            //     unit_id:this.selectedOutgoingGoods.unit_id,
            //     unit:unit,
            //     unit_price:this.selectedOutgoingGoods.unit_price,
            //     qty:this.selectedOutgoingGoods.qty,
            //     goods_id: this.selectedOutgoingGoodsItems.goods_id,
            //     goods: this.selectedOutgoingGoodsItems.goods,
            //     batch_id: this.selectedOutgoingGoodsBatch.id,
            //     batch_number: this.selectedOutgoingGoodsBatch.batch_number,
            //     tempId: this.editingTempId,
            // }
            // console.log(data);
            // console.log(index);
            console.log(this.selectedItems)
            
            if (index !== -1) {
                this.outgoingGoodsForm.items.splice(index, 1, {
                ...this.selectedItems,
                goods_id: this.selectedOutgoingGoodsItems.goods_id,
                goods: this.selectedOutgoingGoodsItems.goods,
                batch_id: this.selectedOutgoingGoodsBatch.id,
                batch_number: this.selectedOutgoingGoodsBatch.batch_number,
                tempId: this.editingTempId,
                })
                this.editingTempId = null
                this.clearCurrentItem()
            }
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
        showDetails(item){ //dari index ke detail/edit page
            this.clearCart()
            this.clearCurrentItem()
            const {invoice, items, date, type, id} = item
            console.log(item);
            this.outgoingGoodsForm.id = id
            this.outgoingGoodsForm.invoice = invoice
            this.outgoingGoodsForm.date = date
            this.outgoingGoodsForm.transc_type = type
            this.outgoingGoodsForm.items = items.map(item => ({
                ...item,
                tempId: `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
            }));
            this.router.push({
                name:'outgoingGoods.detail',
                params:{id:id}
            })
        },
        clearCurrentItem(){
            this.selectedOutgoingGoods = {
                id: null,
                name: '',
                batch_number: '',
                qty: 1,
                unit: []
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
        clearCurrentItem(){
            this.selectedOutgoingGoods = {
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
                date: null,
                transc_type: null,
                note: '',
                items: [],
            }
        }
    },
    persist: {
        storage: localStorage
    },
})