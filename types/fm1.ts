export type FMInformationResponse = {
  periode_modul: any;
  unit_lingkup: any;
  fm: any;
};

export type AspekPeriodeModulResponse = {
  id: string;
  bukti_instrumen?: any;
  objek?: any;
  indikator_periode_modul?: any[];
  aspek: any;
  created_at?: string;
  updated_at?: string;
};

export type UnitObjekHeader = {
  id: string;
  key: string;
  label: string;
};

export type UnitObjekData = {
  id: string;
  value_koloms: {
    id: string;
    key: string;
    value: string | number | boolean;
  }[];
};

export type UnitObjekTableResponse = {
  header: UnitObjekHeader[];
  data: UnitObjekData[];
  meta: {
    total: number;
    page: number;
    size: number;
    total_pages: number;
  };
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
  user?: any;
};

export type JawabInstrumenRequest = {
  biner?: boolean;
  skala_id?: string;
  cek_ids?: string[];
  catatan: string;
};

export type BuktiInstrumenResponse = {
  id: string;
  link: string | null;
  catatan: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BuktiInstrumenDetailResponse = {
  aspek: {
    id: string;
    nama: string;
    deskripsi: string | null;
  };
  panduan: {
    id: string;
    link: string | null;
    catatan: string | null;
  } | null;
  bukti_instrumen: BuktiInstrumenResponse | null;
};
