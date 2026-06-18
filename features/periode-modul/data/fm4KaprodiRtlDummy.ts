import {
  resolveFm4RpnCategory,
  type Fm4DashboardContext,
  type Fm4RpnLevel,
} from './fm4GkmfDummy'

export interface Fm4KaprodiFmeaGuideItem {
  title: string
  description: string
}

export interface Fm4KaprodiCreateRtlDummyData {
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
  rtlFormTitle: string
  picNameLabel: string
  picNameHelp: string
  picEmailLabel: string
  picEmailHelp: string
  targetDateLabel: string
  rtlLabel: string
  rtlHelp: string
  notePrefix: string
  noteText: string
  lastSavedText: string
  cancelLabel: string
  saveLabel: string
  fmeaGuideTitle: string
  guideItems: Fm4KaprodiFmeaGuideItem[]
  riskLegendTitle: string
  defaultValues: {
    impact: string
    cause: string
    severity: number
    occurrence: number
    detection: number
    picName: string
    picEmail: string
    targetDate: string
    rtlPlan: string
  }
}

export interface Fm4KaprodiProgressStatusOption {
  value: string
  label: string
}

export interface Fm4KaprodiProgressEditDummyData {
  context: Fm4DashboardContext
  id: string
  headerTitle: string
  headerDescription: string
  findingTitle: string
  findingDescription: string
  summaryText: string
  rpnLabel: string
  picLabel: string
  picValue: string
  rtlLabel: string
  rtlValue: string
  targetLabel: string
  targetValue: string
  sectionTitle: string
  formTitle: string
  statusLabel: string
  completionLabel: string
  completionHelp: string
  realizationDateLabel: string
  realizationTimeLabel: string
  resultLabel: string
  resultHelp: string
  evidenceLabel: string
  evidenceHint: string
  notesLabel: string
  notesHelp: string
  warningPrefix: string
  warningText: string
  lastSavedText: string
  cancelLabel: string
  saveLabel: string
  statusOptions: Fm4KaprodiProgressStatusOption[]
  defaultValues: {
    status: string
    completionPercent: number
    realizationDate: string
    realizationTime: string
    result: string
    evidenceLink: string
    notes: string
  }
}

export interface Fm4KaprodiProgressIndicatorCard {
  id: string
  title: string
  value: number
  subtitle: string
  progressPercent: number
}

export interface Fm4KaprodiProgressHistoryItem {
  id: string
  progressLabel: string
  statusLabel: string
  tone: 'blue' | 'yellow' | 'green'
  executedLabel: string
  executedAt: string
  submittedLabel: string
  submittedAt: string
  resultLabel: string
  resultValue: string
  evidenceLabel: string
  evidenceText: string
  notesLabel: string
  notesValue: string
}

export interface Fm4KaprodiProgressDetailDummyData {
  context: Fm4DashboardContext
  id: string
  headerTitle: string
  headerDescription: string
  summaryText: string
  indicatorTitle: string
  indicators: Fm4KaprodiProgressIndicatorCard[]
  analysisCardTitle: string
  rpnCategoryLabel: string
  rpnCategoryValue: string
  rpnValueLabel: string
  rpnValue: number
  findingTitle: string
  findingDescription: string
  rtlTitle: string
  rtlDescription: string
  picLabel: string
  picValue: string
  targetLabel: string
  targetValue: string
  sideTagLabel: string
  impactLabel: string
  impactValue: string
  causeLabel: string
  causeValue: string
  historyTitle: string
  historyItems: Fm4KaprodiProgressHistoryItem[]
}

export interface Fm4KaprodiProgressToneMeta {
  containerClass: string
  statusClass: string
  dotClass: string
  lineClass: string
}

const progressToneMetaMap: Record<Fm4KaprodiProgressHistoryItem['tone'], Fm4KaprodiProgressToneMeta> = {
  blue: {
    containerClass: 'bg-[#dce8f8]',
    statusClass: 'text-[#2e6ce6]',
    dotClass: 'bg-[#2f7ff0]',
    lineClass: 'bg-[#d9dee6]',
  },
  yellow: {
    containerClass: 'bg-[#f3efdf]',
    statusClass: 'text-[#e48a00]',
    dotClass: 'bg-[#f59f0b]',
    lineClass: 'bg-[#d9dee6]',
  },
  green: {
    containerClass: 'bg-[#d7e9e2]',
    statusClass: 'text-[#14a36f]',
    dotClass: 'bg-[#10b981]',
    lineClass: 'bg-[#d9dee6]',
  },
}

