<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserFormInput } from '../types/user'

const props = defineProps<{
  modelValue?: Partial<UserFormInput>
}>()

const emit = defineEmits<{
  submit: [payload: UserFormInput]
}>()

const defaults: UserFormInput = {
  name: '',
  email: '',
  role: '',
  status: 'active',
  password: '',
}

const form = reactive<UserFormInput>({
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
    <input v-model="form.name" type="text" placeholder="Nama" class="w-full rounded border px-3 py-2">
    <input v-model="form.email" type="email" placeholder="Email" class="w-full rounded border px-3 py-2">
    <input v-model="form.role" type="text" placeholder="Role" class="w-full rounded border px-3 py-2">
    <select v-model="form.status" class="w-full rounded border px-3 py-2">
      <option value="active">active</option>
      <option value="inactive">inactive</option>
    </select>
    <input v-model="form.password" type="password" placeholder="Password" class="w-full rounded border px-3 py-2">
    <button type="submit" class="rounded bg-red-600 px-4 py-2 text-white">Simpan</button>
  </form>
</template>
