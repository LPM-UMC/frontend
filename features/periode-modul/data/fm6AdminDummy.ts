export type Fm6AdminRole = 'admin_lpm_spi' | 'ketua_lpm_spi'

export interface Fm6DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm6HeroData {
  title: string
  description: string
  createButtonLabel: string
}

export interface Fm6IndicatorCard {
  id: string
  title: string
  value: string
  subtitle: string
  progressPercent: number
}

export interface Fm6SurveyRow {
  id: string
  namaSurvei: string
  programStudiId: string
  programStudi: string
  tanggalDibuat: string
  respondenLabel: string
}

export interface Fm6FilterOption {
  value: string
  label: string
}

export interface Fm6DashboardDummyData {
  context: Fm6DashboardContext
  role: Fm6AdminRole
  hero: Fm6HeroData
  indicatorTitle: string
  indicators: Fm6IndicatorCard[]
  tableTitle: string
  searchPlaceholder: string
  dateFilterOptions: Fm6FilterOption[]
  programFilterOptions: Fm6FilterOption[]
  rows: Fm6SurveyRow[]
}

export type Fm6QuestionType = 'multiple_choice' | 'essay'

export interface Fm6CreateChoiceOption {
  id: string
  label: string
  weight: number
}

export interface Fm6CreateQuestionBlock {
  id: string
  order: number
  title: string
  type: Fm6QuestionType
  aspectId: string
  essayPlaceholder?: string
  options: Fm6CreateChoiceOption[]
}

export interface Fm6CreateHeaderCard {
  title: string
  description: string
}

export interface Fm6CreateTemplateForm {
  pageTitle: string
  formTitle: string
  surveyTitleLabel: string
  surveyTitlePlaceholder: string
  programStudiLabel: string
  programStudiPlaceholder: string
  deskripsiLabel: string
  deskripsiPlaceholder: string
  maxLengthHint: string
  warningLabel: string
  warningMessage: string
  lastSavedAt: string
  addQuestionLabel: string
  submitLabel: string
  questionTitlePrefix: string
  questionLabel: string
  questionPlaceholder: string
  questionTypeLabel: string
  aspectLabel: string
  answerOptionLabel: string
  essayAnswerLabel: string
  essayAnswerPlaceholder: string
}

export interface Fm6ProgramStudiOption {
  id: string
  label: string
}

export interface Fm6AspectOption {
  id: string
  label: string
}

export interface Fm6QuestionTypeOption {
  value: Fm6QuestionType
  label: string
}

export interface Fm6CreatePageDummyData {
  context: Fm6DashboardContext
  role: Fm6AdminRole
  introCard: Fm6CreateHeaderCard
  showBuilder: boolean
  templateForm: Fm6CreateTemplateForm
  programStudiOptions: Fm6ProgramStudiOption[]
  aspectOptions: Fm6AspectOption[]
  questionTypeOptions: Fm6QuestionTypeOption[]
  defaultSurveyTitle: string
  defaultProgramStudiId: string
  defaultDescription: string
  questions: Fm6CreateQuestionBlock[]
}

export interface Fm6DetailHeaderCard {
  title: string
  description: string
}

export interface Fm6ChartBarItem {
  id: string
  label: string
  value: number
  tone: 'soft' | 'medium' | 'strong' | 'stronger'
}

export interface Fm6ChartSection {
  id: string
  title: string
  bars: Fm6ChartBarItem[]
}

export interface Fm6DetailAnalyticsData {
  indicatorTitle: string
  indicators: Fm6IndicatorCard[]
  chartTitle: string
  chartSections: Fm6ChartSection[]
  axisLabels: number[]
  maxScale: number
}

export interface Fm6DetailDummyData {
  context: Fm6DashboardContext
  role: Fm6AdminRole
  detailId: string
  headerCard: Fm6DetailHeaderCard
  showAnalytics: boolean
  analytics?: Fm6DetailAnalyticsData
}

