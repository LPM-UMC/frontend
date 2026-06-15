<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useLocalePath, useRuntimeConfig, useRouter } from '#imports'
import { useI18n } from 'vue-i18n'
import { useModulStore } from '../../../app/stores/modul'
import { useAspekStore } from '../../../app/stores/aspek'
import type { AspekResponse } from '#types/aspek'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string || 'http://localhost:3001'
const modulStore = useModulStore()
const aspekStore = useAspekStore()

const isRTL = computed(() => locale.value.startsWith('ar'))

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const aspekId = computed(() => {
  const id = route.params.aspek_id
  return Array.isArray(id) ? id[0] : id
})

const pageLoading = ref(true)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const detailData = ref<AspekResponse | null>(null)
const modulName = ref('')

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenModul.judul'),
    to: '/dashboard/manajemen-modul',
  },
  {
    label: modulName.value || 'Modul',
    to: `/dashboard/manajemen-modul/${modulId.value}`,
  },
  {
    label: detailData.value?.nama || t('manajemenAspek.judul'),
    active: true,
  },
])

const detailSectionOpen = reactive({
  informasi: true,
})

function toggleDetailSection(section: 'informasi') {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

async function loadDetail() {
  if (!modulId.value || !aspekId.value) return
  pageLoading.value = true
  try {
    const lang = locale.value || 'id'
    const [aspekRes, modulRes] = await Promise.all([
      aspekStore.fetchAspekById(lang, baseURL, aspekId.value),
      modulStore.fetchModulById(lang, baseURL, modulId.value)
    ])
    detailData.value = aspekRes
    modulName.value = modulRes?.nama || 'Modul'
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

async function confirmDelete() {
  isDeleting.value = true
  const toast = useToast()
  try {
    const lang = locale.value || 'id'
    await aspekStore.deleteAspek(lang, baseURL, aspekId.value)
    showDeleteModal.value = false
    toast.add({
      title: 'Berhasil',
      description: 'Aspek berhasil dihapus dari modul',
      color: 'green'
    })
    router.push(localePath(`/dashboard/manajemen-modul/${modulId.value}`))
  } catch(e: any) {
    toast.add({
      title: 'Gagal Menghapus',
      description: e?.data?.errors || e.message || 'Gagal menghapus aspek',
      color: 'red'
    })
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-[1.1rem] text-slate-500">Memuat detail aspek...</div>
  <section v-else-if="detailData" class="mx-auto w-full max-w-380 px-3 pb-6 pt-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}`)">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <section class="mt-5 rounded-[10px] bg-white px-8 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('manajemenAspek.judul') }}
          </h1>
          <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            {{ t('manajemenAspek.deskripsiDetail') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Informasi Aspek Accordion -->
    <section class="mt-6 space-y-6">
      <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggleDetailSection('informasi')">
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">{{ t('manajemenAspek.informasiAspek') }}</h2>
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform" :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </span>
        </button>

        <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
          <div class="grid gap-8 xl:grid-cols-2">
            <dl class="space-y-4">
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenAspek.namaAspek') }}</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.nama }}</dd>
              </div>
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenAspek.deskripsi') }}</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.deskripsi || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
            <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}/aspek/${aspekId}/edit`)" class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(227,0,11,0.25)] transition hover:from-[#cc0f17] hover:to-[#a01818]">
              {{ t('manajemenAspek.editAspek') }}
            </NuxtLink>
            <button @click="showDeleteModal = true" class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#cfd5df] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#1f2634] transition hover:bg-[#e0e0e0] cursor-pointer">
              {{ t('manajemenAspek.hapus') }}
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/40 px-4 backdrop-blur-[2px] transition-opacity">
      <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
        <div class="mb-5 flex items-center justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h3 class="text-center text-xl font-bold leading-6 text-gray-900">
          {{ t('manajemenAspek.konfirmasiHapus') || 'Hapus Aspek' }}
        </h3>
        <div class="mt-2">
          <p class="text-center text-[0.95rem] text-gray-500">
            Apakah Anda yakin ingin menghapus aspek ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button type="button" @click="showDeleteModal = false" :disabled="isDeleting" class="inline-flex w-full cursor-pointer justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm">
            Batal
          </button>
          <button type="button" @click="confirmDelete" :disabled="isDeleting" class="inline-flex w-full cursor-pointer justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm">
            <span v-if="isDeleting" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Menghapus...
            </span>
            <span v-else>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
