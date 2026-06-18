import { useAuthStore } from "#stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.initializeAuth();
  }

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }

  if (auth.activeRole?.nama !== "Admin") {
    return navigateTo("/403");
  }
});
