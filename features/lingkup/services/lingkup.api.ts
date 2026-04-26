import { useApiRequest } from '#features/shared/api/http'
import type { LingkupFormInput, LingkupListPayload, LingkupRecord } from '../types/lingkup'

export const LINGKUP_ENDPOINTS = {
  list: '/api/v1/dashboard/lingkup',
  create: '/api/v1/dashboard/lingkup/create',
  detail: (lingkupId: string) => `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}`,
  update: (lingkupId: string) => `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/update`,
  remove: (lingkupId: string) => `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/delete`,
}

export function useLingkupApi() {
  const { request } = useApiRequest()

  return {
    endpoints: LINGKUP_ENDPOINTS,
    listLingkup: () => request<LingkupListPayload>(LINGKUP_ENDPOINTS.list),
    createLingkup: (payload: LingkupFormInput) =>
      request<LingkupRecord>(LINGKUP_ENDPOINTS.create, { method: 'POST', body: payload }),
    getLingkup: (lingkupId: string) => request<LingkupRecord>(LINGKUP_ENDPOINTS.detail(lingkupId)),
    updateLingkup: (lingkupId: string, payload: Partial<LingkupFormInput>) =>
      request<LingkupRecord>(LINGKUP_ENDPOINTS.update(lingkupId), { method: 'PUT', body: payload }),
    removeLingkup: (lingkupId: string) =>
      request<{ deleted: boolean }>(LINGKUP_ENDPOINTS.remove(lingkupId), { method: 'DELETE' }),
  }
}
