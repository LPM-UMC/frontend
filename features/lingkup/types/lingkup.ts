export interface LingkupRecord {
  id: string
  nama: string
  deskripsi: string
  lingkup_evaluasi_roles?: any[]
  role_auditee?: { id: string; nama: string; kode: string }
  role_evaluator?: { id: string; nama: string; kode: string }
  created_at?: string
  updated_at?: string
}

export interface LingkupFormInput {
  nama: string
  deskripsi: string
  role_auditee_id: string
  role_evaluator_id: string
}
