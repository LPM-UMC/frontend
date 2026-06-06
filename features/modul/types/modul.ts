export interface ModulRecord {
  id: string
  tipe_modul: string
  nama: string
  deskripsi: string
  lingkup_evaluasi: {
    id: string
    nama: string
  }
  total_aspek: number
}

export interface ModulFormInput {
  lingkup_id: string
  nama: string
  deskripsi: string
}
