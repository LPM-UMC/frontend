export type DashboardLingkupStatus = 'Aktif' | 'Non Aktif'
export type DashboardLingkupSortOrder = 'a-z' | 'z-a'

export interface DashboardLingkupInfoCard {
  id: string
  title: string
  value: string | number
  progressPercent: number
  actionLabel: string
}

export interface DashboardLingkupListItem {
  id: string
  name: string
  description: string
  status: DashboardLingkupStatus
  integrasiLabel: string
  createdAt: string
}

export interface DashboardLingkupDetailInfo {
  id: string
  name: string
  description: string
  penanggungJawab: string
  evaluator: string
  totalUnit: number
  integrasiSistem: string
  createdAt: string
  updatedAt: string
  lastSavedAt: string
}

export interface DashboardLingkupScopeRow {
  id: string
  name: string
  description: string
  penanggungJawab: string
  evaluator: string
}

export interface DashboardLingkupObjekRow {
  id: string
  name: string
  description: string
  integrasiSistem: string
}

export interface DashboardLingkupFormData {
  name: string
  description: string
  rolePenanggungJawab: string
  roleEvaluator: string
}

export interface DashboardLingkupDetailBundle {
  info: DashboardLingkupDetailInfo
  scopeRows: DashboardLingkupScopeRow[]
  objekRows: DashboardLingkupObjekRow[]
  rolePenanggungJawabOptions: string[]
  roleEvaluatorOptions: string[]
}

const dashboardLingkupListItems: DashboardLingkupListItem[] = [
  {
    id: 'program-studi',
    name: 'Program Studi',
    description: 'Lingkup evaluasi tingkat program studi.',
    status: 'Aktif',
    integrasiLabel: 'Terintegrasi Great Sistem',
    createdAt: '2025-08-01',
  },
  {
    id: 'fakultas',
    name: 'Fakultas',
    description: 'Lingkup evaluasi tingkat fakultas.',
    status: 'Aktif',
    integrasiLabel: 'Terintegrasi Great Sistem',
    createdAt: '2025-08-01',
  },
  {
    id: 'unit-kegiatan-mahasiswa',
    name: 'Unit Kegiatan Mahasiswa',
    description: 'Lingkup evaluasi aktivitas kemahasiswaan.',
    status: 'Aktif',
    integrasiLabel: 'Tidak Terintegrasi GS',
    createdAt: '2025-08-01',
  },
  {
    id: 'lingkup-loremipsun-1',
    name: 'Loremipsun',
    description: 'Deskripsi singkat lingkup evaluasi.',
    status: 'Non Aktif',
    integrasiLabel: 'Tidak Terintegrasi GS',
    createdAt: '2025-08-01',
  },
  {
    id: 'lingkup-loremipsun-2',
    name: 'Lorem Ipsun',
    description: 'Deskripsi singkat lingkup evaluasi.',
    status: 'Non Aktif',
    integrasiLabel: 'Tidak Terintegrasi GS',
    createdAt: '2025-08-01',
  },
  {
    id: 'lingkup-loremipsun-3',
    name: 'Lingkup Akademik',
    description: 'Lingkup evaluasi kualitas akademik.',
    status: 'Aktif',
    integrasiLabel: 'Terintegrasi Great Sistem',
    createdAt: '2025-07-29',
  },
  {
    id: 'lingkup-loremipsun-4',
    name: 'Lingkup Non Akademik',
    description: 'Lingkup evaluasi tata kelola non akademik.',
    status: 'Aktif',
    integrasiLabel: 'Tidak Terintegrasi GS',
    createdAt: '2025-07-27',
  },
  {
    id: 'lingkup-loremipsun-5',
    name: 'Lembaga',
    description: 'Lingkup evaluasi tingkat lembaga.',
    status: 'Aktif',
    integrasiLabel: 'Terintegrasi Great Sistem',
    createdAt: '2025-07-22',
  },
  {
    id: 'lingkup-loremipsun-6',
    name: 'Unit Kerja',
    description: 'Lingkup evaluasi unit kerja internal.',
    status: 'Non Aktif',
    integrasiLabel: 'Tidak Terintegrasi GS',
    createdAt: '2025-07-15',
  },
  {
    id: 'lingkup-loremipsun-7',
    name: 'Pusat Studi',
    description: 'Lingkup evaluasi unit pusat studi.',
    status: 'Aktif',
    integrasiLabel: 'Terintegrasi Great Sistem',
    createdAt: '2025-07-10',
  },
]

