import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  FM6_ACTIVE_DUMMY_ROLE,
  getFm6CreatePageDummyData,
  getFm6DashboardDummyData,
  getFm6DetailDummyData,
  type Fm6AdminRole,
  type Fm6CreatePageDummyData,
  type Fm6CreateTemplatePayload,
  type Fm6CreateTemplateResult,
  type Fm6DashboardContext,
  type Fm6DashboardDummyData,
  type Fm6DetailDummyData,
} from '#features/periode-modul/data/fm6AdminDummy'

type Fm6SourceMode = 'auto' | 'api' | 'dummy'
type Fm6ResolvedSource = 'api' | 'dummy'

export const FM6_ADMIN_ENDPOINTS = {
  dashboard: (context: Fm6DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6`,
  createPage: (context: Fm6DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/create`,
  detail: (context: Fm6DashboardContext, detailId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/detail/${encodeURIComponent(detailId)}`,
  createTemplate: (context: Fm6DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6`,
  updateTemplate: (context: Fm6DashboardContext, detailId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/detail/${encodeURIComponent(detailId)}`,
  deleteTemplate: (context: Fm6DashboardContext, detailId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/detail/${encodeURIComponent(detailId)}`,
}

export function useFm6AdminRepository(initialMode: Fm6SourceMode = 'auto') {
  const mode = ref<Fm6SourceMode>(initialMode)
  const resolvedSource = ref<Fm6ResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm6DashboardContext,
    role: Fm6AdminRole = FM6_ACTIVE_DUMMY_ROLE
  ): Promise<Fm6DashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6DashboardDummyData>(
        FM6_ADMIN_ENDPOINTS.dashboard(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm6DashboardDummyData(context, role)
  }

  async function getCreatePageData(
    context: Fm6DashboardContext,
    role: Fm6AdminRole = FM6_ACTIVE_DUMMY_ROLE
  ): Promise<Fm6CreatePageDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6CreatePageDummyData>(
        FM6_ADMIN_ENDPOINTS.createPage(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm6CreatePageDummyData(context, role)
  }

  async function getDetailData(
    context: Fm6DashboardContext,
    detailId: string,
    role: Fm6AdminRole = FM6_ACTIVE_DUMMY_ROLE
  ): Promise<Fm6DetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6DetailDummyData>(
        FM6_ADMIN_ENDPOINTS.detail(context, detailId)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm6DetailDummyData({
      context,
      detailId,
      role,
    })
  }

  async function createTemplate(
    context: Fm6DashboardContext,
    payload: Fm6CreateTemplatePayload
  ): Promise<Fm6CreateTemplateResult> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6CreateTemplateResult>(
        FM6_ADMIN_ENDPOINTS.createTemplate(context),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (apiData?.id) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    const generatedId = 'fm6-survey-001'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm6] create template payload', { context, payload, generatedId })
    return { id: generatedId }
  }

  async function updateTemplate(
    context: Fm6DashboardContext,
    detailId: string,
    payload: Partial<Fm6CreateTemplatePayload>
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ updated: boolean }>(
        FM6_ADMIN_ENDPOINTS.updateTemplate(context, detailId),
        {
          method: 'PATCH',
          body: payload,
        }
      )

      if (apiData?.updated) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm6] update template payload', { context, detailId, payload })
    return true
  }

  async function deleteTemplate(
    context: Fm6DashboardContext,
    detailId: string
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ deleted: boolean }>(
        FM6_ADMIN_ENDPOINTS.deleteTemplate(context, detailId),
        {
          method: 'DELETE',
        }
      )

      if (apiData?.deleted) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm6] delete template', { context, detailId })
    return true
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM6_ADMIN_ENDPOINTS,
    getDashboardData,
    getCreatePageData,
    getDetailData,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}
