<template>
  <form class="space-y-2" @submit.prevent="save">
    <input v-model="model.title" placeholder="Title" class="w-full border p-2 rounded" required />
    <textarea
      v-model="model.description"
      placeholder="Description"
      class="w-full border p-2 rounded"
    />
    <div class="grid grid-cols-3 gap-2">
      <select v-model="model.status" class="border p-2 rounded">
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select v-model="model.priority" class="border p-2 rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input v-model="model.dueDate" type="date" class="border p-2 rounded" />
    </div>
    <button class="border p-2 rounded hover:bg-gray-50" type="submit">Save</button>
  </form>
</template>

<script setup lang="ts">
type Task = {
  title: string
  description?: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

const model = defineModel<{ modelValue: Task }>()
const emit = defineEmits<{ (e: 'submit'): void }>()

function save() {
  emit('submit')
}
</script>
