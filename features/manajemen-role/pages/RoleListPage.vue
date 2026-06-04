<template>
  <section class="mx-auto w-full max-w-360 px-3 pb-6 pt-4 sm:px-5 lg:px-8">

    <!-- Breadcrumb -->
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard')">
        <button
          class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] hover:text-[#6e7788] transition hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <!-- Hero -->
    <section
      class="mt-4 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div :class="isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'"
        class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div :class="isRTL ? 'text-right' : 'text-left'" class="max-w-280 space-y-2 bg-[#f4f4f5]">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#11141b]">
            {{ $t('manajemenRole.judul') }}
          </h1>

          <p class="mt-2 max-w-280 text-sm sm:text-[0.95rem] leading-relaxed text-[#556173]">
            {{ $t('manajemenRole.deskripsi') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-role/create')">
          <button
            class="inline-flex h-10 sm:h-11 min-w-40 items-center justify-center rounded-xl bg-[#e30000] px-5 py-3 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000] cursor-pointer">
            {{ $t('manajemenRole.create.tombol') }}
          </button>
        </NuxtLink>
      </div>
    </section>

    <!-- Statistik -->
    <section
      class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalUser') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(3) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalUserAktif') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(3) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalRole') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(3) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalRoleTerbanyak') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(3) }}
          </p>
        </article>

      </div>
    </section>

    <!-- Table -->
    <section
      class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h2 class="text-lg sm:text-xl font-semibold text-[#11141b]" :class="isRTL ? 'text-right' : 'text-left'">
        {{ $t('manajemenRole.list') }}
      </h2>

      <!-- Filter -->
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input v-model="searchQuery" type="search" :placeholder="$t('manajemenRole.placeholder.cari')"
          class="h-10 w-full lg:w-72 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm outline-none">

        <div class="flex flex-col gap-2 sm:flex-row">
          <select v-model="sortOrder"
            class="h-10 min-w-24 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm cursor-pointer">
            <option value="a-z" class="cursor-pointer">A-Z</option>
            <option value="z-a" class="cursor-pointer">Z-A</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="mt-4 overflow-x-auto rounded-xl border border-[#dce1e8] bg-white">
        <table class="w-full min-w-220 text-sm">
          <thead>
            <tr class="bg-[#f1f3f6] text-[#2f3744]">
              <th class="px-3 py-3 text-left">{{ $t('manajemenRole.model.no') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenRole.model.nama') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenRole.model.deskripsi') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenRole.model.jumlahUser') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenRole.model.tanggalDibuat') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in paginatedRows" :key="row.id" class="" @click="goToEditPage(row.id)">
              <td class="px-3 py-3">
                {{ formatNumber(showingFrom + index) }}
              </td>

              <td class="px-3 py-3 font-semibold">
                <NuxtLink :to="localePath(
                  `/dashboard/manajemen-role/${encodeURIComponent(row.id)}/edit`
                )" class="text-red-600 underline hover:text-red-800">
                  {{ row.name }}
                </NuxtLink>
              </td>

              <td class="px-3 py-3 line-clamp-2">
                {{ row.description }}
              </td>

              <td class="px-3 py-3">
                {{ formatNumber(row.userCount) }}
              </td>

              <td class="px-3 py-3">
                {{ row.createdAt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <div class="flex gap-2 text-sm">
          <button :disabled="currentPage === 1"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage--">
            {{ $t('util.paginasi.sebelumnya') }}
          </button>

          <button class="rounded-xl bg-[#e30000] px-4 py-2 text-white">
            {{ currentPage }}
          </button>

          <button :disabled="currentPage === totalPages"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage++">
            {{ $t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, watch, } from 'vue'
import { navigateTo, useLocalePath, } from '#imports'

const localePath = useLocalePath()
const { locale, t } = useI18n()

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

/* =========================
 * TYPES
 * ========================= */

type DashboardRoleSortOrder =
  | 'a-z'
  | 'z-a'

interface DashboardRoleRow {
  id: string
  name: string
  description: string
  userCount: number
  createdAt: string
}

/* =========================
 * DUMMY DATA
 * ========================= */

const pageSize = 5

const rows = ref<
  DashboardRoleRow[]
>([
  {
    id: 'ROL001',
    name: 'Administrator',
    description:
      'Memiliki akses penuh terhadap seluruh fitur sistem.',
    userCount: 8,
    createdAt:
      '12 Jan 2026',
  },
  {
    id: 'ROL002',
    name: 'Auditor',
    description:
      'Melakukan audit dan verifikasi data evaluasi.',
    userCount: 15,
    createdAt:
      '15 Jan 2026',
  },
  {
    id: 'ROL003',
    name: 'Operator',
    description:
      'Mengelola data operasional dan administrasi.',
    userCount: 12,
    createdAt:
      '20 Jan 2026',
  },
  {
    id: 'ROL004',
    name: 'Reviewer',
    description:
      'Melakukan peninjauan dan validasi dokumen.',
    userCount: 6,
    createdAt:
      '25 Jan 2026',
  },
  {
    id: 'ROL005',
    name: 'Pimpinan',
    description:
      'Memantau laporan dan hasil evaluasi.',
    userCount: 3,
    createdAt:
      '01 Feb 2026',
  },
  {
    id: 'ROL006',
    name: 'Dosen',
    description:
      'Mengakses dan mengelola data akademik.',
    userCount: 85,
    createdAt:
      '05 Feb 2026',
  },
  {
    id: 'ROL007',
    name: 'Mahasiswa',
    description:
      'Mengakses layanan dan informasi akademik.',
    userCount: 1240,
    createdAt:
      '08 Feb 2026',
  },
])

/* =========================
 * STATE
 * ========================= */

const searchQuery =
  ref('')

const sortOrder =
  ref<DashboardRoleSortOrder>(
    'a-z',
  )

const currentPage =
  ref(1)

/* =========================
 * STATISTIC
 * ========================= */

/* =========================
 * HELPERS
 * ========================= */

function sortRows(
  data: DashboardRoleRow[],
  order: DashboardRoleSortOrder,
) {
  return [...data].sort(
    (a, b) => {
      const compare =
        a.name.localeCompare(
          b.name,
        )

      return order ===
        'a-z'
        ? compare
        : -compare
    },
  )
}

/* =========================
 * FILTER
 * ========================= */

const filteredRows =
  computed(() => {
    const query =
      searchQuery.value
        .trim()
        .toLowerCase()

    const sorted =
      sortRows(
        rows.value,
        sortOrder.value,
      )

    return sorted.filter(
      row => {
        const text = `
          ${row.name}
          ${row.description}
        `.toLowerCase()

        return (
          !query ||
          text.includes(
            query,
          )
        )
      },
    )
  })

/* =========================
 * PAGINATION
 * ========================= */

const totalPages =
  computed(() =>
    Math.max(
      1,
      Math.ceil(
        filteredRows.value
          .length /
        pageSize,
      ),
    ),
  )

const paginatedRows =
  computed(() => {
    const start =
      (
        currentPage.value -
        1
      ) * pageSize

    return filteredRows.value.slice(
      start,
      start +
      pageSize,
    )
  })

const showingFrom =
  computed(() => {
    if (
      !filteredRows.value
        .length
    ) {
      return 0
    }

    return (
      (
        currentPage.value -
        1
      ) *
      pageSize +
      1
    )
  })

/* =========================
 * NAVIGATION
 * ========================= */

async function goToEditPage(
  id: string,
) {
  await navigateTo(
    `/dashboard/manajemen-role/${encodeURIComponent(id)}/edit`,
  )
}

/* =========================
 * WATCHER
 * ========================= */

watch(
  [
    searchQuery,
    sortOrder,
  ],
  () => {
    currentPage.value = 1
  },
)

watch(
  totalPages,
  nextTotalPage => {
    if (
      currentPage.value >
      nextTotalPage
    ) {
      currentPage.value =
        nextTotalPage
    }
  },
)

/* =========================
 * BREADCRUMB
 * ========================= */

const breadcrumbItems =
  computed(() => [
    {
      label: t(
        'navigasi.dasbor',
      ),
      to: '/dashboard',
    },
    {
      label: t(
        'manajemenRole.judul',
      ),
      active: true,
    },
  ])
</script>
