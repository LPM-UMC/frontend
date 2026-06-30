<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFm6Repository, type Fm6Context } from '../../composables/useFm6Repository'
import type { Fm6DashboardResponse, Fm6DashboardRow } from '../../services/fm6.api'
import { useAuthStore } from '#stores/auth'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import { useFm6Store } from '#stores/fm6'

const route = useRoute()
const router = useRouter()
const repository = useFm6Repository()
const authStore = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()
const fm6Store = useFm6Store()

const loading = ref(true)
const dashboardData = ref<Fm6DashboardResponse | null>(null)
const searchKeyword = ref('')
const searchDebounce = ref<ReturnType<typeof setTimeout> | null>(null)
const currentPage = ref(1)
const pageSize = 10

onMounted(() => {
  console.log('=============================')
  console.log('CURRENT ROUTE NAME IS:', route.name)
  console.log('CURRENT ROUTE PATH IS:', route.path)
  console.log('=============================')
})

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)

const context = computed<Fm6Context>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const paging = computed(() => dashboardData.value?.meta ?? { total: 0, page: 1, size: pageSize, total_pages: 1 })

const canCreateSurvey = computed(() => {
  const role = authStore.activeRole?.kode
  return role === 'admin-lpm' || role === 'lpm' || role === 'ketua-lpm'
})

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    AKTIF: 'Aktif',
    SELESAI: 'Selesai',
  }
  return map[status] || status
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'bg-gray-200 text-gray-700',
    AKTIF: 'bg-green-100 text-green-700',
    SELESAI: 'bg-blue-100 text-blue-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(isoDate: string) {
  if (!isoDate) return '-'
  return new Date(isoDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

function buildCreateRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/create`
}

function buildDetailRoute(detailId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/detail/${encodeURIComponent(detailId)}`
}

async function goToCreatePage() {
  await router.push(buildCreateRoute())
}

async function goToDetail(surveyId: string) {
  await router.push(buildDetailRoute(surveyId))
}

async function fetchDashboard() {
  loading.value = true
  try {
    const res = await repository.getDashboardData(context.value, {
      page: currentPage.value,
      size: pageSize,
      search: searchKeyword.value || undefined,
    })
    
    if (res) {
      dashboardData.value = res
    }
  } catch (error) {
    console.error("Gagal memuat dashboard FM6:", error)
  } finally {
    loading.value = false
  }
}

watch([searchKeyword], () => {
  if (searchDebounce.value) clearTimeout(searchDebounce.value)
  searchDebounce.value = setTimeout(() => {
    currentPage.value = 1
    fetchDashboard()
  }, 500)
})

watch(currentPage, () => {
  fetchDashboard()
})

watch(context, () => {
  currentPage.value = 1
  fetchDashboard()
  if (periodeModulId.value && unitId.value) {
    fm6Store.fetchInformasi(periodeModulId.value, unitId.value)
  }
}, { immediate: true })

const breadcrumbItems = computed(() => {
  const isAmi = fm6Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm6Store.informasi?.periode_modul?.modul?.nama || 'Form Survei'
  
  return [
    {
      label: t('navigasi.dasbor', 'Dasbor'),
      to: '/dashboard',
    },
    {
      label: isAmi ? t('ami.judul', 'AMI') : t('monev.judul', 'Monitoring dan Evaluasi'),
      to: isAmi ? '/dashboard/ami' : '/dashboard/monev',
    },
    {
      label: namaModul,
      active: true,
    },
  ]
})