const createTemplate: Fm4KaprodiCreateRtlDummyData = {
  context: {
    periodeModulId: 'pm-2026-genap',
    unitId: 'unit-tif',
  },
  id: 'temuan-rtl-001',
  headerTitle: 'Penyusunan Buat RTL',
  headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  deadlineLabel: 'Deadline',
  deadlineValue: '01 Maret 2026',
  formTitle: 'Form Penyusunan Buat RTL',
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
  rtlFormTitle: 'Form Buat Rencana Tindak Lanjut',
  picNameLabel: 'Nama PIC',
  picNameHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  picEmailLabel: 'Email PIC',
  picEmailHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  targetDateLabel: 'Target Waktu',
  rtlLabel: 'Rencana Tindak Lanjut',
  rtlHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  notePrefix: 'Catatan:',
  noteText: 'Loremipsun',
  lastSavedText: 'Terakhir disimpan: 15 Feb 2026, 14:30',
  cancelLabel: 'Batal',
  saveLabel: 'Simpan',
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
  defaultValues: {
    impact: 'Ditemukan bahwa 30% mata kuliah pada semester ganjil tidak menyampaikan materi pertemuan ke-5 hingga ke-7 sesuai dengan RPS yang telah disepakati. Hal ini menyebabkan capaian pembelajaran lulusan tidak tercapai secara maksimal.',
    cause: 'Lorem ipsum dolor sit amet consectetur. Quis consequat a quisque tempus tincidunt sed placerat curabitur. Mi rhoncus potenti malesuada velit nam hac dignissim. Cras facilisi nisi amet ac sit fermentum mi molestie. Integer elementum elit tempus.',
    severity: 5,
    occurrence: 5,
    detection: 5,
    picName: '',
    picEmail: '',
    targetDate: '',
    rtlPlan: '',
  },
}

const progressEditTemplate: Fm4KaprodiProgressEditDummyData = {
  context: {
    periodeModulId: 'pm-2026-genap',
    unitId: 'unit-tif',
  },
  id: 'rtl-progres-001',
  headerTitle: 'Ubah Progres RTL',
  headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  findingTitle: 'Judul Temuan',
  findingDescription: 'Deskripsi Temuan',
  summaryText: '10 Temuan',
  rpnLabel: 'RPN Sedang',
  picLabel: 'PIC',
  picValue: 'Fulan Bin Fulan, M.Kom',
  rtlLabel: 'Rencana Tindak Lanjut',
  rtlValue: 'Melakukan refactor sistem monitoring dan menambahkan validasi input.',
  targetLabel: 'Target Waktu',
  targetValue: '01 Maret 2026',
  sectionTitle: 'Buat Penyelesaian',
  formTitle: 'Form Penyelesaian',
  statusLabel: 'Status',
  completionLabel: 'Presentase Penyelesaian',
  completionHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  realizationDateLabel: 'Tanggal Realisasi',
  realizationTimeLabel: 'Waktu Realisasi',
  resultLabel: 'Hasil Pelaksanaan',
  resultHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  evidenceLabel: 'Link Bukti Pendukung',
  evidenceHint: 'Lihat Format Bukti Disini',
  notesLabel: 'Catatan Tambahan',
  notesHelp: 'Maks. 100 karakter. Gunakan format konsisten.',
  warningPrefix: 'Catatan:',
  warningText: 'Lorem Ipsun',
  lastSavedText: 'Terakhir disimpan: 15 Feb 2026, 14:30',
  cancelLabel: 'Batal',
  saveLabel: 'Buat Progres',
  statusOptions: [
    { value: 'in_progress', label: 'Dalam Proses' },
    { value: 'almost_done', label: 'Hampir Selesai' },
    { value: 'done', label: 'Selesai' },
  ],
  defaultValues: {
    status: 'in_progress',
    completionPercent: 100,
    realizationDate: '',
    realizationTime: '',
    result: '',
    evidenceLink: 'https://drive.google.com/drive/folders/1UB-hyfGDCGupa1vSI8zi4YeB-qiUUTf',
    notes: '',
  },
}

