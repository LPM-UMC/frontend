<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardModulAspekCreateDefaultForm,
  getDashboardModulAspekDummyDetail,
  getDashboardModulAspekEditDefaultForm,
  getDashboardModulDummyList,
  sortDashboardModulAspekIndicatorRows,
  type DashboardModulAspekFormData,
  type DashboardModulSortOrder,
} from '../data/dashboardModulDummy'

type DashboardModulAspekPageMode = 'create' | 'detail' | 'edit'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

const props = defineProps<{
  mode: DashboardModulAspekPageMode
}>()

const route = useRoute()

const nameLimit = 100
const descriptionLimit = 100
const proofDescriptionLimit = 100
const indicatorPageSize = 5

const indicatorSearchQuery = ref('')
const indicatorSortOrder = ref<DashboardModulSortOrder>('a-z')
const indicatorCurrentPage = ref(1)

const detailSectionOpen = reactive({
  informasiAspek: false,
  indikatorEvaluasi: false,
})

const form = reactive<DashboardModulAspekFormData>(getDashboardModulAspekCreateDefaultForm())
const formErrors = reactive({
  name: '',
  description: '',
  objekEvaluasi: '',
  indikatorId: '',
  deskripsiSingkatBukti: '',
})

const dashboardModulListRows = getDashboardModulDummyList()

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const modulId = computed(() =>
  normalizeRouteParam(route.params.modul_id as string | string[] | undefined)
)

const aspekId = computed(() =>
  normalizeRouteParam(route.params.aspek_id as string | string[] | undefined)
)

const modulDisplayName = computed(() => {
  const modulRow = dashboardModulListRows.find((item) => item.id === modulId.value)
  return modulRow?.name ?? 'Monev Awal Pembelajaran'
})

const detailBundle = computed(() =>
  getDashboardModulAspekDummyDetail(modulId.value, aspekId.value)
)

const detailData = computed(() => detailBundle.value.detail)

const indicatorOptions = computed(() => detailBundle.value.indikatorOptions)
const objekEvaluasiOptions = computed(() => detailBundle.value.objekEvaluasiOptions)

const pageTitle = computed(() => {
  if (props.mode === 'create') return 'Tambah Aspek'
  if (props.mode === 'edit') return 'Edit Aspek'
  return 'Lihat Aspek'
})

const pageDescription = computed(() => {
  if (props.mode === 'detail') {
    return 'Gunakan halaman ini untuk melihat detail aspek evaluasi beserta indikator penilaiannya. Informasi yang ditampilkan mencakup nama, deskripsi, objek evaluasi, serta status integrasi sistem. Anda juga dapat melakukan pencarian, pengurutan, dan pengelolaan indikator sesuai kebutuhan.'
  }
  return 'Gunakan halaman ini untuk menambahkan aspek baru pada modul evaluasi. Aspek yang ditambahkan akan langsung terhubung ke modul dan tersedia pada periode evaluasi berikutnya.'
})

const formSectionTitle = computed(() => {
  if (props.mode === 'edit') return 'Edit Aspek'
  return 'Tambah Aspek'
})

const formHeading = computed(() => {
  if (props.mode === 'edit') return `Edit Aspek ${modulDisplayName.value}`
  return `Tambah Aspek ${modulDisplayName.value}`
})

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)
const proofDescriptionCount = computed(() => form.deskripsiSingkatBukti.length)

const aspekDetailPath = computed(() => {
  const encodedModulId = encodeURIComponent(modulId.value ?? '')
  const encodedAspekId = encodeURIComponent(aspekId.value ?? detailData.value.id)
  return `/dashboard/modul/${encodedModulId}/aspek/${encodedAspekId}`
})

const modulDetailPath = computed(() => {
  if (!modulId.value) return '/dashboard/modul'
  return `/dashboard/modul/${encodeURIComponent(modulId.value)}`
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const base: BreadcrumbItem[] = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Modul', to: '/dashboard/modul' },
    { label: modulDisplayName.value, to: modulDetailPath.value },
  ]

  if (props.mode === 'create') {
    return [...base, { label: 'Aspek' }, { label: 'Buat', active: true }]
  }

  if (props.mode === 'edit') {
    return [...base, { label: detailData.value.name, to: aspekDetailPath.value }, { label: 'Edit', active: true }]
  }

  return [...base, { label: detailData.value.name, active: true }]
})

