// import { useAuthStore } from "#stores/authStore";
//
// export default defineNuxtRouteMiddleware(async () => {
//   const authStore = useAuthStore();
//
//   if (authStore.isAuthenticated) {
//     return;
//   }
//
//   try {
//     await authStore.initialize();
//   } catch {
//     const localePath = useLocalePath();
//
//     return navigateTo(localePath("/login"));
//   }
//
//   if (!authStore.isAuthenticated) {
//     const localePath = useLocalePath();
//
//     return navigateTo(localePath("/login"));
//   }
// });
