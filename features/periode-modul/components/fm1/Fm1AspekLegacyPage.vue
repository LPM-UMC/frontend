<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { navigateTo } from '#app'
import { useRoute } from 'vue-router'
import { useFormSubmission } from '../../composables/useFormSubmission'

const repository = useFormSubmission('auto')
const route = useRoute()

type Fm01PageData = Awaited<ReturnType<typeof repository.getPageData>>
type Fm01TableRow = Fm01PageData['table']['rows'][number]
type Fm01AspectDetail = Fm01PageData['aspectDetails'][keyof Fm01PageData['aspectDetails']]
type Fm01AspectIndicator = Fm01AspectDetail['indicators'][number]
type Fm01RouteContext = {
  periodeModulId: string
  unitId: string
  aspekId: string
}

type SaveFm01IndicatorPayload = Parameters<typeof repository.saveIndicator>[0]

const pageData = ref<Fm01PageData>(await repository.getPageData())
const activeAspectId = ref(pageData.value.activeAspectId)
const searchQuery = ref('')
const sortOrder = ref(pageData.value.table.sortOrder)
const currentPage = ref(1)
const isIndicatorModalOpen = ref(false)
const selectedObject = ref<Fm01TableRow | null>(null)
const isSavingIndicator = ref(false)
const indicatorErrorMessage = ref('')

function normalizeRouteParam(
  value: string | string[] | undefined
): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const routePeriodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined)
)

const routeUnitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined)
)

const routeAspectId = computed(() =>
  normalizeRouteParam(route.params.aspek_id as string | string[] | undefined)
)

const currentRouteContext = computed<Fm01RouteContext | null>(() => {
  if (!routePeriodeModulId.value || !routeUnitId.value) {
    return null
  }

  return {
    periodeModulId: routePeriodeModulId.value,
    unitId: routeUnitId.value,
    aspekId: routeAspectId.value ?? pageData.value.activeAspectId,
  }
})

const canUseDynamicAspectRoute = computed(() =>
  Boolean(routePeriodeModulId.value && routeUnitId.value)
)

function createEmptyAspectDetail(): Fm01AspectDetail {
  return {
    title: '',
    description: '',
    objectLabel: '',
    object: {
      title: '',
      typeLabel: '',
      description: '',
      addUnitLabel: '',
      addUnitHint: '',
    },
    indicatorLabel: '',
    indicators: [],
    document: {
      title: '',
      subtitle: '',
      submittedAt: '',
      statusLabel: '',
      statusValue: '',
      deadlineLabel: '',
      deadlineValue: '',
      linkLabel: '',
      link: '',
      viewLabel: '',
      senderNoteLabel: '',
      senderNoteValue: '',
    },
  }
}

const indicatorForm = reactive({
  validationApproved: pageData.value.indicatorModal.defaultForm.validationApproved,
  contentQualityScore:
    pageData.value.indicatorModal.defaultForm.contentQualityScore as number | null,
  contentQualityJustification:
    pageData.value.indicatorModal.defaultForm.contentQualityJustification,
  checklistFiles: [...pageData.value.indicatorModal.defaultForm.checklistFiles],
  checklistNote: pageData.value.indicatorModal.defaultForm.checklistNote,
})

const fallbackAspectDetail = computed<Fm01AspectDetail>(() => {
  return (
    pageData.value.aspectDetails[pageData.value.activeAspectId]
    ?? Object.values(pageData.value.aspectDetails)[0]
    ?? createEmptyAspectDetail()
  )
})

const activeAspectDetail = computed<Fm01AspectDetail>(() => {
  return pageData.value.aspectDetails[activeAspectId.value] ?? fallbackAspectDetail.value
})

const pageSize = computed(() => pageData.value.table.pageSize)

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return pageData.value.table.rows

  return pageData.value.table.rows.filter((row: { code: any; name: any; className: any; lecturer: any }) =>
    [row.code, row.name, row.className, row.lecturer]
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]

  rows.sort((a, b) => {
    const left = `${a.code} ${a.name} ${a.className} ${a.lecturer}`.toLowerCase()
    const right = `${b.code} ${b.name} ${b.className} ${b.lecturer}`.toLowerCase()

    if (sortOrder.value === 'desc') {
      return right.localeCompare(left)
    }

    return left.localeCompare(right)
  })

  return rows
})

