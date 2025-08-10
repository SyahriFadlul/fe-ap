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
        errors:[],
        selectedCategory: [],
        editing: false,
        hasUnsavedChanges: false,
    }),
    getters:{
        categoryItems: (state) => state.categoryList,
        error: (state) => state.errors
    },
    actions:{
        async fetchCategories(page = 1){
            axios.get(`api/category?page=${page}`)
            .then( res => {
                this.categoryList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.last_page
                this.pagination.lastPage = res.data.meta.last_page
            })
            .catch( err => console.log(err)
            )
        },
        async fetchCategory(id){
            axios.get(`api/category/${id}`)
            .then( res => this.selectedCategory = res.data)
            .catch( err => console.log(err))
        },
        async createCategory(data){
            this.errors = []
            await axios.post('api/category', {
                name: data.name,
                note: data.note,
            })
            .then( async () =>{
                this.UIkit.notification({
                    message: 'Kategori berhasil ditambahkan!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                }) 
                await this.fetchCategories()
                this.router.push('/categories')
            })
            .catch( err =>{ 
                if(err.status === 422){
                    this.errors = err.response.data.errors
                    console.log(this.errors.name[0]);       
                }
                console.log(err.message);                
            })
        },
        async detailCategory(data){
            this.selectedCategory = data
            this.router.push({
                name:'category.detail',
                params:{id:data.id}
            })
        },
        async editCategory(){
            this.editing = true
        },
        async updateCategory(data){
            await axios.put(`api/category/${this.selectedCategory.id}`, data)
            .then(async res => {
                this.UIkit.notification({
                    message: 'Kategori berhasil diperbarui!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                })
                await this.fetchCategories()
                this.router.push('/categories') 
            })
            .catch( err =>{ 
                if(err.status === 422){
                    this.errors = err.response.data.errors
                    console.log(this.errors.name[0]);       
                }
                console.log(err.message);                
            })
        },
        async deleteCategory(id){
            await axios.delete(`api/category/${id}`)
            .then(async res => {
                await this.fetchCategories()
                this.router.push('/categories')
                
                return true
            })
            .catch( err => false)
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