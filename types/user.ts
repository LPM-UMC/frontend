import type { RoleResponse } from "./role";

export type UserResponse = {
  id: string;
  nidn?: string;
  nama: string;
  email?: string;
  roles?: RoleResponse[];
  picture?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateUserRequest = {
  nidn: string;
  nama: string;
  email: string;
  role_ids: string[];
}

export type UpdateUserRequest = {
  email: string;
  role_ids: string[];
}

export type UpdateProfileRequest = {
  nama: string;
  email: string;
  instagram: string;
  linkedin: string;
}

export type UpdateProfileImageRequest = {
  picture: File;
}
