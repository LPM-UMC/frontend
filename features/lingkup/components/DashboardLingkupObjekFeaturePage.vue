<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardLingkupObjekCreateDefaultForm,
  getDashboardLingkupObjekDummyDetail,
  getDashboardLingkupObjekEditDefaultForm,
  sortDashboardLingkupObjekTableRows,
  type DashboardLingkupObjekColumnItem,
  type DashboardLingkupObjekFormData,
  type DashboardLingkupSortOrder,
} from '../data/dashboardLingkupDummy'

type DashboardLingkupObjekPageMode = 'detail' | 'create' | 'edit'
type DashboardLingkupObjekSection = 'informasi' | 'daftar' | 'form'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

interface ColumnFieldError {
  name: string
  type: string
}

const props = defineProps<{
  mode: DashboardLingkupObjekPageMode
}>()

const route = useRoute()

const pageSize = 5
const nameLimit = 100
const descriptionLimit = 100

const searchQuery = ref('')
const sortOrder = ref<DashboardLingkupSortOrder>('a-z')
const currentPage = ref(1)

const sectionOpen = reactive<Record<DashboardLingkupObjekSection, boolean>>({
  informasi: false,
  daftar: false,
  form: false,
})

const form = reactive<DashboardLingkupObjekFormData>(
  getDashboardLingkupObjekCreateDefaultForm()
)

const formErrors = reactive({
  name: '',
  description: '',
})

