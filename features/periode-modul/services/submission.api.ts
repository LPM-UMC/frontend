import { useApiRequest } from '#features/shared/api/http'
import type {
  Fm01PageData,
  SaveFm01IndicatorPayload,
} from '../types/form'

export const SUBMISSION_ENDPOINTS = {
  getFmAspek: (
    periodeModulId: string,
    unitId: string,
    fmCode: string,
    aspekId: string
  ) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/${encodeURIComponent(fmCode)}/aspek/${encodeURIComponent(aspekId)}`,
  saveIndicator: (
    periodeModulId: string,
    unitId: string,
    fmCode: string,
    aspekId: string
  ) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/${encodeURIComponent(fmCode)}/aspek/${encodeURIComponent(aspekId)}/indikator`,
}

export function useSubmissionApi() {
  const { request } = useApiRequest()

  return {
    endpoints: SUBMISSION_ENDPOINTS,
    getFmAspek: (
      periodeModulId: string,
      unitId: string,
      fmCode: string,
      aspekId: string
    ) =>
      request<Fm01PageData>(
        SUBMISSION_ENDPOINTS.getFmAspek(periodeModulId, unitId, fmCode, aspekId)
      ),
    saveIndicator: (
      periodeModulId: string,
      unitId: string,
      fmCode: string,
      aspekId: string,
      payload: SaveFm01IndicatorPayload
    ) =>
      request<{ saved: boolean }>(
        SUBMISSION_ENDPOINTS.saveIndicator(periodeModulId, unitId, fmCode, aspekId),
        {
          method: 'POST',
          body: payload,
        }
      ),
  }
}
