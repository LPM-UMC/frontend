<template>
  <div>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section
      class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>{{ $t('manajemenPeriode.breadcrumb.home') }}</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">{{ $t('manajemenPeriode.judul') }}</span>
      </div>

      <div v-if="!periodeAktif"
        class="rounded-[14px] border border-[#e3e4e8] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5 md:p-6">
        <div class="mb-5 flex items-center gap-2.5">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7e9] text-[#e1121b]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z" />
            </svg>
          </span>
          <h1 class="text-[20px] font-semibold leading-tight text-[#2b2f36] sm:text-[22px]">
            {{ $t('manajemenPeriode.create.judul') }}
          </h1>
        </div>

        <form @submit.prevent="submitCreate">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.create.form.periode') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="createForm.tahun_ajaran" type="text"
                :placeholder="$t('manajemenPeriode.create.placeholder.periode')"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.create.form.tanggalMulai') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="createForm.tanggal_mulai" type="date"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.create.form.tanggalSelesai') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="createForm.tanggal_selesai" type="date"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.create.form.semester') }} <span class="text-[#e1121b]">*</span>
              </span>
              <select v-model="createForm.semester"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
                <option v-for="semester in semesterOptions" :key="semester" :value="semester">
                  {{ semester }}
                </option>
              </select>
            </label>
          </div>

          <div class="mt-5">
            <p class="mb-2 text-[13px] font-medium text-[#4a515d]">{{ $t('manajemenPeriode.upload.judul') }}</p>
            <div class="rounded-[12px] border border-[#dfe2e8] bg-[#fafbfc] p-4 sm:p-5"
              :class="isDragActive ? 'border-[#e1121b]' : ''" @dragover.prevent="isDragActive = true"
              @dragleave="onDragLeave" @drop.prevent="onFileDrop">
              <input ref="fileInputRef" type="file" accept=".pdf,application/pdf" class="hidden"
                @change="onFileInputChange">

              <div
                class="flex min-h-[180px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#d0d5dd] bg-white px-4 py-6 text-center sm:min-h-[210px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 h-11 w-11 text-[#9ca3af]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
                </svg>

                <p class="text-[13px] text-[#4b5563]">
                  {{ $t('manajemenPeriode.upload.hintDragDrop') }}
                </p>
                <p class="mt-1 text-[12px] text-[#9ca3af]">
                  {{ $t('manajemenPeriode.upload.hintMaksimal') }}
                </p>

                <button type="button"
                  class="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] bg-[#e1121b] px-4 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                  @click="triggerFilePicker">
                  {{ $t('manajemenPeriode.upload.tombolBrowse') }}
                </button>

                <p v-if="selectedFile" class="mt-3 text-[12px] font-medium text-[#2f3744]">
                  {{ selectedFile.name }} ({{ Math.max(1, Math.round(selectedFile.size / 1024)) }} KB)
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button type="submit"
              class="cursor-pointer inline-flex h-10 items-center justify-center rounded-full bg-[#e1121b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#cc0f17]">
              {{ $t('manajemenPeriode.create.tombol') }}
            </button>
          </div>
        </form>
      </div>


      <div v-else
        class="rounded-[14px] border border-[#e3e4e8] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5 md:p-6">
        <div class="mb-5 flex items-center gap-2.5">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7e9] text-[#e1121b]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z" />
            </svg>
          </span>
          <h1 class="text-[20px] font-semibold leading-tight text-[#2b2f36] sm:text-[22px]">
            {{ $t('manajemenPeriode.update.judul') }}
          </h1>
        </div>

        <form @submit.prevent="submitUpdate">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.update.form.periode') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="updateForm.tahun_ajaran" type="text"
                :placeholder="$t('manajemenPeriode.update.placeholder.periode')" disabled
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-gray-100 px-3 text-[13px] text-[#2f3744] outline-none cursor-not-allowed">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.update.form.tanggalMulai') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="updateForm.tanggal_mulai" type="date"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.update.form.tanggalSelesai') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="updateForm.tanggal_selesai" type="date"
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-[13px] font-medium text-[#4a515d]">
                {{ $t('manajemenPeriode.update.form.semester') }} <span class="text-[#e1121b]">*</span>
              </span>
              <input v-model="updateForm.semester" type="text" disabled
                class="h-11 rounded-[10px] border border-[#d8dbe2] bg-gray-100 px-3 text-[13px] text-[#2f3744] outline-none cursor-not-allowed">
            </label>
          </div>

          <div class="mt-5">
            <p class="mb-2 text-[13px] font-medium text-[#4a515d]">{{ $t('manajemenPeriode.upload.judul') }}</p>
            <div class="rounded-[12px] border border-[#dfe2e8] bg-[#fafbfc] p-4 sm:p-5"
              :class="isDragActive ? 'border-[#e1121b]' : ''" @dragover.prevent="isDragActive = true"
              @dragleave="onDragLeave" @drop.prevent="onFileDrop">
              <input ref="fileInputRef" type="file" accept=".pdf,application/pdf" class="hidden"
                @change="onFileInputChange">

              <div
                class="flex min-h-[180px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#d0d5dd] bg-white px-4 py-6 text-center sm:min-h-[210px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 h-11 w-11 text-[#9ca3af]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
                </svg>

                <p class="text-[13px] text-[#4b5563]">
                  {{ $t('manajemenPeriode.upload.hintDragDrop') }}
                </p>
                <p class="mt-1 text-[12px] text-[#9ca3af]">
                  {{ $t('manajemenPeriode.upload.hintMaksimal') }}
                </p>

                <button type="button"
                  class="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] bg-[#e1121b] px-4 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                  @click="triggerFilePicker">
                  {{ $t('manajemenPeriode.upload.tombolBrowse') }}
                </button>

                <p v-if="selectedFile" class="mt-3 text-[12px] font-medium text-[#2f3744]">
                  {{ selectedFile.name }} ({{ Math.max(1, Math.round(selectedFile.size / 1024)) }} KB)
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 mt-4 justify-end">
            <button
              class="cursor-pointer inline-flex h-10 items-center justify-center rounded-full bg-gray-600 hover:bg-gray-800 px-5 text-[13px] font-semibold text-white transition"
              type="button" @click="nonaktifkanPeriode">
              {{ $t('manajemenPeriode.update.tombolNonaktif') }}
            </button>

            <button
              class="cursor-pointer inline-flex h-10 items-center justify-center rounded-full bg-[#e1121b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#cc0f17]"
              type="submit">
              {{ $t('manajemenPeriode.update.tombolUpdate') }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="mt-5 rounded-[14px] border border-[#e3e4e8] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5 md:p-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7e9] text-[#e1121b]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m3 4.5 9 9 9-9M4.5 19h15" />
              </svg>
            </span>
            <h2 class="text-[20px] font-semibold leading-tight text-[#2b2f36] sm:text-[22px]">
              {{ $t('manajemenPeriode.list.judul') }}
            </h2>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input v-model="search" type="text" :placeholder="$t('manajemenPeriode.list.searchPlaceholder')"
              class="h-9 w-full rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] sm:w-[200px]">

            <select v-model="sortOrder"
              class="h-9 w-full rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] sm:w-[150px]">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto rounded-[10px] border border-[#e5e7eb]">
          <table class="min-w-[760px] w-full border-collapse text-left text-[13px]">
            <thead class="bg-[#f8f9fb] text-[#525866]">
              <tr>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.no') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.tahun') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.semester') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.tanggalMulai') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.tanggalSelesai') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.status') }}</th>
                <th class="px-3 py-2.5 font-semibold">{{ $t('manajemenPeriode.list.tabel.kalender') }}</th>
              </tr>
            </thead>

            <tbody class="bg-white text-[#2f3744]">
              <tr v-for="(item, index) in pagedCalendars" :key="item.id" class="border-t border-[#eef0f4]">
                <td class="px-3 py-2.5">{{ rowStartIndex + index + 1 }}</td>
                <td class="px-3 py-2.5">{{ item.period }}</td>
                <td class="px-3 py-2.5">{{ item.semester }}</td>
                <td class="px-3 py-2.5">{{ item.startDate }}</td>
                <td class="px-3 py-2.5">{{ item.endDate }}</td>
                <td class="px-3 py-2.5">{{ item.status }}</td>
                <td class="px-3 py-2.5">
                  <button type="button" @click.prevent="downloadKalender(item.id)"
                    class="inline-flex h-7 items-center justify-center rounded-full bg-[#e1121b] px-3 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]">
                    {{ $t('manajemenPeriode.list.tabel.tombolDownload') }}
                  </button>
                </td>
              </tr>

              <tr v-if="pagedCalendars.length === 0">
                <td colspan="7" class="px-3 py-8 text-center text-[#7a8190]">
                  {{ $t('manajemenPeriode.list.tabel.kosong') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-3 flex flex-col gap-3 text-[12px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {{ $t('manajemenPeriode.list.pagination.info', { shownFrom, shownTo, totalItems }) }}
          </p>

          <div class="flex items-center gap-1.5">
            <button type="button"
              class="rounded-[7px] border border-[#d9dde5] px-2.5 py-1.5 transition hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
              {{ $t('manajemenPeriode.list.pagination.tombolSebelumnya') }}
            </button>

            <button v-for="page in pageNumbers" :key="page" type="button"
              class="h-7 min-w-7 rounded-[7px] border px-2 text-center transition" :class="page === currentPage
                ? 'border-[#e1121b] bg-[#e1121b] text-white'
                : 'border-[#d9dde5] text-[#374151] hover:bg-[#f6f7f9]'" @click="goToPage(page)">
              {{ page }}
            </button>

            <button type="button"
              class="rounded-[7px] border border-[#d9dde5] px-2.5 py-1.5 transition hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
              {{ $t('manajemenPeriode.list.pagination.tombolSelanjutnya') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useApi } from '#composables/useApi'
import { useRuntimeConfig, useI18n } from '#imports'
import type { PeriodeResponse } from '#types/periode'

definePageMeta({
  layout: 'manajemen-periode',
})

const { apiFetch } = useApi()
const toast = useToast()
const { t } = useI18n()
const config = useRuntimeConfig()

// State
const isLoading = ref(false)
const periodes = ref<PeriodeResponse[]>([])
const totalItems = ref(0)
const totalPages = ref(1)

// Pagination & Filter
const page = ref(1)
const size = ref(10)
const sortOrder = ref<'asc' | 'desc'>('asc')
const search = ref('')

const fetchPeriodes = async () => {
  try {
    isLoading.value = true
    const res = await apiFetch<{ data: PeriodeResponse[], meta: any }>(`/api/periode?page=${page.value}&size=${size.value}&order=${sortOrder.value}&search=${search.value}`)
    periodes.value = res.data
    totalItems.value = res.meta.total
    totalPages.value = res.meta.total_pages
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}

const periodeAktif = ref<PeriodeResponse | null>(null)
const fetchPeriodeAktif = async () => {
  try {
    const res = await apiFetch<{ data: PeriodeResponse | null }>('/api/periode/aktif')
    periodeAktif.value = res.data
    if (res.data) {
      updateForm.tahun_ajaran = res.data.tahun_ajaran
      updateForm.semester = res.data.semester
      updateForm.tanggal_mulai = res.data.tanggal_mulai?.split('T')[0] || ''
      updateForm.tanggal_selesai = res.data.tanggal_selesai?.split('T')[0] || ''
    }
  } catch (err) {
    // Ignore error
  }
}

watch([page, sortOrder, search], () => {
  fetchPeriodes()
})

onMounted(() => {
  fetchPeriodes()
  fetchPeriodeAktif()
})

/* =========================
 * FORM CREATE
 * ========================= */

const createForm = reactive({
  tahun_ajaran: '',
  semester: 'GANJIL',
  tanggal_mulai: '',
  tanggal_selesai: '',
})

/* =========================
 * FORM UPDATE
 * ========================= */

const updateForm = reactive({
  tahun_ajaran: '',
  semester: 'GANJIL',
  tanggal_mulai: '',
  tanggal_selesai: '',
})

/* =========================
 * FILE
 * ========================= */

const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)

const triggerFilePicker = () => fileInputRef.value?.click()
const onFileInputChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) selectedFile.value = file
}
const onFileDrop = (e: DragEvent) => {
  isDragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) selectedFile.value = file
}
const onDragLeave = () => {
  isDragActive.value = false
}

/* =========================
 * OPTIONS
 * ========================= */

const semesterOptions = ['GANJIL', 'GENAP']
const sortOptions = computed(() => [
  { label: t('manajemenPeriode.list.sorting.terlama'), value: 'asc' },
  { label: t('manajemenPeriode.list.sorting.terbaru'), value: 'desc' },
])

/* =========================
 * PAGINATION
 * ========================= */

const pagedCalendars = computed(() => {
  return periodes.value.map(item => ({
    id: item.id,
    period: item.tahun_ajaran,
    semester: item.semester,
    startDate: item.tanggal_mulai?.split('T')[0],
    endDate: item.tanggal_selesai?.split('T')[0],
    status: item.is_aktif ? t('manajemenPeriode.list.tabel.statusAktif') : t('manajemenPeriode.list.tabel.statusSelesai'),
  }))
})

const currentPage = computed(() => page.value)
const rowStartIndex = computed(() => (page.value - 1) * size.value)
const shownFrom = computed(() => totalItems.value === 0 ? 0 : rowStartIndex.value + 1)
const shownTo = computed(() => Math.min(rowStartIndex.value + size.value, totalItems.value))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const goToPage = (targetPage: number) => {
  if (targetPage >= 1 && targetPage <= totalPages.value) {
    page.value = targetPage
  }
}

/* =========================
 * ACTIONS
 * ========================= */

const submitCreate = async () => {
  if (!selectedFile.value) {
    toast.add({ title: 'Error', description: 'File kalender wajib diupload', color: 'error' })
    return
  }
  
  try {
    isLoading.value = true
    const fd = new FormData()
    fd.append('tahun_ajaran', createForm.tahun_ajaran)
    fd.append('semester', createForm.semester)
    fd.append('tanggal_mulai', createForm.tanggal_mulai)
    fd.append('tanggal_selesai', createForm.tanggal_selesai)
    fd.append('file_kalender', selectedFile.value)

    await apiFetch('/api/periode', {
      method: 'POST',
      body: fd,
    })
    
    toast.add({ title: 'Sukses', description: 'Periode berhasil dibuat', color: 'success' })
    createForm.tahun_ajaran = ''
    createForm.tanggal_mulai = ''
    createForm.tanggal_selesai = ''
    selectedFile.value = null
    fetchPeriodes()
    fetchPeriodeAktif()
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}

const submitUpdate = async () => {
  if (!periodeAktif.value) return
  try {
    isLoading.value = true
    const fd = new FormData()
    fd.append('tanggal_mulai', updateForm.tanggal_mulai)
    fd.append('tanggal_selesai', updateForm.tanggal_selesai)
    if (selectedFile.value) {
      fd.append('file_kalender', selectedFile.value)
    }

    await apiFetch(`/api/periode/${periodeAktif.value.id}`, {
      method: 'PATCH',
      body: fd,
    })
    
    toast.add({ title: 'Sukses', description: 'Periode berhasil diupdate', color: 'success' })
    selectedFile.value = null
    fetchPeriodes()
    fetchPeriodeAktif()
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}

const nonaktifkanPeriode = async () => {
  if (!periodeAktif.value) return
  if (!confirm('Apakah Anda yakin ingin menonaktifkan periode ini?')) return
  
  try {
    isLoading.value = true
    await apiFetch(`/api/periode/${periodeAktif.value.id}/nonaktifkan`, {
      method: 'PUT',
    })
    toast.add({ title: 'Sukses', description: 'Periode berhasil dinonaktifkan', color: 'success' })
    fetchPeriodes()
    fetchPeriodeAktif()
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
  } finally {
    isLoading.value = false
  }
}

const downloadKalender = async (id: string) => {
  try {
    isLoading.value = true
    const response = await apiFetch<Blob>(`/api/periode/${id}/kalender/download`, {
      method: 'GET',
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    link.download = `kalender-akademik.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    toast.add({ title: 'Error', description: 'Gagal mendownload kalender', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>
