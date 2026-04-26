<script setup lang="ts">
import type { UserRecord } from '../types/user'

const props = defineProps<{
  rows: UserRecord[]
}>()

const emit = defineEmits<{
  detail: [id: string]
  edit: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="px-4 py-2">Nama</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Role</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in props.rows" :key="row.id" class="border-t border-slate-100">
          <td class="px-4 py-2">{{ row.name }}</td>
          <td class="px-4 py-2">{{ row.email }}</td>
          <td class="px-4 py-2">{{ row.role }}</td>
          <td class="px-4 py-2">{{ row.status }}</td>
          <td class="px-4 py-2">
            <div class="flex gap-2">
              <button type="button" class="text-blue-600" @click="emit('detail', row.id)">Detail</button>
              <button type="button" class="text-amber-600" @click="emit('edit', row.id)">Edit</button>
              <button type="button" class="text-rose-600" @click="emit('remove', row.id)">Hapus</button>
            </div>
          </td>
        </tr>
        <tr v-if="props.rows.length === 0">
          <td colspan="5" class="px-4 py-6 text-center text-slate-500">Belum ada data user.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
