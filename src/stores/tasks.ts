import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { Task } from '@/types'
import type { AxiosError } from 'axios'
import api from '@/services/api'

export const useTaskStore = defineStore('tasks', () => {
  const toast = useToastStore()
  const loading = ref(false)
  const items = ref<Task[]>([])
  const meta = reactive({ page: 1, per_page: 10, total: 0, last_page: 1, sort: '-created_at' })
  const filters = reactive<{ status: string; priority: string; q: string, dueDateFrom: string | null, dueDateTo: string | null }>({ status: '', priority: '', q: '', dueDateFrom: '', dueDateTo: '' })

  async function fetch(page = 1) {
    const params: {
      page: number; per_page: number; sort: string; status?: string; priority?: string; q?: string, dueFrom?: string | null; dueTo?: string | null
    } = { page, per_page: meta.per_page, sort: meta.sort }
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.q) params.q = filters.q
    if (filters.dueDateFrom) params.dueFrom = filters.dueDateFrom
    if (filters.dueDateTo) params.dueTo = filters.dueDateTo

    loading.value = true
    try {
      const { data } = await api.get('/tasks', { params })
      items.value = data.data
      Object.assign(meta, data.meta)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError?.response?.data?.message || 'Failed to fetch tasks.'
      toast.show(errMsg, 'error')
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Task) {
    try {
      await api.post('/tasks', payload)
      fetch()
      toast.show("Task created successfully!", "success")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError?.response?.data?.message || 'Failed to create task.'
      toast.show(errMsg, 'error')
    }
  }

  async function update(id: string, payload: Partial<Task>) {
    try {
      const { data } = await api.put(`/tasks/${id}`, payload)
      const idx = items.value.findIndex(t => t.id === id)
      if (idx !== -1) items.value[idx] = data
      toast.show("Task updated successfully!", "success")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError?.response?.data?.message || 'Failed to update task.'
      toast.show(errMsg, 'error')
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/tasks/${id}`)
      fetch()
      toast.show("Task deleted", "success")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError?.response?.data?.message || 'Failed to delete task.'
      toast.show(errMsg, 'error')
    }
  }

  return { items, loading, meta, filters, fetch, create, update, remove }
})
