import type {
  Fm4DashboardContext,
  Fm4PendingStatus,
  Fm4RpnLevel,
} from './fm4GkmfDummy'

export type Fm4KaprodiSortValue = 'az' | 'za'
export type Fm4KaprodiPendingFilterValue = 'all' | Fm4PendingStatus
export type Fm4KaprodiProgressFilterValue = 'all' | Fm4RpnLevel

export interface Fm4KaprodiHeroData {
  title: string
  description: string
  statusLabel: string
  statusValue: string
  statusDate: string
  currentStageLabel: string
  currentStageValue: string
  deadlineLabel: string
  deadlineValue: string
  noteLabel: string
  noteValue: string
}

export interface Fm4KaprodiIndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm4KaprodiActionCard {
  id: string
  objectLabel: string
  title: string
  description: string
  modeLabel: string
  ctaLabel: string
  ctaHint: string
  target: 'pending' | 'progres'
}

export interface Fm4KaprodiRingkasanData {
  sectionLabel: string
  title: string
  paragraphs: string[]
  analysisLabel: string
  actionCards: Fm4KaprodiActionCard[]
}

export interface Fm4KaprodiScopeCardData {
  label: string
  scopeName: string
  scopeBadge: string
  scopeDescription: string
  unitLabel: string
  unitName: string
  unitDescription: string
}

export interface Fm4KaprodiRelatedUser {
  id: string
  initials: string
  roleTag: string
  name: string
  email: string
}

export interface Fm4KaprodiRtlRow {
  id: string
  title: string
  impact: string
  frequency: string
  detection: string
  rpnLevel: Fm4RpnLevel
}

export interface Fm4KaprodiPendingRow {
  id: string
  title: string
  aspect: string
  createdAt: string
  status: Fm4PendingStatus
}

export interface Fm4KaprodiProgressRow {
  id: string
  title: string
  rtl: string
  aspect: string
  createdAt: string
  rpnLevel: Fm4RpnLevel
}

export interface Fm4KaprodiDashboardDummyData {
  context: Fm4DashboardContext
  hero: Fm4KaprodiHeroData
  indicators: Fm4KaprodiIndicatorCard[]
  ringkasan: Fm4KaprodiRingkasanData
  scopeCard: Fm4KaprodiScopeCardData
  relatedUsers: Fm4KaprodiRelatedUser[]
  rtlRows: Fm4KaprodiRtlRow[]
}

export interface Fm4KaprodiPendingDummyData {
  context: Fm4DashboardContext
  title: string
  description: string
  summaryLabel: string
  summaryCount: number
  rows: Fm4KaprodiPendingRow[]
}

export interface Fm4KaprodiProgressDummyData {
  context: Fm4DashboardContext
  title: string
  description: string
  summaryLabel: string
  summaryCount: number
  rows: Fm4KaprodiProgressRow[]
}

export interface Fm4OtherRoleDashboardDummyData {
  context: Fm4DashboardContext
  headerTitle: string
  headerDescription: string
  indicators: Fm4KaprodiIndicatorCard[]
  rtlRows: Fm4KaprodiRtlRow[]
}

export const FM4_KAPRODI_SORT_OPTIONS: Array<{ value: Fm4KaprodiSortValue; label: string }> = [
  { value: 'az', label: 'A - Z' },
  { value: 'za', label: 'Z - A' },
]

export const FM4_KAPRODI_PENDING_FILTER_OPTIONS: Array<{
  value: Fm4KaprodiPendingFilterValue
  label: string
}> = [
  { value: 'all', label: 'Status' },
  { value: 'waiting', label: 'Menunggu' },
  { value: 'in_progress', label: 'Proses' },
  { value: 'validated', label: 'Selesai' },
]

export const FM4_KAPRODI_PROGRESS_FILTER_OPTIONS: Array<{
  value: Fm4KaprodiProgressFilterValue
  label: string
}> = [
  { value: 'all', label: 'Status' },
  { value: 'high', label: 'Tinggi' },
  { value: 'medium', label: 'Sedang' },
  { value: 'low', label: 'Rendah' },
]

export function matchesFm4KaprodiPendingFilter(
  rowStatus: Fm4PendingStatus,
  filter: Fm4KaprodiPendingFilterValue
): boolean {
  if (filter === 'all') return true
  return rowStatus === filter
}

export function matchesFm4KaprodiProgressFilter(
  rowStatus: Fm4RpnLevel,
  filter: Fm4KaprodiProgressFilterValue
): boolean {
  if (filter === 'all') return true
  return rowStatus === filter
}

