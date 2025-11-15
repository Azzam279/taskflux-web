import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { AxiosError } from 'axios'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToastStore()
  const token = ref<string>(localStorage.getItem('token') || '')

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post('/login', { email, password })
      token.value = data.token
      localStorage.setItem('token', data.token)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError?.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.show(errMsg, 'error')
    }
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('ownerId')
  }

  return { token, login, logout }
})
