<script setup lang="ts">
import type { UnitRecord } from '../types/unit'

const props = defineProps<{
  rows: UnitRecord[]
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm">
    <p class="mb-2 font-semibold">Daftar Unit</p>
    <ul class="space-y-1">
      <li v-for="row in props.rows" :key="row.id">{{ row.name }}</li>
      <li v-if="props.rows.length === 0" class="text-slate-500">Belum ada data.</li>
    </ul>
  </div>
</template>
