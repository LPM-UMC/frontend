<script setup lang="ts">
import DashboardLingkupListPage from '#features/lingkup/pages/DashboardLingkupListPage.vue'

definePageMeta({
  layout: "manajemen-modul",
  requiresAuth: true,
})
</script>

<template>
  <DashboardLingkupListPage />
</template>
