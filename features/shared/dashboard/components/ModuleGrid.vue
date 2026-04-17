<script setup lang="ts">
import type { DashboardModule } from '../types/dashboard'
import ModuleCard from './ModuleCard.vue'

interface Props {
  modules: DashboardModule[]
}

defineProps<Props>()
</script>

<template>
  <section class="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
    <ModuleCard
      v-for="item in modules"
      :key="item.key"
      :module="item"
    />
  </section>
</template>