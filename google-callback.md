<!-- pages/auth/google-callback.vue -->
<!-- <script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()

const email = (route.query.email as string) || ''
const google_id = (route.query.google_id as string) || ''

// Kalau backend belum mengirim query param, kamu akan mental balik login.
if (!email && !google_id) {
  await navigateTo('/login?error=callback')
}

// Ambil data user dari mock server
try {
  const res = await $fetch<{ data: any }>(
    `${config.public.mockBase}/api/users?email=${encodeURIComponent(email)}&google_id=${encodeURIComponent(google_id)}`
  )

  // Simpan login state
  auth.setUser(res.data)

  // Masuk dashboard/admin
  await navigateTo('/dashboard')
} catch {
  await navigateTo('/login?error=not-registered')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <p>Memproses login Google...</p>
  </div>
</template> -->
