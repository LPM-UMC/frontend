import { useAuthStore } from '#stores/auth'
import { useI18n } from 'vue-i18n'

export interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}

export function unwrapApiEnvelope<T>(payload: T | ApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as ApiEnvelope<T>) &&
    !('meta' in (payload as object))
  ) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

export function useApiRequest() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const { locale } = useI18n()

  async function request<T>(
    endpoint: string,
    options?: Omit<Parameters<typeof $fetch<T>>[1], 'baseURL'>
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        ...((options as any)?.headers as Record<string, string> ?? {}),
      }

      if (auth.accessToken) {
        headers['Authorization'] = `Bearer ${auth.accessToken}`
      }

      if (locale.value) {
        headers['Accept-Language'] = locale.value
      }

      const response = await $fetch<T | ApiEnvelope<T>>(endpoint, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        ...(options ?? {}),
        headers,
      })

      return unwrapApiEnvelope(response)
    } catch {
      return null
    }
  }

  return {
    request,
  }
}

