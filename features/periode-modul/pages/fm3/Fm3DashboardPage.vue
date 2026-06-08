<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { navigateTo, useRoute, useRuntimeConfig } from '#imports'
import { useFm3Store } from '#stores/fm3'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const fm3Store = useFm3Store()

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)

const searchKeyword = ref('')
const statusFilter = ref('all')
const sortOrder = ref<'asc'|'desc'>('desc')
const currentPage = ref(1)

const sortOptions = computed(() => [
  { label: 'Terbaru', value: 'desc' },
  { label: 'Terlama', value: 'asc' },
])

const statusOptions = computed(() => [
  { label: 'Semua Status', value: 'all' },
  { label: 'Belum Divalidasi (Draft)', value: 'draft' },
])

onMounted(() => {
  if (periodeModulId.value && unitId.value) {
    fm3Store.fetchInformasi(periodeModulId.value, unitId.value)
    fm3Store.checkIsAuditee(unitId.value)
    fm3Store.checkIsEvaluator(unitId.value)
    fetchTemuan()
  }
})

function fetchTemuan() {
  if (!unitId.value) return
  fm3Store.tableSearch = searchKeyword.value
  fm3Store.tableSortOrder = sortOrder.value as 'asc' | 'desc'
  const isDraftOnly = statusFilter.value === 'draft'
  fm3Store.fetchTemuan(unitId.value, currentPage.value, isDraftOnly)
}

let timeoutId: any = null;
watch(searchKeyword, () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    currentPage.value = 1
    fetchTemuan()
  }, 500);
});

watch([statusFilter, sortOrder], () => {
  currentPage.value = 1
  fetchTemuan()
})

watch(currentPage, () => {
  fetchTemuan()
})

const isReadOnlyMode = computed(() => {
  return !fm3Store.isAuditee && !fm3Store.isEvaluator
})

const totalPages = computed(() => fm3Store.temuanMeta.total_pages || 1)
const showingFrom = computed(() => {
  if (!fm3Store.temuanList.length) return 0
  return (currentPage.value - 1) * fm3Store.temuanMeta.size + 1
})
const showingTo = computed(() => {
  if (!fm3Store.temuanList.length) return 0
  return Math.min(currentPage.value * fm3Store.temuanMeta.size, fm3Store.temuanMeta.total)
})

