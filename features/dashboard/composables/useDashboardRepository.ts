import {
  getDashboardDummyHomeData,
  getDashboardDummyModuleData,
  getDashboardDummyUser,
} from '../data/dashboardDummy'
import type {
  DashboardApiEnvelope,
  DashboardHomeData,
  DashboardModuleData,
  DashboardModuleKey,
  DashboardSourceMode,
  DashboardUser,
} from '../types/dashboard'

type ResolvedSource = 'api' | 'auto'

export const DASHBOARD_ENDPOINTS = {
  me: '/api/v1/dashboard/me',
  home: '/api/v1/dashboard/home',
  moduleByKey: (moduleKey: DashboardModuleKey) =>
    `/api/v1/dashboard/modules/${moduleKey}`,
}

// Compatible with plain payload and Hono envelope:
// { success: true, message: 'ok', data: ... }
function unwrapApiEnvelope<T>(payload: T | DashboardApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as DashboardApiEnvelope<T>)
  ) {
    return (payload as DashboardApiEnvelope<T>).data
  }

  return payload as T
}

export function useDashboardRepository(initialMode: DashboardSourceMode = 'auto') {
  const mode = ref<DashboardSourceMode>(initialMode)
  const resolvedSource = ref<ResolvedSource>('auto')
  const config = useRuntimeConfig()

  async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await $fetch<T | DashboardApiEnvelope<T>>(endpoint, {
        baseURL: config.public.apiBase,
        credentials: 'include',
      })

      resolvedSource.value = 'api'
      return unwrapApiEnvelope(response)
    } catch {
      return null
    }
  }

  async function getCurrentUser(): Promise<DashboardUser> {
    if (mode.value !== 'dummy') {
      const apiData = await fetchFromApi<DashboardUser>(DASHBOARD_ENDPOINTS.me)
      if (apiData) {
        return apiData
      }
    }

    resolvedSource.value = 'auto'
    return getDashboardDummyUser()
  }

  async function getHomeData(): Promise<DashboardHomeData> {
    if (mode.value !== 'dummy') {
      const apiData = await fetchFromApi<DashboardHomeData>(DASHBOARD_ENDPOINTS.home)
      if (apiData) {
        return apiData
      }
    }

    resolvedSource.value = 'auto'
    return getDashboardDummyHomeData()
  }

  async function getModuleData(
    moduleKey: DashboardModuleKey
  ): Promise<DashboardModuleData> {
    if (mode.value !== 'dummy') {
      const apiData = await fetchFromApi<DashboardModuleData>(
        DASHBOARD_ENDPOINTS.moduleByKey(moduleKey)
      )
      if (apiData) {
        return apiData
      }
    }

    resolvedSource.value = 'auto'
    return getDashboardDummyModuleData(moduleKey)
  }

  return {
    mode,
    resolvedSource,
    endpoints: DASHBOARD_ENDPOINTS,
    getCurrentUser,
    getHomeData,
    getModuleData,
  }
}
