import { useApiRequest } from '#features/shared/api/http'
import type { AspekFormInput, AspekListPayload, AspekRecord } from '../types/aspek'

export const ASPEK_ENDPOINTS = {
  list: (modulId: string) => `/api/modul/${encodeURIComponent(modulId)}/aspek`,
  create: (modulId: string) => `/api/modul/${encodeURIComponent(modulId)}/aspek`,
  detail: (aspekId: string) => `/api/aspek/${encodeURIComponent(aspekId)}`,
  update: (aspekId: string) => `/api/aspek/${encodeURIComponent(aspekId)}`,
  remove: (aspekId: string) => `/api/aspek/${encodeURIComponent(aspekId)}`,
}

export function useAspekApi() {
  const { request } = useApiRequest()

  async function listAspek(modulId: string, query?: Record<string, any>) {
    const response = await request<{ data: AspekRecord[], meta: { total: number } }>(
      ASPEK_ENDPOINTS.list(modulId),
      { query }
    )

    return {
      items: response?.data ?? [],
      total: response?.meta?.total ?? 0,
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
      request<AspekRecord>(ASPEK_ENDPOINTS.detail(aspekId)),
    updateAspek: (
      modulId: string,
      aspekId: string,
      payload: Partial<AspekFormInput>
    ) =>
      request<AspekRecord>(ASPEK_ENDPOINTS.update(aspekId), {
        method: 'PUT',
        body: payload,
      }),
    removeAspek: (modulId: string, aspekId: string) =>
      request<void>(ASPEK_ENDPOINTS.remove(aspekId), {
        method: 'DELETE',
      }),
  }
}
