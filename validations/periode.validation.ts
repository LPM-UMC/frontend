import z from "zod";
import type { CreatePeriodeRequest, UpdatePeriodeRequest, semester } from "../types/periode-type";

export const createPeriodeValidation: z.ZodType<CreatePeriodeRequest> = z.object({
  tahun_ajaran: z.string().min(1).max(255),
  semester: z.enum([semester.GANJIL, semester.GENAP]),
  tanggal_mulai: z.string()
    .min(1)
    .max(255)
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Format tanggal_mulai tidak valid",
    }),
  tanggal_selesai: z.string()
    .min(1)
    .max(255)
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Format tanggal_selesai tidak valid",
    }),
  file_kalender: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, { // 5mb
    message: "File kalender must be less than 5mb",
  }).refine((file) => file.type === "application/pdf", {
    message: "File kalender must be a pdf",
  }),
});

export const updatePriodeValidation: z.ZodType<UpdatePeriodeRequest> = z.object({
  tanggal_mulai: z.string().min(1).max(255),
  tanggal_selesai: z.string().min(1).max(255),
  file_kalender: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, { // 5mb
    message: "File kalender must be less than 5mb",
  }).refine((file) => file.type === "application/pdf", {
    message: "File kalender must be a pdf",
  }).optional(),
});