const heroTemplate: Fm4KaprodiHeroData = {
  title: 'Form 04 Rencana Tindak Lanjut',
  description: 'Loremipsun',
  statusLabel: 'Status',
  statusValue: 'Aktif',
  statusDate: '01 Maret 2026',
  currentStageLabel: 'Tahap Saat Ini',
  currentStageValue: 'Analisis FMEA',
  deadlineLabel: 'Deadline',
  deadlineValue: '30 Maret 2026',
  noteLabel: 'Keterangan',
  noteValue: 'Tepat Waktu / Terlambat',
}

const indicatorTemplate: Fm4KaprodiIndicatorCard[] = [
  {
    id: 'total-rtl',
    title: 'Total RTL',
    value: 5,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
  {
    id: 'rtl-high',
    title: 'Total RTL Tinggi',
    value: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
  {
    id: 'temuan-belum-analisis',
    title: 'Total Temuan Belum di Analisis',
    value: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
  {
    id: 'rtl-belum-selesai',
    title: 'Total RTL Belum Selesai',
    value: 1,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
]

const ringkasanTemplate: Fm4KaprodiRingkasanData = {
  sectionLabel: 'Form 04 - RTL',
  title: 'Ringkasan',
  paragraphs: [
    'Halaman ini digunakan untuk mencatat, mengelola, dan memantau temuan hasil evaluasi yang diperoleh selama proses monitoring berlangsung. Setiap temuan dapat didokumentasikan secara rinci berdasarkan aspek penilaian yang relevan, sehingga memudahkan dalam proses analisis dan tindak lanjut. Pengguna dapat melakukan input data temuan, melengkapi deskripsi, serta mengelompokkan temuan sesuai dengan kategori yang telah ditentukan.',
  ],
  analysisLabel: 'Lakukan Analisis',
  actionCards: [
    {
      id: 'buat-rtl',
      objectLabel: 'Objek Analisis',
      title: 'Buat RTL Dari Analisis FMEA',
      description: 'Segera Buat RTL dari Analisis FMEA',
      modeLabel: 'Manual',
      ctaLabel: 'Mulai Buat RTL',
      ctaHint: 'KLIK UNTUK PINDAH KE FORM BUAT RTL',
      target: 'pending',
    },
    {
      id: 'lihat-progres',
      objectLabel: 'Objek Analisis',
      title: 'Ingin Melihat Progres RTL',
      description: 'Ubah Progres RTL Sebelum Deadline',
      modeLabel: 'Manual',
      ctaLabel: 'Mulai Ubah Progres RTL',
      ctaHint: 'KLIK UNTUK PINDAH KE FORM UBAH PROGRES RTL SEBELUM DEADLINE',
      target: 'progres',
    },
  ],
}

const scopeCardTemplate: Fm4KaprodiScopeCardData = {
  label: 'Lingkup Evaluasi',
  scopeName: 'Program Studi',
  scopeBadge: 'GS',
  scopeDescription: 'Mencakup aspek akademik, tata kelola sumber daya, dan capaian kinerja tahunan.',
  unitLabel: 'Unit Lingkup Evaluasi',
  unitName: 'Teknik Informatika',
  unitDescription: 'Fokus pada pengembangan perangkat lunak, AI, dan tata kelola sistem informasi.',
}

const relatedUsersTemplate: Fm4KaprodiRelatedUser[] = [
  {
    id: 'harry-gunawan',
    initials: 'HG',
    roleTag: 'KAPRODI',
    name: 'Harry Gunawan, M.Kom',
    email: 'harrygunawan@umc.ac.id',
  },
  {
    id: 'pahla-widhiani',
    initials: 'PW',
    roleTag: 'GKMF',
    name: 'Pahla Widhiani, M.Kom',
    email: 'Pahlawidiani@umc.ac.id',
  },
]

const rtlRowsTemplate: Fm4KaprodiRtlRow[] = [
  {
    id: 'rtl-001',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
  },
  {
    id: 'rtl-002',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
  },
  {
    id: 'rtl-003',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Sedang',
    frequency: 'Loremipsun',
    detection: 'Loremipsun',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-004',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Sedang',
    frequency: 'Loremipsun',
    detection: 'Loremipsun',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-005',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Besar',
    frequency: 'Sering Terjadi',
    detection: 'Loremipsun',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-006',
    title: 'Kelengkapan dokumentasi evaluasi',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
  },
  {
    id: 'rtl-007',
    title: 'Pemutakhiran instrumen mutu',
    impact: 'Dampak Sedang',
    frequency: 'Kadang Terjadi',
    detection: 'Cukup Terdeteksi',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-008',
    title: 'Integrasi data akademik',
    impact: 'Dampak Besar',
    frequency: 'Sering Terjadi',
    detection: 'Sulit Terdeteksi',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-009',
    title: 'Sinkronisasi penjadwalan internal',
    impact: 'Dampak Sedang',
    frequency: 'Kadang Terjadi',
    detection: 'Cukup Terdeteksi',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-010',
    title: 'Monitoring tindak lanjut rapat',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
  },
]

const pendingRowsTemplate: Fm4KaprodiPendingRow[] = [
  {
    id: 'temuan-rtl-001',
    title: 'Kesesuaian RPS dengan Kurikulum',
    aspect: 'Akademik',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-002',
    title: 'Kelengkapan Dokumen Dosen',
    aspect: 'SDM',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-003',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-004',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-005',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-006',
    title: 'Konsistensi evaluasi pembelajaran',
    aspect: 'Akademik',
    createdAt: '2025-08-04',
    status: 'in_progress',
  },
  {
    id: 'temuan-rtl-007',
    title: 'Koordinasi jadwal remedial',
    aspect: 'Akademik',
    createdAt: '2025-08-05',
    status: 'validated',
  },
  {
    id: 'temuan-rtl-008',
    title: 'Tata kelola arsip dokumen',
    aspect: 'Tata Kelola',
    createdAt: '2025-08-07',
    status: 'waiting',
  },
  {
    id: 'temuan-rtl-009',
    title: 'Sinkronisasi laporan berkala',
    aspect: 'Pelaporan',
    createdAt: '2025-08-08',
    status: 'in_progress',
  },
  {
    id: 'temuan-rtl-010',
    title: 'Monitoring tindak lanjut pertemuan',
    aspect: 'Manajemen',
    createdAt: '2025-08-09',
    status: 'waiting',
  },
]

const progressRowsTemplate: Fm4KaprodiProgressRow[] = [
  {
    id: 'rtl-progres-001',
    title: 'Kesusaian RPS dengan Kurikulum',
    rtl: '*Isi RTL',
    aspect: 'Kesiapan RPS',
    createdAt: '2025-08-01',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-progres-002',
    title: 'Kelengkapan Dokumen Dosen',
    rtl: '*Isi RTL',
    aspect: 'LoremIpsum',
    createdAt: '2025-08-01',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-progres-003',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    rtl: '*Isi RTL',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-progres-004',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    rtl: '*Isi RTL',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-progres-005',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    rtl: '*Isi RTL',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    rpnLevel: 'low',
  },
  {
    id: 'rtl-progres-006',
    title: 'Pelaporan tindak lanjut evaluasi',
    rtl: '*Isi RTL',
    aspect: 'Pelaporan',
    createdAt: '2025-08-04',
    rpnLevel: 'medium',
  },
  {
    id: 'rtl-progres-007',
    title: 'Sinkronisasi evaluasi pembelajaran',
    rtl: '*Isi RTL',
    aspect: 'Akademik',
    createdAt: '2025-08-05',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-progres-008',
    title: 'Pemutakhiran bukti dukung',
    rtl: '*Isi RTL',
    aspect: 'Dokumen',
    createdAt: '2025-08-07',
    rpnLevel: 'low',
  },
  {
    id: 'rtl-progres-009',
    title: 'Rencana mitigasi keterlambatan',
    rtl: '*Isi RTL',
    aspect: 'Risiko',
    createdAt: '2025-08-08',
    rpnLevel: 'high',
  },
  {
    id: 'rtl-progres-010',
    title: 'Monitoring konsistensi pertemuan',
    rtl: '*Isi RTL',
    aspect: 'Akademik',
    createdAt: '2025-08-09',
    rpnLevel: 'medium',
  },
]

function resolveContext(context: Partial<Fm4DashboardContext>): Fm4DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

export function getFm4KaprodiDashboardDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4KaprodiDashboardDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    hero: { ...heroTemplate },
    indicators: indicatorTemplate.map((item) => ({ ...item })),
    ringkasan: {
      ...ringkasanTemplate,
      paragraphs: [...ringkasanTemplate.paragraphs],
      actionCards: ringkasanTemplate.actionCards.map((item) => ({ ...item })),
    },
    scopeCard: { ...scopeCardTemplate },
    relatedUsers: relatedUsersTemplate.map((item) => ({ ...item })),
    rtlRows: rtlRowsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm4KaprodiPendingDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4KaprodiPendingDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    title: 'Hasil Analisis Belum Memiliki RTL',
    description: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    summaryLabel: 'Menunggu RTL',
    summaryCount: 12,
    rows: pendingRowsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm4KaprodiProgressDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4KaprodiProgressDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    title: 'Hasil Analisis RTL Belum Terlaksana',
    description: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    summaryLabel: 'Temuan',
    summaryCount: 10,
    rows: progressRowsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm4OtherRoleDashboardDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4OtherRoleDashboardDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    headerTitle: 'Hasil Analisis RTL FMEA',
    headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    indicators: indicatorTemplate.map((item) => ({ ...item })),
    rtlRows: rtlRowsTemplate.map((item) => ({ ...item })),
  }
}
