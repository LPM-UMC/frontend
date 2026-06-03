export type ScoreResponse = {
  skor: number | null;
  persentase: number | null;
  kategori: string | null;
};

export type AspectScoreResponse = {
  id: string;
  nama: string;
  deskripsi: string;
  aspek_periode_modul_id: string;
  skor?: ScoreResponse;
};

