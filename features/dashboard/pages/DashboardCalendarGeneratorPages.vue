<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue"
import { usePeriodeStore } from "#stores/periode"
import { useI18n } from "vue-i18n"

definePageMeta({
  layout: "manajemen-user-role",
  requiresAuth: true,
})

// ================= INIT =================
const periodeStore = usePeriodeStore()
const { locale } = useI18n()
const toast = useToast()
const config = useRuntimeConfig()

// ================= STATE =================

// ✅ CREATE FORM
const createForm = reactive({
  tahun_ajaran: "",
  semester: "GANJIL",
  tanggal_mulai: "",
  tanggal_selesai: "",
})

// ✅ UPDATE FORM
const updateForm = reactive({
  tahun_ajaran: "",
  semester: "GANJIL",
  tanggal_mulai: "",
  tanggal_selesai: "",
})

const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)

// ================= TABLE =================
const page = ref(1)
const size = ref(10)
const sortOrder = ref<"asc" | "desc">("asc")

// ✅ SORT OPTIONS
const sortOptions = [
  { label: "Terlama", value: "asc" },
  { label: "Terbaru", value: "desc" },
]

// ================= OPTIONS =================
const semesterOptions = ["GANJIL", "GENAP"]

// ================= FETCH =================
const fetchData = async () => {
  await periodeStore.fetchPeriodes(locale.value as any, {
    page: page.value,
    size: size.value,
    order: sortOrder.value,
  })
}

// ================= INIT LOAD =================
onMounted(async () => {
  try {
    await Promise.all([
      periodeStore.fetchPeriodeAktif(locale.value as any),
      fetchData(),
    ])

    // isi update form
    if (periodeStore.periodeAktif) {
      const p = periodeStore.periodeAktif

      updateForm.tahun_ajaran = p.tahun_ajaran
      updateForm.semester = p.semester.toUpperCase()
      updateForm.tanggal_mulai = p.tanggal_mulai?.slice(0, 10) || ""
      updateForm.tanggal_selesai = p.tanggal_selesai?.slice(0, 10) || ""
    }
  } catch {}
})

// ================= WATCH =================
watch([page, sortOrder], fetchData)

let isInitialized = false

watch(
  () => periodeStore.periodeAktif,
  (p) => {
    if (!p || isInitialized) return

    updateForm.tahun_ajaran = p.tahun_ajaran
    updateForm.semester = p.semester.toUpperCase()
    updateForm.tanggal_mulai = p.tanggal_mulai?.slice(0, 10) || ""
    updateForm.tanggal_selesai = p.tanggal_selesai?.slice(0, 10) || ""

    isInitialized = true
  },
  { immediate: true }
)

// ================= FILE =================
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

// ================= CREATE =================
const submitCreate = async () => {
  try {
    if (
      !createForm.tahun_ajaran ||
      !createForm.tanggal_mulai ||
      !createForm.tanggal_selesai
    ) {
      throw new Error("Lengkapi semua field")
    }

    if (!selectedFile.value) {
      throw new Error("File kalender wajib diupload")
    }

    await periodeStore.createPeriode(locale.value as any, {
      tahun_ajaran: createForm.tahun_ajaran,
      semester: createForm.semester as any,
      tanggal_mulai: createForm.tanggal_mulai,
      tanggal_selesai: createForm.tanggal_selesai,
      file_kalender: selectedFile.value,
    })

    toast.add({
      title: "Berhasil",
      description: "Periode berhasil dibuat",
      color: "success",
    })

    // ✅ RESET INIT supaya watcher jalan lagi
    isInitialized = false

    // ✅ WAJIB: refresh periode aktif
    await Promise.all([
      periodeStore.fetchPeriodeAktif(locale.value as any),
      fetchData(),
    ])

    // (opsional tapi bagus)
    selectedFile.value = null

  } catch (err: any) {
    toast.add({
      title: "Gagal",
      description: periodeStore.error || err.message,
      color: "error",
    })
  }
}

// ================= UPDATE =================
const submitUpdate = async () => {
  try {
    if (!periodeStore.periodeAktif) return

    await periodeStore.updatePeriode(
      locale.value as any,
      periodeStore.periodeAktif.id,
      {
        tanggal_mulai: updateForm.tanggal_mulai,
        tanggal_selesai: updateForm.tanggal_selesai,
        file_kalender: selectedFile.value || undefined,
      }
    )

    toast.add({
      title: "Berhasil",
      description: "Periode berhasil diperbarui",
      color: "success",
    })

    await Promise.all([
      periodeStore.fetchPeriodeAktif(locale.value as any),
      fetchData(),
    ])
  } catch (err: any) {
    toast.add({
      title: "Gagal",
      description: periodeStore.error || err.message,
      color: "error",
    })
  }
}

// ================= NONAKTIF =================
const nonaktifkanPeriode = async () => {
  try {
    if (!periodeStore.periodeAktif) return

    await periodeStore.nonaktifkan(
      locale.value as any,
      periodeStore.periodeAktif.id
    )

    toast.add({
      title: "Berhasil",
      description: "Periode dinonaktifkan",
      color: "success",
    })

    await periodeStore.fetchPeriodeAktif(locale.value as any)
  } catch (err: any) {
    toast.add({
      title: "Gagal",
      description: periodeStore.error || err.message,
      color: "error",
    })
  }
}

// ================= TABLE DATA =================
const data = computed(() => periodeStore.periodes)
const meta = computed(() => periodeStore.meta)

