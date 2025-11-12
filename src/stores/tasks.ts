import { defineStore } from 'pinia'
import api from '@/services/api'
import { ref, reactive } from 'vue'

export type Task = {
  _id?: string
  title: string
  description?: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string | null
}

export const useTaskStore = defineStore('tasks', () => {
  const items = ref<Task[]>([])
  const meta = reactive({ page: 1, per_page: 10, total: 0, last_page: 1, sort: '-created_at' })
  const filters = reactive<{ status: string; priority: string; q: string }>({ status: '', priority: '', q: '' })

  async function fetch(page = 1) {
    const params: {
      page: number; per_page: number; sort: string; status?: string; priority?: string; q?: string
    } = { page, per_page: meta.per_page, sort: meta.sort }
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.q) params.q = filters.q

    console.log('triggered')
    const { data } = await api.get('/tasks', { params })
    console.log(data.data, 'data')
    items.value = data.data
    console.log(items.value)
    Object.assign(meta, data.meta)
  }

  async function create(payload: Task) {
    console.log(payload)
    const { data } = await api.post('/tasks', payload)
    console.log(data, 'data')
    items.value.unshift(data)
    meta.total += 1
  }

  async function update(id: string, payload: Partial<Task>) {
    const { data } = await api.put(`/tasks/${id}`, payload)
    const idx = items.value.findIndex(t => t._id === id)
    if (idx !== -1) items.value[idx] = data
  }

  async function remove(id: string) {
    await api.delete(`/tasks/${id}`)
    const idx = items.value.findIndex(t => t._id === id)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      meta.total = Math.max(0, meta.total - 1)
    }
  }

  return { items, meta, filters, fetch, create, update, remove }
})
