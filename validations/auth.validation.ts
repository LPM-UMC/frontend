import z from "zod";
import type { ComposerTranslation } from "vue-i18n";
import type { LoginRequest } from "#types/auth";

export const loginValidation = (
  t: ComposerTranslation,
): z.ZodType<LoginRequest> =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.login.email.required"))
      .min(5, t("validation.login.email.min"))
      .max(255, t("validation.login.email.max"))
      .email(t("validation.login.email.invalid")),
    password: z
      .string()
      .min(1, t("validation.login.password.required"))
      .min(8, t("validation.login.password.min"))
      .max(255, t("validation.login.password.max")),
    rememberMe: z.boolean().optional().default(false),
  });
