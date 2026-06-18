import z from "zod";
import type { ComposerTranslation } from "vue-i18n";
import type { CreateModulRequest, UpdateModulRequest } from "../types/modul";

export const createModulValidation = (
  t: ComposerTranslation,
): z.ZodType<CreateModulRequest> =>
  z.object({
    lingkup_id: z
      .string()
      .uuid(t("manajemenModul.create.validasi.lingkupId.invalid"))
      .min(1, t("manajemenModul.create.validasi.lingkup_id.required")),

    nama: z
      .string()
      .min(1, t("manajemenModul.create.validasi.nama.required"))
      .max(50, t("manajemenModul.create.validasi.nama.max")),

    deskripsi: z
      .string()
      .min(1, t("manajemenModul.create.validasi.deskripsi.required"))
      .max(500, t("manajemenModul.create.validasi.deskripsi.max")),
  });

export const updateModulValidation = (
  t: ComposerTranslation,
): z.ZodType<UpdateModulRequest> =>
  z.object({
    deskripsi: z
      .string()
      .min(1, t("manajemenModul.update.validasi.deskripsi.required"))
      .max(500, t("manajemenModul.update.validasi.deskripsi.max")),
  });
