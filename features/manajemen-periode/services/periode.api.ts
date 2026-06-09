import { useApi } from '#composables/useApi'
import type { PeriodeResponse } from '#types/periode'

export interface PeriodeListParams {
  page?: number
  size?: number
  search?: string
  order?: 'asc' | 'desc'
  _t?: number
}

export interface PagingMeta {
  total: number
  page: number
  size: number
  total_pages: number
}

export interface PeriodeListResponse {
  data: PeriodeResponse[]
  meta: PagingMeta
}

export function usePeriodeApi() {
  const { apiFetch } = useApi()

  async function listPeriodes(params?: PeriodeListParams) {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.size) query.set('size', String(params.size))
    if (params?.search) query.set('search', params.search)
    if (params?.order) query.set('order', params.order)
    if (params?._t) query.set('_t', String(params._t))

    const qs = query.toString()
    const url = qs ? `/api/periode?${qs}` : '/api/periode'

    return apiFetch<PeriodeListResponse>(url)
  }

  async function getPeriodeAktif() {
    return apiFetch<{ data: PeriodeResponse | null }>('/api/periode/aktif')
  }

  async function createPeriode(fd: FormData) {
    return apiFetch('/api/periode', {
      method: 'POST',
      body: fd,
    })
  }

  async function updatePeriode(id: string, fd: FormData) {
    return apiFetch(`/api/periode/${id}`, {
      method: 'PATCH',
      body: fd,
    })
  }

  async function nonaktifkanPeriode(id: string) {
    return apiFetch(`/api/periode/${id}/nonaktifkan`, {
      method: 'PUT',
    })
  }

  async function downloadKalender(id: string) {
    return apiFetch<Blob>(`/api/periode/${id}/kalender/download`, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  return {
    listPeriodes,
    getPeriodeAktif,
    createPeriode,
    updatePeriode,
    nonaktifkanPeriode,
    downloadKalender
  }
}
