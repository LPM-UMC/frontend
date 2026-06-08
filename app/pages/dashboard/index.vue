<script setup lang="ts">
import DashboardHomePage from '#features/dashboard/pages/DashboardHomePages.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>

<template>
  <DashboardHomePage />
</template>