import type { UserResponse } from "./user";

export type TeamDasborResponse = {
  ketua_lpm: UserResponse | null;
  ketua_spi: UserResponse | null;
  lpm: UserResponse[];
  spi: UserResponse[];
  gmkf: UserResponse[];
}

export type UserDaborResponse = {
  total_user: number;
  total_user_aktif: number;
  total_role: number;
  role_user_terbanyak: string;
}

export type RoleDaborResponse = {
  total_user: number;
  total_user_aktif: number;
  total_role: number;
  role_user_terbanyak: string;
}

export type LingkupDasborResponse = {
  total_lingkup: number;
  total_lingkup_aktif: number;
  total_lingkup_terhapus: number;
  lingkup_periode_terbanyak: string;
}

export type ModulDasborResponse = {
  total_modul: number;
  total_modul_aktif: number;
  modul_periode_terbanyak: string;
  modul_terbaru_dibuka: string;
}

export type FM3DasborResponse = {
  total_temuan: number;
  total_temuan_draft: number;
  total_temuan_divalidasi: number;
  total_temuan_ditolak: number;
}
