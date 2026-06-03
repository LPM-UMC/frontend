import { z } from "zod";
import type { CreatePeriodeModulRequest } from "../types/periode-modul-type";

const periodeSchema = z.object({
  tanggal_mulai: z.coerce.date(),
  tanggal_selesai: z.coerce.date(),
});

export const createPeriodeModulValidation: z.ZodType<CreatePeriodeModulRequest> = z
  .object({
    monitoring: periodeSchema,
    hasil_evaluasi: periodeSchema,
    temuan: periodeSchema,
    rtl: periodeSchema,
    berita_acara: periodeSchema,
    survei: periodeSchema,
    laporan: periodeSchema,
  })
  .superRefine((data, ctx) => {
    // =====================================================
    // VALIDASI: MONITORING HARUS > 1 HARI DARI HARI INI
    // =====================================================
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0); // Reset jam agar murni membandingkan tanggal

    const monitoringMulai = new Date(data.monitoring.tanggal_mulai);
    monitoringMulai.setHours(0, 0, 0, 0);

    // Hitung selisih hari
    const diffMsMonitoring = monitoringMulai.getTime() - hariIni.getTime();
    const diffDaysMonitoring = diffMsMonitoring / (1000 * 60 * 60 * 24);

    // Jika selisihnya kurang dari atau sama dengan 1 hari (harus H+2 dan seterusnya)
    if (diffDaysMonitoring <= 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tahap monitoring harus dimulai minimal lebih dari 1 hari dari hari ini (H+2)",
        path: ["monitoring", "tanggal_mulai"],
      });
    }

    const periodeList = [
      { key: "monitoring", value: data.monitoring },
      { key: "hasil_evaluasi", value: data.hasil_evaluasi },
      { key: "temuan", value: data.temuan },
      { key: "rtl", value: data.rtl },
      { key: "berita_acara", value: data.berita_acara },
      { key: "survei", value: data.survei },
      { key: "laporan", value: data.laporan },
    ] as const;

    // =====================================================
    // VALIDASI TANGGAL MULAI < TANGGAL SELESAI MINIMAL 1 HARI
    // =====================================================
    for (const periode of periodeList) {
      const mulai = periode.value.tanggal_mulai;
      const selesai = periode.value.tanggal_selesai;

      const diffMs = selesai.getTime() - mulai.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal selesai harus minimal sehari setelah tanggal mulai",
          path: [periode.key, "tanggal_selesai"],
        });
      }
    }

    // =====================================================
    // VALIDASI URUTAN FM
    // =====================================================
    for (let i = 0; i < periodeList.length - 1; i++) {
      const current = periodeList[i];
      const next = periodeList[i + 1];

      if (!current || !next) {
        continue;
      }

      if (next.value.tanggal_mulai < current.value.tanggal_selesai) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${next.key} harus dimulai setelah ${current.key} selesai`,
          path: [next.key, "tanggal_mulai"],
        });
      }
    }
  });
