import { useApiRequest } from '#features/shared/api/http'
import type { LingkupFormInput, LingkupRecord } from '../types/lingkup'

export const LINGKUP_ENDPOINTS = {
  list: '/api/lingkup',
  create: '/api/lingkup',
  detail: (lingkupId: string) => `/api/lingkup/${encodeURIComponent(lingkupId)}`,
  update: (lingkupId: string) => `/api/lingkup/${encodeURIComponent(lingkupId)}`,
  remove: (lingkupId: string) => `/api/lingkup/${encodeURIComponent(lingkupId)}`,
}

export function useLingkupApi() {
  const { request } = useApiRequest()

  return {
    endpoints: LINGKUP_ENDPOINTS,
    listLingkup: (query?: Record<string, any>) => request<{ data: LingkupRecord[], meta: { total: number } }>(LINGKUP_ENDPOINTS.list, { query }),
    createLingkup: (payload: LingkupFormInput) =>
      request<{ data: LingkupRecord }>(LINGKUP_ENDPOINTS.create, { method: 'POST', body: payload }),
    getLingkup: (lingkupId: string) => request<{ data: LingkupRecord }>(LINGKUP_ENDPOINTS.detail(lingkupId)),
    updateLingkup: (lingkupId: string, payload: Partial<LingkupFormInput>) =>
      request<{ data: LingkupRecord }>(LINGKUP_ENDPOINTS.update(lingkupId), { method: 'PUT', body: payload }),
    removeLingkup: (lingkupId: string) =>
      request<void>(LINGKUP_ENDPOINTS.remove(lingkupId), { method: 'DELETE' }),
  }
}
