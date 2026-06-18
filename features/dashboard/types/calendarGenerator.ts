import type { DashboardApiEnvelope } from './dashboard'

export type CalendarSemester = 'Ganjil' | 'Genap'

export type CalendarSortOrder = 'latest' | 'oldest'

export interface CalendarGeneratorEntry {
  id: string
  period: string
  semester: CalendarSemester
  startDate: string
  endDate: string
  fileName: string
  fileSizeKb: number
  fileUrl: string
  createdAt: string
}

export interface CalendarGeneratorCreateInput {
  period: string
  semester: CalendarSemester
  startDate: string
  endDate: string
  file: File
}

export interface CalendarGeneratorApiItem {
  id: string
  period: string
  semester: CalendarSemester
  start_date: string
  end_date: string
  file_name: string
  file_size_kb: number
  file_url: string
  created_at: string
}

export interface CalendarGeneratorListApiPayload {
  items: CalendarGeneratorApiItem[]
}

export type CalendarGeneratorApiEnvelope<T> = DashboardApiEnvelope<T>
