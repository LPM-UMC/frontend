import type { Fm01AspectDetail, Fm01PageData } from '../types/fm01'

const baseAspectDetail: Fm01AspectDetail = {
  title: 'Aspek Kesiapan RPS',
  description:
    'Aspek ini mencakup kesiapan Rencana Pembelajaran Semester (RPS) dengan memastikan bahwa komponen indikator sesuai dan diterapkan sesuai kebutuhan standar dan kurikulum nasional.',
  objectLabel: 'OBJEK EVALUASI',
  object: {
    title: 'RPS Mata Kuliah',
    typeLabel: 'MANUAL',
    description:
      'Objek ini mencakup verifikasi dokumen RPS semester ganjil tahun ajaran 2025/2026.',
    addUnitLabel: 'Tambah Unit Objek Evaluasi',
    addUnitHint: 'KLIK UNTUK PINDAH KE FORM PENAMBAHAN OBJEK',
  },
  indicatorLabel: 'INDIKATOR PENILAIAN',
  indicators: [
    {
      id: 'indikator-1',
      title: 'Kelengkapan Komponen RPS',
      description:
        'Mengukur apakah materi ajar selaras dengan standar CPL Prodi',
      assessmentType: 'manual',
    },
    {
      id: 'indikator-2',
      title: 'Kesesuaian Capaian Pembelajaran',
      description: 'Pengecekan tahun terbit referensi yang digunakan dengan RPS',
      assessmentType: 'automatic',
    },
    {
      id: 'indikator-3',
      title: 'Pembakuan Pustaka',
      description:
        'Referensi yang digunakan mutakhir, relevan, dan sesuai standar akademik',
      assessmentType: 'none',
    },
  ],
  document: {
    title: 'Berkas Bukti Dukung',
    subtitle: 'DATA TERVERIFIKASI SISTEM',
    submittedAt: 'Submit: 29 Mar 2026, 14:15 WIB',
    statusLabel: 'Status:',
    statusValue: 'TEPAT WAKTU',
    deadlineLabel: 'Batas akhir:',
    deadlineValue: '30 Mar 2026',
    linkLabel: 'TAUTAN DOKUMEN',
    link: 'https://cloud.kampus.ac.id/s/ev-ti-2026',
    viewLabel: 'Lihat',
    senderNoteLabel: 'CATATAN PENGIRIM',
    senderNoteValue:
      '"Berkas kurikulum telah disesuaikan dengan masukan rapat GKM tanggal 27 Maret. Mohon divalidasi oleh Auditor."',
  },
}

