<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-10">
      <p class="section-label mb-2">History</p>
      <h1 class="display-heading text-5xl">Your Orders</h1>
    </div>

    <div v-if="ordersStore.orders.length === 0" class="text-center py-24">
      <svg class="w-16 h-16 text-stone-700 mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
      <p class="font-display text-3xl text-stone-400 mb-2">No orders yet</p>
      <p class="text-stone-600 font-body mb-8">Your order history will appear here</p>
      <RouterLink to="/" class="btn-primary">Start Shopping</RouterLink>
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="order in ordersStore.orders"
        :key="order.id"
        class="bg-stone-900 border border-stone-800 overflow-hidden hover:border-stone-700 transition-colors"
      >
        <!-- Order header -->
        <div class="px-6 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-6">
            <div>
              <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-0.5">Order ID</p>
              <p class="font-body text-sm font-medium text-brand">{{ order.id }}</p>
            </div>
            <div>
              <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-0.5">Date</p>
              <p class="font-body text-sm">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-0.5">Total</p>
              <p class="font-body text-sm font-medium">${{ order.total.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-0.5">Status</p>
              <span :class="statusClass(order.status)" class="text-xs tracking-widest uppercase font-body px-2 py-0.5 border">
                {{ order.status }}
              </span>
            </div>
          </div>
          <RouterLink :to="`/order-success/${order.id}`" class="btn-ghost flex items-center gap-1.5">
            View Details
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </RouterLink>
        </div>

        <!-- Order items -->
        <div class="px-6 py-4">
          <div class="flex gap-3 overflow-x-auto pb-1">
            <div v-for="item in order.items" :key="item.product.id" class="shrink-0 relative">
              <img :src="item.product.image" :alt="item.product.name" class="w-16 h-20 object-cover bg-stone-800" />
              <span v-if="item.quantity > 1" class="absolute -top-1.5 -right-1.5 bg-brand text-stone-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {{ item.quantity }}
              </span>
            </div>
          </div>
          <p class="text-xs text-stone-600 font-body mt-3">
            {{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }} · Shipped to {{ order.customer.city }}, {{ order.customer.country }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useOrdersStore } from '@/stores/ordersStore'

const ordersStore = useOrdersStore()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    processing: 'border-yellow-500/40 text-yellow-400',
    shipped: 'border-blue-500/40 text-blue-400',
    delivered: 'border-green-500/40 text-green-400',
  }
  return map[status] || 'border-stone-600 text-stone-400'
}
</script>