function resolveFindingStatusMeta(kode: string) {
  if (kode === 'DRAFT') return { badgeClass: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20', label: 'Draft' }
  if (kode === 'DIVALIDASI') return { badgeClass: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20', label: 'Divalidasi' }
  if (kode === 'DITOLAK') return { badgeClass: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20', label: 'Revisi' }
  return { badgeClass: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20', label: kode }
}

function buildPendingValidationRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/belum-divalidasi`
}

function buildCreateFindingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/create`
}

function buildValidationRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}/validasi`
}

function buildEditFindingRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}/edit`
}

function buildDetailFindingRoute(temuanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId)}`
}

async function handleInputTemuan() {
  if (fm3Store.isAuditee) {
    await navigateTo(buildCreateFindingRoute())
    return
  }

  if (fm3Store.isEvaluator) {
    await navigateTo(buildPendingValidationRoute())
    return
  }
}

async function goToValidation(rowId: string) {
  await navigateTo(buildValidationRoute(rowId))
}

async function goToEditFinding(rowId: string) {
  await navigateTo(buildEditFindingRoute(rowId))
}

async function goToDetailFinding(rowId: string) {
  await navigateTo(buildDetailFindingRoute(rowId))
}

async function handleDeleteFinding(id: string) {
  if (!confirm(t('common.confirmDelete', 'Apakah Anda yakin ingin menghapus data ini?'))) return;
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl || config.public.apiBase || 'http://localhost:3001';
  try {
    await $fetch(`/fm3/temuan/${id}`, {
      method: 'DELETE',
      baseURL,
      credentials: 'include',
    });
    fetchTemuan();
  } catch (err) {
    console.error("Gagal menghapus temuan", err);
  }
}

const informasi = computed(() => fm3Store.informasi)
const users = computed(() => {
  return informasi.value?.unit_lingkup?.unit_lingkup_evaluasi_users || []
})
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-6 lg:px-8 xl:px-12">
    <div v-if="fm3Store.isLoadingInfo" class="flex items-center justify-center py-20">
      <span class="text-gray-500">{{ t('common.loading', 'Memuat...') }}</span>
    </div>
    
    <template v-else-if="informasi">
      <section class="rounded-2xl bg-gradient-to-br from-[#e30000] to-[#b30000] p-5 text-white shadow-lg md:p-8">
        <div class="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div class="flex-1">
            <h1 class="text-2xl font-bold leading-tight md:text-3xl">
              {{ informasi.fm?.nama || t('fm3.title', 'Temuan Evaluasi') }}
            </h1>
            <p class="mt-2 max-w-[760px] text-sm text-white/90 md:text-base">
              {{ informasi.fm?.deskripsi || t('fm3.description', 'Mengelola dan memvalidasi temuan evaluasi pada periode ini.') }}
            </p>
          </div>

          <aside class="flex w-full flex-col rounded-xl bg-white/10 p-4 backdrop-blur-sm md:w-auto md:min-w-[180px]">
            <span class="text-xs font-medium uppercase tracking-wider text-white/80">Status Pelaksanaan</span>
            <strong class="mt-1 text-2xl font-bold uppercase tracking-tight">
              {{ informasi.periode_modul?.status_pelaksanaan === 'SEDANG_BERLANGSUNG' ? 'Aktif' : 'Selesai' }}
            </strong>
            <span class="mt-1 text-sm text-white/90">
              {{ informasi.periode_modul?.tanggal_mulai ? new Date(informasi.periode_modul?.tanggal_mulai).toLocaleDateString(locale) : '-' }} - {{ informasi.periode_modul?.tanggal_selesai ? new Date(informasi.periode_modul?.tanggal_selesai).toLocaleDateString(locale) : '-' }}
            </span>
          </aside>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article class="col-span-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 lg:col-span-2 lg:p-8">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">
            Aksi Temuan
          </p>
          <h2 class="mt-2 text-xl font-bold text-gray-900 md:text-2xl">
            Kelola Temuan Evaluasi
          </h2>

          <div class="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>Silakan mengelola temuan evaluasi untuk unit ini. Auditee dapat mengajukan temuan baru, dan Evaluator dapat meninjau serta memvalidasi temuan tersebut.</p>
          </div>

          <article class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="border-l-4 border-[#e30000] p-5 md:p-6">
              <div class="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 md:text-xl">
                    Formulir Temuan
                  </h3>
                  <p class="mt-2 text-sm text-gray-600">
                    Akses formulir untuk membuat atau memvalidasi temuan sesuai dengan role Anda.
                  </p>
                </div>
              </div>

              <!-- CTA hanya tampil untuk role yang bisa input/validasi -->
              <button
                v-if="!isReadOnlyMode"
                type="button"
                class="mt-6 flex w-full items-center gap-4 rounded-xl bg-[#e30000] p-4 text-left text-white shadow-sm transition hover:bg-[#cc0000]"
                @click="handleInputTemuan"
              >
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
                  </svg>
                </div>

                <div>
                  <span class="block text-lg font-bold md:text-xl">{{ fm3Store.isAuditee ? 'Buat Temuan' : 'Validasi Temuan' }}</span>
                  <span class="mt-1 block text-sm font-medium text-white/80">Klik untuk melanjutkan tindakan</span>
                </div>
              </button>

              <div
                v-else
                class="mt-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Anda hanya dapat melihat data temuan pada halaman ini.</span>
              </div>
            </div>
          </article>
        </article>

        <div class="col-span-1 flex flex-col gap-4">
          <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Lingkup Evaluasi</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <h3 class="text-xl font-bold text-gray-900 md:text-2xl">
                {{ informasi.unit_lingkup?.lingkup_evaluasi?.nama || '-' }}
              </h3>
            </div>

            <div class="my-5 h-px w-full bg-gray-100"></div>

            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Unit</p>
            <p class="mt-2 text-lg font-bold text-gray-900 md:text-xl">
              {{ informasi.unit_lingkup?.unit?.nama || '-' }}
            </p>
          </article>

          <article class="flex-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Pihak Terkait</p>
            <h3 class="mt-2 text-lg font-bold text-gray-900">Role dan User</h3>

            <div class="mt-4 flex flex-col gap-3">
              <article
                v-for="user in users"
                :key="user.id"
                class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-700">
                  {{ user.user?.nama?.charAt(0).toUpperCase() || 'U' }}
                </div>

                <div class="flex min-w-0 flex-1 flex-col">
                  <div class="flex items-center gap-2">
                    <span class="truncate text-sm font-bold text-gray-900">
                      {{ user.user?.nama }}
                    </span>
                  </div>
                  <span class="mt-0.5 w-fit rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {{ user.tipe }}
                  </span>
                  <p class="mt-1 truncate text-xs text-gray-500">
                    {{ user.user?.email }}
                  </p>
                </div>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <h2 class="text-lg font-bold text-gray-900 md:text-xl">
          Daftar Temuan
        </h2>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative w-full sm:max-w-xs">
            <input
              v-model.lazy="searchKeyword"
              type="search"
              placeholder="Cari temuan..."
              class="block w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-red-500 focus:ring-red-500"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <select
              v-model="statusFilter"
              class="block w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-sm focus:border-red-500 focus:ring-red-500 sm:w-40"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <select
              v-model="sortOrder"
              class="block w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-sm focus:border-red-500 focus:ring-red-500 sm:w-40"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-6 overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">No</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">Judul</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">Aspek</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">Status</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">Tanggal Dibuat</th>
                <th scope="col" class="px-6 py-3.5 text-center text-xs font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="fm3Store.isLoadingTemuan">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">Memuat data...</td>
              </tr>
              <template v-else>
                <tr v-for="(row, index) in fm3Store.temuanList" :key="row.id" class="transition hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {{ showingFrom + index }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ row.judul }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ row.aspek?.nama || '-' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="resolveFindingStatusMeta(row.status?.kode).badgeClass"
                    >
                      {{ resolveFindingStatusMeta(row.status?.kode).label }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {{ row.created_at ? new Date(row.created_at).toLocaleDateString(locale) : '-' }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        v-if="fm3Store.isAuditee && row.status?.kode === 'DRAFT'"
                        type="button"
                        class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        @click="goToEditFinding(row.id)"
                      >
                        Edit
                      </button>
                      <button
                        v-if="fm3Store.isEvaluator && row.status?.kode === 'DRAFT'"
                        type="button"
                        class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        @click="goToValidation(row.id)"
                      >
                        Validasi
                      </button>
                      <button
                        v-if="fm3Store.isAuditee && row.status?.kode === 'DRAFT'"
                        type="button"
                        class="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-600/20 hover:bg-red-100"
                        @click="handleDeleteFinding(row.id)"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#e30000] shadow-sm ring-1 ring-inset ring-red-600/20 hover:bg-red-50"
                        @click="goToDetailFinding(row.id)"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="fm3Store.temuanList.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">Tidak ada temuan</h3>
                    <p class="mt-1 text-sm text-gray-500">Tidak ada data temuan yang sesuai dengan kriteria pencarian.</p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-700">
            Menampilkan <span class="font-medium">{{ showingFrom }}</span> - <span class="font-medium">{{ showingTo }}</span> dari <span class="font-medium">{{ fm3Store.temuanMeta.total }}</span> hasil
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Sebelumnya
            </button>
            <span class="text-sm font-medium text-gray-700">Halaman {{ currentPage }} dari {{ totalPages }}</span>
            <button
              type="button"
              class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="flex items-center justify-center py-20">
      <span class="text-gray-500">{{ t('common.error', 'Gagal memuat data') }}</span>
    </div>
  </div>
</template>
