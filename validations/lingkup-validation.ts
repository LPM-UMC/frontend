import z from "zod";
import type { CreateLingkupRequest, CreateLingkupUnitRequest, UpdateLingkupRequest, UpdateLingkupUnitRequest } from "../types/lingkup-type";

export const createLingkupValidation: z.ZodType<CreateLingkupRequest> = z.object({
  nama: z.string().min(1).max(25),
  deskripsi: z.string().min(1).max(500),
  role_auditee_id: z.string().uuid(),
  role_evaluator_id: z.string().uuid(),
  role_reviewer_id: z.string().uuid().optional(),
});

export const updateLingkupValidation: z.ZodType<UpdateLingkupRequest> = z.object({
  deskripsi: z.string().min(1).max(500),
});

export const createUnitLingkupValidation: z.ZodType<CreateLingkupUnitRequest> = z.object({
  nama: z.string().min(1).max(25),
  deskripsi: z.string().min(1).max(500),
  auditee_id: z.string().uuid(),
  evaluator_id: z.string().uuid(),
  reviewer_id: z.string().uuid().optional(),
});

export const updateUnitLingkupValidation: z.ZodType<UpdateLingkupUnitRequest> = z.object({
  deskripsi: z.string().min(1).max(500),
  auditee_id: z.string().uuid(),
  evaluator_id: z.string().uuid(),
  reviewer_id: z.string().uuid().optional(),
});
