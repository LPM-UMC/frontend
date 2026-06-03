import z from "zod";
import type { CreateModulRequest, UpdateModulRequest } from "../types/modul-type";

export const createModulValidation: z.ZodType<CreateModulRequest> = z.object({
  lingkup_id: z.string().min(1).max(255),
  nama: z.string().min(1).max(50),
  deskripsi: z.string().min(1).max(500),
});

export const updateModulValidation: z.ZodType<UpdateModulRequest> = z.object({
  deskripsi: z.string().min(1).max(500),
});
