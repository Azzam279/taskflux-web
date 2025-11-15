<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'min-w-[250px] rounded px-4 py-3 shadow-lg text-white flex items-center justify-between',
          variantClass(t.variant),
        ]"
      >
        <span>{{ t.message }}</span>

        <button class="ml-3 text-white/80 hover:text-white cursor-pointer" @click="remove(t.id)">
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'

const toast = useToastStore()
const { toasts } = storeToRefs(toast)

function remove(id: number) {
  toast.remove(id)
}

function variantClass(variant: string) {
  return {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600 text-black',
    info: 'bg-blue-600',
  }[variant]
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
