<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '#stores/auth'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import { useFm6Repository } from '#features/periode-modul/composables/useFm6Repository'
import type { Fm6MahasiswaSurveyItem } from '#features/periode-modul/services/fm6.api'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuthStore()
const router = useRouter()
const repository = useFm6Repository()

const loading = ref(true)
const errorMessage = ref<string | null>(null)
const surveys = ref<Fm6MahasiswaSurveyItem[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await repository.getAllMahasiswaSurveys()
    if (res) {
      surveys.value = res
    }
  } catch (error: any) {
    console.error('Gagal memuat daftar survei global:', error)
    errorMessage.value = error?.message || 'Terjadi kesalahan saat memuat survei.'
  } finally {
    loading.value = false
  }
})

function buildDetailRoute(survey: Fm6MahasiswaSurveyItem): string {
  // Extract periodeModulId and unitId added from the backend
  const pmId = (survey as any).periodeModulId
  const uId = (survey as any).unitId
  if (!pmId || !uId) {
    // Fallback if missing
    return '/dashboard/survei'
  }
  return `/dashboard/periode-modul/${encodeURIComponent(pmId)}/unit/${encodeURIComponent(uId)}/fm6/jawab/${encodeURIComponent(survey.id)}`
}

function goToSurvey(survey: Fm6MahasiswaSurveyItem) {
  router.push(buildDetailRoute(survey))
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6 md:py-10 lg:px-8">
    <div class="mb-8 rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-6 py-6 shadow-[0_2px_6px_rgba(15,23,42,0.1)]">
      <h1 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
        {{ t('dasborModul.survei.judul', 'Daftar Survei Mahasiswa') }}
      </h1>
      <p class="mt-2 text-[#5b6679]">
        {{ t('dasborModul.survei.deskripsi', 'Daftar survei yang tersedia untuk diisi.') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#e30000] border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="rounded-[16px] border border-[#fecaca] bg-[#fef2f2] px-6 py-12 text-center shadow-sm">
      <h3 class="text-xl font-medium text-[#ef4444]">Gagal Memuat Data</h3>
      <p class="mt-2 text-[#b91c1c]">{{ errorMessage }}</p>
      <p class="mt-4 text-sm text-[#991b1b]">Pastikan backend Anda telah direstart agar perubahan API terbaru dapat dimuat.</p>
    </div>

    <!-- List -->
    <div v-else-if="surveys.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="survey in surveys"
        :key="survey.id"
        class="flex flex-col justify-between rounded-[16px] border border-[#dce1e8] bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
      >
        <div>
          <div class="mb-3 flex items-start justify-between gap-3">
            <h3 class="text-[1.15rem] font-semibold text-[#11141b] line-clamp-2 md:text-[1.25rem]">
              {{ survey.judul }}
            </h3>
            <span
              v-if="survey.sudahDijawab"
              class="inline-flex shrink-0 items-center rounded-full bg-[#ecfdf3] px-2.5 py-0.5 text-xs font-medium text-[#027a48]"
            >
              Selesai
            </span>
            <span
              v-else
              class="inline-flex shrink-0 items-center rounded-full bg-[#fff2f2] px-2.5 py-0.5 text-xs font-medium text-[#e30000]"
            >
              Belum Mengisi
            </span>
          </div>
          <p class="mb-4 text-[0.95rem] text-[#5b6679] line-clamp-3">
            {{ survey.deskripsi }}
          </p>
          <div class="mb-4 flex items-center gap-2 text-sm text-[#7a8392]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Dibuat: {{ new Date(survey.createdAt).toLocaleDateString('id-ID') }}</span>
          </div>
        </div>

        <button
          type="button"
          class="mt-4 flex w-full items-center justify-center rounded-[12px] px-4 py-2.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#e30000] hover:bg-[#ca0000] focus:ring-[#e30000]"
          @click="goToSurvey(survey)"
        >
          {{ survey.sudahDijawab ? 'Lihat Jawaban' : 'Isi Survei' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-[16px] border border-[#dce1e8] bg-white px-6 py-12 text-center shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 h-16 w-16 text-[#a1a1aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="text-xl font-medium text-[#3f3f46]">Belum Ada Survei</h3>
      <p class="mt-2 text-[#71717a]">Saat ini tidak ada survei aktif yang perlu Anda isi.</p>
    </div>
  </section>
</template>
