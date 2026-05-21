import { defineStore } from 'pinia'
import { ref } from 'vue'

const ADMIN_PASSWORD = 'maison2025' // change this

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const error = ref('')

  function loadFromStorage() {
    isAuthenticated.value = sessionStorage.getItem('maison-admin') === 'true'
  }

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      error.value = ''
      sessionStorage.setItem('maison-admin', 'true')
      return true
    }
    error.value = 'Incorrect password'
    return false
  }

  function logout() {
    isAuthenticated.value = false
    sessionStorage.removeItem('maison-admin')
  }

  return { isAuthenticated, error, loadFromStorage, login, logout }
})
