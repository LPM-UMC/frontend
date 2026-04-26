export type DashboardModulStatus = 'Aktif' | 'Non Aktif'

export type DashboardModulSortOrder = 'a-z' | 'z-a'

export interface DashboardModulInfoCard {
  id: string
  title: string
  value: string | number
  progressPercent: number
  actionLabel: string
}

export interface DashboardModulListItem {
  id: string
  name: string
  description: string
  lingkupEvaluasi: string
  totalAspek: number
  status: DashboardModulStatus
  createdAt: string
  openedAt: string
}

export interface DashboardModulDetail {
  id: string
  name: string
  description: string
  unitEvaluasi: string
  penanggungJawab: string
  evaluator: string
  createdAt: string
  roleTtdBeritaAcara: string[]
  roleTtdLaporan: string[]
  totalAspek: number
  totalObjekEvaluasi: number
  totalPeriodeDibuat: number
  lastSavedAt: string
}

export interface DashboardModulAspekItem {
  id: string
  name: string
  description: string
  objekEvaluasi: string
  indikatorEvaluasi: string[]
}

export interface DashboardModulSurveiItem {
  id: string
  templateSurvei: string
  description: string
  target: string
}

export interface DashboardModulFormData {
  name: string
  description: string
  unitEvaluasi: string
}

export interface DashboardModulDetailBundle {
  detail: DashboardModulDetail
  aspek: DashboardModulAspekItem[]
  survei: DashboardModulSurveiItem[]
}

export interface DashboardModulDummyDataset {
  listItems: DashboardModulListItem[]
  detailByModulId: Record<string, DashboardModulDetailBundle>
  unitEvaluasiOptions: string[]
}

const dashboardModulListItems: DashboardModulListItem[] = [
  {
    id: 'monev-awal-pembelajaran',
    name: 'Monev Awal Pembelajaran',
    description: 'Monitoring evaluasi awal pembelajaran.',
    lingkupEvaluasi: 'Program Studi',
    totalAspek: 10,
    status: 'Aktif',
    createdAt: '2025-08-01',
    openedAt: '2026-04-21',
  },
  {
    id: 'monev-akhir-pembelajaran',
    name: 'Monev Akhir Pembelajaran',
    description: 'Monitoring evaluasi akhir pembelajaran.',
    lingkupEvaluasi: 'Loremipsun',
    totalAspek: 10,
    status: 'Aktif',
    createdAt: '2025-08-01',
    openedAt: '2026-04-20',
  },
  {
    id: 'monev-loremipsun-1',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Loremipsun',
    totalAspek: 10,
    status: 'Aktif',
    createdAt: '2025-08-01',
    openedAt: '2026-04-19',
  },
  {
    id: 'monev-loremipsun-2',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Loremipsun',
    totalAspek: 10,
    status: 'Non Aktif',
    createdAt: '2025-08-01',
    openedAt: '2026-04-18',
  },
  {
    id: 'monev-loremipsun-3',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Loremipsun',
    totalAspek: 10,
    status: 'Non Aktif',
    createdAt: '2025-08-01',
    openedAt: '2026-04-17',
  },
  {
    id: 'monev-loremipsun-4',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Fakultas',
    totalAspek: 8,
    status: 'Aktif',
    createdAt: '2025-07-20',
    openedAt: '2026-04-16',
  },
  {
    id: 'monev-loremipsun-5',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Lembaga',
    totalAspek: 9,
    status: 'Aktif',
    createdAt: '2025-07-18',
    openedAt: '2026-04-14',
  },
  {
    id: 'monev-loremipsun-6',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Program Studi',
    totalAspek: 7,
    status: 'Non Aktif',
    createdAt: '2025-07-11',
    openedAt: '2026-04-12',
  },
  {
    id: 'monev-loremipsun-7',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Program Studi',
    totalAspek: 6,
    status: 'Aktif',
    createdAt: '2025-07-08',
    openedAt: '2026-04-10',
  },
  {
    id: 'monev-loremipsun-8',
    name: 'Monev Loremipsun',
    description: 'Template evaluasi pelaksanaan perkuliahan.',
    lingkupEvaluasi: 'Universitas',
    totalAspek: 5,
    status: 'Non Aktif',
    createdAt: '2025-06-29',
    openedAt: '2026-04-05',
  },
]

