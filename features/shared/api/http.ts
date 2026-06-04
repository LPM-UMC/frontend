import { useAuthStore } from '#stores/auth'

export interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}

export function unwrapApiEnvelope<T>(payload: T | ApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as ApiEnvelope<T>)
  ) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

export function useApiRequest() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function request<T>(
    endpoint: string,
    options?: Omit<Parameters<typeof $fetch<T>>[1], 'baseURL'>
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        ...(options?.headers as Record<string, string> ?? {}),
      }

      if (auth.accessToken) {
        headers['Authorization'] = `Bearer ${auth.accessToken}`
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

