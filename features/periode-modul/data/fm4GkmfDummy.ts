export type Fm4DummyRole = 'gkmf' | 'kaprodi' | 'dekan' | 'lpm' | 'wr1'

export type Fm4RpnLevel = 'low' | 'medium' | 'high'

export type Fm4PendingStatus = 'waiting' | 'in_progress' | 'validated'

export type Fm4PendingStatusFilter = 'all' | Fm4PendingStatus

export type Fm4SortValue = 'az' | 'za'

// Ubah nilai ini secara manual untuk simulasi role sebelum integrasi backend aktif.
export const FM4_ACTIVE_DUMMY_ROLE: Fm4DummyRole = 'gkmf'

export interface Fm4DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm4HeroData {
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

export interface Fm4IndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm4RingkasanData {
  sectionLabel: string
  title: string
  paragraphs: string[]
  analysisTitle: string
  analysisDescription: string
  analysisModeLabel: string
  analysisCtaLabel: string
  analysisCtaHint: string
}

export interface Fm4ScopeCardData {
  label: string
  scopeName: string
  scopeBadge: string
  scopeDescription: string
  unitLabel: string
  unitName: string
  unitDescription: string
}

export interface Fm4RoleUserItem {
  id: string
  initials: string
  roleTag: string
  name: string
  email: string
}

export interface Fm4RtlRow {
  id: string
  title: string
  impact: string
  frequency: string
  detection: string
  rpnLevel: Fm4RpnLevel
  status: Fm4PendingStatus
}

export interface Fm4PendingFindingRow {
  id: string
  title: string
  aspect: string
  createdAt: string
  status: Fm4PendingStatus
}

export interface Fm4RpnLevelMeta {
  id: Fm4RpnLevel
  label: string
  badgeClass: string
}

export interface Fm4PendingStatusMeta {
  id: Fm4PendingStatus
  label: string
  badgeClass: string
}

export interface Fm4DashboardDummyData {
  context: Fm4DashboardContext
  hero: Fm4HeroData
  indicators: Fm4IndicatorCard[]
  ringkasan: Fm4RingkasanData
  scopeCard: Fm4ScopeCardData
  relatedUsers: Fm4RoleUserItem[]
  rtlRows: Fm4RtlRow[]
  waitingSummaryLabel: string
  waitingSummaryCount: number
}

export interface Fm4PendingTemuanDummyData {
  context: Fm4DashboardContext
  title: string
  description: string
  summaryLabel: string
  summaryCount: number
  rows: Fm4PendingFindingRow[]
}

export interface Fm4FmeaGuideItem {
  title: string
  description: string
}

export interface Fm4PendingDetailDummyData {
  context: Fm4DashboardContext
  id: string
  headerTitle: string
  headerDescription: string
  deadlineLabel: string
  deadlineValue: string
  formTitle: string
  findingLabel: string
  findingTitle: string
  additionalInputLabel: string
  analysisSectionTitle: string
  impactLabel: string
  impactHelp: string
  causeLabel: string
  causeHelp: string
  severityLabel: string
  occurrenceLabel: string
  detectionLabel: string
  scoreInfoLabel: string
  scoreValueLabel: string
  cancelLabel: string
  saveLabel: string
  defaultValues: {
    impact: string
    cause: string
    severity: number
    occurrence: number
    detection: number
  }
  fmeaGuideTitle: string
  guideItems: Fm4FmeaGuideItem[]
  riskLegendTitle: string
}

export const FM4_PENDING_STATUS_FILTER_OPTIONS: Array<{ value: Fm4PendingStatusFilter; label: string }> = [
  { value: 'all', label: 'Status' },
  { value: 'waiting', label: 'Menunggu' },
  { value: 'in_progress', label: 'Proses' },
  { value: 'validated', label: 'Tervalidasi' },
]

export const FM4_SORT_OPTIONS: Array<{ value: Fm4SortValue; label: string }> = [
  { value: 'az', label: 'A - Z' },
  { value: 'za', label: 'Z - A' },
]

const rpnLevelMetaMap: Record<Fm4RpnLevel, Fm4RpnLevelMeta> = {
  low: {
    id: 'low',
    label: 'Rendah',
    badgeClass: 'bg-[#9ddfb5] text-[#178943]',
  },
  medium: {
    id: 'medium',
    label: 'Sedang',
    badgeClass: 'bg-[#f0de79] text-[#ae7d09]',
  },
  high: {
    id: 'high',
    label: 'Tinggi',
    badgeClass: 'bg-[#f29a8a] text-[#9d4032]',
  },
}

const pendingStatusMetaMap: Record<Fm4PendingStatus, Fm4PendingStatusMeta> = {
  waiting: {
    id: 'waiting',
    label: 'Menunggu',
    badgeClass: 'bg-[#f0de79] text-[#ae7d09]',
  },
  in_progress: {
    id: 'in_progress',
    label: 'Proses',
    badgeClass: 'bg-[#dce9ff] text-[#2a66de]',
  },
  validated: {
    id: 'validated',
    label: 'Tervalidasi',
    badgeClass: 'bg-[#9ddfb5] text-[#178943]',
  },
}

const heroTemplate: Fm4HeroData = {
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

const indicatorCardsTemplate: Fm4IndicatorCard[] = [
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
    id: 'finding-unanalyzed',
    title: 'Total Temuan Belum di Analisis',
    value: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
  {
    id: 'rtl-unanalyzed',
    title: 'Total RTL Belum Dianalisis',
    value: 1,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
]

const ringkasanTemplate: Fm4RingkasanData = {
  sectionLabel: 'Form 04 - RTL',
  title: 'Ringkasan',
  paragraphs: [
    'Halaman ini digunakan untuk mencatat, mengelola, dan memantau temuan hasil evaluasi yang diperoleh selama proses monitoring berlangsung. Setiap temuan dapat didokumentasikan secara rinci berdasarkan aspek penilaian yang relevan, sehingga memudahkan dalam proses analisis dan tindak lanjut. Pengguna dapat melakukan input data temuan, melengkapi deskripsi, serta mengelompokkan temuan sesuai dengan kategori yang telah ditentukan.',
    'Halaman ini juga membantu dalam memantau progres penyelesaian temuan, baik yang masih dalam tahap draft, telah divalidasi, maupun yang ditolak. Dengan demikian, proses monitoring menjadi lebih transparan, akuntabel, dan mendukung peningkatan kualitas secara berkelanjutan.',
  ],
  analysisTitle: 'Temuan Belum Dianalisis ?',
  analysisDescription: 'Mulai proses analisis FMEA',
  analysisModeLabel: 'Manual',
  analysisCtaLabel: 'Mulai Analisis',
  analysisCtaHint: 'KLIK UNTUK PINDAH KE FORM ANALISIS FMEA',
}

const scopeCardTemplate: Fm4ScopeCardData = {
  label: 'Lingkup Evaluasi',
  scopeName: 'Program Studi',
  scopeBadge: 'GS',
  scopeDescription: 'Mencakup aspek akademik, tata kelola sumber daya, dan capaian kinerja tahunan.',
  unitLabel: 'Unit Lingkup Evaluasi',
  unitName: 'Teknik Informatika',
  unitDescription: 'Fokus pada pengembangan perangkat lunak, AI, dan tata kelola sistem informasi.',
}

const relatedUsersTemplate: Fm4RoleUserItem[] = [
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

const rtlRowsTemplate: Fm4RtlRow[] = [
  {
    id: 'rtl-001',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
    status: 'validated',
  },
  {
    id: 'rtl-002',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
    status: 'validated',
  },
  {
    id: 'rtl-003',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Sedang',
    frequency: 'Loremipsun',
    detection: 'Loremipsun',
    rpnLevel: 'medium',
    status: 'waiting',
  },
  {
    id: 'rtl-004',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Sedang',
    frequency: 'Loremipsun',
    detection: 'Loremipsun',
    rpnLevel: 'medium',
    status: 'in_progress',
  },
  {
    id: 'rtl-005',
    title: 'Lorem ipsum dolor sit amet',
    impact: 'Dampak Besar',
    frequency: 'Sering Terjadi',
    detection: 'Loremipsun',
    rpnLevel: 'high',
    status: 'in_progress',
  },
  {
    id: 'rtl-006',
    title: 'Audit dokumen pembelajaran',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
    status: 'validated',
  },
  {
    id: 'rtl-007',
    title: 'Evaluasi kelengkapan RPS',
    impact: 'Dampak Sedang',
    frequency: 'Kadang Terjadi',
    detection: 'Cukup Terdeteksi',
    rpnLevel: 'medium',
    status: 'waiting',
  },
  {
    id: 'rtl-008',
    title: 'Penyesuaian beban kerja dosen',
    impact: 'Dampak Besar',
    frequency: 'Sering Terjadi',
    detection: 'Sulit Terdeteksi',
    rpnLevel: 'high',
    status: 'waiting',
  },
  {
    id: 'rtl-009',
    title: 'Sinkronisasi data akademik',
    impact: 'Dampak Sedang',
    frequency: 'Kadang Terjadi',
    detection: 'Cukup Terdeteksi',
    rpnLevel: 'medium',
    status: 'validated',
  },
  {
    id: 'rtl-010',
    title: 'Validasi dokumen bukti',
    impact: 'Dampak Kecil',
    frequency: 'Jarang Terjadi',
    detection: 'Mudah Terdeteksi',
    rpnLevel: 'low',
    status: 'in_progress',
  },
]

const pendingRowsTemplate: Fm4PendingFindingRow[] = [
  {
    id: 'temuan-pending-001',
    title: 'Kurangnya Dokumentasi Proses Pembelajaran',
    aspect: 'Kesiapan RPS',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-002',
    title: 'Sistem Informasi Akademik Tidak Terintegrasi',
    aspect: 'Kesiapan RPS',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-003',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-004',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-005',
    title: 'Lorem ipsum dolor sit amet consectetur.',
    aspect: 'Loremipsun',
    createdAt: '2025-08-01',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-006',
    title: 'Evaluasi keterlambatan input nilai',
    aspect: 'Capaian Kinerja',
    createdAt: '2025-08-03',
    status: 'in_progress',
  },
  {
    id: 'temuan-pending-007',
    title: 'Ketidaksesuaian materi ajar dengan RPS',
    aspect: 'Kesiapan RPS',
    createdAt: '2025-08-05',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-008',
    title: 'Pemantauan perangkat asesmen belum rutin',
    aspect: 'Asesmen Pembelajaran',
    createdAt: '2025-08-06',
    status: 'waiting',
  },
  {
    id: 'temuan-pending-009',
    title: 'Bukti rapat evaluasi belum lengkap',
    aspect: 'Tata Kelola',
    createdAt: '2025-08-07',
    status: 'validated',
  },
  {
    id: 'temuan-pending-010',
    title: 'Sinkronisasi data bukti belum optimal',
    aspect: 'Integrasi Data',
    createdAt: '2025-08-08',
    status: 'waiting',
  },
]

const pendingDetailTemplateById: Record<string, Fm4PendingDetailDummyData> = {
  'temuan-pending-001': {
    context: {
      periodeModulId: 'pm-2026-genap',
      unitId: 'unit-tif',
    },
    id: 'temuan-pending-001',
    headerTitle: 'Analisis FMEA & Penyusunan RTL',
    headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    deadlineLabel: 'Deadline',
    deadlineValue: '01 Maret 2026',
    formTitle: 'Form Template Analisis',
    findingLabel: 'Judul Temuan',
    findingTitle: 'Ketidaksesuaian Materi Ajar dengan RPS (Rencana Pembelajaran Semester)',
    additionalInputLabel: 'Inputan Lainnya',
    analysisSectionTitle: 'Analisis FMEA',
    impactLabel: 'Dampak',
    impactHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
    causeLabel: 'Penyebab',
    causeHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
    severityLabel: 'Severity',
    occurrenceLabel: 'Occurrence',
    detectionLabel: 'Detection',
    scoreInfoLabel: 'Kategori (RPN)',
    scoreValueLabel: 'Nilai (RPN)',
    cancelLabel: 'Batal',
    saveLabel: 'Simpan',
    defaultValues: {
      impact: 'Ditemukan bahwa 30% mata kuliah pada semester ganjil tidak menyampaikan materi pertemuan ke-5 hingga ke-7 sesuai dengan RPS yang telah disepakati. Hal ini menyebabkan capaian pembelajaran lulusan tidak tercapai secara maksimal.',
      cause: 'Lorem ipsum dolor sit amet consectetur. Quis consequat a quisque tempus tincidunt sed placerat curabitur. Mi rhoncus potenti malesuada velit nam hac dignissim. Cras facilisi nisi amet ac sit fermentum mi molestie. Integer elementum elit tempus.',
      severity: 5,
      occurrence: 5,
      detection: 5,
    },
    fmeaGuideTitle: 'Panduan FMEA',
    guideItems: [
      {
        title: 'Severity (S)',
        description: 'Tingkat dampak kegagalan',
      },
      {
        title: 'Occurrence (O)',
        description: 'Frekuensi kejadian',
      },
      {
        title: 'Detection (D)',
        description: 'Kemampuan mendeteksi',
      },
    ],
    riskLegendTitle: 'Klasifikasi Risiko:',
  },
}

const pendingDetailFallbackId = 'temuan-pending-001'

function resolveContext(context: Partial<Fm4DashboardContext>): Fm4DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

function resolvePendingDetailTemplate(temuanPendingId?: string): Fm4PendingDetailDummyData {
  if (temuanPendingId && pendingDetailTemplateById[temuanPendingId]) {
    return pendingDetailTemplateById[temuanPendingId]!
  }

  return pendingDetailTemplateById[pendingDetailFallbackId]!
}

export function resolveFm4RpnLevelMeta(level: Fm4RpnLevel): Fm4RpnLevelMeta {
  return rpnLevelMetaMap[level]
}

export function resolveFm4PendingStatusMeta(status: Fm4PendingStatus): Fm4PendingStatusMeta {
  return pendingStatusMetaMap[status]
}

export function matchesFm4PendingStatusFilter(
  rowStatus: Fm4PendingStatus,
  filter: Fm4PendingStatusFilter
): boolean {
  if (filter === 'all') return true
  return rowStatus === filter
}

export function resolveFm4RpnCategory(rpnValue: number): Fm4RpnLevel {
  if (rpnValue <= 100) return 'low'
  if (rpnValue <= 200) return 'medium'
  return 'high'
}

export function getFm4GkmfDashboardDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4DashboardDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    hero: { ...heroTemplate },
    indicators: indicatorCardsTemplate.map((item) => ({ ...item })),
    ringkasan: {
      ...ringkasanTemplate,
      paragraphs: [...ringkasanTemplate.paragraphs],
    },
    scopeCard: { ...scopeCardTemplate },
    relatedUsers: relatedUsersTemplate.map((item) => ({ ...item })),
    rtlRows: rtlRowsTemplate.map((item) => ({ ...item })),
    waitingSummaryLabel: 'Menunggu Validasi',
    waitingSummaryCount: 10,
  }
}

export function getFm4GkmfPendingTemuanDummyData(
  context: Partial<Fm4DashboardContext> = {}
): Fm4PendingTemuanDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    title: 'Temuan Belum Dianalisis',
    description: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    summaryLabel: 'Temuan',
    summaryCount: 10,
    rows: pendingRowsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm4GkmfPendingDetailDummyData(
  params: { context?: Partial<Fm4DashboardContext>; temuanPendingId?: string } = {}
): Fm4PendingDetailDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosen = resolvePendingDetailTemplate(params.temuanPendingId)

  return {
    ...chosen,
    context: resolvedContext,
    defaultValues: { ...chosen.defaultValues },
    guideItems: chosen.guideItems.map((item) => ({ ...item })),
  }
}
