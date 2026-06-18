<template>
  <section class="mx-auto w-full max-w-280 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
    <article class="rounded-xl border border-[#d9dde4] bg-[#f6f7f8] p-5 shadow-sm sm:p-6 lg:p-7">
      <h1 class="text-xl font-bold leading-tight text-[#111827] sm:text-2xl">
        {{ $t('fmMonitoring.objekEvaluasi.judul') }}
      </h1>
      <p class="mt-1.5 text-sm text-[#556175] sm:text-base">
        {{ $t('fmMonitoring.objekEvaluasi.deskripsi') }}
      </p>
    </article>

    <article class="mt-4 rounded-xl border border-[#d9dde4] bg-[#f6f7f8] p-4 shadow-sm sm:p-5 lg:p-6">
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="relative w-full lg:max-w-100">
          <input
v-model="searchQuery" type="search"
            class="h-10.5 w-full rounded-lg border border-[#cfd5df] bg-white px-4 pr-10 text-sm text-[#4b5565] outline-none transition-colors placeholder:text-[#9ca5b4] focus:border-[#a0abbc] focus:ring-1 focus:ring-[#a0abbc]"
            :placeholder="$t('fmMonitoring.placeholder.cariObjekEvaluasi')">
          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98a3b4]">
            <svg
xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.8">
              <path
stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </span>
        </div>

        <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div class="relative w-full sm:w-40">
            <select
v-model="sortOrder"
              class="h-10.5 w-full appearance-none rounded-lg border border-[#cfd5df] bg-white px-4 pr-9 text-sm text-[#4b5565] outline-none transition-colors focus:border-[#a0abbc] focus:ring-1 focus:ring-[#a0abbc]">
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca5b4]">
              <svg
xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>

        </div>
      </div>

      <div class="mt-5 overflow-x-auto rounded-xl border border-[#d7dce4] bg-white shadow-sm">
        <table class="w-full min-w-160 border-collapse">
          <thead class="bg-[#e8e8ea] text-left">
            <tr>
              <th
                class="w-16 border-b border-[#d9dee6] px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#4b5565]">
                No
              </th>
              <th
                class="border-b border-[#d9dee6] px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#4b5565]">
                {{ $t('fmMonitoring.objekEvaluasi.model.nama') }}
              </th>
              <th
                class="border-b border-[#d9dee6] px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#4b5565]">
                {{ $t('fmMonitoring.objekEvaluasi.model.deskripsi') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#d9dee6] bg-[#fdfdfd]">
            <tr v-for="(row, index) in paginatedRows" :key="row.id" class="transition-colors hover:bg-[#f6f7f8]">
              <td class="px-4 py-3 text-sm font-medium text-[#363b45]">
                {{ showingFrom + index }}
              </td>
              <td class="px-4 py-3 text-sm font-semibold">
                <NuxtLink
:to="localePath(`/dashboard/periode-modul/1/unit/1/fm1/objek/1`)"
                  class="text-[#e60000] transition-colors hover:text-[#cc0000] hover:underline">
                  {{ row.name }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3 text-sm text-[#4b5565]">
                {{ row.deskripsi }}
              </td>
            </tr>

            <tr v-if="!paginatedRows.length">
              <td colspan="3" class="px-4 py-10 text-center text-sm text-[#8b96a8]">
                {{ $t('util.tidakAdaData') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="mt-4 flex flex-col items-center justify-between gap-4 border-t border-[#dde2ea] pt-4 sm:flex-row sm:gap-2">
        <div class="flex items-center gap-1.5">
          <button
type="button"
            class="rounded-lg border border-[#d5dae3] bg-white px-3 py-1.5 text-sm font-medium text-[#4f5b6f] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
            {{ $t('util.paginasi.sebelumnya') }}
          </button>

          <button
type="button"
            class="rounded-lg bg-[#e60000] px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm">
            {{ currentPage }}
          </button>

          <button
type="button"
            class="rounded-lg border border-[#d5dae3] bg-white px-3 py-1.5 text-sm font-medium text-[#4f5b6f] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
            {{ $t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'

definePageMeta({
  layout: 'periode-modul',
})

const localePath = useLocalePath()

type SortOrder = 'asc' | 'desc'
type IntegrationFilter = 'all' | 'integrated' | 'manual'

interface Fm1ObjekListRow {
  id: string
  name: string
  deskripsi: string // Ditambahkan properti deskripsi
  integration: Exclude<IntegrationFilter, 'all'>
}

const PAGE_SIZE = 5

const route = useRoute()

const searchQuery = ref('')
const sortOrder = ref<SortOrder>('asc')
const integrationFilter = ref<IntegrationFilter>('all')
const currentPage = ref(1)

// Ditambahkan mock data untuk deskripsi
const staticRows: Fm1ObjekListRow[] = [
  { id: 'mata-kuliah', name: 'Mata Kuliah', deskripsi: 'Evaluasi khusus untuk mata kuliah berjalan', integration: 'integrated' },
  { id: 'mitra', name: 'Mitra', deskripsi: 'Evaluasi kerjasama dengan mitra', integration: 'integrated' },
  { id: 'lorem-ipsun', name: 'Lorem Ipsun', deskripsi: 'Deskripsi untuk lorem ipsum', integration: 'integrated' },
  { id: 'loremipsun', name: 'Loremipsun', deskripsi: 'Deskripsi evaluasi manual', integration: 'manual' },
  { id: 'lorem-ipsun-2', name: 'Lorem Ipsun', deskripsi: 'Deskripsi evaluasi manual 2', integration: 'manual' },
]

function normalizeRouteParam(value: string | string[] | undefined): string | null {
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

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return staticRows.filter((row) => {
    const matchesQuery = !query || row.name.toLowerCase().includes(query)
    const matchesFilter = integrationFilter.value === 'all' || row.integration === integrationFilter.value
    return matchesQuery && matchesFilter
  })
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  rows.sort((left, right) => {
    if (sortOrder.value === 'desc') {
      return right.name.localeCompare(left.name)
    }
    return left.name.localeCompare(right.name)
  })
  return rows
})

const totalRows = computed(() => sortedRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / PAGE_SIZE)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedRows.value.slice(start, start + PAGE_SIZE)
})

const showingFrom = computed(() => {
  if (!totalRows.value) return 0
  return (currentPage.value - 1) * PAGE_SIZE + 1
})

const showingTo = computed(() => {
  if (!totalRows.value) return 0
  return Math.min(currentPage.value * PAGE_SIZE, totalRows.value)
})

watch([searchQuery, sortOrder, integrationFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function buildObjekDetailPath(objekId: string): string | null {
  if (!routePeriodeModulId.value || !routeUnitId.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value)}/unit/${encodeURIComponent(routeUnitId.value)}/fm1/objek/${encodeURIComponent(objekId)}`
}
</script>
