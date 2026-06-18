import { useApiRequest } from '#features/shared/api/http'

export interface BuktiRecord {
  id: string
  name: string
  fileUrl: string
  uploadedAt: string
}

export const BUKTI_ENDPOINTS = {
  list: (periodeModulId: string, unitId: string, fmCode: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/${encodeURIComponent(fmCode)}/bukti`,
  upload: (periodeModulId: string, unitId: string, fmCode: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/${encodeURIComponent(fmCode)}/bukti/upload`,
}

export function useBuktiApi() {
  const { request } = useApiRequest()

  return {
    endpoints: BUKTI_ENDPOINTS,
    listBukti: (periodeModulId: string, unitId: string, fmCode: string) =>
      request<BuktiRecord[]>(BUKTI_ENDPOINTS.list(periodeModulId, unitId, fmCode)),
    uploadBukti: (
      periodeModulId: string,
      unitId: string,
      fmCode: string,
      file: File
    ) => {
      const formData = new FormData()
      formData.append('file', file)

      return request<BuktiRecord>(BUKTI_ENDPOINTS.upload(periodeModulId, unitId, fmCode), {
        method: 'POST',
        body: formData,
      })
    },
  }
}
