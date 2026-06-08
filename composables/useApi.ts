import { useAuthStore } from '#stores/auth'
import { useRuntimeConfig } from 'nuxt/app'
import { useI18n } from '#imports'
import type { lang } from '#types/lang'

/**
 * Map i18n locale code → Accept-Language header value
 * Backend lang middleware expects: id, en, ar, ja
 */
const localeToLang: Record<string, lang> = {
  id: 'id',
  en: 'en',
  ar: 'ar',
  ja: 'ja',
}

/**
 * Composable that returns an `apiFetch` function preconfigured with:
 * - Base URL from runtimeConfig
 * - Authorization Bearer token from authStore
 * - Accept-Language header from i18n locale
 * - Auto token refresh on 401
 */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { locale } = useI18n()

  const apiBase = (config.public.apiBaseUrl as string).replace(/\/api\/?$/, '')

  /**
   * Wrapper around $fetch that injects auth & locale headers.
   * Usage: const data = await apiFetch<MyType>('/api/periode', { method: 'GET' })
   */
  async function apiFetch<T = any>(
    url: string,
    opts: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(opts.headers as Record<string, string> || {}),
      'Accept-Language': localeToLang[locale.value] || 'id',
    }

    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    try {
      return await $fetch<T>(`${apiBase}${url}`, {
        ...opts,
        headers,
        credentials: 'include',
      })
    }
    catch (error: any) {
      // If 401 and we have a token, try refresh once then retry
      if (error?.response?.status === 401 && authStore.accessToken) {
        await authStore.refreshToken()

        if (authStore.accessToken) {
          headers.Authorization = `Bearer ${authStore.accessToken}`

          return await $fetch<T>(`${apiBase}${url}`, {
            ...opts,
            headers,
            credentials: 'include',
          })
        }
      }

      throw error
    }
  }

  return { apiFetch }
}