const rolePenanggungJawabOptions = [
  'Kepala Program Studi',
  'Dekan',
  'Ketua Lembaga',
  'Koordinator Unit',
]

const roleEvaluatorOptions = [
  'Pemrograman Web',
  'Teknik Informatika',
  'Pahla Widianti',
  'Tim LPM',
]

const baseDetailBundle: DashboardLingkupDetailBundle = {
  info: {
    id: 'program-studi',
    name: 'Program Studi',
    description: 'Deskripsi Program Studi',
    penanggungJawab: 'Kepala Program Studi',
    evaluator: 'Pemrograman Web',
    totalUnit: 20,
    integrasiSistem: 'Terhubung Ke Great System',
    createdAt: '01-01-2026',
    updatedAt: '01-05-2026',
    lastSavedAt: '15 Feb 2026, 14:30',
  },
  scopeRows: [
    {
      id: 'scope-1',
      name: 'Teknik Informatika',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Bpk. Harry Gunawan (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-2',
      name: 'Teknik Lorem Ipsum',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-3',
      name: 'Teknik Lorem Ipsum',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-4',
      name: 'Teknik Lorem Ipsum',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-5',
      name: 'Teknik Lorem Ipsum',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-6',
      name: 'Sistem Informasi',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-7',
      name: 'Ilmu Komunikasi',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-8',
      name: 'Teknik Industri',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-9',
      name: 'Agribisnis',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
    {
      id: 'scope-10',
      name: 'Bahasa Inggris',
      description: 'Deskripsi Singkat',
      penanggungJawab: 'Lorem Ipsun (Gmail Umc)',
      evaluator: 'Ibu. Pahla Widianti (Gmail Umc)',
    },
  ],
  objekRows: [
    {
      id: 'objek-1',
      name: 'Mata Kuliah',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Terintegrasi GS',
    },
    {
      id: 'objek-2',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-3',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-4',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-5',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-6',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-7',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-8',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-9',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
    {
      id: 'objek-10',
      name: 'Objek Evaluasi Lorem Ipsum',
      description: 'Deskripsi Singkat',
      integrasiSistem: 'Loremipsun',
    },
  ],
  rolePenanggungJawabOptions,
  roleEvaluatorOptions,
}

function cloneDetailBundle(bundle: DashboardLingkupDetailBundle): DashboardLingkupDetailBundle {
  return {
    info: { ...bundle.info },
    scopeRows: bundle.scopeRows.map((item) => ({ ...item })),
    objekRows: bundle.objekRows.map((item) => ({ ...item })),
    rolePenanggungJawabOptions: [...bundle.rolePenanggungJawabOptions],
    roleEvaluatorOptions: [...bundle.roleEvaluatorOptions],
  }
}

export function getDashboardLingkupDummyList(): DashboardLingkupListItem[] {
  return dashboardLingkupListItems.map((item) => ({ ...item }))
}

export function getDashboardLingkupDummyDetail(
  lingkupId?: string | null
): DashboardLingkupDetailBundle {
  const listRows = getDashboardLingkupDummyList()
  const fallback = listRows[0]

  if (!fallback) {
    return cloneDetailBundle(baseDetailBundle)
  }

  const matched = listRows.find((item) => item.id === lingkupId) ?? fallback

  return cloneDetailBundle({
    ...baseDetailBundle,
    info: {
      ...baseDetailBundle.info,
      id: matched.id,
      name: matched.name,
      description: matched.name === 'Program Studi'
        ? baseDetailBundle.info.description
        : `Deskripsi ${matched.name}`,
      integrasiSistem: matched.integrasiLabel === 'Terintegrasi Great Sistem'
        ? 'Terhubung Ke Great System'
        : 'Tidak Terhubung Ke Great System',
    },
  })
}

export function getDashboardLingkupCreateDefaultForm(): DashboardLingkupFormData {
  return {
    name: '',
    description: '',
    rolePenanggungJawab: '',
    roleEvaluator: '',
  }
}

export function getDashboardLingkupEditDefaultForm(
  lingkupId?: string | null
): DashboardLingkupFormData {
  const detail = getDashboardLingkupDummyDetail(lingkupId)
  return {
    name: detail.info.name,
    description: detail.info.description,
    rolePenanggungJawab: detail.info.penanggungJawab,
    roleEvaluator: detail.info.evaluator,
  }
}

export function getDashboardLingkupInfoCards(
  listRows: DashboardLingkupListItem[]
): DashboardLingkupInfoCard[] {
  const totalRows = listRows.length
  const activeCount = listRows.filter((item) => item.status === 'Aktif').length
  const integratedCount = listRows.filter(
    (item) => item.integrasiLabel === 'Terintegrasi Great Sistem'
  ).length
  const topUsed = listRows[0]?.name ?? 'Program Studi'

  return [
    {
      id: 'total-lingkup',
      title: 'Total Lingkup',
      value: totalRows,
      progressPercent: 15,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'total-lingkup-aktif',
      title: 'Total Lingkup Aktif',
      value: activeCount,
      progressPercent: 15,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'terintegrasi-gs',
      title: 'Terintegrasi GS',
      value: integratedCount,
      progressPercent: 15,
      actionLabel: 'Klik untuk melihat detail',
    },
    {
      id: 'lingkup-terbanyak',
      title: 'Lingkup paling banyak Digunakan',
      value: topUsed,
      progressPercent: 72,
      actionLabel: 'Klik untuk melihat detail',
    },
  ]
}

export function sortDashboardLingkupRows(
  rows: DashboardLingkupListItem[],
  order: DashboardLingkupSortOrder
): DashboardLingkupListItem[] {
  const cloned = [...rows]
  cloned.sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}

export function sortDashboardLingkupScopeRows(
  rows: DashboardLingkupScopeRow[],
  order: DashboardLingkupSortOrder
): DashboardLingkupScopeRow[] {
  const cloned = [...rows]
  cloned.sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}

export function sortDashboardLingkupObjekRows(
  rows: DashboardLingkupObjekRow[],
  order: DashboardLingkupSortOrder
): DashboardLingkupObjekRow[] {
  const cloned = [...rows]
  cloned.sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}

export interface DashboardLingkupObjekDetailInfo {
  id: string
  name: string
  description: string
  lingkupName: string
  unitName: string
  totalObjek: number
  integrasiSistem: string
  semester: string
  createdAt: string
  updatedAt: string
  lastSavedAt: string
}

export interface DashboardLingkupObjekTableRow {
  id: string
  name: string
  dosen: string
  integrasiSistem: string
}

export type DashboardLingkupObjekColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'

export interface DashboardLingkupObjekColumnItem {
  id: string
  name: string
  type: DashboardLingkupObjekColumnType | ''
}

export interface DashboardLingkupObjekFormData {
  name: string
  description: string
  columns: DashboardLingkupObjekColumnItem[]
}

export interface DashboardLingkupObjekDetailBundle {
  info: DashboardLingkupObjekDetailInfo
  tableRows: DashboardLingkupObjekTableRow[]
  createDefaults: DashboardLingkupObjekFormData
  editDefaults: DashboardLingkupObjekFormData
  columnTypeOptions: Array<{ value: DashboardLingkupObjekColumnType; label: string }>
}

const columnTypeOptions: Array<{ value: DashboardLingkupObjekColumnType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
]

const baseLingkupObjekDetailBundle: DashboardLingkupObjekDetailBundle = {
  info: {
    id: 'mata-kuliah',
    name: 'Mata Kuliah',
    description: 'Deskripsi dari Objek Evaluasi',
    lingkupName: 'Program Studi',
    unitName: 'Teknik Informatika',
    totalObjek: 140,
    integrasiSistem: 'Terhubung Ke Great System',
    semester: '2026/2027',
    createdAt: '01-01-2026',
    updatedAt: '01-05-2026',
    lastSavedAt: '15 Feb 2026, 14:30',
  },
  tableRows: [
    {
      id: 'mk-1',
      name: 'PBO',
      dosen: 'Bpk Fredyy Wicak',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-2',
      name: 'Pemrograman Dasar',
      dosen: 'Bpk Rosidin',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-3',
      name: 'Basis Data',
      dosen: 'Bpk Sabar Santoso',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-4',
      name: 'Struktur Data dan Algoritma',
      dosen: 'Ibu Pahla Widianti',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-5',
      name: 'Jaringan Komputer',
      dosen: 'Bpk Khairul Anwar',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-6',
      name: 'Kecerdasan Buatan',
      dosen: 'Bpk Hendra Saputra',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-7',
      name: 'Sistem Operasi',
      dosen: 'Ibu Ratna Anggraini',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-8',
      name: 'Pemrograman Web',
      dosen: 'Bpk Arif Nugraha',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-9',
      name: 'Interaksi Manusia Komputer',
      dosen: 'Ibu Diah Lestari',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
    {
      id: 'mk-10',
      name: 'Pemrograman Mobile',
      dosen: 'Bpk Yoga Pratama',
      integrasiSistem: 'Terintegrasi Great Sistem',
    },
  ],
  createDefaults: {
    name: '',
    description: '',
    columns: [],
  },
  editDefaults: {
    name: 'Mata Kuliah',
    description: '',
    columns: [
      { id: 'col-1', name: '', type: '' },
      { id: 'col-2', name: '', type: '' },
      { id: 'col-3', name: '', type: '' },
    ],
  },
  columnTypeOptions,
}

function cloneObjekFormData(form: DashboardLingkupObjekFormData): DashboardLingkupObjekFormData {
  return {
    name: form.name,
    description: form.description,
    columns: form.columns.map((item) => ({ ...item })),
  }
}

function cloneLingkupObjekDetailBundle(
  bundle: DashboardLingkupObjekDetailBundle
): DashboardLingkupObjekDetailBundle {
  return {
    info: { ...bundle.info },
    tableRows: bundle.tableRows.map((item) => ({ ...item })),
    createDefaults: cloneObjekFormData(bundle.createDefaults),
    editDefaults: cloneObjekFormData(bundle.editDefaults),
    columnTypeOptions: bundle.columnTypeOptions.map((item) => ({ ...item })),
  }
}

export function getDashboardLingkupObjekDummyDetail(
  lingkupId?: string | null,
  objekId?: string | null
): DashboardLingkupObjekDetailBundle {
  const lingkupDetail = getDashboardLingkupDummyDetail(lingkupId)
  const pickedObjek = lingkupDetail.objekRows.find((row) => row.id === objekId) ?? lingkupDetail.objekRows[0]

  return cloneLingkupObjekDetailBundle({
    ...baseLingkupObjekDetailBundle,
    info: {
      ...baseLingkupObjekDetailBundle.info,
      id: pickedObjek?.id ?? baseLingkupObjekDetailBundle.info.id,
      name: pickedObjek?.name ?? baseLingkupObjekDetailBundle.info.name,
      lingkupName: lingkupDetail.info.name,
    },
    createDefaults: {
      ...baseLingkupObjekDetailBundle.createDefaults,
    },
    editDefaults: {
      ...baseLingkupObjekDetailBundle.editDefaults,
      name: pickedObjek?.name ?? baseLingkupObjekDetailBundle.editDefaults.name,
    },
  })
}

export function getDashboardLingkupObjekCreateDefaultForm(
  lingkupId?: string | null,
  objekId?: string | null
): DashboardLingkupObjekFormData {
  const detail = getDashboardLingkupObjekDummyDetail(lingkupId, objekId)
  return cloneObjekFormData(detail.createDefaults)
}

export function getDashboardLingkupObjekEditDefaultForm(
  lingkupId?: string | null,
  objekId?: string | null
): DashboardLingkupObjekFormData {
  const detail = getDashboardLingkupObjekDummyDetail(lingkupId, objekId)
  return cloneObjekFormData(detail.editDefaults)
}

export function sortDashboardLingkupObjekTableRows(
  rows: DashboardLingkupObjekTableRow[],
  order: DashboardLingkupSortOrder
): DashboardLingkupObjekTableRow[] {
  const cloned = [...rows]
  cloned.sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return order === 'a-z' ? compared : compared * -1
  })
  return cloned
}

export type DashboardLingkupIndikatorType = 'text' | 'boolean' | 'scale'

export interface DashboardLingkupIndikatorScaleItem {
  id: string
  label: string
}

export interface DashboardLingkupIndikatorFormData {
  name: string
  description: string
  question: string
  type: DashboardLingkupIndikatorType | ''
  scales: DashboardLingkupIndikatorScaleItem[]
}

export interface DashboardLingkupIndikatorDetailInfo {
  id: string
  name: string
  objekName: string
  lingkupName: string
  unitName: string
  lastSavedAt: string
}

export interface DashboardLingkupIndikatorDetailBundle {
  info: DashboardLingkupIndikatorDetailInfo
  typeOptions: Array<{ value: DashboardLingkupIndikatorType; label: string }>
  createDefaults: DashboardLingkupIndikatorFormData
  editDefaults: DashboardLingkupIndikatorFormData
}

const indikatorTypeOptions: Array<{ value: DashboardLingkupIndikatorType; label: string }> = [
  { value: 'text', label: 'Checklist' },
  { value: 'boolean', label: 'Ya / Tidak' },
  { value: 'scale', label: 'Skala Penilaian' },
]

const baseLingkupIndikatorBundle: DashboardLingkupIndikatorDetailBundle = {
  info: {
    id: 'status-validasi-rps',
    name: 'Status Validasi RPS',
    objekName: 'Mata Kuliah',
    lingkupName: 'Program Studi',
    unitName: 'Teknik Informatika',
    lastSavedAt: '15 Feb 2026, 14:30',
  },
  typeOptions: indikatorTypeOptions,
  createDefaults: {
    name: '',
    description: '',
    question: '',
    type: '',
    scales: [
      { id: 'scale-1', label: 'Kurang Baik' },
      { id: 'scale-2', label: 'Cukup Baik' },
      { id: 'scale-3', label: 'Baik' },
      { id: 'scale-4', label: 'Sangat Baik' },
    ],
  },
  editDefaults: {
    name: 'Status Validasi RPS',
    description: 'Validasi ketersediaan dokumen RPS pada awal semester.',
    question: 'Apakah RPS mata kuliah sudah divalidasi oleh Kaprodi?',
    type: 'boolean',
    scales: [],
  },
}

function cloneIndikatorFormData(
  form: DashboardLingkupIndikatorFormData
): DashboardLingkupIndikatorFormData {
  return {
    name: form.name,
    description: form.description,
    question: form.question,
    type: form.type,
    scales: form.scales.map((item) => ({ ...item })),
  }
}

function cloneLingkupIndikatorBundle(
  bundle: DashboardLingkupIndikatorDetailBundle
): DashboardLingkupIndikatorDetailBundle {
  return {
    info: { ...bundle.info },
    typeOptions: bundle.typeOptions.map((item) => ({ ...item })),
    createDefaults: cloneIndikatorFormData(bundle.createDefaults),
    editDefaults: cloneIndikatorFormData(bundle.editDefaults),
  }
}

export function getDashboardLingkupIndikatorDummyDetail(
  lingkupId?: string | null,
  objekId?: string | null,
  indikatorId?: string | null
): DashboardLingkupIndikatorDetailBundle {
  const objekDetail = getDashboardLingkupObjekDummyDetail(lingkupId, objekId)
  const fallbackIndikatorId = baseLingkupIndikatorBundle.info.id
  const resolvedIndikatorId = indikatorId ?? fallbackIndikatorId
  const resolvedIndicatorName = resolvedIndikatorId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  const isScaleIndicator = resolvedIndikatorId.includes('skala')

  return cloneLingkupIndikatorBundle({
    ...baseLingkupIndikatorBundle,
    info: {
      ...baseLingkupIndikatorBundle.info,
      id: resolvedIndikatorId,
      name: resolvedIndicatorName,
      objekName: objekDetail.info.name,
      lingkupName: objekDetail.info.lingkupName,
      unitName: objekDetail.info.unitName,
    },
    createDefaults: {
      ...baseLingkupIndikatorBundle.createDefaults,
      type: '',
    },
    editDefaults: {
      ...baseLingkupIndikatorBundle.editDefaults,
      name: resolvedIndicatorName,
      type: isScaleIndicator ? 'scale' : 'boolean',
      scales: isScaleIndicator
        ? baseLingkupIndikatorBundle.createDefaults.scales.map((item) => ({ ...item }))
        : [],
    },
  })
}

export function getDashboardLingkupIndikatorCreateDefaultForm(
  lingkupId?: string | null,
  objekId?: string | null,
  indikatorId?: string | null
): DashboardLingkupIndikatorFormData {
  const detail = getDashboardLingkupIndikatorDummyDetail(lingkupId, objekId, indikatorId)
  return cloneIndikatorFormData(detail.createDefaults)
}

export function getDashboardLingkupIndikatorEditDefaultForm(
  lingkupId?: string | null,
  objekId?: string | null,
  indikatorId?: string | null
): DashboardLingkupIndikatorFormData {
  const detail = getDashboardLingkupIndikatorDummyDetail(lingkupId, objekId, indikatorId)
  return cloneIndikatorFormData(detail.editDefaults)
}
