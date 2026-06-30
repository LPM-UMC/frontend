<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useLocalePath, useRequestURL } from '#imports'
import QrcodeVue from 'qrcode.vue'
import { useFm5Repository } from '../../composables/useFm5Repository'
import type { Fm5DetailResponse, TandaTanganStatus, Fm5Lampiran } from '../../services/fm5.api'
import { useAuthStore } from '#stores/auth'
import { useI18n } from 'vue-i18n'
import { useFm5Store } from '#stores/fm5'

const route = useRoute()
const repository = useFm5Repository()
const authStore = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()
const requestUrl = useRequestURL()
const fm5Store = useFm5Store()

const loading = ref(true)
const detailData = ref<Fm5DetailResponse | null>(null)

const isSanggahModalOpen = ref(false)
const sanggahMessage = ref('')
const processingAction = ref(false)

const isDownloadingPdf = ref(false)

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

const beritaAcaraId = computed(() =>
  normalizeRouteParam(route.params.berita_acara_id as string | string[] | undefined, '')
)

const periodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined, '')
)

const unitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined, '')
)

function buildDashboardRoute() {
  return {
    name: 'dashboard-periode-modul-periode_modul_id-unit-unit_id-fm5',
    params: {
      periode_modul_id: periodeModulId.value,
      unit_id: unitId.value
    }
  }
}

const breadcrumbItems = computed(() => {
  const isAmi = fm5Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm5Store.informasi?.periode_modul?.modul?.nama || 'Form Berita Acara'
  
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
      label: 'Detail Berita Acara',
      active: true,
    },
  ]
})

watch(() => [periodeModulId.value, unitId.value], ([pId, uId]) => {
  if (pId && uId) {
    fm5Store.fetchInformasi(pId, uId)
  }
}, { immediate: true })

const isReviewRole = computed(() => {
  const roleCode = authStore.activeRole?.kode
  return ['kaprodi', 'gkmf', 'lpm', 'dekan'].includes(roleCode?.toLowerCase() || '')
})

const mySignatureStep = computed(() => {
  if (!detailData.value || !authStore.activeRole) return null
  return detailData.value.tandaTangans.find(step => step.roleId === authStore.activeRole!.id)
})

const hasActiveSanggahan = computed(() => {
  if (!detailData.value || !authStore.user) return false
  return detailData.value.sanggahans?.some(s => s.user.id === authStore.user!.id) || false
})

const canSign = computed(() => {
  if (!detailData.value) return false
  if (detailData.value.status === 'DISANGGAH') return false
  if (detailData.value.status === 'FINAL') return false
  if (!mySignatureStep.value) return false
  if (mySignatureStep.value.status === 'DITANDATANGANI') return false
  
  // Check if previous roles have signed
  const previousUnsigned = detailData.value.tandaTangans.find(
    step => step.urutan < mySignatureStep.value!.urutan && step.status !== 'DITANDATANGANI'
  )
  if (previousUnsigned) return false

  return true
})

const isGkmfRole = computed(() => {
  return authStore.activeRole?.kode?.toLowerCase()?.includes('gkmf') || false
})

const canEditLampiran = computed(() => {
  if (!detailData.value) return false
  return isGkmfRole.value && detailData.value.status === 'DISANGGAH'
})

function resolveFlowIconClass(status: TandaTanganStatus) {
  if (status === 'DITANDATANGANI') return 'border-[#19b45a] text-[#19b45a]'
  if (status === 'MENUNGGU') return 'border-[#e30000] text-[#e30000]'
  return 'border-[#a5afbd] text-[#a5afbd]'
}

async function handleSign() {
  if (!mySignatureStep.value) return
  if (!confirm('Apakah Anda yakin ingin menandatangani dokumen ini?')) return

  processingAction.value = true
  try {
    await repository.signBeritaAcara(beritaAcaraId.value, {
      roleId: authStore.activeRole!.id
    })
    await fetchDetail()
  } catch (error) {
    console.error(error)
    alert('Gagal menandatangani berita acara.')
  } finally {
    processingAction.value = false
  }
}

async function handleTarikSanggahan() {
  if (!confirm('Apakah Anda yakin ingin menarik sanggahan ini?')) return

  processingAction.value = true
  try {
    await repository.tarikSanggahan(beritaAcaraId.value, {
      roleId: authStore.activeRole!.id
    })
    await fetchDetail()
  } catch (error) {
    console.error(error)
    alert('Gagal menarik sanggahan.')
  } finally {
    processingAction.value = false
  }
}

