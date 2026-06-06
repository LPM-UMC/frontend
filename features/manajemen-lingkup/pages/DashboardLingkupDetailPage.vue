<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/manajemen-lingkup/composables/useLingkup'
import {
  sortDashboardLingkupObjekRows,
  sortDashboardLingkupScopeRows,
  getDashboardLingkupDummyDetail
} from '#features/manajemen-lingkup/data/dashboardLingkupDummy'

type DashboardLingkupSortOrder = 'a-z' | 'z-a'
type DashboardLingkupSection = 'informasi' | 'lingkup' | 'objek'

const route = useRoute()
const { t, locale } = useI18n()

const lingkupId = computed(() => {
  const id = route.params.lingkup_id
  return Array.isArray(id) ? id[0] : id
})

const { rows: lingkupRows, fetchLingkup } = useLingkup()

const isRTL = computed(() => locale.value.startsWith('ar'))
const pageLoading = ref(true)

const scopePageSize = 5
const objekPageSize = 4

const scopeSearchQuery = ref('')
const scopeSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const scopeCurrentPage = ref(1)

const objekSearchQuery = ref('')
const objekSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const objekCurrentPage = ref(1)

const detailSectionOpen = reactive({
  informasi: false,
  lingkup: false,
  objek: false,
})

// Current fallback to dummy detail while actual child endpoints are built
const detailBundle = computed(() =>
  getDashboardLingkupDummyDetail(lingkupId.value)
)

// The actual lingkup details from the API
const detailInfo = reactive({
  name: '',
  description: '',
  penanggungJawab: '-',
  evaluator: '-',
  totalUnit: 0,
  integrasiSistem: '-',
  createdAt: '-',
  updatedAt: '-'
})

function toggleDetailSection(section: DashboardLingkupSection) {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

const filteredScopeRows = computed(() => {
  const query = scopeSearchQuery.value.trim().toLowerCase()
  const sortedRows = sortDashboardLingkupScopeRows(
    detailBundle.value.scopeRows,
    scopeSortOrder.value
  )

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description} ${row.penanggungJawab} ${row.evaluator}`.toLowerCase().includes(query)
  )
})

const scopeTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredScopeRows.value.length / scopePageSize))
)

const paginatedScopeRows = computed(() => {
  const start = (scopeCurrentPage.value - 1) * scopePageSize
  return filteredScopeRows.value.slice(start, start + scopePageSize)
})

const scopeShowingFrom = computed(() => {
  if (!filteredScopeRows.value.length) return 0
  return (scopeCurrentPage.value - 1) * scopePageSize + 1
})

const scopeShowingTo = computed(() => {
  return Math.min(scopeCurrentPage.value * scopePageSize, filteredScopeRows.value.length)
})

const filteredObjekRows = computed(() => {
  const query = objekSearchQuery.value.trim().toLowerCase()
  const sortedRows = sortDashboardLingkupObjekRows(
    detailBundle.value.objekRows,
    objekSortOrder.value
  )

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description} ${row.integrasiSistem}`.toLowerCase().includes(query)
  )
})

const objekTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredObjekRows.value.length / objekPageSize))
)

const paginatedObjekRows = computed(() => {
  const start = (objekCurrentPage.value - 1) * objekPageSize
  return filteredObjekRows.value.slice(start, start + objekPageSize)
})

const objekShowingFrom = computed(() => {
  if (!filteredObjekRows.value.length) return 0
  return (objekCurrentPage.value - 1) * objekPageSize + 1
})

const objekShowingTo = computed(() => {
  return Math.min(objekCurrentPage.value * objekPageSize, filteredObjekRows.value.length)
})

watch([scopeSearchQuery, scopeSortOrder], () => {
  scopeCurrentPage.value = 1
})

watch(scopeTotalPages, (nextTotalPages) => {
  if (scopeCurrentPage.value > nextTotalPages) {
    scopeCurrentPage.value = nextTotalPages
  }
})

watch([objekSearchQuery, objekSortOrder], () => {
  objekCurrentPage.value = 1
})

watch(objekTotalPages, (nextTotalPages) => {
  if (objekCurrentPage.value > nextTotalPages) {
    objekCurrentPage.value = nextTotalPages
  }
})

