import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  getFm4GkmfDashboardDummyData,
  getFm4GkmfPendingDetailDummyData,
  getFm4GkmfPendingTemuanDummyData,
  type Fm4DashboardContext,
  type Fm4DashboardDummyData,
  type Fm4PendingDetailDummyData,
  type Fm4PendingTemuanDummyData,
  type Fm4RpnLevel,
} from '#features/periode-modul/data/fm4GkmfDummy'

type Fm4SourceMode = 'auto' | 'api' | 'dummy'
type Fm4ResolvedSource = 'api' | 'dummy'

export interface Fm4PendingAnalysisPayload {
  impact: string
  cause: string
  severity: number
  occurrence: number
  detection: number
  rpnValue: number
  rpnCategory: Fm4RpnLevel
}

export const FM4_GKMF_ENDPOINTS = {
  dashboard: (context: Fm4DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4`,
  temuanPendingList: (context: Fm4DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/temuan-pending`,
  temuanPendingDetail: (context: Fm4DashboardContext, temuanPendingId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/temuan-pending/${encodeURIComponent(temuanPendingId)}`,
  saveAnalysis: (context: Fm4DashboardContext, temuanPendingId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/temuan-pending/${encodeURIComponent(temuanPendingId)}/analisis`,
}

export function useFm4GkmfRepository(initialMode: Fm4SourceMode = 'auto') {
  const mode = ref<Fm4SourceMode>(initialMode)
  const resolvedSource = ref<Fm4ResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm4DashboardContext
  ): Promise<Fm4DashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4DashboardDummyData>(
        FM4_GKMF_ENDPOINTS.dashboard(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4GkmfDashboardDummyData(context)
  }

  async function getTemuanPendingData(
    context: Fm4DashboardContext
  ): Promise<Fm4PendingTemuanDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4PendingTemuanDummyData>(
        FM4_GKMF_ENDPOINTS.temuanPendingList(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4GkmfPendingTemuanDummyData(context)
  }

  async function getTemuanPendingDetailData(
    context: Fm4DashboardContext,
    temuanPendingId: string
  ): Promise<Fm4PendingDetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4PendingDetailDummyData>(
        FM4_GKMF_ENDPOINTS.temuanPendingDetail(context, temuanPendingId)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4GkmfPendingDetailDummyData({
      context,
      temuanPendingId,
    })
  }

  async function savePendingAnalysis(
    context: Fm4DashboardContext,
    temuanPendingId: string,
    payload: Fm4PendingAnalysisPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const response = await request<{ saved: boolean }>(
        FM4_GKMF_ENDPOINTS.saveAnalysis(context, temuanPendingId),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (response?.saved) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder ketika backend belum tersedia.
    console.info('[fm4] save pending analysis payload', {
      context,
      temuanPendingId,
      payload,
    })
    return true
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM4_GKMF_ENDPOINTS,
    getDashboardData,
    getTemuanPendingData,
    getTemuanPendingDetailData,
    savePendingAnalysis,
  }
}
