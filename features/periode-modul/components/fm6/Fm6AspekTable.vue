<script setup lang="ts">
const props = defineProps<{
  rows: Array<{
    id: string
    title: string
    status?: string
  }>
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm">
    <p class="mb-2 font-semibold">Daftar Aspek Fm6</p>
    <ul class="space-y-1">
      <li v-for="row in props.rows" :key="row.id">{{ row.title }} <span v-if="row.status">({{ row.status }})</span></li>
      <li v-if="props.rows.length === 0" class="text-slate-500">Belum ada data aspek.</li>
    </ul>
  </div>
</template>

