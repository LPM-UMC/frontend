import z from "zod";
import type { CreateTemuanRequest, CreateValidasiTemuanReqeust, UpdateTemuanRequest } from "../types/fm03-temuan.type";

export const createTemuanValidation: z.ZodType<CreateTemuanRequest> = z.object({
  judul: z.string().min(3).max(255),
  temuan: z.string().min(20).max(2000),
  link: z.string().url().min(12).max(255),
  aspek_peride_modul_id: z.string().uuid(),
});

export const updateTemuanValidation: z.ZodType<UpdateTemuanRequest> = z.object({
  judul: z.string().min(3).max(255),
  temuan: z.string().min(20).max(2000),
  link: z.string().url().min(12).max(255),
  aspek_peride_modul_id: z.string().uuid(),
});

export const validasiTemuanValidation: z.ZodType<CreateValidasiTemuanReqeust> = z.object({
  is_validated: z.boolean(),
  catatan: z.string().min(20).max(2000),
  link: z.string().url().min(12).max(255),
});
