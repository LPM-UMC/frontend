import type { Lang } from "./enum";
import type { UserResponse } from "./user";

export type JawabInstrumenRequest = {
  biner?: boolean;
  skala_id?: string;
  cek_ids?: string[];
  catatan: string;
};

export type SimpanBuktiInstrumenRequest = {
  link: string;
  catatan: string;
};

export type UpsertUnitObjekEvaluasiRequest = {
  values: {
    kolom_id: string;
    value: any;
  }[];
};

export type BuktiInstrumenResponse = {
  id: string;
  link: string | null;
  catatan: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ValueKolomResponse = {
  id: string;
  key: string;
  value: any;
};

export type FM1UnitObjectHeaderResponse = {
  id: string;
  key: string;
  label: string;
};

export type FM1UnitObjectDataResponse = {
  id?: string;
  value_koloms: ValueKolomResponse[];
};

export type IndikatorAndAnswerResponse = {
  id: string;
  indikator: {
    id: string;
    nama: string;
    deskripsi: string | null;
    tipe_evaluasi: string;
  };
  opsi: {
    skalas: {
      id: string;
      nilai: number;
      nama: string;
    }[];
    checklists: {
      id: string;
      nama: string;
    }[];
  };
  jawaban: {
    id: string;
    selected_biner: boolean | null;
    selected_skala_id: string | null;
    selected_checklist_ids: string[];
    catatan: string | null;
  } | null;
  user?: UserResponse;
};

export type ToIndikatorAndAnswerResponseParams = {
  lang: Lang;
  indikatorPeriodeModul: any;
  jawaban?: any | null;
};
