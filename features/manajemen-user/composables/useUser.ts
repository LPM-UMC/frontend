import { ref } from 'vue'
import { useUserApi } from '../services/user.api'
import type { UserFormInput, UserRecord } from '../types/user'

export function useUser() {
  const api = useUserApi()

  const rows = ref<UserRecord[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    loading.value = true
    error.value = null

    try {
      const result = await api.listUsers()
      rows.value = result?.items ?? []
      total.value = result?.total ?? 0
    } catch {
      error.value = 'Gagal memuat data user.'
    } finally {
      loading.value = false
    }
  }

  async function saveUser(payload: UserFormInput, userId?: string) {
    if (userId) {
      return api.updateUser(userId, payload)
    }

    return api.createUser(payload)
  }

  async function deleteUser(userId: string) {
    return api.removeUser(userId)
  }

  return {
    rows,
    total,
    loading,
    error,
    fetchUsers,
    saveUser,
    deleteUser,
  }
}
