<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  FM3_ACTIVE_DUMMY_ROLE,
  FM3_SORT_OPTIONS,
  FM3_STATUS_FILTER_OPTIONS,
  getFm3GkmfPendingValidationDummyData,
  matchesFm3StatusFilter,
  resolveFm3FindingStatusMeta,
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

function normalizeRouteParam(
  value: string | string[] | undefined,
  fallbackValue: string
): string {
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

const isGkmfMode = computed(() => activeDummyRole.value === 'gkmf')

const pendingData = computed(() =>
  getFm3GkmfPendingValidationDummyData({
    periodeModulId: periodeModulId.value,
    unitId: unitId.value,
  })
)

const filteredRows = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  const rows = pendingData.value.findings.filter((row) => {
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

const waitingSummaryText = computed(
  () => `${pendingData.value.waitingSummaryCount} ${pendingData.value.waitingSummaryLabel}`
)

function buildValidationRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}/validasi`
}

async function goToValidation(temuanId: string) {
  await navigateTo(buildValidationRoute(temuanId))
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
    <template v-if="isGkmfMode">
      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <h1 class="text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-tight text-[#11141b]">
          {{ pendingData.title }}
        </h1>
        <p class="mt-3 max-w-[1320px] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[#5b6679]">
          {{ pendingData.description }}
        </p>
      </section>

      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-tight text-[#11141b]">
            Daftar Temuan Belum Divalidasi
          </h2>

          <span class="inline-flex rounded-full bg-[#f2df7b] px-4 py-1.5 text-[1rem] font-medium text-[#a9770b]">
            {{ waitingSummaryText }}
          </span>
        </div>

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
          <table class="w-full min-w-[1200px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">No</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Judul</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Aspek</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Penanggung Jawab</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Tanggal Dibuat</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[0.95rem] font-semibold text-[#2f3744]">Status</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-center text-[0.95rem] font-semibold text-[#2f3744]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="row.id">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ row.rowNumber }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.05rem] font-semibold text-[#3b3f46]">
                  <p class="max-w-[320px] leading-snug">
                    {{ row.title }}
                  </p>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.02rem] text-[#3f4551]">
                  {{ row.aspect }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.02rem] text-[#3f4551]">
                  {{ row.responsiblePerson }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1.02rem] text-[#3f4551]">
                  {{ row.createdAt }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <span
                    class="inline-flex min-w-[104px] items-center justify-center rounded-[14px] px-3 py-1 text-[0.95rem] font-semibold"
                    :class="resolveFm3FindingStatusMeta(row.status).badgeClass"
                  >
                    {{ resolveFm3FindingStatusMeta(row.status).label }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-center">
                  <button
                    type="button"
                    class="inline-flex rounded-[14px] border border-[#ef3a3a] px-5 py-2 text-[1rem] font-semibold text-[#e40000] transition hover:bg-[#fff1f1]"
                    @click="goToValidation(row.id)"
                  >
                    Validasi
                  </button>
                </td>
              </tr>

              <tr v-if="paginatedRows.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
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
        Tampilan saat ini disiapkan untuk role <strong>gkmf</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">activeDummyRole</code>
        pada file ini secara manual.
      </p>
    </section>
  </section>
</template>
