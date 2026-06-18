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

        <div class="flex flex-wrap gap-2 lg:flex-nowrap">
          <button
            @click="exportData('pdf')"
            :disabled="isExporting"
            class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-[#dce1e8] bg-white px-4 py-2 text-sm sm:text-[0.95rem] font-semibold text-[#394150] shadow-[0_2px_6px_rgba(15,23,42,0.04)] transition hover:bg-[#f8f8f8] disabled:opacity-50 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4.5 w-4.5 text-[#e30000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          
          <button
            @click="exportData('csv')"
            :disabled="isExporting"
            class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-[#dce1e8] bg-white px-4 py-2 text-sm sm:text-[0.95rem] font-semibold text-[#394150] shadow-[0_2px_6px_rgba(15,23,42,0.04)] transition hover:bg-[#f8f8f8] disabled:opacity-50 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4.5 w-4.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>

          <NuxtLink :to="localePath('/dashboard/manajemen-role/create')">
            <button
              class="inline-flex h-10 sm:h-11 min-w-40 items-center justify-center rounded-xl bg-[#e30000] px-5 py-3 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000] cursor-pointer">
              {{ $t('manajemenRole.create.tombol') }}
            </button>
          </NuxtLink>
        </div>
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
            {{ formatNumber(totalUsersFromRoles) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalUserAktif') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(totalUsersFromRoles) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalRole') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(roleMeta.total) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]" :class="isRTL ? 'text-right' : 'text-left'">
            {{ $t('manajemenRole.card.totalRoleTerbanyak') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ topRoleName }}
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
            <option value="asc" class="cursor-pointer">A-Z</option>
            <option value="desc" class="cursor-pointer">Z-A</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="roleLoading" class="mt-6 flex justify-center py-8">
        <p class="text-sm text-[#6b7280]">Memuat data...</p>
      </div>

      <!-- Table -->
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-[#dce1e8] bg-white">
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
            <tr v-for="(row, index) in roleRows" :key="row.id">
              <td class="px-3 py-3">
                {{ formatNumber(showingFrom + index) }}
              </td>

              <td class="px-3 py-3 font-semibold">
                <NuxtLink :to="localePath(
                  `/dashboard/manajemen-role/${encodeURIComponent(row.id)}/edit`
                )" class="text-red-600 underline hover:text-red-800">
                  {{ row.nama }}
                </NuxtLink>
              </td>

              <td class="px-3 py-3 line-clamp-2">
                {{ row.deskripsi }}
              </td>

              <td class="px-3 py-3">
                {{ formatNumber(row.jumlah_user ?? 0) }}
              </td>

              <td class="px-3 py-3">
                {{ formatDate(row.created_at) }}
              </td>
            </tr>

            <tr v-if="roleRows.length === 0">
              <td colspan="5" class="px-3 py-8 text-center text-sm text-[#7a8392]">
                Data role tidak ditemukan.
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
            @click="goToPage(currentPage - 1)">
            {{ $t('util.paginasi.sebelumnya') }}
          </button>

          <button class="rounded-xl bg-[#e30000] px-4 py-2 text-white">
            {{ currentPage }}
          </button>

          <button :disabled="currentPage === totalPages"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="goToPage(currentPage + 1)">
            {{ $t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, watch, onMounted } from 'vue'
import { navigateTo, useLocalePath, useRuntimeConfig } from '#imports'
import { useAuthStore } from '#stores/auth'
import { useRole } from '../composables/useRole'

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

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'

  try {
    const date = new Date(dateStr)

    return date.toLocaleDateString(
      locale.value === 'ar' ? 'ar-SA'
        : locale.value === 'ja' ? 'ja-JP'
          : locale.value === 'en' ? 'en-US'
            : 'id-ID',
      { day: '2-digit', month: 'short', year: 'numeric' },
    )
  } catch {
    return dateStr
  }
}

/* =========================
 * COMPOSABLE
 * ========================= */

const {
  rows: roleRows,
  meta: roleMeta,
  loading: roleLoading,
  fetchRoles,
} = useRole()

/* =========================
 * STATE
 * ========================= */

const pageSize = 10
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

/* =========================
 * COMPUTED
 * ========================= */

const { rows: allRolesRows, fetchRoles: fetchAllRoles } = useRole()

const totalUsersFromRoles = computed(() => {
  const source = allRolesRows.value.length ? allRolesRows.value : roleRows.value
  return source.reduce(
    (sum, r) => sum + (r.jumlah_user ?? 0),
    0,
  )
})

const topRoleName = computed(() => {
  const source = allRolesRows.value.length ? allRolesRows.value : roleRows.value
  if (source.length === 0) return '-'

  const sorted = [...source]
    .filter(r => (r.jumlah_user ?? 0) > 0)
    .sort((a, b) => (b.jumlah_user ?? 0) - (a.jumlah_user ?? 0))

  return sorted[0]?.nama ?? '-'
})

const totalPages = computed(() =>
  Math.max(1, roleMeta.value.total_pages),
)

const showingFrom = computed(() => {
  if (roleRows.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize + 1
})

/* =========================
 * FETCH
 * ========================= */

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

async function loadRoles() {
  await fetchRoles({
    page: currentPage.value,
    size: pageSize,
    search: searchQuery.value.trim() || undefined,
    order: sortOrder.value,
  })
}

function goToPage(page: number) {
  currentPage.value = page
}

onMounted(async () => {
  await loadRoles()
  fetchAllRoles({ size: 1000 })
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
 * EXPORT
 * ========================= */

const isExporting = ref(false)

async function exportData(format: 'pdf' | 'csv') {
  if (isExporting.value) return
  isExporting.value = true
  try {
    const config = useRuntimeConfig()
    const baseURL = ((config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '')
    const auth = useAuthStore()
    const token = auth.accessToken

    const headers: Record<string, string> = {
      'Accept-Language': locale.value,
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await $fetch(`/api/roles/export/${format}`, {
      baseURL,
      headers,
      credentials: 'include',
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(response as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Roles_Export_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Export failed', err)
    const toast = useToast()
    toast.add({
      title: 'Gagal',
      description: 'Gagal mengunduh file. Terjadi kesalahan pada server.',
      color: 'error'
    })
  } finally {
    isExporting.value = false
  }
}

/* =========================
 * WATCHER
 * ========================= */

watch(
  searchQuery,
  () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)

    searchDebounceTimer = setTimeout(() => {
      currentPage.value = 1
      loadRoles()
    }, 400)
  },
)

watch(
  sortOrder,
  () => {
    currentPage.value = 1
    loadRoles()
  },
)

watch(
  currentPage,
  () => {
    loadRoles()
  },
)

watch(
  locale,
  () => {
    loadRoles()
  }
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
