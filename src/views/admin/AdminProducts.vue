<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <p class="section-label mb-1">Manage</p>
        <h1 class="display-heading text-4xl">Products</h1>
        <p class="text-stone-500 font-body text-sm mt-1">{{ store.products.length }} total products</p>
      </div>
      <button @click="openAdd" class="btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Search + filter -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="search" type="text" placeholder="Search products..." class="input-field max-w-xs" />
      <select v-model="filterCat" class="input-field w-auto">
        <option value="">All Categories</option>
        <option v-for="cat in store.categoriesWithoutAll" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="filterStock" class="input-field w-auto">
        <option value="">All Stock</option>
        <option value="true">In Stock</option>
        <option value="false">Out of Stock</option>
      </select>
    </div>

    <!-- Products table -->
    <div class="bg-stone-900 border border-stone-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-stone-800">
              <th class="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Product</th>
              <th class="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Category</th>
              <th class="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Price</th>
              <th class="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Stock</th>
              <th class="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Featured</th>
              <th class="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-stone-500 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="text-center py-12 text-stone-600 font-body">No products found</td>
            </tr>
            <tr
              v-for="product in filtered"
              :key="product.id"
              class="border-b border-stone-800/50 last:border-0 hover:bg-stone-800/30 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="product.image" :alt="product.name" class="w-10 h-12 object-cover bg-stone-800 shrink-0" />
                  <div>
                    <p class="font-body text-sm text-stone-100 font-medium">{{ product.name }}</p>
                    <p class="text-[10px] text-stone-500 tracking-widest uppercase">{{ product.brand }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs font-body text-stone-400 border border-stone-700 px-2 py-0.5">{{ product.category || '—' }}</span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm font-body text-brand">${{ product.price.toLocaleString() }}</p>
                <p v-if="product.originalPrice" class="text-xs text-stone-600 line-through">${{ product.originalPrice.toLocaleString() }}</p>
              </td>
              <td class="px-4 py-3">
                <button @click="store.updateProduct(product.id, { inStock: !product.inStock })" :class="product.inStock ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'" class="text-xs font-body tracking-widest uppercase border px-2 py-0.5 hover:opacity-70 transition-opacity">
                  {{ product.inStock ? 'In Stock' : 'Sold Out' }}
                </button>
              </td>
              <td class="px-4 py-3">
                <button @click="store.updateProduct(product.id, { featured: !product.featured })" class="transition-colors">
                  <span :class="product.featured ? 'text-brand' : 'text-stone-700'" class="text-lg">★</span>
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-3">
                  <button @click="openEdit(product)" class="text-xs tracking-widest uppercase font-body text-stone-500 hover:text-brand transition-colors">Edit</button>
                  <button @click="confirmDelete(product)" class="text-xs tracking-widest uppercase font-body text-stone-500 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="deletingProduct" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="deletingProduct = null">
        <div class="bg-stone-900 border border-stone-700 p-6 max-w-sm w-full">
          <h3 class="font-display text-xl mb-2">Delete Product?</h3>
          <p class="text-stone-400 font-body text-sm mb-6">
            "<strong class="text-stone-200">{{ deletingProduct.name }}</strong>" will be permanently removed from your store.
          </p>
          <div class="flex gap-3">
            <button @click="executeDelete" class="flex-1 py-2.5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs tracking-widest uppercase font-body hover:bg-red-500/20 transition-colors">
              Delete
            </button>
            <button @click="deletingProduct = null" class="flex-1 btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-end" @click.self="showModal = false">
        <div class="bg-stone-900 border-l border-stone-800 w-full max-w-lg h-full overflow-y-auto animate-slide-in-right">
          <div class="px-6 py-5 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
            <h2 class="font-display text-xl">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h2>
            <button @click="showModal = false" class="text-stone-500 hover:text-stone-100 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Image preview -->
            <div v-if="form.image" class="aspect-video overflow-hidden bg-stone-800">
              <img :src="form.image" alt="Preview" class="w-full h-full object-cover" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="form-label">Product Name *</label>
                <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Obsidian Chronograph" />
                <p v-if="formErrors.name" class="text-red-400 text-xs mt-1">{{ formErrors.name }}</p>
              </div>
              <div>
                <label class="form-label">Brand *</label>
                <input v-model="form.brand" type="text" class="input-field" placeholder="e.g. MAISON CO." />
              </div>
              <div>
                <label class="form-label">Category *</label>
                <select v-model="form.category" class="input-field">
                  <option value="">Select...</option>
                  <option v-for="cat in store.categoriesWithoutAll" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Price ($) *</label>
                <input v-model.number="form.price" type="number" min="0" class="input-field" placeholder="0" />
                <p v-if="formErrors.price" class="text-red-400 text-xs mt-1">{{ formErrors.price }}</p>
              </div>
              <div>
                <label class="form-label">Original Price ($) <span class="text-stone-600">(sale)</span></label>
                <input v-model.number="form.originalPrice" type="number" min="0" class="input-field" placeholder="Optional" />
              </div>
            </div>

            <div>
              <label class="form-label">Short Description *</label>
              <input v-model="form.description" type="text" class="input-field" placeholder="One-line summary" />
            </div>

            <div>
              <label class="form-label">Full Description</label>
              <textarea v-model="form.longDescription" rows="4" class="input-field resize-none" placeholder="Detailed product description..." />
            </div>

            <div>
              <label class="form-label">Main Image URL *</label>
              <input v-model="form.image" type="url" class="input-field" placeholder="https://..." />
              <p class="text-xs text-stone-600 font-body mt-1">Upload to imgbb.com for a free direct URL</p>
            </div>

            <div>
              <label class="form-label">Additional Image URLs <span class="text-stone-600">(one per line)</span></label>
              <textarea v-model="extraImages" rows="3" class="input-field resize-none font-mono text-xs" placeholder="https://image2.com/...&#10;https://image3.com/..." />
            </div>

            <div>
              <label class="form-label">Tags <span class="text-stone-600">(comma-separated)</span></label>
              <input v-model="tagsInput" type="text" class="input-field" placeholder="luxury, handmade, limited" />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="form-label">Rating</label>
                <input v-model.number="form.rating" type="number" min="1" max="5" step="0.1" class="input-field" />
              </div>
              <div>
                <label class="form-label">Reviews</label>
                <input v-model.number="form.reviews" type="number" min="0" class="input-field" />
              </div>
            </div>

            <div class="flex flex-wrap gap-6 pt-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="form.inStock" class="w-4 h-4 accent-brand" />
                <span class="text-xs tracking-widest uppercase font-body text-stone-400">In Stock</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="form.featured" class="w-4 h-4 accent-brand" />
                <span class="text-xs tracking-widest uppercase font-body text-stone-400">Featured</span>
              </label>
            </div>

            <div class="flex gap-3 pt-2 border-t border-stone-800">
              <button @click="handleSave" class="btn-primary flex-1">
                {{ editingProduct ? 'Save Changes' : 'Add Product' }}
              </button>
              <button @click="showModal = false" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useProductsStore } from '@/stores/productsStore'
