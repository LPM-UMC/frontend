<script setup lang="ts">
import DashboardModulListPage from '#features/modul/pages/DashboardModulListPage.vue'

definePageMeta({
  layout: "manajemen-modul",
  requiresAuth: true,
})
</script>

<template>
  <DashboardModulListPage />
</template>
