<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useModulApi } from '#features/modul/services/modul.api'
import { useAspekApi } from '#features/modul/services/aspek.api'
import type { ModulRecord } from '#features/modul/types/modul'
import type { AspekRecord } from '#features/modul/types/aspek'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const modulApi = useModulApi()
const aspekApi = useAspekApi()

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const detailData = ref<ModulRecord | null>(null)
const aspekRows = ref<AspekRecord[]>([])
const pageLoading = ref(true)

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
    label: detailData.value?.nama || 'Detail Modul',
    active: true,
  },
])

const detailSectionOpen = reactive({
  informasi: true,
  aspek: false,
})

const aspekSearchQuery = ref('')
const aspekSortOrder = ref('a-z')

const filteredAspekRows = computed(() => {
  let rows = [...aspekRows.value]
  const query = aspekSearchQuery.value.trim().toLowerCase()

  rows.sort((a, b) => {
    const compare = (a.nama || '').localeCompare(b.nama || '')
    return aspekSortOrder.value === 'a-z' ? compare : compare * -1
  })

  if (query) {
    rows = rows.filter(r => (r.nama || '').toLowerCase().includes(query) || (r.deskripsi || '').toLowerCase().includes(query))
  }
  return rows
})

function toggleDetailSection(section: 'informasi' | 'aspek') {
  detailSectionOpen[section] = !detailSectionOpen[section]
}

async function loadDetail() {
  if (!modulId.value) return
  pageLoading.value = true
  try {
    const [modulRes, aspekRes] = await Promise.all([
      modulApi.getModul(modulId.value),
      aspekApi.listAspek(modulId.value)
    ])
    detailData.value = modulRes || null
    aspekRows.value = aspekRes?.items || []
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-[1.1rem] text-slate-500">Memuat detail modul...</div>
  <section v-else-if="detailData" class="mx-auto w-full max-w-[1880px] bg-[#f7f7f7] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard/manajemen-modul')">
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
            {{ t('manajemenModul.detail.judul') }}
          </h1>
          <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            {{ t('manajemenModul.detail.deskripsiDetail') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Informasi Modul Accordion -->
    <section class="mt-6 space-y-6">
      <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggleDetailSection('informasi')">
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">{{ t('manajemenModul.detail.informasiModul') }}</h2>
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
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenModul.detail.nama') }}</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.nama }}</dd>
              </div>
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenModul.detail.deskripsi') }}</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.deskripsi || '-' }}</dd>
              </div>
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">{{ t('manajemenModul.detail.tipeModul') }}</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.tipe_modul?.label || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
            <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}/edit`)" class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#E7000B] to-[#B91C1C] px-5 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(227,0,11,0.25)] transition hover:from-[#cc0f17] hover:to-[#a01818]">
              {{ t('manajemenModul.detail.editModul') }}
            </NuxtLink>
            <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}/aspek/create`)" class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#cfd5df] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#1f2634] transition hover:bg-[#e0e0e0]">
              {{ t('manajemenAspek.buatAspek') }}
            </NuxtLink>
          </div>
        </div>
      </article>

      <!-- Daftar Aspek Accordion -->
      <article class="rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggleDetailSection('aspek')">
          <div class="flex items-center gap-3">
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">{{ t('manajemenAspek.daftarAspek') }}</h2>
            <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">{{ filteredAspekRows.length }} data</span>
          </div>
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform" :class="detailSectionOpen.aspek ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </span>
        </button>

        <div v-if="detailSectionOpen.aspek" class="border-t border-[#e3e7ee] px-6 py-6">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label class="relative block w-full md:max-w-[400px]">
              <input v-model="aspekSearchQuery" type="search" :placeholder="t('manajemenModul.detail.cariAspek')" class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]">
            </label>
            <label class="relative block w-full md:w-[170px]">
              <select v-model="aspekSortOrder" class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
                <option value="a-z">{{ t('manajemenModul.detail.urutkan.az') }}</option>
                <option value="z-a">{{ t('manajemenModul.detail.urutkan.za') }}</option>
              </select>
            </label>
          </div>

          <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
            <table class="w-full min-w-[600px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenModul.detail.no') }}</th>
                  <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenAspek.namaAspek') }}</th>
                  <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left font-semibold text-[#2f3744]">{{ t('manajemenAspek.deskripsi') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredAspekRows" :key="row.id" class="border-t border-[#e8edf3] hover:bg-gray-50 transition">
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#2f3744]">{{ index + 1 }}</td>
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] font-semibold text-[#3b3f46]">
                    <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}/aspek/${row.id}`)" class="text-[#E7000B] hover:text-[#B91C1C] transition hover:underline">
                      {{ row.nama }}
                    </NuxtLink>
                  </td>
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[14px] text-[#3f4551]">{{ row.deskripsi || '-' }}</td>
                </tr>
                <tr v-if="filteredAspekRows.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-[#7a8392]">{{ t('manajemenModul.detail.belumAdaData') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
