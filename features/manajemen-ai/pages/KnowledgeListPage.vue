<template>
  <section class="mx-auto w-full max-w-360 px-3 pb-6 pt-4 sm:px-5 lg:px-8">

    <!-- Breadcrumb -->
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard')">
        <button
          class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <NuxtLink to="/dashboard" class="text-[#9aa2b1] hover:text-[#6e7788] transition hover:underline">
          Dasbor
        </NuxtLink>

        <span class="px-1 text-[#c5cad4]">/</span>

        <span class="font-semibold text-[#e30000] underline">
          Manajemen AI
        </span>
      </nav>
    </div>

    <!-- Hero -->
    <section
      class="mt-4 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-280 space-y-2 bg-[#f4f4f5]">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#11141b]">
            Manajemen Pengetahuan AI
          </h1>

          <p class="mt-2 max-w-280 text-sm sm:text-[0.95rem] leading-relaxed text-[#556173]">
            Kelola dokumen referensi dan SOP yang akan dipelajari oleh Asisten AI. Format yang didukung adalah PDF.
          </p>
        </div>

        <div class="flex flex-wrap gap-2 lg:flex-nowrap">
          <select
            v-model="selectedCategory"
            class="h-10 sm:h-11 rounded-xl border border-[#dce1e8] bg-white px-3 text-sm sm:text-[0.95rem] text-[#394150] shadow-[0_2px_6px_rgba(15,23,42,0.04)] outline-none"
          >
            <option value="Umum">Umum</option>
            <option value="Akademik">Akademik</option>
            <option value="Keuangan">Keuangan</option>
            <option value="Kemahasiswaan">Kemahasiswaan</option>
            <option value="Kepegawaian">Kepegawaian</option>
          </select>

          <input type="file" ref="fileInput" accept="application/pdf" class="hidden" @change="handleFileUpload" />
          
          <button
            @click="$refs.fileInput.click()"
            :disabled="isUploading"
            class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-[#e30000] px-5 py-3 text-sm sm:text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000] disabled:opacity-50 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {{ isUploading ? 'Mengunggah...' : 'Upload PDF' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Statistik -->
    <section
      class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d] text-left">
            Total Dokumen
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-right">
            {{ formatNumber(filteredRows.length) }}
          </p>
        </article>

        <article
          class="rounded-xl border border-[#e4e7ec] bg-[#f8f8f8] px-3 py-3 sm:px-4 sm:py-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <p class="text-xs sm:text-sm font-semibold text-[#44474d] text-left">
            Total Ukuran Data
          </p>

          <p class="mt-2 text-xl sm:text-3xl font-bold text-red-800 text-right">
            {{ formatBytes(totalSizeBytes) }}
          </p>
        </article>

      </div>
    </section>

    <!-- Table -->
    <section
      class="mt-5 rounded-2xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h2 class="text-lg sm:text-xl font-semibold text-[#11141b] text-left">
        Daftar Dokumen AI
      </h2>

      <!-- Filter -->
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input v-model="searchQuery" type="search" placeholder="Cari dokumen..."
          class="h-10 w-full lg:w-72 rounded-xl border border-[#d8dde4] bg-[#f8f8f8] px-4 text-sm outline-none">
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="mt-6 flex justify-center py-8">
        <p class="text-sm text-[#6b7280]">Memuat data...</p>
      </div>

      <!-- Table -->
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-[#dce1e8] bg-white">
        <table class="w-full min-w-220 text-sm">
          <thead>
            <tr class="bg-[#f1f3f6] text-[#2f3744]">
              <th class="px-3 py-3 text-left">No</th>
              <th class="px-3 py-3 text-left">Nama Dokumen</th>
              <th class="px-3 py-3 text-left">Tipe</th>
              <th class="px-3 py-3 text-left">Ukuran</th>
              <th class="px-3 py-3 text-left">Terakhir Diubah</th>
              <th class="px-3 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in paginatedRows" :key="row.source">
              <td class="px-3 py-3">
                {{ formatNumber(showingFrom + index) }}
              </td>

              <td class="px-3 py-3 font-semibold text-[#11141b]">
                {{ row.sourceName }}
              </td>

              <td class="px-3 py-3">
                <span class="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 uppercase">
                  {{ row.sourceType }}
                </span>
              </td>

              <td class="px-3 py-3 text-[#556173]">
                {{ formatBytes(row.size) }}
              </td>

              <td class="px-3 py-3 text-[#556173]">
                {{ formatDate(row.lastModified) }}
              </td>

              <td class="px-3 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <button
                    @click="previewFile(row.source)"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#bfdbfe] bg-[#eff6ff] text-[#3b82f6] transition hover:bg-[#dbeafe] cursor-pointer"
                    title="Pratinjau PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteFile(row.source)"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#fca5a5] bg-[#fef2f2] text-[#ef4444] transition hover:bg-[#fee2e2] cursor-pointer"
                    title="Hapus PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="paginatedRows.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-sm text-[#7a8392]">
                Dokumen tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <div class="flex gap-2 text-sm">
          <button :disabled="currentPage === 1"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage--">
            Sebelumnya
          </button>

          <button class="rounded-xl bg-[#e30000] px-4 py-2 text-white">
            {{ currentPage }}
          </button>

          <button :disabled="currentPage === totalPages || totalPages === 0"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="currentPage++">
            Berikutnya
          </button>
        </div>
      </div>
    </section>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="itemToDelete" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
        <h3 class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
        <p class="mt-2 text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus PDF ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="itemToDelete = null" class="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
            Batal
          </button>
          <button @click="executeDelete" class="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '#imports'
import { useApiRequest } from '#features/shared/api/http'

const localePath = useLocalePath()
const toast = useToast()
const { request } = useApiRequest()

// STATE
const files = ref<any[]>([])
const isLoading = ref(true)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const itemToDelete = ref<string | null>(null)

const searchQuery = ref('')
const selectedCategory = ref('Umum')
const currentPage = ref(1)
const pageSize = 10

// COMPUTED
const filteredRows = computed(() => {
  if (!searchQuery.value) return files.value
  const query = searchQuery.value.toLowerCase()
  return files.value.filter(f => f.sourceName.toLowerCase().includes(query))
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / pageSize))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

const showingFrom = computed(() => {
  if (filteredRows.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const totalSizeBytes = computed(() => files.value.reduce((acc, curr) => acc + curr.size, 0))

// METHODS
function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value)
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

async function fetchFiles() {
  isLoading.value = true
  try {
    const res = await $fetch<any>('/api/ai/knowledge-files')
    if (res && res.data) {
      files.value = res.data
    }
  } catch (error) {
    console.error('Gagal memuat dokumen', error)
  } finally {
    isLoading.value = false
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file.type !== 'application/pdf') {
    toast.add({ 
      title: 'Gagal', 
      description: 'Hanya diperbolehkan format PDF', 
      color: 'error',
      onClick: (t) => toast.remove(t.id) 
    })
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await $fetch<any>('/api/ai/upload-knowledge', {
      method: 'POST',
      body: formData
    })
    
    const uploadedFilename = res.filename || file.name
    const sourceKey = `ai-knowledge-bge/pdfs/${uploadedFilename}`

    toast.add({ 
      title: 'Tersimpan', 
      description: 'PDF berhasil diunggah. Memulai pelatihan AI...', 
      color: 'success',
      onClick: (t) => toast.remove(t.id) 
    })

    // Auto Ingest Phase via Backend BullMQ Worker
    try {
      await request<any>(`/api/ai/ingest`, {
        method: 'POST',
        body: {
          source: sourceKey,
          category: selectedCategory.value
        }
      })
      toast.add({ 
        title: 'Berhasil', 
        description: 'Tugas ekstraksi AI sedang berjalan di latar belakang.', 
        color: 'success',
        onClick: (t) => toast.remove(t.id) 
      })
    } catch (trainError: any) {
      toast.add({ 
        title: 'Gagal', 
        description: 'Gagal mengirim tugas ke antrean AI: ' + (trainError.data?.statusMessage || trainError.message), 
        color: 'error',
        onClick: (t) => toast.remove(t.id) 
      })
    }

    await fetchFiles()
  } catch (error: any) {
    toast.add({ 
      title: 'Gagal', 
      description: 'Gagal mengunggah file: ' + (error.data?.statusMessage || error.message), 
      color: 'error',
      onClick: (t) => toast.remove(t.id) 
    })
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function previewFile(source: string) {
  window.open(`/api/ai/preview-knowledge?source=${encodeURIComponent(source)}`, '_blank')
}

function deleteFile(source: string) {
  itemToDelete.value = source
}

async function executeDelete() {
  if (!itemToDelete.value) return
  const source = itemToDelete.value
  itemToDelete.value = null

  try {
    await request(`/api/ai/knowledge?source=${encodeURIComponent(source)}`, {
      method: 'DELETE'
    })
    toast.add({
      title: 'Berhasil',
      description: 'PDF berhasil dihapus dari Knowledge Base.',
      color: 'success',
      onClick: (t) => toast.remove(t.id)
    })
    await fetchFiles()
  } catch (error: any) {
    toast.add({
      title: 'Gagal',
      description: 'Gagal menghapus PDF: ' + (error.data?.statusMessage || error.message),
      color: 'error',
      onClick: (t) => toast.remove(t.id)
    })
  }
}

onMounted(() => {
  fetchFiles()
})
</script>
