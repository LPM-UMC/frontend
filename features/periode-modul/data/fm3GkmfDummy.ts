export type Fm3FindingStatus = 'validated' | 'draft' | 'rejected' | 'pending'

export type Fm3StatusFilterValue = 'all' | Fm3FindingStatus

export type Fm3SortValue = 'az' | 'za'

export type Fm3DummyRole = 'gkmf' | 'kaprodi' | 'dekan' | 'lpm' | 'wr1'

// Ubah nilai ini secara manual untuk simulasi role saat integrasi backend belum aktif.
export const FM3_ACTIVE_DUMMY_ROLE: Fm3DummyRole = 'gkmf'

export interface Fm3DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm3HeroData {
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

export interface Fm3IndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm3RoleUserItem {
  id: string
  initials: string
  roleTag: string
  name: string
  email: string
}

export interface Fm3FindingRow {
  id: string
  title: string
  aspect: string
  responsiblePerson: string
  createdAt: string
  status: Fm3FindingStatus
}

export interface Fm3RingkasanData {
  sectionLabel: string
  title: string
  paragraphs: string[]
  objectTitle: string
  objectDescription: string
  objectModeLabel: string
  ctaLabel: string
  ctaHint: string
}

export interface Fm3ScopeCardData {
  label: string
  scopeName: string
  scopeBadge: string
  scopeDescription: string
  unitLabel: string
  unitName: string
  unitDescription: string
}

export interface Fm3DashboardDummyData {
  context: Fm3DashboardContext
  hero: Fm3HeroData
  indicators: Fm3IndicatorCard[]
  ringkasan: Fm3RingkasanData
  scopeCard: Fm3ScopeCardData
  relatedUsers: Fm3RoleUserItem[]
  findings: Fm3FindingRow[]
}

export interface Fm3PendingValidationDummyData {
  context: Fm3DashboardContext
  title: string
  description: string
  waitingSummaryLabel: string
  waitingSummaryCount: number
  findings: Fm3FindingRow[]
}

export interface Fm3ValidationDecisionOption {
  id: 'approve' | 'reject'
  label: string
  description: string
}

export interface Fm3ValidationDetailData {
  context: Fm3DashboardContext
  id: string
  responsiblePerson: string
  title: string
  createdAt: string
  evaluator: string
  aspectName: string
  noteLabel: string
  noteText: string
  headerTitle: string
  headerDescription: string
  decisionOptions: Fm3ValidationDecisionOption[]
  defaultDecision: 'approve' | 'reject' | null
  defaultEvaluatorNote: string
}

export interface Fm3CreateFindingAspectOption {
  id: string
  label: string
}

export interface Fm3CreateFindingFormDefaultValues {
  title: string
  aspectId: string
  description: string
  driveLink: string
}

export interface Fm3CreateFindingDummyData {
  context: Fm3DashboardContext
  headerTitle: string
  headerDescription: string
  sectionTitle: string
  formTitle: string
  titleLabel: string
  titlePlaceholder: string
  aspectLabel: string
  aspectOptions: Fm3CreateFindingAspectOption[]
  descriptionLabel: string
  descriptionPlaceholder: string
  driveLinkLabel: string
  driveLinkPlaceholder: string
  driveLinkHelpLabel: string
  driveLinkHelpLinkText: string
  noteText: string
  lastSavedAt: string
  cancelLabel: string
  submitLabel: string
  defaultValues: Fm3CreateFindingFormDefaultValues
}

export interface Fm3FindingStatusMeta {
  id: Fm3FindingStatus
  label: string
  badgeClass: string
}

export const FM3_STATUS_FILTER_OPTIONS: Array<{ value: Fm3StatusFilterValue; label: string }> = [
  { value: 'all', label: 'Status' },
  { value: 'validated', label: 'Divalidasi' },
  { value: 'draft', label: 'Draft' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'pending', label: 'Menunggu' },
]

export const FM3_SORT_OPTIONS: Array<{ value: Fm3SortValue; label: string }> = [
  { value: 'az', label: 'A - Z' },
  { value: 'za', label: 'Z - A' },
]

const statusMetaMap: Record<Fm3FindingStatus, Fm3FindingStatusMeta> = {
  validated: {
    id: 'validated',
    label: 'Divalidasi',
    badgeClass: 'bg-[#9cedaf] text-[#148f42]',
  },
  draft: {
    id: 'draft',
    label: 'Draft',
    badgeClass: 'bg-[#f2df7b] text-[#a9770b]',
  },
  rejected: {
    id: 'rejected',
    label: 'Ditolak',
    badgeClass: 'bg-[#f3a28f] text-[#9d3e2e]',
  },
  pending: {
    id: 'pending',
    label: 'Menunggu',
    badgeClass: 'bg-[#f2df7b] text-[#a9770b]',
  },
}

const heroTemplate: Fm3HeroData = {
  title: 'Form 03 Temuan',
  description: 'Halaman ini digunakan untuk mengelola dan memvalidasi temuan hasil evaluasi.',
  statusLabel: 'Status',
  statusValue: 'Aktif',
  statusDate: '01 Maret 2026',
  currentStageLabel: 'Tahap Saat Ini',
  currentStageValue: 'Input dan Validasi Temuan',
  deadlineLabel: 'Deadline',
  deadlineValue: '30 Maret 2026',
  noteLabel: 'Keterangan',
  noteValue: 'Tepat Waktu / Terlambat',
}

const indicatorCardsTemplate: Fm3IndicatorCard[] = [
  {
    id: 'total-temuan',
    title: 'Total Daftar Temuan',
    value: 5,
    subtitle: 'Skor Aspek',
    progressPercent: 18,
  },
  {
    id: 'total-draft',
    title: 'Total Status Draft',
    value: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 16,
  },
  {
    id: 'total-divalidasi',
    title: 'Total Status Tervalidasi',
    value: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'total-ditolak',
    title: 'Total Status Ditolak',
    value: 1,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
]

const ringkasanTemplate: Fm3RingkasanData = {
  sectionLabel: 'Form 03 - Temuan',
  title: 'Ringkasan',
  paragraphs: [
    'Halaman ini digunakan untuk mencatat, mengelola, dan memantau temuan hasil evaluasi yang diperoleh selama proses monitoring berlangsung. Setiap temuan dapat didokumentasikan secara rinci berdasarkan aspek penilaian yang relevan, sehingga memudahkan dalam proses analisis dan tindak lanjut. Pengguna dapat melakukan input data temuan, melengkapi deskripsi, serta mengelompokkan temuan sesuai dengan kategori yang telah ditentukan.',
    'Halaman ini juga membantu dalam memantau progres penyelesaian temuan, baik yang masih dalam tahap draft, telah divalidasi, maupun yang ditolak. Dengan demikian, proses monitoring menjadi lebih transparan, akuntabel, dan mendukung peningkatan kualitas secara berkelanjutan.',
  ],
  objectTitle: 'Siap Untuk Mencatat Hasil ?',
  objectDescription: 'Mulai proses pengisian data temuan baru untuk evaluasi ini secara detail',
  objectModeLabel: 'Manual',
  ctaLabel: 'Input Temuan Baru',
  ctaHint: 'KLIK UNTUK PINDAH KE FORM INPUT TEMUAN BARU',
}

const scopeCardTemplate: Fm3ScopeCardData = {
  label: 'Lingkup Evaluasi',
  scopeName: 'Program Studi',
  scopeBadge: 'GS',
  scopeDescription: 'Mencakup aspek akademik, tata kelola sumber daya, dan capaian kinerja tahunan.',
  unitLabel: 'Unit Lingkup Evaluasi',
  unitName: 'Teknik Informatika',
  unitDescription: 'Fokus pada pengembangan perangkat lunak, AI, dan tata kelola sistem informasi.',
}

const relatedUsersTemplate: Fm3RoleUserItem[] = [
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
    email: 'pahlawidiani@umc.ac.id',
  },
]

const findingsTemplate: Fm3FindingRow[] = [
  {
    id: 'temuan-001',
    title: 'Kurangnya Dokumentasi Proses Pembelajaran',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'validated',
  },
  {
    id: 'temuan-002',
    title: 'Sistem Informasi Akademik Tidak Terintegrasi',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'validated',
  },
  {
    id: 'temuan-003',
    title: 'Rendahnya Capaian Kinerja Dosen',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'draft',
  },
  {
    id: 'temuan-004',
    title: 'Kurangnya Sarana Prasarana Pembelajaran',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'draft',
  },
  {
    id: 'temuan-005',
    title: 'Beberapa Dosen Belum Mengupload RPS Pembelajaran',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'rejected',
  },
  {
    id: 'temuan-006',
    title: 'Sinkronisasi Data Kehadiran Belum Konsisten',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-03',
    status: 'validated',
  },
  {
    id: 'temuan-007',
    title: 'Perangkat Evaluasi Belum Seragam',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-05',
    status: 'pending',
  },
  {
    id: 'temuan-008',
    title: 'Keterlambatan Input Nilai Tengah Semester',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-07',
    status: 'pending',
  },
  {
    id: 'temuan-009',
    title: 'Monitoring Beban SKS Per Dosen Belum Optimal',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-09',
    status: 'pending',
  },
  {
    id: 'temuan-010',
    title: 'Pelaporan Bukti Aspek AIK Masih Belum Lengkap',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-10',
    status: 'pending',
  },
]

const pendingFindingsTemplate: Fm3FindingRow[] = [
  {
    id: '86331c8c-2157-49e0-b67b-dcceebcd2b9c',
    title: 'Kurangnya Dokumentasi Proses Pembelajaran',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'pending',
  },
  {
    id: 'temuan-pending-002',
    title: 'Sistem Informasi Akademik Tidak Terintegrasi',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'pending',
  },
  {
    id: 'temuan-pending-003',
    title: 'Rendahnya Capaian Kinerja Dosen',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'pending',
  },
  {
    id: 'temuan-pending-004',
    title: 'Kurangnya Sarana Prasarana Pembelajaran',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'pending',
  },
  {
    id: 'temuan-pending-005',
    title: 'Beberapa Dosen Belum Mengupload RPS Pembelajaran',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-01',
    status: 'pending',
  },
  {
    id: 'temuan-pending-006',
    title: 'Sinkronisasi Data Kehadiran Belum Konsisten',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-02',
    status: 'pending',
  },
  {
    id: 'temuan-pending-007',
    title: 'Perangkat Evaluasi Belum Seragam',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-03',
    status: 'pending',
  },
  {
    id: 'temuan-pending-008',
    title: 'Keterlambatan Input Nilai Tengah Semester',
    aspect: 'Capaian Kinerja',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-04',
    status: 'pending',
  },
  {
    id: 'temuan-pending-009',
    title: 'Monitoring Beban SKS Per Dosen Belum Optimal',
    aspect: 'Tata Kelola Sumber Daya',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-05',
    status: 'pending',
  },
  {
    id: 'temuan-pending-010',
    title: 'Pelaporan Bukti Aspek AIK Masih Belum Lengkap',
    aspect: 'Akademik',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    createdAt: '2025-08-06',
    status: 'pending',
  },
]

const FM3_VALIDATION_FALLBACK_ID = '86331c8c-2157-49e0-b67b-dcceebcd2b9c'

const validationDetailTemplateById = {
  [FM3_VALIDATION_FALLBACK_ID]: {
    context: {
      periodeModulId: 'pm-2026-genap',
      unitId: 'unit-tif',
    },
    id: FM3_VALIDATION_FALLBACK_ID,
    responsiblePerson: 'Harry Gunawan, M.Kom',
    title: 'Kurangnya Dokumentasi Pada saat Proses Pembelajaran',
    createdAt: '2025-08-01',
    evaluator: 'Pahla Widhiani, M.Kom',
    aspectName: 'Akademik',
    noteLabel: 'Catatan Temuan',
    noteText:
      'Lorem ipsum dolor sit amet consectetur. Et in a id vulputate adipiscing enim. Diam aliquet non pharetra sed sociis neque in dui. Porttitor cras massa molestie sed dolor amet semper. Id eu turpis dis malesuada odio porttitor enim nunc sapien. Condimentum faucibus duis cursus cum nibh consectetur sed pulvinar. Varius malesuada sit diam pharetra pharetra nunc velit orci nunc. Morbi etiam aliquet sed accumsan accumsan ut. Augue tincidunt nunc ullamcorper dui. Nec hac vulputate egestas ultrices sit tortor. Morbi nec enim auctor egestas.',
    headerTitle: 'Detail Temuan',
    headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    decisionOptions: [
      {
        id: 'approve',
        label: 'Validasi',
        description: 'Temuan dianggap benar',
      },
      {
        id: 'reject',
        label: 'Tolak',
        description: 'Temuan tidak valid / Perlu Direvisi',
      },
    ],
    defaultDecision: null,
    defaultEvaluatorNote: '',
  },
} as const satisfies Record<string, Fm3ValidationDetailData>

function resolveValidationDetailTemplate(temuanId?: string): Fm3ValidationDetailData {
  if (temuanId) {
    const matched = validationDetailTemplateById[temuanId as keyof typeof validationDetailTemplateById]
    if (matched) return matched
  }

  return validationDetailTemplateById[FM3_VALIDATION_FALLBACK_ID]
}

const createFindingTemplate: Omit<Fm3CreateFindingDummyData, 'context'> = {
  headerTitle: 'Input Temuan',
  headerDescription:
    'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  sectionTitle: 'Buat Input Temuan Baru',
  formTitle: 'Form Input Temuan',
  titleLabel: 'Judul Temuan',
  titlePlaceholder: 'Contoh : Evaluasi Pembelajaran Semester Genap 2025/2026',
  aspectLabel: 'Aspek Temuan',
  aspectOptions: [
    { id: 'akademik', label: 'Akademik' },
    { id: 'tata-kelola', label: 'Tata Kelola Sumber Daya' },
    { id: 'capaian-kinerja', label: 'Capaian Kinerja' },
  ],
  descriptionLabel: 'Deskripsi Temuan',
  descriptionPlaceholder: 'Jelaskan Mengenai Survei Ini',
  driveLinkLabel: 'Link Dokumen Google Drive',
  driveLinkPlaceholder: 'https://drive.google.com/drive/folders/1UB-hyfGDCGupa1vSI8zi4YeB-qiUUTf',
  driveLinkHelpLabel: 'Lihat Format Bukti',
  driveLinkHelpLinkText: 'Disini',
  noteText: 'Lorem Ipsun',
  lastSavedAt: '15 Feb 2026, 14:30',
  cancelLabel: 'Batal',
  submitLabel: 'Simpan Temuan',
  defaultValues: {
    title: '',
    aspectId: 'akademik',
    description: '',
    driveLink: '',
  },
}

export function resolveFm3FindingStatusMeta(status: Fm3FindingStatus): Fm3FindingStatusMeta {
  return statusMetaMap[status]
}

export function matchesFm3StatusFilter(
  rowStatus: Fm3FindingStatus,
  filter: Fm3StatusFilterValue
): boolean {
  if (filter === 'all') return true
  return rowStatus === filter
}

function resolveContext(context: Partial<Fm3DashboardContext>): Fm3DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

export function getFm3GkmfDashboardDummyData(
  context: Partial<Fm3DashboardContext> = {}
): Fm3DashboardDummyData {
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
    findings: findingsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm3GkmfPendingValidationDummyData(
  context: Partial<Fm3DashboardContext> = {}
): Fm3PendingValidationDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    title: 'Temuan Belum Divalidasi',
    description: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    waitingSummaryLabel: 'Menunggu Validasi',
    waitingSummaryCount: 10,
    findings: pendingFindingsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm3GkmfValidationDetailDummyData(
  params: { context?: Partial<Fm3DashboardContext>; temuanId?: string } = {}
): Fm3ValidationDetailData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosen = resolveValidationDetailTemplate(params.temuanId)

  return {
    ...chosen,
    context: resolvedContext,
    decisionOptions: chosen.decisionOptions.map((option) => ({ ...option })),
  }
}

export function getFm3KaprodiCreateFindingDummyData(
  context: Partial<Fm3DashboardContext> = {}
): Fm3CreateFindingDummyData {
  const resolvedContext = resolveContext(context)

  return {
    ...createFindingTemplate,
    context: resolvedContext,
    aspectOptions: createFindingTemplate.aspectOptions.map((option) => ({ ...option })),
    defaultValues: { ...createFindingTemplate.defaultValues },
  }
}

// ─── Edit Finding (Kaprodi) ───────────────────────────────────────────────────

export interface Fm3EditFindingDummyData {
  context: Fm3DashboardContext
  headerTitle: string
  headerDescription: string
  sectionTitle: string
  formTitle: string
  titleLabel: string
  titlePlaceholder: string
  aspectLabel: string
  aspectOptions: Fm3CreateFindingAspectOption[]
  descriptionLabel: string
  descriptionPlaceholder: string
  driveLinkLabel: string
  driveLinkPlaceholder: string
  driveLinkHelpLabel: string
  driveLinkHelpLinkText: string
  noteText: string
  lastSavedAt: string
  cancelLabel: string
  submitLabel: string
  defaultValues: Fm3CreateFindingFormDefaultValues
}

const editFindingTemplate: Omit<Fm3EditFindingDummyData, 'context'> = {
  headerTitle: 'Edit Temuan Baru',
  headerDescription:
    'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  sectionTitle: 'Edit Temuan Baru',
  formTitle: 'Form Edit Temuan',
  titleLabel: 'Judul Temuan',
  titlePlaceholder: 'Contoh : Evaluasi Pembelajaran Semester Genap 2025/2026',
  aspectLabel: 'Aspek Temuan',
  aspectOptions: [
    { id: 'akademik', label: 'Akademik' },
    { id: 'tata-kelola', label: 'Tata Kelola Sumber Daya' },
    { id: 'capaian-kinerja', label: 'Capaian Kinerja' },
    { id: 'teknik-informatika', label: 'Teknik Informatika' },
  ],
  descriptionLabel: 'Deskripsi Temuan',
  descriptionPlaceholder: 'Jelaskan Mengenai Temuan Ini',
  driveLinkLabel: 'Link Dokumen Google Drive',
  driveLinkPlaceholder: 'https://drive.google.com/drive/folders/1UB-hyfGDCGupa1vSI8zi4YeB-qiUUTf',
  driveLinkHelpLabel: 'Lihat Format Bukti',
  driveLinkHelpLinkText: 'Disini',
  noteText: 'Lorem Ipsun',
  lastSavedAt: '15 Feb 2026, 14:30',
  cancelLabel: 'Batal',
  submitLabel: 'Edit',
  defaultValues: {
    title: 'Evaluasi Pembelajaran Semester Genap 2025/2026',
    aspectId: 'teknik-informatika',
    description: 'Kurangnya dokumentasi pada saat proses kegiatan belajar mengajar',
    driveLink: 'https://drive.google.com/drive/folders/1UB-hyfGDCGupa1vSI8zi4YeB-qiUUTf',
  },
}

export function getFm3KaprodiEditFindingDummyData(
  params: { context?: Partial<Fm3DashboardContext>; temuanId?: string } = {}
): Fm3EditFindingDummyData {
  const resolvedContext = resolveContext(params.context ?? {})

  return {
    ...editFindingTemplate,
    context: resolvedContext,
    aspectOptions: editFindingTemplate.aspectOptions.map((option) => ({ ...option })),
    defaultValues: { ...editFindingTemplate.defaultValues },
  }
}

// ─── Kaprodi Detail Temuan ────────────────────────────────────────────────────

export type Fm3ValidationResultStatus = 'validated' | 'rejected' | 'pending'

export interface Fm3ValidationResult {
  status: Fm3ValidationResultStatus
  statusLabel: string
  statusBadgeClass: string
  validatedBy: string
  validatedDate: string
  validatedTime: string
  validatorNote: string
}

export interface Fm3KaprodiDetailDummyData {
  context: Fm3DashboardContext
  headerTitle: string
  headerDescription: string
  // detail info
  id: string
  responsiblePerson: string
  title: string
  createdAt: string
  evaluator: string
  aspectName: string
  noteLabel: string
  noteText: string
  // validation result
  validationResultLabel: string
  validationResult: Fm3ValidationResult
}

const kaprodiDetailTemplateById: Record<string, Fm3KaprodiDetailDummyData> = {
  '86331c8c-2157-49e0-b67b-dcceebcd2b9c': {
    context: { periodeModulId: 'pm-2026-genap', unitId: 'unit-tif' },
    headerTitle: 'Detail Temuan',
    headerDescription:
      'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
    id: '86331c8c-2157-49e0-b67b-dcceebcd2b9c',
    responsiblePerson: 'Harry Gunawan, M.Kom',
    title: 'Kurangnya Dokumentasi Pada saat Proses Pembelajaran',
    createdAt: '2025-08-01',
    evaluator: 'Pahla Widhiani, M.Kom',
    aspectName: 'Akademik',
    noteLabel: 'CATATAN TEMUAN',
    noteText:
      'Lorem ipsum dolor sit amet consectetur. Et in a id vulputate adipiscing enim. Diam aliquet non pharetra sed sociis neque in dui. Porttitor cras massa molestie sed dolor amet semper. Id eu turpis dis malesuada odio porttitor enim nunc sapien. Condimentum faucibus duis cursus cum nibh consectetur sed pulvinar. Varius malesuada sit diam pharetra pharetra nunc velit orci nunc. Morbi etiam aliquet sed accumsan accumsan ut. Augue tincidunt nunc ullamcorper dui. Nec hac vulputate egestas ultrices sit tortor. Morbi nec enim auctor egestas. Condimentum faucibus duis cursus cum nibconsectetur sed pulvinar. Varius malesuada sit diam pharetra pharetra nunc velit orci nunc. Morbi etiam aliquet sed accumsan accumsan ut. Augue tincidunt nunc ullamcorper dui. Nec hac vulputate egestas ultrices sit tortor. Morbi nec enim auctor egestas.',
    validationResultLabel: 'Hasil Validasi',
    validationResult: {
      status: 'validated',
      statusLabel: 'Tervalidasi',
      statusBadgeClass: 'bg-[#9cedaf] text-[#148f42]',
      validatedBy: 'Pahla Widhiani, M.Kom',
      validatedDate: '2026-01-01',
      validatedTime: '10:15 WIB',
      validatorNote:
        'Lorem ipsum dolor sit amet consectetur. Et mauris massa nec auctor amet venenatis tristique. Facilisi vel ultrices nunc maecenas pellentesque sed vitae et cursus. Diam scelerisque suscipit lectus non volutpat velit quis sagittis. Tincidunt lobortis non suscipit magnis. Lorem ipsum dolor sit amet consectetur. Et mauris massa nec auctor amet venenatis tristique. Facilisi vel ultrices nunc maecenas pellentesque sed vitae et cursus. Diam scelerisque suscipit lectus non volutpat velit quis sagittis. Tincidunt lobortis non suscipit magnis.',
    },
  },
}

const FM3_KAPRODI_DETAIL_FALLBACK_ID = '86331c8c-2157-49e0-b67b-dcceebcd2b9c'

function resolveKaprodiDetailTemplate(temuanId?: string): Fm3KaprodiDetailDummyData {
  if (temuanId && kaprodiDetailTemplateById[temuanId]) {
    return kaprodiDetailTemplateById[temuanId]!
  }
  return kaprodiDetailTemplateById[FM3_KAPRODI_DETAIL_FALLBACK_ID]!
}

export function getFm3KaprodiDetailDummyData(
  params: { context?: Partial<Fm3DashboardContext>; temuanId?: string } = {}
): Fm3KaprodiDetailDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosen = resolveKaprodiDetailTemplate(params.temuanId)

  return {
    ...chosen,
    context: resolvedContext,
    validationResult: { ...chosen.validationResult },
  }
}
