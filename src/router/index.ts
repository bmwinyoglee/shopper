import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/product/:id', name: 'product', component: () => import('@/views/ProductView.vue') },
    { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
    { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
    { path: '/order-success/:id', name: 'order-success', component: () => import('@/views/OrderSuccessView.vue') },
    // Admin
    { path: '/admin', name: 'admin', component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/admin/products' },
        { path: 'products', name: 'admin-products', component: () => import('@/views/admin/AdminProducts.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/AdminCategories.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/AdminOrders.vue') },
      ]
    },
    { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLogin.vue') },
  ],
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  if (to.path.startsWith('/admin') && to.name !== 'admin-login') {
    const isAuth = sessionStorage.getItem('maison-admin') === 'true'
    if (!isAuth) return { name: 'admin-login' }
  }
})

export default router
