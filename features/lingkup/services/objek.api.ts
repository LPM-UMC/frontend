import { useApiRequest } from '#features/shared/api/http'
import type { ObjekFormInput, ObjekListPayload, ObjekRecord } from '../types/objek'

export const OBJEK_ENDPOINTS = {
  createByLingkup: (lingkupId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/objek/create`,
  createByUnit: (lingkupId: string, unitId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/objek/create`,
  detailByLingkup: (lingkupId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/objek/${encodeURIComponent(objekId)}`,
  detailByUnit: (lingkupId: string, unitId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/objek/${encodeURIComponent(objekId)}`,
  updateByLingkup: (lingkupId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/objek/${encodeURIComponent(objekId)}/update`,
  updateByUnit: (lingkupId: string, unitId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/objek/${encodeURIComponent(objekId)}/update`,
  removeByLingkup: (lingkupId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/objek/${encodeURIComponent(objekId)}/delete`,
  removeByUnit: (lingkupId: string, unitId: string, objekId: string) =>
    `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}/objek/${encodeURIComponent(objekId)}/delete`,
}

export function useObjekApi() {
  const { request } = useApiRequest()

  async function listObjek(lingkupId: string, unitId?: string) {
    if (!unitId) {
      const detail = await request<{ objek?: ObjekRecord[] }>(
        `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}`
      )

      return {
        items: detail?.objek ?? [],
        total: detail?.objek?.length ?? 0,
      } as ObjekListPayload
    }

    const detail = await request<{ objek?: ObjekRecord[] }>(
      `/api/v1/dashboard/lingkup/${encodeURIComponent(lingkupId)}/unit/${encodeURIComponent(unitId)}`
    )

    return {
      items: detail?.objek ?? [],
      total: detail?.objek?.length ?? 0,
    } as ObjekListPayload
  }

  return {
    endpoints: OBJEK_ENDPOINTS,
    listObjek,
    createObjek: (payload: ObjekFormInput) =>
      request<ObjekRecord>(
        payload.unitId
          ? OBJEK_ENDPOINTS.createByUnit(payload.lingkupId, payload.unitId)
          : OBJEK_ENDPOINTS.createByLingkup(payload.lingkupId),
        {
          method: 'POST',
          body: payload,
        }
      ),
    getObjek: (lingkupId: string, objekId: string, unitId?: string) =>
      request<ObjekRecord>(
        unitId
          ? OBJEK_ENDPOINTS.detailByUnit(lingkupId, unitId, objekId)
          : OBJEK_ENDPOINTS.detailByLingkup(lingkupId, objekId)
      ),
    updateObjek: (
      lingkupId: string,
      objekId: string,
      payload: Partial<ObjekFormInput>,
      unitId?: string
    ) =>
      request<ObjekRecord>(
        unitId
          ? OBJEK_ENDPOINTS.updateByUnit(lingkupId, unitId, objekId)
          : OBJEK_ENDPOINTS.updateByLingkup(lingkupId, objekId),
        {
          method: 'PUT',
          body: payload,
        }
      ),
    removeObjek: (lingkupId: string, objekId: string, unitId?: string) =>
      request<{ deleted: boolean }>(
        unitId
          ? OBJEK_ENDPOINTS.removeByUnit(lingkupId, unitId, objekId)
          : OBJEK_ENDPOINTS.removeByLingkup(lingkupId, objekId),
        {
          method: 'DELETE',
        }
      ),
  }
}
