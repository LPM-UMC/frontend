<script setup lang="ts">
const props = defineProps<{
  items: Array<{
    id: string
    label: string
    href?: string
  }>
}>()
</script>

<template>
  <div class="rounded border border-slate-200 p-4 text-sm">
    <p class="mb-2 font-semibold">Daftar Bukti Fm2</p>
    <ul class="space-y-1">
      <li v-for="item in props.items" :key="item.id">
        <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">{{ item.label }}</a>
        <span v-else>{{ item.label }}</span>
      </li>
      <li v-if="props.items.length === 0" class="text-slate-500">Belum ada bukti.</li>
    </ul>
  </div>
</template>

