import type {
  CalendarGeneratorCreateInput,
  CalendarGeneratorEntry,
} from '../types/calendarGenerator'

export const CALENDAR_GENERATOR_STORAGE_KEY =
  'dashboard-calendar-generator-dummy-v1'

export function getDefaultCalendarGeneratorEntries(): CalendarGeneratorEntry[] {
  return [
    {
      id: 'cal-2024-2025-ganjil',
      period: '2024/2025',
      semester: 'Ganjil',
      startDate: '2024-09-23',
      endDate: '2025-01-15',
      fileName: 'Kalender Akademik 2024-2025 Ganjil.pdf',
      fileSizeKb: 820,
      fileUrl: 'https://example.com/kalender/2024-2025-ganjil.pdf',
      createdAt: '2024-09-23T08:00:00.000Z',
    },
    {
      id: 'cal-2024-2025-genap',
      period: '2024/2025',
      semester: 'Genap',
      startDate: '2025-02-26',
      endDate: '2025-09-23',
      fileName: 'Kalender Akademik 2024-2025 Genap.pdf',
      fileSizeKb: 804,
      fileUrl: 'https://example.com/kalender/2024-2025-genap.pdf',
      createdAt: '2025-02-20T09:10:00.000Z',
    },
    {
      id: 'cal-2023-2024-ganjil',
      period: '2023/2024',
      semester: 'Ganjil',
      startDate: '2023-02-27',
      endDate: '2023-09-04',
      fileName: 'Kalender Akademik 2023-2024 Ganjil.pdf',
      fileSizeKb: 792,
      fileUrl: 'https://example.com/kalender/2023-2024-ganjil.pdf',
      createdAt: '2023-02-21T08:12:00.000Z',
    },
    {
      id: 'cal-2023-2024-genap',
      period: '2023/2024',
      semester: 'Genap',
      startDate: '2023-09-25',
      endDate: '2024-02-05',
      fileName: 'Kalender Akademik 2023-2024 Genap.pdf',
      fileSizeKb: 768,
      fileUrl: 'https://example.com/kalender/2023-2024-genap.pdf',
      createdAt: '2023-09-20T11:25:00.000Z',
    },
    {
      id: 'cal-2022-2023-ganjil',
      period: '2022/2023',
      semester: 'Ganjil',
      startDate: '2022-09-26',
      endDate: '2023-02-06',
      fileName: 'Kalender Akademik 2022-2023 Ganjil.pdf',
      fileSizeKb: 750,
      fileUrl: 'https://example.com/kalender/2022-2023-ganjil.pdf',
      createdAt: '2022-09-20T07:45:00.000Z',
    },
    {
      id: 'cal-2022-2023-genap',
      period: '2022/2023',
      semester: 'Genap',
      startDate: '2023-02-06',
      endDate: '2023-09-06',
      fileName: 'Kalender Akademik 2022-2023 Genap.pdf',
      fileSizeKb: 742,
      fileUrl: 'https://example.com/kalender/2022-2023-genap.pdf',
      createdAt: '2023-01-30T09:35:00.000Z',
    },
    {
      id: 'cal-2021-2022-ganjil',
      period: '2021/2022',
      semester: 'Ganjil',
      startDate: '2021-09-27',
      endDate: '2022-02-04',
      fileName: 'Kalender Akademik 2021-2022 Ganjil.pdf',
      fileSizeKb: 710,
      fileUrl: 'https://example.com/kalender/2021-2022-ganjil.pdf',
      createdAt: '2021-09-20T08:10:00.000Z',
    },
    {
      id: 'cal-2021-2022-genap',
      period: '2021/2022',
      semester: 'Genap',
      startDate: '2022-02-07',
      endDate: '2022-09-05',
      fileName: 'Kalender Akademik 2021-2022 Genap.pdf',
      fileSizeKb: 708,
      fileUrl: 'https://example.com/kalender/2021-2022-genap.pdf',
      createdAt: '2022-01-28T08:10:00.000Z',
    },
    {
      id: 'cal-2020-2021-ganjil',
      period: '2020/2021',
      semester: 'Ganjil',
      startDate: '2020-09-28',
      endDate: '2021-02-05',
      fileName: 'Kalender Akademik 2020-2021 Ganjil.pdf',
      fileSizeKb: 699,
      fileUrl: 'https://example.com/kalender/2020-2021-ganjil.pdf',
      createdAt: '2020-09-21T08:10:00.000Z',
    },
    {
      id: 'cal-2020-2021-genap',
      period: '2020/2021',
      semester: 'Genap',
      startDate: '2021-02-08',
      endDate: '2021-09-03',
      fileName: 'Kalender Akademik 2020-2021 Genap.pdf',
      fileSizeKb: 688,
      fileUrl: 'https://example.com/kalender/2020-2021-genap.pdf',
      createdAt: '2021-01-29T08:10:00.000Z',
    },
  ]
}

export function createDummyCalendarFileUrl(period: string, semester: string): string {
  const normalizedPeriod = period.replace('/', '-')
  return `https://example.com/kalender/${normalizedPeriod}-${semester.toLowerCase()}.pdf`
}

export function createDummyCalendarEntry(
  input: CalendarGeneratorCreateInput
): CalendarGeneratorEntry {
  return {
    id: `cal-${Date.now()}`,
    period: input.period,
    semester: input.semester,
    startDate: input.startDate,
    endDate: input.endDate,
    fileName: input.file.name,
    fileSizeKb: Math.max(1, Math.round(input.file.size / 1024)),
    fileUrl: createDummyCalendarFileUrl(input.period, input.semester),
    createdAt: new Date().toISOString(),
  }
}

export function readCalendarGeneratorEntriesFromStorage(
  storageKey: string = CALENDAR_GENERATOR_STORAGE_KEY
): CalendarGeneratorEntry[] {
  if (!process.client) return getDefaultCalendarGeneratorEntries()

  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    const defaults = getDefaultCalendarGeneratorEntries()
    writeCalendarGeneratorEntriesToStorage(defaults, storageKey)
    return defaults
  }

  try {
    const parsed = JSON.parse(raw) as CalendarGeneratorEntry[]
    if (!Array.isArray(parsed)) {
      const defaults = getDefaultCalendarGeneratorEntries()
      writeCalendarGeneratorEntriesToStorage(defaults, storageKey)
      return defaults
    }

    return parsed
  } catch {
    const defaults = getDefaultCalendarGeneratorEntries()
    writeCalendarGeneratorEntriesToStorage(defaults, storageKey)
    return defaults
  }
}

export function writeCalendarGeneratorEntriesToStorage(
  entries: CalendarGeneratorEntry[],
  storageKey: string = CALENDAR_GENERATOR_STORAGE_KEY
) {
  if (!process.client) return
  localStorage.setItem(storageKey, JSON.stringify(entries))
}
