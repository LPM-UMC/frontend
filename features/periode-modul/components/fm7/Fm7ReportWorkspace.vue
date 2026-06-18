<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm7GkmfRepository } from '#features/periode-modul/composables/useFm7GkmfRepository'
import {
  resolveFm7DummyRole,
  resolveFm7WorkflowLabel,
  resolveFm7WorkflowOrder,
  type Fm7ActionTone,
  type Fm7DashboardContext,
  type Fm7DummyRole,
  type Fm7NarrativePayload,
  type Fm7ReportDetailDummyData,
  type Fm7SignatureRoleRow,
  type Fm7SubmitPayload,
} from '#features/periode-modul/data/fm7GkmfDummy'

const props = withDefaults(defineProps<{ mode?: 'view' | 'edit' }>(), {
  mode: 'view',
})

const route = useRoute()
const repository = useFm7GkmfRepository('auto')

const detailData = ref<Fm7ReportDetailDummyData | null>(null)
const loading = ref(true)
const saving = ref(false)
const submitting = ref(false)
const isConfirmModalOpen = ref(false)

const narrativeForm = reactive<Fm7NarrativePayload>({
  kataPengantar: '',
  bab1LatarBelakang: '',
  bab1Tujuan: '',
  bab1DasarHukum: '',
  bab4Simpulan: '',
  bab4Rekomendasi: '',
})

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

function getFirstQueryValue(value: string | string[] | null | undefined): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value[0] ?? undefined
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(
    route.params.periode_modul_id as string | string[] | undefined,
    'pm-2026-genap'
  )
)

const unitId = computed(() =>
  normalizeRouteParam(
    route.params.unit_id as string | string[] | undefined,
    'unit-tif'
  )
)

const laporanId = computed(() =>
  normalizeRouteParam(
    route.params.laporan_id as string | string[] | undefined,
    'fm07-report-001'
  )
)

const context = computed<Fm7DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const defaultRoleFallback = computed<Fm7DummyRole>(() =>
  props.mode === 'edit' ? 'gkmf' : 'dekan'
)

const activeDummyRole = computed<Fm7DummyRole>(() =>
  resolveFm7DummyRole(
    getFirstQueryValue(route.query.role as string | string[] | null | undefined),
    defaultRoleFallback.value
  )
)

const isEditRoute = computed(() => props.mode === 'edit')

const canEditNarrative = computed(() => detailData.value?.canEditNarrative ?? false)

const isEditing = computed(() => isEditRoute.value && canEditNarrative.value)

const canSubmitReport = computed(() => {
  if (isEditRoute.value) return false
  return detailData.value?.canPerformRoleAction ?? false
})

const showEditButton = computed(() => !isEditRoute.value && canEditNarrative.value)

const showSaveButton = computed(() => isEditing.value)

const activeStepOrder = computed(() => {
  if (!detailData.value) return 1
  return resolveFm7WorkflowOrder(detailData.value.workflowStatus)
})

const semesterLabel = computed(() => {
  const raw = detailData.value?.semester ?? ''
  const segment = raw.split(' ')[0]
  return segment || raw
})

const roleActionStatusLabel = computed(() => {
  if (!detailData.value) return ''
  return `${resolveFm7WorkflowLabel(detailData.value.roleActionFromStatus)} -> ${resolveFm7WorkflowLabel(detailData.value.roleActionToStatus)}`
})

function resolveActionButtonClass(tone: Fm7ActionTone): string {
  if (tone === 'green') return 'bg-[#16a34a] hover:bg-[#12853d]'
  if (tone === 'orange') return 'bg-[#f97316] hover:bg-[#dd640c]'
  if (tone === 'blue') return 'bg-[#2d6be3] hover:bg-[#2258bf]'
  if (tone === 'purple') return 'bg-[#6d28d9] hover:bg-[#5b21b6]'
  return 'bg-[#e30000] hover:bg-[#ca0000]'
}

function resolveActionPillClass(tone: Fm7ActionTone): string {
  if (tone === 'green') return 'bg-[#09a84c]'
  if (tone === 'orange') return 'bg-[#f97316]'
  if (tone === 'blue') return 'bg-[#2d6be3]'
  if (tone === 'purple') return 'bg-[#6d28d9]'
  return 'bg-[#e30000]'
}

function hydrateNarrativeForm(data: Fm7ReportDetailDummyData | null) {
  narrativeForm.kataPengantar = data?.narrative.kataPengantar ?? ''
  narrativeForm.bab1LatarBelakang = data?.narrative.bab1LatarBelakang ?? ''
  narrativeForm.bab1Tujuan = data?.narrative.bab1Tujuan ?? ''
  narrativeForm.bab1DasarHukum = data?.narrative.bab1DasarHukum ?? ''
  narrativeForm.bab4Simpulan = data?.narrative.bab4Simpulan ?? ''
  narrativeForm.bab4Rekomendasi = data?.narrative.bab4Rekomendasi ?? ''
}

function buildDashboardRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm7?role=${encodeURIComponent(activeDummyRole.value)}`
}

function buildDetailRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm7/laporan/${encodeURIComponent(laporanId.value)}?role=${encodeURIComponent(activeDummyRole.value)}`
}

function buildEditRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm7/laporan/${encodeURIComponent(laporanId.value)}/edit?role=${encodeURIComponent(activeDummyRole.value)}`
}

function resolveSignatureToneClass(tone: Fm7SignatureRoleRow['tone']): string {
  if (tone === 'mint') return 'bg-[#e8f4ed] text-[#0a7a43]'
  if (tone === 'blue') return 'bg-[#e8eef9] text-[#204fae]'
  if (tone === 'sand') return 'bg-[#f6f0e7] text-[#bf4a05]'
  if (tone === 'purple') return 'bg-[#eeeaf8] text-[#5b17c5]'
  return 'bg-[#f9ecec] text-[#bf1010]'
}

function resolveProgressCircleClass(order: number): string {
  if (order === activeStepOrder.value) {
    return 'bg-[#697385] text-white'
  }

  if (order < activeStepOrder.value) {
    return 'bg-[#2ea442] text-white'
  }

  return 'bg-[#d7dce4] text-[#8f98a8]'
}

function resolveProgressLineClass(order: number): string {
  return order < activeStepOrder.value ? 'bg-[#93d7a4]' : 'bg-[#d9dde4]'
}

function resolveProgressLabelClass(order: number): string {
  if (order === activeStepOrder.value) return 'text-[#3a4455]'
  if (order < activeStepOrder.value) return 'text-[#1f7c3e]'
  return 'text-[#9099a8]'
}

function resolveWorkflowBadgeClass(status: Fm7ReportDetailDummyData['workflowStatus']): string {
  if (status === 'draft') return 'bg-[#efe3a8] text-[#946406]'
  if (status === 'approved') return 'bg-[#d4f5dd] text-[#117a43]'
  return 'bg-[#dce7fb] text-[#2358bf]'
}

const signatureApprovedMinOrderMap: Record<string, number> = {
  dibuat: 2,
  mengetahui: 3,
  diperiksa: 4,
  'diperiksa-wakil': 4,
  dikoordinasi: 5,
  disetujui: 6,
}

const signatureApprovedInfoMap: Record<string, {
  signedAtDate: string
  signedAtTime: string
  signedLabel: string
  name: string
  nip: string
  roleLabel: string
}> = {
  dibuat: {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.10 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Dr. Siti Nurhaliza',
    nip: '198501012010012001',
    roleLabel: 'GKMF',
  },
  mengetahui: {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.11 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Dr. Budi Santoso, M.Kom',
    nip: '198703152012011003',
    roleLabel: 'Ketua Program Studi',
  },
  diperiksa: {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.20 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Prof. Dr. Ir. Hendra Wijaya',
    nip: '197201032000031001',
    roleLabel: 'Dekan',
  },
  'diperiksa-wakil': {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.21 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Dr. Maya Anggraini, M.Si',
    nip: '197907142005012002',
    roleLabel: 'Wakil Dekan',
  },
  dikoordinasi: {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.30 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Kusna UMM',
    nip: '197701012002121001',
    roleLabel: 'Ketua LPM',
  },
  disetujui: {
    signedAtDate: '4 April 2026',
    signedAtTime: '23.45 WIB',
    signedLabel: 'APPROVED 2026-04-01',
    name: 'Pimpinan Wakil Rektor 1',
    nip: '196812011994031001',
    roleLabel: 'Wakil Rektor 1',
  },
}

function isSignatureApproved(signatureId: string): boolean {
  const threshold = signatureApprovedMinOrderMap[signatureId]
  if (!threshold) return false
  return activeStepOrder.value >= threshold
}

function resolveSignatureApprovedInfo(signatureId: string) {
  return signatureApprovedInfoMap[signatureId] ?? null
}

async function loadDetailData() {
  loading.value = true
  detailData.value = await repository.getReportData(
    context.value,
    laporanId.value,
    activeDummyRole.value
  )
  hydrateNarrativeForm(detailData.value)
  loading.value = false

  if (isEditRoute.value && detailData.value && !detailData.value.canEditNarrative) {
    await navigateTo(buildDetailRoute())
  }
}

async function goBackToDashboard() {
  await navigateTo(buildDashboardRoute())
}

async function goToEditNarrative() {
  if (!canEditNarrative.value) return
  await navigateTo(buildEditRoute())
}

async function handleSaveNarrative() {
  if (!detailData.value || !isEditing.value || saving.value) return

  saving.value = true
  await repository.updateNarrative(context.value, laporanId.value, {
    kataPengantar: narrativeForm.kataPengantar.trim(),
    bab1LatarBelakang: narrativeForm.bab1LatarBelakang.trim(),
    bab1Tujuan: narrativeForm.bab1Tujuan.trim(),
    bab1DasarHukum: narrativeForm.bab1DasarHukum.trim(),
    bab4Simpulan: narrativeForm.bab4Simpulan.trim(),
    bab4Rekomendasi: narrativeForm.bab4Rekomendasi.trim(),
  })
  await loadDetailData()
  saving.value = false
}

async function handleExportPdf() {
  await repository.exportPdf(context.value, laporanId.value)
}

function openConfirmModal() {
  if (!canSubmitReport.value) return
  isConfirmModalOpen.value = true
}

function closeConfirmModal() {
  isConfirmModalOpen.value = false
}

async function confirmSubmitReport() {
  if (!detailData.value || submitting.value) return

  submitting.value = true

  const payload: Fm7SubmitPayload = {
    actorName: detailData.value.createdByName,
    actorNip: detailData.value.createdByNip,
    role: activeDummyRole.value,
    actionLabel: detailData.value.roleActionLabel,
    fromStatus: detailData.value.roleActionFromStatus,
    toStatus: detailData.value.roleActionToStatus,
  }

  await repository.submitReport(context.value, laporanId.value, activeDummyRole.value, payload)
  await loadDetailData()
  closeConfirmModal()
  submitting.value = false

  if (isEditRoute.value) {
    await navigateTo(buildDetailRoute())
  }
}

watch(
  [context, laporanId, activeDummyRole],
  async () => {
    await loadDetailData()
  },
  { immediate: true }
)

</script>

<template>
  <section class="fm7-page mx-auto w-full max-w-[1540px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1680px] xl:px-6">
    <section v-if="detailData" class="space-y-4">
      <header class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-[clamp(0.95rem,1vw,1.08rem)] text-[#536074] transition hover:text-[#2f3b4f]"
          @click="goBackToDashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Daftar Laporan
        </button>

        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="showEditButton"
            type="button"
            class="inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#2d6be3] px-4 text-[clamp(0.92rem,0.96vw,1.02rem)] font-medium text-white transition hover:bg-[#2258bf]"
            @click="goToEditNarrative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m12 20 9-9-3-3-9 9-1 4zM16 7l3 3" />
            </svg>
            Edit Narasi
          </button>

          <button
            v-if="showSaveButton"
            type="button"
            class="inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#16a34a] px-4 text-[clamp(0.92rem,0.96vw,1.02rem)] font-medium text-white transition hover:bg-[#12853d] disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="saving"
            @click="handleSaveNarrative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 3h8l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 3v6h8V3" />
            </svg>
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>

          <button
            v-if="canSubmitReport"
            type="button"
            class="inline-flex h-[42px] items-center gap-2 rounded-[10px] px-4 text-[clamp(0.92rem,0.96vw,1.02rem)] font-medium text-white transition"
            :class="resolveActionButtonClass(detailData.roleActionTone)"
            @click="openConfirmModal"
          >
            <svg
              v-if="detailData.roleActionTone === 'green'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2 11 13" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2 15 22l-4-9-9-4z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 14 2 2 4-4" />
            </svg>
            {{ detailData.roleActionLabel }}
          </button>

          <button
            type="button"
            class="inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#4f5b70] px-4 text-[clamp(0.92rem,0.96vw,1.02rem)] font-medium text-white transition hover:bg-[#404c60]"
            @click="handleExportPdf"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              <path d="M14 2v4h4" />
              <path d="m12 11v6" />
              <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
            </svg>
            Export PDF
          </button>
        </div>
      </header>

      <section class="rounded-[14px] border border-[#d8dce2] bg-[#efefef] px-4 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-5">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <h2 class="text-[clamp(1rem,1.05vw,1.15rem)] font-semibold text-[#1f2a3c]">
            {{ detailData.progressTitle }}
          </h2>
          <span
            class="inline-flex h-7 items-center rounded-full px-3 text-[0.9rem]"
            :class="resolveWorkflowBadgeClass(detailData.workflowStatus)"
          >
            {{ detailData.workflowLabel }}
          </span>
        </div>

        <div class="mt-4 overflow-x-auto pb-1">
          <div class="flex min-w-[760px] items-start xl:min-w-[860px]">
            <template v-for="(step, index) in detailData.progressSteps" :key="step.id">
              <div class="w-[118px] text-center">
                <span
                  class="mx-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-[0.86rem] font-semibold"
                  :class="resolveProgressCircleClass(step.order)"
                >
                  {{ step.order }}
                </span>
                <p class="mt-1 text-[0.72rem]" :class="resolveProgressLabelClass(step.order)">
                  {{ step.label }}
                </p>
              </div>

              <span
                v-if="index < detailData.progressSteps.length - 1"
                class="mt-3 block h-[2px] w-12 rounded-full"
                :class="resolveProgressLineClass(step.order)"
              />
            </template>
          </div>
        </div>
      </section>

      <article class="rounded-[12px] border border-[#f2cd68] bg-[#f7f4e2] px-4 py-3 text-[#a64f08]">
        <p class="text-[clamp(1.02rem,1.06vw,1.16rem)] font-semibold">
          {{ detailData.roleAccessTitle }}
        </p>
        <p class="mt-1 text-[clamp(0.95rem,1vw,1.08rem)]">
          {{ detailData.roleAccessDescription }}
        </p>
      </article>

      <article class="rounded-[14px] border border-[#d8dce2] bg-[#efefef] px-4 py-6 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-7">
        <section class="mx-auto w-full max-w-[920px] rounded-[10px] border border-[#d5d9e2] bg-[#f4f5f7] px-4 py-5 md:px-6 md:py-6 xl:max-w-[980px]">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#212d42]">
              <tbody>
                <tr>
                  <td class="w-[56%] border border-[#b9c0cd] px-4 py-3 align-top">
                    <p class="font-semibold uppercase">UNIVERSITAS MUHAMMADIYAH CIREBON</p>
                    <p class="text-[0.86rem] text-[#4d596e]">Alamat: Jalan Fatahillah - Watubelah - Cirebon</p>
                    <p class="text-[0.86rem] text-[#4d596e]">Website: www.umc.ac.id Email: rektorat@umc.ac.id</p>
                    <p class="mt-2 font-semibold uppercase">SOP MONITORING DAN EVALUASI AWAL PEMBELAJARAN</p>
                  </td>
                  <td class="w-[44%] border border-[#b9c0cd] p-0 align-top">
                    <table class="w-full border-collapse text-[0.86rem]">
                      <tbody>
                        <tr
                          v-for="item in detailData.coverMetaFields"
                          :key="item.label"
                        >
                          <td class="w-[42%] border border-[#b9c0cd] px-3 py-2">{{ item.label }}</td>
                          <td class="border border-[#b9c0cd] px-3 py-2">{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-8 text-center text-[#162136]">
            <h3 class="text-[clamp(1.6rem,1.8vw,2rem)] font-bold">
              {{ detailData.documentTitle }}
            </h3>
            <div class="mx-auto mt-4 h-[2px] w-[42%] bg-[#d3d9e2]" />
            <p class="mt-5 text-[clamp(1.02rem,1.1vw,1.2rem)] uppercase">
              PROGRAM STUDI {{ detailData.programStudi }}
            </p>
            <p class="mt-4 text-[clamp(1rem,1.08vw,1.18rem)] uppercase">
              SEMESTER {{ semesterLabel.toUpperCase() }} TAHUN AKADEMIK {{ detailData.tahunAkademik }}
            </p>
            <p class="mt-5 text-[clamp(1rem,1.06vw,1.14rem)] uppercase">FAKULTAS {{ detailData.fakultas }}</p>
            <p class="text-[clamp(1.02rem,1.1vw,1.2rem)] font-semibold uppercase">UNIVERSITAS MUHAMMADIYAH CIREBON</p>
            <img src="/img/logo-umc.jpg" alt="Logo UMC" class="mx-auto mt-6 h-20 w-20 rounded-full object-cover">
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="text-[clamp(1.55rem,1.75vw,2rem)] font-bold text-[#162136]">
              HALAMAN PENGESAHAN
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <div class="mt-5 text-center text-[#162136]">
              <p class="text-[clamp(1.05rem,1.12vw,1.2rem)] font-semibold uppercase">FAKULTAS {{ detailData.fakultas }}</p>
              <p class="text-[clamp(1.05rem,1.12vw,1.2rem)] font-semibold uppercase">UNIVERSITAS MUHAMMADIYAH CIREBON</p>
              <p class="mt-1 text-[clamp(1rem,1.06vw,1.16rem)]">Laporan Monitoring Evaluasi</p>
              <p class="text-[clamp(1rem,1.06vw,1.16rem)]">Prodi: {{ detailData.programStudi }}</p>
              <p class="text-[clamp(1rem,1.06vw,1.16rem)]">Tahun Akademik / Semester: {{ detailData.tahunAkademik }} / {{ semesterLabel }}</p>
            </div>

            <div class="mt-4 overflow-x-auto">
              <table class="w-full min-w-[560px] border-collapse text-[0.9rem]">
                <tbody>
                  <tr
                    v-for="item in detailData.pengesahanMetaFields"
                    :key="item.label"
                  >
                    <td class="w-[32%] border border-[#c0c7d4] px-3 py-2">{{ item.label }}</td>
                    <td class="border border-[#c0c7d4] px-3 py-2">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 overflow-x-auto">
              <table class="w-full min-w-[560px] border-collapse text-[0.9rem]">
                <thead>
                  <tr>
                    <th class="w-[38%] border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left font-semibold">Keterangan</th>
                    <th class="w-[26%] border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-center font-semibold">Tanggal &amp; Waktu</th>
                    <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-center font-semibold">Tanda Tangan / Nama / NIP</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="row in detailData.signatureRows" :key="row.id">
                    <tr>
                      <td class="border border-[#c0c7d4] px-3 py-3 align-top" :class="resolveSignatureToneClass(row.tone)">
                        <p class="font-semibold">{{ row.title }}</p>
                        <p class="text-[0.84rem]">{{ row.subtitle }}</p>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-3 text-center">
                        <template v-if="isSignatureApproved(row.id)">
                          <p class="text-[#1c2333]">{{ resolveSignatureApprovedInfo(row.id)?.signedAtDate }}</p>
                          <p class="text-[0.8rem] text-[#556070]">{{ resolveSignatureApprovedInfo(row.id)?.signedAtTime }}</p>
                        </template>
                        <p v-else class="text-[#8f98a8]">-</p>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-3 text-center text-[#a4acb9]">
                        <template v-if="isSignatureApproved(row.id)">
                          <span class="inline-flex rounded-[999px] border border-[#67d4a6] px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-[#1a9f61]">
                            {{ resolveSignatureApprovedInfo(row.id)?.signedLabel }}
                          </span>
                          <div class="mx-auto mt-2 h-px w-[70%] bg-[#ccd3de]" />
                          <p class="mt-2 text-[0.92rem] font-semibold text-[#131924]">{{ resolveSignatureApprovedInfo(row.id)?.name }}</p>
                          <p class="text-[0.78rem] text-[#4d596c]">NIP. {{ resolveSignatureApprovedInfo(row.id)?.nip }}</p>
                          <p class="text-[0.78rem] text-[#4d596c]">{{ resolveSignatureApprovedInfo(row.id)?.roleLabel }}</p>
                          <span class="mt-2 inline-flex rounded-[8px] border border-[#9fe2c0] bg-[#e7f9ee] px-2 py-0.5 text-[0.72rem] text-[#15814a]">
                            {{ resolveSignatureApprovedInfo(row.id)?.signedAtDate }} | {{ resolveSignatureApprovedInfo(row.id)?.signedAtTime }}
                          </span>
                        </template>
                        <template v-else>
                          <p class="italic">Belum ditandatangani</p>
                          <div class="mx-auto mt-3 h-px w-[70%] bg-[#ccd3de]" />
                          <p class="mt-2 text-[0.8rem]">NIP. .......................</p>
                          <p class="text-[0.8rem]">{{ row.subtitle }}</p>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="row.id === 'diperiksa'">
                      <td class="border border-[#c0c7d4] px-3 py-3 align-top bg-[#f6f0e7] text-[#bf4a05]">
                        <p class="font-semibold">Diperiksa Oleh</p>
                        <p class="text-[0.84rem]">Wakil Dekan</p>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-3 text-center">
                        <template v-if="isSignatureApproved('diperiksa-wakil')">
                          <p class="text-[#1c2333]">{{ resolveSignatureApprovedInfo('diperiksa-wakil')?.signedAtDate }}</p>
                          <p class="text-[0.8rem] text-[#556070]">{{ resolveSignatureApprovedInfo('diperiksa-wakil')?.signedAtTime }}</p>
                        </template>
                        <p v-else class="text-[#8f98a8]">-</p>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-3 text-center text-[#a4acb9]">
                        <template v-if="isSignatureApproved('diperiksa-wakil')">
                          <span class="inline-flex rounded-[999px] border border-[#67d4a6] px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-[#1a9f61]">
                            {{ resolveSignatureApprovedInfo('diperiksa-wakil')?.signedLabel }}
                          </span>
                          <div class="mx-auto mt-2 h-px w-[70%] bg-[#ccd3de]" />
                          <p class="mt-2 text-[0.92rem] font-semibold text-[#131924]">{{ resolveSignatureApprovedInfo('diperiksa-wakil')?.name }}</p>
                          <p class="text-[0.78rem] text-[#4d596c]">NIP. {{ resolveSignatureApprovedInfo('diperiksa-wakil')?.nip }}</p>
                          <p class="text-[0.78rem] text-[#4d596c]">{{ resolveSignatureApprovedInfo('diperiksa-wakil')?.roleLabel }}</p>
                          <span class="mt-2 inline-flex rounded-[8px] border border-[#9fe2c0] bg-[#e7f9ee] px-2 py-0.5 text-[0.72rem] text-[#15814a]">
                            {{ resolveSignatureApprovedInfo('diperiksa-wakil')?.signedAtDate }} | {{ resolveSignatureApprovedInfo('diperiksa-wakil')?.signedAtTime }}
                          </span>
                        </template>
                        <template v-else>
                          <p class="italic">Belum ditandatangani</p>
                          <div class="mx-auto mt-3 h-px w-[70%] bg-[#ccd3de]" />
                          <p class="mt-2 text-[0.8rem]">NIP. .......................</p>
                          <p class="text-[0.8rem]">Wakil Dekan</p>
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="text-[clamp(1.45rem,1.7vw,1.9rem)] font-bold text-[#162136]">
              KATA PENGANTAR
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <div class="mt-4">
              <textarea
                v-if="isEditing"
                v-model="narrativeForm.kataPengantar"
                rows="5"
                class="w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
              />
              <p v-else class="whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                {{ detailData.narrative.kataPengantar }}
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="text-[clamp(1.45rem,1.7vw,1.9rem)] font-bold text-[#162136]">
              DAFTAR ISI
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <div class="mt-3 space-y-1 text-[clamp(0.96rem,1vw,1.06rem)] text-[#1f2b3e]">
              <div
                v-for="item in detailData.daftarIsiRows"
                :key="item.id"
                class="flex items-end justify-between border-b border-dotted border-[#ccd3dd] pb-1"
                :class="item.level === 1 ? 'pl-4' : ''"
              >
                <span :class="item.emphasized ? 'font-semibold' : ''">{{ item.title }}</span>
                <span>{{ item.page }}</span>
              </div>
            </div>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="whitespace-pre-line text-[clamp(1.55rem,1.75vw,2rem)] font-bold leading-tight text-[#162136]">
              {{ detailData.bab1Heading }}
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <div class="mt-5 space-y-5">
              <section>
                <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                  A. Latar Belakang
                </h4>
                <textarea
                  v-if="isEditing"
                  v-model="narrativeForm.bab1LatarBelakang"
                  rows="5"
                  class="mt-2 w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
                />
                <p v-else class="mt-2 whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                  {{ detailData.narrative.bab1LatarBelakang }}
                </p>
              </section>

              <section>
                <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                  B. Tujuan Monitoring dan Evaluasi
                </h4>
                <textarea
                  v-if="isEditing"
                  v-model="narrativeForm.bab1Tujuan"
                  rows="5"
                  class="mt-2 w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
                />
                <p v-else class="mt-2 whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                  {{ detailData.narrative.bab1Tujuan }}
                </p>
              </section>

              <section>
                <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                  C. Dasar Hukum
                </h4>
                <textarea
                  v-if="isEditing"
                  v-model="narrativeForm.bab1DasarHukum"
                  rows="5"
                  class="mt-2 w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
                />
                <p v-else class="mt-2 whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                  {{ detailData.narrative.bab1DasarHukum }}
                </p>
              </section>
            </div>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="whitespace-pre-line text-[clamp(1.55rem,1.75vw,2rem)] font-bold leading-tight text-[#162136]">
              {{ detailData.bab2Heading }}
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                A. Deskripsi Hasil Monitoring
              </h4>
              <p class="mt-2 text-[clamp(0.95rem,1vw,1.08rem)] text-[#1f2b3e]">
                [Auto-generated dari FM.01] Data monitoring dalam proses kompilasi.
              </p>

              <article class="mt-3 rounded-[10px] border border-[#a9cbfb] bg-[#eaf2ff] px-3 py-2 text-[clamp(0.9rem,0.98vw,1rem)] text-[#1f58b8]">
                <strong>Sumber Data:</strong> FM.01 (Form Monitoring) &amp; FM.03 (Form Temuan). Data tidak dapat diedit manual.
              </article>

              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#1f2b3e]">
                  <thead>
                    <tr>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">No</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Aspek</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Indikator</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Temuan</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in detailData.monitoringRows" :key="`monitoring-${row.no}`">
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.no }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.aspek }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.indikator }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.temuan }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">
                        <span class="inline-flex rounded-[6px] bg-[#c8f1d8] px-2 py-0.5 text-[0.8rem] text-[#148345]">
                          {{ row.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                B. Deskripsi Hasil Evaluasi
              </h4>
              <p class="mt-2 text-[clamp(0.95rem,1vw,1.08rem)] text-[#1f2b3e]">
                [Auto-generated dari FM.02] Data evaluasi dalam proses kompilasi.
              </p>

              <article class="mt-3 rounded-[10px] border border-[#a9cbfb] bg-[#eaf2ff] px-3 py-2 text-[clamp(0.9rem,0.98vw,1rem)] text-[#1f58b8]">
                <strong>Sumber Data:</strong> FM.02 (Hasil Evaluasi). Data tidak dapat diedit manual.
              </article>

              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#1f2b3e]">
                  <thead>
                    <tr>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">No</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Aspek</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Skor</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Kategori</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in detailData.evaluationRows" :key="`evaluation-${row.no}`">
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.no }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.aspek }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.skor }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">
                        <span class="inline-flex rounded-[6px] bg-[#f7e9a0] px-2 py-0.5 text-[0.8rem] text-[#a06f09]">
                          {{ row.kategori }}
                        </span>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.keterangan }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                C. Deskripsi Hasil Survei
              </h4>
              <p class="mt-2 text-[clamp(0.95rem,1vw,1.08rem)] text-[#1f2b3e]">
                [Auto-generated dari FM.06] Data survei dalam proses kompilasi.
              </p>

              <article class="mt-3 rounded-[10px] border border-[#a9cbfb] bg-[#eaf2ff] px-3 py-2 text-[clamp(0.9rem,0.98vw,1rem)] text-[#1f58b8]">
                <strong>Sumber Data:</strong> FM.06 (Form Survey). Data tidak dapat diedit manual.
              </article>

              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#1f2b3e]">
                  <thead>
                    <tr>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">No</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Indikator</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Persentase</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in detailData.surveyRows" :key="`survey-${row.no}`">
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.no }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.indikator }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2 font-semibold">{{ row.persentase }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">
                        <span class="inline-flex rounded-[6px] bg-[#f7e9a0] px-2 py-0.5 text-[0.8rem] text-[#a06f09]">
                          {{ row.kategori }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="whitespace-pre-line text-[clamp(1.55rem,1.75vw,2rem)] font-bold leading-tight text-[#162136]">
              {{ detailData.bab3Heading }}
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                A. Daftar Temuan Monitoring
              </h4>
              <article class="mt-3 rounded-[10px] border border-[#a9cbfb] bg-[#eaf2ff] px-3 py-2 text-[clamp(0.9rem,0.98vw,1rem)] text-[#1f58b8]">
                <strong>Sumber Data:</strong> FM.03 (Form Temuan). Data tidak dapat diedit manual.
              </article>

              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#1f2b3e]">
                  <thead>
                    <tr>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">No</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Temuan</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Sumber</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Risiko</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in detailData.findingRows" :key="`finding-${row.no}`">
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.no }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.temuan }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.sumber }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">
                        <span class="inline-flex rounded-[6px] bg-[#d8f3e2] px-2 py-0.5 text-[0.8rem] text-[#168a4a]">
                          {{ row.risiko }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                B. Hasil Analisis Risiko (FMEA)
              </h4>
              <article class="mt-3 rounded-[10px] border border-[#a9cbfb] bg-[#eaf2ff] px-3 py-2 text-[clamp(0.9rem,0.98vw,1rem)] text-[#1f58b8]">
                <strong>Sumber Data:</strong> FM.04 (RTL / FMEA). Data tidak dapat diedit manual.
              </article>

              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[560px] border-collapse text-[0.92rem] text-[#1f2b3e]">
                  <thead>
                    <tr>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">No</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Risiko</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">S</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">O</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">D</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">RPN</th>
                      <th class="border border-[#c0c7d4] bg-[#f1f3f6] px-3 py-2 text-left">Tindak Lanjut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in detailData.riskRows" :key="`risk-${row.no}`">
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.no }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.risiko }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.s }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.o }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.d }}</td>
                      <td class="border border-[#c0c7d4] px-3 py-2">
                        <span class="inline-flex rounded-[6px] bg-[#d8f3e2] px-2 py-0.5 text-[0.8rem] font-semibold text-[#168a4a]">
                          {{ row.rpn }}
                        </span>
                      </td>
                      <td class="border border-[#c0c7d4] px-3 py-2">{{ row.tindakLanjut }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="mt-3 rounded-[8px] bg-[#eceef1] px-3 py-2 text-[0.82rem] text-[#485569]">
                <strong>Keterangan:</strong> S=Severity, O=Occurrence, D=Detection, RPN=S x O x D, RPN&gt;=200: Tinggi | 100-199: Sedang | &lt;100: Rendah
              </p>
            </section>
          </div>

          <div class="mt-8 border-t border-[#d3d9e2] pt-8">
            <h3 class="whitespace-pre-line text-[clamp(1.55rem,1.75vw,2rem)] font-bold leading-tight text-[#162136]">
              {{ detailData.bab4Heading }}
            </h3>
            <div class="mt-2 h-[2px] w-full bg-[#d3d9e2]" />

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                A. Simpulan
              </h4>
              <textarea
                v-if="isEditing"
                v-model="narrativeForm.bab4Simpulan"
                rows="5"
                class="mt-2 w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
              />
              <p v-else class="mt-2 whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                {{ detailData.narrative.bab4Simpulan }}
              </p>
            </section>

            <section class="mt-5">
              <h4 class="text-[clamp(1.08rem,1.18vw,1.26rem)] font-semibold text-[#162136]">
                B. Rekomendasi
              </h4>
              <textarea
                v-if="isEditing"
                v-model="narrativeForm.bab4Rekomendasi"
                rows="5"
                class="mt-2 w-full rounded-[12px] border border-[#c6ccd8] bg-white px-4 py-3 text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637] outline-none"
              />
              <p v-else class="mt-2 whitespace-pre-line text-[clamp(0.95rem,1vw,1.08rem)] leading-relaxed text-[#1c2637]">
                {{ detailData.narrative.bab4Rekomendasi }}
              </p>
            </section>
          </div>
        </section>
      </article>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat laporan FM7...
    </section>

    <div
      v-if="detailData && isConfirmModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4"
    >
      <article class="max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-[20px] border border-[#d0d6de] bg-[#f0f0f0] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.28)] md:p-7">
        <h3 class="text-[clamp(1.6rem,1.9vw,2.35rem)] font-semibold text-[#111a2f]">
          Konfirmasi Aksi
        </h3>

        <section class="mt-5 rounded-[16px] bg-[#e9eaed] px-5 py-5 md:px-7">
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-y-3 text-[clamp(1rem,1.1vw,1.35rem)]">
            <p class="text-[#4b5668]">Laporan:</p>
            <p class="text-right font-semibold text-[#090d15]">{{ detailData.kodeLaporan }}</p>

            <p class="text-[#4b5668]">Role:</p>
            <p class="text-right font-semibold text-[#090d15]">{{ detailData.roleLabel }}</p>

            <p class="text-[#4b5668]">Aksi:</p>
            <p class="text-right">
              <span
                class="inline-flex rounded-[10px] px-4 py-1.5 font-semibold text-white"
                :class="resolveActionPillClass(detailData.roleActionTone)"
              >
                {{ detailData.roleActionLabel }}
              </span>
            </p>

            <p class="text-[#4b5668]">Status:</p>
            <p class="text-right font-semibold text-[#090d15]">{{ roleActionStatusLabel }}</p>

            <p class="text-[#4b5668]">Nama:</p>
            <p class="text-right font-semibold text-[#090d15]">{{ detailData.createdByName }}</p>

            <p class="text-[#4b5668]">NIP:</p>
            <p class="text-right font-semibold text-[#090d15]">{{ detailData.createdByNip }}</p>
          </div>
        </section>

        <p class="mt-6 max-w-[850px] text-[clamp(1rem,1.1vw,1.35rem)] leading-relaxed text-[#4b5668]">
          Dengan mengklik tombol di bawah, Anda menyatakan telah memeriksa dan menyetujui laporan ini sesuai kewenangan Anda.
        </p>

        <div class="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="inline-flex h-[56px] items-center justify-center rounded-[16px] bg-[#e2e4e8] text-[clamp(1.15rem,1.3vw,1.55rem)] font-medium text-[#4b5668] transition hover:bg-[#d6d9de]"
            @click="closeConfirmModal"
          >
            Batal
          </button>

          <button
            type="button"
            class="inline-flex h-[56px] items-center justify-center gap-2.5 rounded-[16px] text-[clamp(1.15rem,1.3vw,1.55rem)] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
            :class="resolveActionButtonClass(detailData.roleActionTone)"
            :disabled="submitting"
            @click="confirmSubmitReport"
          >
            <svg
              v-if="detailData.roleActionTone === 'green'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2 11 13" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2 15 22l-4-9-9-4z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 14 2 2 4-4" />
            </svg>
            {{ submitting ? 'Memproses...' : detailData.roleActionLabel }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
