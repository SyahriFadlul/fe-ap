import axios from "axios";
import nProgress from "nprogress";
import { useAuthStore } from "./stores/auth";

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
// axios.defaults.headers.common['ngrok-skip-browser-warning'] = '1'; //ngrok API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const protectedRoutes = [
    { url: 'api/goods', methods: ['POST', 'PUT', 'DELETE'] }, 
    { url: 'api/user', methods: ['GET', 'POST', 'PUT', 'DELETE'] },    
    { url: 'api/profile', methods: ['GET', 'POST', 'PUT', 'DELETE'] },    
    // { url: 'api/user-profiles', methods: ['PUT'] },              
    { url: 'api/cart', methods: ['GET', 'POST', 'PUT', 'DELETE'] },     
    { url: 'api/order', methods: ['GET', 'POST', 'PUT', 'DELETE'] },    
    { url: 'api/wishlist', methods: ['GET', 'POST', 'PUT', 'DELETE'] }, 
    { url: 'api/address', methods: ['GET', 'POST', 'PUT', 'DELETE'] }, 
    { url: 'api/set-main-address', methods: ['PUT'] }, 
    { url: 'api/courier-cost', methods: ['POST'] }, 
    { url: 'api/checkout', methods: ['POST'] }, 
    { url: 'api/role', methods: ['GET'] }, 
    { url: 'api/inv', methods: ['GET', 'POST', 'PUT', 'DELETE'] },         
    { url: 'api/verify-email', methods: ['GET'] },                     //auth 
    { url: 'api/email', methods: ['POST'] }, 
    { url: 'api/logout', methods: ['POST'] }, 
]

const unprotectedRoutes = [
    { url: 'api/login', methods: ['POST'] },
]

axios.interceptors.request.use(function (config) {
    nProgress.configure({ showSpinner: false })
    nProgress.start()

    const authStore = useAuthStore()
    
    if (config.url !== unprotectedRoutes.url){
        config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
    }, function (error) {
        return Promise.reject(error)
    }    
)

axios.interceptors.response.use(response => {
    nProgress.done() 
    return response
})