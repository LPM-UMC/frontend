import { useApiRequest } from '#features/shared/api/http'

export type BeritaAcaraStatus = 'DRAFT' | 'MENUNGGU_TANDA_TANGAN' | 'DISANGGAH' | 'FINAL'
export type TandaTanganStatus = 'MENUNGGU' | 'DITANDATANGANI' | 'DISANGGAH'

export interface Pageable {
  total: number
  page: number
  size: number
  total_pages: number
}

export interface Fm5DashboardRow {
  id: string
  nomorBeritaAcara: string
  programStudi: string
  tanggalMulai: string
  status: BeritaAcaraStatus
}

export interface Fm5DashboardResponse {
  data: {
    indicators: any[]
    rows: Fm5DashboardRow[]
  }
  meta: Pageable
}

export interface Fm5CreateDataResponse {
  periode: {
    id: string
    tahun_ajaran: string
    semester: string
  }
  unit: {
    id: string
    nama: string
  }
}

export interface Fm5CreatePayload {
  tanggalPelaksanaan: string
  batasWaktuTandaTangan: string
}

export interface Fm5CreateResponse {
  id: string
  nomor: string
}

export interface Fm5TandaTangan {
  id: string
  userId: string | null
  roleId: string
  urutan: number
  status: TandaTanganStatus
  signedAt: string | null
  role: {
    nama: string
  }
  user?: {
    nama: string
  }
}

export interface Fm5Sanggahan {
  id: string
  pesan: string
  createdAt: string
  user: {
    id: string
    nama: string
  }
}

export interface Fm5Lampiran {
  id: string
  nama_file: string
  ukuran: number
  created_at: string
}

export interface Fm5DetailResponse {
  id: string
  nomor: string
  programStudi: string
  tanggalPelaksanaan: string
  batasWaktuTandaTangan: string
  hari: string
  bulan: string
  tahun: string
  semester: string
  status: BeritaAcaraStatus
  createdAt: string
  tandaTangans: Fm5TandaTangan[]
  sanggahans: Fm5Sanggahan[]
  dokumenTerverifikasi?: {
    qrCodeUrl: string
    digitalSignature: string
  }
}

export interface Fm5SignPayload {
  roleId: string
}

export interface Fm5SanggahPayload {
  roleId: string
  pesan: string
}

export const FM5_ENDPOINTS = {
  dashboard: (periodeModulId: string, unitId: string) =>
    `/api/fm5/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/dashboard`,
  createData: (periodeModulId: string, unitId: string) =>
    `/api/fm5/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/create-data`,
  create: (periodeModulId: string, unitId: string) =>
    `/api/fm5/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/berita-acara`,
  detail: (beritaAcaraId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}`,
  sign: (beritaAcaraId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/tanda-tangan`,
  sanggah: (beritaAcaraId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/sanggah`,
  tarikSanggah: (beritaAcaraId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/tarik-sanggah`,
  verifyPublic: (beritaAcaraId: string) =>
    `/api/fm5/verify/berita-acara/${encodeURIComponent(beritaAcaraId)}`,
  lampiran: (beritaAcaraId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/lampiran`,
  lampiranUrl: (beritaAcaraId: string, lampiranId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/lampiran/${encodeURIComponent(lampiranId)}/url`,
  lampiranDelete: (beritaAcaraId: string, lampiranId: string) =>
    `/api/fm5/berita-acara/${encodeURIComponent(beritaAcaraId)}/lampiran/${encodeURIComponent(lampiranId)}`,
}

export function useFm5Api() {
  const { request } = useApiRequest()

  return {
    endpoints: FM5_ENDPOINTS,
    getDashboard: (
      periodeModulId: string,
      unitId: string,
      params: { page?: number; size?: number; search?: string; order?: 'asc' | 'desc' } = {}
    ) => {
      const query = new URLSearchParams()
      if (params.page) query.set('page', params.page.toString())
      if (params.size) query.set('size', params.size.toString())
      if (params.search) query.set('search', params.search)
      if (params.order) query.set('order', params.order)

      const url = `${FM5_ENDPOINTS.dashboard(periodeModulId, unitId)}?${query.toString()}`
      return request<Fm5DashboardResponse>(url)
    },
    getCreateData: (periodeModulId: string, unitId: string) =>
      request<Fm5CreateDataResponse>(FM5_ENDPOINTS.createData(periodeModulId, unitId)),
    createBeritaAcara: (periodeModulId: string, unitId: string, payload: Fm5CreatePayload) =>
      request<Fm5CreateResponse>(FM5_ENDPOINTS.create(periodeModulId, unitId), {
        method: 'POST',
        body: payload,
      }),
    getDetail: (beritaAcaraId: string) =>
      request<Fm5DetailResponse>(FM5_ENDPOINTS.detail(beritaAcaraId)),
    signBeritaAcara: (beritaAcaraId: string, payload: Fm5SignPayload) =>
      request<void>(FM5_ENDPOINTS.sign(beritaAcaraId), {
        method: 'POST',
        body: payload,
      }),
    sanggahBeritaAcara: (beritaAcaraId: string, payload: Fm5SanggahPayload) =>
      request<void>(FM5_ENDPOINTS.sanggah(beritaAcaraId), {
        method: 'POST',
        body: payload,
      }),
    tarikSanggahBeritaAcara: (beritaAcaraId: string, payload: { roleId: string }) =>
      request<void>(FM5_ENDPOINTS.tarikSanggah(beritaAcaraId), {
        method: 'POST',
        body: payload,
      }),
    verifyPublic: (beritaAcaraId: string) =>
      $fetch<{ data: Fm5DetailResponse }>(FM5_ENDPOINTS.verifyPublic(beritaAcaraId), {
        baseURL: ((useRuntimeConfig().public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '')
      }),
    uploadLampiran: (beritaAcaraId: string, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return request<any>(FM5_ENDPOINTS.lampiran(beritaAcaraId), {
        method: 'POST',
        body: formData,
      })
    },
    getLampirans: (beritaAcaraId: string) =>
      request<Fm5Lampiran[]>(FM5_ENDPOINTS.lampiran(beritaAcaraId)),
    getLampiranUrl: (beritaAcaraId: string, lampiranId: string) =>
      request<{ url: string }>(FM5_ENDPOINTS.lampiranUrl(beritaAcaraId, lampiranId)),
    deleteLampiran: (beritaAcaraId: string, lampiranId: string) =>
      request<void>(FM5_ENDPOINTS.lampiranDelete(beritaAcaraId, lampiranId), {
        method: 'DELETE',
      }),
  }
}
