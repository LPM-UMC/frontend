<script setup lang="ts">
import DashboardCalendarGeneratorPage from '#features/dashboard/pages/DashboardCalendarGeneratorPages.vue'

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
})
</script>

<template>
  <DashboardCalendarGeneratorPage />
</template>
