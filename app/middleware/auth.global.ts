import { useAuthStore } from "#stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // 🔹 Skip route tertentu
  if (
    to.path.startsWith('/auth/google-callback') ||
    to.path.startsWith('/login')
  ) {
    return
  }

  // 🔹 Jika belum init → jalankan
  if (!auth.initialized) {
    await auth.initializeAuth()
  }

  // 🔥 INI YANG PENTING
  const requiresAuth = to.meta.requiresAuth === true

  // 🔹 Jika halaman butuh auth tapi user belum login
  if (requiresAuth && !auth.isAuthenticated) {
    return navigateTo('/login?error=unauthorized')
  }
})
