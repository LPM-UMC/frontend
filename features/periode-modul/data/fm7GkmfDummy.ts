export type Fm7DummyRole =
  | 'gkmf'
  | 'kaprodi'
  | 'dekan'
  | 'wakil_dekan'
  | 'ketua_lpm'
  | 'pimpinan'

export type Fm7WorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'acknowledged'
  | 'reviewed'
  | 'coordinated'
  | 'approved'

export type Fm7RowStatus = 'draft' | 'process' | 'final'

export type Fm7ActionTone = 'green' | 'orange' | 'blue' | 'purple' | 'red'

export interface Fm7DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm7HeroData {
  title: string
  description: string
  bulletPoints: string[]
  createButtonLabel: string
}

export interface Fm7IndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm7StatusMeta {
  id: Fm7RowStatus
  label: string
  badgeClass: string
}

export interface Fm7FilterOption {
  value: string
  label: string
}

export interface Fm7RoleActionMeta {
  role: Fm7DummyRole
  roleLabel: string
  actionLabel: string
  fromStatus: Fm7WorkflowStatus
  toStatus: Fm7WorkflowStatus
  tone: Fm7ActionTone
}

export interface Fm7ReportListRow {
  id: string
  kodeLaporan: string
  programStudiId: string
  programStudi: string
  fakultas: string
  semester: string
  status: Fm7RowStatus
  dibuatOleh: string
  tanggalMulai: string
}

export interface Fm7DashboardDummyData {
  context: Fm7DashboardContext
  role: Fm7DummyRole
  hero: Fm7HeroData
  indicatorTitle: string
  indicators: Fm7IndicatorCard[]
  tableTitle: string
  searchPlaceholder: string
  dateFilterOptions: Fm7FilterOption[]
  programFilterOptions: Fm7FilterOption[]
  rows: Fm7ReportListRow[]
}

export interface Fm7ProgramStudiOption {
  id: string
  label: string
  semester: string
  tahunAkademik: string
}

export interface Fm7FakultasOption {
  id: string
  label: string
  programStudiOptions: Fm7ProgramStudiOption[]
}

export interface Fm7SourceDataItem {
  id: string
  label: string
  babLabel: string
  statusLabel: string
  available: boolean
}

export interface Fm7CreatePageDummyData {
  context: Fm7DashboardContext
  role: Fm7DummyRole
  headerTitle: string
  headerDescription: string
  flowTitle: string
  stepOneLabel: string
  stepTwoLabel: string
  fakultasLabel: string
  fakultasPlaceholder: string
  fakultasHint: string
  programStudiLabel: string
  programStudiPlaceholder: string
  programStudiHint: string
  warningTitle: string
  warningMessage: string
  stepTwoSummaryTitle: string
  sourceDataTitle: string
  impactTitle: string
  impactLines: string[]
  backLabel: string
  nextLabel: string
  generateLabel: string
  fakultasOptions: Fm7FakultasOption[]
  sourceItems: Fm7SourceDataItem[]
}

export interface Fm7NarrativeFields {
  kataPengantar: string
  bab1LatarBelakang: string
  bab1Tujuan: string
  bab1DasarHukum: string
  bab4Simpulan: string
  bab4Rekomendasi: string
}

export interface Fm7CoverMetaField {
  label: string
  value: string
}

export interface Fm7PengesahanMetaField {
  label: string
  value: string
}

export interface Fm7SignatureRoleRow {
  id: string
  title: string
  subtitle: string
  tone: 'mint' | 'blue' | 'sand' | 'purple' | 'rose'
}

export interface Fm7MonitoringRow {
  no: number
  aspek: string
  indikator: string
  temuan: string
  status: string
}

export interface Fm7EvaluationRow {
  no: number
  aspek: string
  skor: string
  kategori: string
  keterangan: string
}

export interface Fm7SurveyRow {
  no: number
  indikator: string
  persentase: string
  kategori: string
}

export interface Fm7FindingRow {
  no: number
  temuan: string
  sumber: string
  risiko: string
}

export interface Fm7RiskRow {
  no: number
  risiko: string
  s: number
  o: number
  d: number
  rpn: number
  tindakLanjut: string
}

export interface Fm7DaftarIsiRow {
  id: string
  title: string
  page: string
  level: 0 | 1
  emphasized?: boolean
}

export interface Fm7ProgressStep {
  id: Fm7WorkflowStatus
  order: number
  label: string
}

export interface Fm7ReportRecord {
  id: string
  kodeLaporan: string
  programStudiId: string
  programStudi: string
  fakultasId: string
  fakultas: string
  semester: string
  tahunAkademik: string
  dibuatOleh: string
  tanggalMulai: string
  workflowStatus: Fm7WorkflowStatus
  narasi: Fm7NarrativeFields
}

