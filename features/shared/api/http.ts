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
    const headers: Record<string, string> = {
      ...((options as any)?.headers as Record<string, string> ?? {}),
    }

    if (auth.accessToken) {
      headers['Authorization'] = `Bearer ${auth.accessToken}`
    }

    if (locale.value) {
      headers['Accept-Language'] = locale.value
    }

    const baseURL = ((config.public.apiBaseUrl as string) || (config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');

    try {
      const response = await $fetch<T | ApiEnvelope<T>>(endpoint, {
        baseURL,
        credentials: 'include',
        ...(options ?? {}),
        headers,
      })
      return unwrapApiEnvelope(response)
    } catch (error: any) {
      if (error?.response?.status === 401 && auth.accessToken) {
        try {
          await auth.refreshAccessToken()
          if (auth.accessToken) {
            headers['Authorization'] = `Bearer ${auth.accessToken}`
            const retryResponse = await $fetch<T | ApiEnvelope<T>>(endpoint, {
              baseURL,
              credentials: 'include',
              ...(options ?? {}),
              headers,
            })
            return unwrapApiEnvelope(retryResponse)
          }
        } catch {
          return null
        }
      }
      return null
    }
  }

  return {
    request,
  }
}

