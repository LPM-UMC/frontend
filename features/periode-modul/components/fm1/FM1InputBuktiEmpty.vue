<template>
  <div class="flex flex-col items-center justify-center rounded-[12px] border border-[#e2e6ec] bg-white px-6 py-10 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:py-14 text-center">
    
    <div class="flex h-15 w-15 items-center justify-center rounded-full bg-[#f4f6f8] text-[#8a94a6] sm:h-17 sm:w-17">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-9 sm:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>

    <h3 class="mt-5 text-[17px] font-bold text-[#1a202c] sm:text-[19px]">
      {{ $t('fmMonitoring.buktiInstrumen.judulInput') }}
    </h3>

    <p class="mt-2 max-w-115 text-[13px] leading-relaxed text-[#718096]">
      {{ $t('fmMonitoring.buktiInstrumen.deskripsiInput') }}
    </p>

    <NuxtLink :to="localePath(`/dashboard/periode-modul/${route.params.periode_modul_id}/unit/${route.params.unit_id}/fm1/bukti`)">
      <button 
        class="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-[8px] bg-[#e30000] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#c90000] sm:px-8" >
      {{ $t('fmMonitoring.buktiInstrumen.mulaiInput') }}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </NuxtLink>

  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#imports'
const route = useRoute()
const localePath = useLocalePath()
</script>
