<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useLocalePath, useToast, navigateTo } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/lingkup/composables/useLingkup'

import { useUnit } from '#features/lingkup/composables/useUnit'
import { useObjek } from '#features/lingkup/composables/useObjek'

type DashboardLingkupSortOrder = 'a-z' | 'z-a'
type DashboardLingkupSection = 'informasi' | 'lingkup' | 'objek'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const lingkupId = computed(() => {
  const id = route.params.lingkup_id
  return Array.isArray(id) ? id[0] : id
})

const { rows: lingkupRows, fetchLingkup, removeLingkup } = useLingkup()
const { rows: unitRows, fetchUnit } = useUnit(lingkupId.value)
const { rows: objekRows, fetchObjek } = useObjek({ lingkupId: lingkupId.value })

const toast = useToast()

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
  informasi: true,
  lingkup: false,
  objek: false,
})



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
  const sortedRows = [...unitRows.value].sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return scopeSortOrder.value === 'a-z' ? compared : compared * -1
  })

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description || ''}`.toLowerCase().includes(query)
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
  const sortedRows = [...objekRows.value].sort((left, right) => {
    const compared = left.name.localeCompare(right.name)
    return objekSortOrder.value === 'a-z' ? compared : compared * -1
  })

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description || ''}`.toLowerCase().includes(query)
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
    await Promise.all([
      fetchUnit(),
      fetchObjek()
    ])
    const detail = lingkupRows.value.find((r: any) => String(r.id) === String(lingkupId.value))
    if (detail) {
      detailInfo.name = detail.nama
      detailInfo.description = detail.deskripsi || ''
      detailInfo.penanggungJawab = detail.role_auditee?.nama || '-'
      detailInfo.evaluator = detail.role_evaluator?.nama || '-'
      detailInfo.createdAt = detail.created_at || '-'
      detailInfo.updatedAt = detail.updated_at || '-'
      detailInfo.totalUnit = unitRows.value.length
    }
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

