<script setup lang="ts">
import DashboardLingkupCreatePage from '#features/lingkup/pages/DashboardLingkupCreatePage.vue'

definePageMeta({
  layout: "manajemen-modul",
  requiresAuth: true,
})
</script>

<template>
  <DashboardLingkupCreatePage />
</template>
