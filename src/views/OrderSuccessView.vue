<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="order">
      <!-- Header -->
      <div class="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p class="section-label mb-2">Order Confirmed</p>
          <h1 class="display-heading text-4xl sm:text-5xl">{{ order.id }}</h1>
          <p class="text-stone-500 font-body text-sm mt-2">Placed on {{ formatDate(order.createdAt) }}</p>
        </div>
        <span :class="statusClass(order.status)" class="text-xs tracking-widest uppercase font-body px-4 py-2 border">
          {{ order.status }}
        </span>
      </div>

      <!-- Progress tracker -->
      <div class="bg-stone-900 border border-stone-800 p-6 mb-6">
        <div class="flex items-center justify-between relative">
          <div class="absolute top-4 left-0 right-0 h-px bg-stone-800 z-0" />
          <div v-for="(step, i) in steps" :key="step.label" class="flex flex-col items-center gap-2 relative z-10">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
              i <= currentStep ? 'border-brand bg-brand text-stone-950' : 'border-stone-700 bg-stone-900 text-stone-600'
            ]">
              <svg v-if="i < currentStep" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span v-else class="text-xs font-bold">{{ i + 1 }}</span>
            </div>
            <p class="text-[10px] tracking-widest uppercase font-body" :class="i <= currentStep ? 'text-stone-300' : 'text-stone-600'">
              {{ step.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-6 mb-6">
        <!-- Items -->
        <div class="bg-stone-900 border border-stone-800 p-6">
          <h2 class="font-display text-lg mb-4 pb-3 border-b border-stone-800">Items Ordered</h2>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.product.id" class="flex gap-3 items-center">
              <img :src="item.product.image" :alt="item.product.name" class="w-12 h-14 object-cover bg-stone-800 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-display text-sm leading-tight">{{ item.product.name }}</p>
                <p class="text-xs text-stone-500 font-body mt-0.5">Qty: {{ item.quantity }}</p>
              </div>
              <p class="text-brand text-sm font-body shrink-0">${{ (item.product.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Customer info -->
        <div class="space-y-4">
          <div class="bg-stone-900 border border-stone-800 p-5">
            <h2 class="font-display text-base mb-3">Ship To</h2>
            <p class="font-body text-sm text-stone-300">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
            <p class="font-body text-sm text-stone-500">{{ order.customer.address }}</p>
            <p class="font-body text-sm text-stone-500">{{ order.customer.city }}, {{ order.customer.country }} {{ order.customer.zip }}</p>
          </div>
          <div class="bg-stone-900 border border-stone-800 p-5">
            <h2 class="font-display text-base mb-3">Payment Summary</h2>
            <div class="space-y-1.5">
              <div class="flex justify-between text-sm font-body text-stone-400">
                <span>Subtotal</span><span>${{ order.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm font-body text-stone-400">
                <span>Shipping</span>
                <span :class="order.shipping === 0 ? 'text-green-400' : ''">{{ order.shipping === 0 ? 'Free' : `$${order.shipping}` }}</span>
              </div>
              <div class="flex justify-between font-display text-lg pt-2 border-t border-stone-800 mt-2">
                <span>Total</span><span class="text-brand">${{ order.total.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <RouterLink to="/orders" class="btn-secondary flex-1 text-center">View All Orders</RouterLink>
        <RouterLink to="/" class="btn-primary flex-1 text-center">Continue Shopping</RouterLink>
      </div>
    </div>

    <div v-else class="text-center py-24">
      <p class="font-display text-3xl text-stone-400 mb-6">Order not found</p>
      <RouterLink to="/orders" class="btn-primary">View All Orders</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useOrdersStore } from '@/stores/ordersStore'

const route = useRoute()
const ordersStore = useOrdersStore()

const order = computed(() => ordersStore.orders.find(o => o.id === route.params.id))

const steps = [
  { label: 'Ordered' },
  { label: 'Processing' },
  { label: 'Shipped' },
  { label: 'Delivered' },
]

const currentStep = computed(() => {
  const map: Record<string, number> = { processing: 1, shipped: 2, delivered: 3 }
  return map[order.value?.status || 'processing'] ?? 1
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
