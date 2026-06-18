<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDokumenAmi } from '../composables/useDokumenAmi';
import { useDokumenAmiApi } from '../services/dokumen-ami.api';
import { useToast, useLocalePath } from '#imports';

const props = defineProps<{
  modulId: string;
  modulName: string;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
const api = useDokumenAmiApi();
const { isLoading, dataDokumen, meta, fetchDokumen, uploadDokumen, downloadDokumen, deleteDokumen } = useDokumenAmi();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const searchQuery = ref('');
const currentPage = ref(1);

const isDeleteModalOpen = ref(false);
const selectedIdToDelete = ref<string | null>(null);

const isPreviewModalOpen = ref(false);
const previewUrl = ref('');
const previewFileName = ref('');

const loadData = async () => {
  if (!props.modulId) return;
  await fetchDokumen({
    modul_id: props.modulId,
    page: currentPage.value,
    limit: 10,
    search: searchQuery.value,
  });
};

onMounted(() => {
  loadData();
});

watch([() => props.modulId, currentPage, searchQuery], () => {
  loadData();
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file) validateAndSetFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }
};

const validateAndSetFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    toast.add({
      title: 'Error',
      description: t('amiDokumen.validasi.fileType'),
      color: 'error',
    });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      title: 'Error',
      description: t('amiDokumen.validasi.fileSize'),
      color: 'error',
    });
    return;
  }
  selectedFile.value = file;
};

const removeSelectedFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleUpload = async () => {
  if (!selectedFile.value || !props.modulId) {
    toast.add({
      title: 'Error',
      description: t('amiDokumen.validasi.fileRequired'),
      color: 'error',
    });
    return;
  }

  try {
    await uploadDokumen(props.modulId, selectedFile.value.name, selectedFile.value);
    toast.add({
      title: 'Success',
      description: t('amiDokumen.toast.unggahBerhasil'),
      color: 'success',
    });
    removeSelectedFile();
    loadData();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: t('toast.common.unexpectedError'),
      color: 'error',
    });
  }
};

const confirmDelete = (id: string) => {
  selectedIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!selectedIdToDelete.value) return;

  try {
    await deleteDokumen(selectedIdToDelete.value);
    toast.add({
      title: 'Success',
      description: t('amiDokumen.toast.hapusBerhasil'),
      color: 'success',
    });
    isDeleteModalOpen.value = false;
    loadData();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: t('toast.common.unexpectedError'),
      color: 'error',
    });
  }
};

const handleDownload = async (id: string) => {
  try {
    await downloadDokumen(id);
  } catch (error) {
    toast.add({
      title: 'Error',
      description: t('toast.common.unexpectedError'),
      color: 'error',
    });
  }
};

const handlePreview = async (id: string, namaDokumen: string) => {
  try {
    const response = await fetchDokumenUrl(id); // Kita butuh method helper ini
    if (response) {
      previewUrl.value = response;
      previewFileName.value = namaDokumen;
      isPreviewModalOpen.value = true;
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: t('toast.common.unexpectedError'),
      color: 'error',
    });
  }
};

const fetchDokumenUrl = async (id: string) => {
  const res = await api.getDownloadUrl(id);
  // res is already unwrapped to { url, nama_dokumen }
  if (res && res.url) {
    const config = useRuntimeConfig();
    const baseURL = ((config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '');
    if (res.url.startsWith('/')) {
      return baseURL + res.url;
    }
    return res.url;
  }
  return null;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const goToPage = (page: number) => {
  if (page < 1 || page > meta.value.total_pages) return;
  currentPage.value = page;
};

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: 'Modul AMI',
    to: '/dashboard/ami',
  },
  {
    label: props.modulName,
    active: true,
  },
]);
</script>

