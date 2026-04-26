export interface LingkupRecord {
  id: string
  name: string
  description?: string
}

export interface LingkupFormInput {
  name: string
  description?: string
}

export interface LingkupListPayload {
  items: LingkupRecord[]
  total: number
}
