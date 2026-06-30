import { useApiRequest } from '#features/shared/api/http'

// ================= TYPES =================
export type SurveyStatus = 'DRAFT' | 'AKTIF' | 'SELESAI'
export type TipePertanyaan = 'PILIHAN_GANDA' | 'ESAI'

export interface Pageable {
  total: number
  page: number
  size: number
  total_pages: number
}

export interface Fm6DashboardRow {
  id: string
  judul: string
  programStudi: string
  status: SurveyStatus
  totalPertanyaan: number
  totalResponden: number
  createdAt: string
}

export interface Fm6DashboardResponse {
  data: {
    indicators: {
      id: string
      title: string
      value: number
      progressPercent: number
    }[]
    rows: Fm6DashboardRow[]
  }
  meta: Pageable
}

export interface Fm6CreateDataResponse {
  periode: {
    id: string
    tahun_ajaran: string
    semester: string
  }
  unit: {
    id: string
    nama: string
  }
  tipePertanyaan: {
    value: string
    label: string
  }[]
}

export interface Fm6OpsiJawaban {
  label: string
  bobot: number
}

export interface Fm6PertanyaanPayload {
  urutan: number
  pertanyaan: string
  tipe: TipePertanyaan
  placeholder?: string
  opsiJawabans?: Fm6OpsiJawaban[]
}

export interface Fm6CreatePayload {
  judul: string
  deskripsi: string
  pertanyaans: Fm6PertanyaanPayload[]
}

export interface Fm6CreateResponse {
  id: string
}

export interface Fm6OpsiJawabanResponse {
  id: string
  label: string
  bobot: number
}

export interface Fm6PertanyaanResponse {
  id: string
  urutan: number
  pertanyaan: string
  tipe: TipePertanyaan
  placeholder: string | null
  opsiJawabans: Fm6OpsiJawabanResponse[]
  jawabanEsai?: string[]
  rekapPilihanGanda?: {
    opsiId: string
    label: string
    jumlah: number
    persentase: number
  }[]
}

export interface Fm6ChartBar {
  label: string
  value: number
  tone: 'strong' | 'medium' | 'weak'
}

export interface Fm6ChartSection {
  id: string
  title: string
  bars: Fm6ChartBar[]
}

export interface Fm6DetailResponse {
  id: string
  judul: string
  deskripsi: string
  programStudi: string
  status: SurveyStatus
  createdAt: string
  totalResponden: number
  rataRataSkor: number
  pertanyaans: Fm6PertanyaanResponse[]
  chartSections: Fm6ChartSection[]
}

export interface Fm6MahasiswaSurveyItem {
  id: string
  judul: string
  deskripsi: string
  programStudi: string
  totalPertanyaan: number
  sudahDijawab: boolean
  createdAt: string
  status: string
}

export interface Fm6MahasiswaSurveyDetailResponse {
  id: string
  judul: string
  deskripsi: string
  programStudi: string
  sudahDijawab: boolean
  pertanyaans: Fm6PertanyaanResponse[]
  userAnswers?: {
    pertanyaanId: string
    opsiJawabanId?: string
    jawabanTeks?: string
  }[]
}

export interface Fm6JawabanPayload {
  answers: {
    pertanyaanId: string
    opsiJawabanId?: string
    jawabanTeks?: string
  }[]
}

// ================= ENDPOINTS =================
export const FM6_ENDPOINTS = {
  dashboard: (periodeModulId: string, unitId: string) =>
    `/api/fm6/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/dashboard`,
  createData: (periodeModulId: string, unitId: string) =>
    `/api/fm6/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/create-data`,
  create: (periodeModulId: string, unitId: string) =>
    `/api/fm6/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/survey`,
  detail: (surveyId: string) =>
    `/api/fm6/survey/${encodeURIComponent(surveyId)}`,
  updateStatus: (surveyId: string) =>
    `/api/fm6/survey/${encodeURIComponent(surveyId)}/status`,
  deleteSurvey: (surveyId: string) =>
    `/api/fm6/survey/${encodeURIComponent(surveyId)}`,
  mahasiswaSurveys: (periodeModulId: string, unitId: string) =>
    `/api/fm6/periode-modul/${encodeURIComponent(periodeModulId)}/unit/${encodeURIComponent(unitId)}/mahasiswa/surveys`,
  mahasiswaSurveysAll: () => `/api/fm6/mahasiswa/surveys/all`,
  mahasiswaSurveyDetail: (surveyId: string) =>
    `/api/fm6/mahasiswa/survey/${encodeURIComponent(surveyId)}`,
  mahasiswaJawab: (surveyId: string) =>
    `/api/fm6/mahasiswa/survey/${encodeURIComponent(surveyId)}/jawab`,
}

// ================= API COMPOSABLE =================
export function useFm6Api() {
  const { request } = useApiRequest()

  return {
    endpoints: FM6_ENDPOINTS,

    // Admin: Dashboard
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

      const url = `${FM6_ENDPOINTS.dashboard(periodeModulId, unitId)}?${query.toString()}`
      return request<Fm6DashboardResponse>(url)
    },

    // Admin: Create data (form options)
    getCreateData: (periodeModulId: string, unitId: string) =>
      request<Fm6CreateDataResponse>(FM6_ENDPOINTS.createData(periodeModulId, unitId)),

    // Admin: Create survey
    createSurvey: (periodeModulId: string, unitId: string, payload: Fm6CreatePayload) =>
      request<Fm6CreateResponse>(FM6_ENDPOINTS.create(periodeModulId, unitId), {
        method: 'POST',
        body: payload,
      }),

    // Admin: Update survey
    updateSurvey: (surveyId: string, payload: Fm6CreatePayload) =>
      request<void>(FM6_ENDPOINTS.detail(surveyId), {
        method: 'PUT',
        body: payload,
      }),

    // Admin: Detail (with analytics)
    getDetail: (surveyId: string) =>
      request<Fm6DetailResponse>(FM6_ENDPOINTS.detail(surveyId) + `?t=${Date.now()}`),

    // Admin: Update status
    updateStatus: (surveyId: string, status: SurveyStatus) =>
      request<void>(FM6_ENDPOINTS.updateStatus(surveyId), {
        method: 'PATCH',
        body: { status },
      }),

    // Admin: Delete survey
    deleteSurvey: (surveyId: string) =>
      request<void>(FM6_ENDPOINTS.deleteSurvey(surveyId), {
        method: 'DELETE',
      }),

    // Mahasiswa: List active surveys
    getMahasiswaSurveys: (periodeModulId: string, unitId: string) =>
      request<Fm6MahasiswaSurveyItem[]>(FM6_ENDPOINTS.mahasiswaSurveys(periodeModulId, unitId)),

    getAllMahasiswaSurveys: () =>
      request<Fm6MahasiswaSurveyItem[]>(FM6_ENDPOINTS.mahasiswaSurveysAll()),

    // Mahasiswa: Get survey detail for answering
    getMahasiswaSurveyDetail: (surveyId: string) =>
      request<Fm6MahasiswaSurveyDetailResponse>(FM6_ENDPOINTS.mahasiswaSurveyDetail(surveyId)),

    // Mahasiswa: Submit answers
    submitJawaban: (surveyId: string, payload: Fm6JawabanPayload) =>
      request<void>(FM6_ENDPOINTS.mahasiswaJawab(surveyId), {
        method: 'POST',
        body: payload,
      }),
  }
}
