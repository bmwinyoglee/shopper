import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { products as initialProducts, categories as initialCategories } from '@/data/products'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<string[]>([])

  function loadFromStorage() {
    try {
      const savedProducts = localStorage.getItem('maison-products')
      const savedCategories = localStorage.getItem('maison-categories')
      products.value = savedProducts ? JSON.parse(savedProducts) : [...initialProducts]
      categories.value = savedCategories ? JSON.parse(savedCategories) : [...initialCategories]
    } catch {
      products.value = [...initialProducts]
      categories.value = [...initialCategories]
    }
  }

  function saveToStorage() {
    localStorage.setItem('maison-products', JSON.stringify(products.value))
    localStorage.setItem('maison-categories', JSON.stringify(categories.value))
  }

  function addProduct(product: Omit<Product, 'id'>) {
    const maxId = products.value.reduce((m, p) => Math.max(m, p.id), 0)
    const newProduct: Product = { ...product, id: maxId + 1 }
    products.value.unshift(newProduct)
    saveToStorage()
    return newProduct
  }

  function updateProduct(id: number, updates: Partial<Product>) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updates }
      saveToStorage()
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter(p => p.id !== id)
    saveToStorage()
  }

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (trimmed && !categories.value.includes(trimmed)) {
      categories.value.push(trimmed)
      saveToStorage()
    }
  }

  function renameCategory(oldName: string, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed || oldName === 'All') return
    const idx = categories.value.indexOf(oldName)
    if (idx !== -1) {
      categories.value[idx] = trimmed
      // update all products in that category
      products.value.forEach(p => { if (p.category === oldName) p.category = trimmed })
      saveToStorage()
    }
  }

  function deleteCategory(name: string) {
    if (name === 'All') return
    categories.value = categories.value.filter(c => c !== name)
    // uncategorize products
    products.value.forEach(p => { if (p.category === name) p.category = '' })
    saveToStorage()
  }

  const getById = computed(() => (id: number) => products.value.find(p => p.id === id))

  const categoriesWithoutAll = computed(() => categories.value.filter(c => c !== 'All'))

  return {
    products, categories, categoriesWithoutAll,
    loadFromStorage, saveToStorage,
    addProduct, updateProduct, deleteProduct,
    addCategory, renameCategory, deleteCategory,
    getById,
  }
})
