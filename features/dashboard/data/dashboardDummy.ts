import type {
  DashboardHomeData,
  DashboardModuleData,
  DashboardModuleKey,
  DashboardTopicItem,
  DashboardUser,
  ModuleCardAccentVariant,
} from '../types/dashboard'

const defaultMenuDescription =
  'Write an amazing description in this dedicated card section. Each word counts.'

const defaultTopicDescription =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit af mauris in. Aliquet hendrerit ante. Pellentesque id amet sapien.'

export const dashboardDummyUser: DashboardUser = {
  id: 'usr-lpm-001',
  name: 'Arie S Utami, M.T.',
  email: 'arie.utami@umc.ac.id',
  role: 'LPM ROLE',
  avatar: '/img/profil.jpg',
  isOnline: true,
}

const dashboardDummyHomeData: DashboardHomeData = {
  user: dashboardDummyUser,
  welcome: {
    title: 'Dashboard',
    message:
      'Selamat datang Arie S Utami, M.T., anda masuk sebagai Role LPM di sistem Lembaga Penjaminan Mutu dan Satuan Pengawas Internal Universitas Muhammadiyah Cirebon',
  },
  menus: [
    {
      id: 'menu-monev',
      moduleKey: 'monev',
      title: 'Monev',
      description: defaultMenuDescription,
      image: '/img/gedung-umc.jpg',
      to: '/dashboard/monev',
      ctaLabel: 'Masuk',
    },
    {
      id: 'menu-modul-generator',
      moduleKey: 'modul-generator',
      title: 'Modul Generator',
      description: defaultMenuDescription,
      image: '/img/gedung-umc.jpg',
      to: '/dashboard/ami',
      ctaLabel: 'Masuk',
    },
    {
      id: 'menu-survey-generator',
      moduleKey: 'survey-generator',
      title: 'Survey Generator',
      description: defaultMenuDescription,
      image: '/img/gedung-umc.jpg',
      to: '/dashboard/ami',
      ctaLabel: 'Masuk',
    },
    {
      id: 'menu-kalender-generator',
      moduleKey: 'kalender-generator',
      title: 'Kalender Generator',
      description: defaultMenuDescription,
      image: '/img/gedung-umc.jpg',
      to: '/dashboard/ami',
      ctaLabel: 'Masuk',
    },
  ],
}

const monevTopics = [
  'Monev Visi Misi',
  'Monev Kerjasama',
  'Monev Tata Pamong dan Tata Kelola',
  'Monev Layanan Manajemen',
  'Monev Kepuasan Layanan Mahasiswa',
  'Monev Layanan Administrasi Akademik',
  'Monev Pengelolaan SDM',
  'Monev Keuangan dan SAPRAS',
  'Monev Penyelenggaraan Pendidikan',
  'Monev Awal Pembelajaran',
  'Monev Akhir Pembelajaran',
  'Monev Penelitian',
  'Monev PkM',
  'Monev AIK',
  'Monev Evaluasi Capaian Kinerja',
  'Monev Tindak Lanjut AMI',
]

const amiTopics = [
  'Audit Kepatuhan',
  'Audit Kinerja',
  'Manajemen risiko',
  'Monev Fakultas',
  'Monev Lembaga',
  'Pengawasan Pelaksanaan Internal',
  'Pelaporan dan Pelaksanaan Tindak Lanjut',
  'Pemantauan Tindak Lanjut Hasil Pengawasan',
  'Penanganan Pengaduan',
  'Pendukung dan Etika',
  'Pengelolaan Dikumen',
  'Penyusunan Laporan Hasil Pengawasan',
  'Rencana Pengawasan Tahunan',
  'Reviu',
  'Tata Kelola',
  'Tindak Lanjut Lembaha Univ',
]

function buildTopics(
  moduleKey: DashboardModuleKey,
  titles: string[],
  accentVariant: ModuleCardAccentVariant = 'wave'
): DashboardTopicItem[] {
  return titles.map((title, index) => ({
    id: `${moduleKey}-topic-${index + 1}`,
    moduleKey,
    title,
    description: defaultTopicDescription,
    to: '/dashboard/monev',
    ctaLabel: 'Learn more',
    accentVariant,
  }))
}

const moduleTopicMap: Record<DashboardModuleKey, DashboardModuleData> = {
  monev: {
    moduleKey: 'monev',
    pageTitle: 'Modul Monev',
    searchPlaceholder: 'Search ...',
    topics: buildTopics('monev', monevTopics, 'wave'),
  },
  ami: {
    moduleKey: 'ami',
    pageTitle: 'Modul AMI',
    searchPlaceholder: 'Search ...',
    topics: buildTopics('ami', amiTopics, 'curve'),
  },
  'modul-generator': {
    moduleKey: 'modul-generator',
    pageTitle: 'Modul Generator',
    searchPlaceholder: 'Search ...',
    topics: buildTopics('modul-generator', monevTopics, 'wave'),
  },
  'survey-generator': {
    moduleKey: 'survey-generator',
    pageTitle: 'Survey Generator',
    searchPlaceholder: 'Search ...',
    topics: buildTopics('survey-generator', monevTopics, 'curve'),
  },
  'kalender-generator': {
    moduleKey: 'kalender-generator',
    pageTitle: 'Kalender Generator',
    searchPlaceholder: 'Search ...',
    topics: buildTopics('kalender-generator', monevTopics, 'wave'),
  },
}

export function cloneDashboardUser(user: DashboardUser): DashboardUser {
  return { ...user }
}

export function cloneDashboardHomeData(data: DashboardHomeData): DashboardHomeData {
  return {
    user: cloneDashboardUser(data.user),
    welcome: { ...data.welcome },
    menus: data.menus.map((menu) => ({ ...menu })),
  }
}

export function cloneDashboardModuleData(
  data: DashboardModuleData
): DashboardModuleData {
  return {
    moduleKey: data.moduleKey,
    pageTitle: data.pageTitle,
    searchPlaceholder: data.searchPlaceholder,
    topics: data.topics.map((topic) => ({ ...topic })),
  }
}

export function getDashboardDummyUser(): DashboardUser {
  return cloneDashboardUser(dashboardDummyUser)
}

export function getDashboardDummyHomeData(): DashboardHomeData {
  return cloneDashboardHomeData(dashboardDummyHomeData)
}

export function getDashboardDummyModuleData(
  moduleKey: DashboardModuleKey
): DashboardModuleData {
  const fallback = moduleTopicMap.monev
  return cloneDashboardModuleData(moduleTopicMap[moduleKey] ?? fallback)
}
