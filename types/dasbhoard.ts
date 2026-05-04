export type UserDasborResponse = {
  total_user: number
  total_user_aktif: number
  total_role: number
  role_user_terbanyak: string
}

export type RoleDasborResponse = {
  total_user: number
  total_user_aktif: number
  total_role: number
  role_user_terbanyak: string
}

export type LingkupDasborResponse = {
  total_lingkup: number
  total_lingkup_aktif: number
  total_lingkup_terhapus: number
  lingkup_periode_terbanyak: string
}

export type ModulDasborResponse = {
  total_modul: number
  total_modul_aktif: number
  modul_periode_terbanyak: string
  modul_terbaru_dibuka: string
}
