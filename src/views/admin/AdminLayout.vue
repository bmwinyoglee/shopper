<template>
  <div class="min-h-screen bg-stone-950 flex">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col min-h-screen sticky top-0 h-screen">
      <div class="px-6 py-5 border-b border-stone-800">
        <RouterLink to="/" class="font-display text-lg tracking-[0.15em] text-stone-100 block hover:text-brand transition-colors">MAISON</RouterLink>
        <p class="text-[10px] tracking-widest uppercase text-stone-600 font-body mt-0.5">Admin Panel</p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase font-body transition-all rounded-sm"
          :class="isActive(link.to)
            ? 'bg-brand/10 text-brand border-l-2 border-brand pl-[10px]'
            : 'text-stone-500 hover:text-stone-200 hover:bg-stone-800'"
        >
          <span class="text-base leading-none">{{ link.icon }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="px-3 py-4 border-t border-stone-800 space-y-1">
        <RouterLink to="/" class="flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase font-body text-stone-600 hover:text-stone-300 transition-colors">
          <span class="text-base">🏪</span> View Shop
        </RouterLink>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase font-body text-stone-600 hover:text-red-400 transition-colors">
          <span class="text-base">🚪</span> Log Out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const admin = useAdminStore()
const router = useRouter()
const route = useRoute()

const navLinks = [
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
]

function isActive(path: string) { return route.path.startsWith(path) }

function handleLogout() {
  admin.logout()
  router.push('/admin/login')
}
</script>
