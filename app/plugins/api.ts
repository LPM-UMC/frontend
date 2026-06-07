import { ofetch } from "ofetch";
import { useAuthStore } from "#stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL: string = (config.public.apiBaseUrl as string) || (config.public.apiBase as string) || "http://localhost:3001";

  const apiFetch = ofetch.create({
    baseURL,
    onRequest({ options }) {
      options.credentials = "include";
      const authStore = useAuthStore();
      if (authStore.accessToken) {
        options.headers = new Headers(options.headers || {});
        options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
      }
    },
    async onResponseError({ response, options, request }) {
      const requestUrl = request.toString();
      const isAuthEndpoint = requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/login') || requestUrl.includes('/auth/logout');

      // Prevent infinite loop by checking a custom _retry flag and skipping auth endpoints
      if (response.status === 401 && !(options as any)._retry && !isAuthEndpoint) {
        (options as any)._retry = true;
        const authStore = useAuthStore();
        try {
          const newToken = await authStore.refreshAccessToken();
          // Update headers with new token and retry
          options.headers = new Headers(options.headers || {});
          options.headers.set("Authorization", `Bearer ${newToken}`);
          return await $fetch(request, options as any);
        } catch (err) {
          authStore.clearAuth();
          if (import.meta.client) {
            const nuxtApp = useNuxtApp();
            const t = (nuxtApp as any).$i18n?.t || ((key: string) => key);
            const toast = useToast();
            toast.add({
              title: 'Error',
              description: t('toast.auth.sessionExpired') || 'Sesi telah berakhir',
              color: 'error'
            });
            await navigateTo("/login");
          }
        }
      }
    },
  });

  // Assign to globalThis.$fetch to transparently hook all $fetch calls in repos
  globalThis.$fetch = apiFetch as any;

  return {
    provide: {
      api: apiFetch,
    },
  };
});
