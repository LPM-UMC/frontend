import type { AspekResponse } from "./aspek";
import type { FMResponse } from "./fm.model";
import type { ModulResponse } from "./modul";
import type { status_pelaksanaan } from "./enum";
import type { PeriodeResponse } from "./periode";
import type { ObjekResponse } from "./objek-evaluasi";
import type { IndikatorResponse } from "./indikator-evaluasi";
import type { LingkupUnitResponse } from "./lingkup-evaluasi";
import type { BuktiInstrumenResponse } from "./fm01-monitoring";

export type PeriodeFMRequest = {
  tanggal_mulai: Date;
  tanggal_selesai: Date;
};

export type CreatePeriodeModulRequest = {
  monitoring: PeriodeFMRequest;
  hasil_evaluasi: PeriodeFMRequest;
  temuan: PeriodeFMRequest;
  rtl: PeriodeFMRequest;
  berita_acara: PeriodeFMRequest;
  survei: PeriodeFMRequest;
  laporan: PeriodeFMRequest;
};

export type RiwayatPeriodeModulResponse = {
  id: string;
  status_pelaksanaan: {
    kode: status_pelaksanaan;
    label: string;
  };
  tanggal: string;
  created_at?: string;
  updated_at?: string;
}

export type FMPeriodeModulResponse = {
  id: string;
  fm: FMResponse;
  status_pelaksanaan?: {
    kode: status_pelaksanaan;
    label: string;
  };
  tanggal_mulai: string;
  tanggal_selesai: string;
  created_at?: string;
  updated_at?: string;
}

export type UnitLingkupPeriodeModulResponse = {
  id: string;
  unit_lingkup: LingkupUnitResponse;
  created_at?: string;
  updated_at?: string;
}

export type FMInformationResponse = {
  periode_modul: PeriodeModulResponse;
  unit_lingkup: LingkupUnitResponse;
  fm: FMPeriodeModulResponse;
};

export type LingkupPeriodeModulResponse = {
  id: string;
  unit_lingkup_periode_moduls: UnitLingkupPeriodeModulResponse[];
  created_at?: string;
  updated_at?: string;
}

export type AspekPeriodeModulResponse = {
  id: string;
  bukti_instrumen?: BuktiInstrumenResponse;
  objek?: ObjekResponse;
  indikator_periode_modul?: IndikatorPeriodeModulResponse[];
  aspek: AspekResponse;
  created_at?: string;
  updated_at?: string;
}

export type IndikatorPeriodeModulResponse = {
  id: string;
  indikator: IndikatorResponse;
  created_at?: string;
  updated_at?: string;
}

export type PeriodeModulResponse = {
  id: string;
  status_pelaksanaan: {
    kode: status_pelaksanaan;
    label: string;
  },
  status_periode_moduls?: RiwayatPeriodeModulResponse[];
  fm_periode_moduls?: FMPeriodeModulResponse[];
  periode?: PeriodeResponse;
  unit_lingkup_periode_moduls?: UnitLingkupPeriodeModulResponse[];
  modul?: ModulResponse;
  created_at?: string;
  updated_at?: string;
}

