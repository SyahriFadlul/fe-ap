import axios from "axios";
import { defineStore } from "pinia";

export const useSupplierStore = defineStore('supplier',{
    state: () => ({
        supplierList: [],
        pagination: {
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            totalPage: 0,
            lastPage: 1,
        },
        selectedSupplier: [],
        errors: [],
        editing: false,
        hasUnsavedChanges: false,
    }),
    getters:{
        supplierItems: (state) => state.supplierList,
        error: (state) => state.errors,
    },
    actions:{
        async fetchSuppliers(page = 1){
            axios.get(`api/supplier?page=${page}`)
            .then( res => {
                this.supplierList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.last_page
                this.pagination.lastPage = res.data.meta.last_page
                console.log(this.supplierList)
            })
            .catch( err => console.log(err)
            )
        },
        async createSupplier(data){
            this.errors = []
            await axios.post('api/supplier', {
                name: data.name,
                contact: data.contact,
                note: data.note,
            })
            .then( async () =>{
                this.UIkit.notification({
                    message: 'Supplier berhasil ditambahkan!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                }) 
                await this.fetchSuppliers()
                this.router.push({name:'supplier.index'})
            })
            .catch( err =>{ 
                if(err.status === 422){
                    this.errors = err.response.data.errors
                    console.log(this.errors.name[0]);       
                }
                console.log(err.message);
                
            })
        },
        async detailSupplier(data){
            this.selectedSupplier = data
            this.router.push({
                name:'supplier.detail',
                params:{id:data.id}
            })
        },
        async editSupplier(){
            this.editing = true
        },
        async updateSupplier(data){
            await axios.put(`api/supplier/${this.selectedSupplier.id}`, data)
            .then(async res => {
                this.UIkit.notification({
                    message: 'Supplier berhasil diperbarui!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                })
                await this.fetchSuppliers()
                this.router.push('/suppliers') 
            })
            .catch( err =>{ 
                if(err.status === 422){
                    this.errors = err.response.data.errors
                    console.log(this.errors.name[0]);       
                }
                if(err.status === 500){
                    this.UIkit.notification({
                        message: 'Terjadi kesalahan pada server, silahkan coba lagi nanti.',
                        status: 'danger',
                        pos: 'top-center',
                        timeout: 3000
                    })
                }
                console.log(err.message);                
            })
        },
        async deleteSupplier(id){
            await axios.delete(`api/supplier/${id}`)
            .then(async res => {
                await this.fetchSuppliers()
                this.router.push({name:'supplier.index'})
                
                return true
            })
            .catch( err => {throw err})
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
    },
    persist: {
        storage: localStorage
    },
})