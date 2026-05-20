import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, CartItem, CustomerInfo } from '@/types'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem('maison-orders')
      if (saved) orders.value = JSON.parse(saved)
    } catch {}
  }

  function saveToStorage() {
    localStorage.setItem('maison-orders', JSON.stringify(orders.value))
  }

  function placeOrder(items: CartItem[], customer: CustomerInfo, subtotal: number, shipping: number): Order {
    const order: Order = {
      id: `MSN-${Date.now().toString(36).toUpperCase()}`,
      items: JSON.parse(JSON.stringify(items)),
      total: subtotal + shipping,
      subtotal,
      shipping,
      customer,
      status: 'processing',
      createdAt: new Date().toISOString(),
    }
    orders.value.unshift(order)
    saveToStorage()
    return order
  }

  return { orders, loadFromStorage, saveToStorage, placeOrder }
})
