<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm4GkmfRepository } from '#features/periode-modul/composables/useFm4GkmfRepository'
import {
  FM4_ACTIVE_DUMMY_ROLE,
  FM4_PENDING_STATUS_FILTER_OPTIONS,
  FM4_SORT_OPTIONS,
  matchesFm4PendingStatusFilter,
  resolveFm4RpnLevelMeta,
  type Fm4DashboardContext,
  type Fm4DashboardDummyData,
  type Fm4DummyRole,
  type Fm4PendingStatusFilter,
  type Fm4SortValue,
} from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4GkmfRepository('auto')

const activeDummyRole = ref<Fm4DummyRole>(FM4_ACTIVE_DUMMY_ROLE)
const dashboardData = ref<Fm4DashboardDummyData | null>(null)
const loading = ref(true)

const searchKeyword = ref('')
const statusFilter = ref<Fm4PendingStatusFilter>('all')
const sortOrder = ref<Fm4SortValue>('az')
const currentPage = ref(1)
const pageSize = 5

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
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

const context = computed<Fm4DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const isGkmfMode = computed(() => activeDummyRole.value === 'gkmf')

const filteredRows = computed(() => {
  if (!dashboardData.value) return []

  const keyword = searchKeyword.value.trim().toLowerCase()
  const rows = dashboardData.value.rtlRows.filter((row) => {
    const searchable = `${row.title} ${row.impact} ${row.frequency} ${row.detection}`.toLowerCase()
    const matchesKeyword = keyword.length === 0 || searchable.includes(keyword)
    const matchesStatus = matchesFm4PendingStatusFilter(row.status, statusFilter.value)

    return matchesKeyword && matchesStatus
  })

  rows.sort((left, right) => {
    if (sortOrder.value === 'za') {
      return right.title.localeCompare(left.title)
    }

    return left.title.localeCompare(right.title)
  })

  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const paginatedRows = computed(() => {
  const offset = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(offset, offset + pageSize).map((row, index) => ({
    ...row,
    rowNumber: offset + index + 1,
  }))
})

const showingFrom = computed(() => {
  if (!filteredRows.value.length) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() => {
  if (!filteredRows.value.length) return 0
  return Math.min(currentPage.value * pageSize, filteredRows.value.length)
})

const waitingSummaryText = computed(() => {
  if (!dashboardData.value) return ''
  return `${dashboardData.value.waitingSummaryCount} ${dashboardData.value.waitingSummaryLabel}`
})

function buildPendingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/temuan-pending`
}

function buildPendingDetailRoute(temuanPendingId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/temuan-pending/${encodeURIComponent(temuanPendingId)}`
}

async function goToPendingAnalysisPage() {
  await navigateTo(buildPendingRoute())
}

async function goToPendingDetail(temuanPendingId: string) {
  await navigateTo(buildPendingDetailRoute(temuanPendingId))
}

watch([searchKeyword, statusFilter, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPage) => {
  if (currentPage.value > nextTotalPage) {
    currentPage.value = nextTotalPage
  }
})

watch(context, async (nextContext) => {
  loading.value = true
  dashboardData.value = await repository.getDashboardData(nextContext)
  loading.value = false
}, { immediate: true })
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isGkmfMode">
      <section
        v-if="dashboardData"
        class="rounded-[22px] bg-[linear-gradient(165deg,#ef0000_0%,#d90000_100%)] px-5 py-6 text-white shadow-[0_8px_22px_rgba(15,23,42,0.22)] md:px-6 md:py-7"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div>
            <h1 class="text-[clamp(2.15rem,3.45vw,4rem)] font-bold leading-tight">
              {{ dashboardData.hero.title }}
            </h1>
            <p class="mt-4 max-w-[760px] text-[clamp(1.1rem,1.45vw,1.8rem)] text-white/[0.93]">
              {{ dashboardData.hero.description }}
            </p>
          </div>

          <aside class="min-w-[180px] justify-self-start rounded-[18px] bg-white/20 px-5 py-4 md:justify-self-end">
            <span class="block text-[0.8rem] uppercase tracking-[0.08em] text-white/[0.76]">{{ dashboardData.hero.statusLabel }}</span>
            <strong class="mt-2 block text-[clamp(1.85rem,2.6vw,3rem)] font-bold uppercase leading-tight">{{ dashboardData.hero.statusValue }}</strong>
            <span class="mt-2 block text-[clamp(1rem,1.2vw,1.4rem)]">{{ dashboardData.hero.statusDate }}</span>
          </aside>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article class="rounded-[18px] bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-4 py-4">
            <p class="text-[0.95rem] uppercase tracking-[0.04em] text-white/80">{{ dashboardData.hero.currentStageLabel }}</p>
            <p class="mt-2 text-[clamp(1.7rem,2.35vw,2.6rem)] font-bold leading-snug">{{ dashboardData.hero.currentStageValue }}</p>
          </article>
          <article class="rounded-[18px] bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-4 py-4">
            <p class="text-[0.95rem] uppercase tracking-[0.04em] text-white/80">{{ dashboardData.hero.deadlineLabel }}</p>
            <p class="mt-2 text-[clamp(1.7rem,2.35vw,2.6rem)] font-bold leading-snug">{{ dashboardData.hero.deadlineValue }}</p>
          </article>
          <article class="rounded-[18px] bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-4 py-4">
            <p class="text-[0.95rem] uppercase tracking-[0.04em] text-white/80">{{ dashboardData.hero.noteLabel }}</p>
            <p class="mt-2 text-[clamp(1.7rem,2.35vw,2.6rem)] font-bold leading-snug">{{ dashboardData.hero.noteValue }}</p>
          </article>
        </div>
      </section>

      <section v-if="dashboardData" class="rounded-[24px] border border-[#d6dae0] bg-[#efefef] p-4 md:p-5 xl:p-6">
        <h2 class="text-[clamp(2rem,2.8vw,3.35rem)] font-semibold leading-tight text-[#11141b]">
          Capaian Indikator
        </h2>

        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <article
            v-for="item in dashboardData.indicators"
            :key="item.id"
            class="rounded-[18px] bg-[#f2f2f3] px-4 pb-4 pt-4 shadow-[inset_0_0_0_1px_#ececec]"
          >
            <div class="flex items-start justify-between gap-2.5">
              <h3 class="text-[clamp(1.3rem,1.8vw,2rem)] font-semibold text-[#4a4b4f]">
                {{ item.title }}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-7 w-7 text-[#67696d]">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17L17 7M9 7h8v8"
                />
              </svg>
            </div>

            <p class="mt-5 text-[clamp(2.9rem,4vw,4.45rem)] font-semibold leading-none text-[#06090f]">
              {{ item.value }}
            </p>

            <div class="mt-4 h-[16px] w-[250px] max-w-full overflow-hidden rounded-full bg-[#dce2e9]">
              <span class="block h-full rounded-full bg-[#45cf74]" :style="{ width: `${item.progressPercent}%` }" />
            </div>

            <p class="mt-3 text-[clamp(1.15rem,1.4vw,1.7rem)] text-[#1f76aa]">
              {{ item.subtitle }}
            </p>
          </article>
        </div>
      </section>

      <section v-if="dashboardData" class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <article class="rounded-[22px] border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
          <p class="text-[clamp(1rem,1.1vw,1.4rem)] font-semibold uppercase tracking-[0.03em] text-[#95a0b2]">
            {{ dashboardData.ringkasan.sectionLabel }}
          </p>
          <h2 class="mt-1 text-[clamp(2.05rem,2.7vw,3.3rem)] font-semibold text-[#131722]">
            {{ dashboardData.ringkasan.title }}
          </h2>

          <div class="mt-4 space-y-4 text-[clamp(1.1rem,1.45vw,1.8rem)] leading-relaxed text-[#596477]">
            <p v-for="(paragraph, index) in dashboardData.ringkasan.paragraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>

          <div class="mt-6 flex items-center gap-3 text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
            <span class="h-px flex-1 bg-[#d8dde4]" />
            <span>Lakukan Analisis</span>
            <span class="h-px flex-1 bg-[#d8dde4]" />
          </div>

          <article class="mt-4 rounded-[18px] border border-[#e1e4ea] bg-[#f4f4f5] p-4 shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
            <div class="rounded-[16px] border-l-[4px] border-[#e40000] bg-white p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-[clamp(1.95rem,2.6vw,3.1rem)] font-semibold leading-tight text-[#111827]">
                    {{ dashboardData.ringkasan.analysisTitle }}
                  </h3>
                  <p class="mt-2 text-[clamp(1.1rem,1.3vw,1.65rem)] text-[#667286]">
                    {{ dashboardData.ringkasan.analysisDescription }}
                  </p>
                </div>

                <span class="inline-flex rounded-[10px] bg-[#ffe1df] px-4 py-1.5 text-[clamp(1.05rem,1.2vw,1.45rem)] font-semibold text-[#e30000]">
                  {{ dashboardData.ringkasan.analysisModeLabel }}
                </span>
              </div>

              <button
                type="button"
                class="mt-4 flex w-full items-center gap-3 rounded-[16px] bg-[#e30000] px-5 py-4 text-left text-white shadow-[0_8px_18px_rgba(227,0,0,0.24)] transition hover:bg-[#cc0000]"
                @click="goToPendingAnalysisPage"
              >
                <span class="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff3a3f]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" />
                  </svg>
                </span>

                <span>
                  <span class="block text-[clamp(2rem,2.7vw,3rem)] font-semibold leading-tight">{{ dashboardData.ringkasan.analysisCtaLabel }}</span>
                  <span class="mt-1 block text-[clamp(1.1rem,1.2vw,1.45rem)] uppercase tracking-[0.01em] text-white/90">{{ dashboardData.ringkasan.analysisCtaHint }}</span>
                </span>
              </button>
            </div>
          </article>
        </article>

        <div class="grid gap-4">
          <article class="rounded-[22px] border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
            <p class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">{{ dashboardData.scopeCard.label }}</p>
            <h3 class="mt-2 flex items-center gap-2 text-[clamp(1.95rem,2.4vw,3rem)] font-semibold text-[#182033]">
              <span>{{ dashboardData.scopeCard.scopeName }}</span>
              <span class="inline-flex rounded-md bg-[#d8e9ff] px-2 py-0.5 text-[clamp(1rem,1.05vw,1.2rem)] font-semibold text-[#2a66de]">{{ dashboardData.scopeCard.scopeBadge }}</span>
            </h3>
            <p class="mt-2 text-[clamp(1.1rem,1.3vw,1.55rem)] leading-relaxed text-[#586476]">
              {{ dashboardData.scopeCard.scopeDescription }}
            </p>

            <div class="my-4 h-px bg-[#d7dce3]" />

            <p class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">{{ dashboardData.scopeCard.unitLabel }}</p>
            <p class="mt-2 text-[clamp(1.95rem,2.4vw,3rem)] font-semibold text-[#182033]">
              {{ dashboardData.scopeCard.unitName }}
            </p>
            <p class="mt-2 text-[clamp(1.1rem,1.3vw,1.55rem)] leading-relaxed text-[#586476]">
              {{ dashboardData.scopeCard.unitDescription }}
            </p>
          </article>

          <article class="rounded-[22px] border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
            <p class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">Pihak Terkait</p>
            <h3 class="mt-2 text-[clamp(1.95rem,2.4vw,2.7rem)] font-semibold text-[#182033]">Role dan User</h3>

            <div class="mt-4 space-y-3">
              <article
                v-for="user in dashboardData.relatedUsers"
                :key="user.id"
                class="rounded-[16px] border border-[#d9dde4] bg-[#f5f6f8] p-3.5"
              >
                <div class="flex items-start gap-3">
                  <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9ca6b4] text-[1.1rem] font-semibold text-white">
                    {{ user.initials }}
                  </span>

                  <div class="min-w-0">
                    <span class="inline-flex rounded-md bg-[#d8e9ff] px-2 py-0.5 text-[0.95rem] font-semibold text-[#2a66de]">{{ user.roleTag }}</span>
                    <p class="mt-1 truncate text-[clamp(1.5rem,1.8vw,2rem)] font-semibold text-[#1a2235]">
                      {{ user.name }}
                    </p>
                    <p class="truncate text-[clamp(1.15rem,1.25vw,1.45rem)] text-[#616d80]">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section v-if="dashboardData" class="rounded-[22px] border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-[clamp(2rem,2.8vw,3.35rem)] font-semibold leading-tight text-[#11141b]">
            Daftar Analisis FMEA & RTL
          </h2>

          <span class="inline-flex rounded-full bg-[#f2df7b] px-5 py-1.5 text-[clamp(1rem,1.15vw,1.35rem)] font-medium text-[#a9770b]">
            {{ waitingSummaryText }}
          </span>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-[530px]">
            <input
              v-model="searchKeyword"
              type="search"
              placeholder="Search"
              class="h-14 w-full rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[clamp(1.1rem,1.2vw,1.4rem)] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[220px]">
            <select
              v-model="statusFilter"
              class="h-14 w-full appearance-none rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-10 text-[clamp(1.1rem,1.2vw,1.4rem)] text-[#9099a8] outline-none"
            >
              <option
                v-for="option in FM4_PENDING_STATUS_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[220px]">
            <select
              v-model="sortOrder"
              class="h-14 w-full appearance-none rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-10 text-[clamp(1.1rem,1.2vw,1.4rem)] text-[#9099a8] outline-none"
            >
              <option
                v-for="option in FM4_SORT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-5 overflow-x-auto rounded-[20px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[1300px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">No</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">Judul</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">Dampak</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">Frekuensi</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">Deteksi</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">RPN</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-center text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#2f3744]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row.id">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1rem,1.1vw,1.25rem)] text-[#2f3744]">
                  {{ row.rowNumber }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.1rem,1.3vw,1.6rem)] font-semibold text-[#3b3f46]">
                  {{ row.title }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.2vw,1.45rem)] text-[#3f4551]">
                  {{ row.impact }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.2vw,1.45rem)] text-[#3f4551]">
                  {{ row.frequency }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.2vw,1.45rem)] text-[#3f4551]">
                  {{ row.detection }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <span
                    class="inline-flex min-w-[120px] items-center justify-center rounded-[14px] px-4 py-1.5 text-[clamp(1rem,1.1vw,1.3rem)] font-semibold"
                    :class="resolveFm4RpnLevelMeta(row.rpnLevel).badgeClass"
                  >
                    {{ resolveFm4RpnLevelMeta(row.rpnLevel).label }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-center">
                  <button
                    type="button"
                    class="inline-flex rounded-[16px] border border-[#ef3a3a] px-6 py-2 text-[clamp(1rem,1.15vw,1.4rem)] font-semibold text-[#e40000] transition hover:bg-[#fff1f1]"
                    @click="goToPendingDetail(row.id)"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>

              <tr v-if="paginatedRows.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data analisis tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1.15rem,1.25vw,1.5rem)] text-[#5d6778]">
            Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[16px] border border-[#d8dde5] px-6 py-2 text-[clamp(1rem,1.1vw,1.3rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-[16px] bg-[#e30000] px-6 py-2 text-[clamp(1rem,1.1vw,1.3rem)] font-semibold text-white"
            >
              {{ currentPage }}
            </button>

            <button
              type="button"
              class="rounded-[16px] border border-[#d8dde5] px-6 py-2 text-[clamp(1rem,1.1vw,1.3rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat data FM4...
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan saat ini disiapkan untuk role <strong>gkmf</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">FM4_ACTIVE_DUMMY_ROLE</code>
        pada file data FM4 secara manual.
      </p>
    </section>
  </section>
</template>
