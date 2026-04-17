export type DashboardLocale = 'id' | 'en'

export type DashboardSourceMode = 'auto' | 'api' | 'dummy'

export type DashboardModuleKey =
  | 'monev'
  | 'ami'
  | 'modul-generator'
  | 'survey-generator'
  | 'kalender-generator'

export type ModuleCardAccentVariant = 'wave' | 'curve'

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  isOnline: boolean
}

export interface DashboardWelcomeCard {
  title: string
  message: string
}

export interface DashboardMenuItem {
  id: string
  moduleKey: DashboardModuleKey
  title: string
  description: string
  image: string
  to: string
  ctaLabel: string
}

export interface DashboardTopicItem {
  id: string
  moduleKey: DashboardModuleKey
  title: string
  description: string
  to: string
  ctaLabel: string
  accentVariant?: ModuleCardAccentVariant
}

export interface DashboardHomeData {
  user: DashboardUser
  welcome: DashboardWelcomeCard
  menus: DashboardMenuItem[]
}

export interface DashboardModuleData {
  moduleKey: DashboardModuleKey
  pageTitle: string
  searchPlaceholder: string
  topics: DashboardTopicItem[]
}

export interface DashboardApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}
