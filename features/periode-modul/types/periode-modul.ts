export type PeriodeModulStatus = 'draft' | 'active' | 'closed'

export interface PeriodeModulRecord {
  id: string
  name: string
  year: string
  semester: 'Ganjil' | 'Genap'
  status: PeriodeModulStatus
  startDate?: string
  endDate?: string
}

export interface PeriodeModulFormInput {
  name: string
  year: string
  semester: 'Ganjil' | 'Genap'
  status?: PeriodeModulStatus
  startDate?: string
  endDate?: string
}

export interface PeriodeModulListPayload {
  items: PeriodeModulRecord[]
  total: number
}
