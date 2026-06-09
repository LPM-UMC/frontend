<script setup lang="ts">
import ProfilePage from '#features/dashboard/pages/ProfilePage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>

<template>
  <ProfilePage />
</template>
