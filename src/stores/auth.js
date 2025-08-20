import { defineStore } from "pinia";
import axios from "axios";
import UIkit from 'uikit';

export const useAuthStore = defineStore("auth",{    
    state: () => ({
        authUser: null,
        authRole: [],
        authError:[],
        authToken:[],
    }),
    getters:{
        user: (state) => state.authUser,
        token: (state) => state.authToken,
        role: (state) => state.authRole,
        error: (state) => state.authError,
        isAuthenticated(){
            return this.authUser !== null && this.authToken.length > 0
        },
    },
    actions:{        
        clearErrors () {
            this.authError = []
        },
        skip(){
          this.authUser = ['t']  
          this.authToken = ['t']
          this.router.push('/')
          
          
        },
        async getUserInformation(){
            
            if(this.authToken[0]){
                try {
                    await this.getUser()
        
                    const id = this.authUser.id
                    
                    await this.getRole()
                    
                } catch (error) {
                    console.log(error.message);                                                                
                }                        
            }
        },
        async getToken (){
            await axios.get('sanctum/csrf-cookie')
            .then(res => console.log(res)
            )
        },
        async getUser (){            
            await axios.get('api/user')
            .then((res)=>{
                this.authUser= res.data
            })
            .catch(err=>{
                console.log(err.message);
            })            
        },
        async getRole(){            
            const data = await axios.get('api/roles-and-permissions')
            if(data.data.length >0){
                this.authRole = data.data[0]
            }else{
                const defaultRole = ['default']
                this.authRole = defaultRole[0]
            }
        },
        async handleLogin (data){            
            this.authError = []
            // await this.getToken()
            
            await axios.post("api/login", {
                username:data.username,
                password:data.password 
            })
            .then(async (res)=>{                
                this.authToken = res.data.token
                // console.log(res.data.message);
                console.log(res);
                await this.getUser()
                this.router.push('/dashboard')
                
                // await this.getUserInformation()                
                // if (this.authRole === 'admin') {
                //     this.router.push('/dashboard')  
                // } else {
                //     this.router.push('/')  
                // }                                     
            })
            .catch(err=>{
                if(err.response.status === 422){
                    this.authError = err.response.data.errors
                }
                console.log(err);
            })            
        },
        async handleRegister (data) {
            this.authError = []
            await this.getToken()
            await axios.post("/register", {
                name:data.name,
                username:data.username,
                email:data.email,
                password:data.password,
                password_confirmation:data.password_confirmation,
            })
            .then(async (res)=>{             
                this.router.push('/')
                await this.getUserInformation()
            })
            .catch(err=>{
                if(err.response.status === 422){
                    this.authError = err.response.data.errors                    
                }
            })
        },
        async handleLogout () {
            await axios.post('api/logout')
            .then( res => {
                this.authToken = []
                this.authUser = null
                this.authRole = []
                this.router.push('/login')
            })
            .catch( err => {console.log(err.message);})
                                  
            
        },
        async handleResetPassword (data) {
            this.authError = []
            this.authStatus = null
            await axios.post('reset-password' , data)
            .then((res)=>{
                console.log(res);
                
            })
            .catch((err)=>{
                console.log(err);
                if(err.response.status === 422){
                    this.authError = err.response.data.errors
                }
            })
        }
    },
    persist: {
        storage: localStorage
    },
})
