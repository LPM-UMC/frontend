<script setup lang="ts">
import ModuleGrid from '../components/ModuleGrid.vue'
import WelcomePanel from '../components/WelcomePanel.vue'
import { useRoleDashboard } from '../composables/useRoleDashboard'

const {
  currentUser,
  roleConfig,
  roleLabel,
  modules,
} = useRoleDashboard()
</script>

<template>
  <div class="mx-auto grid w-full max-w-[1020px] gap-7">
    <WelcomePanel
      :heading="roleConfig.heading"
      :user-name="currentUser.name"
      :role-label="roleLabel"
    />

    <ModuleGrid :modules="modules" />
  </div>
</template>