function openSanggahModal() {
  sanggahMessage.value = ''
  isSanggahModalOpen.value = true
}

function closeSanggahModal() {
  isSanggahModalOpen.value = false
}

async function submitSanggahan() {
  if (!mySignatureStep.value || sanggahMessage.value.trim().length < 10) return

  processingAction.value = true
  try {
    await repository.submitSanggahan(beritaAcaraId.value, {
      roleId: authStore.activeRole!.id,
      pesan: sanggahMessage.value.trim()
    })
    closeSanggahModal()
    await fetchDetail()
  } catch (error) {
    console.error(error)
    alert('Gagal mengirim sanggahan.')
  } finally {
    processingAction.value = false
  }
}

async function fetchDetail() {
  if (!beritaAcaraId.value) return
  loading.value = true
  try {
    detailData.value = (await repository.getDetailData(beritaAcaraId.value)) || null
  } catch (error) {
    console.error('Failed to load detail', error)
  } finally {
    loading.value = false
  }
}

const lampirans = ref<Fm5Lampiran[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

async function fetchLampirans() {
  if (!beritaAcaraId.value) return
  try {
    lampirans.value = (await repository.getLampirans(beritaAcaraId.value)) || []
  } catch (error) {
    console.error('Failed to load lampirans', error)
  }
}

async function handleUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    alert('Hanya file PDF yang diperbolehkan.')
    return
  }

  isUploading.value = true
  try {
    await repository.uploadLampiran(beritaAcaraId.value, file)
    await fetchLampirans()
  } catch (error) {
    console.error(error)
    alert('Gagal mengunggah lampiran')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleViewLampiran(lampiran: Fm5Lampiran) {
  try {
    const url = await repository.getLampiranUrl(beritaAcaraId.value, lampiran.id)
    window.open(url, '_blank')
  } catch (error) {
    console.error(error)
    alert('Gagal membuka lampiran')
  }
}

async function handleDownloadPdf() {
  isDownloadingPdf.value = true
  try {
    const token = authStore.accessToken
    const response = await fetch(`/api/fm5/pdf/${beritaAcaraId.value}?token=${token}`)
    
    if (!response.ok) {
      throw new Error(await response.text())
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Berita_Acara_${detailData.value?.nomor?.replace(/\//g, '_') || detailData.value?.id || 'Doc'}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    console.error('Failed to generate PDF', error)
    alert(`Gagal menghasilkan PDF: ${error?.message || error}`)
  } finally {
    isDownloadingPdf.value = false
  }
}

async function handleDeleteLampiran(lampiranId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus lampiran ini?')) return
  
  try {
    await repository.deleteLampiran(beritaAcaraId.value, lampiranId)
    await fetchLampirans()
  } catch (error) {
    console.error(error)
    alert('Gagal menghapus lampiran')
  }
}

watch(beritaAcaraId, () => {
  fetchDetail()
  fetchLampirans()
}, { immediate: true })
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header with Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-5 px-4 md:px-5 xl:px-6 pt-4 print:hidden">
      <NuxtLink :to="localePath(buildDashboardRoute() as any)">
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

    <section class="fm5-page print:!px-0 print:!mx-0 print:!max-w-none print:w-full mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="detailData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden"
    >
      <div>
        <h1 class="text-[clamp(1.55rem,2.05vw,2.45rem)] font-semibold leading-tight text-[#10131b]">
          Berita Acara {{ fm5Store.informasi?.periode_modul?.modul?.nama || 'Monitoring dan Evaluasi Awal Pembelajaran' }}
        </h1>
        <p class="mt-3 max-w-[1400px] text-[clamp(0.95rem,1.02vw,1.25rem)] leading-relaxed text-[#5b6679]">
          Dokumen ini merepresentasikan berita acara untuk pelaksanaan evaluasi di program studi {{ detailData.programStudi }}.
        </p>
      </div>
      
      <button
        type="button"
        @click="handleDownloadPdf"
        :disabled="isDownloadingPdf"
        class="inline-flex h-[46px] min-w-[150px] items-center justify-center gap-2 rounded-[14px] bg-[#e30000] px-5 text-sm font-semibold text-white transition hover:bg-[#c90000] shrink-0 disabled:opacity-70"
      >
        <UIcon :name="isDownloadingPdf ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-down-tray'" :class="isDownloadingPdf ? 'animate-spin' : ''" class="h-5 w-5" />
        {{ isDownloadingPdf ? 'Memproses PDF...' : 'Unduh PDF' }}
      </button>
    </section>

    <section
      v-if="detailData"
      class="space-y-4 print:space-y-0"
    >
      <article
        class="px-4 py-7 sm:px-5 md:px-12 md:py-16 font-['Times_New_Roman',_Times,_serif] text-black print:!border-none print:!shadow-none print:!p-0 print:!bg-transparent print:m-0 print:w-full print:block"
        :class="isReviewRole
          ? 'rounded-[24px] border-[3px] border-[#11141b] bg-white'
          : 'rounded-[16px] border border-[#d8dce2] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.1)]'"
      >
        <header class="text-center text-black">
          <p class="mx-auto mt-2 max-w-[980px] text-[clamp(1.1rem,1.15vw,1.4rem)] leading-relaxed font-bold">BERITA ACARA</p>
          <p class="mx-auto mt-2 max-w-[980px] text-[clamp(1.1rem,1.15vw,1.4rem)] leading-relaxed font-bold uppercase">{{ fm5Store.informasi?.periode_modul?.modul?.nama || 'MONITORING DAN EVALUASI AWAL PEMBELAJARAN' }}</p>
          <p class="mx-auto mt-2 max-w-[980px] text-[clamp(1.1rem,1.15vw,1.4rem)] leading-relaxed font-bold">UNIVERSITAS MUHAMMADIYAH CIREBON</p>
        </header>

        <div class="mt-10 space-y-4 text-[clamp(1rem,1.05vw,1.25rem)] leading-[1.8] text-black">
          <p>
            Pada hari ini <strong>{{ detailData.hari }}</strong> tanggal <strong>{{ new Date(detailData.tanggalPelaksanaan).getDate() }}</strong> bulan <strong>{{ detailData.bulan }}</strong> tahun <strong>{{ detailData.tahun }}</strong> Telah dilaksanakan {{ (fm5Store.informasi?.periode_modul?.modul?.nama || 'monitoring dan evaluasi awal pembelajaran').toLowerCase() }} Semester <strong>{{ detailData.semester }}</strong> pada Program Studi <strong>{{ detailData.programStudi }}</strong>.
          </p>
          <p>Dengan hasil terlampir.</p>
          <p>Demikian berita acara ini dibuat sebagai bahan evaluasi pelaksanaan pembelajaran.</p>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-y-12 gap-x-6 md:gap-x-12">
          <div v-for="ttd in detailData.tandaTangans" :key="ttd.id" class="text-center text-[#3e4a5f] flex flex-col items-center h-full">
            <div class="min-h-[48px] flex flex-col justify-end">
              <p v-if="ttd.urutan === 2" class="text-[clamp(1rem,1.05vw,1.2rem)]">Cirebon, {{ new Date(detailData.tanggalPelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
              <p v-else-if="ttd.urutan === 3" class="text-[clamp(1rem,1.05vw,1.2rem)]">Menyetujui,</p>
              <p v-else-if="ttd.urutan === 4" class="text-[clamp(1rem,1.05vw,1.2rem)]">Mengetahui,</p>
              <p class="text-[clamp(1rem,1.05vw,1.2rem)] min-h-[24px]">{{ ttd.role.nama }}</p>
            </div>

            <div class="h-28 flex items-center justify-center my-3">
               <QrcodeVue
                 v-if="ttd.status === 'DITANDATANGANI'"
                 :value="`${requestUrl.origin}/verify/BeritaAcara/${detailData.id}?ttd=${ttd.id}`"
                 :size="95"
                 render-as="svg"
                 level="M"
                 class="print:scale-90"
               />
            </div>

            <p class="text-center text-[clamp(1rem,1.05vw,1.2rem)] font-bold border-b border-black inline-block px-2">
              {{ ttd.user?.nama || '(.............................................)' }}
            </p>
          </div>
        </div>

        <div v-if="detailData.dokumenTerverifikasi" class="mt-16 p-4 border rounded-xl flex items-center gap-4 text-black border-black/30">
          <div class="p-2 border rounded-lg border-black/30 flex items-center justify-center w-16 h-16">
             <UIcon name="i-heroicons-check-badge-solid" class="w-10 h-10" />
          </div>
          <div>
            <h4 class="font-bold">Dokumen Telah Terverifikasi</h4>
            <p class="text-sm font-mono mt-1 break-all">Digital Signature: {{ detailData.dokumenTerverifikasi.digitalSignature.substring(0, 32) }}...</p>
          </div>
        </div>
      </article>

      <template v-if="isReviewRole">
        <div class="print:hidden space-y-4">
          <article class="rounded-[20px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-7 md:py-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-[clamp(1.3rem,1.55vw,1.8rem)] font-semibold text-[#1a2233]">
                Lampiran Dokumen
              </h3>
              
              <input 
                type="file" 
                ref="fileInput" 
                accept="application/pdf" 
                class="hidden" 
                @change="handleUpload"
              />
              
              <button
                v-if="canEditLampiran"
                type="button"
                @click="fileInput?.click()"
                :disabled="isUploading"
                class="inline-flex h-[42px] items-center justify-center gap-2 rounded-[14px] bg-[#e30000] px-5 text-sm font-semibold text-white transition hover:bg-[#c90000] disabled:opacity-70"
              >
                <UIcon :name="isUploading ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-up-tray'" :class="isUploading ? 'animate-spin' : ''" class="h-5 w-5" />
                {{ isUploading ? 'Mengunggah...' : 'Upload Lampiran (PDF)' }}
              </button>
            </div>
          
          <div v-if="lampirans.length === 0" class="text-center py-6 border-2 border-dashed border-[#c5cbce] rounded-xl text-[#7a889b]">
            Belum ada lampiran yang diunggah.
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="lampiran in lampirans" 
              :key="lampiran.id"
              class="flex items-center justify-between p-4 bg-white border border-[#dce1e8] rounded-xl"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-[#e30000] shrink-0" />
                <div class="truncate">
                  <p class="font-semibold text-sm truncate text-[#2f3744]" :title="lampiran.nama_file">{{ lampiran.nama_file }}</p>
                  <p class="text-xs text-[#7e8c9d]">{{ (lampiran.ukuran / 1024).toFixed(1) }} KB</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button 
                  type="button" 
                  @click="handleViewLampiran(lampiran)"
                  class="inline-flex items-center gap-1 text-[#e30000] hover:underline text-sm font-medium px-2"
                >
                  Lihat
                </button>
                <button 
                  v-if="canEditLampiran"
                  type="button" 
                  @click="handleDeleteLampiran(lampiran.id)"
                  class="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-[#e30000] hover:bg-red-50 rounded-lg transition"
                  title="Hapus Lampiran"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      
        <article class="rounded-[20px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-7 md:py-6">
          <h3 class="text-[clamp(1.3rem,1.55vw,1.8rem)] font-semibold text-[#1a2233]">
            Status Alur Tanda Tangan:
          </h3>

          <div class="mt-5 space-y-4">
            <article
              v-for="item in detailData.tandaTangans"
              :key="item.id"
              class="flex items-start gap-3"
            >
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white"
                :class="resolveFlowIconClass(item.status)"
              >
                <svg
                  v-if="item.status === 'DITANDATANGANI'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                </svg>
              </span>

              <div>
                <p class="text-[clamp(0.98rem,1.05vw,1.12rem)] font-medium text-[#1f2937]">
                  {{ item.role.nama }}
                </p>
                <p class="text-[clamp(0.86rem,0.95vw,0.98rem)] text-[#6b7280]">
                  {{ item.status === 'DITANDATANGANI' ? 'Ditandatangani pada ' + new Date(item.signedAt!).toLocaleString() : 'Menunggu tanda tangan' }}
                </p>
              </div>
            </article>
          </div>

          <div v-if="detailData.sanggahans && detailData.sanggahans.length > 0" class="mt-7 border-t border-[#dfe3eb] pt-5">
             <h4 class="text-red-700 font-bold mb-3">Riwayat Sanggahan</h4>
             <div class="space-y-3">
               <div v-for="sanggah in detailData.sanggahans" :key="sanggah.id" class="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p class="text-sm font-semibold text-red-800">{{ sanggah.user.nama }} - {{ new Date(sanggah.createdAt).toLocaleString() }}</p>
                  <p class="text-sm text-red-700 mt-1">{{ sanggah.pesan }}</p>
               </div>
             </div>
          </div>

          <div v-if="canSign || hasActiveSanggahan" class="border-t border-[#d8dde6] pt-6">
          <div class="flex flex-wrap justify-center gap-3">
            <template v-if="!hasActiveSanggahan">
              <button
                type="button"
                :disabled="!canSign || processingAction"
                class="inline-flex h-[48px] min-w-[176px] items-center justify-center rounded-[14px] bg-[#e30000] px-6 text-[clamp(0.95rem,1vw,1.12rem)] font-semibold text-white transition hover:bg-[#ca0000] disabled:opacity-70 md:h-[52px] md:min-w-[210px] md:rounded-[18px] md:px-8"
                @click="handleSign"
              >
                {{ processingAction ? t('fm5.detail.processing', 'Memproses...') : t('fm5.detail.sign', 'Tanda Tangani') }}
              </button>
              <button
                type="button"
                :disabled="processingAction"
                class="inline-flex h-[48px] min-w-[150px] items-center justify-center rounded-[14px] border border-[#c7ced9] bg-white px-6 text-[clamp(0.95rem,1vw,1.12rem)] font-semibold text-[#3e4a5e] transition hover:bg-[#f6f8fb] disabled:opacity-70 md:h-[52px] md:min-w-[170px] md:rounded-[18px] md:px-8"
                @click="openSanggahModal"
              >
                {{ t('fm5.detail.reject', 'Sanggah') }}
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                :disabled="processingAction"
                class="inline-flex h-[48px] min-w-[176px] items-center justify-center rounded-[14px] border border-orange-500 bg-orange-50 px-6 text-[clamp(0.95rem,1vw,1.12rem)] font-semibold text-orange-600 transition hover:bg-orange-100 disabled:opacity-70 md:h-[52px] md:min-w-[210px] md:rounded-[18px] md:px-8"
                @click="handleTarikSanggahan"
              >
                {{ processingAction ? t('fm5.detail.processing', 'Memproses...') : t('fm5.detail.pullReject', 'Tarik Sanggahan') }}
              </button>
            </template>
          </div>
        </div>
        </article>
        </div>
      </template>
    </section>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e] flex justify-center">
       <div class="h-8 w-8 animate-spin rounded-full border-4 border-[#e30000] border-t-transparent"></div>
    </section>

    <div
      v-if="isReviewRole && isSanggahModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4"
    >
      <article class="w-full max-w-[1280px] rounded-[18px] border border-[#d0d6de] bg-[#f0f0f0] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.28)] md:rounded-[20px] md:p-7">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-[clamp(1.2rem,1.5vw,1.75rem)] font-semibold text-[#354257]">
            {{ t('fm5.detail.rejectMessage', 'Masukkan Pesan Sanggahan') }}
          </h3>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#566175] transition hover:bg-white/70"
            @click="closeSanggahModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <textarea
          v-model="sanggahMessage"
          rows="5"
          :placeholder="t('fm5.detail.rejectPlaceholder', 'Tuliskan alasan penolakan dokumen ini...')"
          class="mt-5 w-full rounded-[14px] border border-[#c7ced8] bg-[#f7f7f8] px-4 py-4 text-[clamp(0.95rem,1.02vw,1.15rem)] leading-relaxed text-[#151b27] outline-none md:rounded-[16px] md:px-5 md:py-5"
        />

        <button
          type="button"
          :disabled="processingAction || sanggahMessage.trim().length < 10"
          class="mt-5 inline-flex h-[48px] w-full items-center justify-center rounded-[14px] bg-[#e30000] px-6 text-[clamp(1rem,1.15vw,1.3rem)] font-semibold text-white transition hover:bg-[#ca0000] disabled:opacity-70 md:h-[52px] md:rounded-[16px] md:px-8"
          @click="submitSanggahan"
        >
          {{ processingAction ? t('fm5.detail.sending', 'Mengirim...') : (sanggahMessage.trim().length < 10 ? 'Minimal 10 karakter' : t('fm5.detail.sendReject', 'Kirim Sanggahan')) }}
        </button>
      </article>
    </div>
  </div>
</template>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm;
  }
  body, html {
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  aside, header, nav, .print\:hidden {
    display: none !important;
  }
  main, .fm5-page {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }
}
</style>
