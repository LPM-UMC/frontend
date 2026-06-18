<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm6AdminRepository } from '#features/periode-modul/composables/useFm6AdminRepository'
import {
  FM6_ACTIVE_DUMMY_ROLE,
  type Fm6AdminRole,
  type Fm6DashboardContext,
  type Fm6DashboardDummyData,
} from '#features/periode-modul/data/fm6AdminDummy'

const route = useRoute()
const repository = useFm6AdminRepository('auto')

const activeDummyRole = ref<Fm6AdminRole>(FM6_ACTIVE_DUMMY_ROLE)
const dashboardData = ref<Fm6DashboardDummyData | null>(null)
const loading = ref(true)

const searchKeyword = ref('')
const selectedDate = ref('all')
const selectedProgram = ref('all')
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

const context = computed<Fm6DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const filteredRows = computed(() => {
  if (!dashboardData.value) return []

  const keyword = searchKeyword.value.trim().toLowerCase()

  return dashboardData.value.rows.filter((row) => {
    const matchesDate = selectedDate.value === 'all' || row.tanggalDibuat === selectedDate.value
    const matchesProgram = selectedProgram.value === 'all' || row.programStudiId === selectedProgram.value
    const searchable = `${row.namaSurvei} ${row.programStudi} ${row.tanggalDibuat} ${row.respondenLabel}`.toLowerCase()
    const matchesKeyword = keyword.length === 0 || searchable.includes(keyword)

    return matchesDate && matchesProgram && matchesKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize).map((row, index) => ({
    ...row,
    rowNumber: start + index + 1,
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

function buildCreateRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/create`
}

function buildDetailRoute(detailId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/detail/${encodeURIComponent(detailId)}`
}

async function goToCreatePage() {
  await navigateTo(buildCreateRoute())
}

async function goToDetailPage(detailId: string) {
  await navigateTo(buildDetailRoute(detailId))
}

watch([searchKeyword, selectedDate, selectedProgram], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch(
  [context, activeDummyRole],
  async ([nextContext, nextRole]) => {
    loading.value = true
    dashboardData.value = await repository.getDashboardData(nextContext, nextRole)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="dashboardData"
      class="rounded-[16px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-5 py-5 shadow-[0_5px_14px_rgba(15,23,42,0.18)] md:px-6 md:py-6"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <h1 class="text-[clamp(1.55rem,2.05vw,2.45rem)] font-semibold leading-tight text-white">
            {{ dashboardData.hero.title }}
          </h1>
          <p class="mt-3 max-w-[1300px] text-[clamp(0.95rem,1.02vw,1.25rem)] leading-relaxed text-white/95">
            {{ dashboardData.hero.description }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-[50px] min-w-[190px] items-center justify-center rounded-[18px] bg-white px-5 text-[clamp(1rem,1.08vw,1.25rem)] font-semibold text-[#121620] transition hover:bg-[#f5f5f5]"
          @click="goToCreatePage"
        >
          {{ dashboardData.hero.createButtonLabel }}
        </button>
      </div>
    </section>

    <section v-if="dashboardData" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
      <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
        {{ dashboardData.indicatorTitle }}
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in dashboardData.indicators"
          :key="item.id"
          class="rounded-[16px] bg-[#f4f4f5] px-4 py-4"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-[clamp(1rem,1.08vw,1.3rem)] font-semibold text-[#484b51]">
              {{ item.title }}
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-[#70727a] md:h-6 md:w-6">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </div>

          <p class="mt-3 text-[clamp(1.9rem,2.25vw,2.65rem)] font-semibold leading-none text-[#080b11]">
            {{ item.value }}
          </p>

          <div class="mt-3 h-[12px] w-[220px] max-w-full overflow-hidden rounded-full bg-[#dce2e8] md:h-[14px]">
            <span class="block h-full rounded-full bg-[#42cd72]" :style="{ width: `${item.progressPercent}%` }" />
          </div>

          <p class="mt-3 text-[clamp(0.9rem,0.95vw,1.05rem)] text-[#2176a8]">
            {{ item.subtitle }}
          </p>
        </article>
      </div>
    </section>

    <section v-if="dashboardData" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
      <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
        {{ dashboardData.tableTitle }}
      </h2>

      <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label class="relative block w-full lg:max-w-[520px]">
          <input
            v-model="searchKeyword"
            type="search"
            :placeholder="dashboardData.searchPlaceholder"
            class="h-[48px] w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#2e3746] outline-none placeholder:text-[#9aa3b3]"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
        </label>

        <label class="relative block w-full lg:w-[245px]">
          <select
            v-model="selectedDate"
            class="h-[48px] w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-10 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#606a7b] outline-none"
          >
            <option
              v-for="item in dashboardData.dateFilterOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </label>

        <label class="relative block w-full lg:w-[245px]">
          <select
            v-model="selectedProgram"
            class="h-[48px] w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-10 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#606a7b] outline-none"
          >
            <option
              v-for="item in dashboardData.programFilterOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </label>
      </div>

      <div class="mt-5 overflow-x-auto rounded-[20px] border border-[#dce1e8] bg-white">
        <table class="w-full min-w-[1000px] border-separate border-spacing-0 xl:min-w-[1080px]">
          <thead>
            <tr>
              <th class="w-[72px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">No</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">Nama Survei</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">Program Studi</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">Tanggal Dibuat</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">Responden</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-center text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in paginatedRows" :key="row.id">
              <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.9rem] text-[#2f3744] md:px-4 md:py-4">
                {{ row.rowNumber }}
              </td>
              <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.98rem] font-semibold text-[#3b3f46] md:px-4 md:py-4 md:text-[1.08rem]">
                {{ row.namaSurvei }}
              </td>
              <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.92rem] text-[#3f4551] md:px-4 md:py-4 md:text-[1rem]">
                {{ row.programStudi }}
              </td>
              <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.92rem] text-[#3f4551] md:px-4 md:py-4 md:text-[1rem]">
                {{ row.tanggalDibuat }}
              </td>
              <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.92rem] text-[#3f4551] md:px-4 md:py-4 md:text-[1rem]">
                {{ row.respondenLabel }}
              </td>
              <td class="border-b border-[#e8edf3] px-3 py-3 text-center md:px-4 md:py-4">
                <button
                  type="button"
                  class="inline-flex rounded-[12px] border border-[#ef2f2f] px-4 py-1.5 text-[0.9rem] font-semibold text-[#e20000] transition hover:bg-[#fff1f1] md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
                  @click="goToDetailPage(row.id)"
                >
                  Lihat Detail
                </button>
              </td>
            </tr>

            <tr v-if="paginatedRows.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                Data survei tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
        <p class="text-[0.92rem] text-[#5d6778] md:text-[1rem]">
          Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length }}</strong> data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            class="rounded-[12px] bg-[#e30000] px-4 py-1.5 text-[0.9rem] font-semibold text-white md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
            :disabled="currentPage === totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat data FM6...
    </section>
  </section>
</template>
