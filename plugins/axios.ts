// plugins/axios.ts
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: 5000,
    withCredentials: true,
  })

  /* ===============================
   * REQUEST INTERCEPTOR
   * =============================== */
  api.interceptors.request.use(
    (request) => {
      // pasang access token jika ada
      if (authStore.token) {
        request.headers.Authorization = `${authStore.type} ${authStore.token}`
      }
      return request
    },
    (error) => Promise.reject(error)
  )

  /* ===============================
   * RESPONSE INTERCEPTOR
   * =============================== */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // tidak ada response → network error
      if (!error.response) {
        return Promise.reject(error)
      }

      // bukan 401 → lanjutkan
      if (error.response.status !== 401) {
        return Promise.reject(error)
      }

      // cegah infinite loop
      if (originalRequest._retry) {
        return Promise.reject(error)
      }

      // ❌ jangan refresh untuk endpoint auth
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const refreshed = await authStore.refresh()

        if (!refreshed) {
          authStore.logout()
          return Promise.reject(error)
        }

        // pasang token baru
        originalRequest.headers.Authorization = `${authStore.type} ${authStore.token}`

        // retry request lama
        return api(originalRequest)
      } catch (e) {
        authStore.logout()
        return Promise.reject(e)
      }
    }
  )

  return {
    provide: {
      axios: api,
    },
  }
})

