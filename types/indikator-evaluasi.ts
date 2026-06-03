import type { tipe_evaluasi } from "./enum";
import type { ObjekResponse } from "./objek-evaluasi";

export type CreateIndikatorRequest = {
  nama: string;
  deskripsi: string;
  pertanyaan: string;
  tipe_evaluasi: tipe_evaluasi;
  skala_penilaian?: {
    nilai: number;
    deskripsi: string;
  }[];
  checklist_penilaian?: {
    nama: string;
    deskripsi: string;
  }[],
}

export type UpdateIndikatorRequest = {
  nama: string;
  deskripsi: string;
  pertanyaan: string;
}

export type SkalaPenilaianResponse = {
  id: string;
  nilai: number;
  deskripsi: string;
  created_at?: string;
  updated_at?: string;
}

export type ChecklistPenilaianResponse = {
  id: string;
  nama: string;
  deskripsi: string;
  created_at?: string;
  updated_at?: string;
}

export type IndikatorResponse = {
  id: string;
  nama?: string;
  deskripsi?: string;
  pertanyaan?: string;
  tipe_evaluasi?: {
    kode: tipe_evaluasi;
    label: string;
  };
  is_eksternal?: boolean;
  skala_penilaian?: SkalaPenilaianResponse[];
  checklist_penilaian?: ChecklistPenilaianResponse[];
  objek?: ObjekResponse;
  created_at?: Date;
  updated_at?: Date;
}
