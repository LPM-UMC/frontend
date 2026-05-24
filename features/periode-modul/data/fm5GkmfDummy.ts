export type Fm5DummyRole = 'gkmf' | 'kaprodi' | 'dekan' | 'lpm' | 'wr1'

export type Fm5BeritaAcaraStatus = 'approved' | 'draft' | 'rejected' | 'in_progress'

export type Fm5SignatureStepStatus = 'done' | 'active' | 'waiting'

export const FM5_SUPPORTED_REVIEW_ROLES: Fm5DummyRole[] = ['kaprodi', 'gkmf', 'lpm', 'dekan']
export const FM5_OTHER_DUMMY_ROLES: Fm5DummyRole[] = ['wr1']

export interface Fm5DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm5HeroData {
  title: string
  description: string
  createButtonLabel: string
  showCreateButton: boolean
}

export interface Fm5IndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm5BeritaAcaraRow {
  id: string
  programStudiId: string
  programStudi: string
  nomorBeritaAcara: string
  tanggalMulai: string
  status: Fm5BeritaAcaraStatus
}

export interface Fm5StatusMeta {
  id: Fm5BeritaAcaraStatus
  label: string
  badgeClass: string
}

export interface Fm5FilterOption {
  value: string
  label: string
}

export interface Fm5DashboardDummyData {
  context: Fm5DashboardContext
  role: Fm5DummyRole
  hero: Fm5HeroData
  indicatorTitle: string
  indicators: Fm5IndicatorCard[]
  tableTitle: string
  searchPlaceholder: string
  dateFilterOptions: Fm5FilterOption[]
  programFilterOptions: Fm5FilterOption[]
  rows: Fm5BeritaAcaraRow[]
}

export interface Fm5CreateFormDefaultValues {
  programStudiId: string
  tanggalPelaksanaan: string
  batasWaktuTandaTangan: string
}

export interface Fm5ProgramStudiOption {
  id: string
  label: string
}

export interface Fm5CreatePageDummyData {
  context: Fm5DashboardContext
  headerTitle: string
  headerDescription: string
  sectionTitle: string
  formTitle: string
  programStudiLabel: string
  tanggalPelaksanaanLabel: string
  batasWaktuLabel: string
  submitLabel: string
  programStudiOptions: Fm5ProgramStudiOption[]
  defaultValues: Fm5CreateFormDefaultValues
}

export interface Fm5DocumentSection {
  heading: string
  subHeadingLines: string[]
  bodyLines: string[]
}

export interface Fm5DocumentSignatureBlock {
  heading: string
  roleLine: string
  signatureText?: string
  nameLine: string
}

export interface Fm5DetailAttachment {
  id: string
  label: string
}

export interface Fm5SignatureStep {
  id: string
  roleName: string
  description: string
  status: Fm5SignatureStepStatus
}

export interface Fm5DetailActionLabels {
  primary: string
  secondary: string
}

export interface Fm5SanggahanFormData {
  title: string
  defaultMessage: string
  submitLabel: string
}

export interface Fm5DetailDummyData {
  context: Fm5DashboardContext
  role: Fm5DummyRole
  id: string
  headerTitle: string
  headerDescription: string
  showDocument: boolean
  document: Fm5DocumentSection
  topLeftSignature: Fm5DocumentSignatureBlock
  topRightSignature: Fm5DocumentSignatureBlock
  bottomLeftSignature: Fm5DocumentSignatureBlock
  bottomRightSignature: Fm5DocumentSignatureBlock
  signFlowTitle: string
  signatureFlow: Fm5SignatureStep[]
  attachmentsTitle: string
  attachments: Fm5DetailAttachment[]
  actions: Fm5DetailActionLabels
  sanggahanForm: Fm5SanggahanFormData
}

export interface Fm5CreatePayload {
  programStudiId: string
  tanggalPelaksanaan: string
  batasWaktuTandaTangan: string
}

export interface Fm5SanggahanPayload {
  message: string
}

export const FM5_ACTIVE_DUMMY_ROLE: Fm5DummyRole = 'gkmf'

