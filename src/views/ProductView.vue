<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <button @click="router.back()" class="flex items-center gap-2 text-stone-500 hover:text-stone-100 transition-colors mb-10 text-sm font-body tracking-widest uppercase">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back
    </button>

    <div v-if="product" class="grid lg:grid-cols-2 gap-12 xl:gap-20">
      <!-- Images -->
      <div class="space-y-3">
        <div class="aspect-[4/5] overflow-hidden bg-stone-900">
          <img :src="selectedImage" :alt="product.name" class="w-full h-full object-cover transition-opacity duration-300" />
        </div>
        <div v-if="product.images.length > 1" class="flex gap-3">
          <button
            v-for="(img, i) in product.images"
            :key="i"
            @click="selectedImage = img"
            :class="['w-20 h-24 overflow-hidden border-2 transition-all', selectedImage === img ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100']"
          >
            <img :src="img" :alt="`${product.name} ${i+1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="animate-slide-up">
        <p class="section-label mb-3">{{ product.brand }}</p>
        <h1 class="display-heading text-4xl sm:text-5xl mb-4 leading-tight">{{ product.name }}</h1>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex">
            <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(product.rating) ? 'text-brand' : 'text-stone-700'" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-sm text-stone-400 font-body">{{ product.rating }} ({{ product.reviews }} reviews)</span>
        </div>

        <div class="flex items-baseline gap-3 mb-8 pb-8 border-b border-stone-800">
          <span class="font-display text-3xl text-brand">${{ product.price.toLocaleString() }}</span>
          <span v-if="product.originalPrice" class="font-body text-lg text-stone-600 line-through">${{ product.originalPrice.toLocaleString() }}</span>
          <span v-if="product.originalPrice" class="text-xs text-brand/80 font-body tracking-widest uppercase border border-brand/30 px-2 py-0.5">
            Save ${{ (product.originalPrice - product.price).toLocaleString() }}
          </span>
        </div>

        <p class="font-body text-stone-400 leading-relaxed mb-8">{{ product.longDescription }}</p>

        <div class="flex flex-wrap gap-2 mb-8">
          <span v-for="tag in product.tags" :key="tag" class="text-[10px] tracking-widest uppercase font-body text-stone-500 border border-stone-800 px-3 py-1">
            {{ tag }}
          </span>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <label class="text-xs tracking-widest uppercase text-stone-500 font-body">Quantity</label>
          <div class="flex items-center border border-stone-700">
            <button @click="qty = Math.max(1, qty - 1)" class="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors">−</button>
            <span class="w-10 text-center font-body">{{ qty }}</span>
            <button @click="qty++" class="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors">+</button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleAddToCart"
            :disabled="!product.inStock || added"
            class="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <svg v-if="!added" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {{ !product.inStock ? 'Sold Out' : added ? 'Added!' : 'Add to Bag' }}
          </button>
          <RouterLink to="/checkout" v-if="product.inStock" class="btn-secondary flex-1 text-center flex items-center justify-center">
            Buy Now
          </RouterLink>
        </div>

        <div class="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-stone-800">
          <div v-for="info in infoPills" :key="info.label" class="text-center">
            <div class="text-xl mb-1">{{ info.icon }}</div>
            <p class="text-[10px] tracking-widest uppercase text-stone-500 font-body">{{ info.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-32">
      <p class="font-display text-3xl text-stone-400">Product not found</p>
      <RouterLink to="/" class="btn-primary mt-6 inline-block">Return to Shop</RouterLink>
    </div>

    <div v-if="relatedProducts.length > 0" class="mt-24">
      <div class="flex items-center gap-6 mb-8">
        <p class="section-label">You May Also Like</p>
        <div class="flex-1 h-px bg-stone-800" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard v-for="(p, i) in relatedProducts" :key="p.id" :product="p" :delay="i * 80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/productsStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cart = useCartStore()

const qty = ref(1)
const added = ref(false)

const product = computed(() => productsStore.products.find(p => p.id === Number(route.params.id)))
const selectedImage = ref(product.value?.image || '')

watch(() => route.params.id, () => {
  qty.value = 1
  added.value = false
  selectedImage.value = product.value?.image || ''
})

const relatedProducts = computed(() =>
  product.value
    ? productsStore.products.filter(p => p.category === product.value!.category && p.id !== product.value!.id).slice(0, 4)
    : []
)

const infoPills = [
  { icon: '🚚', label: 'Free Shipping $500+' },
  { icon: '↩️', label: '30-Day Returns' },
  { icon: '✦', label: 'Authenticity Cert.' },
]

function handleAddToCart() {
  if (!product.value) return
  cart.addItem(product.value, qty.value)
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}
</script>
