import type { LingkupResponse } from "#types/lingkup";

export type tipe_data = "STRING" | "NUMBER" | "BOOLEAN" | "DATETIME";

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

export type ObjekResponse = {
  id: string;
  nama: string;
  deskripsi: string;
  is_eksternal?: string;
  koloms?: {
    key: string;
    label: string;
    required: boolean;
    tipe_data: tipe_data;
    min_length?: number;
    max_length?: number;
  }[];
  lingkup?: LingkupResponse;
  created_at?: Date;
  updated_at?: Date;
};

export const toObjekResponse = (objek: any): ObjekResponse => ({
  id: objek.id,
  nama: objek.translations?.[0]?.nama ?? objek.nama,
  deskripsi: objek.translations?.[0]?.deskripsi ?? objek.deskripsi,
  is_eksternal: objek.is_eksternal,
  koloms: (objek.koloms ?? []).map((k: any) => ({
    key: k.key,
    label: k.label,
    tipe_data: k.tipe_data,
    min_length: k.min_length ?? undefined,
    max_length: k.max_length ?? undefined,
    required: k.required ?? false,
  })) ?? undefined,
  lingkup: objek.lingkup ? toLingkupResponse(objek.lingkup) : undefined,
  created_at: objek.created_at,
  updated_at: objek.updated_at,
});
