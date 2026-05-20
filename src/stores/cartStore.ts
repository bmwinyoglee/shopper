import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isDrawerOpen = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const shipping = computed(() => (subtotal.value > 500 ? 0 : 25))

  const total = computed(() => subtotal.value + shipping.value)

  function addItem(product: Product, quantity = 1) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    isDrawerOpen.value = true
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) item.quantity = quantity
  }

  function clearCart() {
    items.value = []
  }

  function openDrawer() { isDrawerOpen.value = true }
  function closeDrawer() { isDrawerOpen.value = false }

  // Manual localStorage persistence
  function loadFromStorage() {
    try {
      const saved = localStorage.getItem('maison-cart')
      if (saved) items.value = JSON.parse(saved)
    } catch {}
  }

  function saveToStorage() {
    localStorage.setItem('maison-cart', JSON.stringify(items.value))
  }

  return {
    items, isDrawerOpen, totalItems, subtotal, shipping, total,
    addItem, removeItem, updateQuantity, clearCart,
    openDrawer, closeDrawer, loadFromStorage, saveToStorage,
  }
})