const progressDetailTemplate: Fm4KaprodiProgressDetailDummyData = {
  context: {
    periodeModulId: 'pm-2026-genap',
    unitId: 'unit-tif',
  },
  id: 'rtl-progres-001',
  headerTitle: 'Detail RTL',
  headerDescription: 'Lorem ipsum dolor sit amet consectetur. Vel pulvinar ullamcorper consectetur eget. Ullamcorper pellentesque amet semper turpis ornare viverra porta augue sapien. Nunc odio nibh amet mauris. Placerat arcu ornare id nullam phasellus tellus nam.',
  summaryText: '10 Temuan',
  indicatorTitle: 'Capaian Indikator',
  indicators: [
    { id: 'severity', title: 'Severity', value: 6, subtitle: 'Skor Aspek', progressPercent: 18 },
    { id: 'occurrence', title: 'Occurrence', value: 5, subtitle: 'Skor Aspek', progressPercent: 18 },
    { id: 'detection', title: 'Detection', value: 4, subtitle: 'Skor Aspek', progressPercent: 18 },
  ],
  analysisCardTitle: 'Form Template Analisis',
  rpnCategoryLabel: 'Kategori (RPN)',
  rpnCategoryValue: 'Sedang',
  rpnValueLabel: 'Nilai (RPN)',
  rpnValue: 125,
  findingTitle: 'Ini Judul Temuan',
  findingDescription: 'Lorem ipsum dolor sit amet consectetur. Risus facilisis eu velit consequat. Venenatis enim ullamcorper ut nibh est. Tellus enim ac eu bibendum morbi aliquam sed. Lorem elit in iaculis congue maecenas mauris.',
  rtlTitle: 'Rencana Tindak Lanjut',
  rtlDescription: 'Lorem ipsum dolor sit amet consectetur. Risus facilisis eu velit consequat. Venenatis enim ullamcorper ut nibh est. Tellus enim ac eu bibendum morbi aliquam sed. Lorem elit in iaculis congue maecenas mauris.',
  picLabel: 'PIC',
  picValue: 'Ahmad Fauzi - ahmadfauzi@umc.ac.id',
  targetLabel: 'Target Waktu',
  targetValue: '01 Maret 2026',
  sideTagLabel: 'LOREMIPSUN',
  impactLabel: 'Dampak',
  impactValue: 'Kualitas Data Menurun',
  causeLabel: 'Penyebab',
  causeValue: 'Tidak Ada Validasi Input',
  historyTitle: 'Riwayat Progres RTL',
  historyItems: [
    {
      id: 'hist-1',
      progressLabel: 'Progress 30%',
      statusLabel: 'Dalam Proses',
      tone: 'blue',
      executedLabel: 'Waktu Dilaksanakan',
      executedAt: '10 Feb 2026',
      submittedLabel: 'Waktu Disubmit',
      submittedAt: '11 Feb 2026',
      resultLabel: 'Hasil Pelaksanaan',
      resultValue: 'Menambahkan validasi pada sebagian form input',
      evidenceLabel: 'Bukti',
      evidenceText: 'Lihat Dokumen',
      notesLabel: 'Catatan',
      notesValue: 'Masih perlu perbaikan pada modul laporan',
    },
    {
      id: 'hist-2',
      progressLabel: 'Progress 70%',
      statusLabel: 'Hampir Selesai',
      tone: 'yellow',
      executedLabel: 'Waktu Dilaksanakan',
      executedAt: '20 Feb 2026',
      submittedLabel: 'Waktu Disubmit',
      submittedAt: '21 Feb 2026',
      resultLabel: 'Hasil Pelaksanaan',
      resultValue: 'Validasi selesai dan sistem sudah diuji sebagian',
      evidenceLabel: 'Bukti',
      evidenceText: 'Lihat Dokumen',
      notesLabel: 'Catatan',
      notesValue: 'Menunggu approval QA',
    },
    {
      id: 'hist-3',
      progressLabel: 'Progress 100%',
      statusLabel: 'Selesai',
      tone: 'green',
      executedLabel: 'Waktu Dilaksanakan',
      executedAt: '01 Mar 2026',
      submittedLabel: 'Waktu Disubmit',
      submittedAt: '01 Mar 2026',
      resultLabel: 'Hasil Pelaksanaan',
      resultValue: 'Seluruh validasi berhasil diterapkan dan sistem stabil',
      evidenceLabel: 'Bukti',
      evidenceText: 'Lihat Dokumen',
      notesLabel: 'Catatan',
      notesValue: 'Sudah siap digunakan',
    },
  ],
}

function resolveContext(context: Partial<Fm4DashboardContext>): Fm4DashboardContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

export function resolveFm4KaprodiProgressToneMeta(
  tone: Fm4KaprodiProgressHistoryItem['tone']
): Fm4KaprodiProgressToneMeta {
  return progressToneMetaMap[tone]
}

export function getFm4KaprodiCreateRtlDummyData(
  params: { context?: Partial<Fm4DashboardContext>; temuanId?: string } = {}
): Fm4KaprodiCreateRtlDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosenId = params.temuanId ?? createTemplate.id

  return {
    ...createTemplate,
    context: resolvedContext,
    id: chosenId,
    guideItems: createTemplate.guideItems.map((item) => ({ ...item })),
    defaultValues: { ...createTemplate.defaultValues },
  }
}

export function getFm4KaprodiProgressEditDummyData(
  params: { context?: Partial<Fm4DashboardContext>; rtlId?: string } = {}
): Fm4KaprodiProgressEditDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosenId = params.rtlId ?? progressEditTemplate.id

  return {
    ...progressEditTemplate,
    context: resolvedContext,
    id: chosenId,
    statusOptions: progressEditTemplate.statusOptions.map((item) => ({ ...item })),
    defaultValues: { ...progressEditTemplate.defaultValues },
  }
}

export function getFm4KaprodiProgressDetailDummyData(
  params: { context?: Partial<Fm4DashboardContext>; rtlId?: string } = {}
): Fm4KaprodiProgressDetailDummyData {
  const resolvedContext = resolveContext(params.context ?? {})
  const chosenId = params.rtlId ?? progressDetailTemplate.id

  return {
    ...progressDetailTemplate,
    context: resolvedContext,
    id: chosenId,
    indicators: progressDetailTemplate.indicators.map((item) => ({ ...item })),
    historyItems: progressDetailTemplate.historyItems.map((item) => ({ ...item })),
  }
}

export function resolveFm4KaprodiRpnLevelFromScore(
  severity: number,
  occurrence: number,
  detection: number
): Fm4RpnLevel {
  const rpnValue = severity * occurrence * detection
  return resolveFm4RpnCategory(rpnValue)
}
