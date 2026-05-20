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
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
