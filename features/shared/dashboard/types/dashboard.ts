export type AppRole =
  | 'admin'
  | 'lpm'
  | 'spi'
  | 'kaprodi'
  | 'gkmf'
  | 'auditor'
  | 'prodi'

export type DashboardModuleKey =
  | 'monev'
  | 'ami'
  | 'survei-generator'
  | 'modul-generator'
  | 'kalender-generator'
  | 'audit'
  | 'temuan'
  | 'laporan'

export interface DashboardUser {
  name: string
  email: string
  role: AppRole
  avatar: string
  isOnline?: boolean
}

export interface DashboardModule {
  key: DashboardModuleKey
  title: string
  description: string
  to: string
  image?: string
  roles?: AppRole[]
}

export interface RoleDashboardConfig {
  heading: string
  description: string
  moduleKeys: DashboardModuleKey[]
}

export interface LocaleOption {
  code: 'id' | 'en'
  label: string
}