<template>
  <form class="space-y-2" @submit.prevent="save">
    <input v-model="model.title" placeholder="Title" class="w-full rounded border p-2" required />
    <textarea
      v-model="model.description"
      placeholder="Description"
      class="w-full rounded border p-2"
    />
    <div class="grid grid-cols-3 gap-2">
      <select v-model="model.status" class="rounded border p-2 cursor-pointer">
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select v-model="model.priority" class="rounded border p-2 cursor-pointer">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input v-model="model.dueDate" type="date" class="rounded border p-2" />
    </div>
    <div class="flex justify-end gap-2 pt-2">
      <button
        type="button"
        class="rounded border px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        class="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
        type="submit"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task } from '@/types'
import { isoToDateInput } from '@/utils/dateUtils'

const { data } = defineProps<{
  data: Task
}>()

const model = ref<Task>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'low',
  dueDate: '',
})

watch(
  () => data,
  (newForm) => {
    model.value.title = newForm.title
    model.value.description = newForm.description
    model.value.status = newForm.status
    model.value.priority = newForm.priority
    model.value.dueDate = isoToDateInput(newForm.dueDate)
  },
  { immediate: true },
)

const emit = defineEmits<{
  (e: 'submit', payload: Task): void
  (e: 'close'): void
}>()

function save() {
  emit('submit', model.value)
}
</script>
