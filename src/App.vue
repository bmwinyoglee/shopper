<template>
  <div class="min-h-screen bg-stone-950">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-stone-800/60 bg-stone-950/90 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="font-display text-2xl tracking-[0.15em] text-stone-100 hover:text-brand transition-colors">
            MAISON
          </RouterLink>

          <!-- Nav links -->
          <div class="hidden md:flex items-center gap-8">
            <RouterLink to="/" class="text-xs tracking-widest uppercase font-body text-stone-400 hover:text-stone-100 transition-colors" active-class="text-brand">
              Shop
            </RouterLink>
            <RouterLink to="/orders" class="text-xs tracking-widest uppercase font-body text-stone-400 hover:text-stone-100 transition-colors" active-class="text-brand">
              Orders
            </RouterLink>
            <RouterLink to="/admin" class="text-xs tracking-widest uppercase font-body text-stone-600 hover:text-brand transition-colors border border-stone-800 px-3 py-1 hover:border-brand/40">
              Admin
            </RouterLink>
          </div>

          <!-- Cart icon -->
          <div class="flex items-center gap-4">
            <RouterLink to="/orders" class="md:hidden text-xs tracking-widest uppercase font-body text-stone-400 hover:text-stone-100 transition-colors">
              Orders
            </RouterLink>
            <button
              @click="cart.openDrawer()"
              class="relative flex items-center gap-2 text-stone-300 hover:text-brand transition-colors"
              aria-label="Open cart"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm5.625 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span class="font-body text-xs tracking-widest uppercase">Cart</span>
              <span
                v-if="cart.totalItems > 0"
                class="absolute -top-2 -right-2 bg-brand text-stone-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {{ cart.totalItems > 9 ? '9+' : cart.totalItems }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="pt-16">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Cart Drawer -->
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useOrdersStore } from '@/stores/ordersStore'
import { useProductsStore } from '@/stores/productsStore'
import { useAdminStore } from '@/stores/adminStore'
import CartDrawer from '@/components/CartDrawer.vue'

const cart = useCartStore()
const orders = useOrdersStore()
const productsStore = useProductsStore()
const adminStore = useAdminStore()

onMounted(() => {
  cart.loadFromStorage()
  orders.loadFromStorage()
  productsStore.loadFromStorage()
  adminStore.loadFromStorage()
})

watch(() => cart.items, () => cart.saveToStorage(), { deep: true })
</script>
