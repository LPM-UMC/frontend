import { useAuthStore } from "#stores/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    try {
      await authStore.initialize();

    } catch {

      return;
    }
  }

  if (authStore.isAuthenticated) {
    const localePath = useLocalePath();

    return navigateTo(localePath("/dashboard"));
  }
});
