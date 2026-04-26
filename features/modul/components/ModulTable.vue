<script setup lang="ts">
import type { ModulRecord } from '../types/modul'

const props = defineProps<{
  rows: ModulRecord[]
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm text-slate-700">
    <p class="mb-2 font-semibold">Daftar Modul</p>
    <ul class="space-y-1">
      <li v-for="row in props.rows" :key="row.id">{{ row.name }}</li>
      <li v-if="props.rows.length === 0" class="text-slate-500">Belum ada modul.</li>
    </ul>
  </div>
</template>
