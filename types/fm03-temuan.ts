import type { UserResponse } from "./user";
import type { status_proses } from "./enum";
import type { AspekResponse } from "./aspek";
import type { LingkupUnitResponse } from "./lingkup-evaluasi";

export type CreateTemuanRequest = {
  judul: string;
  temuan: string;
  link: string;
  aspek_peride_modul_id: string;
}

export type UpdateTemuanRequest = {
  judul: string;
  temuan: string;
  link: string;
  aspek_peride_modul_id: string;
}

export type CreateValidasiTemuanReqeust = {
  is_validated: boolean;
  catatan: string;
  link: string;
}

export type TemuanResponse = {
  id: string;
  judul: string;
  temuan: string;
  link: string;
  status: {
    kode: status_proses;
    label: string;
  };
  aspek?: AspekResponse;
  hasil_validasi?: ValidasiTemuanResponse[];
  unit_lingkup?: LingkupUnitResponse;
  created_at?: string;
  updated_at?: string;
}

export type ValidasiTemuanResponse = {
  id: string;
  is_validated: boolean;
  catatan?: string;
  link?: string;
  user?: UserResponse;
  created_at?: string;
  updated_at?: string;
}
