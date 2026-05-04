<script setup lang="ts">
import DashboardHomePage from '#features/dashboard/pages/DashboardHomePages.vue'

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard',
})
</script>

<template>
  <DashboardHomePage />
</template>
