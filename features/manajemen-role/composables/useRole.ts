import { ref } from 'vue'
import { useRoleApi, type RoleListParams } from '../services/role.api'
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from '#types/role'
import type { PagingMeta } from '../services/role.api'

export function useRole() {
  const api = useRoleApi()

  const rows = ref<RoleResponse[]>([])
  const meta = ref<PagingMeta>({ total: 0, page: 1, size: 10, total_pages: 1 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoles(params?: RoleListParams) {
    loading.value = true
    error.value = null

    try {
      const result = await api.listRoles(params)

      if (result) {
        rows.value = result.data ?? []
        meta.value = result.meta ?? { total: 0, page: 1, size: 10, total_pages: 1 }
      } else {
        rows.value = []
        meta.value = { total: 0, page: 1, size: 10, total_pages: 1 }
      }
    } catch {
      error.value = 'Gagal memuat data role.'
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  async function createRole(payload: CreateRoleRequest) {
    return api.createRole(payload)
  }

  async function updateRole(roleId: string, payload: UpdateRoleRequest) {
    return api.updateRole(roleId, payload)
  }

  async function deleteRole(roleId: string) {
    return api.deleteRole(roleId)
  }

  async function exportRolesPdf() {
    return api.exportRolesPdf()
  }

  async function exportRolesCsv() {
    return api.exportRolesCsv()
  }

  return {
    rows,
    meta,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    exportRolesPdf,
    exportRolesCsv,
  }
}
