import type { RoleResponse } from "./role";
import type { UserResponse } from "./user";

export type CreateLingkupRequest = {
  nama: string;
  deskripsi: string;
  role_auditee_id: string;
  role_evaluator_id: string;
  role_reviewer_id?: string;
};

export type UpdateLingkupRequest = {
  deskripsi: string;
};

export type LingkupResponse = {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  role_auditee?: RoleResponse;
  role_evaluator?: RoleResponse;
  role_reviewer?: RoleResponse;
  is_aktif?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type CreateLingkupUnitRequest = {
  nama: string;
  deskripsi: string;
  auditee_id: string;
  evaluator_id: string;
  reviewer_id?: string;
};

export type UpdateLingkupUnitRequest = {
  deskripsi: string;
  auditee_id: string;
  evaluator_id: string;
  reviewer_id?: string;
};

export type LingkupUnitResponse = {
  id: string;
  nama: string;
  deskripsi?: string;
  auditee?: UserResponse;
  evaluator?: UserResponse;
  reviewer?: UserResponse;
  lingkup?: LingkupResponse;
  created_at?: Date;
  updated_at?: Date;
};
