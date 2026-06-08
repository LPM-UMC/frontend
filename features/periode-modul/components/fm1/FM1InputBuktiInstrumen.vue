<template>
  <article class="rounded-[16px] border border-[#d9dde4] bg-[#f2f3f5] p-2.5 sm:p-3">
    <div class="flex flex-col items-center justify-center rounded-[14px] border border-[#e1e4ea] bg-[#f6f7f8] px-2.5 py-6 text-center sm:px-5 sm:py-8">
      <span class="grid h-14 w-14 place-items-center rounded-full bg-[#e6e8ed] text-[#98a1b0] sm:h-16 sm:w-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-7.5A2.25 2.25 0 0 0 17.25 4.5H8.25A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5h7.5A2.25 2.25 0 0 0 18 17.25m1.5-3L15 9.75m0 0V14.25m0-4.5h4.5" />
        </svg>
      </span>

      <h3 class="mt-4 text-[14px] font-bold leading-tight text-[#111a2f] sm:text-[18px] lg:text-[20px]">
        Input Bukti Instrumen
      </h3>

      <p class="mt-2 max-w-190 text-[12px] leading-relaxed text-[#6b7487] sm:text-[13px] lg:text-[14px]">
        Silakan unggah file bukti dokumen dalam bentuk excel maupun upload dokumen
      </p>
      <p class="mt-1 text-[12px] font-medium tracking-wide text-[#9aa3b2] sm:text-[13px] lg:text-[14px]">
        BATAS UKURAN 10 MAKS (20 MB)
      </p>

      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2.5 rounded-[14px] bg-[#e60000] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 sm:px-6 sm:py-3 sm:text-[15px]"
        @click="goToBuktiPage"
      >
        Mulai Input Bukti
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
</script>
