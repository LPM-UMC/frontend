<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import { useLingkup } from '#features/lingkup/composables/useLingkup'
import { sortDashboardLingkupRows, type DashboardLingkupSortOrder, type DashboardLingkupStatus } from '#features/lingkup/data/dashboardLingkupDummy'

type DashboardLingkupStatusFilter = 'all' | 'active' | 'inactive'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { rows: apiLingkupRows, fetchLingkup } = useLingkup()

const isRTL = computed(() => locale.value === 'ar')

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: localePath('/dashboard'),
  },
  {
    label: t('manajemenLingkup.judul'),
    active: true,
  },
])

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
  <section class="mx-auto w-full max-w-360 px-3 pb-6 pt-4 sm:px-5 lg:px-8">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard')">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <!-- Hero -->
    <section class="mt-4 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-280 space-y-2 bg-[#f4f4f5]">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#11141b]">
            {{ t('manajemenLingkup.judul') }}
          </h1>
          <p class="mt-2 max-w-280 text-sm sm:text-[0.95rem] leading-relaxed text-[#556173]">
            {{ t('manajemenLingkup.deskripsi') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-lingkup/create')">
          <button class="inline-flex h-10 sm:h-11 min-w-40 items-center justify-center rounded-xl bg-[#e30000] px-5 py-3 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000] cursor-pointer">
            {{ t('manajemenLingkup.buatLingkup') }}
          </button>
        </NuxtLink>
      </div>
    </section>

    <!-- Statistik -->
    <section class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ t('manajemenLingkup.card.totalLingkup') }}
          </p>
          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end">
            {{ formatNumber(apiLingkupRows.length) }}
          </p>
        </article>
        <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ t('manajemenLingkup.card.lingkupAktif') }}
          </p>
          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end">
            {{ formatNumber(apiLingkupRows.length) }}
          </p>
        </article>
        <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ t('manajemenLingkup.card.lingkupTerbanyak') }}
          </p>
          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end">
            {{ formatNumber(0) }}
          </p>
        </article>
        <article class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ t('manajemenLingkup.card.lingkupTerakhir') }}
          </p>
          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end">
            {{ formatNumber(apiLingkupRows.length > 0 ? 1 : 0) }}
          </p>
        </article>
      </div>
    </section>

    <!-- Table -->
    <section class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h2 class="text-lg sm:text-xl font-semibold text-[#11141b]">
        {{ t('manajemenLingkup.daftarLingkup') }}
      </h2>

      <!-- Filter -->
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          v-model="listSearchQuery"
          type="search"
          :placeholder="t('manajemenLingkup.placeholder.cari')"
          class="h-10 w-full lg:w-72 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm outline-none"
        >

        <div class="flex flex-col gap-2 sm:flex-row">
          <select
            v-model="listSortOrder"
            class="h-10 min-w-24 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm cursor-pointer"
          >
            <option value="a-z">{{ t('manajemenLingkup.urutkan.az') }}</option>
            <option value="z-a">{{ t('manajemenLingkup.urutkan.za') }}</option>
          </select>

          <select
            v-model="listStatusFilter"
            class="h-10 min-w-32 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm cursor-pointer"
          >
            <option value="all">{{ t('manajemenLingkup.filter.semua') }}</option>
            <option value="active">{{ t('manajemenLingkup.filter.aktif') }}</option>
            <option value="inactive">{{ t('manajemenLingkup.filter.tidakAktif') }}</option>
          </select>
        </div>
      </div>

      <div class="mt-5 overflow-x-auto rounded-[10px] border border-[#dce1e8] bg-white">
        <table class="w-full min-w-220 text-sm">
          <thead>
            <tr class="bg-[#f1f3f6] text-[#2f3744]">
              <th class="px-4 py-3 text-left font-semibold">{{ t('manajemenLingkup.tabel.no') }}</th>
              <th class="px-4 py-3 text-left font-semibold">{{ t('manajemenLingkup.tabel.nama') }}</th>
              <th class="px-4 py-3 text-left font-semibold">{{ t('manajemenLingkup.tabel.status') }}</th>
              <th class="px-4 py-3 text-left font-semibold">{{ t('manajemenLingkup.tabel.lingkupEvaluasi') }}</th>
              <th class="px-4 py-3 text-left font-semibold">{{ t('manajemenLingkup.tabel.dibuatPada') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in paginatedListRows"
              :key="row.id"
              class="border-t border-[#e8edf3] hover:bg-gray-50 transition"
            >
              <td class="px-4 py-4 text-[14px] text-[#2f3744]">
                {{ listShowingFrom + index }}
              </td>
              <td class="px-4 py-4">
                <NuxtLink
                  :to="localePath(`/dashboard/manajemen-lingkup/${encodeURIComponent(row.id)}`)"
                  class="block text-left text-[14px] font-semibold text-[#E7000B] transition hover:text-[#B91C1C] hover:underline"
                >
                  {{ row.name }}
                </NuxtLink>
              </td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex min-w-[96px] items-center justify-center rounded-[14px] px-4 py-1.5 text-[14px] font-medium"
                  :class="resolveStatusBadgeClass(row.status)"
                >
                  {{ row.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-[14px] text-[#3f4551]">
                {{ row.integrasiLabel }}
              </td>
              <td class="px-4 py-4 text-[14px] text-[#3f4551]">
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
        <p class="text-[14px] text-[#5d6778]">
          {{ t('manajemenPeriode.list.pagination.info', { shownFrom: listShowingFrom, shownTo: listShowingTo, totalItems: filteredListRows.length }) }}
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="listCurrentPage === 1"
            @click="listCurrentPage = Math.max(1, listCurrentPage - 1)"
          >
            {{ t('util.paginasi.sebelumnya') }}
          </button>

          <button
            type="button"
            class="rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 py-2 text-[0.875rem] font-semibold text-white"
          >
            {{ listCurrentPage }}
          </button>

          <button
            type="button"
            class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="listCurrentPage === listTotalPages"
            @click="listCurrentPage = Math.min(listTotalPages, listCurrentPage + 1)"
          >
            {{ t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </section>
  </section>
</template>
