<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, navigateTo } from '#imports'
import { useFm1Store } from '#stores/fm1'

const route = useRoute()
const fm1Store = useFm1Store()

import type { BuktiInstrumenDetailResponse } from '#types/fm1'

const props = defineProps<{
  bukti: BuktiInstrumenDetailResponse
}>()

const fileUrl = computed(() => props.bukti.bukti_instrumen?.link || '-')
const senderNote = computed(() => props.bukti.bukti_instrumen?.catatan || '-')

const submitDate = computed(() => {
  const dt = props.bukti.bukti_instrumen?.created_at;
  if (!dt) return '-';
  const dateObj = new Date(dt);
  return dateObj.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB';
})

function openLink() {
  if (fileUrl.value && fileUrl.value !== '-') {
    window.open(fileUrl.value, '_blank')
  }
}

const canInput = computed(() => {
  const status = fm1Store.informasi?.fm?.status_pelaksanaan?.kode;
  return status === 'SEDANG_BERLANGSUNG';
})

function handleEdit() {
  const pId = route.params.periode_modul_id as string
  const uId = route.params.unit_id as string
  navigateTo(`/dashboard/periode-modul/${pId}/unit/${uId}/fm1/bukti`)
}
</script>

<template>
  <div class="rounded-[12px] border border-[#e2e6ec] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5 lg:p-6">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-center gap-4">
        <!-- Icon -->
        <div class="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#ffebeb] text-[#e30000]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9h1.5m1.5 0H15m-6 4h6m-6 4h6" />
          </svg>
        </div>
        <!-- Title -->
        <div>
          <h3 class="text-[17px] font-bold text-[#1a202c]">Berkas Bukti Dukung</h3>
          <p class="mt-0.5 text-[12px] font-semibold uppercase tracking-wider text-[#9aa2b1]">DATA TERVERIFIKASI SISTEM</p>
        </div>
      </div>

      <!-- Status (Right) -->
      <div class="flex flex-col text-left sm:text-right">
        <p class="text-[12px] text-[#718096]">Submit: {{ submitDate }}</p>
        <div class="mt-1 flex items-center gap-1.5 sm:justify-end">
          <div class="h-2 w-2 rounded-full bg-[#00b341]"></div>
          <span class="text-[13px] font-bold text-[#00b341]">TEPAT WAKTU</span>
        </div>
        <p class="mt-1 text-[12px] italic text-[#a0aec0]">Batas akhir: 30 Mar 2026</p>
      </div>
    </div>

    <!-- Tautan Dokumen -->
    <div class="mt-6">
      <div class="flex items-center gap-1.5 text-[#8a94a6]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span class="text-[11px] font-bold uppercase tracking-wider">TAUTAN DOKUMEN</span>
      </div>
      
      <div class="mt-2 flex flex-col justify-between gap-3 rounded-[8px] bg-[#fff3f3] px-4 py-3 sm:flex-row sm:items-center">
        <span class="truncate text-[14px] font-medium text-[#e30000]">{{ fileUrl }}</span>
        <button 
          @click="openLink"
          class="shrink-0 cursor-pointer rounded-[6px] bg-[#e30000] px-5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#c90000]"
        >
          Lihat
        </button>
      </div>
    </div>

    <!-- Catatan Pengirim -->
    <div class="mt-5">
      <div class="flex items-center gap-1.5 text-[#8a94a6]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-[11px] font-bold uppercase tracking-wider">CATATAN PENGIRIM</span>
      </div>
      
      <div class="mt-2 rounded-[8px] border border-[#fce181] bg-[#fffdf0] px-4 py-4">
        <p class="text-[14px] italic text-[#4a5568]">
          {{ senderNote }}
        </p>
      </div>
    </div>

    <!-- Edit Button for Auditee -->
    <div v-if="fm1Store.isAuditee && canInput" class="mt-6 flex justify-end border-t border-[#e2e6ec] pt-5">
      <button 
        @click="handleEdit" 
        class="flex items-center gap-2 rounded-[8px] border border-[#e30000] bg-white px-5 py-2 text-[13px] font-semibold text-[#e30000] transition hover:bg-[#fff3f3] cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Ubah Berkas Bukti
      </button>
    </div>
  </div>
</template>
