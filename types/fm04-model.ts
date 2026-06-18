import type { UserResponse } from "./user";
import type { status_pelaksanaan } from "./enum";
import type { TemuanResponse } from "./fm03-temuan";

export type CreateAnalisisTemuanRequest = {
  dampak: string;
  penyebab: string;
  severity: number;
  occurrence: number;
  detection: number;
};

export type CreateRtlRequest = {
  rencana: string;
  nama_pic: string;
  email_pic: string;
  target_date: Date;
};

export type CreateProgresRtlRequest = {
  tanggal_realisasi: Date;
  presentase_realisasi: number;
  hasil: string;
  link: string;
  catatan?: string;
};

export type AnalisisFmeaResponse = {
  id: string;
  dampak: string;
  penyebab: string;
  severity: number;
  occurrence: number;
  detection: number;
  nilai_rpn: number;
  kategori_rpn: {
    kode: string;
    label: string;
  };
  temuan?: TemuanResponse;
  rtl?: RtlResponse;
  user?: UserResponse;
  created_at?: string;
  updated_at?: string;
};

export type RtlResponse = {
  id: string;
  rencana: string;
  nama_pic: string;
  email_pic: string;
  target_date: string;
  is_tepat_waktu: boolean;
  status_pelaksanaan: {
    kode: status_pelaksanaan;
    label: string;
  };
  analisis_temuan?: AnalisisFmeaResponse;
  progres?: ProgresRtlResponse[];
  user?: UserResponse;
  created_at?: string;
  updated_at?: string;
};

export type ProgresRtlResponse = {
  id: string;
  status: string;
  tanggal_realisasi: string;
  presentase_realisasi: number;
  hasil: string;
  link: string;
  catatan?: string;
  rtl?: RtlResponse;
  user?: UserResponse;
  created_at?: string;
  updated_at?: string;
};

