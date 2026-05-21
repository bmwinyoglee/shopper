<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
          alt="Maison collection"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <p class="section-label mb-3 animate-fade-in">New Collection — 2025</p>
        <h1 class="display-heading text-6xl sm:text-7xl lg:text-8xl mb-6 animate-slide-up">
          Curated<br /><em class="text-brand">Living</em>
        </h1>
        <p class="font-body text-stone-400 text-base max-w-md mb-8 animate-slide-up" style="animation-delay:100ms">
          Objects of lasting value. Chosen for their craft, provenance, and the pleasure they bring every day.
        </p>
        <a href="#collection" class="btn-primary inline-block animate-slide-up" style="animation-delay:200ms">
          Explore Collection
        </a>
      </div>
    </section>

    <!-- Collection Section -->
    <section id="collection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p class="section-label mb-2">The Edit</p>
          <h2 class="display-heading text-4xl">All Products</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in productsStore.categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'text-xs tracking-widest uppercase font-body px-4 py-2 border transition-all duration-200',
              selectedCategory === cat
                ? 'border-brand text-brand bg-brand/10'
                : 'border-stone-700 text-stone-500 hover:border-stone-500 hover:text-stone-300'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="(product, i) in filteredProducts"
          :key="product.id"
          :product="product"
          :delay="i * 60"
        />
      </div>

      <div v-if="filteredProducts.length === 0" class="text-center py-20">
        <p class="font-display text-2xl text-stone-500">No products in this category</p>
      </div>
    </section>

    <footer class="border-t border-stone-800 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="font-display text-xl tracking-[0.15em] text-stone-400">MAISON</span>
        <p class="text-xs text-stone-700 font-body tracking-widest uppercase">© 2025 Maison. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/productsStore'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()
const selectedCategory = ref('All')

const filteredProducts = computed(() =>
  selectedCategory.value === 'All'
    ? productsStore.products
    : productsStore.products.filter(p => p.category === selectedCategory.value)
)
</script>
