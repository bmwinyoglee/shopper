<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <p class="section-label mb-1">Manage</p>
      <h1 class="display-heading text-4xl">Categories</h1>
      <p class="text-stone-500 font-body text-sm mt-1">
        {{ store.categoriesWithoutAll.length }} categories · {{ store.products.length }} total products
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Category list -->
      <div class="lg:col-span-2">
        <div class="bg-stone-900 border border-stone-800 overflow-hidden">
          <div class="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
            <p class="text-xs tracking-widest uppercase text-stone-400 font-body">All Categories</p>
            <p class="text-xs text-stone-600 font-body">Click a name to rename</p>
          </div>

          <div v-if="store.categoriesWithoutAll.length === 0" class="text-center py-12 text-stone-600 font-body text-sm">
            No categories yet. Add one →
          </div>

          <TransitionGroup name="list" tag="div">
            <div
              v-for="cat in store.categoriesWithoutAll"
              :key="cat"
              class="flex items-center gap-4 px-5 py-4 border-b border-stone-800/60 last:border-0 hover:bg-stone-800/30 transition-colors group"
            >
              <!-- Rename inline -->
              <div class="flex-1 min-w-0">
                <div v-if="editingCat === cat" class="flex gap-2">
                  <input
                    v-model="renameValue"
                    type="text"
                    class="input-field py-1.5 text-sm flex-1"
                    @keydown.enter="saveRename(cat)"
                    @keydown.escape="editingCat = null"
                    ref="renameInput"
                  />
                  <button @click="saveRename(cat)" class="btn-primary py-1.5 px-4 text-xs">Save</button>
                  <button @click="editingCat = null" class="btn-secondary py-1.5 px-3 text-xs">×</button>
                </div>
                <div v-else class="flex items-center gap-3">
                  <span class="font-body text-sm text-stone-100">{{ cat }}</span>
                  <span class="text-xs text-stone-600 font-body">
                    ({{ productCount(cat) }} {{ productCount(cat) === 1 ? 'product' : 'products' }})
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="startRename(cat)"
                  class="text-xs tracking-widest uppercase font-body text-stone-500 hover:text-brand transition-colors"
                >
                  Rename
                </button>
                <button
                  @click="promptDelete(cat)"
                  class="text-xs tracking-widest uppercase font-body text-stone-500 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>

              <!-- Product chips preview -->
              <div class="hidden xl:flex gap-1.5 shrink-0 max-w-[180px] overflow-hidden">
                <img
                  v-for="p in previewProducts(cat)"
                  :key="p.id"
                  :src="p.image"
                  :alt="p.name"
                  class="w-8 h-9 object-cover bg-stone-800"
                  :title="p.name"
                />
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Add category panel -->
      <div>
        <div class="bg-stone-900 border border-stone-800 p-6 sticky top-6">
          <h2 class="font-display text-lg mb-5 pb-4 border-b border-stone-800">Add Category</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs tracking-widest uppercase text-stone-500 font-body mb-2">Category Name *</label>
              <input
                v-model="newCatName"
                type="text"
                placeholder="e.g. Jewellery"
                class="input-field"
                @keydown.enter="handleAdd"
              />
              <p v-if="addError" class="text-red-400 text-xs mt-1.5 font-body">{{ addError }}</p>
            </div>
            <button @click="handleAdd" class="btn-primary w-full">
              Add Category
            </button>
          </div>

          <!-- Stats -->
          <div class="mt-6 pt-5 border-t border-stone-800 space-y-3">
            <p class="text-xs tracking-widest uppercase text-stone-500 font-body mb-3">Quick Stats</p>
            <div
              v-for="cat in store.categoriesWithoutAll"
              :key="cat"
              class="flex items-center justify-between"
            >
              <span class="text-xs font-body text-stone-400">{{ cat }}</span>
              <div class="flex items-center gap-2">
                <div class="h-1.5 bg-stone-800 rounded-full w-20 overflow-hidden">
                  <div
                    class="h-full bg-brand/60 rounded-full transition-all"
                    :style="{ width: `${Math.min(100, (productCount(cat) / store.products.length) * 100)}%` }"
                  />
                </div>
                <span class="text-xs text-stone-600 font-body w-4 text-right">{{ productCount(cat) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="deletingCat" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" @click.self="deletingCat = null">
        <div class="bg-stone-900 border border-stone-700 p-6 max-w-sm w-full animate-slide-up">
          <h3 class="font-display text-xl mb-2">Delete Category?</h3>
          <p class="text-stone-400 font-body text-sm mb-2">
            "<strong class="text-stone-200">{{ deletingCat }}</strong>" will be removed.
          </p>
          <p v-if="productCount(deletingCat) > 0" class="text-yellow-400/80 text-xs font-body mb-5 border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
            ⚠ {{ productCount(deletingCat) }} product(s) in this category will become uncategorized.
          </p>
          <p v-else class="mb-5" />
          <div class="flex gap-3">
            <button @click="executeDelete" class="flex-1 py-2.5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs tracking-widest uppercase font-body hover:bg-red-500/20 transition-colors">
              Delete
            </button>
            <button @click="deletingCat = null" class="flex-1 btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useProductsStore } from '@/stores/productsStore'

const store = useProductsStore()

const newCatName = ref('')
const addError = ref('')
const editingCat = ref<string | null>(null)
const renameValue = ref('')
const deletingCat = ref<string | null>(null)
const renameInput = ref<HTMLInputElement | null>(null)

function productCount(cat: string) {
  return store.products.filter(p => p.category === cat).length
}

function previewProducts(cat: string) {
  return store.products.filter(p => p.category === cat).slice(0, 4)
}

function handleAdd() {
  addError.value = ''
  const name = newCatName.value.trim()
  if (!name) { addError.value = 'Name is required'; return }
  if (store.categories.includes(name)) { addError.value = 'Category already exists'; return }
  store.addCategory(name)
  newCatName.value = ''
}

async function startRename(cat: string) {
  editingCat.value = cat
  renameValue.value = cat
  await nextTick()
  renameInput.value?.focus()
}

function saveRename(oldName: string) {
  const val = renameValue.value.trim()
  if (!val) return
  if (val !== oldName && store.categories.includes(val)) return
  store.renameCategory(oldName, val)
  editingCat.value = null
}

function promptDelete(cat: string) {
  deletingCat.value = cat
}

function executeDelete() {
  if (deletingCat.value) {
    store.deleteCategory(deletingCat.value)
    deletingCat.value = null
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.25s ease; }
.list-enter-from { opacity: 0; transform: translateX(-12px); }
.list-leave-to { opacity: 0; transform: translateX(12px); }
</style>
