import z from "zod";
import type { ComposerTranslation } from "vue-i18n";
import type { CreateRoleRequest, UpdateRoleRequest } from "../types/role";

export const createRoleValidation = (
  t: any,
): z.ZodType<CreateRoleRequest> =>
  z.object({
    nama: z
      .string()
      .min(1, t('manajemenRole.create.validasi.nama.required'))
      .max(25, t('manajemenRole.create.validasi.nama.max')),

    deskripsi: z
      .string()
      .min(1, t('manajemenRole.create.validasi.deskripsi.required'))
      .max(255, t('manajemenRole.create.validasi.deskripsi.max')),
  })

export const updateRoleValidation = (
  t: any,
): z.ZodType<UpdateRoleRequest> =>
  z.object({
    deskripsi: z
      .string()
      .min(1, t('manajemenRole.update.validasi.deskripsi.required'))
      .max(255, t('manajemenRole.update.validasi.deskripsi.max')),
  })
