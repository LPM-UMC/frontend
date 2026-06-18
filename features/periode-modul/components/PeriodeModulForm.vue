<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { PeriodeModulFormInput } from '../types/periode-modul'

const props = defineProps<{
  modelValue?: Partial<PeriodeModulFormInput>
}>()

const emit = defineEmits<{
  submit: [payload: PeriodeModulFormInput]
}>()

const defaults: PeriodeModulFormInput = {
  name: '',
  year: '',
  semester: 'Ganjil',
  status: 'draft',
  startDate: '',
  endDate: '',
}

const form = reactive<PeriodeModulFormInput>({
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
    <input v-model="form.name" type="text" placeholder="Nama periode" class="w-full rounded border px-3 py-2">
    <input v-model="form.year" type="text" placeholder="Tahun akademik" class="w-full rounded border px-3 py-2">
    <select v-model="form.semester" class="w-full rounded border px-3 py-2">
      <option value="Ganjil">Ganjil</option>
      <option value="Genap">Genap</option>
    </select>
    <button type="submit" class="rounded bg-red-600 px-4 py-2 text-white">Simpan</button>
  </form>
</template>
