export type UserStatus = 'active' | 'inactive'

export interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  createdAt?: string
  updatedAt?: string
}

export interface UserFormInput {
  name: string
  email: string
  role: string
  status: UserStatus
  password?: string
}

export interface UserListPayload {
  items: UserRecord[]
  total: number
}
