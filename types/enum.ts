export enum semester {
  GANJIL,
  GENAP,
}

export enum tipe_modul {
  MONEV,
  AMI,
}

export enum kode_fm {
  MONITORING,
  HASIL_EVALUASI,
  TEMUAN,
  RTL,
  BERITA_ACARA,
  SURVEI,
  LAPORAN,
}

export enum Lang {
  id_ID,
  en_US,
  ar_SA,
  ja_JP,
}

export enum tipe_role_lingkup {
  AUDITEE,
  EVALUATOR,
  REVIEWER,
}

export enum tipe_data {
  STRING,
  NUMBER,
  BOOLEAN,
  DATETIME,
}

export enum tipe_evaluasi {
  BINER,
  SKALA,
  CEK,
}

export enum status_pelaksanaan {
  DIBATALKAN,
  BELUM_DIMULAI,
  SEDANG_BERLANGSUNG,
  SELESAI,
}

export enum kategori_skor {
  KURANG,
  CUKUP,
  BAIK,
  SANGAT_BAIK,
}

export enum status_proses {
  DRAFT,
  DIVALIDASI,
  DITOLAK,
}

export enum kategori_rpn {
  RENDAH,
  SEDANG,
  TINGGI,
}

export enum status_sync_eksternal {
  PENDING,
  RUNNING,
  FAILED,
  COMPLETED,
}