export interface Fm6CreateTemplatePayload {
  surveyTitle: string
  programStudiId: string
  description: string
  questions: Array<{
    order: number
    question: string
    type: Fm6QuestionType
    aspectId: string
    choices?: Array<{ label: string; weight: number }>
    essayPlaceholder?: string
  }>
}

export interface Fm6CreateTemplateResult {
  id: string
}

export const FM6_ACTIVE_DUMMY_ROLE: Fm6AdminRole = 'admin_lpm_spi'

export const FM6_CREATE_PAGE_MODE: 'intro' | 'builder' = 'builder'

const headerCardCreateTemplate: Fm6CreateHeaderCard = {
  title: 'Survei Baru',
  description:
    'Halaman ini digunakan untuk membuat template survei, menambahkan pertanyaan atau indikator, serta mengatur bobot penilaian untuk setiap jawaban.',
}

const dashboardHeroTemplate: Fm6HeroData = {
  title: 'Form Survei 06',
  description:
    'Halaman ini digunakan untuk mengelola dan memantau pelaksanaan survei, termasuk jumlah responden, tingkat partisipasi, serta hasil capaian indikator.',
  createButtonLabel: 'Buat Survei Baru',
}

const dashboardIndicatorsTemplate: Fm6IndicatorCard[] = [
  {
    id: 'total-survey-aktif',
    title: 'Total Survei Aktif',
    value: '10',
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'total-responden',
    title: 'Total Responden',
    value: '1.250',
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'total-partisipasi',
    title: 'Total Partisipasi',
    value: '77%',
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
  {
    id: 'total-skor',
    title: 'Total Skor Rata-rata',
    value: '4.3/5',
    subtitle: 'Skor Aspek',
    progressPercent: 14,
  },
]

const surveyRowsTemplate: Fm6SurveyRow[] = [
  {
    id: 'fm6-survey-001',
    namaSurvei: 'Fasilitas LAB',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    tanggalDibuat: '2025-08-01',
    respondenLabel: '250/285',
  },
  {
    id: 'fm6-survey-002',
    namaSurvei: 'Loremipsun',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    tanggalDibuat: '2025-08-01',
    respondenLabel: '250/285',
  },
  {
    id: 'fm6-survey-003',
    namaSurvei: 'Loremipsun',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    tanggalDibuat: '2025-08-01',
    respondenLabel: '250/285',
  },
  {
    id: 'fm6-survey-004',
    namaSurvei: 'Loremipsun',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    tanggalDibuat: '2025-08-01',
    respondenLabel: '250/285',
  },
  {
    id: 'fm6-survey-005',
    namaSurvei: 'Loremipsun',
    programStudiId: 'tif',
    programStudi: 'Teknik Informatika',
    tanggalDibuat: '2025-08-01',
    respondenLabel: '250/285',
  },
  {
    id: 'fm6-survey-006',
    namaSurvei: 'Kualitas Dosen',
    programStudiId: 'ti',
    programStudi: 'Teknik Industri',
    tanggalDibuat: '2025-08-02',
    respondenLabel: '150/200',
  },
  {
    id: 'fm6-survey-007',
    namaSurvei: 'Evaluasi RPS',
    programStudiId: 'peternakan',
    programStudi: 'Peternakan',
    tanggalDibuat: '2025-08-02',
    respondenLabel: '120/180',
  },
  {
    id: 'fm6-survey-008',
    namaSurvei: 'Kesiapan Praktikum',
    programStudiId: 'hukum',
    programStudi: 'Hukum',
    tanggalDibuat: '2025-08-03',
    respondenLabel: '170/210',
  },
  {
    id: 'fm6-survey-009',
    namaSurvei: 'Efektivitas Metode',
    programStudiId: 'si',
    programStudi: 'Sistem Informasi',
    tanggalDibuat: '2025-08-03',
    respondenLabel: '140/180',
  },
  {
    id: 'fm6-survey-010',
    namaSurvei: 'Kepuasan Akademik',
    programStudiId: 'manajemen',
    programStudi: 'Manajemen',
    tanggalDibuat: '2025-08-03',
    respondenLabel: '160/220',
  },
]

const createTemplateForm: Fm6CreateTemplateForm = {
  pageTitle: 'Buat Template Survei Baru',
  formTitle: 'Form Template Survei Baru',
  surveyTitleLabel: 'Judul Survei',
  surveyTitlePlaceholder: 'Contoh : Evaluasi Pembelajaran Semester Genap 2025/2026',
  programStudiLabel: 'Program Studi',
  programStudiPlaceholder: 'Program Studi',
  deskripsiLabel: 'Deskripsi',
  deskripsiPlaceholder: 'Jelaskan Mengenai Survei Ini',
  maxLengthHint: 'Maks. 100 karakter. Gunakan format konsisten.',
  warningLabel: 'Catatan',
  warningMessage: 'Lorem Ipsun',
  lastSavedAt: 'Terakhir disimpan: 15 Feb 2026, 14:30',
  addQuestionLabel: '+ Tambah Pertanyaan Baru',
  submitLabel: 'Konfirmasi Pertanyaan',
  questionTitlePrefix: 'Pertanyaan',
  questionLabel: 'Pertanyaan',
  questionPlaceholder: 'Masukkan pertanyaan...',
  questionTypeLabel: 'Tipe Pertanyaan',
  aspectLabel: 'Tipe Aspek',
  answerOptionLabel: 'Pilih Jawaban',
  essayAnswerLabel: 'Area Jawab Esai',
  essayAnswerPlaceholder: 'Kolom ini merupakan bagian dari area untuk menjawab pertanyaan Esai',
}

const chartBarsTemplate: Fm6ChartBarItem[] = [
  { id: 'kurang-baik', label: 'Kurang Baik', value: 25, tone: 'soft' },
  { id: 'cukup-baik', label: 'Cukup Baik', value: 35, tone: 'medium' },
  { id: 'baik', label: 'Baik', value: 55, tone: 'strong' },
  { id: 'sangat-baik', label: 'Sangat Baik', value: 50, tone: 'stronger' },
]

const detailAnalyticsTemplate: Fm6DetailAnalyticsData = {
  indicatorTitle: 'Capaian Indikator',
  indicators: [
    {
      id: 'kepuasan',
      title: 'Rata-rata Kepuasan',
      value: '4.3/5',
      subtitle: 'Skor Aspek',
      progressPercent: 14,
    },
    {
      id: 'responden',
      title: 'Total Responden',
      value: '115/150',
      subtitle: 'Skor Aspek',
      progressPercent: 14,
    },
    {
      id: 'partisipasi',
      title: 'Tingkat Partisipasi',
      value: '77%',
      subtitle: 'Skor Aspek',
      progressPercent: 14,
    },
  ],
  chartTitle: 'Grafik Hasil Survei',
  chartSections: [
    {
      id: 'kualitas-materi',
      title: 'Kualitas Materi Pembelajaran',
      bars: chartBarsTemplate.map((item) => ({ ...item })),
    },
    {
      id: 'ketepatan-waktu',
      title: 'Ketetapan Waktu Dosen',
      bars: chartBarsTemplate.map((item) => ({ ...item })),
    },
    {
      id: 'efektivitas-metode',
      title: 'Efektifitas Metode Pembelajaran',
      bars: chartBarsTemplate.map((item) => ({ ...item })),
    },
  ],
  axisLabels: [0, 10, 20, 30, 40, 50, 60],
  maxScale: 70,
}

const detailHeaderTemplate: Fm6DetailHeaderCard = {
  title: 'Analitik Survei',
  description:
    'Halaman ini menyajikan hasil analisis survei, meliputi rata-rata kepuasan, jumlah responden, tingkat partisipasi, serta distribusi penilaian pada setiap indikator.',
}

function resolveContext(context: Partial<Fm6DashboardContext>): Fm6DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

const filledDetailIds = new Set(['fm6-survey-001', 'fm6-survey-004'])

export function getFm6DashboardDummyData(
  context: Partial<Fm6DashboardContext> = {},
  role: Fm6AdminRole = FM6_ACTIVE_DUMMY_ROLE
): Fm6DashboardDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    role,
    hero: { ...dashboardHeroTemplate },
    indicatorTitle: 'Capaian Indikator',
    indicators: dashboardIndicatorsTemplate.map((item) => ({ ...item })),
    tableTitle: 'Daftar Survei',
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
      { value: 'si', label: 'SI' },
      { value: 'manajemen', label: 'Manajemen' },
    ],
    rows: surveyRowsTemplate.map((item) => ({ ...item })),
  }
}

