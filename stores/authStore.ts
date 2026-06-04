// import { defineStore } from "pinia";
// import { useLocalePath } from "#i18n";
// import type { UserResponse } from "#types/user";
// import type { AccessTokenResponse, LoginRequest } from "#types/auth";
//
// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     accessToken: null as AccessTokenResponse | null,
//     user: null as UserResponse | null,
//   }),
//
//   getters: {
//     isAuthenticated: (state) => {
//       return !!state.accessToken?.token;
//     },
//   },
//
//   actions: {
//     async login(payload: LoginRequest) {
//       const { $api } = useNuxtApp();
//
//       const response = await $api<{
//         data: AccessTokenResponse;
//       }>("/auth/login", {
//         method: "POST",
//         body: payload,
//       });
//
//       this.accessToken = response.data;
//
//       await this.getMe();
//     },
//
//     loginWithGoogle() {
//       const config = useRuntimeConfig();
//
//       window.location.href =
//         `${config.public.apiBaseUrl}/auth/google`;
//     },
//
//     async refresh() {
//       const { $api } = useNuxtApp();
//
//       const response = await $api<{
//         data: AccessTokenResponse;
//       }>("/auth/refresh", {
//         method: "GET",
//       });
//
//       this.accessToken = response.data;
//
//       return response.data;
//     },
//
//     async getMe() {
//       const { $api } = useNuxtApp();
//
//       const response = await $api<{
//         data: UserResponse;
//       }>("/auth/me");
//
//       this.user = response.data;
//
//       return response.data;
//     },
//
//     async logout(redirect = true) {
//       const { $api } = useNuxtApp();
//
//       try {
//         if (this.accessToken?.token) {
//           await $api("/auth/logout", {
//             method: "POST",
//           });
//         }
//       } catch {
//         // ignore
//       }
//
//       this.clearAuth();
//
//       if (redirect) {
//         const localePath = useLocalePath();
//
//         await navigateTo(localePath("/login"));
//       }
//     },
//
//     clearAuth() {
//       this.accessToken = null;
//       this.user = null;
//     },
//
//     async initialize() {
//       try {
//         await this.refresh();
//         await this.getMe();
//       } catch {
//         this.clearAuth();
//       }
//     },
//   },
// });
