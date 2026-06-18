export type Fm2PerformanceBandId = 'excellent' | 'good' | 'fair' | 'poor'

export type Fm2ScoreFilterValue = 'lt50' | '50to75' | '75to90' | '90to100'

export interface Fm2BandLegendItem {
  id: Fm2PerformanceBandId
  rangeLabel: string
  label: string
  dotColor: string
  barColor: string
  textColor: string
}

export interface Fm2HeroData {
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

export interface Fm2IndicatorSummaryCard {
  id: string
  title: string
  score: number
  subtitle: string
  progressPercent: number
}

export interface Fm2RadarAxis {
  id: string
  label: string
  value: number
}

export interface Fm2ChartData {
  totalScore: number
  maxScore: number
  readinessPercentage: number
  readinessCategory: string
  radarAxes: Fm2RadarAxis[]
}

export interface Fm2AspekTableRow {
  id: string
  aspectTitle: string
  aspectDescription: string
  aspectCategoryCode: string
  aspectCategoryLabel: string
  facultyCode: string
  facultyLabel: string
  studyProgramCode: string
  studyProgramLabel: string
  totalCourses: number
  totalLecturers: number
  achievement: number
  note: string
}

export interface Fm2DashboardContext {
  periodeModulId: string
  unitId: string
}

export interface Fm2DashboardDummyData {
  context: Fm2DashboardContext
  hero: Fm2HeroData
  indicatorSummary: Fm2IndicatorSummaryCard[]
  chart: Fm2ChartData
  legend: Fm2BandLegendItem[]
  tableRows: Fm2AspekTableRow[]
}

const fm2LegendByBand: Record<Fm2PerformanceBandId, Fm2BandLegendItem> = {
  excellent: {
    id: 'excellent',
    rangeLabel: '90 - 100%',
    label: 'Sangat Baik',
    dotColor: '#148c42',
    barColor: '#46d279',
    textColor: '#16a34a',
  },
  good: {
    id: 'good',
    rangeLabel: '75 - 90%',
    label: 'Baik',
    dotColor: '#1590d0',
    barColor: '#38b6ef',
    textColor: '#178ad4',
  },
  fair: {
    id: 'fair',
    rangeLabel: '50 - 75%',
    label: 'Cukup Baik',
    dotColor: '#e7b208',
    barColor: '#f2b91b',
    textColor: '#d4871b',
  },
  poor: {
    id: 'poor',
    rangeLabel: '0 - 50%',
    label: 'Kurang Baik',
    dotColor: '#e10000',
    barColor: '#ef4a3a',
    textColor: '#ef3e2f',
  },
}

export const FM2_BAND_LEGEND: Fm2BandLegendItem[] = [
  { ...fm2LegendByBand.excellent },
  { ...fm2LegendByBand.good },
  { ...fm2LegendByBand.fair },
  { ...fm2LegendByBand.poor },
]

export const FM2_SCORE_FILTER_OPTIONS: Array<{ value: Fm2ScoreFilterValue; label: string }> = [
  { value: 'lt50', label: '< 50%' },
  { value: '50to75', label: '50 - 75%' },
  { value: '75to90', label: '75 - 90%' },
  { value: '90to100', label: '90 - 100%' },
]

const fm2IndicatorSummary: Fm2IndicatorSummaryCard[] = [
  {
    id: 'indicator-sangat-baik',
    title: 'Aspek Sangat Baik',
    score: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 20,
  },
  {
    id: 'indicator-baik',
    title: 'Aspek Baik',
    score: 3,
    subtitle: 'Skor Aspek',
    progressPercent: 30,
  },
  {
    id: 'indicator-cukup-baik',
    title: 'Aspek Cukup Baik',
    score: 2,
    subtitle: 'Skor Aspek',
    progressPercent: 20,
  },
  {
    id: 'indicator-kurang-baik',
    title: 'Aspek Kurang Baik',
    score: 3,
    subtitle: 'Skor Aspek',
    progressPercent: 30,
  },
]

const fm2RadarAxes: Fm2RadarAxis[] = [
  { id: 'kesiapan-rps', label: 'Kesiapan RPS', value: 65 },
  { id: 'konvergensi', label: 'Konvergensi', value: 82 },
  { id: 'bukti-deskripsi', label: 'Bukti Deskripsi', value: 60 },
  { id: 'validasi-rps', label: 'Validasi RPS', value: 92 },
  { id: 'keterampilan', label: 'Keterampilan', value: 58 },
  { id: 'profil-aks', label: 'Profil AKS', value: 84 },
]

const fm2TableRowsTemplate: Fm2AspekTableRow[] = [
  {
    id: 'kesiapan-rps',
    aspectTitle: 'Kesiapan RPS',
    aspectDescription:
      'Jumlah mata kuliah yang dibuka pada semester Ganjil/Genap. Jumlah mata kuliah yang telah dilengkapi RPS dan sudah divalidasi Kaprodi.',
    aspectCategoryCode: 'perencanaan',
    aspectCategoryLabel: 'Perencanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 20,
    note: 'Loremipsun',
  },
  {
    id: 'perangkat-asesmen-rubrik',
    aspectTitle: 'Perangkat Asesmen & Rubrik',
    aspectDescription:
      'Jumlah mata kuliah yang telah dilengkapi perangkat penilaian (rubrik, bobot nilai, dan instrumen asesmen) telah disiapkan dan sesuai dengan CPL.',
    aspectCategoryCode: 'perencanaan',
    aspectCategoryLabel: 'Perencanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 100,
    note: 'Loremipsun',
  },
  {
    id: 'media-sumber-belajar',
    aspectTitle: 'Media dan Sumber Belajar',
    aspectDescription:
      'Jumlah mata kuliah yang telah dilengkapi media pembelajaran seperti PPT, video, e-learning, dan AI tools telah disiapkan secara lengkap dan relevan.',
    aspectCategoryCode: 'perencanaan',
    aspectCategoryLabel: 'Perencanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 85,
    note: 'Loremipsun',
  },
  {
    id: 'jadwal-kehadiran-dosen',
    aspectTitle: 'Jadwal dan Kehadiran Dosen',
    aspectDescription:
      'Jadwal kuliah telah ditetapkan tanpa bentrok dan dosen hadir pada pertemuan pertama sesuai jadwal yang telah ditetapkan.',
    aspectCategoryCode: 'pelaksanaan',
    aspectCategoryLabel: 'Pelaksanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 70,
    note: 'Loremipsun',
  },
  {
    id: 'sosialisasi-kontrak-perkuliahan',
    aspectTitle: 'Sosialisasi dan Kontrak Perkuliahan',
    aspectDescription:
      'Jumlah dosen telah menyampaikan CPL, aturan kelas, dan kontrak perkuliahan pada awal semester untuk setiap kelas yang diampu.',
    aspectCategoryCode: 'pelaksanaan',
    aspectCategoryLabel: 'Pelaksanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 70,
    note: 'Loremipsun',
  },
  {
    id: 'kesiapan-mahasiswa',
    aspectTitle: 'Kesiapan Mahasiswa',
    aspectDescription:
      'Jumlah mahasiswa yang telah terdaftar dalam Great System dan memahami kontrak perkuliahan serta tata tertib akademik.',
    aspectCategoryCode: 'pelaksanaan',
    aspectCategoryLabel: 'Pelaksanaan',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tif',
    studyProgramLabel: 'TIF',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 70,
    note: 'Loremipsun',
  },
  {
    id: 'integrasi-aik-ciri-khas-prodi',
    aspectTitle: 'Integrasi Nilai AIK dan Ciri Khas Prodi',
    aspectDescription:
      'Jumlah mata kuliah yang telah mengintegrasikan nilai-nilai AIK dan ciri khas prodi ke dalam RPS dan proses pembelajaran.',
    aspectCategoryCode: 'integrasi',
    aspectCategoryLabel: 'Integrasi',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tsi',
    studyProgramLabel: 'TSI',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 50,
    note: 'Loremipsun',
  },
  {
    id: 'perwalian-krs',
    aspectTitle: 'Perwalian KRS',
    aspectDescription:
      'Jumlah mahasiswa aktif yang telah melakukan pengisian KRS sesuai daftar mahasiswa perwalian Dosen Pembimbing Akademik.',
    aspectCategoryCode: 'integrasi',
    aspectCategoryLabel: 'Integrasi',
    facultyCode: 'ftek',
    facultyLabel: 'Fakultas Teknik',
    studyProgramCode: 'tsi',
    studyProgramLabel: 'TSI',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 50,
    note: 'Loremipsun',
  },
  {
    id: 'sarana-prasarana-pembelajaran',
    aspectTitle: 'Sarana Prasarana Pembelajaran',
    aspectDescription:
      'Ketersediaan dan kecukupan jumlah ruang kelas serta fasilitas pendukung terhadap jumlah mata kuliah yang dilaksanakan pada semester berjalan.',
    aspectCategoryCode: 'dukungan',
    aspectCategoryLabel: 'Dukungan',
    facultyCode: 'fek',
    facultyLabel: 'Fakultas Ekonomi',
    studyProgramCode: 'mnj',
    studyProgramLabel: 'Manajemen',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 20,
    note: 'Loremipsun',
  },
  {
    id: 'pembelajaran-praktikum',
    aspectTitle: 'Pembelajaran Praktikum',
    aspectDescription:
      'Kesiapan alat dan bahan praktikum untuk mata kuliah praktikum terkait dengan pengajuan RAB (honorarium asisten lab, belanja bahan habis pakai dan modul praktikum).',
    aspectCategoryCode: 'dukungan',
    aspectCategoryLabel: 'Dukungan',
    facultyCode: 'fek',
    facultyLabel: 'Fakultas Ekonomi',
    studyProgramCode: 'mnj',
    studyProgramLabel: 'Manajemen',
    totalCourses: 5,
    totalLecturers: 5,
    achievement: 20,
    note: 'Loremipsun',
  },
]

export function resolveFm2Band(achievement: number): Fm2BandLegendItem {
  if (achievement >= 90) return fm2LegendByBand.excellent
  if (achievement >= 75) return fm2LegendByBand.good
  if (achievement >= 50) return fm2LegendByBand.fair
  return fm2LegendByBand.poor
}

export function matchesFm2ScoreFilter(
  achievement: number,
  filterValue: Fm2ScoreFilterValue
): boolean {
  if (filterValue === 'lt50') return achievement < 50
  if (filterValue === '50to75') return achievement >= 50 && achievement < 75
  if (filterValue === '75to90') return achievement >= 75 && achievement < 90
  return achievement >= 90
}

export function getFm2DashboardDummyData(
  context: Partial<Fm2DashboardContext> = {}
): Fm2DashboardDummyData {
  return {
    context: {
      periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
      unitId: context.unitId ?? 'unit-teknik-informatika',
    },
    hero: {
      title: 'Form Monitoring 02',
      description:
        'Halaman ini menampilkan hasil penilaian dan capaian indikator kesiapan pembelajaran.',
      statusLabel: 'Status',
      statusValue: 'Aktif',
      statusDate: '01 Maret 2026',
      currentStageLabel: 'Tahap Saat Ini',
      currentStageValue: 'Rekap Hasil Monitoring',
      deadlineLabel: 'Deadline',
      deadlineValue: '30 Maret 2026',
      noteLabel: 'Keterangan',
      noteValue: 'Tepat Waktu / Terlambat',
    },
    indicatorSummary: fm2IndicatorSummary.map((item) => ({ ...item })),
    chart: {
      totalScore: 3.57,
      maxScore: 4.0,
      readinessPercentage: 89.3,
      readinessCategory: 'Sangat Baik',
      radarAxes: fm2RadarAxes.map((axis) => ({ ...axis })),
    },
    legend: FM2_BAND_LEGEND.map((item) => ({ ...item })),
    tableRows: fm2TableRowsTemplate.map((row) => ({ ...row })),
  }
}
