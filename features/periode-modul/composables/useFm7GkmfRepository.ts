import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  FM7_ACTIVE_DUMMY_ROLE,
  buildFm7DetailFromRecord,
  cloneFm7Narrative,
  cloneFm7ReportRecord,
  createFm7InitialReports,
  getFm7CreatePageDummyData,
  getFm7DashboardDummyData,
  isFm7RoleActionAllowed,
  resolveFm7NextWorkflowStatus,
  resolveProgramByIds,
  type Fm7CreatePageDummyData,
  type Fm7CreatePayload,
  type Fm7CreateResult,
  type Fm7DashboardContext,
  type Fm7DashboardDummyData,
  type Fm7DummyRole,
  type Fm7NarrativePayload,
  type Fm7ReportDetailDummyData,
  type Fm7ReportRecord,
  type Fm7SubmitPayload,
} from '#features/periode-modul/data/fm7GkmfDummy'

type Fm7SourceMode = 'auto' | 'api' | 'dummy'
type Fm7ResolvedSource = 'api' | 'dummy'

const fm7DummyState = ref<Fm7ReportRecord[]>(createFm7InitialReports())

export const FM7_GKMF_ENDPOINTS = {
  dashboard: (context: Fm7DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7`,
  createPage: (context: Fm7DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7/create`,
  detail: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7/laporan/${encodeURIComponent(laporanId)}`,
  create: (context: Fm7DashboardContext) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7`,
  updateNarration: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7/laporan/${encodeURIComponent(laporanId)}`,
  submit: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7/laporan/${encodeURIComponent(laporanId)}/submit`,
  exportPdf: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/v1/dashboard/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/fm7/laporan/${encodeURIComponent(laporanId)}/export`,
}

function findReportRecord(reportId: string): Fm7ReportRecord | null {
  const found = fm7DummyState.value.find((item) => item.id === reportId)
  return found ? cloneFm7ReportRecord(found) : null
}

function persistReportRecord(nextRecord: Fm7ReportRecord) {
  const index = fm7DummyState.value.findIndex((item) => item.id === nextRecord.id)
  if (index === -1) {
    fm7DummyState.value = [nextRecord, ...fm7DummyState.value]
    return
  }

  const next = [...fm7DummyState.value]
  next[index] = nextRecord
  fm7DummyState.value = next
}

function createFallbackReport(reportId: string): Fm7ReportRecord {
  const seed = fm7DummyState.value[0] ?? createFm7InitialReports()[0]

  return {
    ...cloneFm7ReportRecord(seed),
    id: reportId,
    kodeLaporan: 'FM07-2025-338',
    workflowStatus: 'draft',
  }
}

function generateReportId(): string {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `fm07-${Date.now()}-${token}`
}

function generateReportCode(): string {
  const baseYear = new Date().getFullYear()
  const serial = String(Math.floor(Math.random() * 900) + 100)
  return `FM07-${baseYear}-${serial}`
}

function resolveTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useFm7GkmfRepository(initialMode: Fm7SourceMode = 'auto') {
  const mode = ref<Fm7SourceMode>(initialMode)
  const resolvedSource = ref<Fm7ResolvedSource>('dummy')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm7DashboardContext,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7DashboardDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm7DashboardDummyData>(
        FM7_GKMF_ENDPOINTS.dashboard(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm7DashboardDummyData(
      context,
      role,
      fm7DummyState.value.map((item) => cloneFm7ReportRecord(item))
    )
  }

  async function getCreatePageData(
    context: Fm7DashboardContext,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7CreatePageDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm7CreatePageDummyData>(
        FM7_GKMF_ENDPOINTS.createPage(context)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'
    return getFm7CreatePageDummyData(context, role)
  }

  async function getReportData(
    context: Fm7DashboardContext,
    laporanId: string,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7ReportDetailDummyData> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm7ReportDetailDummyData>(
        FM7_GKMF_ENDPOINTS.detail(context, laporanId)
      )

      if (apiData) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'

    const existingRecord = findReportRecord(laporanId)
    if (existingRecord) {
      return buildFm7DetailFromRecord(context, existingRecord, role)
    }

    const fallback = createFallbackReport(laporanId)
    persistReportRecord(fallback)
    return buildFm7DetailFromRecord(context, fallback, role)
  }

  async function createReport(
    context: Fm7DashboardContext,
    payload: Fm7CreatePayload
  ): Promise<Fm7CreateResult> {
    if (mode.value !== 'dummy') {
      const apiData = await request<Fm7CreateResult>(
        FM7_GKMF_ENDPOINTS.create(context),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (apiData?.id) {
        resolvedSource.value = 'api'
        return apiData
      }
    }

    resolvedSource.value = 'dummy'

    const selectedProgramData = resolveProgramByIds(payload.fakultasId, payload.programStudiId)
    const reportId = generateReportId()

    const nextRecord: Fm7ReportRecord = {
      id: reportId,
      kodeLaporan: generateReportCode(),
      programStudiId: payload.programStudiId,
      programStudi: selectedProgramData?.programStudi.label ?? 'Program Studi',
      fakultasId: payload.fakultasId,
      fakultas: selectedProgramData?.fakultas.label ?? 'Fakultas',
      semester: `${selectedProgramData?.programStudi.semester ?? 'Ganjil'} ${selectedProgramData?.programStudi.tahunAkademik ?? '2024/2025'}`,
      tahunAkademik: selectedProgramData?.programStudi.tahunAkademik ?? '2024/2025',
      dibuatOleh: 'Fulanm M.Kom',
      tanggalMulai: resolveTodayIsoDate(),
      workflowStatus: 'draft',
      narasi: cloneFm7Narrative({
        kataPengantar:
          '[Draft] Puji syukur kehadirat Tuhan Yang Maha Esa atas tersusunnya Laporan Monitoring dan Evaluasi pembelajaran semester ganjil tahun akademik 2024/2025 untuk Program Studi Teknik Mesin Fakultas Teknik Universitas Muhammadiyah Cirebon.',
        bab1LatarBelakang:
          'Monitoring dan evaluasi pembelajaran merupakan bagian integral dari sistem penjaminan mutu internal perguruan tinggi. Kegiatan ini bertujuan untuk memastikan bahwa proses pembelajaran berjalan sesuai dengan standar yang telah ditetapkan.',
        bab1Tujuan:
          '1. Memastikan kesiapan dosen dan mahasiswa dalam proses pembelajaran 2. Mengevaluasi kelengkapan RPS dan bahan ajar 3. Mengidentifikasi potensi masalah 4. Memberikan rekomendasi perbaikan',
        bab1DasarHukum:
          '1. UU No. 12 Tahun 2012 tentang Pendidikan Tinggi 2. Permendikbud No. 3 Tahun 2020 tentang SN Dikti 3. Peraturan Rektor tentang SPMI UMC',
        bab4Simpulan: '[Masih dalam penyusunan - silakan edit setelah data lengkap]',
        bab4Rekomendasi: '[Masih dalam penyusunan - silakan edit setelah data lengkap]',
      }),
    }

    persistReportRecord(nextRecord)

    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm7] create report payload', { context, payload, reportId })

    return {
      id: reportId,
    }
  }

  async function updateNarrative(
    context: Fm7DashboardContext,
    laporanId: string,
    payload: Fm7NarrativePayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ updated: boolean }>(
        FM7_GKMF_ENDPOINTS.updateNarration(context, laporanId),
        {
          method: 'PATCH',
          body: payload,
        }
      )

      if (apiData?.updated) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'

    const current = findReportRecord(laporanId)
    if (!current) return false

    const nextRecord: Fm7ReportRecord = {
      ...current,
      narasi: cloneFm7Narrative(payload),
    }

    persistReportRecord(nextRecord)

    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm7] update narrative payload', { context, laporanId, payload })

    return true
  }

  async function submitReport(
    context: Fm7DashboardContext,
    laporanId: string,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE,
    payload: Fm7SubmitPayload
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ submitted: boolean }>(
        FM7_GKMF_ENDPOINTS.submit(context, laporanId),
        {
          method: 'POST',
          body: payload,
        }
      )

      if (apiData?.submitted) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'

    const current = findReportRecord(laporanId)
    if (!current) return false

    if (!isFm7RoleActionAllowed(role, current.workflowStatus)) {
      return false
    }

    const nextWorkflowStatus = resolveFm7NextWorkflowStatus(role, current.workflowStatus)

    const nextRecord: Fm7ReportRecord = {
      ...current,
      workflowStatus: nextWorkflowStatus,
    }

    persistReportRecord(nextRecord)

    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm7] submit report', { context, laporanId, role, payload, nextWorkflowStatus })

    return true
  }

  async function exportPdf(
    context: Fm7DashboardContext,
    laporanId: string
  ): Promise<boolean> {
    if (mode.value !== 'dummy') {
      const apiData = await request<{ exported: boolean }>(
        FM7_GKMF_ENDPOINTS.exportPdf(context, laporanId),
        {
          method: 'POST',
        }
      )

      if (apiData?.exported) {
        resolvedSource.value = 'api'
        return true
      }
    }

    resolvedSource.value = 'dummy'
    // Placeholder sementara endpoint backend belum tersedia.
    console.info('[fm7] export pdf', { context, laporanId })
    return true
  }

  return {
    mode,
    resolvedSource,
    endpoints: FM7_GKMF_ENDPOINTS,
    getDashboardData,
    getCreatePageData,
    getReportData,
    createReport,
    updateNarrative,
    submitReport,
    exportPdf,
  }
}
