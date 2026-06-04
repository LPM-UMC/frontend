import z from "zod";
import type { ComposerTranslation } from "vue-i18n";
import type {
  CreateUserRequest,
  UpdatePasswordRequest,
  UpdateProfileImageRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
} from "../types/user";

export const createUserValidation = (
  t: ComposerTranslation,
): z.ZodType<CreateUserRequest> =>
  z.object({
    nidn: z
      .string()
      .min(1, t("manajemenUser.create.validasi.nidn.required"))
      .max(20, t("manajemenUser.create.validasi.nidn.max"))
      .optional(),

    nim: z
      .string()
      .min(1, t("manajemenUser.create.validasi.nim.required"))
      .max(20, t("manajemenUser.create.validasi.nim.max"))
      .optional(),

    nama: z
      .string()
      .min(1, t("manajemenUser.create.validasi.nama.required"))
      .max(30, t("manajemenUser.create.validasi.nama.max")),

    email: z
      .string()
      .min(1, t("manajemenUser.create.validasi.email.required"))
      .max(255, t("manajemenUser.create.validasi.email.max"))
      .email(t("manajemenUser.create.validasi.email.invalid")),

    role_ids: z
      .array(
        z.string().uuid(
          t("manajemenUser.create.validasi.roleIds.invalid"),
        ),
      )
      .min(1, t("manajemenUser.create.validasi.roleIds.min"))
      .max(10, t("manajemenUser.create.validasi.roleIds.max")),
  });

export const updateUserValidation = (
  t: ComposerTranslation,
): z.ZodType<UpdateUserRequest> =>
  z.object({
    email: z
      .string()
      .min(1, t("manajemenUser.update.validasi.email.required"))
      .max(255, t("manajemenUser.update.validasi.email.max"))
      .email(t("manajemenUser.update.validasi.email.invalid")),

    role_ids: z
      .array(
        z.string().uuid(
          t("manajemenUser.update.validasi.roleIds.invalid"),
        ),
      )
      .min(1, t("manajemenUser.update.validasi.roleIds.min"))
      .max(10, t("manajemenUser.update.validasi.roleIds.max")),
  });

export const updateProfileValidation = (
  t: ComposerTranslation,
): z.ZodType<UpdateProfileRequest> =>
  z.object({
    nama: z
      .string()
      .min(1, t("manajemenUser.updateProfile.validasi.nama.required"))
      .max(255, t("manajemenUser.updateProfile.validasi.nama.max")),

    email: z
      .string()
      .min(1, t("manajemenUser.updateProfile.validasi.email.required"))
      .max(255, t("manajemenUser.updateProfile.validasi.email.max"))
      .email(t("manajemenUser.updateProfile.validasi.email.invalid")),

    instagram: z
      .string()
      .min(
        1,
        t("manajemenUser.updateProfile.validasi.instagram.required"),
      )
      .max(255, t("manajemenUser.updateProfile.validasi.instagram.max")),

    linkedin: z
      .string()
      .min(
        1,
        t("manajemenUser.updateProfile.validasi.linkedin.required"),
      )
      .max(255, t("manajemenUser.updateProfile.validasi.linkedin.max")),
  });

export const updateProfileImageValidation = (
  t: ComposerTranslation,
): z.ZodType<UpdateProfileImageRequest> =>
  z.object({
    picture: z
      .instanceof(File, {
        message: t(
          "manajemenUser.updateProfileImage.validasi.picture.required",
        ),
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: t(
          "manajemenUser.updateProfileImage.validasi.picture.maxSize",
        ),
      })
      .refine((file) => file.type.startsWith("image/"), {
        message: t(
          "manajemenUser.updateProfileImage.validasi.picture.invalidType",
        ),
      }),
  });

export const updatePasswordValidation = (
  t: ComposerTranslation,
): z.ZodType<UpdatePasswordRequest> =>
  z.object({
    password: z
      .string()
      .min(
        8,
        t("manajemenUser.updatePassword.validasi.password.min"),
      )
      .max(
        128,
        t("manajemenUser.updatePassword.validasi.password.max"),
      ),
  });
