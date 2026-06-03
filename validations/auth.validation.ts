import z from "zod";
import type { LoginRequest } from "../types/auth.type";

export const loginValidation: z.ZodType<LoginRequest> = z.object({
  email: z.string().min(1).max(255).email(),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().optional().default(false),
});
