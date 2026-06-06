<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useModulApi } from '#features/modul/services/modul.api'
import { useAspekApi } from '#features/modul/services/aspek.api'
import type { ModulRecord } from '#features/modul/types/modul'
import type { AspekRecord } from '#features/modul/types/aspek'

const route = useRoute()
const { t } = useI18n()
const modulApi = useModulApi()
const aspekApi = useAspekApi()

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const detailData = ref<ModulRecord | null>(null)
const aspekRows = ref<AspekRecord[]>([])
const pageLoading = ref(true)

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
    const compare = a.name.localeCompare(b.name)
    return aspekSortOrder.value === 'a-z' ? compare : compare * -1
  })

  if (query) {
    rows = rows.filter(r => r.name.toLowerCase().includes(query) || (r.description || '').toLowerCase().includes(query))
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
    const [modul, aspekRes] = await Promise.all([
      modulApi.getModul(modulId.value),
      aspekApi.listAspek(modulId.value)
    ])
    detailData.value = modul
    aspekRows.value = aspekRes.items
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
  <section v-else-if="detailData" class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/dashboard/manajemen-modul"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white"
        aria-label="Kembali"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
        </svg>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1">
        <NuxtLink to="/dashboard" class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]">Home</NuxtLink>
        <span class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]">/</span>
        <NuxtLink to="/dashboard/manajemen-modul" class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]">{{ $t('manajemenModul.judul') }}</NuxtLink>
        <span class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]">/</span>
        <span class="font-semibold text-[#e30000] text-[clamp(0.95rem,1.2vw,1.05rem)]">{{ detailData.name }}</span>
      </nav>
    </div>

    <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
            Detail Modul Evaluasi
          </h1>
          <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            Gunakan halaman ini untuk melihat detail modul evaluasi beserta indikator penilaiannya. Informasi yang ditampilkan mencakup nama, deskripsi, serta objek evaluasi.
          </p>
        </div>
      </div>
    </section>

    <!-- Informasi Modul Accordion -->
    <section class="mt-6 space-y-6">
      <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggleDetailSection('informasi')">
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">Informasi Modul</h2>
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
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">Nama</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.name }}</dd>
              </div>
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">Deskripsi</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.description || '-' }}</dd>
              </div>
              <div class="grid gap-1 sm:grid-cols-[260px_minmax(0,1fr)]">
                <dt class="text-[1.1rem] font-semibold text-[#5b6575]">Dibuat Pada</dt>
                <dd class="text-[1.1rem] text-[#2b3340]">{{ detailData.createdAt ? new Date(detailData.createdAt).toLocaleDateString() : '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
            <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}/edit`" class="rounded-[18px] bg-[#e30000] px-7 py-2 text-[0.95rem] font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition hover:bg-[#ca0000]">
              Edit Modul
            </NuxtLink>
            <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}/aspek/create`" class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]">
              Tambah Aspek
            </NuxtLink>
          </div>
        </div>
      </article>

      <!-- Daftar Aspek Accordion -->
      <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left" @click="toggleDetailSection('aspek')">
          <div class="flex items-center gap-3">
            <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">Daftar Aspek</h2>
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
              <input v-model="aspekSearchQuery" type="search" placeholder="Cari aspek..." class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]">
            </label>
            <label class="relative block w-full md:w-[170px]">
              <select v-model="aspekSortOrder" class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
                <option value="a-z">A - Z</option>
                <option value="z-a">Z - A</option>
              </select>
            </label>
          </div>

          <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
            <table class="w-full min-w-[600px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                  <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                  <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredAspekRows" :key="row.id" class="border-t border-[#e8edf3]">
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">{{ index + 1 }}</td>
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                    <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}/aspek/${row.id}`" class="text-[#e30000] hover:underline">
                      {{ row.name }}
                    </NuxtLink>
                  </td>
                  <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">{{ row.description || '-' }}</td>
                </tr>
                <tr v-if="filteredAspekRows.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-[#7a8392]">Belum ada data aspek.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
