<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import Fm4GkmfDashboardPage from '#features/periode-modul/pages/fm4/Fm4DashboardPage.vue'
import Fm4KaprodiDashboardPage from '#features/periode-modul/pages/fm4/Fm4KaprodiDashboardPage.vue'
import Fm4OtherRoleDashboardPage from '#features/periode-modul/pages/fm4/Fm4OtherRoleDashboardPage.vue'

definePageMeta({
  layout: 'periode-modul',
})

const route = useRoute()

const activeRole = computed(() => {
  const roleQuery = route.query.role
  const roleValue = Array.isArray(roleQuery) ? roleQuery[0] : roleQuery
  const role = (roleValue ?? '').toLowerCase()

  if (role === 'gkmf') return 'gkmf'
  if (role === 'kaprodi') return 'kaprodi'
  return 'other'
})
</script>

<template>
  <Fm4GkmfDashboardPage v-if="activeRole === 'gkmf'" />
  <Fm4KaprodiDashboardPage v-else-if="activeRole === 'kaprodi'" />
  <Fm4OtherRoleDashboardPage v-else />
</template>