const totalRows = computed(() => sortedRows.value.length)
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalRows.value / pageSize.value))
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

const showingFrom = computed(() => {
  if (!totalRows.value) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const showingTo = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalRows.value)
})

function resetIndicatorForm() {
  const defaults = pageData.value.indicatorModal.defaultForm
  indicatorForm.validationApproved = defaults.validationApproved
  indicatorForm.contentQualityScore = defaults.contentQualityScore
  indicatorForm.contentQualityJustification = defaults.contentQualityJustification
  indicatorForm.checklistFiles = [...defaults.checklistFiles]
  indicatorForm.checklistNote = defaults.checklistNote
  indicatorErrorMessage.value = ''
}

function isKnownAspectId(aspectId: string): boolean {
  return pageData.value.aspectOptions.some((aspect: { id: string }) => aspect.id === aspectId)
}

function buildAspectRoutePath(aspectId: string): string | null {
  if (!canUseDynamicAspectRoute.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value ?? '')}/unit/${encodeURIComponent(routeUnitId.value ?? '')}/fm1/aspek/${encodeURIComponent(aspectId)}`
}

function buildBuktiRoutePath(): string | null {
  if (!canUseDynamicAspectRoute.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value ?? '')}/unit/${encodeURIComponent(routeUnitId.value ?? '')}/fm1/bukti`
}

