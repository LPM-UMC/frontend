import type { status_pelaksanaan } from "./enum";

export type FMResponse = {
  id: string;
  nama: string;
  deskripsi: string;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export type FMPeriodeModulResponse = {
  id: string;
  fm?: FMResponse;
  status_pelaksanaan: {
    kode: status_pelaksanaan;
    label: string;
  };
  tanggal_mulai: string;
  tanggal_selesai: string;
  tanggal_diselesaikan?: string;
  created_at: string;
  updated_at: string;
}

