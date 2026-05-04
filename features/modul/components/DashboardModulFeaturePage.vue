<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardModulCreateDefaultForm,
  getDashboardModulDummyDetail,
  getDashboardModulDummyList,
  getDashboardModulEditDefaultForm,
  getDashboardModulInfoCards,
  sortDashboardModulRows,
  type DashboardModulAspekItem,
  type DashboardModulFormData,
  type DashboardModulSortOrder,
  type DashboardModulStatus,
  type DashboardModulSurveiItem,
} from '../data/dashboardModulDummy'

type DashboardModulPageMode = 'list' | 'create' | 'detail' | 'edit'
type StatusFilter = 'all' | 'active' | 'inactive'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

const props = defineProps<{
  mode: DashboardModulPageMode
}>()

const route = useRoute()

const nameLimit = 100
const descriptionLimit = 100

const listRows = ref(getDashboardModulDummyList())
const listSearchQuery = ref('')
const listSortOrder = ref<DashboardModulSortOrder>('a-z')
const listStatusFilter = ref<StatusFilter>('all')
const listCurrentPage = ref(1)
const listPageSize = 5

const aspekSearchQuery = ref('')
const aspekSortOrder = ref<DashboardModulSortOrder>('a-z')
const aspekCurrentPage = ref(1)
const aspekPageSize = 3

const surveiSearchQuery = ref('')
const surveiSortOrder = ref<DashboardModulSortOrder>('a-z')
const surveiCurrentPage = ref(1)
const surveiPageSize = 4

const detailSectionOpen = reactive({
  informasi: false,
  aspek: false,
  survei: false,
})

const form = reactive<DashboardModulFormData>(getDashboardModulCreateDefaultForm())
const formErrors = reactive({
  name: '',
  description: '',
  unitEvaluasi: '',
})

const unitEvaluasiOptions = ['Program Studi', 'Fakultas', 'Lembaga', 'Universitas']

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const modulId = computed(() =>
  normalizeRouteParam(route.params.modul_id as string | string[] | undefined)
)

const detailBundle = computed(() => getDashboardModulDummyDetail(modulId.value))
const detailData = computed(() => detailBundle.value.detail)

const currentModulListName = computed(() => {
  return listRows.value.find((item: { id: string | null }) => item.id === modulId.value)?.name ?? 'Monev Awal Pembelajaran'
})

const selectedAspekLabel = computed(() => {
  const firstAspek = detailBundle.value.aspek[0]
  if (!firstAspek) return 'Aspek'
  return `Aspek ${firstAspek.name}`
})

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Modul'
  if (props.mode === 'create') return 'Modul Baru'
  if (props.mode === 'edit') return 'Edit Modul'
  return 'Lihat Aspek'
})


const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (props.mode === 'list') {
    return [
      { label: 'Home', to: '/dashboard' },
      { label: 'Modul', to: '/dashboard/modul', active: true },
    ]
  }

  const base: BreadcrumbItem[] = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Modul', to: '/dashboard/modul' },
  ]

  if (props.mode === 'create') {
    return [...base, { label: 'Buat Modul Baru', active: true }]
  }

  if (props.mode === 'edit') {
    return [...base, { label: detailData.value.name }, { label: 'Edit', active: true }]
  }

  return [...base, { label: detailData.value.name }, { label: selectedAspekLabel.value, active: true }]
})

const backPath = computed(() => {
  if (props.mode === 'list') return '/dashboard'
  if (props.mode === 'create') return '/dashboard/modul'
  if (props.mode === 'edit') return `/dashboard/modul/${encodeURIComponent(modulId.value ?? '')}`
  return '/dashboard/modul'
})

const infoCards = computed(() => getDashboardModulInfoCards(listRows.value))

