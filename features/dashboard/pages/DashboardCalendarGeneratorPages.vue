<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCalendarGeneratorRepository } from '../composables/useCalendarGeneratorRepository'
import type {
  CalendarGeneratorCreateInput,
  CalendarGeneratorEntry,
  CalendarSemester,
  CalendarSortOrder,
} from '../types/calendarGenerator'

interface FeedbackState {
  type: 'success' | 'error'
  message: string
}

const pageSize = 5
const maxFileSizeBytes = 5 * 1024 * 1024

const periodOptions = ['2020/2021', '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026']
const semesterOptions: CalendarSemester[] = ['Ganjil', 'Genap']
const sortOptions: Array<{ label: string; value: CalendarSortOrder }> = [
  { label: 'Terbaru', value: 'latest' },
  { label: 'Terlama', value: 'oldest' },
]
const repository = useCalendarGeneratorRepository('auto')

const form = ref({
  period: '2024/2025',
  startDate: '',
  endDate: '',
  semester: 'Ganjil' as CalendarSemester,
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const calendars = ref<CalendarGeneratorEntry[]>([])
const sortOrder = ref<CalendarSortOrder>('latest')
const currentPage = ref(1)
const isDragActive = ref(false)
const feedback = ref<FeedbackState | null>(null)

async function loadCalendars() {
  calendars.value = await repository.getCalendars()
}

const sortedCalendars = computed(() => {
  const cloned = [...calendars.value]
  cloned.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return sortOrder.value === 'latest' ? bTime - aTime : aTime - bTime
  })
  return cloned
})

const totalItems = computed(() => sortedCalendars.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))

const pagedCalendars = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedCalendars.value.slice(start, start + pageSize)
})

const rowStartIndex = computed(() => (currentPage.value - 1) * pageSize)
const shownFrom = computed(() => (totalItems.value ? rowStartIndex.value + 1 : 0))
const shownTo = computed(() =>
  Math.min(rowStartIndex.value + pageSize, totalItems.value)
)

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1)
)

watch(sortOrder, () => {
  currentPage.value = 1
})

watch(totalPages, (next) => {
  if (currentPage.value > next) {
    currentPage.value = next
  }
})

function setFeedback(type: FeedbackState['type'], message: string) {
  feedback.value = { type, message }
}

function clearFeedback() {
  feedback.value = null
}

function triggerFilePicker() {
  fileInputRef.value?.click()
}

function onDragLeave() {
  isDragActive.value = false
}

function setFile(file: File | null) {
  if (!file) return

  const fileNameLower = file.name.toLowerCase()
  const isPdf =
    file.type === 'application/pdf' ||
    fileNameLower.endsWith('.pdf')

  if (!isPdf) {
    setFeedback('error', 'File harus berformat PDF.')
    return
  }

  if (file.size > maxFileSizeBytes) {
    setFeedback('error', 'Ukuran file maksimal 5 MB.')
    return
  }

  selectedFile.value = file
  setFeedback('success', `File dipilih: ${file.name}`)
}

function onFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  setFile(file)
}

function onFileDrop(event: DragEvent) {
  isDragActive.value = false
  const file = event.dataTransfer?.files?.[0] ?? null
  setFile(file)
}

