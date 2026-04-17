<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="relative">
    <input
      id="input-search-module"
      type="text"
      :value="modelValue"
      :placeholder="placeholder ?? 'Search ...'"
      class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 pr-12 text-sm text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
      <svg viewBox="0 0 24 24" class="h-5 w-5">
        <path
          d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </div>
  </div>
</template>
