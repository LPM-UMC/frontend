import z from "zod";
import type { CreateUserRequest, UpdatePasswordRequest, UpdateProfileImageRequest, UpdateProfileRequest, UpdateUserRequest } from "../types/user-type";

export const createUserValidation: z.ZodType<CreateUserRequest> = z.object({
  nidn: z.string().min(1).max(20).optional(),
  nim: z.string().min(1).max(20).optional(),
  nama: z.string().min(1).max(30),
  email: z.string().min(1).max(255).email(),
  role_ids: z.array(z.string().uuid()).min(1).max(10),
});

export const updateUserValidation: z.ZodType<UpdateUserRequest> = z.object({
  email: z.string().min(1).max(255).email(),
  role_ids: z.array(z.string().uuid()).min(1).max(10),
});

export const updateProfileValidation: z.ZodType<UpdateProfileRequest> = z.object({
  nama: z.string().min(1).max(255),
  email: z.string().min(1).max(255).email(),
  instagram: z.string().min(1).max(255),
  linkedin: z.string().min(1).max(255),
});

export const updateProfileImageValidation: z.ZodType<UpdateProfileImageRequest> = z.object({
  picture: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5mb",
  }).refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  }),
});

export const updatePasswordValidation: z.ZodType<UpdatePasswordRequest> = z.object({
  password: z.string().min(1).max(128),
});
