<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Tasks</h1>
      <div class="actions">
        <button
          class="rounded bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 cursor-pointer me-2"
          @click="showCreateForm"
        >
          Create Task
        </button>
        <button
          class="rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 cursor-pointer"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-2">
      <input v-model="q" placeholder="Search" class="rounded border p-2" />
      <select v-model="status" class="cursor-pointer rounded border p-2">
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select v-model="priority" class="cursor-pointer rounded border p-2">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        v-model="dueDateFrom"
        type="date"
        class="rounded border p-2"
        aria-label="Due date from"
      />
      <input v-model="dueDateTo" type="date" class="rounded border p-2" aria-label="Due date to" />
      <button
        class="cursor-pointer rounded bg-blue-500 p-2 text-sm font-medium text-white hover:bg-blue-600"
        @click="apply"
      >
        Apply
      </button>
    </section>

    <section>
      <div class="flex items-center justify-between mb-2">
        <div class="text-sm text-gray-600">
          Total: {{ meta.total }} | Page {{ meta.page }} / {{ meta.last_page }}
        </div>
        <select v-model="sort" class="border p-1 rounded cursor-pointer" @change="fetch()">
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="title">Title A→Z</option>
          <option value="-title">Title Z→A</option>
        </select>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-10 text-sm text-gray-500">
        Loading tasks...
      </div>

      <!-- Empty state -->
      <div
        v-else-if="items.length === 0"
        class="mt-4 rounded border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center"
      >
        <p class="text-base font-medium text-gray-700">No tasks found</p>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your filters or create your first task.
        </p>
        <button
          class="mt-4 cursor-pointer rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          @click="showCreateForm"
        >
          Create Task
        </button>
      </div>

      <!-- List state -->
      <div v-else>
        <ul class="space-y-2">
          <li v-for="t in items" :key="t.id" class="border rounded p-3">
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
                <button
                  class="rounded border px-2 py-1 text-sm hover:bg-yellow-50 cursor-pointer"
                  @click="showEditForm(t)"
                >
                  Edit
                </button>
                <button
                  class="rounded border px-2 py-1 text-sm hover:bg-red-50 cursor-pointer"
                  @click="askDelete(t)"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="flex items-center justify-end gap-2 mt-3">
          <button
            class="rounded border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            :disabled="meta.page <= 1"
            @click="fetch(meta.page - 1)"
          >
            Prev
          </button>
          <button
            class="rounded border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            :disabled="meta.page >= meta.last_page"
            @click="fetch(meta.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <!-- Modal: Create / Edit Task -->
    <BaseModal v-model="showForm" :title="editing ? 'Edit Task' : 'Create Task'">
      <TaskForm :data="editing ? editForm : form" @submit="handleSubmit" @close="closeForm" />
    </BaseModal>

    <!-- Modal: Delete Confirmation -->
    <BaseModal v-model="showDeleteModal" title="Delete Task" @close="cancelDelete">
      <p class="text-sm text-gray-700">
        Are you sure you want to delete
        <span class="font-semibold"> "{{ deleteTarget ? deleteTarget.title : '' }}" </span>
        ?
      </p>

      <template #footer>
        <button
          type="button"
          class="cursor-pointer rounded border px-3 py-2 text-sm hover:bg-gray-50"
          @click="cancelDelete"
        >
          Cancel
        </button>
        <button
          type="button"
          class="cursor-pointer rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
          @click="confirmDelete"
        >
          Delete
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts" name="TasksPage">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types'
import BaseModal from '@/components/BaseModal.vue'
import TaskForm from '@/components/TaskForm.vue'

const router = useRouter()
const auth = useAuthStore()
const tasks = useTaskStore()

const { items, meta, filters, loading } = storeToRefs(tasks)

const q = ref('')
const status = ref('')
const priority = ref('')
const sort = ref('-created_at')
const dueDateFrom = ref('')
const dueDateTo = ref('')
const showForm = ref(false)

const form = reactive<Task>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
})

const editing = ref(false)
const editId = ref('')
const editForm = reactive<Task>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
})

const showDeleteModal = ref(false)
const deleteTarget = ref<Task | null>(null)

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

function apply() {
  Object.assign(filters.value, {
    q: q.value,
    status: status.value,
    priority: priority.value,
    dueDateFrom: dueDateFrom.value || null,
    dueDateTo: dueDateTo.value || null,
  })
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
  Object.assign(meta.value, { sort: sort.value })
  tasks.fetch(page)
}

function showEditForm(t: Task) {
  editing.value = true
  showForm.value = true
  editId.value = t.id ?? ''
  Object.assign(editForm, t)
}

async function handleSubmit(item: Task) {
  if (editing.value) {
    await tasks.update(editId.value, item)
  } else {
    await tasks.create(item)
  }
  showForm.value = false
}

function askDelete(t: Task) {
  deleteTarget.value = t
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  deleteTarget.value = null
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (target && target.id) {
    await tasks.remove(target.id)
  }
  showDeleteModal.value = false
  deleteTarget.value = null
}

onMounted(fetch)
</script>
