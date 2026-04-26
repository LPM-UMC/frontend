import { useApiRequest } from '#features/shared/api/http'
import type { UserFormInput, UserListPayload, UserRecord } from '../types/user'

export const USER_ENDPOINTS = {
  list: '/api/v1/dashboard/manajemen-user',
  create: '/api/v1/dashboard/manajemen-user/create',
  detail: (userId: string) => `/api/v1/dashboard/manajemen-user/${encodeURIComponent(userId)}`,
  update: (userId: string) => `/api/v1/dashboard/manajemen-user/${encodeURIComponent(userId)}/update`,
  remove: (userId: string) => `/api/v1/dashboard/manajemen-user/${encodeURIComponent(userId)}/delete`,
}

export function useUserApi() {
  const { request } = useApiRequest()

  async function listUsers() {
    return request<UserListPayload>(USER_ENDPOINTS.list)
  }

  async function createUser(payload: UserFormInput) {
    return request<UserRecord>(USER_ENDPOINTS.create, {
      method: 'POST',
      body: payload,
    })
  }

  async function getUser(userId: string) {
    return request<UserRecord>(USER_ENDPOINTS.detail(userId))
  }

  async function updateUser(userId: string, payload: Partial<UserFormInput>) {
    return request<UserRecord>(USER_ENDPOINTS.update(userId), {
      method: 'PUT',
      body: payload,
    })
  }

  async function removeUser(userId: string) {
    return request<{ deleted: boolean }>(USER_ENDPOINTS.remove(userId), {
      method: 'DELETE',
    })
  }

  return {
    endpoints: USER_ENDPOINTS,
    listUsers,
    createUser,
    getUser,
    updateUser,
    removeUser,
  }
}
