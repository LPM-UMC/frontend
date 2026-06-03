import type { ModulResponse } from "./modul";
import type { ObjekResponse } from "./objek-evaluasi";

export type CreateAspekRequest = {
  objek_id: string;
  nama: string;
  deskripsi: string;
  link_panduan_bukti_istrumen: string;
  catatan_panduan_bukti_istrumen: string;
  link_panduan_bukti_rtl: string;
  catatan_panduan_bukti_rtl: string;
  indikator_evaluasi_ids: string[];
}

export type UpdateAspekRequest = {
  nama: string;
  deskripsi: string;
  link_panduan_bukti_istrumen: string;
  catatan_panduan_bukti_istrumen: string;
  link_panduan_bukti_rtl: string;
  catatan_panduan_bukti_rtl: string;
  indikator_evaluasi_ids: string[];
}

export type AspekResponse = {
  id: string;
  nama: string;
  deskripsi?: string;
  panduan_bukti_istrumen?: {
    link: string;
    catatan: string;
  };
  panduan_bukti_rtl?: {
    link: string;
    catatan: string;
  };
  total_indikator?: number;
  indikator?: {
    id: string;
  }[];
  objek?: ObjekResponse;
  modul?: ModulResponse;
  created_at?: string;
  updated_at?: string;
}
