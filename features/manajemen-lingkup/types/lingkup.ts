export interface LingkupRecord {
  id: string
  nama: string
  deskripsi: string
  lingkup_evaluasi_roles?: any[]
  created_at?: string
  updated_at?: string
}

export interface LingkupFormInput {
  nama: string
  deskripsi: string
  role_penanggung_jawab_id: string
  role_evaluator_id: string
}
