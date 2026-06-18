<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '#stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  try {
    await auth.refreshAccessToken()
    await auth.fetchMe()

    auth.initialized = true

    if (!auth.isAuthenticated) {
      await navigateTo('/login?error=callback')
      return
    }

    await navigateTo('/dashboard')

  } catch {
    auth.accessToken = null
    auth.user = null
    auth.initialized = true

    await navigateTo('/login?error=callback')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <svg class="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
</template>
