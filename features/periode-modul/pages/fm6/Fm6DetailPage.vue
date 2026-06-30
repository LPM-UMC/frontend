<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useFm6Repository } from '../../composables/useFm6Repository'
import type { Fm6DetailResponse, SurveyStatus, Fm6ChartBar } from '../../services/fm6.api'
import { useAuthStore } from '#stores/auth'
import { useFm6Store } from '#stores/fm6'

const route = useRoute()
const router = useRouter()
const repository = useFm6Repository()
const toast = useToast()
const authStore = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()
const fm6Store = useFm6Store()

const detailData = ref<Fm6DetailResponse | null>(null)
const loading = ref(true)
const updatingStatus = ref(false)

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)
const detailId = computed(() => route.params.detail_id as string)

function resolveBarToneClass(tone: Fm6ChartBar['tone']): string {
  if (tone === 'weak') return 'bg-[linear-gradient(90deg,#ef8d8d_0%,#f96c71_100%)]'
  if (tone === 'medium') return 'bg-[linear-gradient(90deg,#ff6267_0%,#ff3545_100%)]'
  if (tone === 'strong') return 'bg-[linear-gradient(90deg,#ff1630_0%,#ff0015_100%)]'
  return 'bg-[linear-gradient(90deg,#f40010_0%,#de0000_100%)]'
}

function resolveBarWidth(value: number): string {
  const maxScale = 4 // Asumsi skala maksimal bobot adalah 4 (Sangat Setuju)
  const percentage = Math.max(0, Math.min(100, (value / maxScale) * 100))
  return `${percentage}%`
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    AKTIF: 'Aktif',
    SELESAI: 'Selesai',
  }
  return map[status] || status
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'bg-gray-200 text-gray-700',
    AKTIF: 'bg-green-100 text-green-700',
    SELESAI: 'bg-blue-100 text-blue-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(isoDate: string) {
  if (!isoDate) return '-'
  return new Date(isoDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const canManageSurvey = computed(() => {
  const role = authStore.activeRole?.kode
  return role === 'admin-lpm' || role === 'lpm' || role === 'ketua-lpm'
})

function buildDashboardRoute() {
  return {
    name: 'dashboard-periode-modul-periode_modul_id-unit-unit_id-fm6',
    params: {
      periode_modul_id: periodeModulId.value,
      unit_id: unitId.value
    }
  }
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await repository.getDetailData(detailId.value)
    if (res) {
      detailData.value = res
    }
  } catch (error) {
    console.error('Gagal memuat detail survei:', error)
  } finally {
    loading.value = false
  }
}

async function changeStatus(newStatus: SurveyStatus) {
  if (!detailData.value) return
  updatingStatus.value = true
  try {
    await repository.updateStatus(detailId.value, newStatus)
    toast.add({
      title: 'Status Berhasil Diubah',
      description: `Survei sekarang berstatus ${getStatusLabel(newStatus)}.`,
      color: 'success',
    })
    await fetchDetail()
  } catch (error) {
    console.error('Gagal mengubah status survei:', error)
  } finally {
    updatingStatus.value = false
  }
}

async function deleteSurvey() {
  if (!detailData.value) return
  if (!confirm('Apakah Anda yakin ingin menghapus survei ini? Data tidak dapat dikembalikan.')) return
  
  updatingStatus.value = true
  try {
    await repository.deleteSurvey(detailId.value)
    toast.add({
      title: 'Berhasil',
      description: 'Survei berhasil dihapus.',
      color: 'success',
    })
    router.push(`/dashboard/periode-modul/${periodeModulId.value}/unit/${unitId.value}/fm6`)
  } catch (error: any) {
    console.error('Gagal menghapus survei:', error)
    toast.add({
      title: 'Gagal',
      description: error?.data?.message || 'Terjadi kesalahan saat menghapus survei.',
      color: 'error',
    })
  } finally {
    updatingStatus.value = false
  }
}

watch(detailId, () => {
  if (detailId.value) fetchDetail()
  if (periodeModulId.value && unitId.value) {
    fm6Store.fetchInformasi(periodeModulId.value, unitId.value)
  }
}, { immediate: true })