import type { Product } from '@/types'

const store = useProductsStore()

const search = ref('')
const filterCat = ref('')
const filterStock = ref('')

const filtered = computed(() => {
  return store.products.filter(p => {
    const matchSearch = !search.value || p.name.toLowerCase().includes(search.value.toLowerCase()) || p.brand.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCat.value || p.category === filterCat.value
    const matchStock = !filterStock.value || String(p.inStock) === filterStock.value
    return matchSearch && matchCat && matchStock
  })
})

// Modal state
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const deletingProduct = ref<Product | null>(null)
const extraImages = ref('')
const tagsInput = ref('')

const form = reactive({
  name: '', brand: '', category: '', price: 0, originalPrice: undefined as number | undefined,
  description: '', longDescription: '', image: '', rating: 4.5, reviews: 0,
  inStock: true, featured: false,
})

const formErrors = reactive<Record<string, string>>({})

function resetForm() {
  Object.assign(form, {
    name: '', brand: '', category: '', price: 0, originalPrice: undefined,
    description: '', longDescription: '', image: '', rating: 4.5, reviews: 0,
    inStock: true, featured: false,
  })
  extraImages.value = ''
  tagsInput.value = ''
  Object.keys(formErrors).forEach(k => delete formErrors[k])
}

function openAdd() {
  editingProduct.value = null
  resetForm()
  showModal.value = true
}

function openEdit(product: Product) {
  editingProduct.value = product
  Object.assign(form, {
    name: product.name, brand: product.brand, category: product.category,
    price: product.price, originalPrice: product.originalPrice,
    description: product.description, longDescription: product.longDescription,
    image: product.image, rating: product.rating, reviews: product.reviews,
    inStock: product.inStock, featured: product.featured ?? false,
  })
  extraImages.value = product.images.filter(i => i !== product.image).join('\n')
  tagsInput.value = product.tags.join(', ')
  showModal.value = true
}

function validate(): boolean {
  Object.keys(formErrors).forEach(k => delete formErrors[k])
  let ok = true
  if (!form.name.trim()) { formErrors.name = 'Name is required'; ok = false }
  if (!form.price || form.price <= 0) { formErrors.price = 'Valid price required'; ok = false }
  return ok
}

function handleSave() {
  if (!validate()) return
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  const images = [form.image, ...extraImages.value.split('\n').map(s => s.trim()).filter(Boolean)]
  const payload = { ...form, tags, images }
  if (!payload.originalPrice) delete payload.originalPrice

  if (editingProduct.value) {
    store.updateProduct(editingProduct.value.id, payload)
  } else {
    store.addProduct(payload)
  }
  showModal.value = false
}

function confirmDelete(product: Product) {
  deletingProduct.value = product
}

function executeDelete() {
  if (deletingProduct.value) {
    store.deleteProduct(deletingProduct.value.id)
    deletingProduct.value = null
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-xs tracking-widest uppercase text-stone-500 font-body mb-1.5;
}
</style>
