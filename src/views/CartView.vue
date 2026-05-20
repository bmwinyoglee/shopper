<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-10">
      <p class="section-label mb-2">Your Bag</p>
      <h1 class="display-heading text-5xl">Shopping Cart</h1>
    </div>

    <div v-if="cart.items.length === 0" class="text-center py-24">
      <svg class="w-16 h-16 text-stone-700 mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
      <p class="font-display text-3xl text-stone-400 mb-2">Your cart is empty</p>
      <p class="text-stone-600 font-body mb-8">Discover the collection and add pieces you love</p>
      <RouterLink to="/" class="btn-primary">Browse Collection</RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-10">
      <!-- Items list -->
      <div class="lg:col-span-2 space-y-0">
        <div class="grid grid-cols-4 gap-4 pb-3 border-b border-stone-800 mb-2">
          <p class="col-span-2 text-xs tracking-widest uppercase text-stone-500 font-body">Product</p>
          <p class="text-xs tracking-widest uppercase text-stone-500 font-body text-center">Quantity</p>
          <p class="text-xs tracking-widest uppercase text-stone-500 font-body text-right">Total</p>
        </div>

        <TransitionGroup name="list">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="grid grid-cols-4 gap-4 items-center py-6 border-b border-stone-800/50"
          >
            <!-- Product -->
            <div class="col-span-2 flex gap-4 items-center">
              <RouterLink :to="`/product/${item.product.id}`">
                <img :src="item.product.image" :alt="item.product.name" class="w-16 h-20 sm:w-20 sm:h-24 object-cover bg-stone-900 shrink-0" />
              </RouterLink>
              <div class="min-w-0">
                <p class="text-[10px] tracking-widest uppercase text-stone-500 font-body mb-0.5">{{ item.product.brand }}</p>
                <RouterLink :to="`/product/${item.product.id}`" class="font-display text-sm sm:text-base leading-tight hover:text-brand transition-colors block">
                  {{ item.product.name }}
                </RouterLink>
                <p class="text-brand text-sm font-body mt-1">${{ item.product.price.toLocaleString() }}</p>
                <button @click="cart.removeItem(item.product.id)" class="text-[10px] tracking-widest uppercase text-stone-600 hover:text-red-400 transition-colors font-body mt-2">
                  Remove
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="flex items-center justify-center">
              <div class="flex items-center border border-stone-700">
                <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors text-sm">−</button>
                <span class="w-8 text-center font-body text-sm">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors text-sm">+</button>
              </div>
            </div>

            <!-- Total -->
            <p class="text-right font-body text-sm font-medium text-stone-100">
              ${{ (item.product.price * item.quantity).toLocaleString() }}
            </p>
          </div>
        </TransitionGroup>

        <!-- Actions row -->
        <div class="pt-6 flex justify-between items-center">
          <RouterLink to="/" class="btn-ghost flex items-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Continue Shopping
          </RouterLink>
          <button @click="cart.clearCart()" class="text-xs tracking-widest uppercase text-stone-600 hover:text-red-400 transition-colors font-body">
            Clear Cart
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-stone-900 border border-stone-800 p-6 sticky top-24">
          <h2 class="font-display text-xl mb-6 pb-4 border-b border-stone-800">Order Summary</h2>
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm font-body text-stone-400">
              <span>Subtotal ({{ cart.totalItems }} items)</span>
              <span>${{ cart.subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm font-body text-stone-400">
              <span>Shipping</span>
              <span :class="cart.shipping === 0 ? 'text-green-400' : ''">
                {{ cart.shipping === 0 ? 'Free' : `$${cart.shipping}` }}
              </span>
            </div>
            <div v-if="cart.shipping > 0" class="text-xs text-stone-600 font-body">
              Add ${{ (500 - cart.subtotal).toLocaleString() }} more for free shipping
            </div>
          </div>
          <div class="flex justify-between font-display text-xl pt-4 border-t border-stone-800 mb-6">
            <span>Total</span>
            <span class="text-brand">${{ cart.total.toLocaleString() }}</span>
          </div>
          <RouterLink to="/checkout" class="btn-primary w-full text-center block">
            Proceed to Checkout
          </RouterLink>
          <div class="mt-4 flex items-center justify-center gap-3 text-stone-600">
            <span class="text-lg">🔒</span>
            <span class="text-xs font-body tracking-widest uppercase">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(-20px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }
</style>