const baseDetailBundle: DashboardModulDetailBundle = {
  detail: {
    id: 'monev-awal-pembelajaran',
    name: 'Monev Awal Semester',
    description: 'Monitoring dan evaluasi kesiapan pembelajaran awal semester.',
    unitEvaluasi: 'Program Studi (Terhubung GS)',
    penanggungJawab: 'Kaprodi (Terhubung GS)',
    evaluator: 'GKMF',
    createdAt: '01-01-2026',
    roleTtdBeritaAcara: ['1. GKMF', '2. Kaprodi', '3. Dekan', '4. LPM'],
    roleTtdLaporan: ['1. GKMF', '2. Kaprodi', '3. Dekan', '4. LPM', '5. WR 1'],
    totalAspek: 3,
    totalObjekEvaluasi: 2,
    totalPeriodeDibuat: 2,
    lastSavedAt: '15 Feb 2026, 14:30',
  },
  aspek: [
    {
      id: 'kesiapan-rps',
      name: 'Kesiapan RPS',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Mata Kuliah (Terhubung GS)',
      indikatorEvaluasi: [
        'RPS Tersedia (Terhubung ke GS)',
        'Status Validasi RPS (Terhubung ke GS)',
      ],
    },
    {
      id: 'praktikum',
      name: 'Praktikum',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Mata Kuliah (Terhubung GS)',
      indikatorEvaluasi: [
        'Alat dan Bahan Siap (Manual)',
        'Status Validasi RPS (Terhubung ke GS)',
      ],
    },
    {
      id: 'aspek-loremipsun',
      name: 'Aspek Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Loremipsun',
      indikatorEvaluasi: [
        'lorem ipsum dolor (LoremIpsun)',
        'lorem ipsum dolor (LoremIpsun)',
      ],
    },
    {
      id: 'aspek-loremipsun-2',
      name: 'Aspek Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Loremipsun',
      indikatorEvaluasi: [
        'lorem ipsum dolor (LoremIpsun)',
        'lorem ipsum dolor (LoremIpsun)',
      ],
    },
    {
      id: 'aspek-loremipsun-3',
      name: 'Aspek Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Loremipsun',
      indikatorEvaluasi: [
        'lorem ipsum dolor (LoremIpsun)',
        'lorem ipsum dolor (LoremIpsun)',
      ],
    },
  ],
  survei: [
    {
      id: 'survei-awal-mahasiswa',
      templateSurvei: 'Default Survei Awal Pembelajaran Mahasiswa',
      description: 'Deskripsi Singkat',
      target: 'Mahasiswa',
    },
    {
      id: 'survei-awal-general',
      templateSurvei: 'Default Survei Awal Pembelajaran General',
      description: 'Deskripsi Singkat',
      target: 'Mahasiswa Dosen',
    },
    {
      id: 'survei-loremipsun-1',
      templateSurvei: 'Aspek Loremipsun',
      description: 'Deskripsi Singkat',
      target: 'Loremipsun',
    },
    {
      id: 'survei-loremipsun-2',
      templateSurvei: 'Aspek Loremipsun',
      description: 'Deskripsi Singkat',
      target: 'Loremipsun',
    },
  ],
}

const unitEvaluasiOptions = [
  'Program Studi',
  'Fakultas',
  'Lembaga',
  'Universitas',
]

function cloneAspekRows(rows: DashboardModulAspekItem[]): DashboardModulAspekItem[] {
  return rows.map((row) => ({
    ...row,
    indikatorEvaluasi: [...row.indikatorEvaluasi],
  }))
}

function cloneSurveiRows(rows: DashboardModulSurveiItem[]): DashboardModulSurveiItem[] {
  return rows.map((row) => ({ ...row }))
}

function cloneDetailBundle(bundle: DashboardModulDetailBundle): DashboardModulDetailBundle {
  return {
    detail: {
      ...bundle.detail,
      roleTtdBeritaAcara: [...bundle.detail.roleTtdBeritaAcara],
      roleTtdLaporan: [...bundle.detail.roleTtdLaporan],
    },
    aspek: cloneAspekRows(bundle.aspek),
    survei: cloneSurveiRows(bundle.survei),
  }
}

