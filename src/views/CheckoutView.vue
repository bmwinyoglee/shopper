<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- ── SUCCESS SCREEN ── -->
    <Transition name="fade">
      <div v-if="orderPlaced && placedOrder" class="text-center py-20 animate-slide-up">
        <div class="w-20 h-20 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p class="section-label mb-3">Order Confirmed</p>
        <h1 class="display-heading text-5xl mb-4">Thank You!</h1>
        <p class="font-body text-stone-400 text-lg mb-2">
          Order <span class="text-brand font-medium">{{ placedOrder.id }}</span> has been placed
        </p>
        <p class="font-body text-stone-500 text-sm mb-10">
          We will be in touch at {{ placedOrder.customer.email }}
        </p>

        <div class="max-w-md mx-auto bg-stone-900 border border-stone-800 p-6 text-left mb-8">
          <h3 class="font-display text-lg mb-4 pb-3 border-b border-stone-800">Order Summary</h3>
          <div class="space-y-2 mb-4">
            <div v-for="item in placedOrder.items" :key="item.product.id" class="flex justify-between text-sm font-body">
              <span class="text-stone-400">{{ item.product.name }} × {{ item.quantity }}</span>
              <span class="text-stone-300">${{ (item.product.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>
          <div class="flex justify-between font-display text-lg pt-3 border-t border-stone-800">
            <span>Total</span>
            <span class="text-brand">${{ placedOrder.total.toLocaleString() }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink :to="`/order-success/${placedOrder.id}`" class="btn-primary">View Full Order</RouterLink>
          <RouterLink to="/" class="btn-secondary">Continue Shopping</RouterLink>
        </div>
      </div>
    </Transition>

    <!-- ── CHECKOUT FORM ── -->
    <div v-if="!orderPlaced">
      <div class="mb-10">
        <p class="section-label mb-2">Almost There</p>
        <h1 class="display-heading text-5xl">Checkout</h1>
      </div>

      <div v-if="cart.items.length === 0" class="text-center py-16">
        <p class="font-display text-2xl text-stone-400 mb-6">Your cart is empty</p>
        <RouterLink to="/" class="btn-primary">Browse Collection</RouterLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-10">
        <!-- Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact info -->
          <div class="bg-stone-900 border border-stone-800 p-6">
            <h2 class="font-display text-xl mb-5">Contact Information</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">First Name *</label>
                <input v-model="form.firstName" type="text" placeholder="Ama" class="input-field" :class="{ 'border-red-500': errors.firstName }" />
                <p v-if="errors.firstName" class="text-red-400 text-xs mt-1 font-body">{{ errors.firstName }}</p>
              </div>
              <div>
                <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Last Name *</label>
                <input v-model="form.lastName" type="text" placeholder="Mensah" class="input-field" :class="{ 'border-red-500': errors.lastName }" />
                <p v-if="errors.lastName" class="text-red-400 text-xs mt-1 font-body">{{ errors.lastName }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Email *</label>
                <input v-model="form.email" type="email" placeholder="ama@example.com" class="input-field" :class="{ 'border-red-500': errors.email }" />
                <p v-if="errors.email" class="text-red-400 text-xs mt-1 font-body">{{ errors.email }}</p>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Phone</label>
                <input v-model="form.phone" type="tel" placeholder="+233 24 000 0000" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Mock payment -->
          <div class="bg-stone-900 border border-stone-800 p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="font-display text-xl">Payment</h2>
              <span class="text-[10px] tracking-widest uppercase text-stone-600 font-body border border-stone-700 px-2 py-1">Demo Only</span>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Card Number</label>
                <input type="text" value="4242 4242 4242 4242" readonly class="input-field opacity-50 cursor-not-allowed" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Expiry</label>
                  <input type="text" value="12/28" readonly class="input-field opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">CVV</label>
                  <input type="text" value="•••" readonly class="input-field opacity-50 cursor-not-allowed" />
                </div>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-stone-600">
              <span>🔒</span>
              <span class="text-xs font-body">No real payment will be processed — this is a demo.</span>
            </div>
          </div>
        </div>

        <!-- Order summary sidebar -->
        <div>
          <div class="bg-stone-900 border border-stone-800 p-6 sticky top-24">
            <h2 class="font-display text-xl mb-5 pb-4 border-b border-stone-800">Your Order</h2>
            <div class="space-y-4 mb-5">
              <div v-for="item in cart.items" :key="item.product.id" class="flex gap-3">
                <img :src="item.product.image" :alt="item.product.name" class="w-14 h-16 object-cover bg-stone-800 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-display text-sm leading-tight">{{ item.product.name }}</p>
                  <p class="text-xs text-stone-500 font-body mt-0.5">Qty: {{ item.quantity }}</p>
                  <p class="text-brand text-sm font-body mt-1">${{ (item.product.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>
            <div class="space-y-2 pt-4 border-t border-stone-800">
              <div class="flex justify-between text-sm font-body text-stone-400">
                <span>Subtotal</span><span>${{ cart.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm font-body text-stone-400">
                <span>Shipping</span>
                <span :class="cart.shipping === 0 ? 'text-green-400' : ''">
                  {{ cart.shipping === 0 ? 'Free' : `$${cart.shipping}` }}
                </span>
              </div>
              <div class="flex justify-between font-display text-xl pt-3 border-t border-stone-800 mt-2">
                <span>Total</span><span class="text-brand">${{ cart.total.toLocaleString() }}</span>
              </div>
            </div>
            <button
              @click="handlePlaceOrder"
              :disabled="placing"
              class="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              <svg v-if="placing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ placing ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useOrdersStore } from '@/stores/ordersStore'
import type { Order } from '@/types'

const cart = useCartStore()
const ordersStore = useOrdersStore()

const orderPlaced = ref(false)
const placing = ref(false)
const placedOrder = ref<Order | null>(null)

const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', country: '', zip: '',
})

const errors = reactive<Partial<Record<string, string>>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete (errors as any)[k])
  let valid = true
  if (!form.firstName) { errors.firstName = 'Required'; valid = false }
  if (!form.lastName) { errors.lastName = 'Required'; valid = false }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Valid email required'; valid = false }
  return valid
}

async function handlePlaceOrder() {
  if (!validate()) return
  placing.value = true
  await new Promise(r => setTimeout(r, 1400))
  const order = ordersStore.placeOrder(cart.items, { ...form }, cart.subtotal, cart.shipping)
  placedOrder.value = order
  cart.clearCart()
  orderPlaced.value = true
  placing.value = false
}
</script>

<style scoped>
.fade-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(20px); }
</style>
