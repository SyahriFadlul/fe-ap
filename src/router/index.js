import { createRouter, createWebHistory } from 'vue-router'
import indexGoods from '@/views/goods/indexGoods.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',      
      component: () => import('@/views/DashboardLayout.vue'),
      meta:{
          requiresAuth: true,
          title: 'dashboard'
      },
      children:[
        {
          path: '',
          name: 'dashboardl',
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
          name: 'goods.index',
          // component: () => import('@/views/goods/indexGoods.vue'),
          component: indexGoods,
          meta:{
            title: 'inventori'
          },
        },
        {
          path: '/goods/create',
          name: 'goods.create',
          component: () => import('@/views/goods/createGoods.vue'),
          meta:{
            title: 'inventori',
            checkUnsavedChanges: true
          },
        },
        {
          path: '/goods/:id/detail',
          name: 'goods.detail',
          component: () => import('@/views/goods/detailGoods.vue'),
          meta:{
            title: 'inventori'
          },
        },
        {
          path: '/incoming-goods',
          name: 'incomingGoods.index',
          component: () => import('@/views/goods/incomingGoods/indexIncomingGoods.vue'),
          meta:{
            title: 'barang masuk'
          },
        },
        {
          path: '/incoming-goods/create',
          name: 'incomingGoods.create',
          component: () => import('@/views/goods/incomingGoods/createIncomingGoods.vue'),
          meta:{
            title: 'barang masuk',
            checkUnsavedChanges: true
          },
        },
        {
          path: '/incoming-goods/:id/detail',
          name: 'incomingGoods.detail',
          component: () => import('@/views/goods/incomingGoods/detailIncomingGoods.vue'),
          meta:{
            title: 'barang masuk'
          },
        },
        {
          path: '/outgoing-goods',
          name: 'outgoingGoods.index',
          component: () => import('@/views/goods/outgoingGoods/indexOutgoingGoods.vue'),
          meta:{
            title: 'barang keluar'
          },
        },
        {
          path: '/outgoing-goods/create',
          name: 'outgoingGoods.create',
          component: () => import('@/views/goods/outgoingGoods/createOutgoingGoods.vue'),
          meta:{
            title: 'barang keluar',
            checkUnsavedChanges: true
          },
        },
        {
          path: '/outgoing-goods/:id/detail',
          name: 'outgoingGoods.detail',
          component: () => import('@/views/goods/outgoingGoods/detailOutgoingGoods.vue'),
          meta:{
            title: 'barang keluar'
          },
        },
        {
          path: '/categories',
          name: 'category.index',
          component: () => import('@/views/categories/indexCategory.vue'),
          meta:{
            title: 'kategori'
          },
        },
        {
          path: '/categories/create',
          name: 'category.create',
          component: () => import('@/views/categories/createCategory.vue'),
          meta:{
            title: 'kategori',
            checkUnsavedChanges: true
          },
        },
        {
          path: '/categories/:id/detail',
          name: 'category.detail',
          component: () => import('@/views/categories/detailCategory.vue'),
          meta:{
            title: 'kategori'
          },
        },
        {
          path: '/suppliers',
          name: 'supplier.index',
          component: () => import('@/views/suppliers/indexSupplier.vue'),
          meta:{
            title: 'Supplier'
          },      
        },
        {
          path: '/suppliers/create',
          name: 'supplier.create',
          component: () => import('@/views/suppliers/createSupplier.vue'),
          meta:{
            title: 'Supplier',
            checkUnsavedChanges: true
          },      
        },
        {
          path: '/suppliers/:id/detail',
          name: 'supplier.detail',
          component: () => import('@/views/suppliers/detailSupplier.vue'),
          meta:{
            title: 'supplier'
          },
        },
        {
          path: '/users',
          name: 'user.index',
          component: () => import('@/views/users/indexUser.vue'),
          meta:{
            title: 'manajemen user'
          },      
        },
        {
          path: '/users/create',
          name: 'user.create',
          component: () => import('@/views/users/createUser.vue'),
          meta:{
            title: 'manajemen user'
          },
        },
        {
          path: '/users/:id/detail',
          name: 'user.detail',
          component: () => import('@/views/users/detailUser.vue'),
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