export interface Fm7ReportDetailDummyData {
  context: Fm7DashboardContext
  role: Fm7DummyRole
  roleLabel: string
  id: string
  kodeLaporan: string
  programStudi: string
  fakultas: string
  semester: string
  tahunAkademik: string
  workflowStatus: Fm7WorkflowStatus
  workflowLabel: string
  canEditNarrative: boolean
  canPerformRoleAction: boolean
  roleActionLabel: string
  roleActionTone: Fm7ActionTone
  roleActionFromStatus: Fm7WorkflowStatus
  roleActionToStatus: Fm7WorkflowStatus
  createdByName: string
  createdByNip: string
  roleAccessTitle: string
  roleAccessDescription: string
  documentTitle: string
  coverMetaFields: Fm7CoverMetaField[]
  pengesahanMetaFields: Fm7PengesahanMetaField[]
  signatureRows: Fm7SignatureRoleRow[]
  daftarIsiRows: Fm7DaftarIsiRow[]
  bab1Heading: string
  bab2Heading: string
  bab3Heading: string
  bab4Heading: string
  narrative: Fm7NarrativeFields
  monitoringRows: Fm7MonitoringRow[]
  evaluationRows: Fm7EvaluationRow[]
  surveyRows: Fm7SurveyRow[]
  findingRows: Fm7FindingRow[]
  riskRows: Fm7RiskRow[]
  progressTitle: string
  progressSteps: Fm7ProgressStep[]
}

export interface Fm7CreatePayload {
  fakultasId: string
  programStudiId: string
}

export interface Fm7CreateResult {
  id: string
}

export interface Fm7NarrativePayload {
  kataPengantar: string
  bab1LatarBelakang: string
  bab1Tujuan: string
  bab1DasarHukum: string
  bab4Simpulan: string
  bab4Rekomendasi: string
}

export interface Fm7SubmitPayload {
  actorName: string
  actorNip: string
  role: Fm7DummyRole
  actionLabel: string
  fromStatus: Fm7WorkflowStatus
  toStatus: Fm7WorkflowStatus
}

export const FM7_ACTIVE_DUMMY_ROLE: Fm7DummyRole = 'gkmf'

const fm7RoleAliases: Record<string, Fm7DummyRole> = {
  gkmf: 'gkmf',
  kaprodi: 'kaprodi',
  dekan: 'dekan',
  wakildekan: 'wakil_dekan',
  'wakil-dekan': 'wakil_dekan',
  'wakil_dekan': 'wakil_dekan',
  lpm: 'ketua_lpm',
  'ketua-lpm': 'ketua_lpm',
  ketualpm: 'ketua_lpm',
  ketua_lpm: 'ketua_lpm',
  pimpinan: 'pimpinan',
  wr1: 'pimpinan',
  'wr-1': 'pimpinan',
  wakilrektor1: 'pimpinan',
  'wakil-rektor-1': 'pimpinan',
}

const fm7RoleActionMap: Record<Fm7DummyRole, Fm7RoleActionMeta> = {
  gkmf: {
    role: 'gkmf',
    roleLabel: 'GKMF',
    actionLabel: 'Ajukan Laporan',
    fromStatus: 'draft',
    toStatus: 'submitted',
    tone: 'green',
  },
  kaprodi: {
    role: 'kaprodi',
    roleLabel: 'Kaprodi',
    actionLabel: 'Tandai Diketahui',
    fromStatus: 'submitted',
    toStatus: 'acknowledged',
    tone: 'blue',
  },
  dekan: {
    role: 'dekan',
    roleLabel: 'Dekan',
    actionLabel: 'Periksa Dokumen',
    fromStatus: 'acknowledged',
    toStatus: 'reviewed',
    tone: 'orange',
  },
  wakil_dekan: {
    role: 'wakil_dekan',
    roleLabel: 'Wakil Dekan',
    actionLabel: 'Periksa Dokumen',
    fromStatus: 'acknowledged',
    toStatus: 'reviewed',
    tone: 'orange',
  },
  ketua_lpm: {
    role: 'ketua_lpm',
    roleLabel: 'Ketua LPM',
    actionLabel: 'Koordinasikan',
    fromStatus: 'reviewed',
    toStatus: 'coordinated',
    tone: 'purple',
  },
  pimpinan: {
    role: 'pimpinan',
    roleLabel: 'Pimpinan',
    actionLabel: 'Setujui',
    fromStatus: 'coordinated',
    toStatus: 'approved',
    tone: 'red',
  },
}

