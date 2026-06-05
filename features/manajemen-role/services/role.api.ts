import { useApiRequest } from '#features/shared/api/http'
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from '#types/role'

export interface RoleListParams {
  page?: number
  size?: number
  search?: string
  order?: 'asc' | 'desc'
}

export interface PagingMeta {
  total: number
  page: number
  size: number
  total_pages: number
}

export interface RoleListResponse {
  data: RoleResponse[]
  meta: PagingMeta
}

export const ROLE_ENDPOINTS = {
  list: '/api/roles',
  create: '/api/roles',
  update: (roleId: string) => `/api/roles/${encodeURIComponent(roleId)}`,
  remove: (roleId: string) => `/api/roles/${encodeURIComponent(roleId)}`,
  exportPdf: '/api/roles/export/pdf',
  exportCsv: '/api/roles/export/csv',
}

export function useRoleApi() {
  const { request } = useApiRequest()

  async function listRoles(params?: RoleListParams) {
    const query = new URLSearchParams()

    if (params?.page) query.set('page', String(params.page))
    if (params?.size) query.set('size', String(params.size))
    if (params?.search) query.set('search', params.search)
    if (params?.order) query.set('order', params.order)

    const qs = query.toString()
    const url = qs ? `${ROLE_ENDPOINTS.list}?${qs}` : ROLE_ENDPOINTS.list

    return request<RoleListResponse>(url)
  }

  async function createRole(payload: CreateRoleRequest) {
    return request<RoleResponse>(ROLE_ENDPOINTS.create, {
      method: 'POST',
      body: payload,
    })
  }

  async function updateRole(roleId: string, payload: UpdateRoleRequest) {
    return request<RoleResponse>(ROLE_ENDPOINTS.update(roleId), {
      method: 'PUT',
      body: payload,
    })
  }

  async function deleteRole(roleId: string) {
    return request<null>(ROLE_ENDPOINTS.remove(roleId), {
      method: 'DELETE',
    })
  }

  async function exportRolesPdf() {
    return request<Blob>(ROLE_ENDPOINTS.exportPdf, {
      responseType: 'blob',
    })
  }

  async function exportRolesCsv() {
    return request<Blob>(ROLE_ENDPOINTS.exportCsv, {
      responseType: 'blob',
    })
  }

  return {
    endpoints: ROLE_ENDPOINTS,
    listRoles,
    createRole,
    updateRole,
    deleteRole,
    exportRolesPdf,
    exportRolesCsv,
  }
}
