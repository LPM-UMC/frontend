import z from "zod";
import type { CreateAspekRequest, UpdateAspekRequest } from "../types/aspek.type";

export const createAspekValidation: z.ZodType<CreateAspekRequest> = z.object({
  objek_id: z.string().min(1).max(255),
  nama: z.string().min(1).max(50),
  deskripsi: z.string().min(1).max(500),
  link_panduan_bukti_istrumen: z.string().min(10).max(255),
  catatan_panduan_bukti_istrumen: z.string().min(10).max(500),
  link_panduan_bukti_rtl: z.string().min(10).max(255),
  catatan_panduan_bukti_rtl: z.string().min(10).max(500),
  indikator_evaluasi_ids: z.array(z.string().min(1).max(255)).min(1).max(30),
});

export const updateAspekValidation: z.ZodType<UpdateAspekRequest> = z.object({
  nama: z.string().min(1).max(50),
  deskripsi: z.string().min(1).max(500),
  link_panduan_bukti_istrumen: z.string().min(10).max(255),
  catatan_panduan_bukti_istrumen: z.string().min(10).max(500),
  link_panduan_bukti_rtl: z.string().min(10).max(255),
  catatan_panduan_bukti_rtl: z.string().min(10).max(500),
  indikator_evaluasi_ids: z.array(z.string().min(1).max(255)).min(1).max(30),
});
