import { useApiRequest } from '#features/shared/api/http'
import type { ModulFormInput, ModulRecord } from '../types/modul'

export const MODUL_ENDPOINTS = {
  listMonev: '/api/modul/monev',
  listAmi: '/api/modul/ami',
  createMonev: '/api/modul/monev',
  createAmi: '/api/modul/ami',
  detail: (modulId: string) => `/api/modul/${encodeURIComponent(modulId)}`,
  update: (modulId: string) => `/api/modul/${encodeURIComponent(modulId)}`,
  remove: (modulId: string) => `/api/modul/${encodeURIComponent(modulId)}`,
}

export function useModulApi() {
  const { request } = useApiRequest()

  return {
    endpoints: MODUL_ENDPOINTS,
    listModulMonev: (query?: Record<string, any>) => request<{ data: ModulRecord[], meta: { total: number } }>(MODUL_ENDPOINTS.listMonev, { query }),
    listModulAmi: (query?: Record<string, any>) => request<{ data: ModulRecord[], meta: { total: number } }>(MODUL_ENDPOINTS.listAmi, { query }),
    createModulMonev: (payload: ModulFormInput) =>
      request<{ data: ModulRecord }>(MODUL_ENDPOINTS.createMonev, { method: 'POST', body: payload }),
    createModulAmi: (payload: ModulFormInput) =>
      request<{ data: ModulRecord }>(MODUL_ENDPOINTS.createAmi, { method: 'POST', body: payload }),
    getModul: (modulId: string) => request<{ data: ModulRecord }>(MODUL_ENDPOINTS.detail(modulId)),
    updateModul: (modulId: string, payload: Partial<ModulFormInput>) =>
      request<{ data: ModulRecord }>(MODUL_ENDPOINTS.update(modulId), { method: 'PUT', body: payload }),
    removeModul: (modulId: string) =>
      request<void>(MODUL_ENDPOINTS.remove(modulId), { method: 'DELETE' }),
  }
}
