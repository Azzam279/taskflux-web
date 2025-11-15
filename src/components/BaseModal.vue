<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      @click.self="onBackdrop"
    >
      <div class="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <!-- Close button -->
        <button
          type="button"
          class="absolute right-3 top-3 text-2xl leading-none text-gray-400 hover:text-gray-700 cursor-pointer"
          @click="close"
        >
          &times;
        </button>

        <!-- Title -->
        <h2 v-if="title" class="mb-4 text-lg font-semibold">
          {{ title }}
        </h2>

        <!-- Content -->
        <div>
          <slot />
        </div>

        <!-- Footer (optional) -->
        <div v-if="$slots.footer" class="mt-4 flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  closeOnBackdrop?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onBackdrop() {
  if (props.closeOnBackdrop !== false) {
    close()
  }
}
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(4px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
