import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  FM6_MAHASISWA_ACTIVE_DUMMY_ROLE,
  FM6_MAHASISWA_DEFAULT_LIST_MODE,
  getFm6MahasiswaDetailDummyData,
  getFm6MahasiswaJawabPageDummyData,
  type Fm6MahasiswaContext,
  type Fm6MahasiswaDetailDummyData,
  type Fm6MahasiswaJawabPageDummyData,
  type Fm6MahasiswaListMode,
  type Fm6MahasiswaRole,
  type Fm6MahasiswaSubmitPayload,
  type Fm6MahasiswaSubmitResult,
} from '#features/periode-modul/data/fm6MahasiswaDummy'

type Fm6MahasiswaSourceMode = 'auto' | 'api' | 'dummy'
type Fm6MahasiswaResolvedSource = 'api' | 'dummy'

export const FM6_MAHASISWA_ENDPOINTS = {
  jawabPage: (context: Fm6MahasiswaContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/jawab`,
  jawabDetail: (context: Fm6MahasiswaContext, jawabId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/jawab/${encodeURIComponent(jawabId)}`,
  submitJawaban: (context: Fm6MahasiswaContext, jawabId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm6/jawab/${encodeURIComponent(jawabId)}`,
}

export function useFm6MahasiswaRepository(initialMode: Fm6MahasiswaSourceMode = 'auto') {
  const mode = ref<Fm6MahasiswaSourceMode>(initialMode)
  const resolvedSource = ref<Fm6MahasiswaResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getJawabPageData(
    context: Fm6MahasiswaContext,
    listMode: Fm6MahasiswaListMode = FM6_MAHASISWA_DEFAULT_LIST_MODE,
    role: Fm6MahasiswaRole = FM6_MAHASISWA_ACTIVE_DUMMY_ROLE
  ): Promise<Fm6MahasiswaJawabPageDummyData> {
    if (mode.value !== 'dummy') {
      const endpoint = `${FM6_MAHASISWA_ENDPOINTS.jawabPage(context)}?state=${encodeURIComponent(listMode)}`
      const apiData = await request<Fm6MahasiswaJawabPageDummyData>(endpoint)

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm6MahasiswaJawabPageDummyData({
      context,
      mode: listMode,
      role,
    })
  }

  async function getJawabDetailData(
    context: Fm6MahasiswaContext,
    jawabId: string,
    role: Fm6MahasiswaRole = FM6_MAHASISWA_ACTIVE_DUMMY_ROLE
  ): Promise<Fm6MahasiswaDetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6MahasiswaDetailDummyData>(
        FM6_MAHASISWA_ENDPOINTS.jawabDetail(context, jawabId)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm6MahasiswaDetailDummyData({
      context,
      jawabId,
      role,
    })
  }

  async function submitJawaban(
    context: Fm6MahasiswaContext,
    jawabId: string,
    payload: Fm6MahasiswaSubmitPayload
  ): Promise<Fm6MahasiswaSubmitResult> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm6MahasiswaSubmitResult>(
        FM6_MAHASISWA_ENDPOINTS.submitJawaban(context, jawabId),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (apiData?.submitted) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm6 mahasiswa] submit jawaban payload', { context, jawabId, payload })
    return { submitted: true }
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM6_MAHASISWA_ENDPOINTS,
    getJawabPageData,
    getJawabDetailData,
    submitJawaban,
  }
}
