import { useApiRequest } from '#features/shared/api/http'
import type {
  PeriodeModulFormInput,
  PeriodeModulListPayload,
  PeriodeModulRecord,
} from '../types/periode-modul'

export const PERIODE_MODUL_ENDPOINTS = {
  list: '/api/v1/dashboard/periode-modul',
  create: '/api/v1/dashboard/periode-modul/create',
  detail: (periodeModulId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}`,
  update: (periodeModulId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/update`,
  remove: (periodeModulId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/delete`,
}

export function usePeriodeModulApi() {
  const { request } = useApiRequest()

  return {
    endpoints: PERIODE_MODUL_ENDPOINTS,
    listPeriodeModul: () => request<PeriodeModulListPayload>(PERIODE_MODUL_ENDPOINTS.list),
    createPeriodeModul: (payload: PeriodeModulFormInput) =>
      request<PeriodeModulRecord>(PERIODE_MODUL_ENDPOINTS.create, {
        method: 'POST',
        body: payload,
      }),
    getPeriodeModul: (periodeModulId: string) =>
      request<PeriodeModulRecord>(PERIODE_MODUL_ENDPOINTS.detail(periodeModulId)),
    updatePeriodeModul: (
      periodeModulId: string,
      payload: Partial<PeriodeModulFormInput>
    ) =>
      request<PeriodeModulRecord>(PERIODE_MODUL_ENDPOINTS.update(periodeModulId), {
        method: 'PUT',
        body: payload,
      }),
    removePeriodeModul: (periodeModulId: string) =>
      request<{ deleted: boolean }>(PERIODE_MODUL_ENDPOINTS.remove(periodeModulId), {
        method: 'DELETE',
      }),
  }
}
