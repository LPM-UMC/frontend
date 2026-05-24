<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { useFm4KaprodiRepository } from '#features/periode-modul/composables/useFm4KaprodiRepository'
import {
  FM4_KAPRODI_PROGRESS_FILTER_OPTIONS,
  FM4_KAPRODI_SORT_OPTIONS,
  matchesFm4KaprodiProgressFilter,
  type Fm4KaprodiProgressFilterValue,
  type Fm4KaprodiSortValue,
  type Fm4OtherRoleDashboardDummyData,
} from '#features/periode-modul/data/fm4KaprodiDummy'
import {
  resolveFm4RpnLevelMeta,
  type Fm4DashboardContext,
} from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4KaprodiRepository('auto')

const dashboardData = ref<Fm4OtherRoleDashboardDummyData | null>(null)
const loading = ref(true)

const searchKeyword = ref('')
const statusFilter = ref<Fm4KaprodiProgressFilterValue>('all')
const sortOrder = ref<Fm4KaprodiSortValue>('az')
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

const filteredRows = computed(() => {
  if (!dashboardData.value) return []

  const keyword = searchKeyword.value.trim().toLowerCase()
  const rows = dashboardData.value.rtlRows.filter((row) => {
    const searchable = `${row.title} ${row.impact} ${row.frequency} ${row.detection}`.toLowerCase()
    const matchesKeyword = keyword.length === 0 || searchable.includes(keyword)
    const matchesStatus = matchesFm4KaprodiProgressFilter(row.rpnLevel, statusFilter.value)
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

function handleViewDetail(rtlId: string) {
  // Placeholder sampai route detail role lain tersedia.
  console.info('[fm4][other-role] view rtl detail', { context: context.value, rtlId })
}

watch([searchKeyword, statusFilter, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPage) => {
  if (currentPage.value > nextTotalPage) {
    currentPage.value = nextTotalPage
  }
})

watch(
  context,
  async (nextContext) => {
    loading.value = true
    dashboardData.value = await repository.getOtherRoleDashboardData(nextContext)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <section v-if="dashboardData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6 xl:p-7">
      <h1 class="text-[clamp(1.95rem,2.65vw,3.35rem)] font-semibold leading-tight text-[#11141b]">
        {{ dashboardData.headerTitle }}
      </h1>
      <p class="mt-3 max-w-[1320px] text-[clamp(1.06rem,1.25vw,1.45rem)] leading-relaxed text-[#596579]">
        {{ dashboardData.headerDescription }}
      </p>
    </section>

    <section v-if="dashboardData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6 xl:p-7">
      <h2 class="text-[clamp(1.95rem,2.65vw,3.35rem)] font-semibold leading-tight text-[#11141b]">
        Capaian Indikator
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <article
          v-for="item in dashboardData.indicators"
          :key="item.id"
          class="rounded-xl bg-[#f3f3f3] px-4 pb-4 pt-4 shadow-[inset_0_0_0_1px_#ebebeb]"
        >
          <div class="flex items-start justify-between gap-2.5">
            <h3 class="text-[clamp(1.05rem,1.35vw,1.8rem)] font-semibold leading-snug text-[#4a4b4f]">
              {{ item.title }}
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 text-[#67696d]">
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

          <p class="mt-4 text-[clamp(2.4rem,3.2vw,3.8rem)] font-semibold leading-none text-[#06090f]">
            {{ item.value }}
          </p>

          <div class="mt-4 h-[14px] w-[220px] max-w-full overflow-hidden rounded-full bg-[#dce2e9]">
            <span class="block h-full rounded-full bg-[#45cf74]" :style="{ width: `${item.progressPercent}%` }" />
          </div>

          <p class="mt-3 text-[clamp(1rem,1.2vw,1.35rem)] text-[#1f76aa]">
            {{ item.subtitle }}
          </p>
        </article>
      </div>
    </section>

    <section v-if="dashboardData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6 xl:p-7">
      <h2 class="text-[clamp(1.95rem,2.65vw,3.35rem)] font-semibold leading-tight text-[#11141b]">
        Daftar Analisis FMEA & RTL
      </h2>

      <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
        <label class="relative block w-full xl:max-w-[530px]">
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="Search"
            class="h-14 w-full rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
        </label>

        <label class="relative block w-full xl:w-[220px]">
          <select
            v-model="statusFilter"
            class="h-14 w-full appearance-none rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-10 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#9099a8] outline-none"
          >
            <option
              v-for="option in FM4_KAPRODI_PROGRESS_FILTER_OPTIONS"
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
            class="h-14 w-full appearance-none rounded-[20px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-10 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#9099a8] outline-none"
          >
            <option
              v-for="option in FM4_KAPRODI_SORT_OPTIONS"
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
        <table class="w-full min-w-[1250px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">No</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">Judul</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">Dampak</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">Frekuensi</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">Deteksi</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">RPN</th>
              <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-center text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-[#2f3744]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in paginatedRows" :key="row.id">
              <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1rem,1.05vw,1.2rem)] text-[#2f3744]">
                {{ row.rowNumber }}
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.1rem,1.2vw,1.4rem)] font-semibold text-[#3b3f46]">
                {{ row.title }}
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#3f4551]">
                {{ row.impact }}
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#3f4551]">
                {{ row.frequency }}
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4 text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#3f4551]">
                {{ row.detection }}
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4">
                <span
                  class="inline-flex min-w-[120px] items-center justify-center rounded-[14px] px-4 py-1.5 text-[clamp(1rem,1.1vw,1.2rem)] font-semibold"
                  :class="resolveFm4RpnLevelMeta(row.rpnLevel).badgeClass"
                >
                  {{ resolveFm4RpnLevelMeta(row.rpnLevel).label }}
                </span>
              </td>
              <td class="border-b border-[#e8edf3] px-4 py-4 text-center">
                <button
                  type="button"
                  class="inline-flex rounded-[16px] border border-[#ef3a3a] px-6 py-2 text-[clamp(1rem,1.1vw,1.25rem)] font-semibold text-[#e40000] transition hover:bg-[#fff1f1]"
                  @click="handleViewDetail(row.id)"
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
        <p class="text-[clamp(1.05rem,1.15vw,1.3rem)] text-[#5d6778]">
          Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length }}</strong> data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[16px] border border-[#d8dde5] px-6 py-2 text-[clamp(1rem,1.1vw,1.2rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            class="rounded-[16px] bg-[#e30000] px-6 py-2 text-[clamp(1rem,1.1vw,1.2rem)] font-semibold text-white"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[16px] border border-[#d8dde5] px-6 py-2 text-[clamp(1rem,1.1vw,1.2rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
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
  </section>
</template>