const backPath = computed(() => {
  if (props.mode === 'edit') return aspekDetailPath.value
  return modulDetailPath.value
})

const filteredIndicatorRows = computed(() => {
  const sortedRows = sortDashboardModulAspekIndicatorRows(
    detailBundle.value.indikatorRows,
    indicatorSortOrder.value
  )
  const query = indicatorSearchQuery.value.trim().toLowerCase()

  if (!query) return sortedRows

  return sortedRows.filter((row) =>
    `${row.name} ${row.description} ${row.objekEvaluasi}`.toLowerCase().includes(query)
  )
})

const indicatorTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredIndicatorRows.value.length / indicatorPageSize))
)

const paginatedIndicatorRows = computed(() => {
  const start = (indicatorCurrentPage.value - 1) * indicatorPageSize
  return filteredIndicatorRows.value.slice(start, start + indicatorPageSize)
})

const indicatorShowingFrom = computed(() => {
  if (!filteredIndicatorRows.value.length) return 0
  return (indicatorCurrentPage.value - 1) * indicatorPageSize + 1
})

const indicatorShowingTo = computed(() => {
  return Math.min(indicatorCurrentPage.value * indicatorPageSize, filteredIndicatorRows.value.length)
})

function resetFormErrors() {
  formErrors.name = ''
  formErrors.description = ''
  formErrors.objekEvaluasi = ''
  formErrors.indikatorId = ''
  formErrors.deskripsiSingkatBukti = ''
}

function setupFormByMode() {
  const defaults = props.mode === 'edit'
    ? getDashboardModulAspekEditDefaultForm(modulId.value, aspekId.value)
    : getDashboardModulAspekCreateDefaultForm(modulId.value, aspekId.value)

  form.name = defaults.name
  form.description = defaults.description
  form.objekEvaluasi = defaults.objekEvaluasi
  form.dokumentasiBuktiLink = defaults.dokumentasiBuktiLink
  form.indikatorId = defaults.indikatorId
  form.deskripsiSingkatBukti = defaults.deskripsiSingkatBukti

  resetFormErrors()
}

function validateForm(): boolean {
  resetFormErrors()

  const trimmedName = form.name.trim()
  const trimmedDescription = form.description.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama aspek wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama aspek maksimal 100 karakter.'
  }

  if (!trimmedDescription) {
    formErrors.description = 'Deskripsi aspek wajib diisi.'
  } else if (trimmedDescription.length > descriptionLimit) {
    formErrors.description = 'Deskripsi aspek maksimal 100 karakter.'
  }

  if (!form.indikatorId.trim()) {
    formErrors.indikatorId = 'Pilih indikator evaluasi.'
  }

  if (props.mode === 'edit') {
    if (!form.objekEvaluasi.trim()) {
      formErrors.objekEvaluasi = 'Objek evaluasi wajib dipilih.'
    }
    if (form.deskripsiSingkatBukti.trim().length > proofDescriptionLimit) {
      formErrors.deskripsiSingkatBukti = 'Deskripsi singkat bukti maksimal 100 karakter.'
    }
  }

  return (
    !formErrors.name
    && !formErrors.description
    && !formErrors.objekEvaluasi
    && !formErrors.indikatorId
    && !formErrors.deskripsiSingkatBukti
  )
}

