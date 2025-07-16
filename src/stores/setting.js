import axios from "axios";
import { defineStore } from "pinia";

export const useSettingStore = defineStore('setting',{
    state: () => ({
        isSidebarExpanded: true
    }),
    getters:{

    },
    actions:{
        toggleSidebar(){
            this.isSidebarExpanded = !this.isSidebarExpanded
            console.log(this.isSidebarExpanded);
        }
    }
})