import { createRouter, createWebHistory } from 'vue-router'
import indexGoods from '@/views/goods/indexGoods.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboardl',
      component: () => import('@/views/DashboardLayout.vue'),
      meta:{
          requiresAuth: true,
          title: 'dashboard'
      },
      children:[
        {
          path: '',
          redirect: { name: 'dashboardh' },
          meta: {
            title: 'dashboard'
          }
        },
        {
          path: 'dashboard',
          name: 'dashboardh',
          component: () => import('@/views/DashboardHome.vue'),
          meta: {
            requiresAuth: true,
            title: 'dashboard'
          }
        },
        {
          path: '/goods',
          name: 'indexGoods',
          // component: () => import('@/views/goods/indexGoods.vue'),
          component: indexGoods,
          meta:{
            title: 'inventori'
          },
        },
        {
          path: '/goods/create',
          name: 'createGoods',
          component: () => import('@/views/goods/createGoods.vue'),
          meta:{
            title: 'inventori'
          },
        },
        {
          path: '/incoming-goods',
          name: 'indexIncomingGoods',
          component: () => import('@/views/goods/incomingGoods/indexIncomingGoods.vue'),
          meta:{
            title: 'barang masuk'
          },
        },
        {
          path: '/incoming-goods/create',
          name: 'createIncomingGoods',
          component: () => import('@/views/goods/incomingGoods/createIncomingGoods.vue'),
          meta:{
            title: 'barang masuk'
          },
        },
        {
          path: '/outgoing-goods',
          name: 'indexOutgoingGoods',
          component: () => import('@/views/goods/outgoingGoods/indexOutgoingGoods.vue'),
          meta:{
            title: 'barang keluar'
          },
        },
        {
          path: '/outgoing-goods/create',
          name: 'createOutgoingGoods',
          component: () => import('@/views/goods/outgoingGoods/createOutgoingGoods.vue'),
          meta:{
            title: 'barang keluar'
          },
        },
        {
          path: '/categories',
          name: 'indexCategory',
          component: () => import('@/views/categories/indexCategory.vue'),
          meta:{
            title: 'kategori'
          },
        },
        {
          path: '/categories/create',
          name: 'createCategory',
          component: () => import('@/views/categories/createCategory.vue'),
          meta:{
            title: 'kategori'
          },
        },
        {
          path: '/suppliers',
          name: 'indexSupplier',
          component: () => import('@/views/suppliers/indexSupplier.vue'),
          meta:{
            title: 'Supplier'
          },      
        },
        {
          path: '/suppliers/create',
          name: 'createSupplier',
          component: () => import('@/views/suppliers/createSupplier.vue'),
          meta:{
            title: 'Supplier'
          },      
        },
        {
          path: '/users',
          name: 'indexUser',
          component: () => import('@/views/users/indexUser.vue'),
          meta:{
            title: 'manajemen user'
          },      
        },
        {
          path: '/users/create',
          name: 'createUser',
          component: () => import('@/views/users/createUser.vue'),
          meta:{
            title: 'manajemen user'
          },
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta:{
        hideSidebar: true,
        guest : true
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  let sidebar = document.getElementById('section-sidebar')
  let header = document.getElementById('section-header')

  if (sidebar && header){
    if (to.meta.hideSidebar) {
      sidebar.classList.add('hide-sidebar')
      header.classList.add('hide-header')
    }
    else {
      sidebar.classList.remove('hide-sidebar')
      header.classList.remove('hide-header')
    }
  }
  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name : 'dashboardh'})
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } 
    next()
})

export default router