const statusMetaMap: Record<Fm5BeritaAcaraStatus, Fm5StatusMeta> = {
  approved: {
    id: 'approved',
    label: 'Final',
    badgeClass: 'bg-[#9fe5b8] text-[#1a8f50]',
  },
  draft: {
    id: 'draft',
    label: 'Draft',
    badgeClass: 'bg-[#f0df80] text-[#a97709]',
  },
  rejected: {
    id: 'rejected',
    label: 'Sanggah',
    badgeClass: 'bg-[#f5a193] text-[#9c3f31]',
  },
  in_progress: {
    id: 'in_progress',
    label: 'Proses',
    badgeClass: 'bg-[#f5a193] text-[#a94f42]',
  },
}

const dashboardHeroTemplate: Fm5HeroData = {
  title: 'Form 05 Berita Acara',
  description: 'Lorem ipsum dolor sit amet consectetur. Aenean magna aliquam pellentesque magnis posuere neque morbi orci. Velit tortor ornare sagittis faucibus sapien sem morbi mauris. Metus egestas sociis sit habitant diam at in enim et. Et nulla orci aenean tristique.',
  createButtonLabel: 'Buat Berita Baru',
  showCreateButton: true,
}

const indicatorCardsTemplate: Fm5IndicatorCard[] = [
  {
    id: 'total-berita-acara',
    title: 'Total Berita Acara',
    value: 10,
    subtitle: 'Skor Aspek',
    progressPercent: 12,
  },
  {
    id: 'draft',
    title: 'Draft',
    value: 0,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'proses',
    title: 'Proses',
    value: 0,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'final',
    title: 'Final',
    value: 0,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
]

const beritaAcaraRowsTemplate: Omit<Fm5BeritaAcaraRow, 'status'>[] = [
  {
    id: 'ba-fm5-001',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /1',
    tanggalMulai: '2025-08-01',
  },
  {
    id: 'ba-fm5-002',
    programStudiId: 'ti',
    programStudi: 'Teknik Industri',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /1',
    tanggalMulai: '2025-08-01',
  },
  {
    id: 'ba-fm5-003',
    programStudiId: 'peternakan',
    programStudi: 'Peternakan',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /1',
    tanggalMulai: '2025-08-01',
  },
  {
    id: 'ba-fm5-004',
    programStudiId: 'ilmu-pemerintahan',
    programStudi: 'Ilmu Pemerintahan',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /1',
    tanggalMulai: '2025-08-01',
  },
  {
    id: 'ba-fm5-005',
    programStudiId: 'hukum',
    programStudi: 'Hukum',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /1',
    tanggalMulai: '2025-08-01',
  },
  {
    id: 'ba-fm5-006',
    programStudiId: 'si',
    programStudi: 'Sistem Informasi',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /2',
    tanggalMulai: '2025-08-02',
  },
  {
    id: 'ba-fm5-007',
    programStudiId: 'agroteknologi',
    programStudi: 'Agroteknologi',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /2',
    tanggalMulai: '2025-08-02',
  },
  {
    id: 'ba-fm5-008',
    programStudiId: 'akuntansi',
    programStudi: 'Akuntansi',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /2',
    tanggalMulai: '2025-08-03',
  },
  {
    id: 'ba-fm5-009',
    programStudiId: 'sipil',
    programStudi: 'Teknik Sipil',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /2',
    tanggalMulai: '2025-08-03',
  },
  {
    id: 'ba-fm5-010',
    programStudiId: 'manajemen',
    programStudi: 'Manajemen',
    nomorBeritaAcara: 'BA/MONEV/TIF/GANJIL/2025/2026 /2',
    tanggalMulai: '2025-08-03',
  },
]

const createPageTemplate: Omit<Fm5CreatePageDummyData, 'context'> = {
  headerTitle: 'Berita Acara Baru',
  headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  sectionTitle: 'Berita Acara Baru',
  formTitle: 'Form Buat Berita Acara Baru',
  programStudiLabel: 'Program Studi',
  tanggalPelaksanaanLabel: 'Tanggal Pelaksanaan',
  batasWaktuLabel: 'Batas Waktu Tanda Tangan',
  submitLabel: 'Buat Berita Acara',
  programStudiOptions: [
    { id: 'dalam-proses', label: 'Dalam Proses' },
    { id: 'tif', label: 'Teknik Informatika' },
    { id: 'ti', label: 'Teknik Industri' },
    { id: 'peternakan', label: 'Peternakan' },
  ],
  defaultValues: {
    programStudiId: 'dalam-proses',
    tanggalPelaksanaan: '',
    batasWaktuTandaTangan: '',
  },
}

const detailHeaderTitle = 'Berita Acara Baru'
const detailHeaderDescription = 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.'

const documentTemplate: Fm5DocumentSection = {
  heading: 'FM.05 BERITA ACARA MONITORING',
  subHeadingLines: [
    'BERITA ACARA',
    'MONITORING DAN EVALUASI AWAL PEMBELAJARAN',
    'UNIVERSITAS MUHAMMADIYAH CIREBON',
  ],
  bodyLines: [
    'Pada hari ini ..............tanggal ............ bulan .................Dan tahun ............ Telah dilaksanakan monitoring dan evaluasi awal pembelajaran Semester ............pada Program Studi ..........................',
    'Dengan hasil terlampir.',
    'Demikian berita acara ini dibuat sebagai bahan evaluasi pelaksanaan pembelajaran.',
  ],
}

const createSignatureFlowTemplate = (): Fm5SignatureStep[] => [
  {
    id: 'kaprodi',
    roleName: 'Ketua Program Studi',
    description: 'Menunggu tanda tangan',
    status: 'done',
  },
  {
    id: 'gkmf',
    roleName: 'GKMF (Gugus Kendali Mutu Fakultas)',
    description: 'Belum saatnya',
    status: 'waiting',
  },
  {
    id: 'ketua-lpm',
    roleName: 'Ketua Lembaga Penjaminan Mutu',
    description: 'Belum saatnya',
    status: 'waiting',
  },
  {
    id: 'dekan',
    roleName: 'Dekan Fakultas',
    description: 'Belum saatnya',
    status: 'waiting',
  },
]

const attachmentTemplate: Fm5DetailAttachment[] = [
  { id: 'lampiran-1', label: 'Dokumen Hasil Evaluasi' },
  { id: 'lampiran-2', label: 'Dokumen RTL Analisis Resiko (FMEA)' },
]

const sanggahanFormTemplate: Fm5SanggahanFormData = {
  title: 'Masukkan Pesan Untuk Pembuat Dokumen',
  defaultMessage: 'Lorem ipsum dolor sit amet consectetur. Adipiscing semper morbi mollis nulla mi lectus praesent mattis ultrices. Morbi donec adipiscing ultrices porta purus pellentesque est ante. Quam suspendisse et sodales egestas. Sed amet est mi massa eu semper fames lectus.',
  submitLabel: 'Kirim Lampiran',
}

const detailDocumentIds = new Set(['ba-fm5-001', 'ba-fm5-003', 'ba-fm5-005'])

function resolveContext(context: Partial<Fm5DashboardContext>): Fm5DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

export function isFm5ReviewRole(role: Fm5DummyRole): boolean {
  return FM5_SUPPORTED_REVIEW_ROLES.includes(role)
}

function resolveDashboardRows(role: Fm5DummyRole): Fm5BeritaAcaraRow[] {
  const reviewRoleRows = isFm5ReviewRole(role)
  const defaultStatus: Fm5BeritaAcaraStatus = reviewRoleRows ? 'in_progress' : 'approved'

  return beritaAcaraRowsTemplate.map((item) => ({
    ...item,
    status: defaultStatus,
  }))
}

export function resolveFm5StatusMeta(status: Fm5BeritaAcaraStatus): Fm5StatusMeta {
  return statusMetaMap[status]
}

export function getFm5DashboardDummyData(
  context: Partial<Fm5DashboardContext> = {},
  role: Fm5DummyRole = FM5_ACTIVE_DUMMY_ROLE
): Fm5DashboardDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    role,
    hero: { ...dashboardHeroTemplate },
    indicatorTitle: 'Capaian Indikator',
    indicators: indicatorCardsTemplate.map((item) => ({ ...item })),
    tableTitle: 'Daftar Berita Acara',
    searchPlaceholder: 'Search',
    dateFilterOptions: [
      { value: 'all', label: 'Semua Tanggal' },
      { value: '2025-08-01', label: '2025-08-01' },
      { value: '2025-08-02', label: '2025-08-02' },
      { value: '2025-08-03', label: '2025-08-03' },
    ],
    programFilterOptions: [
      { value: 'all', label: 'Semua Prodi' },
      { value: 'tif', label: 'TIF' },
      { value: 'ti', label: 'TI' },
      { value: 'peternakan', label: 'Peternakan' },
      { value: 'hukum', label: 'Hukum' },
    ],
    rows: resolveDashboardRows(role),
  }
}

