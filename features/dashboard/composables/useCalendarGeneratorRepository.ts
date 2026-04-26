import {
  CALENDAR_GENERATOR_STORAGE_KEY,
  createDummyCalendarEntry,
  readCalendarGeneratorEntriesFromStorage,
  writeCalendarGeneratorEntriesToStorage,
} from '../data/calendarGeneratorDummy'
import type {
  CalendarGeneratorApiItem,
  CalendarGeneratorCreateInput,
  CalendarGeneratorEntry,
  CalendarGeneratorListApiPayload,
} from '../types/calendarGenerator'
import type { DashboardApiEnvelope, DashboardSourceMode } from '../types/dashboard'

type ResolvedSource = 'api' | 'auto'

export const CALENDAR_GENERATOR_ENDPOINTS = {
  list: '/api/v1/dashboard/calendar-generator',
  create: '/api/v1/dashboard/calendar-generator',
}

function unwrapApiEnvelope<T>(payload: T | DashboardApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as DashboardApiEnvelope<T>)
  ) {
    return (payload as DashboardApiEnvelope<T>).data
  }

  return payload as T
}

function mapApiItemToEntry(item: CalendarGeneratorApiItem): CalendarGeneratorEntry {
  return {
    id: item.id,
    period: item.period,
    semester: item.semester,
    startDate: item.start_date,
    endDate: item.end_date,
    fileName: item.file_name,
    fileSizeKb: item.file_size_kb,
    fileUrl: item.file_url,
    createdAt: item.created_at,
  }
}

function normalizeApiListPayload(
  payload: CalendarGeneratorApiItem[] | CalendarGeneratorListApiPayload
): CalendarGeneratorApiItem[] {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.items)) return payload.items
  return []
}

export function useCalendarGeneratorRepository(
  initialMode: DashboardSourceMode = 'auto',
  options?: { storageKey?: string }
) {
  const mode = ref<DashboardSourceMode>(initialMode)
  const resolvedSource = ref<ResolvedSource>('auto')
  const config = useRuntimeConfig()
  const storageKey = options?.storageKey ?? CALENDAR_GENERATOR_STORAGE_KEY

  async function fetchFromApi<T>(
    endpoint: string,
    request: { method?: 'GET' | 'POST'; body?: BodyInit | Record<string, unknown> } = {}
  ): Promise<T | null> {
    try {
      const response = await $fetch<T | DashboardApiEnvelope<T>>(endpoint, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        method: request.method,
        body: request.body,
      })

      resolvedSource.value = 'api'
      return unwrapApiEnvelope(response)
    } catch {
      return null
    }
  }

  async function getCalendars(): Promise<CalendarGeneratorEntry[]> {
    if (mode.value !== 'dummy') {
      const apiData = await fetchFromApi<
        CalendarGeneratorApiItem[] | CalendarGeneratorListApiPayload
      >(CALENDAR_GENERATOR_ENDPOINTS.list)

      if (apiData) {
        return normalizeApiListPayload(apiData).map(mapApiItemToEntry)
      }
    }

    resolvedSource.value = 'auto'
    return readCalendarGeneratorEntriesFromStorage(storageKey)
  }

  async function createCalendar(
    input: CalendarGeneratorCreateInput
  ): Promise<CalendarGeneratorEntry | null> {
    if (mode.value !== 'dummy') {
      const formData = new FormData()
      formData.append('period', input.period)
      formData.append('semester', input.semester)
      formData.append('start_date', input.startDate)
      formData.append('end_date', input.endDate)
      formData.append('file', input.file)

      const apiData = await fetchFromApi<CalendarGeneratorApiItem>(
        CALENDAR_GENERATOR_ENDPOINTS.create,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (apiData) {
        return mapApiItemToEntry(apiData)
      }
    }

    resolvedSource.value = 'auto'

    const current = readCalendarGeneratorEntriesFromStorage(storageKey)
    const nextEntry = createDummyCalendarEntry(input)
    const nextData = [nextEntry, ...current]
    writeCalendarGeneratorEntriesToStorage(nextData, storageKey)
    return nextEntry
  }

  return {
    mode,
    resolvedSource,
    endpoints: CALENDAR_GENERATOR_ENDPOINTS,
    getCalendars,
    createCalendar,
  }
}