const pagedCalendars = computed(() =>
  data.value.map((p) => ({
    id: p.id,
    period: p.tahun_ajaran,
    semester: p.semester,
    startDate: p.tanggal_mulai?.slice(0, 10),
    endDate: p.tanggal_selesai?.slice(0, 10),
    status: p.is_aktif ? "Aktif" : "Telah Selesai",
    fileUrl: p.kalender?.nama
      ? `${config.public.apiBase}${p.kalender.nama}`
      : "#",
  }))
)

const totalItems = computed(() => meta.value?.total || 0)
const totalPages = computed(() => meta.value?.total_pages || 1)
const currentPage = computed(() => meta.value?.page || 1)

const rowStartIndex = computed(() =>
  (currentPage.value - 1) * (meta.value?.size || 10)
)

const shownFrom = computed(() =>
  totalItems.value === 0 ? 0 : rowStartIndex.value + 1
)

const shownTo = computed(() =>
  Math.min(rowStartIndex.value + (meta.value?.size || 10), totalItems.value)
)

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

const goToPage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) page.value = p
}
</script>

<template>
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
        <span>Home</span>
      </NuxtLink>
      <span>/</span>
      <span class="font-semibold text-[#e1121b]">Manajemen Periode</span>
    </div>

    <!-- Buat Periode Baru -->
    <div v-if="!periodeStore.periodeAktif"
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
          Buat Periode Baru
        </h1>
      </div>

      <form @submit.prevent="submitCreate">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Periode <span class="text-[#e1121b]">*</span></span>
            <input v-model="createForm.tahun_ajaran" type="text" placeholder="Contoh: 2023/2024"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Mulai <span
                class="text-[#e1121b]">*</span></span>
            <input v-model="createForm.tanggal_mulai" type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Selesai <span
                class="text-[#e1121b]">*</span></span>
            <input v-model="createForm.tanggal_selesai" type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Semester <span class="text-[#e1121b]">*</span></span>
            <select v-model="createForm.semester"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
              <option v-for="semester in semesterOptions" :key="semester" :value="semester">
                {{ semester }}
              </option>
            </select>
          </label>
        </div>

        <div class="mt-5">
          <p class="mb-2 text-[13px] font-medium text-[#4a515d]">Upload PDF Kalender</p>
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
                Drag and drop your PDF here, or click to browse
              </p>
              <p class="mt-1 text-[12px] text-[#9ca3af]">
                Supports PDF files up to 5 MB
              </p>

              <button type="button"
                class="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] bg-[#e1121b] px-4 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                @click="triggerFilePicker">
                Browse Files
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
            Buat
          </button>
        </div>
      </form>
    </div>


    <!-- Periode Berjalan, Update dan selesaikan Periode -->
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
          Periode Berjalan
        </h1>
      </div>

      <form @submit.prevent="submitUpdate">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Periode <span class="text-[#e1121b]">*</span></span>
            <input v-model="updateForm.tahun_ajaran" type="text" placeholder="Contoh: 2023/2024" disabled
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-gray-100 px-3 text-[13px] text-[#2f3744] outline-none cursor-not-allowed">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Mulai <span
                class="text-[#e1121b]">*</span></span>
            <input v-model="updateForm.tanggal_mulai" type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Tanggal Selesai <span
                class="text-[#e1121b]">*</span></span>
            <input v-model="updateForm.tanggal_selesai" type="date"
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b]">
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-[#4a515d]">Semester <span class="text-[#e1121b]">*</span></span>
            <select v-model="updateForm.semester" disabled
              class="h-11 rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] cursor-not-allowed">
              <option v-for="semester in semesterOptions" :key="semester" :value="semester">
                {{ semester }}
              </option>
            </select>
          </label>
        </div>

        <div class="mt-5">
          <p class="mb-2 text-[13px] font-medium text-[#4a515d]">Upload PDF Kalender</p>
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
                Drag and drop your PDF here, or click to browse
              </p>
              <p class="mt-1 text-[12px] text-[#9ca3af]">
                Supports PDF files up to 5 MB
              </p>

              <button type="button"
                class="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] bg-[#e1121b] px-4 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]"
                @click="triggerFilePicker">
                Browse Files
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
            type="button"
            @click="nonaktifkanPeriode"
          >
            Nonaktifkan
          </button>

          <button
            class="cursor-pointer inline-flex h-10 items-center justify-center rounded-full bg-[#e1121b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#cc0f17]"
            type="submit"
          >
              Update
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
            Daftar periode
          </h2>
        </div>

        <select v-model="sortOrder"
          class="h-9 w-full rounded-[10px] border border-[#d8dbe2] bg-white px-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] sm:w-[150px]">
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
              <th class="px-3 py-2.5 font-semibold">Status</th>
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
              <td class="px-3 py-2.5">{{ item.status}}</td>
              <td class="px-3 py-2.5">
                <a :href="item.fileUrl" target="_blank" rel="noopener noreferrer"
                  class="inline-flex h-7 items-center justify-center rounded-full bg-[#e1121b] px-3 text-[12px] font-semibold text-white transition hover:bg-[#cc0f17]">
                  Download
                </a>
              </td>
            </tr>

            <tr v-if="pagedCalendars.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-[#7a8190]">
                Belum ada data Periode.
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
          <button type="button"
            class="rounded-[7px] border border-[#d9dde5] px-2.5 py-1.5 transition hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
            Previous
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
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
