<template>
  <div class="min-h-screen bg-stone-950 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <p class="section-label mb-3">Restricted Area</p>
        <h1 class="display-heading text-4xl">Admin Panel</h1>
        <p class="text-stone-500 font-body text-sm mt-2">MAISON Back Office</p>
      </div>

      <div class="bg-stone-900 border border-stone-800 p-8">
        <div class="mb-5">
          <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter admin password"
            class="input-field"
            @keydown.enter="handleLogin"
            autofocus
          />
          <p v-if="admin.error" class="text-red-400 text-xs mt-2 font-body">{{ admin.error }}</p>
        </div>
        <button @click="handleLogin" class="btn-primary w-full flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign In
        </button>
        <p class="text-center text-xs text-stone-700 font-body mt-5">Default password: <code class="text-stone-500">maison2025</code></p>
      </div>

      <RouterLink to="/" class="block text-center text-xs tracking-widest uppercase text-stone-600 hover:text-stone-400 transition-colors font-body mt-6">
        ← Back to Shop
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const admin = useAdminStore()
const router = useRouter()
const password = ref('')

function handleLogin() {
  if (admin.login(password.value)) {
    router.push('/admin/products')
  }
}
</script>