</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header with Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-5 px-4 md:px-5 xl:px-6 pt-4">
      <NuxtLink :to="localePath(`/dashboard`)">
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
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
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

    <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
      <!-- Hero Section -->
      <section
        class="rounded-[16px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-5 py-5 shadow-[0_5px_14px_rgba(15,23,42,0.18)] md:px-6 md:py-6"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h1 class="text-[clamp(1.55rem,2.05vw,2.45rem)] font-semibold leading-tight text-white">
              {{ t('fm6.title', 'Form 06 Survei') }}
            </h1>
            <p class="mt-3 max-w-[1300px] text-[clamp(0.95rem,1.02vw,1.25rem)] leading-relaxed text-white/95">
              {{ t('fm6.description', 'Mengelola survei untuk responden mahasiswa, dosen, atau tenaga kependidikan.') }}
            </p>
          </div>

          <button
            v-if="canCreateSurvey"
            type="button"
            class="inline-flex h-[50px] min-w-[190px] items-center justify-center rounded-[18px] bg-white px-5 text-[clamp(1rem,1.08vw,1.25rem)] font-semibold text-[#121620] transition hover:bg-[#f5f5f5]"
            @click="goToCreatePage"
          >
            {{ t('fm6.createButton', 'Buat Survei Baru') }}
          </button>
        </div>
      </section>

      <!-- Indicator Cards -->
      <section v-if="dashboardData" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
          Statistik Survei
        </h2>

        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in dashboardData.data.indicators"
            :key="item.id"
            class="rounded-[16px] bg-[#f4f4f5] px-4 py-4"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-[clamp(1rem,1.08vw,1.3rem)] font-semibold text-[#484b51]">
                {{ item.title }}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-[#70727a] md:h-6 md:w-6">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>

            <p class="mt-3 text-[clamp(1.9rem,2.25vw,2.65rem)] font-semibold leading-none text-[#080b11]">
              {{ item.value }}
            </p>

            <div class="mt-3 h-[12px] w-[220px] max-w-full overflow-hidden rounded-full bg-[#dce2e8] md:h-[14px]">
              <span class="block h-full rounded-full bg-[#42cd72]" :style="{ width: `${item.progressPercent}%` }" />
            </div>
          </article>
        </div>
      </section>

      <!-- Table Section -->
      <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <h2 class="text-[clamp(1.35rem,1.6vw,1.8rem)] font-semibold text-[#181d28]">
            {{ t('fm6.listTitle', 'Daftar Survei') }}
          </h2>
          <div class="relative w-full md:max-w-[320px]">
            <input
              v-model="searchKeyword"
              type="text"
              :placeholder="t('fm6.searchPlaceholder', 'Cari survei...')"
              class="h-[44px] w-full rounded-[14px] border border-[#d2d7e0] bg-[#f8f9fa] pl-4 pr-11 text-[0.95rem] text-[#343e50] outline-none transition focus:border-[#e30000] focus:ring-1 focus:ring-[#e30000]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </div>
        </div>

        <!-- Data Table -->
        <div class="mt-5 overflow-x-auto rounded-[20px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[900px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">{{ t('fm6.table.programStudi', 'Program Studi') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">{{ t('fm6.table.surveyName', 'Nama Survei') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-left text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">{{ t('fm6.table.date', 'Tanggal Dibuat') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-center text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">{{ t('fm6.table.status', 'Status') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-3 py-3 text-center text-[0.88rem] font-semibold text-[#2f3744] md:px-4 md:text-[0.94rem]">{{ t('fm6.table.action', 'Aksi') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in dashboardData?.data.rows" :key="row.id">
                <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.92rem] text-[#3f4551] md:px-4 md:py-4 md:text-[1rem]">
                  {{ row.programStudi }}
                </td>
                <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.98rem] font-semibold text-[#3b3f46] md:px-4 md:py-4 md:text-[1.08rem]">
                  {{ row.judul }}
                </td>
                <td class="border-b border-[#e8edf3] px-3 py-3 text-[0.92rem] text-[#3f4551] md:px-4 md:py-4 md:text-[1rem]">
                  {{ formatDate(row.createdAt) }}
                </td>
                <td class="border-b border-[#e8edf3] px-3 py-3 text-center md:px-4 md:py-4">
                  <span :class="getStatusColor(row.status)" class="inline-block rounded-full px-3 py-1 text-[0.85rem] font-semibold">
                    {{ getStatusLabel(row.status) }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-3 py-3 text-center md:px-4 md:py-4">
                  <button
                    type="button"
                    class="inline-flex rounded-[12px] border border-[#ef2f2f] px-4 py-1.5 text-[0.9rem] font-semibold text-[#e20000] transition hover:bg-[#fff1f1] md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
                    @click="goToDetail(row.id)"
                  >
                    {{ t('fm6.table.viewDetail', 'Lihat Detail') }}
                  </button>
                </td>
              </tr>

              <tr v-if="!dashboardData?.data.rows.length && !loading">
                <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  {{ t('fm6.table.empty', 'Data survei tidak ditemukan.') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[0.92rem] text-[#5d6778] md:text-[1rem]">
            {{ t('fm6.pagination.showing', 'Menampilkan') }} <strong>{{ paging.page }}</strong> {{ t('fm6.pagination.from', 'dari') }} <strong>{{ paging.total_pages }}</strong> {{ t('fm6.pagination.pages', 'halaman') }} ({{ paging.total }} {{ t('fm6.pagination.data', 'data') }})
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              {{ t('fm6.pagination.previous', 'Previous') }}
            </button>

            <button
              type="button"
              class="rounded-[12px] bg-[#e30000] px-4 py-1.5 text-[0.9rem] font-semibold text-white md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
            >
              {{ currentPage }}
            </button>

            <button
              type="button"
              class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
              :disabled="currentPage >= paging.total_pages"
              @click="currentPage = Math.min(paging.total_pages, currentPage + 1)"
            >
              {{ t('fm6.pagination.next', 'Next') }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        {{ t('fm6.table.loading', 'Memuat data survei...') }}
      </section>
    </section>
  </div>
</template>
