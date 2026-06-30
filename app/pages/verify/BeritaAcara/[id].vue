<template>
  <div class="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
    <div class="max-w-3xl w-full bg-white rounded-[20px] shadow-xl overflow-hidden border border-gray-100 mt-8">
      <!-- Header -->
      <div 
        :class="[
          'px-6 py-10 text-center',
          !detailData ? 'bg-[#16a34a]' : (detailData.status === 'FINAL' ? 'bg-[#16a34a]' : 'bg-orange-500')
        ]"
      >
        <div class="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-5">
          <UIcon v-if="loading" name="i-heroicons-ellipsis-horizontal" class="w-12 h-12 text-gray-400 animate-pulse" />
          <UIcon v-else-if="!detailData" name="i-heroicons-x-mark" class="w-12 h-12 text-[#e60000]" stroke-width="2" />
          <UIcon v-else-if="detailData.status === 'FINAL'" name="i-heroicons-check-badge-solid" class="w-12 h-12 text-green-600" />
          <UIcon v-else name="i-heroicons-clock-solid" class="w-12 h-12 text-orange-500" />
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">
          {{ loading ? 'Memverifikasi...' : 
             (!detailData ? 'Dokumen Tidak Valid' : 
             (detailData.status === 'FINAL' ? 'Dokumen Terverifikasi' : 'Sedang Diproses')) }}
        </h1>
        <p class="text-white/90 mt-3 text-[15px] font-medium max-w-xl mx-auto">Sistem Informasi Monitoring dan Evaluasi Terintegrasi (SI-IMOET) Universitas Muhammadiyah Cirebon</p>
      </div>

      <!-- Content -->
      <div v-if="loading" class="p-16 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin mx-auto text-gray-400" />
        <p class="mt-4 text-gray-500 font-medium">Memverifikasi keaslian dokumen...</p>
      </div>
      
      <div v-else-if="detailData" class="p-8 md:p-10">
        <div class="mb-8 pb-8 border-b border-gray-100">
          <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Informasi Dokumen</h2>
          <h3 class="text-[22px] font-bold text-gray-900 leading-tight mb-2">Berita Acara Monitoring dan Evaluasi Awal Pembelajaran</h3>
          <p class="text-gray-600 font-medium">Nomor: {{ detailData.nomor || '-' }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-10">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Program Studi</p>
            <p class="text-gray-900 font-semibold text-[15px]">{{ detailData.programStudi }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Pelaksanaan</p>
            <p class="text-gray-900 font-semibold text-[15px]">
              {{ detailData.hari }}, {{ new Date(detailData.tanggalPelaksanaan).getDate() }} {{ detailData.bulan }} {{ detailData.tahun }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Semester</p>
            <p class="text-gray-900 font-semibold text-[15px]">{{ detailData.semester }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Dokumen</p>
            <span v-if="detailData.status === 'FINAL'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
              Valid & Terdaftar
            </span>
            <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
              Menunggu TTD
            </span>
          </div>
        </div>

        <div>
          <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Daftar Penandatangan Digital</h2>
          <div class="space-y-3">
            <div v-for="ttd in detailData.tandaTangans.filter((t: any) => t.status === 'DITANDATANGANI')" :key="ttd.id" 
              class="flex items-center p-4 bg-[#f8fafc] rounded-[14px] border border-gray-100">
              <div class="flex-shrink-0 w-11 h-11 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <UIcon name="i-heroicons-check" class="w-6 h-6 text-green-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-bold text-gray-900 truncate">{{ ttd.user?.nama || 'Telah Ditandatangani' }}</p>
                <p class="text-[13px] font-medium text-gray-500 truncate">{{ ttd.role.nama }}</p>
              </div>
              <div class="text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <p>Digital Signature Valid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-16 text-center">
        <h2 class="text-2xl font-bold text-gray-900">Data Tidak Ditemukan</h2>
        <p class="text-gray-500 mt-2 font-medium">QR Code ini tidak terdaftar atau dokumen telah dibatalkan.</p>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-8 py-5 border-t border-gray-100 text-center">
        <p class="text-[13px] font-medium text-gray-400 leading-relaxed max-w-xl mx-auto">
          Dokumen ini diterbitkan oleh Universitas Muhammadiyah Cirebon dan dijamin keasliannya melalui sistem rekam jejak digital internal.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'
import { useFm5Repository } from '#features/periode-modul/composables/useFm5Repository'
import type { Fm5DetailResponse } from '#features/periode-modul/services/fm5.api'

definePageMeta({
  layout: false,
})

const route = useRoute()
const repository = useFm5Repository()

const loading = ref(true)
const detailData = ref<Fm5DetailResponse | null>(null)

const documentId = route.params.id as string

onMounted(async () => {
  if (documentId) {
    try {
      detailData.value = await repository.verifyPublicData(documentId)
    } catch (e) {
      console.error('Gagal mengambil data verifikasi', e)
    }
  }
  loading.value = false
})
</script>
