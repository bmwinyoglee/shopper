<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cart.isDrawerOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      @click="cart.closeDrawer()"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="cart.isDrawerOpen"
      class="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-stone-950 border-l border-stone-800 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-stone-800">
        <div>
          <p class="section-label">Your Bag</p>
          <h2 class="font-display text-xl mt-0.5">
            {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'Item' : 'Items' }}
          </h2>
        </div>
        <button @click="cart.closeDrawer()" class="text-stone-500 hover:text-stone-100 transition-colors p-1">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="cart.items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <svg class="w-12 h-12 text-stone-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
          <p class="font-display text-xl text-stone-400">Your bag is empty</p>
          <p class="text-stone-600 text-sm mt-2 font-body">Explore the collection below</p>
          <button @click="goShop" class="mt-6 btn-primary">Browse Collection</button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="flex gap-4 py-4 border-b border-stone-800/60 last:border-0"
          >
            <RouterLink :to="`/product/${item.product.id}`" @click="cart.closeDrawer()" class="shrink-0">
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="w-20 h-24 object-cover bg-stone-900"
              />
            </RouterLink>
            <div class="flex-1 min-w-0">
              <p class="text-[10px] tracking-widest uppercase text-stone-500 font-body mb-0.5">{{ item.product.brand }}</p>
              <RouterLink
                :to="`/product/${item.product.id}`"
                @click="cart.closeDrawer()"
                class="font-display text-base leading-tight hover:text-brand transition-colors block"
              >
                {{ item.product.name }}
              </RouterLink>
              <p class="text-brand font-body text-sm mt-1">${{ item.product.price.toLocaleString() }}</p>

              <!-- Qty + Remove -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center gap-2 border border-stone-700">
                  <button
                    @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                    class="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors"
                  >−</button>
                  <span class="w-6 text-center font-body text-sm">{{ item.quantity }}</span>
                  <button
                    @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors"
                  >+</button>
                </div>
                <button
                  @click="cart.removeItem(item.product.id)"
                  class="text-stone-600 hover:text-red-400 transition-colors text-xs tracking-widest uppercase font-body"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cart.items.length > 0" class="px-6 py-5 border-t border-stone-800 space-y-3">
        <div class="flex justify-between text-sm font-body text-stone-400">
          <span>Subtotal</span>
          <span>${{ cart.subtotal.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-sm font-body text-stone-400">
          <span>Shipping</span>
          <span>{{ cart.shipping === 0 ? 'Free' : `$${cart.shipping}` }}</span>
        </div>
        <div class="flex justify-between font-display text-lg pt-2 border-t border-stone-800">
          <span>Total</span>
          <span class="text-brand">${{ cart.total.toLocaleString() }}</span>
        </div>
        <button @click="goCheckout" class="btn-primary w-full text-center mt-2">
          Proceed to Checkout
        </button>
        <button @click="goCart" class="btn-secondary w-full text-center">
          View Full Cart
        </button>
        <p v-if="cart.shipping === 0" class="text-center text-xs text-stone-600 font-body">
          ✓ Free shipping applied
        </p>
        <p v-else class="text-center text-xs text-stone-600 font-body">
          Free shipping on orders over $500
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const router = useRouter()

function goCheckout() {
  cart.closeDrawer()
  router.push('/checkout')
}

function goCart() {
  cart.closeDrawer()
  router.push('/cart')
}

function goShop() {
  cart.closeDrawer()
  router.push('/')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active { transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-right-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
