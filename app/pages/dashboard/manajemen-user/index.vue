<script setup lang="ts">
import UserListPage from '#features/manajemen-user/pages/UserListPage.vue'

definePageMeta({
  layout: "manajemen-user-role",
  requiresAuth: true,
})
</script>

<template>
  <UserListPage />
</template>
