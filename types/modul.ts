import type { tipe_modul } from "./enum";
import type { LingkupResponse } from "./lingkup-evaluasi";

export type CreateModulRequest = {
  lingkup_id: string;
  nama: string;
  deskripsi: string;
};

export type UpdateModulRequest = {
  deskripsi: string;
};

export type ModulResponse = {
  id: string;
  nama: string;
  deskripsi?: string;
  tipe_modul?: {
    kode: tipe_modul;
    label: string;
  };
  is_aktif?: boolean;
  total_aspek?: number;
  lingkup?: LingkupResponse;
  created_at?: Date;
  updated_at?: Date;
};
