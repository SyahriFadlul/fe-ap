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
            axios.get(`api/users?page=${page}`)
            .then( res => {
                this.userList = res.data
                this.pagination.currentPage = res.data.meta.current_page
                this.pagination.perPage = res.data.meta.per_page
                this.pagination.totalItems = res.data.meta.total
                this.pagination.totalPage = res.data.meta.to
                this.pagination.lastPage = res.data.meta.last_page
                console.log(this.userList)
            })
            .catch( err => console.log(err)
            )
        },
    },
    persist: {
        storage: localStorage
    },
})