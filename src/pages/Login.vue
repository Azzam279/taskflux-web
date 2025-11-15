<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <form class="w-full max-w-sm space-y-4" @submit.prevent="submit">
      <h1 class="text-2xl font-bold">Login</h1>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border p-2 rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border p-2 rounded"
        required
      />
      <button class="w-full border p-2 rounded hover:bg-gray-50 cursor-pointer" type="submit">
        Sign in
      </button>
      <p class="text-sm text-gray-500">Use any email/password — mock auth.</p>
    </form>
  </div>
</template>

<script setup lang="ts" name="LoginPage">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

async function submit() {
  await auth.login(email.value, password.value)
  localStorage.setItem('ownerId', email.value)
  router.push({ name: 'tasks' })
}
</script>
