<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFm6Repository, type Fm6Context } from '../../composables/useFm6Repository'
import type { Fm6MahasiswaSurveyItem } from '../../services/fm6.api'

const route = useRoute()
const router = useRouter()
const repository = useFm6Repository()

const loading = ref(true)
const surveys = ref<Fm6MahasiswaSurveyItem[]>([])

const currentPage = ref(1)
const pageSize = 5

function getFirstQueryValue(value: string | string[] | null | undefined): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value[0] ?? undefined
  return value
}

const listMode = computed(() => {
  const rawValue = getFirstQueryValue(route.query.state as string | string[] | null | undefined)
  if (!rawValue) return 'aktif'
  const normalized = rawValue.toLowerCase()
  if (normalized === 'list' || normalized === 'aktif' || normalized === 'active') return 'aktif'
  if (normalized === 'after_submit' || normalized === 'selesai' || normalized === 'done') return 'selesai'
  return 'aktif'
})

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)

const context = computed<Fm6Context>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

// Filter surveys based on list mode
const filteredSurveys = computed(() => {
  if (listMode.value === 'selesai') {
    return surveys.value.filter((s: Fm6MahasiswaSurveyItem) => s.sudahDijawab)
  }
  return surveys.value.filter((s: Fm6MahasiswaSurveyItem) => !s.sudahDijawab)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSurveys.value.length / pageSize)))

const paginatedSurveys = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredSurveys.value.slice(start, start + pageSize)
})

const showingFrom = computed(() => {
  if (!filteredSurveys.value.length) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() => {
  if (!filteredSurveys.value.length) return 0
  return Math.min(currentPage.value * pageSize, filteredSurveys.value.length)
})

function buildDetailRoute(jawabId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/jawab/${encodeURIComponent(jawabId)}`
}

async function goToSurvey(jawabId: string) {
  await router.push(buildDetailRoute(jawabId))
}

watch(listMode, () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

async function fetchSurveys() {
  loading.value = true
  try {
    const res = await repository.getMahasiswaSurveys(context.value)
    if (res) {
      surveys.value = res
    }
  } catch (error) {
    console.error('Gagal memuat daftar survei mahasiswa:', error)
  } finally {
    loading.value = false
  }
}

watch(context, () => {
  fetchSurveys()
}, { immediate: true })
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="mb-5 flex flex-col justify-between sm:flex-row sm:items-center px-4 md:px-5 xl:px-6 pt-4">
      <div class="flex items-center gap-4">
        <button type="button"
          class="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#dce0e5] bg-white text-[#768092] transition hover:bg-[#f6f7f9] hover:text-[#424b59]"
          @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="flex items-center gap-2 text-[14px] font-medium text-[#8f95a3]">
            <span>Form Survei</span>
            <span class="text-[#cbd0d9]">/</span>
            <span class="font-bold text-[#e1121b]">Daftar Survei</span>
          </h1>
        </div>
      </div>
    </div>

    <section class="fm6-page mx-auto w-full max-w-[1580px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 xl:px-6 2xl:max-w-[1660px]">
      <section
        class="rounded-[16px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-4 py-4 shadow-[0_5px_14px_rgba(15,23,42,0.18)] md:px-5 md:py-5 xl:px-6 xl:py-6"
      >
        <h1 class="text-[clamp(1.45rem,1.8vw,2.25rem)] font-semibold leading-tight text-white">
          {{ listMode === 'aktif' ? 'Survei Tersedia' : 'Survei Selesai' }}
        </h1>
        <p class="mt-2.5 max-w-[1300px] text-[clamp(0.9rem,0.95vw,1.12rem)] leading-relaxed text-white/95 md:mt-3">
          {{ listMode === 'aktif' 
            ? 'Berikut adalah daftar survei monitoring dan evaluasi pembelajaran yang perlu Anda isi.' 
            : 'Berikut adalah riwayat survei yang telah Anda selesaikan sebelumnya.' }}
        </p>
      </section>

      <section class="space-y-4 md:space-y-5">
        <h2 class="pt-2 text-center text-[clamp(1.7rem,2vw,2.45rem)] font-medium leading-tight text-[#151823]">
          {{ listMode === 'aktif' ? 'Survei yang perlu Anda kerjakan' : 'Riwayat Survei Anda' }}
        </h2>

        <div class="space-y-4 md:space-y-5">
          <article
            v-for="(card, index) in paginatedSurveys"
            :key="card.id"
            class="rounded-[22px] border border-[#d7dce3] bg-[#efefef] px-4 py-4 shadow-[0_3px_8px_rgba(15,23,42,0.06)] md:px-6 md:py-6 lg:px-7 lg:py-7 relative overflow-hidden group"
          >
            <!-- Badge untuk yang sudah selesai -->
            <div v-if="card.sudahDijawab" class="absolute top-0 right-0 bg-green-500 text-white px-4 py-1.5 rounded-bl-xl font-medium text-sm shadow-md z-10">
              Selesai
            </div>

            <h3 class="text-[clamp(1.4rem,1.7vw,2rem)] font-semibold leading-tight text-[#1f2633]">
              {{ card.judul }}
            </h3>

            <p class="mt-2.5 max-w-[1300px] text-[clamp(0.98rem,1.05vw,1.28rem)] leading-relaxed text-[#566174] md:mt-3">
              {{ card.deskripsi }}
            </p>

            <div class="mt-4 flex items-center gap-4 text-sm text-[#6b7280]">
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ card.programStudi }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ card.totalPertanyaan }} Pertanyaan
              </span>
            </div>

            <button
              v-if="!card.sudahDijawab"
              type="button"
              class="mt-5 inline-flex items-center gap-1.5 text-[clamp(1.05rem,1.2vw,1.42rem)] font-medium text-[#e30000] transition hover:opacity-90 md:mt-6"
              @click="goToSurvey(card.id)"
            >
              Mulai Mengerjakan
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" />
              </svg>
            </button>
            <button
              v-else
              type="button"
              class="mt-5 inline-flex items-center gap-1.5 text-[clamp(1.05rem,1.2vw,1.42rem)] font-medium text-[#059669] transition hover:opacity-90 md:mt-6"
              @click="goToSurvey(card.id)"
            >
              Lihat Jawaban Anda
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </article>

          <div v-if="filteredSurveys.length === 0 && !loading" class="rounded-[22px] border border-[#d7dce3] bg-[#efefef] px-4 py-12 text-center shadow-[0_3px_8px_rgba(15,23,42,0.06)] md:px-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-[#a1a1aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-xl font-medium text-[#3f3f46]">Tidak ada survei</h3>
            <p class="mt-2 text-[#71717a]">
              {{ listMode === 'aktif' 
                ? 'Tidak ada survei yang perlu Anda kerjakan saat ini.' 
                : 'Anda belum menyelesaikan survei apapun.' }}
            </p>
          </div>
        </div>

        <div v-if="filteredSurveys.length > 0" class="flex flex-col gap-3 border-t border-[#d8dde5] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(0.95rem,1vw,1.15rem)] text-[#4e596d]">
            Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredSurveys.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[16px] md:px-5 md:py-2"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-[14px] bg-[#e30000] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] font-semibold text-white md:rounded-[16px] md:px-5 md:py-2"
            >
              {{ currentPage }}
            </button>

            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[16px] md:px-5 md:py-2"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat data survei mahasiswa...
      </section>
    </section>
  </div>
</template>
