<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardLingkupCreateDefaultForm,
  getDashboardLingkupDummyDetail,
  getDashboardLingkupDummyList,
  getDashboardLingkupEditDefaultForm,
  getDashboardLingkupInfoCards,
  sortDashboardLingkupObjekRows,
  sortDashboardLingkupRows,
  sortDashboardLingkupScopeRows,
  type DashboardLingkupFormData,
  type DashboardLingkupSortOrder,
  type DashboardLingkupStatus,
} from '../data/dashboardLingkupDummy'

type DashboardLingkupPageMode = 'list' | 'create' | 'detail' | 'edit'
type DashboardLingkupStatusFilter = 'all' | 'active' | 'inactive'
type DashboardLingkupSection = 'informasi' | 'lingkup' | 'objek'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

const props = defineProps<{
  mode: DashboardLingkupPageMode
}>()

const route = useRoute()

const listPageSize = 5
const scopePageSize = 5
const objekPageSize = 4
const nameLimit = 100
const descriptionLimit = 100

const listRows = ref(getDashboardLingkupDummyList())
const listSearchQuery = ref('')
const listSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const listStatusFilter = ref<DashboardLingkupStatusFilter>('all')
const listCurrentPage = ref(1)

const scopeSearchQuery = ref('')
const scopeSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const scopeCurrentPage = ref(1)

const objekSearchQuery = ref('')
const objekSortOrder = ref<DashboardLingkupSortOrder>('a-z')
const objekCurrentPage = ref(1)

const detailSectionOpen = reactive({
  informasi: false,
  lingkup: false,
  objek: false,
})

const form = reactive<DashboardLingkupFormData>(getDashboardLingkupCreateDefaultForm())
const formErrors = reactive({
  name: '',
  description: '',
  rolePenanggungJawab: '',
  roleEvaluator: '',
})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const lingkupId = computed(() =>
  normalizeRouteParam(route.params.lingkup_id as string | string[] | undefined)
)

const detailBundle = computed(() =>
  getDashboardLingkupDummyDetail(lingkupId.value)
)

const detailInfo = computed(() => detailBundle.value.info)
const infoCards = computed(() => getDashboardLingkupInfoCards(listRows.value))

const rolePenanggungJawabOptions = computed(
  () => detailBundle.value.rolePenanggungJawabOptions
)

const roleEvaluatorOptions = computed(
  () => detailBundle.value.roleEvaluatorOptions
)

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Lingkup Evaluasi'
  if (props.mode === 'create') return 'Lingkup Evaluasi Baru'
  if (props.mode === 'edit') return 'Edit Lingkup Evaluasi'
  return 'Lihat Lingkup Evaluasi'
})

const pageDescription = computed(() => {
  if (props.mode === 'list') {
    return 'Gunakan fitur ini untuk mendefinisikan scope objek evaluasi (mis. Program Studi/Fakultas/UKM) yang akan digunakan oleh modul saat pemetaan objek, penarikan data, dan pelaporan. Status integrasi (terhubung/tidak terhubung GS) akan memengaruhi sumber data dan ketersediaan objek pada proses evaluasi berikutnya.'
  }

  if (props.mode === 'create') {
    return 'Gunakan fitur ini untuk membuat lingkup evaluasi baru sebagai batasan (scope) objek yang akan dinilai, seperti Program Studi, Fakultas, atau Unit. Lingkup yang dibuat akan digunakan pada modul saat menentukan objek evaluasi dan membantu proses monitoring serta penilaian berjalan lebih terstruktur dan konsisten'
  }

  if (props.mode === 'edit') {
    return 'Gunakan halaman ini untuk memperbarui informasi lingkup evaluasi seperti nama, deskripsi, dan role penanggung jawab. Perubahan ini akan memengaruhi data lingkup yang digunakan pada proses modul berikutnya.'
  }

  return 'Gunakan halaman ini untuk melihat detail lingkup evaluasi beserta unit dan objek yang terhubung. Anda dapat membuka informasi lingkup, meninjau daftar unit, serta daftar objek evaluasi untuk memudahkan pengelolaan data.'
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (props.mode === 'list') {
    return [
      { label: 'Home', to: '/dashboard' },
      { label: 'Lingkup Evaluasi', active: true },
    ]
  }

  const base: BreadcrumbItem[] = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Lingkup Evaluasi', to: '/dashboard/lingkup' },
  ]

  if (props.mode === 'create') {
    return [...base, { label: 'Buat', active: true }]
  }

  if (props.mode === 'edit') {
    return [...base, { label: detailInfo.value.name, to: `/dashboard/lingkup/${encodeURIComponent(detailInfo.value.id)}` }, { label: 'Edit', active: true }]
  }

  return [...base, { label: detailInfo.value.name, active: true }]
})

