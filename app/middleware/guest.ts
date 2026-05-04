import { useAuthStore } from "#stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // 🔹 Hindari race condition
  if (auth.isLoading) return

  // 🔹 Init auth jika belum
  if (!auth.isInitialized) {
    await auth.initAuth()
  }

  // 🔥 Jika sudah login → redirect ke dashboard
  if (auth.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