<template>
  <div class="space-y-6 px-4 md:px-6 lg:px-8 py-6">
    <!-- Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-2">
      <NuxtLink :to="localePath('/dashboard')">
        <button class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active ? 'font-semibold text-[#e30000] underline' : 'text-[#9aa2b1]'">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <!-- Upload Section -->
    <div class="rounded-xl border border-[#dadde3] bg-white p-6 shadow-sm">
      <h3 class="text-lg font-semibold mb-2 text-[#11141b]">{{ t('amiDokumen.unggahDokumen') }}</h3>
      <p class="text-sm text-[#556173] mb-4">
        {{ t('amiDokumen.uploadDeskripsi', { modul: modulName }) }}
      </p>

      <div
        class="border-2 border-dashed border-[#dadde3] rounded-xl p-8 text-center transition-colors hover:bg-[#f8f8f8]"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div v-if="!selectedFile" class="flex flex-col items-center justify-center space-y-4">
          <div class="p-4 bg-red-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#e30000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-[#11141b]">{{ t('amiDokumen.seretFile') }}</p>
            <p class="text-xs text-[#556173]">{{ t('amiDokumen.maksimalFile') }}</p>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            class="hidden"
            @change="handleFileSelect"
          />
          <button @click="fileInput?.click()" class="inline-flex h-9 items-center justify-center rounded-xl border border-[#dce1e8] bg-white px-4 py-2 text-sm font-semibold text-[#394150] hover:bg-[#f8f8f8] transition cursor-pointer">
            {{ t('amiDokumen.pilihFile') }}
          </button>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center space-y-4">
          <div class="p-4 bg-green-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="space-y-1 text-center">
            <p class="text-sm font-medium text-[#11141b]">{{ selectedFile.name }}</p>
            <p class="text-xs text-[#556173]">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          <div class="flex space-x-2">
            <button @click="removeSelectedFile" class="inline-flex h-9 items-center justify-center rounded-xl border border-[#dce1e8] bg-white px-4 py-2 text-sm font-semibold text-[#394150] hover:bg-[#f8f8f8] transition cursor-pointer">
              {{ t('util.batal') }}
            </button>
            <button :disabled="isLoading" @click="handleUpload" class="inline-flex h-9 items-center justify-center rounded-xl bg-[#e30000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c70000] transition disabled:opacity-50 cursor-pointer">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('amiDokumen.unggah') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="rounded-xl border border-[#dadde3] bg-[#f4f4f5] p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 class="text-lg font-semibold text-[#11141b]">{{ t('amiDokumen.daftarDokumen') }}</h3>
          <p class="text-sm text-[#556173]">{{ t('amiDokumen.tabelDeskripsi', { modul: modulName }) }}</p>
        </div>
        <div class="relative w-full sm:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('amiDokumen.cari')"
            class="h-10 w-full rounded-xl border border-[#d8dde4] bg-[#f8f8f8] pl-10 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-[#dce1e8] bg-white">
        <table class="w-full min-w-[600px] text-sm">
          <thead>
            <tr class="bg-[#f1f3f6] text-[#2f3744]">
              <th class="px-4 py-3 text-left w-12">{{ t('amiDokumen.tabel.no') }}</th>
              <th class="px-4 py-3 text-left">{{ t('amiDokumen.tabel.namaDokumen') }}</th>
              <th class="px-4 py-3 text-left">{{ t('amiDokumen.tabel.tanggalUpload') }}</th>
              <th class="px-4 py-3 text-right">{{ t('amiDokumen.tabel.aksi') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dataDokumen.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-[#7a8392]">
                {{ t('amiDokumen.tabel.kosong') }}
              </td>
            </tr>
            <tr v-for="(item, index) in dataDokumen" :key="item.id" class="border-t border-[#dce1e8]">
              <td class="px-4 py-3">{{ (meta.page - 1) * meta.limit + index + 1 }}</td>
              <td class="px-4 py-3 font-medium text-[#11141b]">{{ item.nama_dokumen }}</td>
              <td class="px-4 py-3 text-[#556173]">{{ formatDate(item.created_at) }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="handlePreview(item.id, item.nama_dokumen)" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer" title="Preview">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="handleDownload(item.id)" class="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition cursor-pointer" title="Download">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(item.id)" class="p-2 rounded-lg hover:bg-red-50 text-red-600 transition cursor-pointer" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta.total_pages > 1" class="mt-4 flex justify-end">
        <div class="flex gap-2 text-sm">
          <button :disabled="currentPage === 1"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="goToPage(currentPage - 1)">
            {{ t('util.paginasi.sebelumnya') }}
          </button>

          <button class="rounded-xl bg-[#e30000] px-4 py-2 text-white">
            {{ currentPage }}
          </button>

          <button :disabled="currentPage === meta.total_pages"
            class="rounded-xl border border-[#d8dde4] px-3 py-2 disabled:opacity-50 cursor-pointer"
            @click="goToPage(currentPage + 1)">
            {{ t('util.paginasi.berikutnya') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal Overlay -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ t('amiDokumen.hapusKonfirmasi.judul') }}</h3>
        <p class="text-gray-500 mb-6">{{ t('amiDokumen.hapusKonfirmasi.deskripsi') }}</p>
        <div class="flex justify-end gap-3">
          <button @click="isDeleteModalOpen = false" class="inline-flex h-10 items-center justify-center rounded-xl border border-[#dce1e8] bg-white px-4 py-2 text-sm font-semibold text-[#394150] hover:bg-[#f8f8f8] transition cursor-pointer">
            {{ t('util.batal') }}
          </button>
          <button :disabled="isLoading" @click="handleDelete" class="inline-flex h-10 items-center justify-center rounded-xl bg-[#e30000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c70000] transition disabled:opacity-50 cursor-pointer">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ t('amiDokumen.hapusKonfirmasi.tombol') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="isPreviewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div class="w-full max-w-5xl h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-[#dce1e8] bg-[#f8f9fa]">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 truncate pr-4">{{ previewFileName }}</h3>
          <button @click="isPreviewModalOpen = false" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Konten PDF -->
        <div class="flex-1 bg-gray-100 overflow-hidden relative">
          <iframe 
            :src="previewUrl" 
            class="w-full h-full border-none"
            title="PDF Preview"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
