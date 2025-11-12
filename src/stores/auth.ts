import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')

  async function login(email: string, password: string) {
    const { data } = await api.post('/login', { email, password })
    token.value = data.token
    localStorage.setItem('token', data.token)
    return true
  }


  function logout() {
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('ownerId')
  }


  return { token, login, logout }
})
