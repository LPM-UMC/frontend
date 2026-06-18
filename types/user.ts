import type { RoleResponse } from "./role";

export type UserSummaryResponse = {
  id: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email?: string;
  picture?: string | null;
}

export type UserResponse = {
  id: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email?: string;
  roles?: RoleResponse[];
  picture?: string | null;
  instagram?: string | null;
  linkedin?: string | null;

  // user memiliki assistant
  assistants?: UserSummaryResponse[];

  // user menjadi assistant milik siapa
  assistant_of?: UserSummaryResponse;

  created_at?: string;
  updated_at?: string;
}

export type CreateUserRequest = {
  nim?: string;
  nidn?: string;
  nama: string;
  email: string;
  role_ids: string[];
}

export type UpdateUserRequest = {
  email: string;
  role_ids: string[];
}

export type UpdatePasswordRequest = {
  password: string;
}

export type AssignAssistantRequest = {
  user_ids: string[];
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
