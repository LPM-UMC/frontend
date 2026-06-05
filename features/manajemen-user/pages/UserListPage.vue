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
            {{ $t('manajemenUser.judul') }}
          </h1>

          <p class="mt-2 max-w-280 text-sm sm:text-[0.95rem] leading-relaxed text-[#556173]">
            {{ $t('manajemenUser.deskripsi') }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex gap-2">
            <button
              :disabled="exporting"
              @click="handleExportPdf"
              class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-white border border-[#dce1e8] px-4 text-sm sm:text-[0.95rem] font-semibold text-[#44474d] shadow-[0_2px_4px_rgba(15,23,42,0.04)] transition hover:bg-[#f8f8f8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button
              :disabled="exporting"
              @click="handleExportCsv"
              class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-white border border-[#dce1e8] px-4 text-sm sm:text-[0.95rem] font-semibold text-[#44474d] shadow-[0_2px_4px_rgba(15,23,42,0.04)] transition hover:bg-[#f8f8f8] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
          </div>
          
          <NuxtLink :to="localePath('/dashboard/manajemen-user/create')">
            <button
              class="inline-flex h-10 sm:h-11 min-w-32 items-center justify-center rounded-xl bg-[#e30000] px-5 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000] cursor-pointer">
              {{ $t('manajemenUser.create.tombol') }}
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
            {{ $t('manajemenUser.card.totalUser') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(userMeta.total) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ $t('manajemenUser.card.totalUserAktif') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(userMeta.total) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ $t('manajemenUser.card.totalRole') }}
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-end"
            :class="isRTL ? 'text-left' : 'text-right'">
            {{ formatNumber(roleMeta.total) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d]">
            {{ $t('manajemenUser.card.totalRoleTerbanyak') }}
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
        {{ $t('manajemenUser.daftarUser') }}
      </h2>

      <!-- Filter -->
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input v-model="searchQuery" type="search" :placeholder="$t('manajemenUser.placeholder.cari')"
          class="h-10 w-full lg:w-72 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm outline-none">

        <div class="flex flex-col gap-2 sm:flex-row">
          <select v-model="sortOrder"
            class="h-10 min-w-24 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm cursor-pointer">
            <option value="asc" class="cursor-pointer">A-Z</option>
            <option value="desc" class="cursor-pointer">Z-A</option>
          </select>

          <select v-model="roleFilter"
            class="h-10 min-w-32 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm cursor-pointer">
            <option value="" class="cursor-pointer">
              {{ $t('manajemenUser.role') }}
            </option>
            <option v-for="role in roleOptions" :key="role.id" :value="role.id" class="cursor-pointer">
              {{ role.nama }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="userLoading" class="mt-6 flex justify-center py-8">
        <p class="text-sm text-[#6b7280]">Memuat data...</p>
      </div>

      <!-- Table -->
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-[#dce1e8] bg-white">
        <table class="w-full min-w-220 text-sm">
          <thead>
            <tr class="bg-[#f1f3f6] text-[#2f3744]">
              <th class="px-3 py-3 text-left">{{ $t('manajemenUser.model.no') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenUser.model.nama') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenUser.model.email') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenUser.model.role') }}</th>
              <th class="px-3 py-3 text-left">{{ $t('manajemenUser.model.tanggalBergabung') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in userRows" :key="row.id">
              <td class="px-3 py-3">
                {{ formatNumber(showingFrom + index) }}
              </td>

              <td class="px-3 py-3 font-semibold">
                <NuxtLink :to="localePath(`/dashboard/manajemen-user/${encodeURIComponent(row.id)}/edit`)"
                  class="text-red-600 underline hover:text-red-800 transition">
                  {{ row.nama }}
                </NuxtLink>
              </td>

              <td class="px-3 py-3">
                {{ row.email }}
              </td>

              <td class="px-3 py-3">
                {{ row.roles?.map(r => r.nama).join(', ') || '-' }}
              </td>

              <td class="px-3 py-3">
                {{ formatDate(row.created_at) }}
              </td>
            </tr>

            <tr v-if="userRows.length === 0">
              <td colspan="5" class="px-3 py-8 text-center text-sm text-[#7a8392]">
                Data user tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <div class="flex items-center gap-1.5 text-sm">
          <!-- Previous -->
          <button
            :disabled="currentPage === 1"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d8dde4] bg-[#f8f8f8] text-[#556173] transition hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            @click="goToPage(currentPage - 1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page Numbers -->
          <button
            v-for="page in visiblePages"
            :key="page"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition cursor-pointer"
            :class="currentPage === page
              ? 'bg-[#e30000] text-white shadow-[0_4px_12px_rgba(227,0,0,0.3)]'
              : 'border border-[#d8dde4] bg-[#f8f8f8] text-[#556173] hover:bg-white'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <!-- Next -->
          <button
            :disabled="currentPage === totalPages"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d8dde4] bg-[#f8f8f8] text-[#556173] transition hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            @click="goToPage(currentPage + 1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { navigateTo, useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import { useUser } from '../composables/useUser'
import { useRole } from '#features/manajemen-role/composables/useRole'

const localePath = useLocalePath()
const { locale, t } = useI18n()

const isRTL = computed(() => locale.value === 'ar')
const toast = useToast()
const exporting = ref(false)

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
 * COMPOSABLES
 * ========================= */

const {
  rows: userRows,
  meta: userMeta,
  loading: userLoading,
  fetchUsers,
  exportUsersPdf,
  exportUsersCsv,
} = useUser()

const {
  rows: roleRows,
  meta: roleMeta,
  fetchRoles,
} = useRole()

/* =========================
 * STATE
 * ========================= */

const pageSize = 10

const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const roleFilter = ref('')
const currentPage = ref(1)

/* =========================
 * COMPUTED
 * ========================= */

const roleOptions = computed(() => roleRows.value)

const topRoleName = computed(() => {
  if (roleRows.value.length === 0) return '-'

  const sorted = [...roleRows.value]
    .filter(r => (r.jumlah_user ?? 0) > 0)
    .sort((a, b) => (b.jumlah_user ?? 0) - (a.jumlah_user ?? 0))

  return sorted[0]?.nama ?? '-'
})

const totalPages = computed(() =>
  Math.max(1, userMeta.value.total_pages),
)

/**
 * Sliding pagination: tampilkan maksimal 5 nomor halaman.
 * currentPage selalu berada di tengah jika memungkinkan.
 * Edge-case: tidak pernah < 1 dan tidak pernah > totalPages.
 */
const visiblePages = computed(() => {
  const maxVisible = 5
  const total = totalPages.value
  const current = currentPage.value

  // Jika total halaman <= maxVisible, tampilkan semua
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // Hitung start agar current berada di tengah
  let start = current - Math.floor(maxVisible / 2)

  // Clamp: jangan sampai start < 1
  if (start < 1) start = 1

  // Clamp: jangan sampai end > total
  let end = start + maxVisible - 1
  if (end > total) {
    end = total
    start = end - maxVisible + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showingFrom = computed(() => {
  if (userRows.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize + 1
})

/* =========================
 * FETCH
 * ========================= */

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

async function loadUsers() {
  await fetchUsers({
    page: currentPage.value,
    size: pageSize,
    search: searchQuery.value.trim() || undefined,
    order: sortOrder.value,
    roleId: roleFilter.value || undefined,
  })
}

async function loadRoles() {
  await fetchRoles({ size: 100 })
}

function goToPage(page: number) {
  currentPage.value = page
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadRoles()])
})

/* =========================
 * NAVIGATION
 * ========================= */

async function goToEditPage(id: string) {
  await navigateTo(
    `/dashboard/manajemen-user/${encodeURIComponent(id)}/edit`,
  )
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
      loadUsers()
    }, 400)
  },
)

watch(
  [sortOrder, roleFilter],
  () => {
    currentPage.value = 1
    loadUsers()
  },
)

watch(
  currentPage,
  () => {
    loadUsers()
  },
)

watch(
  locale,
  () => {
    loadUsers()
  }
)

/* =========================
 * BREADCRUMB
 * ========================= */

const breadcrumbItems = [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenUser.judul'),
    active: true,
  },
]

/* =========================
 * EXPORT
 * ========================= */

async function handleExportPdf() {
  exporting.value = true
  try {
    const blob = await exportUsersPdf()
    if (!blob) throw new Error('No data')
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    
    toast.add({
      title: t('util.berhasil', 'Berhasil'),
      description: 'Export PDF berhasil.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: t('util.gagal', 'Gagal'),
      description: 'Gagal mengekspor PDF.',
      color: 'error'
    })
  } finally {
    exporting.value = false
  }
}

async function handleExportCsv() {
  exporting.value = true
  try {
    const blob = await exportUsersCsv()
    if (!blob) throw new Error('No data')
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    
    toast.add({
      title: t('util.berhasil', 'Berhasil'),
      description: 'Export CSV berhasil.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: t('util.gagal', 'Gagal'),
      description: 'Gagal mengekspor CSV.',
      color: 'error'
    })
  } finally {
    exporting.value = false
  }
}
</script>
