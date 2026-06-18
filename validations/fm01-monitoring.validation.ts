import z from "zod";
import type { JawabInstrumenRequest } from "../types/fm01-monitoring.type";

export const fm1MonitoringJawabInstrumenValidation: z.ZodType<JawabInstrumenRequest> = z.object({
  biner: z.boolean().optional(),
  skala_id: z.string().uuid().optional(),
  cek_ids: z.array(z.string().uuid()).optional(),
  catatan: z.string().min(20).max(255),
});

export const fm1MonitoringSimpanBuktiInstrumen: z.ZodType<{ catatan: string; link: string }> = z.object({
  catatan: z.string().min(1).max(2000),
  link: z.string().url().max(255),
});

export const upsertUnitObjekValidation: z.ZodType<{ values: { kolom_id: string; value: any }[] }> = z.object({
  values: z.array(
    z.object({
      kolom_id: z.string().uuid(),
      value: z.any().nullable(),
    })
  ).min(1),
});
