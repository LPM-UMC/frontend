import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  FM5_ACTIVE_DUMMY_ROLE,
  getFm5CreatePageDummyData,
  getFm5DashboardDummyData,
  getFm5DetailDummyData,
  type Fm5CreatePageDummyData,
  type Fm5CreatePayload,
  type Fm5DashboardContext,
  type Fm5DashboardDummyData,
  type Fm5DetailDummyData,
  type Fm5DummyRole,
  type Fm5SanggahanPayload,
} from '#features/periode-modul/data/fm5GkmfDummy'

type Fm5SourceMode = 'auto' | 'api' | 'dummy'
type Fm5ResolvedSource = 'api' | 'dummy'

export interface Fm5CreateResult {
  id: string
}

export const FM5_GKMF_ENDPOINTS = {
  dashboard: (context: Fm5DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5`,
  createPage: (context: Fm5DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/create`,
  detail: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}`,
  create: (context: Fm5DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5`,
  update: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}`,
  publish: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}/publish`,
  sign: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}/sign`,
  sanggah: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}/sanggah`,
  delete: (context: Fm5DashboardContext, beritaAcaraId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm5/${encodeURIComponent(beritaAcaraId)}`,
}

export function useFm5GkmfRepository(initialMode: Fm5SourceMode = 'auto') {
  const mode = ref<Fm5SourceMode>(initialMode)
  const resolvedSource = ref<Fm5ResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm5DashboardContext,
    role: Fm5DummyRole = FM5_ACTIVE_DUMMY_ROLE
  ): Promise<Fm5DashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm5DashboardDummyData>(
        FM5_GKMF_ENDPOINTS.dashboard(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm5DashboardDummyData(context, role)
  }

  async function getCreatePageData(
    context: Fm5DashboardContext
  ): Promise<Fm5CreatePageDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm5CreatePageDummyData>(
        FM5_GKMF_ENDPOINTS.createPage(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm5CreatePageDummyData(context)
  }

  async function getDetailData(
    context: Fm5DashboardContext,
    beritaAcaraId: string,
    role: Fm5DummyRole = FM5_ACTIVE_DUMMY_ROLE
  ): Promise<Fm5DetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm5DetailDummyData>(
        FM5_GKMF_ENDPOINTS.detail(context, beritaAcaraId)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm5DetailDummyData({
      context,
      beritaAcaraId,
      role,
    })
  }

  async function createBeritaAcara(
    context: Fm5DashboardContext,
    payload: Fm5CreatePayload
  ): Promise<Fm5CreateResult> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm5CreateResult>(
        FM5_GKMF_ENDPOINTS.create(context),
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

    const generatedId = 'ba-fm5-001'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm5] create berita acara payload', { context, payload, generatedId })

    return {
      id: generatedId,
    }
  }

  async function updateBeritaAcara(
    context: Fm5DashboardContext,
    beritaAcaraId: string,
    payload: Partial<Fm5CreatePayload>
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ updated: boolean }>(
        FM5_GKMF_ENDPOINTS.update(context, beritaAcaraId),
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
    console.info('[fm5] update berita acara payload', { context, beritaAcaraId, payload })
    return true
  }

  async function publishBeritaAcara(
    context: Fm5DashboardContext,
    beritaAcaraId: string
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ published: boolean }>(
        FM5_GKMF_ENDPOINTS.publish(context, beritaAcaraId),
        {
          method: 'POST',
        }
      )

      if (apiData?.published) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm5] publish berita acara', { context, beritaAcaraId })
    return true
  }

  async function signBeritaAcara(
    context: Fm5DashboardContext,
    beritaAcaraId: string
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ signed: boolean }>(
        FM5_GKMF_ENDPOINTS.sign(context, beritaAcaraId),
        {
          method: 'POST',
        }
      )

      if (apiData?.signed) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm5] sign berita acara', { context, beritaAcaraId })
    return true
  }

  async function submitSanggahan(
    context: Fm5DashboardContext,
    beritaAcaraId: string,
    payload: Fm5SanggahanPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ sent: boolean }>(
        FM5_GKMF_ENDPOINTS.sanggah(context, beritaAcaraId),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (apiData?.sent) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm5] submit sanggahan', { context, beritaAcaraId, payload })
    return true
  }

  async function deleteBeritaAcara(
    context: Fm5DashboardContext,
    beritaAcaraId: string
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ deleted: boolean }>(
        FM5_GKMF_ENDPOINTS.delete(context, beritaAcaraId),
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
    console.info('[fm5] delete berita acara', { context, beritaAcaraId })
    return true
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM5_GKMF_ENDPOINTS,
    getDashboardData,
    getCreatePageData,
    getDetailData,
    createBeritaAcara,
    updateBeritaAcara,
    publishBeritaAcara,
    signBeritaAcara,
    submitSanggahan,
    deleteBeritaAcara,
  }
}
