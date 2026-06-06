<template>
  <div>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section
      class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink :to="localePath('/dashboard')" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>{{ $t('navigasi.dasbor') }}</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">{{ $t('manajemenModul.judul') }}</span>
      </div>

    <!-- Hero -->
    <section
      class="mt-4 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div
:class="isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'"
        class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div :class="isRTL ? 'text-right' : 'text-left'" class="max-w-280 space-y-2 bg-[#f4f4f5]">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#11141b]">
            {{ $t('manajemenModul.judul') }}
          </h1>

          <p class="mt-2 max-w-280 text-sm sm:text-[0.95rem] leading-relaxed text-[#556173]">
            {{ $t('manajemenModul.deskripsi') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-modul/create')">
          <button
            class="inline-flex h-10 sm:h-11 min-w-40 items-center justify-center rounded-xl bg-[#e1121b] px-5 py-3 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#cc0f17] cursor-pointer">
            {{ $t('manajemenModul.create.tombol') }}
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
            {{ $t('manajemenModul.card.totalModul') }}
          </p>

          <p
class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(3) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenModul.card.totalModulAktif') }}
          </p>

          <p
class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(1) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenModul.card.ModulTerbanyakDibuka') }}
          </p>

          <p
class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(1) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenModul.card.ModulTerakhirDibuka') }}
          </p>

          <p
class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(1) }}
          </p>
        </article>

      </div>
    </section>

    <!-- Table -->
    <section
      class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h2 class="text-lg sm:text-xl font-semibold text-[#11141b]" :class="isRTL ? 'text-right' : 'text-left'">
        {{ $t('manajemenModul.list') }}
      </h2>

      <!-- Filter -->
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
v-model="searchQuery" type="search" :placeholder="$t('manajemenModul.placeholder.cari')"
          class="h-10 w-full lg:w-72 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm outline-none">

        <div class="flex flex-col gap-2 sm:flex-row">
          <select
v-model="sortOrder"
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
              <th class="px-3 py-3 text-left">{{ $t('manajemenModul.model.no') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenModul.model.nama') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenModul.model.lingkup') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenModul.model.totalAspek') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="px-3 py-6 text-center text-gray-500">
                Loading...
              </td>
            </tr>
            <tr v-else-if="rows.length === 0">
              <td colspan="4" class="px-3 py-6 text-center text-gray-500">
                Data kosong
              </td>
            </tr>
            <tr v-else v-for="(row, index) in rows" :key="row.id" @click="goToEditPage(row.id)">
              <td class="px-3 py-3">
                {{ formatNumber(((currentPage - 1) * pageSize) + index + 1) }}
              </td>

              <td class="px-3 py-3 font-semibold">
                <NuxtLink
:to="localePath(`/dashboard/manajemen-modul/${encodeURIComponent(row.id)}`)"
                  class="text-red-600 underline hover:text-red-800 transition">
                  {{ row.nama }}
                </NuxtLink>
              </td>

              <td class="px-3 py-3">
                {{ row.lingkup_evaluasi?.nama }}
              </td>

              <td class="px-3 py-3">
                {{ row.total_aspek }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <div class="flex gap-2 text-sm">
          <button
:disabled="currentPage === 1"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage--">
            {{ $t('util.paginasi.sebelumnya') }}
          </button>

          <button class="rounded-xl bg-[#e1121b] px-4 py-2 text-white">
            {{ currentPage }}
          </button>

          <button
:disabled="currentPage === totalPages"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage++">
            {{ $t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { useModul } from '../composables/useModul'

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
 * STATE
 * ========================= */

const searchQuery = ref('')
const sortOrder = ref('a-z')

const currentPage = ref(1)
const pageSize = 10

const {
  rows,
  total,
  loading,
  fetchModul,
} = useModul()

onMounted(() => {
  loadData()
})

watch([currentPage, sortOrder], () => {
  loadData()
})

watch(searchQuery, useDebounceFn(() => {
  currentPage.value = 1
  loadData()
}, 500))

function loadData() {
  fetchModul({
    page: currentPage.value,
    size: pageSize,
    search: searchQuery.value,
    order: sortOrder.value === 'a-z' ? 'asc' : 'desc'
  })
}

function goToEditPage(id: string) {
  navigateTo(localePath(`/dashboard/manajemen-modul/${encodeURIComponent(id)}`))
}

/* =========================
 * PAGINATION
 * ========================= */

const totalPages =
  computed(() =>
    Math.max(
      1,
      Math.ceil(
        total.value /
        pageSize
      )
    )
  )

function resolveStatusClass(status: string) {
  return 'bg-gray-100 text-gray-700'
}

watch(
  totalPages,
  (
    nextTotalPage
  ) => {
    if (
      currentPage.value >
      nextTotalPage
    ) {
      currentPage.value =
        nextTotalPage
    }
  }
)

const breadcrumbItems = [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenModul.judul'),
    active: true,
  },
]
</script>
