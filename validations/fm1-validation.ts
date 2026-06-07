import { z } from 'zod'
import type { ComposerTranslation } from "vue-i18n";

export const simpanBuktiInstrumenValidation = (t: ComposerTranslation) => z.object({
  link: z
    .string()
    .url(t("fmMonitoring.buktiInstrumen.validasi.link.invalid"))
    .max(255, t("fmMonitoring.buktiInstrumen.validasi.link.max")),
  catatan: z
    .string()
    .min(1, t("fmMonitoring.buktiInstrumen.validasi.catatan.min"))
    .max(2000, t("fmMonitoring.buktiInstrumen.validasi.catatan.max"))
})

export const jawabInstrumenValidation = (t: ComposerTranslation, tipeEvaluasi: string) => z.object({
  catatan: z
    .string()
    .min(1, t("fmMonitoring.buktiInstrumen.validasi.catatan.min"))
    .max(2000, t("fmMonitoring.buktiInstrumen.validasi.catatan.max")),
  biner: tipeEvaluasi === 'BINER' 
    ? z.boolean({ required_error: t("fmMonitoring.evaluasi.validasi.binerRequired") }).nullable().refine(val => val !== null, { message: t("fmMonitoring.evaluasi.validasi.binerRequired") })
    : z.boolean().nullable().optional(),
  skala_id: tipeEvaluasi === 'SKALA'
    ? z.string({ required_error: t("fmMonitoring.evaluasi.validasi.skalaRequired") }).nullable().refine(val => val !== null, { message: t("fmMonitoring.evaluasi.validasi.skalaRequired") })
    : z.string().nullable().optional(),
  cek_ids: tipeEvaluasi === 'CEK'
    ? z.array(z.string()).min(1, t("fmMonitoring.evaluasi.validasi.cekRequired"))
    : z.array(z.string()).optional()
})
