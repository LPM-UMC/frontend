import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  getFm4KaprodiDashboardDummyData,
  getFm4KaprodiPendingDummyData,
  getFm4KaprodiProgressDummyData,
  getFm4OtherRoleDashboardDummyData,
  type Fm4KaprodiDashboardDummyData,
  type Fm4KaprodiPendingDummyData,
  type Fm4KaprodiProgressDummyData,
  type Fm4OtherRoleDashboardDummyData,
} from '#features/periode-modul/data/fm4KaprodiDummy'
import {
  getFm4KaprodiCreateRtlDummyData,
  getFm4KaprodiProgressDetailDummyData,
  getFm4KaprodiProgressEditDummyData,
  type Fm4KaprodiCreateRtlDummyData,
  type Fm4KaprodiProgressDetailDummyData,
  type Fm4KaprodiProgressEditDummyData,
} from '#features/periode-modul/data/fm4KaprodiRtlDummy'
import type { Fm4DashboardContext } from '#features/periode-modul/data/fm4GkmfDummy'

type Fm4SourceMode = 'auto' | 'api' | 'dummy'
type Fm4ResolvedSource = 'api' | 'dummy'

export interface Fm4CreateRtlPayload {
  impact?: string
  cause?: string
  severity?: number
  occurrence?: number
  detection?: number
  rpnValue?: number
  rpnCategory?: string
  picName?: string
  picEmail?: string
  rtl: string
  dueDate?: string
  notes?: string
}

export interface Fm4ProgressPayload {
  status?: string
  result?: string
  realizationDate?: string
  realizationTime?: string
  evidenceLink?: string
  additionalNotes?: string
  progressNotes: string
  progressDate?: string
  progressPercent?: number
}

export const FM4_KAPRODI_ENDPOINTS = {
  dashboard: (context: Fm4DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4`,
  rtlPendingList: (context: Fm4DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/pending`,
  rtlProgressList: (context: Fm4DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/progres`,
  rtlCreate: (context: Fm4DashboardContext, temuanId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/${encodeURIComponent(temuanId)}/create`,
  rtlProgressEdit: (context: Fm4DashboardContext, rtlId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/progres/${encodeURIComponent(rtlId)}/edit`,
  rtlProgressDetail: (context: Fm4DashboardContext, rtlId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm4/rtl/progres/${encodeURIComponent(rtlId)}`,
}

export function useFm4KaprodiRepository(initialMode: Fm4SourceMode = 'auto') {
  const mode = ref<Fm4SourceMode>(initialMode)
  const resolvedSource = ref<Fm4ResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm4DashboardContext
  ): Promise<Fm4KaprodiDashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiDashboardDummyData>(
        FM4_KAPRODI_ENDPOINTS.dashboard(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiDashboardDummyData(context)
  }

  async function getOtherRoleDashboardData(
    context: Fm4DashboardContext
  ): Promise<Fm4OtherRoleDashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4OtherRoleDashboardDummyData>(
        FM4_KAPRODI_ENDPOINTS.dashboard(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4OtherRoleDashboardDummyData(context)
  }

  async function getPendingData(
    context: Fm4DashboardContext
  ): Promise<Fm4KaprodiPendingDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiPendingDummyData>(
        FM4_KAPRODI_ENDPOINTS.rtlPendingList(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiPendingDummyData(context)
  }

  async function getProgressData(
    context: Fm4DashboardContext
  ): Promise<Fm4KaprodiProgressDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiProgressDummyData>(
        FM4_KAPRODI_ENDPOINTS.rtlProgressList(context)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiProgressDummyData(context)
  }

  async function createRtl(
    context: Fm4DashboardContext,
    temuanId: string,
    payload: Fm4CreateRtlPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const response = await request<{ saved: boolean }>(
        FM4_KAPRODI_ENDPOINTS.rtlCreate(context, temuanId),
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
    // Placeholder sampai endpoint backend siap.
    console.info('[fm4][kaprodi] create rtl payload', { context, temuanId, payload })
    return true
  }

  async function updateRtlProgress(
    context: Fm4DashboardContext,
    rtlId: string,
    payload: Fm4ProgressPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const response = await request<{ saved: boolean }>(
        FM4_KAPRODI_ENDPOINTS.rtlProgressEdit(context, rtlId),
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
    // Placeholder sampai endpoint backend siap.
    console.info('[fm4][kaprodi] update rtl progress payload', { context, rtlId, payload })
    return true
  }

  async function getCreateRtlFormData(
    context: Fm4DashboardContext,
    temuanId: string
  ): Promise<Fm4KaprodiCreateRtlDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiCreateRtlDummyData>(
        FM4_KAPRODI_ENDPOINTS.rtlCreate(context, temuanId)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiCreateRtlDummyData({ context, temuanId })
  }

  async function getProgressEditFormData(
    context: Fm4DashboardContext,
    rtlId: string
  ): Promise<Fm4KaprodiProgressEditDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiProgressEditDummyData>(
        FM4_KAPRODI_ENDPOINTS.rtlProgressEdit(context, rtlId)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiProgressEditDummyData({ context, rtlId })
  }

  async function getProgressDetailData(
    context: Fm4DashboardContext,
    rtlId: string
  ): Promise<Fm4KaprodiProgressDetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm4KaprodiProgressDetailDummyData>(
        FM4_KAPRODI_ENDPOINTS.rtlProgressDetail(context, rtlId)
      )
      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm4KaprodiProgressDetailDummyData({ context, rtlId })
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM4_KAPRODI_ENDPOINTS,
    getDashboardData,
    getOtherRoleDashboardData,
    getPendingData,
    getProgressData,
    getCreateRtlFormData,
    getProgressEditFormData,
    getProgressDetailData,
    createRtl,
    updateRtlProgress,
  }
}
