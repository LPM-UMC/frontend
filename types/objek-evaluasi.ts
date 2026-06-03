import type { tipe_data } from "./enum";
import type { LingkupResponse } from "./lingkup-evaluasi";

export type CreateObjekRequest = {
  nama: string;
  deskripsi: string;
  koloms?: {
    label: string;
    tipe_data: tipe_data;
    min_length?: number;
    max_length?: number;
    required: boolean;
  }[];
};

export type UpdateObjekRequest = {
  deskripsi: string;
};

export type KolomEvaluasiResponse = {
  id: string;
  key: string;
  label: string;
  required: boolean;
  tipe_data: tipe_data;
  min_length?: number;
  max_length?: number;
};

export type ValueKolomEvaluasiResponse = {
  id: string;
  kolom_id: string;
  key: string;
  label: string;
  tipe_data: tipe_data;
  value: string | number | boolean | Date | null;
};

export type BarisObjekEvaluasiResponse = {
  id: string;
  created_at: Date;
  updated_at: Date;
  values: ValueKolomEvaluasiResponse[];
};

export type ObjekResponse = {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  is_eksternal: boolean;
  koloms?: KolomEvaluasiResponse[];
  rows?: BarisObjekEvaluasiResponse[];
  lingkup?: LingkupResponse;
  created_at?: string;
  updated_at?: string;
};

