import axios from "axios";
import { defineStore } from "pinia";
import debounce from "lodash.debounce";

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
        selectedUser: null,
        errors: null,
    }),
    getters:{
        userItems: (state) => state.userList,
        error: (state) => state.errors,
    },
    actions:{
        async fetchUsers(page = 1){
            axios.get(`api/users?page=${page}`)
            .then( res => {
                this.userList = res.data.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.last_page
                this.pagination.lastPage = res.data.meta.last_page
                console.log(this.userList)
            })
            .catch( err => console.log(err)
            )
        },
        async createUser(data) {
           await axios.post('api/users', data)
           .then( async () => {
                this.UIkit.notification({
                    message: 'User berhasil ditambahkan!',
                    status: 'success',
                    pos: 'top-center',
                    timeout: 3000
                }) 
                await this.fetchUsers()
                this.router.push({name:'user.index'})
            }
            )
            .catch( err => {
                if(err.response.status === 422){
                    this.errors = err.response.data.errors      
                }
                console.log(err.message);
            })            
        },
        async updateUser(data) {
            try {
                const res = await axios.put(`api/users/${this.selectedUser.id}`, data)
                console.log(res);
            } catch (err) {
                console.log(err)
                if(err.response.status === 422){
                    this.errors = err.response.data.errors
                    // console.log(this.errors.name[0]);
                }
                throw err;
                
            }
            // axios.put(`api/users/${this.selectedUser.id}`, data)
            // .then( (res) => {
            //     console.log(res);
                
            //     // this.UIkit.notification({
            //     //     message: 'User berhasil diperbarui!',
            //     //     status: 'success',
            //     //     pos: 'top-center',
            //     // })
            // })
            // .catch( err => {
            // })
        },
        async deleteUser(data) {
            this.Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: `User: ${data.username}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                try {
                    await axios.delete(`api/users/${data.id}`)
                    await this.fetchUsers()
                    this.router.push({ name: 'user.index' });
                    this.Swal.fire({
                        title: 'Dihapus!',
                        text: 'User berhasil dihapus.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    })
                } catch (error) {
                    console.log(error.message);
                    
                    Swal.fire({
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat menghapus.',
                    icon: 'error',
                    })
                }
                }
            })
        },  
        showDetails(item){
            this.selectedUser = item;
            this.router.push({ name: 'user.detail', params: { id: item.id } });
        },
        async _fetchUserSearch(query, loading) {
            loading(true)
            await axios.get(`/api/users/search?query=${query}`)
            .then( res => {
                this.resUserQuery = res.data
            })
            .catch( err => {
                console.error(err)
            })
            .finally(() => {
                loading(false)
            })
        },

        getUserSearch: debounce(function (query, loading) {
            if (!query.length) return
            this._fetchUserSearch(query, loading)
        }, 350),
    },
    persist: {
        storage: localStorage
    },
})