function resetForm() {
  form.value = {
    period: '2024/2025',
    startDate: '',
    endDate: '',
    semester: 'Ganjil',
  }

  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function submitCalendar() {
  clearFeedback()

  if (!form.value.period || !form.value.startDate || !form.value.endDate) {
    setFeedback('error', 'Periode, tanggal mulai, dan tanggal selesai wajib diisi.')
    return
  }

  if (form.value.startDate > form.value.endDate) {
    setFeedback('error', 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.')
    return
  }

  if (!selectedFile.value) {
    setFeedback('error', 'Silakan pilih file PDF kalender terlebih dahulu.')
    return
  }

  const payload: CalendarGeneratorCreateInput = {
    period: form.value.period,
    semester: form.value.semester,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    file: selectedFile.value,
  }

  const created = await repository.createCalendar(payload)
  if (!created) {
    setFeedback('error', 'Gagal membuat kalender. Silakan coba lagi.')
    return
  }

  await loadCalendars()
  currentPage.value = 1
  setFeedback('success', `Kalender berhasil dibuat (${repository.resolvedSource.value}).`)
  resetForm()
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > totalPages.value) return
  currentPage.value = nextPage
}

onMounted(() => {
  loadCalendars()
})
</script>

<template>
  <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
    <div
      class="h-full w-full bg-repeat-x bg-top"
      style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
    />
  </div>

  <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
      <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
        </svg>
        <span>Home</span>
      </NuxtLink>
      <span>/</span>
      <span class="font-semibold text-[#e1121b]">Kalender Akademik</span>
    </div>

    <div class="rounded-[14px] border border-[#e3e4e8] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5 md:p-6">
      <div class="mb-5 flex items-center gap-2.5">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7e9] text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z" />
          </svg>
        </span>
        <h1 class="text-[20px] font-semibold leading-tight text-[#2b2f36] sm:text-[22px]">
          Tambah Kalender Baru
        </h1>
      </div>

      <div
        v-if="feedback"
        class="mb-4 rounded-[10px] border px-3 py-2 text-[13px]"
        :class="feedback.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-rose-200 bg-rose-50 text-rose-700'"
      >
        {{ feedback.message }}
      </div>

      <form @submit.prevent="submitCalendar">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Periode <span class="text-[#e1121b]">*</span></span>
            <select
              v-model="form.period"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]"
            >
              <option v-for="period in periodOptions" :key="period" :value="period">
                {{ period }}
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Mulai <span class="text-[#e1121b]">*</span></span>
            <input
              v-model="form.startDate"
              type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]"
            >
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Selesai <span class="text-[#e1121b]">*</span></span>
            <input
              v-model="form.endDate"
              type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]"
            >
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Semester <span class="text-[#e1121b]">*</span></span>
            <select
              v-model="form.semester"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]"
            >
              <option v-for="semester in semesterOptions" :key="semester" :value="semester">
                {{ semester }}
              </option>
            </select>
          </label>
        </div>

        <div class="mt-5">
          <p class="mb-2 text-[13px] font-medium text-[#4a515d]">Upload PDF Kalender</p>
          <div
            class="rounded-[12px] border border-[#dfe2e8] bg-[#fafbfc] p-4 sm:p-5"
            :class="isDragActive ? 'border-[#e1121b]' : ''"
            @dragover.prevent="isDragActive = true"
            @dragleave="onDragLeave"
            @drop.prevent="onFileDrop"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".pdf,application/pdf"
              class="hidden"
              @change="onFileInputChange"
            >

            <div class="flex min-h-[180px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#d0d5dd] bg-white px-4 py-6 text-center sm:min-h-[210px]">
              <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 h-11 w-11 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
              </svg>

              <p class="text-[13px] text-[#4b5563]">
                Drag and drop your PDF here, or click to browse
              </p>
              <p class="mt-1 text-[12px] text-[#9ca3af]">
                Supports PDF files up to 5 MB
              </p>

              <button
                type="button"
                class="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] bg-[#e1121b] px-4 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                @click="triggerFilePicker"
              >
                Browse Files
              </button>

              <p v-if="selectedFile" class="mt-3 text-[12px] font-medium text-[#2f3744]">
                {{ selectedFile.name }} ({{ Math.max(1, Math.round(selectedFile.size / 1024)) }} KB)
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            type="submit"
            class="inline-flex h-10 items-center justify-center rounded-full bg-[#e1121b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#cc0f17]"
          >
            Buat Kalender
          </button>
        </div>
      </form>
    </div>

    <div class="mt-5 rounded-[14px] border border-[#e3e4e8] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5 md:p-6">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7e9] text-[#e1121b]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m3 4.5 9 9 9-9M4.5 19h15" />
            </svg>
          </span>
          <h2 class="text-[20px] font-semibold leading-tight text-[#2b2f36] sm:text-[22px]">
            Daftar Kalender
          </h2>
        </div>

        <select
          v-model="sortOrder"
          class="h-9 w-full rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] sm:w-[150px]"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="overflow-x-auto rounded-[10px] border border-[#e5e7eb]">
        <table class="min-w-[760px] w-full border-collapse text-left text-[13px]">
          <thead class="bg-[#f8f9fb] text-[#525866]">
            <tr>
              <th class="px-3 py-2.5 font-semibold">No</th>
              <th class="px-3 py-2.5 font-semibold">Tahun</th>
              <th class="px-3 py-2.5 font-semibold">Semester</th>
              <th class="px-3 py-2.5 font-semibold">Tanggal Mulai</th>
              <th class="px-3 py-2.5 font-semibold">Tanggal Selesai</th>
              <th class="px-3 py-2.5 font-semibold">Kalender</th>
            </tr>
          </thead>

          <tbody class="bg-white text-[#2f3744]">
            <tr v-for="(item, index) in pagedCalendars" :key="item.id" class="border-t border-[#eef0f4]">
              <td class="px-3 py-2.5">{{ rowStartIndex + index + 1 }}</td>
              <td class="px-3 py-2.5">{{ item.period }}</td>
              <td class="px-3 py-2.5">{{ item.semester }}</td>
              <td class="px-3 py-2.5">{{ item.startDate }}</td>
              <td class="px-3 py-2.5">{{ item.endDate }}</td>
              <td class="px-3 py-2.5">
                <a
                  :href="item.fileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-7 items-center justify-center rounded-full bg-[#e1121b] px-3 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                >
                  Lihat
                </a>
              </td>
            </tr>

            <tr v-if="pagedCalendars.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-[#7a8190]">
                Belum ada data kalender.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex flex-col gap-3 text-[12px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Menampilkan {{ shownFrom }}-{{ shownTo }} dari {{ totalItems }} data
        </p>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="rounded-[7px] border border-[#d9dde5] px-2.5 py-1.5 transition hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            class="h-7 min-w-7 rounded-[7px] border px-2 text-center transition"
            :class="page === currentPage
              ? 'border-[#e1121b] bg-[#e1121b] text-white'
              : 'border-[#d9dde5] text-[#374151] hover:bg-[#f6f7f9]'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            type="button"
            class="rounded-[7px] border border-[#d9dde5] px-2.5 py-1.5 transition hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