export function getFm6CreatePageDummyData(
  context: Partial<Fm6DashboardContext> = {},
  role: Fm6AdminRole = FM6_ACTIVE_DUMMY_ROLE
): Fm6CreatePageDummyData {
  const resolvedContext = resolveContext(context)

  return {
    context: resolvedContext,
    role,
    introCard: { ...headerCardCreateTemplate },
    showBuilder: FM6_CREATE_PAGE_MODE === 'builder',
    templateForm: { ...createTemplateForm },
    programStudiOptions: [
      { id: 'tif', label: 'Teknik Informatika' },
      { id: 'ti', label: 'Teknik Industri' },
      { id: 'peternakan', label: 'Peternakan' },
      { id: 'hukum', label: 'Hukum' },
    ],
    aspectOptions: [
      { id: 'media-sumber', label: 'Media & Sumber Belajar' },
      { id: 'kesiapan-rps', label: 'Kesiapan RPS' },
      { id: 'ketepatan-waktu', label: 'Ketetapan Waktu Dosen' },
      { id: 'efektivitas-metode', label: 'Efektivitas Metode Pembelajaran' },
    ],
    questionTypeOptions: [
      { value: 'multiple_choice', label: 'Pilihan Ganda' },
      { value: 'essay', label: 'Pilihan Esai' },
    ],
    defaultSurveyTitle: '',
    defaultProgramStudiId: '',
    defaultDescription: '',
    questions: [
      {
        id: 'fm6-question-1',
        order: 1,
        title: '',
        type: 'multiple_choice',
        aspectId: 'media-sumber',
        options: [
          { id: 'q1-o1', label: 'Sangat Tidak Setuju', weight: 1 },
          { id: 'q1-o2', label: 'Tidak Setuju', weight: 2 },
          { id: 'q1-o3', label: 'Setuju', weight: 3 },
          { id: 'q1-o4', label: 'Sangat Setuju', weight: 4 },
        ],
      },
      {
        id: 'fm6-question-2',
        order: 2,
        title: '',
        type: 'essay',
        aspectId: 'kesiapan-rps',
        essayPlaceholder: 'Kolom ini merupakan bagian dari area untuk menjawab pertanyaan Esai',
        options: [],
      },
    ],
  }
}

export function getFm6DetailDummyData(
  params: {
    context?: Partial<Fm6DashboardContext>
    detailId?: string
    role?: Fm6AdminRole
  } = {}
): Fm6DetailDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const detailId = params.detailId ?? 'fm6-survey-001'
  const role = params.role ?? FM6_ACTIVE_DUMMY_ROLE
  const hasAnalytics = filledDetailIds.has(detailId)

  return {
    context: resolvedContext,
    role,
    detailId,
    headerCard: { ...detailHeaderTemplate },
    showAnalytics: hasAnalytics,
    analytics: hasAnalytics
      ? {
          ...detailAnalyticsTemplate,
          indicators: detailAnalyticsTemplate.indicators.map((item) => ({ ...item })),
          chartSections: detailAnalyticsTemplate.chartSections.map((section) => ({
            ...section,
            bars: section.bars.map((bar) => ({ ...bar })),
          })),
          axisLabels: [...detailAnalyticsTemplate.axisLabels],
        }
      : undefined,
  }
}
