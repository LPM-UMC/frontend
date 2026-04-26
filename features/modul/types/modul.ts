export interface ModulRecord {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface ModulFormInput {
  name: string
  description?: string
}

export interface ModulListPayload {
  items: ModulRecord[]
  total: number
}
