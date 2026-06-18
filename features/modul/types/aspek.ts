export interface AspekRecord {
  id: string
  modulId: string
  nama: string
  deskripsi?: string
}

export interface AspekFormInput {
  modulId: string
  nama: string
  deskripsi?: string
}

export interface AspekListPayload {
  items: AspekRecord[]
  total: number
}
