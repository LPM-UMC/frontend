<template>
  <section class="mt-3.5 rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
    <h2 class="text-[18px] font-semibold text-[#0f172a] sm:text-[20px]">
      {{ $t('periodeModul.daftarObjekEvaluasi') }}
    </h2>

    <div class="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-90">
        <input
v-model="search" type="search"
          class="h-9 w-full rounded-[12px] border border-[#d2d8e0] bg-[#f8f8f8] px-3 pr-10 text-[12px] text-[#364152] outline-none placeholder:text-[#9ba4b3]"
          placeholder="Cari Objek Evaluasi">

        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba4b3]">
          <svg
xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.8">
            <path
stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
        </span>
      </div>

      <div class="flex flex-col gap-2.5 sm:flex-row w-full sm:w-auto">
        <div class="relative w-full sm:w-40">
          <select
            v-model="isAllEvaluated"
            @change="onFilterChange"
            class="h-9 w-full appearance-none rounded-[12px] border border-[#d2d8e0] bg-[#f8f8f8] px-3 pr-8 text-[12px] text-[#445064] outline-none cursor-pointer transition hover:bg-white">
            <option value="">{{ $t('periodeModul.semuaStatus') }}</option>
            <option value="true">{{ $t('periodeModul.sudahDievaluasi') }}</option>
            <option value="false">{{ $t('periodeModul.belumDievaluasi') }}</option>
          </select>
  
          <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba4b3]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div class="mt-3.5 overflow-x-auto rounded-[14px] border border-[#d8dde4]" :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': fm1Store.isLoadingTable }">
      <table class="min-w-170 w-full border-collapse">
        <thead class="bg-[#ebebec] text-left">
          <tr>
            <th class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold w-10 text-center">No</th>
            <th v-for="h in headers" :key="h.id" class="border-r border-[#dde1e8] px-3 py-2 text-[11px] font-semibold">
              {{ h.label }}
            </th>
            <th class="px-3 py-2 text-center text-[11px] font-semibold">Aksi</th>
          </tr>
        </thead>

        <tbody class="bg-[#f3f3f4] text-[#333]">
          <tr v-for="(row, index) in rows" :key="row.id" class="border-t border-[#dde1e8]">
            <td class="px-3 py-2 text-[11px] text-center">{{ showingFrom + index }}</td>
            <td v-for="h in headers" :key="h.id" class="border-r border-[#dde1e8] px-3 py-2 text-[11px]">
              {{ getKolomValue(row, h.key) }}
            </td>
            <td class="px-3 py-2 text-center">
              <button
                type="button"
                class="cursor-pointer rounded-[8px] border border-[#ef1f1f] px-2.5 py-1 text-[10px] font-semibold text-[#e60000] transition hover:bg-[#fff0f0] sm:text-[11px]"
                @click="openIndicatorModal(row)">
                {{ fm1Store.isEvaluator ? $t('periodeModul.evaluasi') : $t('periodeModul.lihatHasilEvaluasi') }}
              </button>
            </td>
          </tr>

          <tr v-if="!rows.length">
            <td :colspan="headers.length + 2" class="px-4 py-7 text-center text-[13px] text-[#8490a3]">
              {{ $t('util.tidakAdaData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-end border-t border-[#dfe3ea] pt-4">
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-[8px] sm:rounded-[10px] border border-[#d5d9e0] text-[#9aa3b2] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          v-if="currentPage > 2"
          type="button" 
          class="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-[8px] sm:rounded-[10px] border border-[#d5d9e0] text-[12px] sm:text-[13px] font-semibold text-[#445064] transition hover:bg-white"
          @click="goToPage(1)">
          1
        </button>

        <span v-if="currentPage > 3" class="px-1 text-[13px] text-[#9aa3b2]">...</span>

        <button 
          v-for="page in getPageNumbers" 
          :key="page"
          type="button" 
          class="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-[8px] sm:rounded-[10px] border text-[12px] sm:text-[13px] font-semibold transition"
          :class="page === currentPage ? 'border-[#e60000] bg-[#e60000] text-white' : 'border-[#d5d9e0] text-[#445064] hover:bg-white'"
          @click="goToPage(page)">
          {{ page }}
        </button>

        <span v-if="currentPage < totalPages - 2" class="px-1 text-[13px] text-[#9aa3b2]">...</span>

        <button 
          v-if="currentPage < totalPages - 1"
          type="button" 
          class="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-[8px] sm:rounded-[10px] border border-[#d5d9e0] text-[12px] sm:text-[13px] font-semibold text-[#445064] transition hover:bg-white"
          @click="goToPage(totalPages)">
          {{ totalPages }}
        </button>

        <button
          type="button"
          class="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-[8px] sm:rounded-[10px] border border-[#d5d9e0] text-[#9aa3b2] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <FM1OpenIndikator v-model:is-open="isIndicatorModalOpen" v-model:selected-row="selectedObject" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { useFm1Store } from '#stores/fm1'
import { useI18n } from 'vue-i18n'
import FM1OpenIndikator from '#features/periode-modul/components/fm1/FM1OpenIndikator.vue';

// Custom debounce function to avoid external dependencies
function debounce(fn: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const route = useRoute()
const fm1Store = useFm1Store()
const { locale } = useI18n()

const uId = route.params.unit_id as string
const objekId = computed(() => fm1Store.detailAspek?.objek?.id)

const search = ref(fm1Store.tableSearch)
const isAllEvaluated = ref<'' | 'true' | 'false'>(fm1Store.tableIsAllEvaluated)

const headers = computed(() => fm1Store.objekTable?.header || [])
const rows = computed(() => fm1Store.objekTable?.data || [])

const currentPage = computed(() => fm1Store.objekTable?.meta?.page || 1)
const totalPages = computed(() => fm1Store.objekTable?.meta?.total_pages || 1)
const totalRows = computed(() => fm1Store.objekTable?.meta?.total || 0)
const rowsPerPage = computed(() => fm1Store.objekTable?.meta?.size || 10)

const showingFrom = computed(() => totalRows.value ? (currentPage.value - 1) * rowsPerPage.value + 1 : 0)

const getPageNumbers = computed(() => {
  const pages: number[] = []
  const maxVisiblePages = 3
  
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  if (end - start < maxVisiblePages - 1) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const currentLocale = locale.value === 'id' ? 'id-ID' : locale.value === 'en' ? 'en-US' : locale.value === 'ar' ? 'ar-SA' : 'ja-JP';
  
  return d.toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const getKolomValue = (row: any, key: string) => {
  const val = row.value_koloms?.find((v: any) => v.key === key)?.value
  if (val === undefined || val === null) return '-'
  
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
    return formatDateTime(val);
  }
  return val;
}

// STATE UNTUK MODAL
const isIndicatorModalOpen = ref(false)
const selectedObject = ref<any>(null)

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || !objekId.value) return
  fm1Store.fetchObjekTable(uId, objekId.value, page)
}

const onFilterChange = () => {
  if (!objekId.value) return
  fm1Store.tableIsAllEvaluated = isAllEvaluated.value
  fm1Store.fetchObjekTable(uId, objekId.value, 1)
}

const onSearchInput = debounce(() => {
  if (!objekId.value) return
  fm1Store.tableSearch = search.value
  fm1Store.fetchObjekTable(uId, objekId.value, 1)
}, 500)

watch(search, onSearchInput)

const openIndicatorModal = (row: any) => {
  selectedObject.value = row
  isIndicatorModalOpen.value = true
}
</script>