export function getDashboardModulDummyDataset(): DashboardModulDummyDataset {
  const detailByModulId: Record<string, DashboardModulDetailBundle> = {}

  dashboardModulListItems.forEach((item) => {
    detailByModulId[item.id] = cloneDetailBundle({
      detail: {
        ...baseDetailBundle.detail,
        id: item.id,
        name: item.name === 'Monev Awal Pembelajaran' ? 'Monev Awal Semester' : item.name,
        description: item.description || baseDetailBundle.detail.description,
        totalAspek: item.totalAspek,
      },
      aspek: baseDetailBundle.aspek,
      survei: baseDetailBundle.survei,
    })
  })

  return {
    listItems: dashboardModulListItems.map((item) => ({ ...item })),
    detailByModulId,
    unitEvaluasiOptions: [...unitEvaluasiOptions],
  }
}

export function getDashboardModulDummyList(): DashboardModulListItem[] {
  return getDashboardModulDummyDataset().listItems
}

export function getDashboardModulDummyDetail(modulId?: string | null): DashboardModulDetailBundle {
  const dataset = getDashboardModulDummyDataset()
  const fallback = dataset.listItems[0]

  if (!fallback) {
    return cloneDetailBundle(baseDetailBundle)
  }

  const fallbackBundle = dataset.detailByModulId[fallback.id] ?? baseDetailBundle
  const resolvedBundle = modulId ? dataset.detailByModulId[modulId] : undefined

  return cloneDetailBundle(resolvedBundle ?? fallbackBundle)
}

export function getDashboardModulCreateDefaultForm(): DashboardModulFormData {
  return {
    name: '',
    description: '',
    unitEvaluasi: '',
  }
}

export function getDashboardModulEditDefaultForm(
  modulId?: string | null
): DashboardModulFormData {
  const detailBundle = getDashboardModulDummyDetail(modulId)
  return {
    name: detailBundle.detail.name,
    description: detailBundle.detail.description,
    unitEvaluasi: 'Program Studi',
  }
}

export function getDashboardModulInfoCards(
  listRows: DashboardModulListItem[]
): DashboardModulInfoCard[] {
  const totalModule = listRows.length
  const totalActive = listRows.filter((row) => row.status === 'Aktif').length
  const firstModule = listRows[0]

  return [
    {
      id: 'total-modul',
      title: 'Total Seluruh Modul',
      value: totalModule,
      progressPercent: 78,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'modul-aktif',
      title: 'Modul Sedang Aktif',
      value: totalActive,
      progressPercent: 55,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'total-modul-label',
      title: 'Total Seluruh Modul',
      value: firstModule?.name ?? 'Monev Awal Pembelajaran',
      progressPercent: 84,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'modul-terakhir',
      title: 'Modul Terakhir Dibuka',
      value: firstModule?.name ?? 'Monev Awal Pembelajaran',
      progressPercent: 72,
      actionLabel: 'Klik untuk melihat detail',
    },
  ]
}

