export interface AspekRecord {
  id: string
  modulId: string
  name: string
  description?: string
}

export interface AspekFormInput {
  modulId: string
  name: string
  description?: string
}

export interface AspekListPayload {
  items: AspekRecord[]
  total: number
}