const columnErrors = reactive<Record<string, ColumnFieldError>>({})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function createColumnId(): string {
  return `column-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function createEmptyColumn(): DashboardLingkupObjekColumnItem {
  return {
    id: createColumnId(),
    name: '',
    type: '',
  }
}

const lingkupId = computed(() =>
  normalizeRouteParam(route.params.lingkup_id as string | string[] | undefined)
)

const objekId = computed(() =>
  normalizeRouteParam(route.params.objek_id as string | string[] | undefined)
)

const detailBundle = computed(() =>
  getDashboardLingkupObjekDummyDetail(lingkupId.value, objekId.value)
)

const detailInfo = computed(() => detailBundle.value.info)
const columnTypeOptions = computed(() => detailBundle.value.columnTypeOptions)

const lingkupDetailPath = computed(() => {
  if (!lingkupId.value) return '/dashboard/lingkup'
  return `/dashboard/lingkup/${encodeURIComponent(lingkupId.value)}`
})

const objekDetailPath = computed(() => {
  const resolvedLingkupId = lingkupId.value ?? detailInfo.value.lingkupName.toLowerCase().replace(/\s+/g, '-')
  const resolvedObjekId = objekId.value ?? detailInfo.value.id
  return `/dashboard/lingkup/${encodeURIComponent(resolvedLingkupId)}/objek/${encodeURIComponent(resolvedObjekId)}`
})

const objekEditPath = computed(() => `${objekDetailPath.value}/edit`)
const objekCreatePath = computed(() => `${objekDetailPath.value}/create`)

const pageTitle = computed(() => {
  if (props.mode === 'create') {
    return `Objek Evaluasi ${detailInfo.value.lingkupName} Baru`
  }

  if (props.mode === 'edit') {
    return `Edit Objek Evaluasi (${detailInfo.value.lingkupName})`
  }

  return detailInfo.value.name
})

const pageDescription = computed(() => {
  if (props.mode === 'create') {
    return `Gunakan fitur ini untuk menambahkan objek evaluasi pada lingkup ${detailInfo.value.lingkupName} sebagai target penilaian dalam modul. Objek yang dibuat akan dapat dipilih saat menyusun aspek dan pelaksanaan evaluasi pada periode berikutnya, sehingga proses monitoring dan penilaian lebih terarah dan konsisten.`
  }

  if (props.mode === 'edit') {
    return `Gunakan halaman ini untuk memperbarui informasi objek evaluasi ${detailInfo.value.name}, termasuk nama, deskripsi, dan kolom informasi yang akan ditampilkan pada tabel. Perubahan yang disimpan akan digunakan pada lingkup evaluasi dan dapat memengaruhi tampilan serta proses evaluasi pada modul yang menggunakan objek ini.`
  }

  return `Gunakan halaman ini untuk melihat informasi objek evaluasi ${detailInfo.value.name} beserta daftar data yang terdaftar pada lingkup evaluasi. Gunakan setiap bagian untuk meninjau detail, melakukan pencarian dan pengurutan data, serta memantau status integrasi sistem agar pengelolaan objek evaluasi berjalan lebih terstruktur dan konsisten.`
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const base: BreadcrumbItem[] = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Lingkup Evaluasi', to: '/dashboard/lingkup' },
    { label: detailInfo.value.lingkupName, to: lingkupDetailPath.value },
    { label: detailInfo.value.unitName },
    { label: 'Objek Evaluasi' },
  ]

  if (props.mode === 'create') {
    return [...base, { label: 'Buat', active: true }]
  }

  return [...base, { label: detailInfo.value.name, active: true }]
})

const backPath = computed(() => {
  if (props.mode === 'detail') return lingkupDetailPath.value
  return objekDetailPath.value
})

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const sorted = sortDashboardLingkupObjekTableRows(detailBundle.value.tableRows, sortOrder.value)

  if (!query) return sorted

  return sorted.filter((row) =>
    `${row.name} ${row.dosen} ${row.integrasiSistem}`.toLowerCase().includes(query)
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize))
)

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

const showingFrom = computed(() => {
  if (!filteredRows.value.length) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() => {
  return Math.min(currentPage.value * pageSize, filteredRows.value.length)
})

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)

function getColumnNameCount(column: DashboardLingkupObjekColumnItem): number {
  return column.name.length
}

function getColumnError(columnId: string, field: keyof ColumnFieldError): string {
  return columnErrors[columnId]?.[field] ?? ''
}

function resetColumnErrors() {
  Object.keys(columnErrors).forEach((key) => {
    delete columnErrors[key]
  })
}

function resetFormErrors() {
  formErrors.name = ''
  formErrors.description = ''
  resetColumnErrors()
}

function setupFormByMode() {
  const defaults = props.mode === 'edit'
    ? getDashboardLingkupObjekEditDefaultForm(lingkupId.value, objekId.value)
    : getDashboardLingkupObjekCreateDefaultForm(lingkupId.value, objekId.value)

  form.name = defaults.name
  form.description = defaults.description
  form.columns.splice(0, form.columns.length, ...defaults.columns.map((column) => ({ ...column })))

  if (props.mode === 'edit' && form.columns.length === 0) {
    form.columns.push(createEmptyColumn())
  }

  resetFormErrors()
}

function validateForm(): boolean {
  resetFormErrors()

  const trimmedName = form.name.trim()
  const trimmedDescription = form.description.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama objek evaluasi wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama objek evaluasi maksimal 100 karakter.'
  }

  if (!trimmedDescription) {
    formErrors.description = 'Deskripsi objek evaluasi wajib diisi.'
  } else if (trimmedDescription.length > descriptionLimit) {
    formErrors.description = 'Deskripsi objek evaluasi maksimal 100 karakter.'
  }

  if (props.mode === 'edit') {
    form.columns.forEach((column) => {
      const nextError: ColumnFieldError = {
        name: '',
        type: '',
      }

      if (!column.name.trim()) {
        nextError.name = 'Nama kolom wajib diisi.'
      } else if (column.name.trim().length > nameLimit) {
        nextError.name = 'Nama kolom maksimal 100 karakter.'
      }

      if (!column.type) {
        nextError.type = 'Tipe kolom wajib dipilih.'
      }

      if (nextError.name || nextError.type) {
        columnErrors[column.id] = nextError
      }
    })
  }

  return !formErrors.name
    && !formErrors.description
    && Object.keys(columnErrors).length === 0
}

function toggleSection(section: DashboardLingkupObjekSection) {
  sectionOpen[section] = !sectionOpen[section]
}

function addColumn() {
  form.columns.push(createEmptyColumn())
}

function removeColumn(columnId: string) {
  if (form.columns.length <= 1) return
  const index = form.columns.findIndex((column) => column.id === columnId)
  if (index === -1) return
  form.columns.splice(index, 1)
  delete columnErrors[columnId]
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

async function goToEdit() {
  await navigateTo(objekEditPath.value)
}

async function handleSubmit() {
  if (!validateForm()) return
  await navigateTo(objekDetailPath.value)
}

watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch(
  [() => props.mode, lingkupId, objekId],
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
      <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
        {{ pageTitle }}
      </h1>
      <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
        {{ pageDescription }}
      </p>
    </section>

    <template v-if="props.mode === 'detail'">
      <section class="mt-6 space-y-6">
        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleSection('informasi')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Informasi {{ detailInfo.name }}
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="sectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="sectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <dl class="space-y-4">
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Nama Objek Evaluasi</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.name }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.description }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Lingkup Evaluasi</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.unitName }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Total Objek</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.totalObjek }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Integrasi Sistem</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.integrasiSistem }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Semester</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.semester }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Tanggal Dibuat</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.createdAt }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.05rem] font-semibold text-[#5b6575]">Terakhir Diperbarui</dt>
                <dd class="text-[1.05rem] text-[#2b3340]">{{ detailInfo.updatedAt }}</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-wrap gap-3 border-t border-[#e5e9f0] pt-4">
              <button
                type="button"
                class="rounded-[18px] bg-[#e30000] px-7 py-2 text-[0.95rem] font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition hover:bg-[#ca0000]"
                @click="goToEdit"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-[18px] bg-[#c5cad3] px-7 py-2 text-[0.95rem] font-semibold text-[#1b2432] transition hover:bg-[#b8bec9]"
              >
                Hapus
              </button>
            </div>
          </div>
        </article>

        <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            class="flex w-full items-center justify-between px-6 py-5 text-left"
            @click="toggleSection('daftar')"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
                Daftar Objek Evaluasi
              </h2>
              <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
                {{ paginatedRows.length }} data
              </span>
            </div>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="sectionOpen.daftar ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="sectionOpen.daftar" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="searchQuery"
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
                  v-model="sortOrder"
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
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Dosen</th>
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Integrasi Sistem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ showingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.dosen }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.integrasiSistem }}
                    </td>
                  </tr>

                  <tr v-if="paginatedRows.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data objek evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="currentPage === 1"
                  @click="currentPage = Math.max(1, currentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ currentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="currentPage === totalPages"
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>

    <template v-else-if="props.mode === 'create'">
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold text-[#11141b]">
          Buat Objek Evaluasi {{ detailInfo.lingkupName }} Baru
        </h2>

        <form
          class="mx-auto mt-6 w-full max-w-[920px] rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-8 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:px-8"
          @submit.prevent="handleSubmit"
        >
          <h3 class="text-center text-[clamp(1.55rem,1.8vw,2rem)] font-semibold text-[#151922]">
            Form Objek Evaluasi {{ detailInfo.lingkupName }}
          </h3>

          <div class="mt-7 space-y-5">
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Nama<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                :maxlength="nameLimit"
                placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ nameCount }}/100</span>
              </p>
              <p v-if="formErrors.name" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.name }}
              </p>
            </div>

            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Deskripsi<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                :maxlength="descriptionLimit"
                placeholder="Masukkan deskripsi di sini"
                class="mt-2 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ descriptionCount }}/100</span>
              </p>
              <p v-if="formErrors.description" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.description }}
              </p>
            </div>
          </div>

          <div class="mt-6 rounded-[12px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3 text-[#c52222]">
            <p class="text-[0.98rem] leading-relaxed">
              <span class="font-semibold">Catatan:</span>
              Setelah disimpan, perubahan pada nama dan deskripsi objek evaluasi akan terlihat oleh semua pengguna yang memiliki akses pada lingkup ini. Pastikan data sudah sesuai sebelum menekan tombol Buat.
            </p>
          </div>

          <p class="mt-5 text-center text-[1rem] text-[#6a7384]">
            Butuh Objek Evaluasi yang terintegrasi GS?
            <NuxtLink :to="objekCreatePath" class="text-[#2a64e5] underline">Hubungi Developer</NuxtLink>
          </p>

          <div class="mt-6 flex justify-center">
            <button
              type="submit"
              class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
            >
              Buat
            </button>
          </div>
        </form>
      </section>
    </template>

    <template v-else>
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <button
          type="button"
          class="flex w-full items-center justify-between px-6 py-5 text-left"
          @click="toggleSection('form')"
        >
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
            Informasi Dasar &amp; Kolom Informasi
          </h2>
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="sectionOpen.form ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </span>
        </button>

        <form
          v-if="sectionOpen.form"
          class="border-t border-[#e3e7ee] px-6 py-6"
          @submit.prevent="handleSubmit"
        >
          <h3 class="text-[clamp(1.6rem,1.9vw,2rem)] font-semibold text-[#11141b]">
            Informasi Dasar
          </h3>

          <p class="mt-2 max-w-[1200px] text-[1.05rem] leading-relaxed text-[#556173]">
            Gunakan halaman ini untuk memperbarui informasi objek evaluasi {{ detailInfo.name }}, termasuk nama, deskripsi, dan kolom informasi yang akan ditampilkan pada tabel. Perubahan yang disimpan akan digunakan pada lingkup evaluasi dan dapat memengaruhi tampilan serta proses evaluasi pada modul yang menggunakan objek ini.
          </p>

          <div class="mt-5 space-y-5">
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Nama<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                :maxlength="nameLimit"
                placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ nameCount }}/100</span>
              </p>
              <p v-if="formErrors.name" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.name }}
              </p>
            </div>

            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Deskripsi<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                :maxlength="descriptionLimit"
                placeholder="Masukkan deskripsi di sini"
                class="mt-2 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ descriptionCount }}/100</span>
              </p>
              <p v-if="formErrors.description" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.description }}
              </p>
            </div>
          </div>

          <div class="mt-6 border-t border-[#dfe5ee] pt-6">
            <h3 class="text-[clamp(1.6rem,1.9vw,2rem)] font-semibold text-[#11141b]">
              Kolom Informasi
            </h3>
            <p class="mt-2 max-w-[1200px] text-[1.05rem] leading-relaxed text-[#556173]">
              Kelola kolom yang akan ditampilkan sebagai header pada tabel data objek evaluasi. Tambahkan kolom sesuai kebutuhan agar data lebih mudah dibaca dan dianalisis.
            </p>

            <div class="mt-5 space-y-6">
              <div
                v-for="column in form.columns"
                :key="column.id"
                class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start"
              >
                <div>
                  <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                    Nama<span class="text-[#e30000]">*</span>
                  </label>
                  <input
                    v-model="column.name"
                    type="text"
                    :maxlength="nameLimit"
                    placeholder="Masukkan nama di sini"
                    class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
                  >
                  <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                    <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                    <span class="font-semibold">{{ getColumnNameCount(column) }}/100</span>
                  </p>
                  <p v-if="getColumnError(column.id, 'name')" class="mt-1 text-[0.875rem] text-[#e30000]">
                    {{ getColumnError(column.id, 'name') }}
                  </p>
                </div>

                <div>
                  <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                    Tipe<span class="text-[#e30000]">*</span>
                  </label>
                  <label class="relative mt-2 block">
                    <select
                      v-model="column.type"
                      class="h-14 w-full appearance-none rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 pr-12 text-[1.05rem] text-[#9aa3b3] outline-none"
                    >
                      <option value="">Pilih Tipe</option>
                      <option
                        v-for="option in columnTypeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </label>
                  <p class="mt-2 text-[0.9rem] text-[#98a1b1]">
                    Pilihlah tipe berdasarkan kebutuhan
                  </p>
                  <p v-if="getColumnError(column.id, 'type')" class="mt-1 text-[0.875rem] text-[#e30000]">
                    {{ getColumnError(column.id, 'type') }}
                  </p>
                </div>

                <div class="md:pt-9">
                  <button
                    type="button"
                    class="inline-flex h-14 min-w-[110px] items-center justify-center rounded-[16px] bg-[#e30000] px-6 text-[1.05rem] font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition hover:bg-[#ca0000] disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="form.columns.length <= 1"
                    @click="removeColumn(column.id)"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 inline-flex h-14 w-full items-center justify-center rounded-[16px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
              @click="addColumn"
            >
              Tambah Kolom
            </button>

            <div class="mt-5 rounded-[12px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3 text-[#c52222]">
              <p class="text-[0.98rem] leading-relaxed">
                <span class="font-semibold">Catatan:</span>
                Kelola kolom yang akan ditampilkan sebagai header pada tabel data objek evaluasi. Tambahkan kolom sesuai kebutuhan agar data lebih mudah dibaca dan dianalisis.
              </p>
            </div>

            <p class="mt-4 inline-flex items-center gap-2 text-[0.95rem] text-[#98a1b1]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              Terakhir disimpan: {{ detailInfo.lastSavedAt }}
            </p>

            <div class="mt-6 flex justify-end">
              <button
                type="submit"
                class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </section>
    </template>
  </section>
</template>
