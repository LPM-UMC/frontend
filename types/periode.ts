export type semester = 'GANJIL' | 'GENAP';

export type kalenderResponse = {
  id: string;
  nama: string;
  size?: number;
  tipe?: string;
}

export type PeriodeResponse = {
  id: string;
  tahun_ajaran: string;
  semester: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  is_aktif?: boolean;
  kalender?: kalenderResponse;
  created_at?: string;
  updated_at?: string;
}

export type CreatePeriodeRequest = {
  tahun_ajaran: string;
  semester: semester;
  tanggal_mulai: string;
  tanggal_selesai: string;
  file_kalender: File;
}

export type UpdatePeriodeRequest = {
  tanggal_mulai: string;
  tanggal_selesai: string;
  file_kalender?: File;
}