const backPath = computed(() => {
  if (props.mode === 'list') return '/dashboard'
  if (props.mode === 'create') return '/dashboard/lingkup'
  if (props.mode === 'edit') return `/dashboard/lingkup/${encodeURIComponent(lingkupId.value ?? '')}`
  return '/dashboard/lingkup'
})

const filteredListRows = computed(() => {
  const query = listSearchQuery.value.trim().toLowerCase()
  const sortedRows = sortDashboardLingkupRows(listRows.value, listSortOrder.value)

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

const filteredScopeRows = computed(() => {
  const query = scopeSearchQuery.value.trim().toLowerCase()
  const sortedRows = sortDashboardLingkupScopeRows(
    detailBundle.value.scopeRows,
    scopeSortOrder.value
  )

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description} ${row.penanggungJawab} ${row.evaluator}`.toLowerCase().includes(query)
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
  const sortedRows = sortDashboardLingkupObjekRows(
    detailBundle.value.objekRows,
    objekSortOrder.value
  )

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description} ${row.integrasiSistem}`.toLowerCase().includes(query)
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

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)

function resetFormErrors() {
  formErrors.name = ''
  formErrors.description = ''
  formErrors.rolePenanggungJawab = ''
  formErrors.roleEvaluator = ''
}

function setupFormByMode() {
  const defaults = props.mode === 'edit'
    ? getDashboardLingkupEditDefaultForm(lingkupId.value)
    : getDashboardLingkupCreateDefaultForm()

  form.name = defaults.name
  form.description = defaults.description
  form.rolePenanggungJawab = defaults.rolePenanggungJawab
  form.roleEvaluator = defaults.roleEvaluator

  resetFormErrors()
}

function validateForm(): boolean {
  resetFormErrors()

  const trimmedName = form.name.trim()
  const trimmedDescription = form.description.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama lingkup wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama lingkup maksimal 100 karakter.'
  }

  if (!trimmedDescription) {
    formErrors.description = 'Deskripsi lingkup wajib diisi.'
  } else if (trimmedDescription.length > descriptionLimit) {
    formErrors.description = 'Deskripsi lingkup maksimal 100 karakter.'
  }

  if (!form.rolePenanggungJawab.trim()) {
    formErrors.rolePenanggungJawab = 'Role penanggung jawab wajib dipilih.'
  }

  if (!form.roleEvaluator.trim()) {
    formErrors.roleEvaluator = 'Role evaluator wajib dipilih.'
  }

  return (
    !formErrors.name
    && !formErrors.description
    && !formErrors.rolePenanggungJawab
    && !formErrors.roleEvaluator
  )
}

function resolveStatusBadgeClass(status: DashboardLingkupStatus): string {
  if (status === 'Aktif') {
    return 'bg-[#9DE8A1] text-[#128b1f]'
  }
  return 'bg-[#DEE4EC] text-[#495363]'
}

function toggleDetailSection(section: DashboardLingkupSection) {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

async function openCreateLingkup() {
  await navigateTo('/dashboard/lingkup/create')
}

async function openDetailLingkup(id: string) {
  await navigateTo(`/dashboard/lingkup/${encodeURIComponent(id)}`)
}

async function openEditLingkup() {
  if (!lingkupId.value) return
  await navigateTo(`/dashboard/lingkup/${encodeURIComponent(lingkupId.value)}/edit`)
}

async function openCreateObjek() {
  if (!lingkupId.value) return
  const defaultObjekId = detailBundle.value.objekRows[0]?.id ?? 'objek-baru'
  await navigateTo(`/dashboard/lingkup/${encodeURIComponent(lingkupId.value)}/objek/${encodeURIComponent(defaultObjekId)}/create`)
}

async function submitForm() {
  if (!validateForm()) return

  if (props.mode === 'edit') {
    await navigateTo(`/dashboard/lingkup/${encodeURIComponent(lingkupId.value ?? '')}`)
    return
  }

  await navigateTo('/dashboard/lingkup')
}

watch([listSearchQuery, listSortOrder, listStatusFilter], () => {
  listCurrentPage.value = 1
})

watch(listTotalPages, (nextTotalPages) => {
  if (listCurrentPage.value > nextTotalPages) {
    listCurrentPage.value = nextTotalPages
  }
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

watch(
  [() => props.mode, lingkupId],
  () => {
    setupFormByMode()
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1520px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white"
        aria-label="Kembali"
        @click="navigateBack"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
        </svg>
      </button>

      <nav class="flex flex-wrap items-center gap-1">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="text-[clamp(0.95rem,1.2vw,1.05rem)]"
            :class="item.active ? 'font-semibold text-[#e30000]' : 'text-[#9aa2b1]'"
          >
            {{ item.label }}
          </span>
          <span
            v-if="index !== breadcrumbItems.length - 1"
            class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]"
          >/</span>
        </template>
      </nav>
    </div>

    <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
            {{ pageTitle }}
          </h1>
          <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            {{ pageDescription }}
          </p>
        </div>

        <button
          v-if="props.mode === 'list'"
          type="button"
          class="inline-flex h-12 min-w-[180px] items-center justify-center rounded-[16px] bg-[#e30000] px-8 text-[1rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000]"
          @click="openCreateLingkup"
        >
          Buat Lingkup Baru
        </button>
      </div>
    </section>

    <template v-if="props.mode === 'list'">
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Loremipsun
        </h2>

        <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          <article
            v-for="card in infoCards"
            :key="card.id"
            class="rounded-[16px] border border-[#e4e7ec] bg-[#f8f8f8] px-5 py-5 shadow-[0_8px_16px_rgba(15,23,42,0.1)]"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-[clamp(1rem,1.2vw,1.15rem)] font-semibold text-[#44474d]">
                {{ card.title }}
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#686b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>

            <p
              class="mt-3 min-h-[52px] font-semibold leading-tight text-[#0f1219]"
              :class="typeof card.value === 'number'
                ? 'text-[clamp(1.5rem,2vw,2rem)]'
                : 'text-[clamp(1.1rem,1.3vw,1.25rem)]'"
            >
              {{ card.value }}
            </p>

            <div class="mt-2 h-[14px] w-[160px] overflow-hidden rounded-full bg-[#dae0e8]">
              <span class="block h-full rounded-full bg-[#48d27a]" :style="{ width: `${card.progressPercent}%` }" />
            </div>

            <p class="mt-2 text-[clamp(1rem,1.1vw,1.2rem)] text-[#1f76aa]">
              {{ card.actionLabel }}
            </p>
          </article>
        </div>
      </section>

      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Daftar Lingkup Evaluasi
        </h2>

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
                  <button
                    type="button"
                    class="text-left text-[1rem] font-semibold text-[#3b3f46] transition hover:text-[#e30000]"
                    @click="openDetailLingkup(row.id)"
                  >
                    {{ row.name }}
                  </button>
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
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
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
    </template>

    <template v-if="props.mode === 'create' || props.mode === 'edit'">
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.45rem,1.9vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          {{ props.mode === 'edit' ? 'Edit Lingkup Evaluasi' : 'Buat Lingkup Evaluasi Baru' }}
        </h2>

        <div class="mt-6 flex justify-center">
          <form
            class="w-full max-w-[940px] rounded-[16px] border-2 border-dashed border-[#d3d8e1] bg-[#f8f8f8] px-5 py-6 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
            @submit.prevent="submitForm"
          >
            <h3 class="text-center text-[clamp(1.25rem,1.6vw,1.6rem)] font-semibold text-[#161a22]">
              {{ props.mode === 'edit' ? 'Edit Form Lingkup Evaluasi' : 'Form Lingkup Evaluasi' }}
            </h3>

            <div class="mt-7 space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Nama<span class="text-[#e70000]">*</span>
                  </label>
                  <span class="text-[0.875rem] text-[#95a0b1]">{{ nameCount }}/100</span>
                </div>
                <input
                  v-model="form.name"
                  maxlength="100"
                  type="text"
                  placeholder="Masukkan nama di sini"
                  class="mt-2 h-12 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                >
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.name" class="text-[#d70000]">{{ formErrors.name }}</span>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Deskripsi<span class="text-[#e70000]">*</span>
                  </label>
                  <span class="text-[0.875rem] text-[#95a0b1]">{{ descriptionCount }}/100</span>
                </div>
                <textarea
                  v-model="form.description"
                  maxlength="100"
                  rows="4"
                  placeholder="Masukkan deskripsi di sini"
                  class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                />
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.description" class="text-[#d70000]">{{ formErrors.description }}</span>
                </div>
              </div>

              <div>
                <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Pilih Role Penanggung Jawab<span class="text-[#e70000]">*</span>
                </label>
                <label class="relative mt-2 block">
                  <select
                    v-model="form.rolePenanggungJawab"
                    class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                  >
                    <option value="">Pilih</option>
                    <option
                      v-for="option in rolePenanggungJawabOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </label>
                <p v-if="formErrors.rolePenanggungJawab" class="mt-1 text-[0.95rem] text-[#d70000]">
                  {{ formErrors.rolePenanggungJawab }}
                </p>
              </div>

              <div>
                <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Pilih Role Evaluator<span class="text-[#e70000]">*</span>
                </label>
                <label class="relative mt-2 block">
                  <select
                    v-model="form.roleEvaluator"
                    class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                  >
                    <option value="">Pilih</option>
                    <option
                      v-for="option in roleEvaluatorOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </label>
                <p v-if="formErrors.roleEvaluator" class="mt-1 text-[0.95rem] text-[#d70000]">
                  {{ formErrors.roleEvaluator }}
                </p>
              </div>
            </div>

            <p class="mt-5 text-center text-[1rem] text-[#6f788a]">
              Butuh lingkup yang terintegrasi GS?
              <NuxtLink to="/dashboard/lingkup/create" class="text-[#1e63e8] underline">Hubungi Developer</NuxtLink>
            </p>

            <p v-if="props.mode === 'edit'" class="mt-3 inline-flex items-center gap-2 text-[0.875rem] text-[#9aa3b2]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              Terakhir disimpan: {{ detailInfo.lastSavedAt }}
            </p>

            <div class="mt-7 flex justify-center">
              <button
                type="submit"
                class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[20px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
              >
                {{ props.mode === 'edit' ? 'Edit' : 'Buat' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </template>

    <template v-if="props.mode === 'detail'">
      <section class="mt-6 space-y-6">
        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('informasi')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Informasi Lingkup Evaluasi
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <dl class="space-y-5">
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Nama Lingkup</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.name }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.description }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Penanggung Jawab</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.penanggungJawab }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Evaluator</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.evaluator }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Unit</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.totalUnit }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Integrasi Sistem</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.integrasiSistem }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Dibuat</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.createdAt }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Diperbarui</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.updatedAt }}</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
                @click="openEditLingkup"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
              >
                Hapus
              </button>
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
                @click="openCreateLingkup"
              >
                Tambah Lingkup Evaluasi
              </button>
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
                @click="openCreateObjek"
              >
                Tambah Objek Evaluasi
              </button>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('lingkup')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Lingkup Evaluasi
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
                  placeholder="Search"
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
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[980px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Penanggung Jawab</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Evaluator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedScopeRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ scopeShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.description }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.penanggungJawab }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.evaluator }}
                    </td>
                  </tr>

                  <tr v-if="paginatedScopeRows.length === 0">
                    <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data lingkup evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ scopeShowingFrom }}-{{ scopeShowingTo }}</strong> dari <strong>{{ filteredScopeRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === 1"
                  @click="scopeCurrentPage = Math.max(1, scopeCurrentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ scopeCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="scopeCurrentPage === scopeTotalPages"
                  @click="scopeCurrentPage = Math.min(scopeTotalPages, scopeCurrentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('objek')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Objek Evaluasi
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
                  placeholder="Search"
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
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[860px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Integrasi Sistem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedObjekRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ objekShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.description }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.integrasiSistem }}
                    </td>
                  </tr>

                  <tr v-if="paginatedObjekRows.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data objek evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ objekShowingFrom }}-{{ objekShowingTo }}</strong> dari <strong>{{ filteredObjekRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === 1"
                  @click="objekCurrentPage = Math.max(1, objekCurrentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ objekCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="objekCurrentPage === objekTotalPages"
                  @click="objekCurrentPage = Math.min(objekTotalPages, objekCurrentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>
  </section>
</template>