const filteredListRows = computed(() => {
  const query = listSearchQuery.value.trim().toLowerCase()
  const sortedRows = sortDashboardModulRows(listRows.value, listSortOrder.value)

  return sortedRows.filter((row: { name: any; description: any; lingkupEvaluasi: any; status: string }) => {
    const matchesQuery = query.length === 0
      || `${row.name} ${row.description} ${row.lingkupEvaluasi}`.toLowerCase().includes(query)

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

const filteredAspekRows = computed<DashboardModulAspekItem[]>(() => {
  const query = aspekSearchQuery.value.trim().toLowerCase()
  const rows = [...detailBundle.value.aspek]

  rows.sort((left, right) => {
    const compare = left.name.localeCompare(right.name)
    return aspekSortOrder.value === 'a-z' ? compare : compare * -1
  })

  if (!query) return rows

  return rows.filter((row) =>
    `${row.name} ${row.description} ${row.objekEvaluasi} ${row.indikatorEvaluasi.join(' ')}`.toLowerCase().includes(query)
  )
})

const aspekTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAspekRows.value.length / aspekPageSize))
)

const paginatedAspekRows = computed(() => {
  const start = (aspekCurrentPage.value - 1) * aspekPageSize
  return filteredAspekRows.value.slice(start, start + aspekPageSize)
})

const aspekShowingFrom = computed(() => {
  if (!filteredAspekRows.value.length) return 0
  return (aspekCurrentPage.value - 1) * aspekPageSize + 1
})

const aspekShowingTo = computed(() => {
  return Math.min(aspekCurrentPage.value * aspekPageSize, filteredAspekRows.value.length)
})

const filteredSurveiRows = computed<DashboardModulSurveiItem[]>(() => {
  const query = surveiSearchQuery.value.trim().toLowerCase()
  const rows = [...detailBundle.value.survei]

  rows.sort((left, right) => {
    const compare = left.templateSurvei.localeCompare(right.templateSurvei)
    return surveiSortOrder.value === 'a-z' ? compare : compare * -1
  })

  if (!query) return rows

  return rows.filter((row) =>
    `${row.templateSurvei} ${row.description} ${row.target}`.toLowerCase().includes(query)
  )
})

const surveiTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSurveiRows.value.length / surveiPageSize))
)

const paginatedSurveiRows = computed(() => {
  const start = (surveiCurrentPage.value - 1) * surveiPageSize
  return filteredSurveiRows.value.slice(start, start + surveiPageSize)
})

const surveiShowingFrom = computed(() => {
  if (!filteredSurveiRows.value.length) return 0
  return (surveiCurrentPage.value - 1) * surveiPageSize + 1
})

const surveiShowingTo = computed(() => {
  return Math.min(surveiCurrentPage.value * surveiPageSize, filteredSurveiRows.value.length)
})

const formHeading = computed(() => {
  if (props.mode === 'edit') return `Edit Modul ${currentModulListName.value}`
  return 'Form Modul'
})

const formSectionTitle = computed(() => {
  if (props.mode === 'edit') return 'Edit Modul'
  return 'Buat Modul Baru'
})

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)

function resetFormErrors() {
  formErrors.name = ''
  formErrors.description = ''
  formErrors.unitEvaluasi = ''
}

function setupFormByMode() {
  const next = props.mode === 'edit'
    ? getDashboardModulEditDefaultForm(modulId.value)
    : getDashboardModulCreateDefaultForm()

  form.name = next.name
  form.description = next.description
  form.unitEvaluasi = next.unitEvaluasi
  resetFormErrors()
}

function validateForm(): boolean {
  resetFormErrors()

  const trimmedName = form.name.trim()
  const trimmedDescription = form.description.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama modul wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama modul maksimal 100 karakter.'
  }

  if (!trimmedDescription) {
    formErrors.description = 'Deskripsi modul wajib diisi.'
  } else if (trimmedDescription.length > descriptionLimit) {
    formErrors.description = 'Deskripsi modul maksimal 100 karakter.'
  }

  if (!form.unitEvaluasi.trim()) {
    formErrors.unitEvaluasi = 'Unit evaluasi wajib dipilih.'
  }

  return !formErrors.name && !formErrors.description && !formErrors.unitEvaluasi
}

async function submitForm() {
  if (!validateForm()) return
  await navigateTo('/dashboard/modul/monev-awal-pembelajaran')
}

function resolveStatusBadgeClass(status: DashboardModulStatus): string {
  if (status === 'Aktif') {
    return 'bg-[#9DE8A1] text-[#128b1f]'
  }
  return 'bg-[#DEE4EC] text-[#495363]'
}

