import { useApiRequest } from '#features/shared/api/http'
import type { AspekFormInput, AspekListPayload, AspekRecord } from '../types/aspek'

export const ASPEK_ENDPOINTS = {
  create: (modulId: string) =>
    `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/aspek/create`,
  detail: (modulId: string, aspekId: string) =>
    `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/aspek/${encodeURIComponent(aspekId)}`,
  update: (modulId: string, aspekId: string) =>
    `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/aspek/${encodeURIComponent(aspekId)}/update`,
  remove: (modulId: string, aspekId: string) =>
    `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/aspek/${encodeURIComponent(aspekId)}/delete`,
}

export function useAspekApi() {
  const { request } = useApiRequest()

  async function listAspek(modulId: string) {
    const detail = await request<{ aspek?: AspekRecord[] }>(
      `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}`
    )

    return {
      items: detail?.aspek ?? [],
      total: detail?.aspek?.length ?? 0,
    } as AspekListPayload
  }

  return {
    endpoints: ASPEK_ENDPOINTS,
    listAspek,
    createAspek: (payload: AspekFormInput) =>
      request<AspekRecord>(ASPEK_ENDPOINTS.create(payload.modulId), {
        method: 'POST',
        body: payload,
      }),
    getAspek: (modulId: string, aspekId: string) =>
      request<AspekRecord>(ASPEK_ENDPOINTS.detail(modulId, aspekId)),
    updateAspek: (
      modulId: string,
      aspekId: string,
      payload: Partial<AspekFormInput>
    ) =>
      request<AspekRecord>(ASPEK_ENDPOINTS.update(modulId, aspekId), {
        method: 'PUT',
        body: payload,
      }),
    removeAspek: (modulId: string, aspekId: string) =>
      request<{ deleted: boolean }>(ASPEK_ENDPOINTS.remove(modulId, aspekId), {
        method: 'DELETE',
      }),
  }
}
