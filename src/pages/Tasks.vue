<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Tasks</h1>
      <button class="border p-2 rounded" @click="logout">Logout</button>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-2">
      <input v-model="q" placeholder="Search" class="border p-2 rounded" />
      <select v-model="status" class="border p-2 rounded">
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select v-model="priority" class="border p-2 rounded">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button class="border p-2 rounded" @click="apply">Apply</button>
    </section>

    <div class="flex justify-end">
      <button class="border p-2 rounded" @click="showCreateForm">Create Task</button>
    </div>

    <!-- Create Form -->
    <section v-if="showForm && !editing" class="border rounded p-4 relative">
      <button class="absolute top-2 right-2 text-gray-500 hover:text-black" @click="closeForm">
        ×
      </button>
      <h2 class="font-semibold mb-2">Create Task</h2>
      <TaskForm v-model="form" @submit="create" />
    </section>

    <section>
      <div class="flex items-center justify-between mb-2">
        <div class="text-sm text-gray-600">
          Total: {{ meta.total }} | Page {{ meta.page }} / {{ meta.last_page }}
        </div>
        <select v-model="sort" class="border p-1 rounded" @change="fetch()">
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="title">Title A→Z</option>
          <option value="-title">Title Z→A</option>
        </select>
      </div>

      <ul class="space-y-2">
        <li v-for="t in items" :key="t._id" class="border rounded p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold">{{ t.title }}</div>
              <div class="text-sm text-gray-600">
                {{ t.status }} · {{ t.priority }} ·
                {{ t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—' }}
              </div>
              <p class="text-sm mt-1" v-if="t.description">{{ t.description }}</p>
            </div>
            <div class="space-x-2">
              <button class="border px-2 py-1 rounded" @click="startEdit(t)">Edit</button>
              <button class="border px-2 py-1 rounded" @click="remove(t)">Delete</button>
            </div>
          </div>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-2 mt-3">
        <button
          class="border px-2 py-1 rounded"
          :disabled="meta.page <= 1"
          @click="fetch(meta.page - 1)"
        >
          Prev
        </button>
        <button
          class="border px-2 py-1 rounded"
          :disabled="meta.page >= meta.last_page"
          @click="fetch(meta.page + 1)"
        >
          Next
        </button>
      </div>
    </section>

    <section v-if="editing" class="border rounded p-4 bg-yellow-50">
      <h2 class="font-semibold mb-2">Edit Task</h2>
      <TaskForm v-model="editForm" @submit="update" />
    </section>
  </div>
</template>

<script setup lang="ts" name="TasksPage">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'

interface Task {
  _id?: string
  title: string
  description?: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

const auth = useAuthStore()
const tasks = useTaskStore()
const router = useRouter()

const { items, meta, filters } = storeToRefs(tasks)

const q = ref('')
const status = ref('')
const priority = ref('')
const sort = ref('-created_at')
const form = reactive<Task>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
})

const showForm = ref(false)
const editing = ref(false)
const editId = ref('')
const editForm = reactive<Task>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
})

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

function apply() {
  Object.assign(filters, {
    q: q.value,
    status: status.value,
    priority: priority.value,
  })
  Object.assign(meta, { sort: sort.value })
  // meta.sort = sort.value
  fetch()
}

function showCreateForm() {
  editing.value = false
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function fetch(page = 1) {
  tasks.fetch(page)
}

async function create() {
  console.log(form, 'form')
  await tasks.create({ ...form })
  // Object.assign(form, {
  //   _id: '',
  //   title: '',
  //   description: '',
  //   status: 'todo',
  //   priority: 'medium',
  //   dueDate: '',
  // })
}

function startEdit(t: Task) {
  editing.value = true
  editId.value = t._id ?? ''
  Object.assign(editForm, t)
}

async function update() {
  await tasks.update(editId.value, { ...editForm })
  editing.value = false
}

async function remove(t: Task) {
  const id = t._id ?? ''
  if (confirm('Delete task?')) await tasks.remove(id)
}

onMounted(fetch)
</script>
