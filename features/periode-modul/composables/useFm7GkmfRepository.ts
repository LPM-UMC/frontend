import { ref } from 'vue'
import { useApiRequest } from '#features/shared/api/http'
import {
  FM7_ACTIVE_DUMMY_ROLE,
  buildFm7DetailFromRecord,
  cloneFm7Narrative,
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
  type Fm7WorkflowStatus,
  defaultNarrativeTemplate,
  createPageTemplate,
  mapWorkflowToRowStatus,
} from '#features/periode-modul/data/fm7Model'

type Fm7SourceMode = 'auto' | 'api'
type Fm7ResolvedSource = 'api'

export const FM7_GKMF_ENDPOINTS = {
  dashboard: (context: Fm7DashboardContext) =>
    `/api/fm7/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/dashboard`,
  createPage: (context: Fm7DashboardContext) =>
    `/api/fm7/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}/dashboard`, // Not specifically a create endpoint, maybe reuse dashboard or create custom later
  detail: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/fm7/${encodeURIComponent(laporanId)}`,
  create: (context: Fm7DashboardContext) =>
    `/api/fm7/periode-modul/${encodeURIComponent(context.periodeModulId)}/unit/${encodeURIComponent(context.unitId)}`,
  updateNarration: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/fm7/${encodeURIComponent(laporanId)}`,
  submit: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/fm7/${encodeURIComponent(laporanId)}/ajukan`,
  exportPdf: (context: Fm7DashboardContext, laporanId: string) =>
    `/api/fm7/pdf/${encodeURIComponent(laporanId)}`,
}

export function useFm7GkmfRepository(initialMode: Fm7SourceMode = 'api') {
  const mode = ref<Fm7SourceMode>(initialMode)
  const resolvedSource = ref<Fm7ResolvedSource>('api')
  const { request } = useApiRequest()

  async function getDashboardData(
    context: Fm7DashboardContext,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7DashboardDummyData> {
      const apiData = await request<any>(
        FM7_GKMF_ENDPOINTS.dashboard(context)
      )

      const dummyBase = {
        context,
        role,
        hero: {
          title: "Daftar Laporan MONEV",
          description: "Modul Laporan MONEV merupakan instrumen agregasi capaian indikator dan simpulan evaluasi.",
          bulletPoints: [
            "Rekapitulasi otomatis capaian indikator kuantitatif",
            "Sintesis temuan utama dari tahap evaluasi sebelumnya"
          ],
          createButtonLabel: "Buat Laporan Baru"
        },
        indicatorTitle: 'Capaian Indikator',
        indicators: [
          { id: "total-berita-acara", title: "Total Laporan", value: 0, type: "primary", subtitle: "Laporan yang terdaftar", progressPercent: 100 },
          { id: "draft", title: "Draft", value: 0, type: "warning", subtitle: "Masih dalam penyusunan", progressPercent: 100 },
          { id: "proses", title: "Proses (Review/Revisi)", value: 0, type: "info", subtitle: "Sedang diproses", progressPercent: 100 },
          { id: "final", title: "Final (Selesai)", value: 0, type: "success", subtitle: "Telah disetujui", progressPercent: 100 }
        ],
        tableTitle: 'Daftar Laporan MONEV',
        searchPlaceholder: 'Search',
        dateFilterOptions: [
          { value: 'all', label: 'Semua Tanggal' }
        ],
        programFilterOptions: [
          { value: 'all', label: 'Semua Prodi' }
        ],
        rows: []
      };

      if (apiData?.data) {
        resolvedSource.value = 'api'
        
        // Update indicator values with actual data from API meta
        if (apiData.meta) {
          dummyBase.indicators = dummyBase.indicators.map((ind: any) => {
            if (ind.id === 'total-berita-acara') {
              return { ...ind, value: apiData.meta.total_count || 0 }
            }
            if (ind.id === 'draft') {
              return { ...ind, value: apiData.meta.draft_count || 0 }
            }
            if (ind.id === 'proses') {
              return { ...ind, value: apiData.meta.proses_count || 0 }
            }
            if (ind.id === 'final') {
              return { ...ind, value: apiData.meta.final_count || 0 }
            }
            return ind
          })
        }

        return {
          ...dummyBase,
          rows: apiData.data.map((item: any) => ({
            id: item.id,
            kodeLaporan: item.kode_laporan,
            fakultasId: item.fakultas,
            programStudiId: item.program_studi,
            programStudi: item.program_studi,
            fakultas: item.fakultas,
            semester: item.semester,
            tahunAkademik: item.tahun_akademik,
            dibuatOleh: item.dibuat_oleh?.nama || '',
            tanggalMulai: item.tanggal_mulai ? item.tanggal_mulai.substring(0, 10) : '',
            status: mapWorkflowToRowStatus(item.status.toLowerCase() as any),
          })),
        }
      }
      
      console.error('API Dashboard returned empty or failed:', apiData);
      return {
        ...dummyBase,
        rows: []
      };
  }

  async function getCreatePageData(
    context: Fm7DashboardContext,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7CreatePageDummyData> {
      try {
        const apiData = await request<Fm7CreatePageDummyData>(
          FM7_GKMF_ENDPOINTS.createPage(context)
        )

        if (apiData) {
          resolvedSource.value = 'api'
          return {
            ...createPageTemplate,
            ...apiData,
            context,
            role,
            // Ensure nested arrays from template are maintained if API doesn't provide them
            fakultasOptions: apiData.fakultasOptions || [],
            sourceItems: apiData.sourceItems || createPageTemplate.sourceItems,
            impactLines: apiData.impactLines || createPageTemplate.impactLines,
          } as Fm7CreatePageDummyData
        }
      } catch (err) {
        console.error('API /createPage failed:', err)
      }
    
    console.error('API /createPage failed or returned empty data');
    return {
      ...createPageTemplate,
      context,
      role,
      fakultasOptions: [],
      sourceItems: createPageTemplate.sourceItems.map((item: any) => ({ ...item })),
      impactLines: [...createPageTemplate.impactLines],
    }
  }

  async function getReportData(
    context: Fm7DashboardContext,
    laporanId: string,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE
  ): Promise<Fm7ReportDetailDummyData> {
      const apiData = await request<any>(
        FM7_GKMF_ENDPOINTS.detail(context, laporanId)
      )

      if (apiData?.data) {
        resolvedSource.value = 'api'
        
        const record: Fm7ReportRecord = {
          id: apiData.data.id,
          kodeLaporan: apiData.data.kode_laporan,
          programStudiId: apiData.data.program_studi,
          programStudi: apiData.data.program_studi,
          fakultasId: apiData.data.fakultas,
          fakultas: apiData.data.fakultas,
          semester: apiData.data.semester,
          tahunAkademik: apiData.data.tahun_akademik,
          dibuatOleh: apiData.data.dibuat_oleh?.nama || '',
          tanggalMulai: apiData.data.tanggal_mulai ? apiData.data.tanggal_mulai.substring(0,10) : '',
          workflowStatus: apiData.data.status.toLowerCase() as Fm7WorkflowStatus,
          narasi: {
            kataPengantar: apiData.data.kata_pengantar || '',
            bab1LatarBelakang: apiData.data.bab_1_latar_belakang || '',
            bab1Tujuan: apiData.data.bab_1_tujuan || '',
            bab1DasarHukum: apiData.data.bab_1_dasar_hukum || '',
            bab4Simpulan: apiData.data.bab_4_simpulan || '',
            bab4Rekomendasi: apiData.data.bab_4_rekomendasi || '',
          }
        };
        return buildFm7DetailFromRecord(context, record, role)
      }
      
      throw new Error('Gagal memuat detail laporan dari server');
  }

  async function createReport(
    context: Fm7DashboardContext,
    payload: Fm7CreatePayload
  ): Promise<Fm7CreateResult> {
      const selectedProgramData = resolveProgramByIds(payload.fakultasId, payload.programStudiId)
      
      let fakultasLabel = selectedProgramData?.fakultas.label ?? 'Fakultas';
      let programStudiLabel = selectedProgramData?.programStudi.label ?? 'Program Studi';
      
      // If resolving failed (e.g., using dynamic fallback header IDs)
      if (!selectedProgramData) {
        const { useFm5Store } = await import('#imports');
        const fm5Store = useFm5Store();
        if (fm5Store.informasi?.unit_lingkup) {
           programStudiLabel = fm5Store.informasi.unit_lingkup.nama;
        }
      }

      const apiPayload = {
        fakultas: fakultasLabel,
        program_studi: programStudiLabel,
        semester: selectedProgramData?.programStudi.semester ?? 'Ganjil',
        tahun_akademik: selectedProgramData?.programStudi.tahunAkademik ?? '2024/2025',
        kata_pengantar: defaultNarrativeTemplate.kataPengantar,
        bab_1_latar_belakang: defaultNarrativeTemplate.bab1LatarBelakang,
        bab_1_tujuan: defaultNarrativeTemplate.bab1Tujuan,
        bab_1_dasar_hukum: defaultNarrativeTemplate.bab1DasarHukum,
        bab_4_simpulan: defaultNarrativeTemplate.bab4Simpulan,
        bab_4_rekomendasi: defaultNarrativeTemplate.bab4Rekomendasi,
      }

      const apiData = await request<any>(
        FM7_GKMF_ENDPOINTS.create(context),
        { method: 'POST', body: apiPayload }
      )
      
      if (apiData?.data?.id) {
         resolvedSource.value = 'api'
         return { id: apiData.data.id }
      }
      
      throw new Error('Gagal membuat laporan baru ke server');
  }

  async function updateNarrative(
    context: Fm7DashboardContext,
    laporanId: string,
    payload: Fm7NarrativePayload
  ): Promise<boolean> {
      const apiPayload = {
        kata_pengantar: payload.kataPengantar,
        bab_1_latar_belakang: payload.bab1LatarBelakang,
        bab_1_tujuan: payload.bab1Tujuan,
        bab_1_dasar_hukum: payload.bab1DasarHukum,
        bab_4_simpulan: payload.bab4Simpulan,
        bab_4_rekomendasi: payload.bab4Rekomendasi,
      }

      const apiData = await request<any>(
        FM7_GKMF_ENDPOINTS.updateNarration(context, laporanId),
        { method: 'PUT', body: apiPayload }
      )

      if (apiData?.data) {
        resolvedSource.value = 'api'
        return true
      }
      
      throw new Error('Gagal memperbarui narasi laporan ke server');
  }

  async function submitReport(
    context: Fm7DashboardContext,
    laporanId: string,
    role: Fm7DummyRole = FM7_ACTIVE_DUMMY_ROLE,
    payload: Fm7SubmitPayload
  ): Promise<boolean> {
      let apiData = null;
      if (role === 'gkmf') {
         apiData = await request<any>(
           FM7_GKMF_ENDPOINTS.submit(context, laporanId),
           { method: 'PATCH' }
         )
      } else {
         const roleCode = role;
         apiData = await request<any>(
           `/api/fm7/${encodeURIComponent(laporanId)}/sign`,
           { 
             method: 'PATCH',
             headers: { 'X-Role-Code': roleCode.replace('_', '-') } 
           }
         )
      }

      if (apiData?.data) {
        resolvedSource.value = 'api'
        return true
      }
      
      throw new Error('Gagal mensubmit laporan ke server');
  }

  async function exportPdf(
    context: Fm7DashboardContext,
    laporanId: string
  ): Promise<boolean> {
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
      
      throw new Error('Gagal melakukan export PDF laporan');
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
