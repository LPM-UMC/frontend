<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { LingkupFormInput } from '../types/lingkup'

const props = defineProps<{
  modelValue?: Partial<LingkupFormInput>
}>()

const emit = defineEmits<{
  submit: [payload: LingkupFormInput]
}>()

const defaults: LingkupFormInput = {
  name: '',
  description: '',
}

const form = reactive<LingkupFormInput>({
  ...defaults,
  ...(props.modelValue ?? {}),
})

watch(
  () => props.modelValue,
  (next) => {
    Object.assign(form, defaults, next ?? {})
  },
  { deep: true }
)

function submitForm() {
  emit('submit', {
    ...form,
  })
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submitForm">
    <input v-model="form.name" type="text" placeholder="Nama lingkup" class="w-full rounded border px-3 py-2">
    <textarea v-model="form.description" rows="3" placeholder="Deskripsi" class="w-full rounded border px-3 py-2" />
    <button type="submit" class="rounded bg-red-600 px-4 py-2 text-white">Simpan</button>
  </form>
</template>
