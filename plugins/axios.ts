import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: (config.public.apiBase as string) || "http://localhost:8000/api",
    withCredentials: true,
  });

  // 🔹 Request interceptor
  api.interceptors.request.use((request) => {
    const auth = useAuthStore();

    if (auth.accessToken) {
      request.headers.Authorization = `Bearer ${auth.accessToken}`;
    }

    return request;
  });

  // 🔹 Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const auth = useAuthStore();

      // kalau unauthorized → coba refresh token
      if (error.response?.status === 401) {
        try {
          await auth.refreshToken();

          // retry request sebelumnya
          error.config.headers.Authorization = `Bearer ${auth.accessToken}`;
          return api.request(error.config);
        } catch (err) {
          await auth.logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});