function toggleDetailSection(section: 'informasiAspek' | 'indikatorEvaluasi') {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

async function submitForm() {
  if (!validateForm()) return

  if (props.mode === 'edit') {
    await navigateTo(aspekDetailPath.value)
    return
  }

  const encodedModulId = encodeURIComponent(modulId.value ?? '')
  const nextAspekId = encodeURIComponent(detailData.value.id)
  await navigateTo(`/dashboard/modul/${encodedModulId}/aspek/${nextAspekId}`)
}

async function openEditAspek() {
  await navigateTo(`${aspekDetailPath.value}/edit`)
}

watch([indicatorSearchQuery, indicatorSortOrder], () => {
  indicatorCurrentPage.value = 1
})

watch(indicatorTotalPages, (nextTotalPages) => {
  if (indicatorCurrentPage.value > nextTotalPages) {
    indicatorCurrentPage.value = nextTotalPages
  }
})

watch(
  [() => props.mode, modulId, aspekId],
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

    <template v-if="props.mode === 'create' || props.mode === 'edit'">
      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.45rem,1.9vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          {{ formSectionTitle }}
        </h2>

        <div class="mt-6 flex justify-center">
          <form
            class="w-full max-w-[980px] rounded-[16px] border-2 border-dashed border-[#d3d8e1] bg-[#f8f8f8] px-5 py-6 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
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
                  placeholder="Masukkan deskripsi di sini"
                  class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                />
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.description" class="text-[#d70000]">{{ formErrors.description }}</span>
                </div>
              </div>

              <div v-if="props.mode === 'edit'" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Objek Evaluasi
                  </label>
                  <label class="relative mt-2 block">
                    <select
                      v-model="form.objekEvaluasi"
                      class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                    >
                      <option value="">Pilih Objek Evaluasi</option>
                      <option
                        v-for="option in objekEvaluasiOptions"
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
                  <p class="mt-1 text-[0.95rem] text-[#95a0b1]">
                    Tidak menemukan objek dan indikator evaluasi?
                    <NuxtLink to="/dashboard/lingkup/create" class="text-[#e30000] underline">Buat di sini</NuxtLink>
                  </p>
                  <p v-if="formErrors.objekEvaluasi" class="mt-1 text-[0.95rem] text-[#d70000]">
                    {{ formErrors.objekEvaluasi }}
                  </p>
                </div>

                <div>
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Link Dokumentasi Bukti
                  </label>
                  <input
                    v-model="form.dokumentasiBuktiLink"
                    type="text"
                    placeholder="Masukkan link dokumentasi bukti di sini"
                    class="mt-2 h-12 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                  >
                  <p class="mt-1 text-[0.95rem] text-[#95a0b1]">
                    Berisi dokumentasi format pengisian bukti
                  </p>
                </div>
              </div>

              <div>
                <p class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Pilih Indikator Evaluasi
                </p>

                <div class="mt-2 flex flex-wrap items-center gap-5">
                  <label
                    v-for="option in indicatorOptions"
                    :key="option.id"
                    class="inline-flex cursor-pointer items-center gap-2"
                  >
                    <input
                      v-model="form.indikatorId"
                      :value="option.id"
                      type="radio"
                      class="h-4 w-4 border-[#c9ced7] text-[#e30000] focus:ring-[#e30000]"
                    >
                    <span
                      class="text-[1rem]"
                      :class="form.indikatorId === option.id ? 'font-semibold text-[#e30000]' : 'text-[#5f6877]'"
                    >
                      {{ option.label }}
                    </span>
                  </label>
                </div>

                <p class="mt-2 text-[0.95rem] text-[#95a0b1]">
                  Pilih satu indikator yang paling relevan untuk aspek ini.
                </p>
                <p v-if="formErrors.indikatorId" class="mt-1 text-[0.95rem] text-[#d70000]">
                  {{ formErrors.indikatorId }}
                </p>
              </div>

              <div v-if="props.mode === 'edit'">
                <div class="flex items-center justify-between">
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Deskripsi Singkat Bukti
                  </label>
                  <span class="text-[0.875rem] text-[#95a0b1]">{{ proofDescriptionCount }}/100</span>
                </div>
                <textarea
                  v-model="form.deskripsiSingkatBukti"
                  maxlength="100"
                  rows="4"
                  placeholder="Masukkan deskripsi singkat bukti di sini"
                  class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                />
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.deskripsiSingkatBukti" class="text-[#d70000]">
                    {{ formErrors.deskripsiSingkatBukti }}
                  </span>
                </div>
              </div>

              <p v-if="props.mode === 'create'" class="text-center text-[1rem] text-[#6f788a]">
                Tidak menemukan Unit evaluasi?
                <NuxtLink to="/dashboard/lingkup/create" class="text-[#1e63e8] underline">Buat di sini</NuxtLink>
              </p>
            </div>

            <div
              class="mt-5 rounded-[12px] border px-4 py-3 text-[1rem] leading-relaxed"
              :class="props.mode === 'edit'
                ? 'border-[#f2a5a5] bg-[#fff0f0] text-[#d02121]'
                : 'border-[#f2a5a5] bg-[#fff0f0] text-[#d02121]'"
            >
              <strong>Catatan:</strong>
              <template v-if="props.mode === 'edit'">
                Perubahan pada aspek akan langsung diterapkan dan terlihat pada periode evaluasi aktif.
              </template>
              <template v-else>
                Aspek yang ditambahkan akan langsung terhubung ke modul dan tersedia pada periode evaluasi berikutnya.
              </template>
            </div>

            <p class="mt-3 inline-flex items-center gap-2 text-[0.875rem] text-[#9aa3b2]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              Terakhir disimpan: {{ detailData.lastSavedAt }}
            </p>

            <div class="mt-7 flex justify-center">
              <button
                type="submit"
                class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[20px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
              >
                {{ props.mode === 'edit' ? 'Edit' : 'Tambah' }}
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
            @click="toggleDetailSection('informasiAspek')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Informasi Aspek
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.informasiAspek ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.informasiAspek" class="border-t border-[#e3e7ee] px-6 py-6">
            <dl class="space-y-5">
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Nama Aspek</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.name }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.description }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Modul</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.modulName }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Objek Evaluasi</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.objekEvaluasi }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Lingkup Evaluasi</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.lingkupEvaluasi }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
                <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Terhubung Ke GreatSystem</dt>
                <dd class="text-[1.25rem] text-[#2b3340]">{{ detailData.greatSystemStatus }}</dd>
              </div>
            </dl>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
              <button
                type="button"
                class="rounded-[14px] bg-[#e30000] px-6 py-2 text-[1.25rem] font-semibold text-white transition hover:bg-[#c90000]"
                @click="openEditAspek"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-[14px] bg-[#c9ced7] px-6 py-2 text-[1.25rem] font-semibold text-[#0f172a] transition hover:bg-[#b8bfcb]"
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
            @click="toggleDetailSection('indikatorEvaluasi')"
          >
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
              Daftar Indikator Evaluasi
            </h2>
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="detailSectionOpen.indikatorEvaluasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-if="detailSectionOpen.indikatorEvaluasi" class="border-t border-[#e3e7ee] px-6 py-6">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label class="relative block w-full md:max-w-[400px]">
                <input
                  v-model="indicatorSearchQuery"
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
                  v-model="indicatorSortOrder"
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
                    <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Objek Evaluasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in paginatedIndicatorRows"
                    :key="row.id"
                    class="border-t border-[#e8edf3]"
                  >
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                      {{ indicatorShowingFrom + index }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                      {{ row.name }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.description }}
                    </td>
                    <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                      {{ row.objekEvaluasi }}
                    </td>
                  </tr>

                  <tr v-if="paginatedIndicatorRows.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                      Data indikator evaluasi tidak ditemukan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
              <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
                Menampilkan <strong>{{ indicatorShowingFrom }}-{{ indicatorShowingTo }}</strong> dari <strong>{{ filteredIndicatorRows.length }}</strong> data
              </p>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="indicatorCurrentPage === 1"
                  @click="indicatorCurrentPage = Math.max(1, indicatorCurrentPage - 1)"
                >
                  Previous
                </button>

                <button
                  type="button"
                  class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
                >
                  {{ indicatorCurrentPage }}
                </button>

                <button
                  type="button"
                  class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="indicatorCurrentPage === indicatorTotalPages"
                  @click="indicatorCurrentPage = Math.min(indicatorTotalPages, indicatorCurrentPage + 1)"
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
