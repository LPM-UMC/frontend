export interface ObjekRecord {
  id: string
  lingkupId: string
  unitId?: string
  name: string
  description?: string
}

export interface ObjekFormInput {
  lingkupId: string
  unitId?: string
  name: string
  description?: string
}

export interface ObjekListPayload {
  items: ObjekRecord[]
  total: number
}