export function getFm5CreatePageDummyData(
  context: Partial<Fm5DashboardContext> = {}
): Fm5CreatePageDummyData {
  const resolvedContext = resolveContext(context)

  return {
    ...createPageTemplate,
    context: resolvedContext,
    programStudiOptions: createPageTemplate.programStudiOptions.map((option) => ({ ...option })),
    defaultValues: { ...createPageTemplate.defaultValues },
  }
}

function createDocumentDetailData(
  context: Fm5DashboardContext,
  beritaAcaraId: string,
  role: Fm5DummyRole
): Fm5DetailDummyData {
  const showSignatureSample = isFm5ReviewRole(role)

  return {
    context,
    role,
    id: beritaAcaraId,
    headerTitle: detailHeaderTitle,
    headerDescription: detailHeaderDescription,
    showDocument: true,
    document: {
      ...documentTemplate,
      subHeadingLines: [...documentTemplate.subHeadingLines],
      bodyLines: [...documentTemplate.bodyLines],
    },
    topLeftSignature: {
      heading: 'Cirebon,',
      roleLine: 'Ketua Program Studi .....',
      signatureText: showSignatureSample ? 'Byul Bc' : undefined,
      nameLine: '(.....................................................)',
    },
    topRightSignature: {
      heading: 'GKMF',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    bottomLeftSignature: {
      heading: 'Menyetujui,\nKetua Lembaga Penjaminan Mutu',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    bottomRightSignature: {
      heading: 'Mengetahui,\nDekan...',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    signFlowTitle: 'Status Alur Tanda Tangan :',
    signatureFlow: createSignatureFlowTemplate(),
    attachmentsTitle: 'Lampiran :',
    attachments: attachmentTemplate.map((item) => ({ ...item })),
    actions: {
      primary: 'Tanda Tangani',
      secondary: 'Sanggah',
    },
    sanggahanForm: {
      ...sanggahanFormTemplate,
    },
  }
}

function createEmptyDetailData(
  context: Fm5DashboardContext,
  beritaAcaraId: string,
  role: Fm5DummyRole
): Fm5DetailDummyData {
  return {
    context,
    role,
    id: beritaAcaraId,
    headerTitle: detailHeaderTitle,
    headerDescription: detailHeaderDescription,
    showDocument: false,
    document: {
      ...documentTemplate,
      subHeadingLines: [...documentTemplate.subHeadingLines],
      bodyLines: [...documentTemplate.bodyLines],
    },
    topLeftSignature: {
      heading: 'Cirebon,',
      roleLine: 'Ketua Program Studi .....',
      nameLine: '(.....................................................)',
    },
    topRightSignature: {
      heading: 'GKMF',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    bottomLeftSignature: {
      heading: 'Menyetujui,\nKetua Lembaga Penjaminan Mutu',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    bottomRightSignature: {
      heading: 'Mengetahui,\nDekan...',
      roleLine: '',
      nameLine: '(.....................................................)',
    },
    signFlowTitle: 'Status Alur Tanda Tangan :',
    signatureFlow: createSignatureFlowTemplate(),
    attachmentsTitle: 'Lampiran :',
    attachments: attachmentTemplate.map((item) => ({ ...item })),
    actions: {
      primary: 'Tanda Tangani',
      secondary: 'Sanggah',
    },
    sanggahanForm: {
      ...sanggahanFormTemplate,
    },
  }
}

export function getFm5DetailDummyData(
  params: {
    context?: Partial<Fm5DashboardContext>
    beritaAcaraId?: string
    role?: Fm5DummyRole
  } = {}
): Fm5DetailDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const role = params.role ?? FM5_ACTIVE_DUMMY_ROLE
  const beritaAcaraId = params.beritaAcaraId ?? 'ba-fm5-001'

  if (!isFm5ReviewRole(role)) {
    return createDocumentDetailData(resolvedContext, beritaAcaraId, role)
  }

  if (detailDocumentIds.has(beritaAcaraId)) {
    return createDocumentDetailData(resolvedContext, beritaAcaraId, role)
  }

  return createEmptyDetailData(resolvedContext, beritaAcaraId, role)
}
