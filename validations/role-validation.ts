import z from "zod";
import type { CreateRoleRequest, UpdateRoleRequest } from "../types/role-type";

export const createRoleValidation: z.ZodType<CreateRoleRequest> = z.object({
  nama: z.string().min(1).max(25),
  deskripsi: z.string().min(1).max(255),
});

export const updateRoleValidation: z.ZodType<UpdateRoleRequest> = z.object({
  deskripsi: z.string().min(1).max(255),
});
