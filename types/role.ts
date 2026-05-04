export type RoleResponse = {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  jumlah_user?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateRoleRequest = {
  nama: string;
  deskripsi: string;
}

export type UpdateRoleRequest = {
  deskripsi: string;
}