async function handleDelete() {
  if (!confirm(t('manajemenLingkup.pesan.konfirmasiHapus', 'Apakah Anda yakin ingin menghapus lingkup ini?'))) return
  try {
    await removeLingkup(String(lingkupId.value))
    toast.add({
      title: 'Berhasil',
      description: 'Lingkup evaluasi berhasil dihapus.',
      color: 'green'
    })
    navigateTo(localePath('/dashboard/manajemen-lingkup'))
  } catch (e: any) {
    toast.add({
      title: 'Gagal',
      description: e.message || 'Gagal menghapus lingkup evaluasi.',
      color: 'red'
    })
  }
}

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: localePath('/dashboard'),
  },
  {
    label: t('manajemenLingkup.judul'),
    to: localePath('/dashboard/manajemen-lingkup'),
  },
  {
    label: detailInfo.name || 'Detail Lingkup',
    active: true,
  },
])
onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-slate-500">Memuat detail lingkup...</div>
  <div v-else>
    <section class="mx-auto w-full max-w-[1880px] bg-[#f7f7f7] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard/manajemen-lingkup')">
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

      <section class="mt-4 rounded-[10px] bg-white px-8 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-[24px] font-medium text-[#0A0A0A]">
              {{ t('manajemenLingkup.detail.judul') }}
            </h1>
            <p class="mt-2 text-sm sm:text-[16px] leading-relaxed text-[#4A5565] max-w-[1200px]">
              {{ t('manajemenLingkup.detail.deskripsi') }}
            </p>
          </div>
        </div>
      </section>

      <section class="mt-6 space-y-6">
        <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('informasi')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              {{ t('manajemenLingkup.detail.informasi') }}
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="grid gap-8 xl:grid-cols-2">
              <dl class="space-y-4">
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.namaLingkup') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.name }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.deskripsiLabel') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.description || '-' }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.penanggungJawab') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.penanggungJawab }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.evaluator') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.evaluator }}</dd>
                </div>
              </dl>
              <dl class="space-y-4">
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.totalUnit') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.totalUnit }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.integrasiSistem') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.integrasiSistem }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.tabel.dibuatPada') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.createdAt }}</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenLingkup.detail.tanggalDiperbarui') }}</dt>
                  <dd class="text-[1.1rem] text-[#2b3340]">{{ detailInfo.updatedAt }}</dd>
                </div>
              </dl>
            </div>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
              <NuxtLink
                :to="localePath(`/dashboard/manajemen-lingkup/${lingkupId}/edit`)"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(227,0,11,0.25)] transition hover:from-[#cc0f17] hover:to-[#a01818]"
              >
                {{ t('manajemenLingkup.detail.edit') }}
              </NuxtLink>
              <button
                type="button"
                @click="handleDelete"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#cfd5df] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#2b3340] transition hover:bg-[#e0e0e0]"
              >
                {{ t('manajemenLingkup.detail.hapus') }}
              </button>
              <NuxtLink
                :to="localePath(`/dashboard/manajemen-lingkup/${lingkupId}/unit/create`)"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#cfd5df] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#2b3340] transition hover:bg-[#e0e0e0]"
              >
                {{ t('manajemenLingkup.detail.tambahUnit') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(`/dashboard/manajemen-lingkup/${lingkupId}/objek/objek-baru/create`)"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#cfd5df] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#2b3340] transition hover:bg-[#e0e0e0]"
              >
                {{ t('manajemenLingkup.detail.tambahObjek') }}
              </NuxtLink>
            </div>
          </div>
        </article>

        <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('lingkup')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                {{ t('manajemenLingkup.detail.daftarUnit') }}
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
                  :placeholder="t('manajemenLingkup.placeholder.cari')"
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
                  <option value="a-z">{{ t('manajemenLingkup.urutkan.az') }}</option>
                  <option value="z-a">{{ t('manajemenLingkup.urutkan.za') }}</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[10px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[980px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.no') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.nama') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.deskripsi') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.penanggungJawab') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.evaluator') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedScopeRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3] hover:bg-gray-50 transition"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#2f3744]">
                      {{ scopeShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">
                      {{ row.description || '-' }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">
                      -
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">
                      -
                    </td>
                  </tr>

                  <tr v-if="paginatedScopeRows.length === 0">
                    <td colspan="5" class="px-4 py-8 text-center text-[14px] text-[#7a8392]">
                      {{ t('manajemenLingkup.detail.belumAdaData') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[14px] text-[#5d6778]">
                {{ t('manajemenPeriode.list.pagination.info', { shownFrom: scopeShowingFrom, shownTo: scopeShowingTo, totalItems: filteredScopeRows.length }) }}
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === 1"
                  @click="scopeCurrentPage = Math.max(1, scopeCurrentPage - 1)"
                >
                  {{ t('util.paginasi.sebelumnya') }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ scopeCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === scopeTotalPages"
                  @click="scopeCurrentPage = Math.min(scopeTotalPages, scopeCurrentPage + 1)"
                >
                  {{ t('util.paginasi.berikutnya') }}
                </button>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('objek')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                {{ t('manajemenLingkup.detail.daftarObjek') }}
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
                  :placeholder="t('manajemenLingkup.placeholder.cari')"
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
                  <option value="a-z">{{ t('manajemenLingkup.urutkan.az') }}</option>
                  <option value="z-a">{{ t('manajemenLingkup.urutkan.za') }}</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[10px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[860px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.no') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.nama') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.deskripsi') }}</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenLingkup.tabel.integrasiSistem') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedObjekRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3] hover:bg-gray-50 transition"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#2f3744]">
                      {{ objekShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">
                      {{ row.description || '-' }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">
                      -
                    </td>
                  </tr>

                  <tr v-if="paginatedObjekRows.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-[14px] text-[#7a8392]">
                      {{ t('manajemenLingkup.detail.belumAdaData') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[14px] text-[#5d6778]">
                {{ t('manajemenPeriode.list.pagination.info', { shownFrom: objekShowingFrom, shownTo: objekShowingTo, totalItems: filteredObjekRows.length }) }}
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === 1"
                  @click="objekCurrentPage = Math.max(1, objekCurrentPage - 1)"
                >
                  {{ t('util.paginasi.sebelumnya') }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ objekCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === objekTotalPages"
                  @click="objekCurrentPage = Math.min(objekTotalPages, objekCurrentPage + 1)"
                >
                  {{ t('util.paginasi.berikutnya') }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </section>
  </div>
</template>