const statusMetaMap: Record<Fm7RowStatus, Fm7StatusMeta> = {
  draft: {
    id: 'draft',
    label: 'Draft',
    badgeClass: 'bg-[#f0df80] text-[#a97709]',
  },
  process: {
    id: 'process',
    label: 'Proses',
    badgeClass: 'bg-[#f5a193] text-[#a94f42]',
  },
  final: {
    id: 'final',
    label: 'Final',
    badgeClass: 'bg-[#9fe5b8] text-[#1a8f50]',
  },
}

const workflowLabelMap: Record<Fm7WorkflowStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  reviewed: 'Reviewed',
  coordinated: 'Coordinated',
  approved: 'Approved',
}

const progressStepsTemplate: Fm7ProgressStep[] = [
  { id: 'draft', order: 1, label: 'Draft' },
  { id: 'submitted', order: 2, label: 'Submitted' },
  { id: 'acknowledged', order: 3, label: 'Acknowledged' },
  { id: 'reviewed', order: 4, label: 'Reviewed' },
  { id: 'coordinated', order: 5, label: 'Coordinated' },
  { id: 'approved', order: 6, label: 'Approved' },
]

const heroTemplateGkmf: Fm7HeroData = {
  title: 'Form 07 Berita Acara',
  description:
    'Lorem ipsum dolor sit amet consectetur. Egestas sit dolor senectus nulla. Non ligula vitae pharetra urna feugiat lacus feugiat. Ut id quis convallis curabitur enim. Neque ullamcorper luctus aenean vitae elit tellus tincidunt.',
  bulletPoints: [
    'Dapat melihat semua laporan',
    'Dapat mengedit laporan berstatus Draft',
    'Dapat mengubah status laporan dari Draft ke Final',
    'Dapat mengekspor laporan ke PDF',
    'Setelah status Final, laporan tidak dapat diedit lagi',
  ],
  createButtonLabel: 'Buat Berita Baru',
}

const heroTemplateOtherRole: Fm7HeroData = {
  title: 'Form 07 Berita Acara',
  description:
    'Lorem ipsum dolor sit amet consectetur. Egestas sit dolor senectus nulla. Non ligula vitae pharetra urna feugiat lacus feugiat. Ut id quis convallis curabitur enim. Neque ullamcorper luctus aenean vitae elit tellus tincidunt.',
  bulletPoints: [
    'Dapat melihat semua laporan (View Only)',
    'Tidak Dapat mengedit atau melakukan endorsement',
    'Hanya untuk keperluan Informasi dan koordinasi',
  ],
  createButtonLabel: 'Buat Berita Baru',
}

