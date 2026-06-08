export interface UnitRecord {
  id: string
  lingkupId: string
  name: string
  description?: string
}

export interface UnitFormInput {
  lingkupId: string
  name: string
  description?: string
}

export interface UnitListPayload {
  items: UnitRecord[]
  total: number
}
