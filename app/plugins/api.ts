// import { defineNuxtPlugin } from "#app";
// import { useAuthStore } from "#stores/authStore";
//
// export default defineNuxtPlugin(() => {
//   const config = useRuntimeConfig();
//
//   const api = $fetch.create({
//     baseURL: config.public.apiBaseUrl as string || "http://localhost:3001/api",
//     credentials: "include",
//
//     async onRequest({ options }) {
//       const authStore = useAuthStore();
//
//       const lang = useI18n().locale.value;
//
//       options.headers = {
//         ...(options.headers || {}),
//         "Accept-Language": lang,
//       };
//
//       if (authStore.accessToken?.token) {
//         options.headers = {
//           ...(options.headers || {}),
//           Authorization:
//             `Bearer ${authStore.accessToken.token}`,
//         };
//       }
//     },
//
//     async onResponseError(ctx) {
//       const authStore = useAuthStore();
//
//       if (ctx.response.status !== 401) {
//         return;
//       }
//
//       const isRefreshRequest =
//         ctx.request?.toString().includes("/auth/refresh");
//
//       if (isRefreshRequest) {
//         await authStore.logout();
//         return;
//       }
//
//       try {
//         const refreshResponse = await $fetch<{
//           data: {
//             token: string;
//             type: string;
//             expires_in: number;
//           };
//         }>("/auth/refresh", {
//           baseURL: config.public.apiBaseUrl as string || "http://localhost:3001/api",
//           credentials: "include",
//           headers: {
//             "Accept-Language":
//               useI18n().locale.value,
//           },
//         });
//
//         authStore.accessToken = refreshResponse.data;
//
//         return await $fetch(ctx.request, {
//           ...ctx.options,
//           headers: {
//             ...(ctx.options.headers || {}),
//             Authorization:
//               `Bearer ${refreshResponse.data.token}`,
//           },
//         });
//       } catch {
//         await authStore.logout();
//       }
//     },
//   });
//
//   return {
//     provide: {
//       api,
//     },
//   };
// });
