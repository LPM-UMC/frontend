import { useApiRequest } from '#features/shared/api/http'
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from '#types/user'

export interface UserListParams {
  page?: number
  size?: number
  search?: string
  order?: 'asc' | 'desc'
  roleId?: string
}

export interface PagingMeta {
  total: number
  page: number
  size: number
  total_pages: number
}

export interface UserListResponse {
  data: UserResponse[]
  meta: PagingMeta
}

export const USER_ENDPOINTS = {
  list: '/api/users',
  create: '/api/users',
  detail: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
  update: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
  remove: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,
}

export function useUserApi() {
  const { request } = useApiRequest()

  async function listUsers(params?: UserListParams) {
    const query = new URLSearchParams()

    if (params?.page) query.set('page', String(params.page))
    if (params?.size) query.set('size', String(params.size))
    if (params?.search) query.set('search', params.search)
    if (params?.order) query.set('order', params.order)
    if (params?.roleId) query.set('roleId', params.roleId)

    const qs = query.toString()
    const url = qs ? `${USER_ENDPOINTS.list}?${qs}` : USER_ENDPOINTS.list

    return request<UserListResponse>(url)
  }

  async function createUser(payload: CreateUserRequest) {
    return request<UserResponse>(USER_ENDPOINTS.create, {
      method: 'POST',
      body: payload,
    })
  }

  async function getUser(userId: string) {
    return request<UserResponse>(USER_ENDPOINTS.detail(userId))
  }

  async function updateUser(userId: string, payload: UpdateUserRequest) {
    return request<UserResponse>(USER_ENDPOINTS.update(userId), {
      method: 'PUT',
      body: payload,
    })
  }

  async function removeUser(userId: string) {
    return request<null>(USER_ENDPOINTS.remove(userId), {
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
