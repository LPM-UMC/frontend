import z from "zod";
import type { CreateAnalisisTemuanRequest, CreateProgresRtlRequest, CreateRtlRequest } from "../types/fm04-rtl.type";

export const createAnalisisValidation: z.ZodType<CreateAnalisisTemuanRequest> = z.object({
  dampak: z.string().min(20).max(2000),
  penyebab: z.string().min(20).max(2000),
  severity: z.number().int().min(1).max(10),
  occurrence: z.number().int().min(1).max(10),
  detection: z.number().int().min(1).max(10),
});

export const createRtlValidation: z.ZodType<CreateRtlRequest> = z.object({
  rencana: z.string().min(20).max(2000),
  nama_pic: z.string().min(1).max(255),
  email_pic: z.string().email().min(1).max(255),
  target_date: z.coerce.date(),
});

export const createProgresRtlValidation: z.ZodType<CreateProgresRtlRequest> = z.object({
  tanggal_realisasi: z.coerce.date(),
  presentase_realisasi: z.number().min(1).max(100),
  hasil: z.string().min(20).max(2000),
  link: z.string().url().min(1).max(255),
  catatan: z.string().min(20).max(2000).optional(),
});
