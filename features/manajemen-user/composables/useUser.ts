import { ref } from 'vue'
import { useUserApi, type UserListParams } from '../services/user.api'
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from '#types/user'
import type { PagingMeta } from '../services/user.api'

export function useUser() {
  const api = useUserApi()

  const rows = ref<UserResponse[]>([])
  const meta = ref<PagingMeta>({ total: 0, page: 1, size: 10, total_pages: 1 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(params?: UserListParams) {
    loading.value = true
    error.value = null

    try {
      const result = await api.listUsers(params)

      if (result) {
        rows.value = result.data ?? []
        meta.value = result.meta ?? { total: 0, page: 1, size: 10, total_pages: 1 }
      } else {
        rows.value = []
        meta.value = { total: 0, page: 1, size: 10, total_pages: 1 }
      }
    } catch {
      error.value = 'Gagal memuat data user.'
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(userId: string) {
    loading.value = true
    error.value = null

    try {
      const result = await api.getUser(userId)
      return result ?? null
    } catch {
      error.value = 'Gagal memuat detail user.'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createUser(payload: CreateUserRequest) {
    return api.createUser(payload)
  }

  async function updateUser(userId: string, payload: UpdateUserRequest) {
    return api.updateUser(userId, payload)
  }

  async function deleteUser(userId: string) {
    return api.removeUser(userId)
  }

  return {
    rows,
    meta,
    loading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
}