const indicatorCardsTemplate: Fm7IndicatorCard[] = [
  {
    id: 'total-berita-acara',
    title: 'Total Berita Acara',
    value: 10,
    subtitle: 'Skor Aspek',
    progressPercent: 14,
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

const fakultasOptionsTemplate: Fm7FakultasOption[] = [
  {
    id: 'fakultas-teknik',
    label: 'Fakultas Teknik',
    programStudiOptions: [
      {
        id: 'teknik-sipil',
        label: 'Teknik Sipil',
        semester: 'Ganjil',
        tahunAkademik: '2023/2024',
      },
      {
        id: 'teknik-informatika',
        label: 'Teknik Informatika',
        semester: 'Genap',
        tahunAkademik: '2024/2025',
      },
      {
        id: 'teknik-mesin',
        label: 'Teknik Mesin',
        semester: 'Genap',
        tahunAkademik: '2024/2025',
      },
    ],
  },
  {
    id: 'fakultas-ekonomi-bisnis',
    label: 'Fakultas Ekonomi dan Bisnis',
    programStudiOptions: [
      {
        id: 'manajemen',
        label: 'Manajemen',
        semester: 'Genap',
        tahunAkademik: '2024/2025',
      },
      {
        id: 'akuntansi',
        label: 'Akuntansi',
        semester: 'Genap',
        tahunAkademik: '2024/2025',
      },
    ],
  },
  {
    id: 'fakultas-hukum',
    label: 'Fakultas Hukum',
    programStudiOptions: [
      {
        id: 'hukum',
        label: 'Hukum',
        semester: 'Genap',
        tahunAkademik: '2024/2025',
      },
    ],
  },
]

const sourceItemsTemplate: Fm7SourceDataItem[] = [
  {
    id: 'fm01',
    label: 'FM.01 Form Monitoring',
    babLabel: 'BAB 2A',
    statusLabel: 'Tersedia',
    available: true,
  },
  {
    id: 'fm02',
    label: 'FM.02 Hasil Evaluasi',
    babLabel: 'BAB 2B',
    statusLabel: 'Tersedia',
    available: true,
  },
  {
    id: 'fm03',
    label: 'FM.03 Form Temuan',
    babLabel: 'BAB 3A',
    statusLabel: 'Tersedia',
    available: true,
  },
  {
    id: 'fm04',
    label: 'FM.04 RTL / FMEA',
    babLabel: 'BAB 3B',
    statusLabel: 'Tersedia',
    available: true,
  },
  {
    id: 'fm05',
    label: 'FM.05 Berita Acara',
    babLabel: 'Lampiran',
    statusLabel: 'Tersedia',
    available: true,
  },
  {
    id: 'fm06',
    label: 'FM.06 Form Survey',
    babLabel: 'BAB 2C',
    statusLabel: 'Tersedia',
    available: true,
  },
]

const defaultNarrativeTemplate: Fm7NarrativeFields = {
  kataPengantar:
    '[Draft] Puji syukur kehadirat Tuhan Yang Maha Esa atas tersusunnya Laporan Monitoring dan Evaluasi pembelajaran semester ganjil tahun akademik 2024/2025 untuk Program Studi Teknik Mesin Fakultas Teknik Universitas Muhammadiyah Cirebon.',
  bab1LatarBelakang:
    'Monitoring dan evaluasi pembelajaran merupakan bagian integral dari sistem penjaminan mutu internal perguruan tinggi. Kegiatan ini bertujuan untuk memastikan bahwa proses pembelajaran berjalan sesuai dengan standar yang telah ditetapkan.',
  bab1Tujuan:
    '1. Memastikan kesiapan dosen dan mahasiswa dalam proses pembelajaran 2. Mengevaluasi kelengkapan RPS dan bahan ajar 3. Mengidentifikasi potensi masalah 4. Memberikan rekomendasi perbaikan',
  bab1DasarHukum:
    '1. UU No. 12 Tahun 2012 tentang Pendidikan Tinggi 2. Permendikbud No. 3 Tahun 2020 tentang SN Dikti 3. Peraturan Rektor tentang SPMI UMC',
  bab4Simpulan:
    '[Masih dalam penyusunan - silakan edit setelah data lengkap]',
  bab4Rekomendasi:
    '[Masih dalam penyusunan - silakan edit setelah data lengkap]',
}

const daftarIsiTemplate: Fm7DaftarIsiRow[] = [
  { id: 'judul', title: 'Halaman Judul', page: 'i', level: 0 },
  { id: 'pengesahan', title: 'Halaman Pengesahan', page: 'ii', level: 0 },
  { id: 'kata-pengantar', title: 'Kata Pengantar', page: 'iii', level: 0 },
  { id: 'daftar-isi', title: 'Daftar Isi', page: 'iv', level: 0 },
  { id: 'bab-1', title: 'BAB 1 PENDAHULUAN', page: '1', level: 0, emphasized: true },
  { id: 'bab-1-a', title: 'A. Latar Belakang', page: '1', level: 1 },
  { id: 'bab-1-b', title: 'B. Tujuan Monitoring dan Evaluasi', page: '2', level: 1 },
  { id: 'bab-1-c', title: 'C. Dasar Hukum', page: '3', level: 1 },
  { id: 'bab-2', title: 'BAB 2 HASIL MONEV', page: '4', level: 0, emphasized: true },
  { id: 'bab-2-a', title: 'A. Deskripsi Hasil Monitoring', page: '4', level: 1 },
  { id: 'bab-2-b', title: 'B. Deskripsi Hasil Evaluasi', page: '6', level: 1 },
  { id: 'bab-2-c', title: 'C. Deskripsi Hasil Survei', page: '8', level: 1 },
  { id: 'bab-3', title: 'BAB 3 RENCANA TINDAK LANJUT', page: '10', level: 0, emphasized: true },
  { id: 'bab-3-a', title: 'A. Daftar Temuan Monitoring', page: '10', level: 1 },
  { id: 'bab-3-b', title: 'B. Hasil Analisis Risiko', page: '12', level: 1 },
  { id: 'bab-4', title: 'BAB 4 SIMPULAN DAN REKOMENDASI', page: '14', level: 0, emphasized: true },
  { id: 'bab-4-a', title: 'A. Simpulan', page: '14', level: 1 },
  { id: 'bab-4-b', title: 'B. Rekomendasi', page: '15', level: 1 },
]

const monitoringRowsTemplate: Fm7MonitoringRow[] = [
  {
    no: 1,
    aspek: 'Kelengkapan RPS',
    indikator: 'Ketersediaan RPS',
    temuan: 'Dalam proses verifikasi',
    status: 'Sesuai',
  },
  {
    no: 2,
    aspek: 'Kehadiran Dosen',
    indikator: 'Persentase kehadiran',
    temuan: 'Dalam proses verifikasi',
    status: 'Sesuai',
  },
]

const evaluationRowsTemplate: Fm7EvaluationRow[] = [
  {
    no: 1,
    aspek: 'Kelengkapan RPS',
    skor: '0',
    kategori: 'Belum Dinilai',
    keterangan: 'Menunggu data',
  },
]

const surveyRowsTemplate: Fm7SurveyRow[] = [
  {
    no: 1,
    indikator: 'Kesesuaian materi dengan RPS',
    persentase: '0%',
    kategori: 'Belum Dinilai',
  },
]

const findingRowsTemplate: Fm7FindingRow[] = [
  {
    no: 1,
    temuan: '[Menunggu data dari FM.03]',
    sumber: 'FM.03',
    risiko: 'Rendah',
  },
]

const riskRowsTemplate: Fm7RiskRow[] = [
  {
    no: 1,
    risiko: '[Menunggu data dari FM.04]',
    s: 0,
    o: 0,
    d: 0,
    rpn: 0,
    tindakLanjut: '[Menunggu analisis]',
  },
]

const signatureRowsTemplate: Fm7SignatureRoleRow[] = [
  {
    id: 'dibuat',
    title: 'Dibuat / Diajukan Oleh',
    subtitle: 'Gugus Kendali Mutu Fakultas',
    tone: 'mint',
  },
  {
    id: 'mengetahui',
    title: 'Mengetahui',
    subtitle: 'Ketua Program Studi',
    tone: 'blue',
  },
  {
    id: 'diperiksa',
    title: 'Diperiksa Oleh',
    subtitle: 'Dekan & Wakil Dekan',
    tone: 'sand',
  },
  {
    id: 'dikoordinasi',
    title: 'Dikoordinasikan Oleh',
    subtitle: 'Ketua LPM',
    tone: 'purple',
  },
  {
    id: 'disetujui',
    title: 'Disetujui Oleh',
    subtitle: 'Pimpinan (Wakil Rektor 1)',
    tone: 'rose',
  },
]

const roleActorMap: Record<Fm7DummyRole, { name: string; nip: string }> = {
  gkmf: {
    name: 'Dr. Siti Nurhaliza',
    nip: '198501012010012001',
  },
  kaprodi: {
    name: 'Dr. Budi Santoso, M.Kom',
    nip: '198703152012011003',
  },
  dekan: {
    name: 'Prof. Dr. Ir. Hendra Wijaya',
    nip: '197201032000031001',
  },
  wakil_dekan: {
    name: 'Dr. Maya Anggraini, M.Si',
    nip: '197907142005012002',
  },
  ketua_lpm: {
    name: 'Kusna UMM',
    nip: '197701012002121001',
  },
  pimpinan: {
    name: 'Pimpinan Wakil Rektor 1',
    nip: '196812011994031001',
  },
}

const roleAccessDescriptionMap: Record<Fm7DummyRole, string> = {
  gkmf:
    'Anda dapat mengedit narasi laporan (Kata Pengantar, BAB 1, BAB 4). Data tabel bersumber dari FM.01-FM.06.',
  kaprodi:
    'Anda dapat melihat dan melakukan aksi sesuai kewenangan role Kaprodi.',
  dekan:
    'Anda dapat melihat dan melakukan aksi sesuai kewenangan role Dekan.',
  wakil_dekan:
    'Anda dapat melihat dan melakukan aksi sesuai kewenangan role Wakil Dekan.',
  ketua_lpm:
    'Anda dapat melihat dan melakukan aksi sesuai kewenangan role Ketua LPM.',
  pimpinan:
    'Anda dapat melihat dan melakukan aksi sesuai kewenangan role Pimpinan.',
}

const createPageTemplate: Omit<Fm7CreatePageDummyData, 'context' | 'role'> = {
  headerTitle: 'FM. 07 FORM LAPORAN MONEV',
  headerDescription:
    'Sistem akan menghasilkan laporan secara otomatis dari data FM.03 dan FM.04 Data tabel (skor, nilai, persentase) tidak dapat diedit manual Anda dapat mengedit narasi laporan (Kata Pengantar, BAB I, Kesimpulan, Rekomendasi) Status awal laporan adalah Draft',
  flowTitle: 'Alur Laporan Monev',
  stepOneLabel: 'Data Laporan',
  stepTwoLabel: 'Konfirmasi',
  fakultasLabel: 'Fakultas *',
  fakultasPlaceholder: 'Pilih Fakultas',
  fakultasHint: 'Pilih Fakultas Berdasarkan Data Yang Ingin diInputkan',
  programStudiLabel: 'Program Studi *',
  programStudiPlaceholder: 'Pilih Program Studi',
  programStudiHint: 'Pilih Program Studi Berdasarkan Data Yang Ingin Diinputkan',
  warningTitle: 'Catatan',
  warningMessage: 'Lorem Ipsun',
  stepTwoSummaryTitle: 'Data Laporan yang Akan Dibuat',
  sourceDataTitle: 'Sumber Data',
  impactTitle: 'Yang Akan Terjadi Setelah Generate',
  impactLines: [
    'Sistem membuat draft laporan dengan status Draft',
    'Semua data tabel akan terisi otomatis dari FM.03 dan FM.04',
    'Template narasi default akan tersedia untuk diedit',
    'Anda akan diarahkan ke halaman laporan untuk editing',
  ],
  backLabel: 'Kembali',
  nextLabel: 'Lanjut Step 2',
  generateLabel: 'Generate Laporan',
  fakultasOptions: fakultasOptionsTemplate,
  sourceItems: sourceItemsTemplate,
}

const initialReportsTemplate: Fm7ReportRecord[] = [
  {
    id: 'fm07-report-001',
    kodeLaporan: 'FM07-2025-338',
    programStudiId: 'manajemen',
    programStudi: 'Manajemen',
    fakultasId: 'fakultas-ekonomi-bisnis',
    fakultas: 'FEB',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-01',
    workflowStatus: 'acknowledged',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-002',
    kodeLaporan: 'FM07-2025-337',
    programStudiId: 'teknik-informatika',
    programStudi: 'Teknik Informatika',
    fakultasId: 'fakultas-teknik',
    fakultas: 'Teknik',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-01',
    workflowStatus: 'approved',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-003',
    kodeLaporan: 'FM07-2025-336',
    programStudiId: 'akuntansi',
    programStudi: 'Akuntansi',
    fakultasId: 'fakultas-ekonomi-bisnis',
    fakultas: 'FEB',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-01',
    workflowStatus: 'reviewed',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-004',
    kodeLaporan: 'FM07-2025-335',
    programStudiId: 'hukum',
    programStudi: 'Hukum',
    fakultasId: 'fakultas-hukum',
    fakultas: 'IP',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-01',
    workflowStatus: 'draft',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-005',
    kodeLaporan: 'FM07-2025-334',
    programStudiId: 'teknik-industri',
    programStudi: 'Tekin Industri',
    fakultasId: 'fakultas-teknik',
    fakultas: 'Teknik',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-01',
    workflowStatus: 'submitted',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-006',
    kodeLaporan: 'FM07-2025-333',
    programStudiId: 'teknik-sipil',
    programStudi: 'Teknik Sipil',
    fakultasId: 'fakultas-teknik',
    fakultas: 'Teknik',
    semester: 'Ganjil 2023/2024',
    tahunAkademik: '2023/2024',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-02',
    workflowStatus: 'submitted',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-007',
    kodeLaporan: 'FM07-2025-332',
    programStudiId: 'teknik-mesin',
    programStudi: 'Teknik Mesin',
    fakultasId: 'fakultas-teknik',
    fakultas: 'Teknik',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-02',
    workflowStatus: 'acknowledged',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-008',
    kodeLaporan: 'FM07-2025-331',
    programStudiId: 'manajemen',
    programStudi: 'Manajemen',
    fakultasId: 'fakultas-ekonomi-bisnis',
    fakultas: 'FEB',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-03',
    workflowStatus: 'acknowledged',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-009',
    kodeLaporan: 'FM07-2025-330',
    programStudiId: 'akuntansi',
    programStudi: 'Akuntansi',
    fakultasId: 'fakultas-ekonomi-bisnis',
    fakultas: 'FEB',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-03',
    workflowStatus: 'coordinated',
    narasi: { ...defaultNarrativeTemplate },
  },
  {
    id: 'fm07-report-010',
    kodeLaporan: 'FM07-2025-329',
    programStudiId: 'hukum',
    programStudi: 'Hukum',
    fakultasId: 'fakultas-hukum',
    fakultas: 'IP',
    semester: 'Genap 2024/2025',
    tahunAkademik: '2024/2025',
    dibuatOleh: 'Fulanm M.Kom',
    tanggalMulai: '2025-08-03',
    workflowStatus: 'reviewed',
    narasi: { ...defaultNarrativeTemplate },
  },
]

function resolveContext(context: Partial<Fm7DashboardContext>): Fm7DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

export function resolveFm7DummyRole(
  rawValue?: string | null,
  fallbackRole: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
): Fm7DummyRole {
  if (!rawValue) return fallbackRole

  const normalized = rawValue.trim().toLowerCase()
  return fm7RoleAliases[normalized] ?? fallbackRole
}

export function resolveFm7RoleAction(role: Fm7DummyRole): Fm7RoleActionMeta {
  return fm7RoleActionMap[role]
}

export function resolveFm7RoleLabel(role: Fm7DummyRole): string {
  return resolveFm7RoleAction(role).roleLabel
}

export function isFm7RoleActionAllowed(
  role: Fm7DummyRole,
  status: Fm7WorkflowStatus
): boolean {
  const action = resolveFm7RoleAction(role)
  return action.fromStatus === status
}

export function resolveFm7NextWorkflowStatus(
  role: Fm7DummyRole,
  currentStatus: Fm7WorkflowStatus
): Fm7WorkflowStatus {
  const action = resolveFm7RoleAction(role)
  if (action.fromStatus !== currentStatus) return currentStatus
  return action.toStatus
}

export function cloneFm7Narrative(fields: Fm7NarrativeFields): Fm7NarrativeFields {
  return {
    kataPengantar: fields.kataPengantar,
    bab1LatarBelakang: fields.bab1LatarBelakang,
    bab1Tujuan: fields.bab1Tujuan,
    bab1DasarHukum: fields.bab1DasarHukum,
    bab4Simpulan: fields.bab4Simpulan,
    bab4Rekomendasi: fields.bab4Rekomendasi,
  }
}

export function cloneFm7ReportRecord(record: Fm7ReportRecord): Fm7ReportRecord {
  return {
    ...record,
    narasi: cloneFm7Narrative(record.narasi),
  }
}

export function createFm7InitialReports(): Fm7ReportRecord[] {
  return initialReportsTemplate.map((item) => cloneFm7ReportRecord(item))
}

export function resolveFm7StatusMeta(status: Fm7RowStatus): Fm7StatusMeta {
  return statusMetaMap[status]
}

export function resolveFm7WorkflowLabel(status: Fm7WorkflowStatus): string {
  return workflowLabelMap[status]
}

export function resolveFm7WorkflowOrder(status: Fm7WorkflowStatus): number {
  const found = progressStepsTemplate.find((item) => item.id === status)
  return found?.order ?? 1
}

export function mapWorkflowToRowStatus(status: Fm7WorkflowStatus): Fm7RowStatus {
  if (status === 'approved') return 'final'
  if (status === 'draft') return 'draft'
  return 'process'
}

export function getFm7CreatePageDummyData(
  context: Partial<Fm7DashboardContext> = {},
  role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
): Fm7CreatePageDummyData {
  return {
    ...createPageTemplate,
    context: resolveContext(context),
    role,
    fakultasOptions: createPageTemplate.fakultasOptions.map((fakultas) => ({
      ...fakultas,
      programStudiOptions: fakultas.programStudiOptions.map((program) => ({ ...program })),
    })),
    sourceItems: createPageTemplate.sourceItems.map((item) => ({ ...item })),
    impactLines: [...createPageTemplate.impactLines],
  }
}

export function resolveProgramByIds(
  fakultasId: string,
  programStudiId: string
): { fakultas: Fm7FakultasOption; programStudi: Fm7ProgramStudiOption } | null {
  const fakultas = fakultasOptionsTemplate.find((item) => item.id === fakultasId)
  if (!fakultas) return null
  const programStudi = fakultas.programStudiOptions.find((item) => item.id === programStudiId)
  if (!programStudi) return null

  return {
    fakultas: {
      ...fakultas,
      programStudiOptions: fakultas.programStudiOptions.map((item) => ({ ...item })),
    },
    programStudi: { ...programStudi },
  }
}

function buildDashboardRows(records: Fm7ReportRecord[]): Fm7ReportListRow[] {
  return records.map((record) => ({
    id: record.id,
    kodeLaporan: record.kodeLaporan,
    programStudiId: record.programStudiId,
    programStudi: record.programStudi,
    fakultas: record.fakultas,
    semester: record.semester,
    status: mapWorkflowToRowStatus(record.workflowStatus),
    dibuatOleh: record.dibuatOleh,
    tanggalMulai: record.tanggalMulai,
  }))
}

export function getFm7DashboardDummyData(
  context: Partial<Fm7DashboardContext> = {},
  role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE,
  records: Fm7ReportRecord[] = createFm7InitialReports()
): Fm7DashboardDummyData {
  const rows = buildDashboardRows(records)

  const total = rows.length
  const draft = rows.filter((item) => item.status === 'draft').length
  const process = rows.filter((item) => item.status === 'process').length
  const final = rows.filter((item) => item.status === 'final').length

  const indicators = indicatorCardsTemplate.map((item) => ({ ...item }))
  if (role === 'gkmf') {
    indicators[0].value = total
    indicators[1].value = draft
    indicators[2].value = process
    indicators[3].value = final
  } else {
    indicators[0].value = 10
    indicators[1].value = 1
    indicators[2].value = 2
    indicators[3].value = 2
  }

  const hero = role === 'gkmf' ? heroTemplateGkmf : heroTemplateOtherRole

  return {
    context: resolveContext(context),
    role,
    hero: {
      ...hero,
      bulletPoints: [...hero.bulletPoints],
    },
    indicatorTitle: 'Capaian Indikator',
    indicators,
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
      { value: 'teknik-informatika', label: 'TIF' },
      { value: 'teknik-sipil', label: 'Sipil' },
      { value: 'teknik-mesin', label: 'Mesin' },
      { value: 'manajemen', label: 'Manajemen' },
      { value: 'akuntansi', label: 'Akuntansi' },
      { value: 'hukum', label: 'Hukum' },
    ],
    rows,
  }
}

export function buildFm7DetailFromRecord(
  context: Partial<Fm7DashboardContext>,
  record: Fm7ReportRecord,
  role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
): Fm7ReportDetailDummyData {
  const roleAction = resolveFm7RoleAction(role)
  const roleActor = roleActorMap[role]

  return {
    context: resolveContext(context),
    role,
    roleLabel: roleAction.roleLabel,
    id: record.id,
    kodeLaporan: record.kodeLaporan,
    programStudi: record.programStudi,
    fakultas: record.fakultas,
    semester: record.semester,
    tahunAkademik: record.tahunAkademik,
    workflowStatus: record.workflowStatus,
    workflowLabel: resolveFm7WorkflowLabel(record.workflowStatus),
    canEditNarrative: role === 'gkmf' && record.workflowStatus === 'draft',
    canPerformRoleAction: isFm7RoleActionAllowed(role, record.workflowStatus),
    roleActionLabel: roleAction.actionLabel,
    roleActionTone: roleAction.tone,
    roleActionFromStatus: roleAction.fromStatus,
    roleActionToStatus: roleAction.toStatus,
    createdByName: roleActor.name,
    createdByNip: roleActor.nip,
    roleAccessTitle: `Akses Role: ${roleAction.roleLabel}`,
    roleAccessDescription: roleAccessDescriptionMap[role],
    documentTitle: 'LAPORAN MONITORING DAN EVALUASI',
    coverMetaFields: [
      { label: 'No Dokumen', value: 'SPM/UMC/SMPEN.04.40' },
      { label: 'No Revisi', value: '00' },
      { label: 'Tgl berlaku', value: '1 September 2025' },
      { label: 'Halaman', value: '18' },
    ],
    pengesahanMetaFields: [
      { label: 'Kode Dokumen', value: ': SPM/UMC/SMPEN.04.40' },
      { label: 'Nama Dokumen', value: ': FM.07 Laporan Monitoring dan Evaluasi' },
      { label: 'Nomor Revisi', value: ': 00' },
      { label: 'Tanggal', value: ': 4 April 2026' },
      { label: 'Jumlah Halaman', value: ': 18' },
    ],
    signatureRows: signatureRowsTemplate.map((row) => ({ ...row })),
    daftarIsiRows: daftarIsiTemplate.map((row) => ({ ...row })),
    bab1Heading: 'BAB 1\nPENDAHULUAN',
    bab2Heading: 'BAB 2\nHASIL MONEV',
    bab3Heading: 'BAB 3\nRENCANA TINDAK LANJUT',
    bab4Heading: 'BAB 4\nSIMPULAN DAN REKOMENDASI',
    narrative: cloneFm7Narrative(record.narasi),
    monitoringRows: monitoringRowsTemplate.map((row) => ({ ...row })),
    evaluationRows: evaluationRowsTemplate.map((row) => ({ ...row })),
    surveyRows: surveyRowsTemplate.map((row) => ({ ...row })),
    findingRows: findingRowsTemplate.map((row) => ({ ...row })),
    riskRows: riskRowsTemplate.map((row) => ({ ...row })),
    progressTitle: 'Progres Alur Dokumen',
    progressSteps: progressStepsTemplate.map((step) => ({ ...step })),
  }
}
