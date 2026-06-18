<script setup lang="ts">
import type { PeriodeModulRecord } from '../types/periode-modul'

const props = defineProps<{
  rows: PeriodeModulRecord[]
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm">
    <p class="mb-2 font-semibold">Daftar Periode Modul</p>
    <ul class="space-y-1">
      <li v-for="row in props.rows" :key="row.id">
        {{ row.name }} - {{ row.semester }} ({{ row.year }})
      </li>
      <li v-if="props.rows.length === 0" class="text-slate-500">Belum ada data periode.</li>
    </ul>
  </div>
</template>
