<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import Fm5CreateModal from '#features/periode-modul/components/fm5/Fm5CreateModal.vue'
import { useFm5Repository } from '#features/periode-modul/composables/useFm5Repository'
import type { Fm5DashboardRow, BeritaAcaraStatus, Pageable } from '#features/periode-modul/services/fm5.api'
import { useAuthStore } from '#stores/auth'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import { useFm5Store } from '#stores/fm5'

const route = useRoute()
const repository = useFm5Repository()
const auth = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()
const fm5Store = useFm5Store()


const loading = ref(true)
const dashboardData = ref<Fm5DashboardRow[]>([])
const paging = ref<Pageable>({ page: 1, size: 10, total: 0, total_pages: 1 })

const isCreateModalOpen = ref(false)

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 10
const searchDebounce = ref<any>(null)

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined, 'pm-2026-genap')
)

const unitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined, 'unit-tif')
)

const context = computed(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

// Tombol Buat Berita Acara hanya untuk role tertentu (misal gkmf)
const canCreate = computed(() => {
  return auth.activeRole?.kode?.toLowerCase() === 'gkmf'
})

function getStatusMeta(status: BeritaAcaraStatus) {
  switch (status) {
    case 'FINAL':
      return { label: 'Final', badgeClass: 'bg-[#9fe5b8] text-[#1a8f50]' }
    case 'DRAFT':
      return { label: 'Draft', badgeClass: 'bg-[#f0df80] text-[#a97709]' }
    case 'DISANGGAH':
      return { label: 'Sanggah', badgeClass: 'bg-[#f5a193] text-[#9c3f31]' }
    case 'MENUNGGU_TANDA_TANGAN':
      return { label: 'Proses', badgeClass: 'bg-[#f5a193] text-[#a94f42]' }
    default:
      return { label: status, badgeClass: 'bg-[#e2e8f0] text-[#475569]' }
  }
}

function formatDate(isoDate: string) {
  if (!isoDate) return '-'
  return new Date(isoDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

function buildDetailRoute(beritaAcaraId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm5/${encodeURIComponent(beritaAcaraId)}`
}

async function goToDetailPage(beritaAcaraId: string) {
  await navigateTo(buildDetailRoute(beritaAcaraId))
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
      dashboardData.value = res.data.rows
      paging.value = res.meta
    }
  } catch (error) {
    console.error("Gagal memuat dashboard FM5:", error)
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
    fm5Store.fetchInformasi(periodeModulId.value, unitId.value)
  }
}, { immediate: true })

const breadcrumbItems = computed(() => {
  const isAmi = fm5Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm5Store.informasi?.periode_modul?.modul?.nama || 'Berita Acara'
  
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

    <section class="fm5-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
      <section
      class="rounded-[16px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-5 py-5 shadow-[0_5px_14px_rgba(15,23,42,0.18)] md:px-6 md:py-6"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <h1 class="text-[clamp(1.55rem,2.05vw,2.45rem)] font-semibold leading-tight text-white">
            {{ t('fm5.title', 'Form 05 Berita Acara') }}
          </h1>
          <p class="mt-3 max-w-[1300px] text-[clamp(0.95rem,1.02vw,1.25rem)] leading-relaxed text-white/95">
            {{ t('fm5.description', 'Berita Acara {modul} digunakan sebagai bukti pelaksanaan monev dan pengesahan hasil evaluasi.', { modul: fm5Store.informasi?.periode_modul?.modul?.nama || 'Monitoring dan Evaluasi Awal Pembelajaran' }) }}
          </p>
        </div>

        <button
          v-if="canCreate"
          type="button"
          class="inline-flex h-[50px] min-w-[190px] items-center justify-center rounded-[18px] bg-white px-5 text-[clamp(1rem,1.08vw,1.25rem)] font-semibold text-[#121620] transition hover:bg-[#f5f5f5]"
          @click="isCreateModalOpen = true"
        >
          {{ t('fm5.createButton', 'Buat Berita Baru') }}
        </button>
      </div>
    </section>

    <!-- Hapus indicator dummy sementara sampai ada endpoint agregasi backend -->

    <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
      <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
          {{ t('fm5.listTitle', 'Daftar Berita Acara') }}
      </h2>

        <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label class="relative block w-full lg:max-w-[520px]">
            <input
              v-model="searchKeyword"
              type="search"
              :placeholder="t('fm5.searchPlaceholder', 'Cari berita acara...')"
              class="h-[48px] w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#2e3746] outline-none placeholder:text-[#9aa3b3]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>
        </div>

        <div class="mt-5 overflow-x-auto rounded-[20px] border border-[#dce1e8] bg-white relative min-h-[300px]">
          <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-[20px]">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-[#e30000] border-t-transparent"></div>
          </div>

          <table class="w-full min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-[50px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-left text-[0.85rem] font-semibold text-[#2f3744] md:px-3">{{ t('fm5.table.no', 'No') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-left text-[0.85rem] font-semibold text-[#2f3744] md:px-3">{{ t('fm5.table.studyProgram', 'Program Studi') }}</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-left text-[0.85rem] font-semibold text-[#2f3744] md:px-3 whitespace-nowrap">{{ t('fm5.table.documentNumber', 'Nomor Berita Acara') }}</th>
                <th class="w-[120px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-left text-[0.85rem] font-semibold text-[#2f3744] md:px-3">{{ t('fm5.table.startDate', 'Tanggal Mulai') }}</th>
                <th class="w-[100px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-center text-[0.85rem] font-semibold text-[#2f3744] md:px-3">{{ t('fm5.table.status', 'Status') }}</th>
                <th class="w-[100px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-2 py-3 text-center text-[0.85rem] font-semibold text-[#2f3744] md:px-3">{{ t('fm5.table.action', 'Aksi') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, index) in dashboardData" :key="row.id">
                <td class="border-b border-[#e8edf3] px-2 py-3 text-[0.9rem] text-[#2f3744] md:px-3 md:py-3">
                  {{ (paging.page - 1) * paging.size + index + 1 }}
                </td>
                <td class="border-b border-[#e8edf3] px-2 py-3 text-[0.92rem] font-semibold text-[#3b3f46] md:px-3 md:py-3">
                  {{ row.programStudi }}
                </td>
                <td class="border-b border-[#e8edf3] px-2 py-3 text-[0.85rem] text-[#3f4551] break-all max-w-[250px] md:px-3 md:py-3">
                  {{ row.nomorBeritaAcara }}
                </td>
                <td class="border-b border-[#e8edf3] px-2 py-3 text-[0.88rem] text-[#3f4551] md:px-3 md:py-3 whitespace-nowrap">
                  {{ formatDate(row.tanggalMulai) }}
                </td>
                <td class="border-b border-[#e8edf3] px-2 py-3 text-center md:px-3 md:py-3">
                  <span
                    class="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[0.8rem] font-medium"
                    :class="getStatusMeta(row.status).badgeClass"
                  >
                    {{ getStatusMeta(row.status).label }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-2 py-3 text-center md:px-3 md:py-3">
                  <button
                    type="button"
                    class="inline-flex rounded-[12px] border border-[#ef2f2f] px-4 py-1.5 text-[0.9rem] font-semibold text-[#e20000] transition hover:bg-[#fff1f1] md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
                    @click="goToDetailPage(row.id)"
                  >
                    {{ t('fm5.table.viewDetail', 'Lihat Detail') }}
                  </button>
                </td>
              </tr>

              <tr v-if="dashboardData.length === 0 && !loading">
                <td colspan="6" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  {{ t('fm5.table.empty', 'Data berita acara tidak ditemukan.') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[0.92rem] text-[#5d6778] md:text-[1rem]">
            {{ t('fm5.pagination.showing', 'Menampilkan') }} <strong>{{ dashboardData.length > 0 ? (paging.page - 1) * paging.size + 1 : 0 }}-{{ Math.min(paging.page * paging.size, paging.total) }}</strong> {{ t('fm5.pagination.from', 'dari') }} <strong>{{ paging.total }}</strong> {{ t('fm5.pagination.data', 'data') }}
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
              :disabled="paging.page === 1"
              @click="currentPage = Math.max(1, paging.page - 1)"
            >
              {{ t('fm5.pagination.previous', 'Previous') }}
            </button>

            <button
              type="button"
              class="rounded-[12px] bg-[#e30000] px-4 py-1.5 text-[0.9rem] font-semibold text-white md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
            >
              {{ paging.page }}
            </button>

            <button
              type="button"
              class="rounded-[12px] border border-[#d8dde5] px-4 py-1.5 text-[0.9rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[14px] md:px-6 md:py-2 md:text-[0.95rem]"
              :disabled="paging.page >= paging.total_pages"
              @click="currentPage = Math.min(paging.total_pages, paging.page + 1)"
            >
              {{ t('fm5.pagination.next', 'Next') }}
            </button>
          </div>
        </div>
        </section>
    </section>

    <!-- Modals -->
    <Fm5CreateModal
      v-model:is-open="isCreateModalOpen"
      :periode-modul-id="periodeModulId"
      :unit-id="unitId"
      @created="goToDetailPage"
    />
  </div>
</template>
