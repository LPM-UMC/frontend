import { z } from "zod";
import type { CreateObjekRequest, UpdateObjekRequest, tipe_data } from "../types/objek-evaluasi-type";

export const createObjekValidation: z.ZodType<CreateObjekRequest> = z.object({
  nama: z.string().min(3).max(25),
  deskripsi: z.string().min(10).max(255),
  koloms: z.array(
    z.object({
      label: z.string().min(3).max(25),
      tipe_data: z.nativeEnum(tipe_data),
      min_length: z.number().min(1).max(255).optional(),
      max_length: z.number().min(1).max(255).optional(),
      required: z.boolean(),
    })
  ),
});

export const updateObjekValidation: z.ZodType<UpdateObjekRequest> = z.object({
  deskripsi: z.string().min(1),
});
