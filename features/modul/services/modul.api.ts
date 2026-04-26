import { useApiRequest } from '#features/shared/api/http'
import type { ModulFormInput, ModulListPayload, ModulRecord } from '../types/modul'

export const MODUL_ENDPOINTS = {
  list: '/api/v1/dashboard/modul',
  create: '/api/v1/dashboard/modul/create',
  detail: (modulId: string) => `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}`,
  update: (modulId: string) => `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/update`,
  remove: (modulId: string) => `/api/v1/dashboard/modul/${encodeURIComponent(modulId)}/delete`,
}

export function useModulApi() {
  const { request } = useApiRequest()

  return {
    endpoints: MODUL_ENDPOINTS,
    listModul: () => request<ModulListPayload>(MODUL_ENDPOINTS.list),
    createModul: (payload: ModulFormInput) =>
      request<ModulRecord>(MODUL_ENDPOINTS.create, { method: 'POST', body: payload }),
    getModul: (modulId: string) => request<ModulRecord>(MODUL_ENDPOINTS.detail(modulId)),
    updateModul: (modulId: string, payload: Partial<ModulFormInput>) =>
      request<ModulRecord>(MODUL_ENDPOINTS.update(modulId), { method: 'PUT', body: payload }),
    removeModul: (modulId: string) =>
      request<{ deleted: boolean }>(MODUL_ENDPOINTS.remove(modulId), { method: 'DELETE' }),
  }
}
