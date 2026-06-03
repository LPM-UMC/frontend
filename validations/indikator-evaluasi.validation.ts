import z from "zod";
import type { CreateIndikatorRequest, UpdateIndikatorRequest, tipe_evaluasi } from "../types/indikator-evaluasi.type";

export const createIndikatorValidation: z.ZodType<CreateIndikatorRequest> = z.object({
  nama: z.string().min(1).max(25),
  deskripsi: z.string().min(1).max(255),
  pertanyaan: z.string().min(1).max(255),
  tipe_evaluasi: z.nativeEnum(tipe_evaluasi),
  skala_penilaian: z.array(z.object({
    nilai: z.number().min(1).max(100),
    deskripsi: z.string().min(1).max(255),
  })).optional(),
  checklist_penilaian: z.array(z.object({
    nama: z.string().min(1).max(50),
    deskripsi: z.string().min(1).max(255),
  })).optional(),
});

export const updateIndikatorValidation: z.ZodType<UpdateIndikatorRequest> = z.object({
  nama: z.string().min(1).max(50),
  deskripsi: z.string().min(1).max(255),
  pertanyaan: z.string().min(1).max(255),
});
