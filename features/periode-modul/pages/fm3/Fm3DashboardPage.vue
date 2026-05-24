<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  FM3_ACTIVE_DUMMY_ROLE,
  FM3_SORT_OPTIONS,
  FM3_STATUS_FILTER_OPTIONS,
  getFm3GkmfDashboardDummyData,
  matchesFm3StatusFilter,
  resolveFm3FindingStatusMeta,
  type Fm3FindingRow,
  type Fm3DummyRole,
  type Fm3SortValue,
  type Fm3StatusFilterValue,
} from '#features/periode-modul/data/fm3GkmfDummy'

const route = useRoute()

const activeDummyRole = ref<Fm3DummyRole>(FM3_ACTIVE_DUMMY_ROLE)
const pageSize = 5

const searchKeyword = ref('')
const statusFilter = ref<Fm3StatusFilterValue>('all')
const sortOrder = ref<Fm3SortValue>('az')
const currentPage = ref(1)

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

const isDashboardMode = computed(() =>
  ['gkmf', 'kaprodi', 'dekan', 'lpm', 'wr1'].includes(activeDummyRole.value)
)

// Dekan / LPM / Wakil Rektor 1 hanya bisa melihat, tidak bisa edit/hapus/input
const isReadOnlyMode = computed(() =>
  ['dekan', 'lpm', 'wr1'].includes(activeDummyRole.value)
)

const dashboardData = computed(() =>
  getFm3GkmfDashboardDummyData({
    periodeModulId: periodeModulId.value,
    unitId: unitId.value,
  })
)

const filteredRows = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  const rows = dashboardData.value.findings.filter((row) => {
    const searchable = `${row.title} ${row.aspect} ${row.responsiblePerson}`.toLowerCase()
    const matchesKeyword = keyword.length === 0 || searchable.includes(keyword)
    const matchesStatus = matchesFm3StatusFilter(row.status, statusFilter.value)

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

function buildPendingValidationRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/belum-divalidasi`
}

function buildCreateFindingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/create`
}

function buildValidationRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}/validasi`
}

function buildEditFindingRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}/edit`
}

function buildDetailFindingRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}`
}

async function handleInputTemuan() {
  if (activeDummyRole.value === 'kaprodi') {
    await navigateTo(buildCreateFindingRoute())
    return
  }

  await navigateTo(buildPendingValidationRoute())
}

async function goToValidation(rowId: string) {
  await navigateTo(buildValidationRoute(rowId))
}

async function goToEditFinding(rowId: string) {
  await navigateTo(buildEditFindingRoute(rowId))
}

async function goToDetailFinding(rowId: string) {
  await navigateTo(buildDetailFindingRoute(rowId))
}

function handleDeleteFinding(_row: Fm3FindingRow) {
  // Placeholder untuk integrasi backend penghapusan temuan.
}

watch([searchKeyword, statusFilter, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPage) => {
  if (currentPage.value > nextTotalPage) {
    currentPage.value = nextTotalPage
  }
})
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isDashboardMode">
      <section class="rounded-xl bg-[linear-gradient(165deg,#f30000_0%,#d90000_100%)] px-4 py-5 text-white shadow-[0_6px_18px_rgba(15,23,42,0.16)] md:px-5 md:py-6 xl:px-6 xl:py-7">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div>
            <h1 class="text-[clamp(1.55rem,2.4vw,2.35rem)] font-bold leading-tight">
              {{ dashboardData.hero.title }}
            </h1>
            <p class="mt-2 max-w-[760px] text-[clamp(0.92rem,1.15vw,1rem)] text-white/[0.93]">
              {{ dashboardData.hero.description }}
            </p>
          </div>

          <aside class="min-w-[156px] justify-self-start rounded-xl bg-white/20 px-3 py-3 md:justify-self-end md:px-4">
            <span class="block text-[0.72rem] uppercase tracking-[0.06em] text-white/[0.78]">{{ dashboardData.hero.statusLabel }}</span>
            <strong class="mt-1.5 block text-[1.5rem] font-bold uppercase leading-tight">{{ dashboardData.hero.statusValue }}</strong>
            <span class="mt-1.5 block text-sm">{{ dashboardData.hero.statusDate }}</span>
          </aside>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
            <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.currentStageLabel }}</p>
            <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.currentStageValue }}</p>
          </article>
          <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
            <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.deadlineLabel }}</p>
            <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.deadlineValue }}</p>
          </article>
          <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
            <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.noteLabel }}</p>
            <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.noteValue }}</p>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
        <h2 class="text-[clamp(1.35rem,1.95vw,1.85rem)] font-semibold leading-tight text-[#080b12]">
          Capaian Indikator
        </h2>

        <div class="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <article
            v-for="item in dashboardData.indicators"
            :key="item.id"
            class="rounded-xl bg-[#f3f3f3] px-4 pb-4 pt-4 shadow-[inset_0_0_0_1px_#ebebeb]"
          >
            <div class="flex items-start justify-between gap-2.5">
              <h3 class="text-[clamp(1.02rem,1.35vw,1.2rem)] font-semibold text-[#4a4b4f]">
                {{ item.title }}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] text-[#67696d]">
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

            <p class="mt-3 text-[clamp(1.9rem,2.65vw,2.35rem)] font-semibold leading-none text-[#06090f]">
              {{ item.value }}
            </p>

            <div class="mt-3 h-[10px] w-[140px] overflow-hidden rounded-full bg-[#dce2e9]">
              <span class="block h-full rounded-full bg-[#45cf74]" :style="{ width: `${item.progressPercent}%` }" />
            </div>

            <p class="mt-2.5 text-[1.1rem] text-[#1f76aa]">
              {{ item.subtitle }}
            </p>
          </article>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <article class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
          <p class="text-[1rem] font-semibold uppercase tracking-[0.03em] text-[#95a0b2]">
            {{ dashboardData.ringkasan.sectionLabel }}
          </p>
          <h2 class="mt-1 text-[clamp(1.5rem,2.15vw,2rem)] font-semibold text-[#131722]">
            {{ dashboardData.ringkasan.title }}
          </h2>

          <div class="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-[#596477]">
            <p v-for="(paragraph, index) in dashboardData.ringkasan.paragraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>

          <div class="mt-5 flex items-center gap-3 text-[1rem] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
            <span class="h-px flex-1 bg-[#d8dde4]" />
            <span>Isi Objek Evaluasi</span>
            <span class="h-px flex-1 bg-[#d8dde4]" />
          </div>

          <article class="mt-4 rounded-xl border border-[#e5d7d7] bg-[#f4f4f5] p-4 shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
            <div class="rounded-xl border-l-[4px] border-[#e40000] bg-white p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-[1.8rem] font-semibold leading-tight text-[#111827] md:text-[1.95rem]">
                    {{ dashboardData.ringkasan.objectTitle }}
                  </h3>
                  <p class="mt-2 text-[1.05rem] text-[#667286]">
                    {{ dashboardData.ringkasan.objectDescription }}
                  </p>
                </div>

                <span class="inline-flex rounded-md bg-[#ffe1df] px-3 py-1 text-[1.1rem] font-semibold text-[#e30000]">
                  {{ dashboardData.ringkasan.objectModeLabel }}
                </span>
              </div>

              <!-- CTA hanya tampil untuk role yang bisa input/validasi -->
              <button
                v-if="!isReadOnlyMode"
                type="button"
                class="mt-4 flex w-full items-center gap-3 rounded-xl bg-[#e30000] px-4 py-3 text-left text-white shadow-[0_8px_18px_rgba(227,0,0,0.24)] transition hover:bg-[#cc0000]"
                @click="handleInputTemuan"
              >
                <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff3a3f]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
                  </svg>
                </span>

                <span>
                  <span class="block text-[1.9rem] font-semibold leading-tight md:text-[2rem]">{{ dashboardData.ringkasan.ctaLabel }}</span>
                  <span class="mt-1 block text-[1rem] uppercase tracking-[0.01em] text-white/90 md:text-[1.05rem]">{{ dashboardData.ringkasan.ctaHint }}</span>
                </span>
              </button>

              <!-- Pesan read-only untuk dekan / lpm / wr1 -->
              <div
                v-else
                class="mt-4 flex items-center gap-3 rounded-xl border border-[#e0e4ea] bg-[#f5f6f8] px-4 py-3.5 text-[1rem] text-[#596477]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>Anda hanya dapat melihat data temuan pada halaman ini.</span>
              </div>
            </div>
          </article>
        </article>

        <div class="grid gap-3">
          <article class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
            <p class="text-[1rem] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">{{ dashboardData.scopeCard.label }}</p>
            <h3 class="mt-2 flex items-center gap-2 text-[1.8rem] font-semibold text-[#182033] md:text-[1.95rem]">
              <span>{{ dashboardData.scopeCard.scopeName }}</span>
              <span class="inline-flex rounded-md bg-[#d8e9ff] px-2 py-0.5 text-[1rem] font-semibold text-[#2a66de]">{{ dashboardData.scopeCard.scopeBadge }}</span>
            </h3>
            <p class="mt-2 text-[1.05rem] leading-relaxed text-[#586476]">
              {{ dashboardData.scopeCard.scopeDescription }}
            </p>

            <div class="my-4 h-px bg-[#d7dce3]" />

            <p class="text-[1rem] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">{{ dashboardData.scopeCard.unitLabel }}</p>
            <p class="mt-2 text-[1.85rem] font-semibold text-[#182033] md:text-[2rem]">
              {{ dashboardData.scopeCard.unitName }}
            </p>
            <p class="mt-2 text-[1.05rem] leading-relaxed text-[#586476]">
              {{ dashboardData.scopeCard.unitDescription }}
            </p>
          </article>

          <article class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5">
            <p class="text-[1rem] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">Pihak Terkait</p>
            <h3 class="mt-2 text-[1.8rem] font-semibold text-[#182033] md:text-[1.95rem]">Role dan User</h3>

            <div class="mt-4 space-y-3">
              <article
                v-for="user in dashboardData.relatedUsers"
                :key="user.id"
                class="rounded-xl border border-[#d9dde4] bg-[#f5f6f8] p-3.5"
              >
                <div class="flex items-start gap-3">
                  <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9ca6b4] text-[1.1rem] font-semibold text-white">
                    {{ user.initials }}
                  </span>

                  <div class="min-w-0">
                    <span class="inline-flex rounded-md bg-[#d8e9ff] px-2 py-0.5 text-[0.95rem] font-semibold text-[#2a66de]">{{ user.roleTag }}</span>
                    <p class="mt-1 truncate text-[1.4rem] font-semibold text-[#1a2235] md:text-[1.55rem]">
                      {{ user.name }}
                    </p>
                    <p class="truncate text-[1.05rem] text-[#616d80]">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
        <h2 class="text-[clamp(1.4rem,2vw,2rem)] font-semibold leading-tight text-[#11141b]">
          Daftar Temuan
        </h2>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-[430px]">
            <input
              v-model="searchKeyword"
              type="search"
              placeholder="Search"
              class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[170px]">
            <select
              v-model="statusFilter"
              class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-10 text-[0.95rem] text-[#9099a8] outline-none"
            >
              <option
                v-for="option in FM3_STATUS_FILTER_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[170px]">
            <select
              v-model="sortOrder"
              class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-10 text-[0.95rem] text-[#9099a8] outline-none"
            >
              <option
                v-for="option in FM3_SORT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-5 overflow-x-auto rounded-[18px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[1000px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">No</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Judul</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Aspek</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Status</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Tanggal Dibuat</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-center text-[0.95rem] font-semibold text-[#2f3744]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row.id">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ row.rowNumber }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.05rem] font-semibold text-[#3b3f46]">
                  {{ row.title }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.02rem] text-[#3f4551]">
                  {{ row.aspect }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <span
                    class="inline-flex min-w-[104px] items-center justify-center rounded-[14px] px-3 py-1 text-[0.95rem] font-semibold"
                    :class="resolveFm3FindingStatusMeta(row.status).badgeClass"
                  >
                    {{ resolveFm3FindingStatusMeta(row.status).label }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.02rem] text-[#3f4551]">
                  {{ row.createdAt }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <!-- Edit: hanya kaprodi -->
                    <button
                      v-if="activeDummyRole === 'kaprodi'"
                      type="button"
                      class="inline-flex rounded-[12px] border border-[#cfd5de] px-4 py-1.5 text-[0.95rem] font-semibold text-[#606c7f] transition hover:bg-[#f6f8fb]"
                      @click="goToEditFinding(row.id)"
                    >
                      Edit
                    </button>
                    <!-- Edit: hanya gkmf (navigasi ke validasi) -->
                    <button
                      v-else-if="activeDummyRole === 'gkmf'"
                      type="button"
                      class="inline-flex rounded-[12px] border border-[#cfd5de] px-4 py-1.5 text-[0.95rem] font-semibold text-[#606c7f] transition hover:bg-[#f6f8fb]"
                      @click="goToValidation(row.id)"
                    >
                      Edit
                    </button>
                    <!-- Hapus: hanya kaprodi dan gkmf -->
                    <button
                      v-if="!isReadOnlyMode"
                      type="button"
                      class="inline-flex rounded-[12px] bg-[#e30000] px-4 py-1.5 text-[0.95rem] font-semibold text-white transition hover:bg-[#ca0000]"
                      @click="handleDeleteFinding(row)"
                    >
                      Hapus
                    </button>
                    <!-- Detail: semua role -->
                    <button
                      type="button"
                      class="inline-flex rounded-[12px] border border-[#e30000] px-4 py-1.5 text-[0.95rem] font-semibold text-[#e30000] transition hover:bg-[#fff1f1]"
                      @click="activeDummyRole === 'gkmf' ? goToValidation(row.id) : goToDetailFinding(row.id)"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedRows.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data temuan tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[1rem] text-[#5d6778]">
            Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.9rem] font-semibold text-white"
            >
              {{ currentPage }}
            </button>

            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan saat ini disiapkan untuk role <strong>kaprodi</strong>, <strong>gkmf</strong>, <strong>dekan</strong>, <strong>lpm</strong>, dan <strong>wr1</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">activeDummyRole</code>
        pada file ini secara manual.
      </p>
    </section>
  </section>
</template>
