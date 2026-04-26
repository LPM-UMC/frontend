<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'

type SortOrder = 'asc' | 'desc'
type IntegrationFilter = 'all' | 'integrated' | 'manual'

interface Fm1ObjekListRow {
  id: string
  name: string
  integration: Exclude<IntegrationFilter, 'all'>
}

const PAGE_SIZE = 5

const route = useRoute()

const searchQuery = ref('')
const sortOrder = ref<SortOrder>('asc')
const integrationFilter = ref<IntegrationFilter>('all')
const currentPage = ref(1)

const staticRows: Fm1ObjekListRow[] = [
  { id: 'mata-kuliah', name: 'Mata Kuliah', integration: 'integrated' },
  { id: 'mitra', name: 'Mitra', integration: 'integrated' },
  { id: 'lorem-ipsun', name: 'Lorem Ipsun', integration: 'integrated' },
  { id: 'loremipsun', name: 'Loremipsun', integration: 'manual' },
  { id: 'lorem-ipsun-2', name: 'Lorem Ipsun', integration: 'manual' },
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

function getIntegrationLabel(type: Fm1ObjekListRow['integration']) {
  return type === 'integrated' ? 'Terintegrasi GS' : 'Manual'
}

function getIntegrationClass(type: Fm1ObjekListRow['integration']) {
  return type === 'integrated'
    ? 'bg-[#a6efb0] text-[#0f8a2f]'
    : 'bg-[#d5dbe4] text-[#4b5b70]'
}

function buildObjekDetailPath(objekId: string): string | null {
  if (!routePeriodeModulId.value || !routeUnitId.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value)}/unit/${encodeURIComponent(routeUnitId.value)}/fm1/objek/${encodeURIComponent(objekId)}`
}

async function openObjekDetail(objekId: string) {
  const targetPath = buildObjekDetailPath(objekId)
  if (!targetPath) return

  await navigateTo(targetPath)
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1120px] px-2.5 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 md:px-4.5 lg:px-5">
    <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.06)] sm:px-6 sm:py-7 lg:px-7 lg:py-8">
      <h1 class="text-[26px] font-semibold leading-[1.12] text-[#111827] sm:text-[32px]">
        Objek Evaluasi
      </h1>
      <p class="mt-3 text-[16px] text-[#556175] sm:text-[20px]">
        Lorem Ipsum
      </p>
    </article>

    <article class="mt-3.5 rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-4 shadow-[0_2px_6px_rgba(15,23,42,0.06)] sm:p-5 lg:p-6">
      <h2 class="text-[26px] font-semibold leading-[1.15] text-[#111827] sm:text-[32px]">
        Objek Evaluasi
      </h2>

      <div class="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="relative w-full max-w-[520px]">
          <input
            v-model="searchQuery"
            type="search"
            class="h-[50px] w-full rounded-[16px] border border-[#cfd5df] bg-[#f3f5f7] px-4 pr-11 text-[15px] text-[#4b5565] outline-none placeholder:text-[#9ca5b4] sm:text-[16px]"
            placeholder="Search"
          >
          <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#98a3b4]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </span>
        </div>

        <div class="flex w-full flex-wrap gap-2 lg:w-auto">
          <div class="relative min-w-[170px] flex-1 lg:flex-none">
            <select
              v-model="sortOrder"
              class="h-[50px] w-full appearance-none rounded-[16px] border border-[#cfd5df] bg-[#f3f5f7] px-4 pr-10 text-[15px] text-[#8b96a8] outline-none sm:text-[16px]"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca5b4]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>

          <div class="relative min-w-[190px] flex-1 lg:flex-none">
            <select
              v-model="integrationFilter"
              class="h-[50px] w-full appearance-none rounded-[16px] border border-[#cfd5df] bg-[#f3f5f7] px-4 pr-10 text-[15px] text-[#8b96a8] outline-none sm:text-[16px]"
            >
              <option value="all">Semua</option>
              <option value="integrated">Terintegrasi GS</option>
              <option value="manual">Manual</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca5b4]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div class="mt-4 overflow-x-auto rounded-[18px] border border-[#d7dce4]">
        <table class="min-w-[760px] w-full border-collapse">
          <thead class="bg-[#e8e8ea] text-left">
            <tr>
              <th class="border-r border-[#d9dee6] px-4 py-3 text-[14px] font-semibold text-[#353b45] sm:text-[15px]">No</th>
              <th class="border-r border-[#d9dee6] px-4 py-3 text-[14px] font-semibold text-[#353b45] sm:text-[15px]">Nama</th>
              <th class="border-r border-[#d9dee6] px-4 py-3 text-center text-[14px] font-semibold text-[#353b45] sm:text-[15px]">Integrasi Sistem</th>
              <th class="px-4 py-3 text-center text-[14px] font-semibold text-[#353b45] sm:text-[15px]">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-[#f4f4f6]">
            <tr
              v-for="(row, index) in paginatedRows"
              :key="row.id"
              class="border-t border-[#d9dee6]"
            >
              <td class="px-4 py-3 text-[14px] font-medium text-[#363b45] sm:text-[15px]">
                {{ showingFrom + index }}
              </td>
              <td class="px-4 py-3 text-[15px] font-semibold text-[#363b45] sm:text-[16px]">
                {{ row.name }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex rounded-[14px] px-3 py-1 text-[13px] font-medium sm:text-[14px]" :class="getIntegrationClass(row.integration)">
                  {{ getIntegrationLabel(row.integration) }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  class="inline-flex rounded-[12px] border border-[#e60000] px-3 py-1 text-[13px] font-semibold text-[#e60000] transition hover:bg-[#fff3f3] sm:text-[14px]"
                  @click="openObjekDetail(row.id)"
                >
                  Tambah
                </button>
              </td>
            </tr>

            <tr v-if="!paginatedRows.length">
              <td colspan="4" class="px-4 py-9 text-center text-[15px] text-[#8b96a8] sm:text-[16px]">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#dde2ea] pt-3">
        <p class="text-[13px] text-[#4f5b6f] sm:text-[14px]">
          Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ totalRows }}</strong> data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[10px] border border-[#d5dae3] px-3 py-1.5 text-[13px] font-medium text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[14px]"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            class="rounded-[10px] bg-[#e60000] px-3 py-1.5 text-[13px] font-medium text-white sm:text-[14px]"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[10px] border border-[#d5dae3] px-3 py-1.5 text-[13px] font-medium text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[14px]"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </article>
  </section>
</template>
