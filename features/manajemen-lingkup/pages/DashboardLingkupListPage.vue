<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/manajemen-lingkup/composables/useLingkup'
import { sortDashboardLingkupRows, type DashboardLingkupSortOrder, type DashboardLingkupStatus } from '#features/manajemen-lingkup/data/dashboardLingkupDummy'

type DashboardLingkupStatusFilter = 'all' | 'active' | 'inactive'

const { locale, t } = useI18n()
const { rows: apiLingkupRows, fetchLingkup } = useLingkup()

const isRTL = computed(() => locale.value === 'ar')

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    locale.value === 'ar'
      ? 'ar-SA'
      : locale.value === 'ja'
        ? 'ja-JP'
        : locale.value === 'en'
          ? 'en-US'
          : 'id-ID'
  ).format(value)
}

const listPageSize = 5
const listSearchQuery = ref('')
const listSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const listStatusFilter = ref<DashboardLingkupStatusFilter>('all')
const listCurrentPage = ref(1)

const filteredListRows = computed(() => {
  const query = listSearchQuery.value.trim().toLowerCase()
  
  const mappedRows = apiLingkupRows.value.map(row => ({
    id: row.id,
    name: row.nama,
    description: row.deskripsi,
    status: 'Aktif' as DashboardLingkupStatus,
    integrasiLabel: '-',
    createdAt: row.created_at || '-',
  }))

  const sortedRows = sortDashboardLingkupRows(mappedRows, listSortOrder.value)

  return sortedRows.filter((row) => {
    const matchesQuery = query.length === 0
      || `${row.name} ${row.description} ${row.integrasiLabel}`.toLowerCase().includes(query)

    const matchesStatus = listStatusFilter.value === 'all'
      || (listStatusFilter.value === 'active' && row.status === 'Aktif')
      || (listStatusFilter.value === 'inactive' && row.status === 'Non Aktif')

    return matchesQuery && matchesStatus
  })
})

const listTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredListRows.value.length / listPageSize))
)

const paginatedListRows = computed(() => {
  const start = (listCurrentPage.value - 1) * listPageSize
  return filteredListRows.value.slice(start, start + listPageSize)
})

const listShowingFrom = computed(() => {
  if (!filteredListRows.value.length) return 0
  return (listCurrentPage.value - 1) * listPageSize + 1
})

const listShowingTo = computed(() => {
  return Math.min(listCurrentPage.value * listPageSize, filteredListRows.value.length)
})

function resolveStatusBadgeClass(status: DashboardLingkupStatus): string {
  if (status === 'Aktif') {
    return 'bg-[#9DE8A1] text-[#128b1f]'
  }
  return 'bg-[#DEE4EC] text-[#495363]'
}

watch([listSearchQuery, listSortOrder, listStatusFilter], () => {
  listCurrentPage.value = 1
})

watch(listTotalPages, (nextTotalPages) => {
  if (listCurrentPage.value > nextTotalPages) {
    listCurrentPage.value = nextTotalPages
  }
})

onMounted(() => {
  fetchLingkup()
})
</script>

<template>
  <div>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top" style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink to="/dashboard" class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white" aria-label="Kembali">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
          </svg>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          Home
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">Lingkup Evaluasi</span>
      </div>

      <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
              Lingkup Evaluasi
            </h1>
            <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
              Gunakan fitur ini untuk mendefinisikan scope objek evaluasi (mis. Program Studi/Fakultas/UKM) yang akan digunakan oleh modul saat pemetaan objek, penarikan data, dan pelaporan. Status integrasi (terhubung/tidak terhubung GS) akan memengaruhi sumber data dan ketersediaan objek pada proses evaluasi berikutnya.
            </p>
          </div>

          <NuxtLink
            to="/dashboard/manajemen-lingkup/create"
            class="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#e30000] px-7 text-[1.05rem] font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
          >
            Buat Lingkup
          </NuxtLink>
        </div>
      </section>

      <!-- Statistik -->
      <section class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
              Total Lingkup Evaluasi
            </p>
            <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end" :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(apiLingkupRows.length) }}
            </p>
          </article>
          <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
              Lingkup Evaluasi Aktif
            </p>
            <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end" :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(apiLingkupRows.length) }}
            </p>
          </article>
          <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
              Lingkup Terbanyak Digunakan
            </p>
            <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end" :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(0) }}
            </p>
          </article>
          <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
              Lingkup Terakhir Dibuat
            </p>
            <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end" :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(apiLingkupRows.length > 0 ? 1 : 0) }}
            </p>
          </article>
        </div>
      </section>

      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
            Daftar Lingkup Evaluasi
          </h2>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-[430px]">
            <input
              v-model="listSearchQuery"
              type="search"
              placeholder="Search"
              class="h-11 w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[170px]">
            <select
              v-model="listSortOrder"
              class="h-11 w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
            >
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-[170px]">
            <select
              v-model="listStatusFilter"
              class="h-11 w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non Aktif</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-5 overflow-x-auto rounded-[18px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Status</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Lingkup Evaluasi</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Dibuat Pada</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in paginatedListRows"
                :key="row.id"
                class="border-t border-[#e8edf3]"
              >
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ listShowingFrom + index }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <NuxtLink
                    :to="`/dashboard/manajemen-lingkup/${encodeURIComponent(row.id)}`"
                    class="block text-left text-[1rem] font-semibold text-[#3b3f46] transition hover:text-[#e1121b]"
                  >
                    {{ row.name }}
                  </NuxtLink>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <span
                    class="inline-flex min-w-[96px] items-center justify-center rounded-[14px] px-4 py-1.5 text-[0.9rem] font-medium"
                    :class="resolveStatusBadgeClass(row.status)"
                  >
                    {{ row.status }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.integrasiLabel }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.createdAt }}
                </td>
              </tr>

              <tr v-if="paginatedListRows.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data lingkup tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
            Menampilkan <strong>{{ listShowingFrom }}-{{ listShowingTo }}</strong> dari <strong>{{ filteredListRows.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="listCurrentPage === 1"
              @click="listCurrentPage = Math.max(1, listCurrentPage - 1)"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-[14px] bg-[#e1121b] px-5 py-2 text-[0.875rem] font-semibold text-white"
            >
              {{ listCurrentPage }}
            </button>

            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="listCurrentPage === listTotalPages"
              @click="listCurrentPage = Math.min(listTotalPages, listCurrentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
