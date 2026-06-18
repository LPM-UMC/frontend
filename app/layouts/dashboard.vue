<template>
  <div class="flex min-h-screen flex-col bg-[#e4e4e6] text-slate-900">
    <DashboardHeader />

    <main class="flex-1 bg-[#f4f4f4] pt-11 sm:pt-14">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '#features/dashboard/components/DashboardHeader.vue'
</script>