const breadcrumbItems = computed(() => {
  const isAmi = fm6Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm6Store.informasi?.periode_modul?.modul?.nama || 'Form Survei'
  
  return [
    {
      label: t('navigasi.dasbor', 'Dasbor'),
      to: '/dashboard',
    },
    {
      label: isAmi ? t('ami.judul', 'AMI') : t('monev.judul', 'Monitoring dan Evaluasi'),
      to: isAmi ? '/dashboard/ami' : '/dashboard/monev',
    },
    {
      label: namaModul,
      to: buildDashboardRoute(),
    },
    {
      label: 'Detail Survei',
      active: true,
    },
  ]
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header with Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-5 px-4 md:px-5 xl:px-6 pt-4">
      <NuxtLink :to="localePath(buildDashboardRoute())">
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
          <NuxtLink v-if="item.to" :to="localePath(item.to as any)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
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

    <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
      <section
        v-if="detailData"
        class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
      >
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
                {{ detailData.judul }}
              </h1>
              <span :class="getStatusColor(detailData.status)" class="inline-block rounded-full px-3 py-1 text-[0.85rem] font-semibold mt-1">
                {{ getStatusLabel(detailData.status) }}
              </span>
            </div>
            
            <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
              {{ detailData.deskripsi }}
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-4 text-[0.95rem] text-[#6b7280]">
              <p>Program Studi: <strong class="text-[#374151]">{{ detailData.programStudi }}</strong></p>
              <span>|</span>
              <p>Dibuat: <strong class="text-[#374151]">{{ formatDate(detailData.createdAt) }}</strong></p>
              <span>|</span>
              <p>Total Pertanyaan: <strong class="text-[#374151]">{{ detailData.pertanyaans.length }}</strong></p>
            </div>
          </div>

          <div v-if="canManageSurvey" class="flex items-center gap-3 shrink-0">
            <template v-if="detailData.status === 'DRAFT'">
              <button
                type="button"
                :disabled="updatingStatus"
                class="inline-flex items-center justify-center rounded-[14px] bg-[#f0f2f5] px-5 py-2.5 text-[0.95rem] font-semibold text-[#424b59] transition hover:bg-[#e4e7ec] disabled:opacity-50"
                @click="router.push(`/dashboard/periode-modul/${periodeModulId}/unit/${unitId}/fm6/edit/${detailId}`)"
              >
                {{ t('fm6.detail.editSurvey', 'Edit Survei') }}
              </button>
              <button
                type="button"
                :disabled="updatingStatus"
                class="inline-flex items-center justify-center rounded-[14px] bg-green-600 px-5 py-2.5 text-[0.95rem] font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                @click="changeStatus('AKTIF')"
              >
                {{ t('fm6.detail.activateSurvey', 'Aktifkan Survei') }}
              </button>
            </template>
            <button
              v-if="detailData.status === 'AKTIF'"
              type="button"
              :disabled="updatingStatus"
              class="inline-flex items-center justify-center rounded-[14px] bg-blue-600 px-5 py-2.5 text-[0.95rem] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              @click="changeStatus('SELESAI')"
            >
              {{ t('fm6.detail.endSurvey', 'Akhiri Survei') }}
            </button>
            
            <button
              type="button"
              :disabled="updatingStatus"
              class="inline-flex items-center justify-center rounded-[14px] bg-red-600 px-5 py-2.5 text-[0.95rem] font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              @click="deleteSurvey"
            >
              {{ t('fm6.detail.deleteSurvey', 'Hapus Survei') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Analytics Section (Only when ACTIVE or SELESAI and has responses) -->
      <section
        v-if="detailData && detailData.totalResponden > 0"
        class="space-y-4"
      >
        <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('fm6.detail.summaryTitle', 'Ringkasan Hasil Survei') }}
          </h2>

          <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <article class="rounded-[16px] bg-[#f4f4f5] px-4 py-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-[clamp(1rem,1.08vw,1.3rem)] font-semibold text-[#484b51]">Total Responden</h3>
              </div>
              <p class="mt-3 text-[clamp(1.9rem,2.25vw,2.65rem)] font-semibold leading-none text-[#080b11]">
                {{ detailData.totalResponden }}
              </p>
              <p class="mt-3 text-[clamp(0.9rem,0.95vw,1.05rem)] text-[#2176a8]">Mahasiswa telah mengisi survei</p>
            </article>

            <article class="rounded-[16px] bg-[#f4f4f5] px-4 py-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-[clamp(1rem,1.08vw,1.3rem)] font-semibold text-[#484b51]">{{ t('fm6.detail.avgScore', 'Rata-rata Skor') }}</h3>
              </div>
              <p class="mt-3 text-[clamp(1.9rem,2.25vw,2.65rem)] font-semibold leading-none text-[#080b11]">
                {{ detailData.rataRataSkor }} <span class="text-xl text-gray-500 font-normal">/ 4.0</span>
              </p>
              <p class="mt-3 text-[clamp(0.9rem,0.95vw,1.05rem)] text-[#2176a8]">Skor rata-rata dari seluruh pertanyaan pilihan ganda</p>
            </article>
          </div>
        </section>

        <!-- Charts per Pertanyaan -->
        <section v-if="detailData.chartSections.length > 0" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('fm6.detail.avgScoreAnalysis', 'Analisis Rata-rata Skor') }}
          </h2>

          <article
            v-for="section in detailData.chartSections"
            :key="section.id"
            class="mt-4 rounded-[16px] border border-[#f0d6d6] bg-[#f4f4f5] px-4 py-5 md:px-6 md:py-6"
          >
            <h3 class="text-[clamp(1.25rem,1.55vw,1.8rem)] font-semibold text-[#1f293b]">
              {{ section.title }}
            </h3>

            <div class="mt-4 space-y-3">
              <div
                v-for="bar in section.bars"
                :key="bar.label"
                class="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3 md:grid-cols-[130px_minmax(0,1fr)] md:gap-4"
              >
                <p class="text-[clamp(0.96rem,1.05vw,1.15rem)] font-medium text-[#566276]">
                  {{ bar.label }}
                </p>

                <div class="relative h-[38px] overflow-hidden rounded-[16px] bg-[#e4e6ea] md:h-[42px]">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center justify-end rounded-[16px] pr-4 text-[clamp(0.95rem,1vw,1.1rem)] font-semibold text-white"
                    :class="resolveBarToneClass(bar.tone)"
                    :style="{ width: resolveBarWidth(bar.value) }"
                  >
                    {{ bar.value }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between pl-[110px] text-[clamp(0.88rem,0.95vw,1rem)] text-[#9aa3b3] md:pl-[130px]">
              <span>0.0</span>
              <span>1.0</span>
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
            </div>
          </article>
        </section>

        <!-- Pilihan Ganda Detailed Breakdown -->
        <section v-if="detailData.pertanyaans.some(p => p.tipe === 'PILIHAN_GANDA')" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('fm6.detail.pgAnalysis', 'Detail Persentase Pilihan Ganda') }}
          </h2>

          <article
            v-for="pertanyaan in detailData.pertanyaans.filter(p => p.tipe === 'PILIHAN_GANDA')"
            :key="pertanyaan.id"
            class="mt-4 rounded-[16px] border border-[#d8dce2] bg-white px-4 py-5 md:px-6 md:py-6 shadow-sm"
          >
            <h3 class="text-[clamp(1.15rem,1.4vw,1.6rem)] font-semibold text-[#1f293b]">
              {{ pertanyaan.urutan }}. {{ pertanyaan.pertanyaan }}
            </h3>

            <div class="mt-4 flex flex-col gap-3">
              <div
                v-for="opsi in pertanyaan.rekapPilihanGanda"
                :key="opsi.opsiId"
                class="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-xl bg-[#f8f9fa] border border-[#e4e6ea]"
              >
                <div class="flex items-center gap-3">
                  <span class="font-medium text-[#4b5563] text-[clamp(0.95rem,1vw,1.1rem)]">{{ opsi.label }}</span>
                  <span class="text-sm text-gray-400">({{ opsi.jumlah }} responden)</span>
                </div>
                <div class="flex items-center gap-3 md:w-[40%]">
                  <div class="h-2.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: opsi.persentase + '%' }"></div>
                  </div>
                  <span class="text-sm font-semibold text-gray-700 min-w-[3.5rem] text-right">{{ opsi.persentase }}%</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- Essay Answers Section -->
        <section v-if="detailData.pertanyaans.some(p => p.tipe === 'ESAI' && p.jawabanEsai && p.jawabanEsai.length > 0)" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('fm6.detail.essayAnalysis', 'Jawaban Esai Mahasiswa') }}
          </h2>

          <article
            v-for="pertanyaan in detailData.pertanyaans.filter(p => p.tipe === 'ESAI' && p.jawabanEsai && p.jawabanEsai.length > 0)"
            :key="pertanyaan.id"
            class="mt-4 rounded-[16px] border border-[#f0d6d6] bg-[#f4f4f5] px-4 py-5 md:px-6 md:py-6"
          >
            <h3 class="text-[clamp(1.15rem,1.4vw,1.6rem)] font-semibold text-[#1f293b]">
              {{ pertanyaan.urutan }}. {{ pertanyaan.pertanyaan }}
            </h3>

            <div class="mt-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="(jawaban, idx) in pertanyaan.jawabanEsai"
                :key="idx"
                class="rounded-[12px] bg-white border border-gray-200 p-4 shadow-sm"
              >
                <div class="flex gap-3 items-start">
                  <div class="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">
                    {{ idx + 1 }}
                  </div>
                  <p class="text-[#484b51] leading-relaxed text-[clamp(0.95rem,1vw,1.1rem)]">
                    {{ jawaban }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>
      </section>

      <!-- Empty State for Analytics -->
      <section v-if="detailData && detailData.totalResponden === 0" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-8 shadow-[0_2px_6px_rgba(15,23,42,0.1)] text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-[#a1a1aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-[#3f3f46]">{{ t('fm6.detail.noRespondents', 'Belum ada responden') }}</h3>
        <p class="mt-2 text-[#71717a]">{{ t('fm6.detail.noRespondentsDesc', 'Analisis data akan muncul setelah ada mahasiswa yang mengisi survei ini.') }}</p>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat detail FM6...
      </section>
    </section>
  </div>
</template>
