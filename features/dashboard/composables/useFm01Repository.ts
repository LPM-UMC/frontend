import { getFm01DummyPageData } from '../data/fm01Dummy'
import type {
  Fm01ApiEnvelope,
  Fm01PageData,
  Fm01RouteContext,
  Fm01SourceMode,
  SaveFm01IndicatorPayload,
} from '../types/fm01'

type ResolvedSource = 'api' | 'auto'

export const FM01_ENDPOINTS = {
  pageDetail: '/api/v1/monev/fm01',
  pageDetailByRoute: (context: Fm01RouteContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm1/aspek/${encodeURIComponent(context.aspekId)}`,
  saveIndicator: '/api/v1/monev/fm01/indikator',
  saveIndicatorByRoute: (context: Omit<Fm01RouteContext, 'aspekId'> & { aspekId?: string }) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm1/aspek/${encodeURIComponent(context.aspekId ?? '')}/indikator`,
}

function unwrapApiEnvelope<T>(payload: T | Fm01ApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as Fm01ApiEnvelope<T>)
  ) {
    return (payload as Fm01ApiEnvelope<T>).data
  }

  return payload as T
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeWithFallback<T extends object>(
  fallback: T,
  source?: Partial<T> | null
): T {
  if (!source || !isPlainObject(source)) {
    return fallback
  }

  const result = { ...fallback } as T

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key]
    if (sourceValue == null) continue

    const fallbackValue = result[key]

    if (Array.isArray(fallbackValue)) {
      ;(result as Record<string, unknown>)[key as string] = Array.isArray(sourceValue)
        ? sourceValue
        : fallbackValue
      continue
    }

    if (isPlainObject(fallbackValue) && isPlainObject(sourceValue)) {
      ;(result as Record<string, unknown>)[key as string] = mergeWithFallback(
        fallbackValue as object,
        sourceValue as object
      )
      continue
    }

    ;(result as Record<string, unknown>)[key as string] = sourceValue as unknown
  }

  return result
}

function normalizeFm01PageData(payload: Partial<Fm01PageData> | null | undefined): Fm01PageData {
  return mergeWithFallback(getFm01DummyPageData(), payload)
}

export function useFm01Repository(initialMode: Fm01SourceMode = 'auto') {
  const mode = ref<Fm01SourceMode>(initialMode)
  const resolvedSource = ref<ResolvedSource>('auto')
  const config = useRuntimeConfig()

  async function fetchFromApi<T>(
    endpoint: string,
    options?: Omit<Parameters<typeof $fetch<T>>[1], 'baseURL'>
  ): Promise<T | null> {
    try {
      const response = await $fetch<T | Fm01ApiEnvelope<T>>(endpoint, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        ...(options ?? {}),
      })

      resolvedSource.value = 'api'
      return unwrapApiEnvelope(response)
    } catch {
      return null
    }
  }

  async function getPageData(routeContext?: Fm01RouteContext): Promise<Fm01PageData> {
    if (mode.value !== 'dummy') {
      const endpoint = routeContext
        ? FM01_ENDPOINTS.pageDetailByRoute(routeContext)
        : FM01_ENDPOINTS.pageDetail

      const apiData = await fetchFromApi<Fm01PageData>(endpoint)
      if (apiData) {
        return normalizeFm01PageData(apiData)
      }
    }

    resolvedSource.value = 'auto'
    return normalizeFm01PageData(getFm01DummyPageData())
  }

  async function saveIndicator(
    payload: SaveFm01IndicatorPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const endpoint = (payload.periodeModulId && payload.unitId)
        ? FM01_ENDPOINTS.saveIndicatorByRoute({
            periodeModulId: payload.periodeModulId,
            unitId: payload.unitId,
            aspekId: payload.aspectId,
          })
        : FM01_ENDPOINTS.saveIndicator

      const apiResult = await fetchFromApi<{
        saved: boolean
      }>(endpoint, {
        method: 'POST',
        body: payload,
      })

      if (apiResult) {
        return true
      }
    }

    resolvedSource.value = 'auto'
    console.info('[FM01][Dummy Save]', payload)
    return true
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM01_ENDPOINTS,
    getPageData,
    saveIndicator,
  }
}
