export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.initAuth();
  }

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
