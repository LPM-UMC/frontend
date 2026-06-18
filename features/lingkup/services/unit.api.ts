import { useApiRequest } from '#features/shared/api/http'
import type { UnitFormInput, UnitListPayload, UnitRecord } from '../types/unit'

export const UNIT_ENDPOINTS = {
  create: (lingkupId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/create`,
  detail: (lingkupId: string, unitId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}`,
  update: (lingkupId: string, unitId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/update`,
  remove: (lingkupId: string, unitId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/delete`,
}

export function useUnitApi() {
  const { request } = useApiRequest()

  async function listUnit(lingkupId: string) {
    const detail = await request<{ units?: UnitRecord[] }>(
      `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}`
    )

    return {
      items: detail?.units ?? [],
      total: detail?.units?.length ?? 0,
    } as UnitListPayload
  }

  return {
    endpoints: UNIT_ENDPOINTS,
    listUnit,
    createUnit: (payload: UnitFormInput) =>
      request<UnitRecord>(UNIT_ENDPOINTS.create(payload.lingkupId), {
        method: 'POST',
        body: payload,
      }),
    getUnit: (lingkupId: string, unitId: string) =>
      request<UnitRecord>(UNIT_ENDPOINTS.detail(lingkupId, unitId)),
    updateUnit: (lingkupId: string, unitId: string, payload: Partial<UnitFormInput>) =>
      request<UnitRecord>(UNIT_ENDPOINTS.update(lingkupId, unitId), {
        method: 'PUT',
        body: payload,
      }),
    removeUnit: (lingkupId: string, unitId: string) =>
      request<{ deleted: boolean }>(UNIT_ENDPOINTS.remove(lingkupId, unitId), {
        method: 'DELETE',
      }),
  }
}