function toggleDetailSection(section: 'informasi' | 'aspek' | 'survei') {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

async function openCreateModule() {
  await navigateTo('/dashboard/modul/create')
}

async function openDetailModule(modulRowId: string) {
  await navigateTo(`/dashboard/modul/${encodeURIComponent(modulRowId)}`)
}

async function openEditModule() {
  if (!modulId.value) return
  await navigateTo(`/dashboard/modul/${encodeURIComponent(modulId.value)}/edit`)
}

async function openAspekCreate() {
  if (!modulId.value) return
  await navigateTo(`/dashboard/modul/${encodeURIComponent(modulId.value)}/aspek/create`)
}

async function openPeriodeCreate() {
  await navigateTo('/dashboard/periode-modul/create')
}

watch(
  [listSearchQuery, listSortOrder, listStatusFilter],
  () => {
    listCurrentPage.value = 1
  }
)

watch(listTotalPages, (nextTotalPages) => {
  if (listCurrentPage.value > nextTotalPages) {
    listCurrentPage.value = nextTotalPages
  }
})

watch([aspekSearchQuery, aspekSortOrder], () => {
  aspekCurrentPage.value = 1
})

watch(aspekTotalPages, (nextTotalPages) => {
  if (aspekCurrentPage.value > nextTotalPages) {
    aspekCurrentPage.value = nextTotalPages
  }
})

watch([surveiSearchQuery, surveiSortOrder], () => {
  surveiCurrentPage.value = 1
})

watch(surveiTotalPages, (nextTotalPages) => {
  if (surveiCurrentPage.value > nextTotalPages) {
    surveiCurrentPage.value = nextTotalPages
  }
})

watch(
  [() => props.mode, modulId],
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
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
          class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[16px] bg-[#e30000] px-9 text-[1rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000]"
          @click="openCreateModule"
        >
          Buat Modul
        </button>
      </div>
    </section>

    <template v-if="props.mode === 'list'">
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Card Informasi
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#686b71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>

            <p
              class="mt-3 min-h-11 font-semibold leading-tight text-[#0f1219]"
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
          Modul Monitoring Evaluasi
        </h2>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-[430px]">
            <input
              v-model="listSearchQuery"
              type="search"
              placeholder="Search"
              class="h-11 w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Lingkup Evaluasi</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Total Aspek</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Status</th>
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
                    @click="openDetailModule(row.id)"
                  >
                    {{ row.name }}
                  </button>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.lingkupEvaluasi }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.totalAspek }}
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
                  {{ row.createdAt }}
                </td>
              </tr>

              <tr v-if="paginatedListRows.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data modul tidak ditemukan.
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
          {{ formSectionTitle }}
        </h2>

        <div class="mt-6 flex justify-center">
          <form
            class="w-full max-w-[920px] rounded-[16px] border-2 border-dashed border-[#d3d8e1] bg-[#f8f8f8] px-5 py-6 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
            @submit.prevent="submitForm"
          >
            <h3 class="text-center text-[clamp(1.25rem,1.6vw,1.6rem)] font-semibold text-[#161a22]">
              {{ formHeading }}
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
                  placeholder="Masukan deskripsi di sini"
                  class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                />
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.description" class="text-[#d70000]">{{ formErrors.description }}</span>
                </div>
              </div>

              <div>
                <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Unit Evaluasi<span class="text-[#e70000]">*</span>
                </label>
                <label class="relative mt-2 block">
                  <select
                    v-model="form.unitEvaluasi"
                    class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                  >
                    <option value="">Pilih</option>
                    <option
                      v-for="option in unitEvaluasiOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </label>
                <div class="mt-2 text-[0.95rem] text-[#95a0b1]">
                  <span v-if="formErrors.unitEvaluasi" class="text-[#d70000]">{{ formErrors.unitEvaluasi }}</span>
                  <p v-else-if="props.mode === 'create'" class="text-center text-[1rem] text-[#6f788a]">
                    Tidak menemukan Unit evaluasi?
                    <NuxtLink to="/dashboard/lingkup/create" class="text-[#1e63e8] underline">Buat di sini</NuxtLink>
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="props.mode === 'edit'"
              class="mt-5 rounded-[12px] border border-[#f2a5a5] bg-[#fff0f0] px-4 py-3 text-[1rem] leading-relaxed text-[#d02121]"
            >
              <strong>Catatan:</strong>
              Perubahan pada nama dan deskripsi akan langsung terlihat oleh semua pengguna yang memiliki akses modul ini.
            </div>

            <p
              v-if="props.mode === 'edit'"
              class="mt-3 text-[0.875rem] text-[#9aa3b2]"
            >
              Terakhir disimpan: {{ detailData.lastSavedAt }}
            </p>

            <div class="mt-7 flex justify-center">
              <button
                type="submit"
                class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[20px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
              >
                Edit
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
              Informasi Modul
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-transform" :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="grid gap-8 xl:grid-cols-2">
              <dl class="space-y-4">
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Nama</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">name</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">description</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Unit Evaluasi</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">nama unitEvaluasi</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Penanggung Jawab</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">penanggungJawab</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Evaluator</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">Nama Evaluator</dd>
                </div>
                <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                  <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Dibuat Pada</dt>
                  <dd class="text-[1.25rem] text-[#2b3340]">Tanggal Dibuat</dd>
                </div>
              </dl>

              <div class="space-y-5">
                <div>
                  <p class="text-[1.25rem] font-semibold text-[#5b6575]">Role TTD Berita Acara</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      class="rounded-full bg-[#e3e8f4] px-4 py-1.5 text-[0.95rem] text-[#3e4dd8]"
                    >
                    Dekan
                    </span>
                  </div>
                </div>

                <div>
                  <p class="text-[1.25rem] font-semibold text-[#5b6575]">Role TTD Laporan</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      class="rounded-full bg-[#e3e8f4] px-4 py-1.5 text-[0.95rem] text-[#3e4dd8]"
                    >
                    Dekan
                    </span>
                  </div>
                </div>

                <dl class="space-y-2">
                  <div class="grid grid-cols-[300px_minmax(0,1fr)] gap-1">
                    <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Aspek</dt>
                    <dd class="text-[1.25rem] text-[#2b3340]">1</dd>
                  </div>
                  <div class="grid grid-cols-[300px_minmax(0,1fr)] gap-1">
                    <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Objek Evaluasi</dt>
                    <dd class="text-[1.25rem] text-[#2b3340]">1</dd>
                  </div>
                  <div class="grid grid-cols-[300px_minmax(0,1fr)] gap-1">
                    <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Periode Dibuat</dt>
                    <dd class="text-[1.25rem] text-[#2b3340]">1</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
                @click="openEditModule"
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
                @click="openPeriodeCreate"
              >
                Buat Periode Baru
              </button>
              <button
                type="button"
                class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]"
                @click="openAspekCreate"
              >
                Tambah Aspek
              </button>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleDetailSection('aspek')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Aspek
              </h2>
              <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
                Total Aspek data
              </span>
            </div>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-transform" :class="detailSectionOpen.aspek ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.aspek" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="aspekSearchQuery"
                  type="search"
                  placeholder="Search"
                  class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </label>

              <label class="relative block w-full md:w-[170px]">
                <select
                  class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
                >
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[900px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Objek Evaluasi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Indikator Evaluasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      No.
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      nama
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      deskripsi
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      objek evalusi
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      <ol class="space-y-1">
                        <li>
                          1. Indikator 1
                        </li>
                      </ol>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Belum ada data aspek.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>1-10</strong> dari <strong>1</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                1
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
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
            @click="toggleDetailSection('survei')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Daftar Survei
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-transform" :class="detailSectionOpen.survei ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.survei" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="surveiSearchQuery"
                  type="search"
                  placeholder="Search"
                  class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </label>

              <label class="relative block w-full md:w-[170px]">
                <select
                  class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none"
                >
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
            </div>

            <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
              <table class="w-full min-w-[860px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Template Survei</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      No.
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      Template Survei
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      Deskripsi
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      Mahasiwa
                    </td>
                  </tr>

                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Belum ada data survei.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>1-10</strong> dari <strong>1</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                1
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
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


