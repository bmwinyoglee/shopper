<template>
  <div class="product-card animate-slide-up" :style="{ animationDelay: `${delay}ms` }">
    <!-- Image wrapper -->
    <RouterLink :to="`/product/${product.id}`" class="block relative overflow-hidden aspect-[3/4] bg-stone-900">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Sale badge -->
      <div v-if="product.originalPrice" class="absolute top-3 left-3 bg-brand text-stone-950 text-[10px] font-body font-semibold tracking-widest uppercase px-2 py-1">
        Sale
      </div>
      <!-- Out of stock overlay -->
      <div v-if="!product.inStock" class="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
        <span class="text-stone-300 text-xs tracking-widest uppercase font-body border border-stone-500 px-3 py-1.5">Sold Out</span>
      </div>
      <!-- Quick add overlay -->
      <div v-if="product.inStock" class="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-stone-950/95 backdrop-blur-sm">
        <button
          @click.prevent="handleAddToCart"
          class="w-full py-3.5 text-xs tracking-widest uppercase font-body text-stone-100 hover:text-brand transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add to Bag
        </button>
      </div>
    </RouterLink>

    <!-- Info -->
    <div class="p-4">
      <p class="text-[10px] tracking-[0.18em] uppercase text-stone-500 font-body mb-1">{{ product.brand }}</p>
      <RouterLink :to="`/product/${product.id}`" class="block">
        <h3 class="font-display text-base leading-tight text-stone-100 hover:text-brand transition-colors">
          {{ product.name }}
        </h3>
      </RouterLink>
      <div class="flex items-center gap-2 mt-2">
        <span class="font-body text-sm text-brand font-medium">${{ product.price.toLocaleString() }}</span>
        <span v-if="product.originalPrice" class="font-body text-xs text-stone-600 line-through">${{ product.originalPrice.toLocaleString() }}</span>
      </div>
      <!-- Stars -->
      <div class="flex items-center gap-1.5 mt-2">
        <div class="flex">
          <svg v-for="i in 5" :key="i" class="w-3 h-3" :class="i <= Math.round(product.rating) ? 'text-brand' : 'text-stone-700'" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <span class="text-[10px] text-stone-600 font-body">({{ product.reviews }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps<{ product: Product; delay?: number }>()
const cart = useCartStore()

function handleAddToCart() {
  cart.addItem(props.product, 1)
}
</script>