function buildObjekRoutePath(): string | null {
  if (!canUseDynamicAspectRoute.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value ?? '')}/unit/${encodeURIComponent(routeUnitId.value ?? '')}/fm1/objek`
}

function syncActiveAspectFromRoute() {
  if (routeAspectId.value && isKnownAspectId(routeAspectId.value)) {
    activeAspectId.value = routeAspectId.value
    return
  }

  activeAspectId.value = pageData.value.activeAspectId
}

async function setActiveAspect(aspectId: string) {
  activeAspectId.value = aspectId

  const targetPath = buildAspectRoutePath(aspectId)
  if (!targetPath || targetPath === route.path) return

  await navigateTo(targetPath)
}

async function goToBuktiPage() {
  const targetPath = buildBuktiRoutePath()
  if (!targetPath) return

  await navigateTo(targetPath)
}

async function goToObjekPage() {
  const targetPath = buildObjekRoutePath()
  if (!targetPath) return

  await navigateTo(targetPath)
}

function indicatorBadgeClass(indicator: Fm01AspectIndicator) {
  if (indicator.assessmentType === 'manual') {
    return 'bg-[#e4e8ef] text-[#637185]'
  }

  if (indicator.assessmentType === 'automatic') {
    return 'bg-[#cddfff] text-[#3169da]'
  }

  return ''
}

function indicatorBadgeLabel(indicator: Fm01AspectIndicator) {
  if (indicator.assessmentType === 'manual') {
    return 'Penilaian Manual'
  }

  if (indicator.assessmentType === 'automatic') {
    return 'Penilaian Otomatis'
  }

  return ''
}

function openIndicatorModal(row: Fm01TableRow) {
  selectedObject.value = row
  resetIndicatorForm()
  isIndicatorModalOpen.value = true
}

function closeIndicatorModal() {
  isIndicatorModalOpen.value = false
}

function isChecklistChecked(optionId: string) {
  return indicatorForm.checklistFiles.includes(optionId)
}

function toggleChecklist(optionId: string) {
  if (isChecklistChecked(optionId)) {
    indicatorForm.checklistFiles = indicatorForm.checklistFiles.filter((id: string) => id !== optionId)
    return
  }

  indicatorForm.checklistFiles = [...indicatorForm.checklistFiles, optionId]
}

async function saveIndicator() {
  if (!selectedObject.value) return

  isSavingIndicator.value = true
  indicatorErrorMessage.value = ''

  const payload: SaveFm01IndicatorPayload = {
    objectId: selectedObject.value.id,
    aspectId: activeAspectId.value,
    periodeModulId: routePeriodeModulId.value ?? undefined,
    unitId: routeUnitId.value ?? undefined,
    form: {
      validationApproved: indicatorForm.validationApproved,
      contentQualityScore: indicatorForm.contentQualityScore,
      contentQualityJustification: indicatorForm.contentQualityJustification.trim(),
      checklistFiles: [...indicatorForm.checklistFiles],
      checklistNote: indicatorForm.checklistNote.trim(),
    },
  }

  const result = await repository.saveIndicator(payload)

  if (result) {
    closeIndicatorModal()
  } else {
    indicatorErrorMessage.value = 'Simpan indikator gagal. Coba ulangi kembali.'
  }

  isSavingIndicator.value = false
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

async function loadPageData() {
  pageData.value = await repository.getPageData(currentRouteContext.value ?? undefined)
  sortOrder.value = pageData.value.table.sortOrder
  syncActiveAspectFromRoute()
  resetIndicatorForm()
}

watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch(isIndicatorModalOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(
  () => [routePeriodeModulId.value, routeUnitId.value, routeAspectId.value],
  async () => {
    await loadPageData()
  }
)

onMounted(async () => {
  await loadPageData()
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="relative bg-[#e4e4e6]">
    <div class="min-h-[calc(100vh-70px)] pb-0 sm:min-h-[calc(100vh-86px)]">
      <section class="mx-auto w-full max-w-[1120px] px-2.5 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 md:px-4.5 lg:px-5">
        <div class="rounded-[12px] bg-[#e60000] px-3.5 py-3.5 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] sm:px-4 sm:py-4 xl:px-5">
          <div class="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between">
            <div class="w-full lg:max-w-[74%]">
              <h1 class="text-[18px] font-bold leading-tight sm:text-[22px] xl:text-[26px]">
                {{ pageData.summary.title }}
              </h1>
              <p class="mt-2 max-w-[820px] text-[12px] leading-[1.5] text-white/95 sm:text-[13px] xl:text-[14px]">
                {{ pageData.summary.description }}
              </p>
            </div>

            <div class="w-full rounded-[12px] bg-white/18 px-3.5 py-3 lg:w-[176px]">
              <p class="text-[11px] tracking-wide text-white/80 sm:text-[12px]">
                {{ pageData.summary.statusLabel }}
              </p>
              <p class="mt-1 text-[16px] font-bold sm:text-[18px]">
                {{ pageData.summary.statusValue }}
              </p>
              <p class="mt-1 text-[11px] text-white/90 sm:text-[12px]">
                {{ pageData.summary.statusDate }}
              </p>
            </div>
          </div>

          <div class="mt-3.5 grid grid-cols-1 gap-2.5 lg:grid-cols-3">
            <article
              v-for="metric in pageData.summary.metrics"
              :key="metric.id"
              class="rounded-[12px] bg-gradient-to-r from-[#ed1e24] to-[#dd0910] px-3.5 py-3"
            >
              <p class="text-[11px] text-white/75 sm:text-[12px]">
                {{ metric.label }}
              </p>
              <p class="mt-1 text-[13px] font-semibold leading-[1.35] sm:text-[14px] md:text-[15px]">
                {{ metric.value }}
              </p>
            </article>
          </div>
        </div>

        <section class="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_286px] xl:grid-cols-[minmax(0,1fr)_314px]">
          <div class="space-y-3.5">
            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
              <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
                {{ pageData.detailLabel }}
              </p>
              <h2 class="mt-1 text-[17px] font-bold text-[#121b2f] sm:text-[20px]">
                {{ pageData.detailTitle }}
              </h2>

              <div class="mt-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <button
                  v-for="aspect in pageData.aspectOptions"
                  :key="aspect.id"
                  type="button"
                  class="rounded-[12px] border px-3 py-2 text-left text-[12px] font-medium transition sm:text-[13px]"
                  :class="aspect.id === activeAspectId
                    ? 'border-[#e60000] bg-[#e60000] text-white'
                    : 'border-[#c7ced9] bg-transparent text-[#445064] hover:bg-white'"
                  @click="setActiveAspect(aspect.id)"
                >
                  {{ aspect.label }}
                </button>
              </div>
            </article>

            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
              <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
                DETAIL ASPEK
              </p>
              <h3 class="mt-1 text-[16px] font-bold text-[#121b2f] sm:text-[18px]">
                {{ activeAspectDetail.title }}
              </h3>
              <p class="mt-2 text-[12px] leading-[1.5] text-[#576276] sm:text-[13px]">
                {{ activeAspectDetail.description }}
              </p>

              <p class="mt-4 text-[12px] font-semibold tracking-wide text-[#727f93] sm:text-[13px]">
                {{ activeAspectDetail.objectLabel }}
              </p>

              <div class="mt-2 rounded-[12px] border border-[#d9dde4] bg-white px-3 py-3">
                <div class="border-l-[5px] border-[#e60000] pl-3.5">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#99a3b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-8.25a2.25 2.25 0 0 0-2.25-2.25h-8.25m8.25 15h-10.5a2.25 2.25 0 0 1-2.25-2.25v-10.5a2.25 2.25 0 0 1 2.25-2.25h7.5l5.25 5.25v7.5a2.25 2.25 0 0 1-2.25 2.25Z" />
                      </svg>
                      <h4 class="text-[15px] font-semibold text-[#131d31] sm:text-[16px]">
                        {{ activeAspectDetail.object.title }}
                      </h4>
                    </div>
                    <span class="inline-flex rounded-[8px] bg-[#f7dbdc] px-2.5 py-0.5 text-[10px] font-semibold text-[#e21b1b] sm:text-[11px]">
                      {{ activeAspectDetail.object.typeLabel }}
                    </span>
                  </div>

                  <p class="mt-2 text-[12px] leading-[1.5] text-[#727d8e] sm:text-[13px]">
                    {{ activeAspectDetail.object.description }}
                  </p>

                  <button
                    type="button"
                    class="mt-3 flex w-full items-center gap-2.5 rounded-[12px] bg-[#e60000] px-3 py-2 text-left text-white transition hover:brightness-95"
                    @click="goToObjekPage"
                  >
                    <span class="grid h-[34px] w-[34px] place-items-center rounded-full bg-white/20 text-[18px] sm:h-10 sm:w-10 sm:text-[20px]">
                      +
                    </span>

                    <span>
                      <span class="block text-[13px] font-semibold leading-tight sm:text-[14px]">
                        {{ activeAspectDetail.object.addUnitLabel }}
                      </span>
                      <span class="block text-[11px] tracking-wide text-white/95 sm:text-[12px]">
                        {{ activeAspectDetail.object.addUnitHint }}
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              <p class="mt-4 text-[12px] font-semibold tracking-wide text-[#727f93] sm:text-[13px]">
                {{ activeAspectDetail.indicatorLabel }}
              </p>

              <div class="mt-2 space-y-1.5">
                <article
                  v-for="indicator in activeAspectDetail.indicators"
                  :key="indicator.id"
                  class="border-l-[6px] border-[#e60000] bg-[#f2f3f4] px-3 py-3"
                >
                  <div class="flex items-center gap-3">
                    <span class="grid h-9 w-9 place-items-center rounded-full bg-[#f8dfe1] text-[#e60000]">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>

                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h5 class="text-[13px] font-semibold text-[#121b2f] sm:text-[14px]">
                          {{ indicator.title }}
                        </h5>
                        <span
                          v-if="indicator.assessmentType !== 'none'"
                          class="inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-medium sm:text-[12px]"
                          :class="indicatorBadgeClass(indicator)"
                        >
                          {{ indicatorBadgeLabel(indicator) }}
                        </span>
                      </div>
                      <p class="mt-1 text-[11px] leading-[1.5] text-[#5f6a7c] sm:text-[12px]">
                        {{ indicator.description }}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </article>

            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f2f3f5] p-2.5 sm:p-3">
              <div class="flex flex-col items-center justify-center rounded-[14px] border border-[#e1e4ea] bg-[#f6f7f8] px-2.5 py-6 text-center sm:px-5 sm:py-8">
                <span class="grid h-14 w-14 place-items-center rounded-full bg-[#e6e8ed] text-[#98a1b0] sm:h-16 sm:w-16">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-7.5A2.25 2.25 0 0 0 17.25 4.5H8.25A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5h7.5A2.25 2.25 0 0 0 18 17.25m1.5-3L15 9.75m0 0V14.25m0-4.5h4.5" />
                  </svg>
                </span>

                <h3 class="mt-4 text-[14px] font-bold leading-tight text-[#111a2f] sm:text-[18px] lg:text-[20px]">
                  Input Bukti Instrumen
                </h3>

                <p class="mt-2 max-w-[760px] text-[12px] leading-relaxed text-[#6b7487] sm:text-[13px] lg:text-[14px]">
                  Silakan unggah file bukti dokumen dalam bentuk excel maupun upload dokumen
                </p>
                <p class="mt-1 text-[12px] font-medium tracking-wide text-[#9aa3b2] sm:text-[13px] lg:text-[14px]">
                  BATAS UKURAN 10 MAKS (20 MB)
                </p>

                <button
                  type="button"
                  class="mt-4 inline-flex items-center gap-2.5 rounded-[14px] bg-[#e60000] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 sm:px-6 sm:py-3 sm:text-[15px]"
                  @click="goToBuktiPage"
                >
                  Mulai Input Bukti
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </article>
          </div>

          <aside class="space-y-3.5">
            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
              <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
                {{ pageData.scopeInfo.scopeLabel }}
              </p>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <h3 class="text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
                  {{ pageData.scopeInfo.scopeValue }}
                </h3>
                <span class="rounded-[8px] bg-[#d8e6ff] px-2 py-1 text-[12px] font-medium text-[#2864dd] sm:text-[13px]">
                  {{ pageData.scopeInfo.scopeTag }}
                </span>
              </div>
              <p class="mt-2 text-[12px] leading-[1.5] text-[#5f6a7c] sm:text-[13px]">
                {{ pageData.scopeInfo.scopeDescription }}
              </p>

              <div class="my-4 border-t border-[#d8dde5]" />

              <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
                {{ pageData.scopeInfo.unitLabel }}
              </p>
              <h4 class="mt-1 text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
                {{ pageData.scopeInfo.unitValue }}
              </h4>
              <p class="mt-2 text-[12px] leading-[1.5] text-[#5f6a7c] sm:text-[13px]">
                {{ pageData.scopeInfo.unitDescription }}
              </p>
            </article>

            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
              <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
                {{ pageData.stakeholderTitle }}
              </p>
              <h3 class="mt-1 text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
                {{ pageData.stakeholderSubtitle }}
              </h3>

              <div class="mt-3 space-y-2.5">
                <article
                  v-for="person in pageData.stakeholders"
                  :key="person.id"
                  class="rounded-[14px] border border-[#d6dce6] bg-[#f7f8fa] px-3.5 py-2.5"
                >
                  <div class="flex items-center gap-3">
                    <span class="grid h-10 w-10 place-items-center rounded-full bg-[#a4adbe] text-[13px] font-semibold text-white">
                      {{ person.initials }}
                    </span>
                    <div class="min-w-0">
                      <span class="inline-flex rounded-[8px] bg-[#d8e6ff] px-2 py-0.5 text-[11px] font-medium text-[#2864dd] sm:text-[12px]">
                        {{ person.roleTag }}
                      </span>
                      <p class="mt-1 truncate text-[13px] font-semibold text-[#131d31] sm:text-[14px]">
                        {{ person.name }}
                      </p>
                      <p class="truncate text-[11px] text-[#657084] sm:text-[12px]">
                        {{ person.email }}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </article>

            <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="h-10 w-[5px] rounded-full bg-[#e60000]" />
                  <h3 class="text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
                    {{ pageData.validationPanel.title }}
                  </h3>
                </div>
                <span class="inline-flex rounded-full bg-[#afe8c7] px-3 py-1 text-[11px] font-semibold text-[#14a44b] sm:text-[12px]">
                  &bull; {{ pageData.validationPanel.status }}
                </span>
              </div>

              <div class="mt-3.5 rounded-[14px] bg-[#eef0f3] px-3.5 py-3.5">
                <div class="flex items-center gap-3">
                  <span class="grid h-12 w-12 place-items-center rounded-full bg-[#e60000] text-[17px] font-semibold text-white">
                    {{ pageData.validationPanel.reviewerInitials }}
                  </span>
                  <div>
                    <p class="text-[14px] font-semibold text-[#131d31] sm:text-[15px]">
                      {{ pageData.validationPanel.reviewerName }}
                    </p>
                    <span class="inline-flex rounded-[8px] bg-[#f7dbdc] px-2 py-0.5 text-[11px] font-semibold text-[#e60000] sm:text-[12px]">
                      {{ pageData.validationPanel.reviewerRole }}
                    </span>
                  </div>
                </div>

                <p class="mt-3 flex items-center gap-2 text-[12px] text-[#8a94a6] sm:text-[13px]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75M3 9.75h18" />
                  </svg>
                  {{ pageData.validationPanel.reviewedAt }}
                </p>

                <p class="mt-3 text-[12px] font-semibold tracking-wide text-[#8f98a8] sm:text-[13px]">
                  {{ pageData.validationPanel.noteLabel }}
                </p>
                <textarea
                  rows="8"
                  class="mt-2 w-full rounded-[12px] border border-[#d4dae3] bg-[#f8f9fa] px-3.5 py-2.5 text-[12px] text-[#5d6779] outline-none placeholder:text-[#9aa4b4] focus:border-[#bcc5d2]"
                  :placeholder="pageData.validationPanel.notePlaceholder"
                />
              </div>
            </article>
          </aside>
        </section>

        <section class="mt-3.5 rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
          <h2 class="text-[18px] font-semibold text-[#0f172a] sm:text-[20px]">
            {{ pageData.table.title }}
          </h2>

          <div class="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div class="relative w-full sm:max-w-[360px]">
              <input
                v-model="searchQuery"
                type="search"
                class="h-9 w-full rounded-[12px] border border-[#d2d8e0] bg-[#f8f8f8] px-3 pr-10 text-[12px] text-[#364152] outline-none placeholder:text-[#9ba4b3]"
                :placeholder="pageData.table.searchPlaceholder"
              >
              <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba4b3]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </span>
            </div>

            <div class="relative w-full sm:w-[138px]">
              <select
                v-model="sortOrder"
                class="h-9 w-full appearance-none rounded-[12px] border border-[#d2d8e0] bg-[#f8f8f8] px-3 pr-8 text-[12px] text-[#9ba4b3] outline-none"
              >
                <option
                  v-for="option in pageData.table.sortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba4b3]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div class="mt-3.5 overflow-x-auto rounded-[14px] border border-[#d8dde4]">
            <table class="min-w-[680px] w-full border-collapse">
              <thead class="bg-[#ebebec] text-left">
                <tr>
                  <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold text-[#333]">No</th>
                  <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold text-[#333]">Kode</th>
                  <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold text-[#333]">Nama</th>
                  <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold text-[#333]">Kelas</th>
                  <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold text-[#333]">Nama Dosen</th>
                  <th class="px-3 py-2 text-center text-[11px] font-semibold text-[#333]">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-[#f3f3f4] text-[#333]">
                <tr
                  v-for="(row, index) in paginatedRows"
                  :key="row.id"
                  class="border-t border-[#dde1e8]"
                >
                  <td class="px-3 py-2 text-[11px]">
                    {{ showingFrom + index }}
                  </td>
                  <td class="px-3 py-2 text-[12px] font-semibold">
                    {{ row.code }}
                  </td>
                  <td class="px-3 py-2 text-[11px]">
                    {{ row.name }}
                  </td>
                  <td class="px-3 py-2 text-[11px]">
                    {{ row.className }}
                  </td>
                  <td class="px-3 py-2 text-[11px]">
                    {{ row.lecturer }}
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      type="button"
                      class="rounded-[8px] border border-[#ef1f1f] px-2.5 py-1 text-[10px] font-semibold text-[#e60000] transition hover:bg-[#fff0f0] sm:text-[11px]"
                      @click="openIndicatorModal(row)"
                    >
                      {{ pageData.table.actionLabel }}
                    </button>
                  </td>
                </tr>
                <tr v-if="!paginatedRows.length">
                  <td colspan="6" class="px-4 py-7 text-center text-[13px] text-[#8490a3]">
                    Data tidak ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#dfe3ea] pt-2.5">
            <p class="text-[11px] text-[#4d596d]">
              Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ totalRows }}</strong> data
            </p>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-[10px] border border-[#d5d9e0] px-3 py-0.5 text-[11px] font-semibold text-[#9aa3b2] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                Previous
              </button>

              <button
                type="button"
                class="rounded-[10px] bg-[#e60000] px-3 py-0.5 text-[11px] font-semibold text-white"
              >
                {{ currentPage }}
              </button>

              <button
                type="button"
                class="rounded-[10px] border border-[#d5d9e0] px-3 py-0.5 text-[11px] font-semibold text-[#9aa3b2] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </section>

    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isIndicatorModalOpen"
          class="fixed inset-0 z-[120] bg-black/55 px-2 py-3 sm:px-4 sm:py-6"
          @click.self="closeIndicatorModal"
        >
          <div class="mx-auto max-h-full w-full max-w-[640px] overflow-hidden rounded-[14px] bg-[#f6f7f8] shadow-[0_22px_50px_rgba(0,0,0,0.4)]">
            <div class="max-h-[84vh] overflow-y-auto px-2.5 pb-2.5 pt-2.5 sm:px-3.5 sm:pb-3 sm:pt-3">
              <header class="flex items-start justify-between gap-2.5">
                <div>
                  <h2 class="text-[18px] font-bold text-[#111a2f] sm:text-[21px]">
                    {{ pageData.indicatorModal.title }}
                  </h2>
                  <p class="mt-0.5 text-[11px] text-[#6b7689] sm:text-[12px]">
                    {{ pageData.indicatorModal.subtitle }}
                  </p>
                </div>
                <button
                  type="button"
                  :aria-label="pageData.indicatorModal.closeLabel"
                  class="text-[#9ca4b4] transition hover:text-[#6b7280]"
                  @click="closeIndicatorModal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </header>

              <div class="my-3 border-t border-[#d5dae2]" />

              <section class="space-y-3">
                <article class="rounded-[14px] border border-[#dbe0e6] bg-[#eff1f4] p-2.5 sm:p-3">
                  <div class="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-start gap-2.5">
                      <span class="grid h-8 w-8 place-items-center rounded-full bg-[#15b9ad] text-[14px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[15px]">
                        1
                      </span>

                      <div>
                        <h3 class="text-[14px] font-semibold leading-tight text-[#111a2f] sm:text-[16px]">
                          {{ pageData.indicatorModal.sectionOneTitle }}
                        </h3>
                        <p class="mt-0.5 max-w-[480px] text-[11px] leading-[1.5] text-[#546174] sm:text-[12px]">
                          {{ pageData.indicatorModal.sectionOneDescription }}
                        </p>
                      </div>
                    </div>

                    <span class="inline-flex rounded-full bg-[#b8ece4] px-3 py-1 text-[10px] font-semibold text-[#0d7f74] sm:text-[11px]">
                      {{ pageData.indicatorModal.sectionOneTag }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      class="rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition sm:text-[13px]"
                      :class="indicatorForm.validationApproved
                        ? 'border-[#15b9ad] bg-[#15b9ad] text-white'
                        : 'border-[#c5ccd6] bg-transparent text-[#3d485c] hover:bg-white'"
                      @click="indicatorForm.validationApproved = true"
                    >
                      &#10003; {{ pageData.indicatorModal.yesLabel }}
                    </button>

                    <button
                      type="button"
                      class="rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition sm:text-[13px]"
                      :class="!indicatorForm.validationApproved
                        ? 'border-[#15b9ad] bg-[#15b9ad] text-white'
                        : 'border-[#c5ccd6] bg-transparent text-[#3d485c] hover:bg-white'"
                      @click="indicatorForm.validationApproved = false"
                    >
                      {{ pageData.indicatorModal.noLabel }}
                    </button>
                  </div>

                  <p class="mt-2 text-[11px] italic text-[#111] sm:text-[12px]">
                    {{ pageData.indicatorModal.sectionOneFetchedAt }}
                  </p>
                </article>

                <article class="rounded-[14px] border border-[#dbe0e6] bg-[#eff1f4] p-2.5 sm:p-3">
                  <div class="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-start gap-2.5">
                      <span class="grid h-8 w-8 place-items-center rounded-full bg-[#ff7400] text-[14px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[15px]">
                        2
                      </span>

                      <div>
                        <h3 class="text-[14px] font-semibold leading-tight text-[#111a2f] sm:text-[16px]">
                          {{ pageData.indicatorModal.sectionTwoTitle }}
                        </h3>
                        <p class="mt-0.5 max-w-[560px] text-[11px] leading-[1.5] text-[#546174] sm:text-[12px]">
                          {{ pageData.indicatorModal.sectionTwoDescription }}
                        </p>
                      </div>
                    </div>

                    <span class="inline-flex rounded-full bg-[#f2e1c7] px-3 py-1 text-[10px] font-semibold text-[#d45200] sm:text-[11px]">
                      {{ pageData.indicatorModal.sectionTwoTag }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button
                      v-for="option in pageData.indicatorModal.qualityOptions"
                      :key="option.value"
                      type="button"
                      class="rounded-[10px] border px-1.5 py-2 text-center transition"
                      :class="indicatorForm.contentQualityScore === option.value
                        ? 'border-[#e60000] bg-[#fff2f2]'
                        : 'border-[#c8cfda] bg-[#f8f9fb] hover:bg-white'"
                      @click="indicatorForm.contentQualityScore = option.value"
                    >
                      <span class="block text-[16px] font-bold text-[#111] sm:text-[18px]">
                        {{ option.title }}
                      </span>
                      <span class="mt-1 block text-[10px] font-medium leading-[1.25] text-[#222] sm:text-[12px]">
                        {{ option.description }}
                      </span>
                    </button>
                  </div>

                  <textarea
                    v-model="indicatorForm.contentQualityJustification"
                    rows="4"
                    class="mt-3 w-full rounded-[12px] border border-[#c8cfda] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#3f4a5e] outline-none placeholder:text-[#8f98a8] focus:border-[#b8c0cb] sm:text-[13px]"
                    :placeholder="pageData.indicatorModal.sectionTwoPlaceholder"
                  />
                </article>

                <article class="rounded-[14px] border border-[#dbe0e6] bg-[#eff1f4] p-2.5 sm:p-3">
                  <div class="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-start gap-2.5">
                      <span class="grid h-8 w-8 place-items-center rounded-full bg-[#ff7400] text-[14px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[15px]">
                        3
                      </span>

                      <div>
                        <h3 class="text-[14px] font-semibold leading-tight text-[#111a2f] sm:text-[16px]">
                          {{ pageData.indicatorModal.sectionThreeTitle }}
                        </h3>
                        <p class="mt-0.5 max-w-[560px] text-[11px] leading-[1.5] text-[#546174] sm:text-[12px]">
                          {{ pageData.indicatorModal.sectionThreeDescription }}
                        </p>
                      </div>
                    </div>

                    <span class="inline-flex rounded-full bg-[#f2e1c7] px-3 py-1 text-[10px] font-semibold text-[#d45200] sm:text-[11px]">
                      {{ pageData.indicatorModal.sectionThreeTag }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      v-for="option in pageData.indicatorModal.checklistOptions"
                      :key="option.id"
                      type="button"
                      class="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-[#f7f7f7]"
                      @click="toggleChecklist(option.id)"
                    >
                      <span
                        class="grid h-8 w-8 place-items-center rounded-[8px] text-white sm:h-8 sm:w-8"
                        :class="isChecklistChecked(option.id) ? 'bg-[#e60000]' : 'bg-[#4f4f50]'"
                      >
                        <svg
                          v-if="isChecklistChecked(option.id)"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.4"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                      <span class="text-[12px] font-medium text-[#3e495d] sm:text-[13px]">
                        {{ option.label }}
                      </span>
                    </button>
                  </div>

                  <textarea
                    v-model="indicatorForm.checklistNote"
                    rows="4"
                    class="mt-3 w-full rounded-[12px] border border-[#c8cfda] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#3f4a5e] outline-none placeholder:text-[#8f98a8] focus:border-[#b8c0cb] sm:text-[13px]"
                    :placeholder="pageData.indicatorModal.sectionThreePlaceholder"
                  />
                </article>
              </section>

              <div class="mt-3 border-t border-[#d5dae2] pt-2">
                <p
                  v-if="selectedObject"
                  class="mb-2 text-[11px] text-[#6b7280] sm:text-[12px]"
                >
                  Objek terpilih:
                  <strong>{{ selectedObject.code }}</strong> - {{ selectedObject.name }} ({{ selectedObject.className }})
                </p>

                <p
                  v-if="indicatorErrorMessage"
                  class="mb-2 rounded-[10px] border border-[#f8b4b4] bg-[#fff1f1] px-2.5 py-1.5 text-[11px] text-[#d32727] sm:text-[12px]"
                >
                  {{ indicatorErrorMessage }}
                </p>

                <div class="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    class="rounded-[10px] border border-[#c8cfda] px-3.5 py-1.5 text-[11px] font-semibold text-[#3d485c] transition hover:bg-white sm:text-[12px]"
                    @click="closeIndicatorModal"
                  >
                    {{ pageData.indicatorModal.cancelLabel }}
                  </button>

                  <button
                    type="button"
                    class="rounded-[10px] bg-[#e60000] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-95 disabled:opacity-70 sm:text-[12px]"
                    :disabled="isSavingIndicator"
                    @click="saveIndicator"
                  >
                    {{ isSavingIndicator ? 'Menyimpan...' : pageData.indicatorModal.submitLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
