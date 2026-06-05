export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.initAuth();
  }

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }

  if (auth.currentRole?.nama !== "Admin") {
    return navigateTo("/403");
  }
});
