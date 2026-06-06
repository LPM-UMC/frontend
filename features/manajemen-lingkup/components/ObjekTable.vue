<script setup lang="ts">
import type { ObjekRecord } from '../types/objek'

const props = defineProps<{
  rows: ObjekRecord[]
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm">
    <p class="mb-2 font-semibold">Daftar Objek</p>
    <ul class="space-y-1">
      <li v-for="row in props.rows" :key="row.id">{{ row.name }}</li>
      <li v-if="props.rows.length === 0" class="text-slate-500">Belum ada data.</li>
    </ul>
  </div>
</template>
