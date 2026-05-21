<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <p class="section-label mb-1">Manage</p>
        <h1 class="display-heading text-4xl">Orders</h1>
        <p class="text-stone-500 font-body text-sm mt-1">
          {{ ordersStore.orders.length }} total orders · Revenue: ${{ totalRevenue.toLocaleString() }}
        </p>
      </div>
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <input v-model="search" type="text" placeholder="Search by name, email, ID..." class="input-field max-w-xs text-sm" />
        <select v-model="filterStatus" class="input-field w-auto text-sm">
          <option value="">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-stone-900 border border-stone-800 p-4">
        <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-2">{{ stat.label }}</p>
        <p class="font-display text-2xl" :class="stat.color || 'text-stone-100'">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Orders table -->
    <div v-if="filtered.length === 0" class="text-center py-20 text-stone-600 font-body">
      <p class="text-4xl mb-3">📋</p>
      <p class="text-sm">{{ ordersStore.orders.length === 0 ? 'No orders yet' : 'No orders match your filters' }}</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filtered"
        :key="order.id"
        class="bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
      >
        <!-- Order header bar -->
        <div class="px-5 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-5">
            <div>
              <p class="text-[10px] tracking-widest uppercase text-stone-600 font-body">Order ID</p>
              <p class="text-brand font-body text-sm font-medium">{{ order.id }}</p>
            </div>
            <div>
              <p class="text-[10px] tracking-widest uppercase text-stone-600 font-body">Date</p>
              <p class="font-body text-sm">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-[10px] tracking-widest uppercase text-stone-600 font-body">Total</p>
              <p class="font-body text-sm font-medium text-stone-100">${{ order.total.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-[10px] tracking-widest uppercase text-stone-600 font-body">Items</p>
              <p class="font-body text-sm">{{ order.items.reduce((s, i) => s + i.quantity, 0) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Status selector -->
            <select
              :value="order.status"
              @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value as Order['status'])"
              :class="statusSelectClass(order.status)"
              class="text-xs tracking-widest uppercase font-body border px-3 py-1.5 bg-transparent cursor-pointer focus:outline-none"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <!-- Expand toggle -->
            <button
              @click="toggleExpanded(order.id)"
              class="text-stone-500 hover:text-stone-200 transition-colors"
            >
              <svg class="w-5 h-5 transition-transform" :class="expanded.has(order.id) ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Collapsed: quick summary -->
        <div v-if="!expanded.has(order.id)" class="px-5 py-3 flex items-center gap-4">
          <div class="flex gap-2">
            <img
              v-for="item in order.items.slice(0, 5)"
              :key="item.product.id"
              :src="item.product.image"
              :alt="item.product.name"
              class="w-8 h-10 object-cover bg-stone-800"
              :title="`${item.product.name} × ${item.quantity}`"
            />
            <div v-if="order.items.length > 5" class="w-8 h-10 bg-stone-800 flex items-center justify-center text-xs text-stone-500 font-body">
              +{{ order.items.length - 5 }}
            </div>
          </div>
          <div class="text-xs text-stone-500 font-body">
            <span class="text-stone-300">{{ order.customer.firstName }} {{ order.customer.lastName }}</span>
            · {{ order.customer.email }}
          </div>
        </div>

        <!-- Expanded: full detail -->
        <div v-else class="p-5">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Customer info -->
            <div class="bg-stone-950/50 border border-stone-800 p-4">
              <p class="text-[10px] tracking-widest uppercase text-stone-500 font-body mb-3">Customer</p>
              <p class="font-body text-sm font-medium text-stone-100">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
              <p class="font-body text-sm text-stone-400 mt-1">{{ order.customer.email }}</p>
              <p v-if="order.customer.phone" class="font-body text-sm text-stone-400">{{ order.customer.phone }}</p>
            </div>

            <!-- Items ordered -->
            <div class="bg-stone-950/50 border border-stone-800 p-4 sm:col-span-1 lg:col-span-2">
              <p class="text-[10px] tracking-widest uppercase text-stone-500 font-body mb-3">Items Ordered</p>
              <div class="space-y-2">
                <div v-for="item in order.items" :key="item.product.id" class="flex items-center gap-3">
                  <img :src="item.product.image" :alt="item.product.name" class="w-9 h-11 object-cover bg-stone-800 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="font-body text-sm text-stone-200 truncate">{{ item.product.name }}</p>
                    <p class="text-xs text-stone-500 font-body">{{ item.product.brand }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-xs text-stone-400 font-body">× {{ item.quantity }}</p>
                    <p class="text-sm font-body text-brand">${{ (item.product.price * item.quantity).toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment summary -->
          <div class="mt-4 flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-stone-800">
            <div class="text-xs font-body text-stone-500 space-y-1">
              <div class="flex gap-4">
                <span>Subtotal: <span class="text-stone-300">${{ order.subtotal.toLocaleString() }}</span></span>
                <span>Shipping: <span :class="order.shipping === 0 ? 'text-green-400' : 'text-stone-300'">{{ order.shipping === 0 ? 'Free' : `$${order.shipping}` }}</span></span>
                <span class="font-medium">Total: <span class="text-brand">${{ order.total.toLocaleString() }}</span></span>
              </div>
            </div>
            <button
              @click="confirmDeleteOrder(order.id)"
              class="text-xs tracking-widest uppercase font-body text-stone-700 hover:text-red-400 transition-colors"
            >
              Remove Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete order confirm -->
    <Teleport to="body">
      <div v-if="deletingOrderId" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="deletingOrderId = null">
        <div class="bg-stone-900 border border-stone-700 p-6 max-w-sm w-full animate-slide-up">
          <h3 class="font-display text-xl mb-2">Remove Order?</h3>
          <p class="text-stone-400 font-body text-sm mb-6">Order <strong class="text-brand">{{ deletingOrderId }}</strong> will be permanently deleted.</p>
          <div class="flex gap-3">
            <button @click="executeDeleteOrder" class="flex-1 py-2.5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs tracking-widest uppercase font-body hover:bg-red-500/20 transition-colors">Delete</button>
            <button @click="deletingOrderId = null" class="flex-1 btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/ordersStore'
import type { Order } from '@/types'

const ordersStore = useOrdersStore()

const search = ref('')
const filterStatus = ref('')
const expanded = ref<Set<string>>(new Set())
const deletingOrderId = ref<string | null>(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return ordersStore.orders.filter(o => {
    const matchSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.firstName.toLowerCase().includes(q) ||
      o.customer.lastName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || o.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const totalRevenue = computed(() => ordersStore.orders.reduce((s, o) => s + o.total, 0))

const stats = computed(() => [
  { label: 'Total Orders', value: ordersStore.orders.length },
  { label: 'Revenue', value: `$${totalRevenue.value.toLocaleString()}`, color: 'text-brand' },
  { label: 'Processing', value: ordersStore.orders.filter(o => o.status === 'processing').length, color: 'text-yellow-400' },
  { label: 'Delivered', value: ordersStore.orders.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
])

function toggleExpanded(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusSelectClass(status: string) {
  const map: Record<string, string> = {
    processing: 'border-yellow-500/40 text-yellow-400',
    shipped: 'border-blue-500/40 text-blue-400',
    delivered: 'border-green-500/40 text-green-400',
  }
  return map[status] || 'border-stone-600 text-stone-400'
}

function updateStatus(orderId: string, status: Order['status']) {
  const order = ordersStore.orders.find(o => o.id === orderId)
  if (order) {
    order.status = status
    ordersStore.saveToStorage()
  }
}

function confirmDeleteOrder(id: string) {
  deletingOrderId.value = id
}

function executeDeleteOrder() {
  if (deletingOrderId.value) {
    ordersStore.orders = ordersStore.orders.filter(o => o.id !== deletingOrderId.value)
    ordersStore.saveToStorage()
    deletingOrderId.value = null
  }
}
</script>