const fm01PageData: Fm01PageData = {
  sidebar: {
    sectionTitle: 'GENERAL',
    activeMenuId: 'lingkup-evaluasi',
    menus: [
      {
        id: 'dashboard-utama',
        label: 'Dashboard Utama',
        to: '/dashboard',
      },
      {
        id: 'lingkup-evaluasi',
        label: 'FM01. Lingkup Evaluasi',
      },
      {
        id: 'fm02-monitoring',
        label: 'FM02. Monitoring',
      },
      {
        id: 'fm03-monitoring',
        label: 'FM03. Monitoring',
      },
      {
        id: 'fm04-monitoring',
        label: 'FM04. Monitoring',
      },
      {
        id: 'fm05-monitoring',
        label: 'FM05. Monitoring',
      },
      {
        id: 'fm06-monitoring',
        label: 'FM06. Monitoring',
      },
      {
        id: 'fm07-monitoring',
        label: 'FM07. Monitoring',
      },
    ],
    profile: {
      name: 'Guy Hawkins',
      role: 'Admin',
      avatar: '/img/profil.jpg',
    },
  },
  summary: {
    title: 'Form Monitoring 1',
    description:
      'Form ini digunakan untuk evaluasi kinerja program studi pada periode tertentu guna memastikan standar mutu akademik terpenuhi.',
    statusLabel: 'STATUS',
    statusValue: 'AKTIF',
    statusDate: '30 MARET 2026',
    metrics: [
      {
        id: 'current-phase',
        label: 'TAHAP SAAT INI',
        value: 'Pengisian Objek & Bukti Instrumen',
      },
      {
        id: 'deadline',
        label: 'DEADLINE',
        value: '30 Maret 2026',
      },
      {
        id: 'note',
        label: 'KETERANGAN',
        value: 'Tepat Waktu / Terlambat',
      },
    ],
  },
  detailLabel: 'DETAIL ASPEK EVALUASI',
  detailTitle: 'Pilih Aspek Evaluasi',
  activeAspectId: 'aspek-kesiapan-rps',
  aspectOptions: [
    { id: 'aspek-kesiapan-rps', label: 'Aspek Kesiapan RPS' },
    { id: 'aspek-instrumen-assasmen-rubrik', label: 'Aspek Instrumen Assasmen & Rubrik' },
    { id: 'media-sumber-belajar', label: 'Media Sumber Belajar' },
    { id: 'jadwal-kehadiran-dosen', label: 'Jadwal & Kehadiran Dosen' },
    { id: 'kesiapan-mahasiswa', label: 'Kesiapan Mahasiswa' },
    { id: 'dosen-terintegrasi-aik-ciri-khas', label: 'Dosen Terintegrasi AIK & Ciri Khas' },
    { id: 'sarana-prasarana-praktikum', label: 'Sarana Prasarana & Praktikum' },
    { id: 'pembelajaran-praktikum', label: 'Pembelajaran & Praktikum' },
    { id: 'perwalian-krs', label: 'Perwalian KRS' },
    { id: 'sosialisasi-kontrak-kerja', label: 'Sosialisasi dan Kontrak Kerja' },
  ],
  aspectDetails: {
    'aspek-kesiapan-rps': {
      ...baseAspectDetail,
    },
    'aspek-instrumen-assasmen-rubrik': {
      ...baseAspectDetail,
      title: 'Aspek Instrumen Assasmen & Rubrik',
      description:
        'Aspek ini mengevaluasi instrumen assasmen serta rubrik penilaian agar konsisten, terukur, dan terdokumentasi dalam setiap mata kuliah.',
    },
    'media-sumber-belajar': {
      ...baseAspectDetail,
      title: 'Media Sumber Belajar',
      description:
        'Evaluasi kesiapan media dan sumber belajar digital maupun non-digital untuk mendukung proses pembelajaran aktif.',
    },
    'jadwal-kehadiran-dosen': {
      ...baseAspectDetail,
      title: 'Jadwal & Kehadiran Dosen',
      description:
        'Penilaian terhadap ketepatan jadwal kuliah, presensi dosen, dan konsistensi keterlaksanaan pertemuan.',
    },
    'kesiapan-mahasiswa': {
      ...baseAspectDetail,
      title: 'Kesiapan Mahasiswa',
      description:
        'Aspek ini meninjau kesiapan mahasiswa dalam mengikuti pembelajaran, mencakup kehadiran, partisipasi, dan capaian awal.',
    },
    'dosen-terintegrasi-aik-ciri-khas': {
      ...baseAspectDetail,
      title: 'Dosen Terintegrasi AIK & Ciri Khas',
      description:
        'Penilaian integrasi AIK serta ciri khas institusi ke dalam rencana dan pelaksanaan pembelajaran.',
    },
    'sarana-prasarana-praktikum': {
      ...baseAspectDetail,
      title: 'Sarana Prasarana & Praktikum',
      description:
        'Evaluasi kelayakan ruang, perangkat laboratorium, dan dukungan infrastruktur praktikum untuk pembelajaran.',
    },
    'pembelajaran-praktikum': {
      ...baseAspectDetail,
      title: 'Pembelajaran & Praktikum',
      description:
        'Aspek ini menilai keterlaksanaan praktik pembelajaran di kelas maupun laboratorium berdasarkan standar mutu.',
    },
    'perwalian-krs': {
      ...baseAspectDetail,
      title: 'Perwalian KRS',
      description:
        'Evaluasi proses pendampingan akademik dan validasi perwalian KRS agar sesuai ketentuan institusi.',
    },
    'sosialisasi-kontrak-kerja': {
      ...baseAspectDetail,
      title: 'Sosialisasi dan Kontrak Kerja',
      description:
        'Penilaian terhadap kejelasan sosialisasi kontrak kerja perkuliahan dan kesepakatan pembelajaran di awal semester.',
    },
  },
  scopeInfo: {
    scopeLabel: 'LINGKUP EVALUASI',
    scopeValue: 'Program Studi',
    scopeTag: 'GS',
    scopeDescription:
      'Mencakup aspek akademik, tata kelola sumber daya, dan capaian kinerja tahunan.',
    unitLabel: 'UNIT LINGKUP EVALUASI',
    unitValue: 'Teknik Informatika',
    unitDescription:
      'Fokus pada pengembangan perangkat lunak, AI, dan tata kelola sistem informasi.',
  },
  stakeholderTitle: 'PIHAK TERKAIT',
  stakeholderSubtitle: 'Role dan User',
  stakeholders: [
    {
      id: 'stakeholder-kaprodi',
      initials: 'HG',
      roleTag: 'KAPRODI',
      name: 'Harry Gunawan, M.Kom',
      email: 'harrygunawan@umc.ac.id',
    },
    {
      id: 'stakeholder-gkmf',
      initials: 'PW',
      roleTag: 'GKMF',
      name: 'Pahla Widhiani, M.Kom',
      email: 'Pahlawidiani@umc.ac.id',
    },
  ],
  validationPanel: {
    title: 'Panel Validasi',
    status: 'TERVALIDASI',
    reviewerInitials: 'AU',
    reviewerName: 'Arie Utami, M.T',
    reviewerRole: 'LPM',
    reviewedAt: '29 MAR 2026, 20:15 WIB',
    noteLabel: 'CATATAN REVIEW & INTRUKSI',
    notePlaceholder: 'Isi Catatan dan instruksi untuk perbaikan di sini...',
  },
  table: {
    title: 'Daftar Objek Evaluasi',
    searchPlaceholder: 'Search',
    sortOptions: [
      { label: 'A - Z', value: 'asc' },
      { label: 'Z - A', value: 'desc' },
    ],
    sortOrder: 'asc',
    pageSize: 5,
    actionLabel: 'Lihat',
    rows: [
      { id: 'obj-001', code: 'TI22E', name: 'PBO', className: 'TI22E', lecturer: 'Freddy Wicaksono,M.T' },
      { id: 'obj-002', code: 'TI22E', name: 'PBO', className: 'TI22E', lecturer: 'Freddy Wicaksono,M.T' },
      { id: 'obj-003', code: 'TI22E', name: 'PBO', className: 'TI22E', lecturer: 'Freddy Wicaksono,M.T' },
      { id: 'obj-004', code: 'TI22E', name: 'PBO', className: 'TI22E', lecturer: 'Freddy Wicaksono,M.T' },
      { id: 'obj-005', code: 'TI22E', name: 'PBO', className: 'TI22E', lecturer: 'Freddy Wicaksono,M.T' },
      { id: 'obj-006', code: 'TI22F', name: 'Struktur Data', className: 'TI22F', lecturer: 'Nanda Rachmat, M.T' },
      { id: 'obj-007', code: 'TI22G', name: 'Basis Data', className: 'TI22G', lecturer: 'Nur Isnaeni, M.Kom' },
      { id: 'obj-008', code: 'TI22H', name: 'Pemrograman Web', className: 'TI22H', lecturer: 'Pahla Widhiani, M.Kom' },
      { id: 'obj-009', code: 'TI22I', name: 'Sistem Operasi', className: 'TI22I', lecturer: 'Harry Gunawan, M.Kom' },
      { id: 'obj-010', code: 'TI22J', name: 'Jaringan Komputer', className: 'TI22J', lecturer: 'Ariyanto, M.Kom' },
    ],
  },
  indicatorModal: {
    title: 'Indikator Evaluasi',
    subtitle: 'Pastikan semua indikator manual telah disimpan sebelum Deadline.',
    closeLabel: 'Tutup modal indikator',
    sectionOneTitle: 'Status Validasi Kaprodi',
    sectionOneDescription:
      'Verifikasi otomatis berdasarkan persetujuan digital di SIM-Akademik.',
    sectionOneTag: 'TERINTEGRASI SYSTEM',
    sectionOneFetchedAt: 'Data diambil: 20 Mar 2026, 14:25 WIB',
    yesLabel: 'YA',
    noLabel: 'TIDAK',
    sectionTwoTitle: 'Kualitas Konten Pembelajaran',
    sectionTwoDescription:
      'Kesesuaian kedalaman materi dengan Capaian Pembelajaran Lulusan (CPL).',
    sectionTwoTag: 'PENILAIAN MANUAL',
    qualityOptions: [
      { value: 1, title: '1', description: 'KUALITAS TIDAK BAIK' },
      { value: 2, title: '2', description: 'KUALITAS CUKUP BAIK' },
      { value: 3, title: '3', description: 'KUALITAS BAIK' },
      { value: 4, title: '4', description: 'KUALITAS SANGAT BAIK' },
    ],
    sectionTwoPlaceholder: 'Berikan justifikasi untuk nilai di atas...',
    sectionThreeTitle: 'Checklist Kelengkapan Berkas',
    sectionThreeDescription:
      'Verifikasi fisik dokumen yang diunggah oleh pengguna.',
    sectionThreeTag: 'PENILAIAN MANUAL',
    checklistOptions: [
      { id: 'rps', label: 'Rencana Pembelajaran (RPS)' },
      { id: 'instrumen-tugas', label: 'Instrumen Tugas Mandiri' },
    ],
    sectionThreePlaceholder: 'Keterangan tambahan kelengkapan berkas...',
    cancelLabel: 'Batal',
    submitLabel: 'Simpan Indikator',
    defaultForm: {
      validationApproved: true,
      contentQualityScore: null,
      contentQualityJustification: '',
      checklistFiles: [],
      checklistNote: '',
    },
  },
}

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export function cloneFm01PageData(data: Fm01PageData): Fm01PageData {
  return cloneDeep(data)
}

export function getFm01DummyPageData(): Fm01PageData {
  return cloneFm01PageData(fm01PageData)
}