export function sortDashboardModulRows(
  rows: DashboardModulListItem[],
  order: DashboardModulSortOrder
): DashboardModulListItem[] {
  const cloned = [...rows]
  cloned.sort((a, b) => {
    const compared = a.name.localeCompare(b.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}

export interface DashboardModulAspekIndicatorOption {
  id: string
  label: string
}

export interface DashboardModulAspekIndicatorItem {
  id: string
  name: string
  description: string
  objekEvaluasi: string
}

export interface DashboardModulAspekDetail {
  id: string
  name: string
  description: string
  modulName: string
  objekEvaluasi: string
  lingkupEvaluasi: string
  greatSystemStatus: string
  lastSavedAt: string
}

export interface DashboardModulAspekFormData {
  name: string
  description: string
  objekEvaluasi: string
  dokumentasiBuktiLink: string
  indikatorId: string
  deskripsiSingkatBukti: string
}

export interface DashboardModulAspekBundle {
  detail: DashboardModulAspekDetail
  indikatorRows: DashboardModulAspekIndicatorItem[]
  indikatorOptions: DashboardModulAspekIndicatorOption[]
  objekEvaluasiOptions: string[]
  createDefaults: DashboardModulAspekFormData
  editDefaults: DashboardModulAspekFormData
}

const aspekIndicatorOptions: DashboardModulAspekIndicatorOption[] = [
  { id: 'status-validasi-rps', label: 'Status Validasi RPS' },
  { id: 'status-integrasi-aik', label: 'Status Integrasi AIK' },
]

const baseAspekBundle: DashboardModulAspekBundle = {
  detail: {
    id: 'kesiapan-rps',
    name: 'Kesiapan RPS',
    description: 'Evaluasi Kelengkapan dan Kesesuaian RPS',
    modulName: 'Monev Awal Semester',
    objekEvaluasi: 'Pemrograman Web',
    lingkupEvaluasi: 'Program Studi',
    greatSystemStatus: 'Ya (Program Studi)',
    lastSavedAt: '15 Feb 2026, 14:30',
  },
  indikatorRows: [
    {
      id: 'rps-tersedia',
      name: 'RPS Tersedia',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Terhubung GS',
    },
    {
      id: 'status-validasi-rps-kaprodi',
      name: 'Status Validasi RPS oleh Kaprodi',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Terhubung GS',
    },
    {
      id: 'indikator-loremipsun-1',
      name: 'Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Terhubung GS',
    },
    {
      id: 'indikator-loremipsun-2',
      name: 'Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Terhubung GS',
    },
    {
      id: 'indikator-loremipsun-3',
      name: 'Loremipsun',
      description: 'Deskripsi Singkat',
      objekEvaluasi: 'Terhubung GS',
    },
  ],
  indikatorOptions: aspekIndicatorOptions,
  objekEvaluasiOptions: ['Mata Kuliah', 'Praktikum', 'Seminar', 'Laboratorium'],
  createDefaults: {
    name: '',
    description: '',
    objekEvaluasi: '',
    dokumentasiBuktiLink: '',
    indikatorId: 'status-validasi-rps',
    deskripsiSingkatBukti: '',
  },
  editDefaults: {
    name: 'Kesiapan RPS',
    description: '',
    objekEvaluasi: 'Mata Kuliah',
    dokumentasiBuktiLink: '',
    indikatorId: 'status-validasi-rps',
    deskripsiSingkatBukti: '',
  },
}

function cloneAspekBundle(bundle: DashboardModulAspekBundle): DashboardModulAspekBundle {
  return {
    detail: { ...bundle.detail },
    indikatorRows: bundle.indikatorRows.map((item) => ({ ...item })),
    indikatorOptions: bundle.indikatorOptions.map((item) => ({ ...item })),
    objekEvaluasiOptions: [...bundle.objekEvaluasiOptions],
    createDefaults: { ...bundle.createDefaults },
    editDefaults: { ...bundle.editDefaults },
  }
}

export function getDashboardModulAspekDummyDetail(
  modulId?: string | null,
  aspekId?: string | null
): DashboardModulAspekBundle {
  const modulBundle = getDashboardModulDummyDetail(modulId)
  const resolvedAspek = modulBundle.aspek.find((item) => item.id === aspekId) ?? modulBundle.aspek[0]
  const fallbackName = resolvedAspek?.name ?? baseAspekBundle.detail.name

  return cloneAspekBundle({
    ...baseAspekBundle,
    detail: {
      ...baseAspekBundle.detail,
      id: resolvedAspek?.id ?? baseAspekBundle.detail.id,
      name: fallbackName,
      modulName: modulBundle.detail.name,
    },
    editDefaults: {
      ...baseAspekBundle.editDefaults,
      name: fallbackName,
    },
  })
}

export function getDashboardModulAspekCreateDefaultForm(
  modulId?: string | null,
  aspekId?: string | null
): DashboardModulAspekFormData {
  const bundle = getDashboardModulAspekDummyDetail(modulId, aspekId)
  return { ...bundle.createDefaults }
}

export function getDashboardModulAspekEditDefaultForm(
  modulId?: string | null,
  aspekId?: string | null
): DashboardModulAspekFormData {
  const bundle = getDashboardModulAspekDummyDetail(modulId, aspekId)
  return { ...bundle.editDefaults }
}

export function sortDashboardModulAspekIndicatorRows(
  rows: DashboardModulAspekIndicatorItem[],
  order: DashboardModulSortOrder
): DashboardModulAspekIndicatorItem[] {
  const cloned = [...rows]
  cloned.sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}