async function loadDetail() {
  if (!lingkupId.value) return
  pageLoading.value = true
  try {
    await fetchLingkup()
    const detail = lingkupRows.value.find(r => r.id === lingkupId.value)
    if (detail) {
      detailInfo.name = detail.nama
      detailInfo.description = detail.deskripsi || ''
      detailInfo.createdAt = detail.created_at || '-'
      detailInfo.updatedAt = detail.updated_at || '-'
    }
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-slate-500">Memuat detail lingkup...</div>
  <div v-else>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top" style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink to="/dashboard/manajemen-lingkup" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>Lingkup Evaluasi</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">{{ detailInfo.name }}</span>
      </div>

      <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
              Lihat Lingkup Evaluasi
            </h1>
            <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
              Gunakan halaman ini untuk melihat detail lingkup evaluasi beserta unit dan objek yang terhubung. Anda dapat membuka informasi lingkup, meninjau daftar unit, serta daftar objek evaluasi untuk memudahkan pengelolaan data.
            </p>
          </div>
        </div>
      </section>

      <section class="mt-6 space-y-6">
        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('informasi')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Informasi Lingkup Evaluasi
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <dl class="space-y-5">
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Nama Lingkup</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.name }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.description }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Penanggung Jawab</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.penanggungJawab }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Evaluator</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.evaluator }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Unit</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.totalUnit }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Integrasi Sistem</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.integrasiSistem }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Dibuat</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.createdAt }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Diperbarui</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.updatedAt }}</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
              <NuxtLink
                :to="`/dashboard/manajemen-lingkup/${lingkupId}/edit`"
                class="inline-flex rounded-[18px] bg-[#e30000] px-7 py-2 text-[0.95rem] font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition hover:bg-[#ca0000]"
              >
                Edit
              </NuxtLink>
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
              >
                Hapus
              </button>
              <NuxtLink
                to="/dashboard/manajemen-lingkup/create"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
              >
                Tambah Lingkup Evaluasi
              </NuxtLink>
              <NuxtLink
                :to="`/dashboard/manajemen-lingkup/${lingkupId}/objek/objek-baru/create`"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
              >
                Tambah Objek Evaluasi
              </NuxtLink>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('lingkup')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Lingkup Evaluasi
              </h2>
              <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
                {{ filteredScopeRows.length }} data
              </span>
            </div>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.lingkup ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.lingkup" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="scopeSearchQuery"
                  type="search"
                  placeholder="Search"
                  class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </label>

              <label class="relative block w-full md:w-[170px]">
                <select
                  v-model="scopeSortOrder"
                  class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
                >
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[980px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Penanggung Jawab</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Evaluator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedScopeRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ scopeShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.description }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.penanggungJawab }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.evaluator }}
                    </td>
                  </tr>

                  <tr v-if="paginatedScopeRows.length === 0">
                    <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data lingkup evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ scopeShowingFrom }}-{{ scopeShowingTo }}</strong> dari <strong>{{ filteredScopeRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === 1"
                  @click="scopeCurrentPage = Math.max(1, scopeCurrentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ scopeCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === scopeTotalPages"
                  @click="scopeCurrentPage = Math.min(scopeTotalPages, scopeCurrentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('objek')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Objek Evaluasi
              </h2>
              <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
                {{ filteredObjekRows.length }} data
              </span>
            </div>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.objek ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.objek" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="objekSearchQuery"
                  type="search"
                  placeholder="Search"
                  class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </label>

              <label class="relative block w-full md:w-[170px]">
                <select
                  v-model="objekSortOrder"
                  class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
                >
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[860px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Integrasi Sistem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedObjekRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ objekShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.description }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.integrasiSistem }}
                    </td>
                  </tr>

                  <tr v-if="paginatedObjekRows.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data objek evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ objekShowingFrom }}-{{ objekShowingTo }}</strong> dari <strong>{{ filteredObjekRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === 1"
                  @click="objekCurrentPage = Math.max(1, objekCurrentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ objekCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === objekTotalPages"
                  @click="objekCurrentPage = Math.min(objekTotalPages, objekCurrentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </section>
  </div>
</template>
