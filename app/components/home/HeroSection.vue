<!-- components/home/HeroSection.vue -->
<template>
  <section
    class="overflow-x-hidden bg-[#f9fafb] py-8 sm:py-10 md:py-14"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <div
      class="mx-auto flex w-full max-w-470 flex-col items-center justify-between gap-7 px-4 sm:px-5 md:gap-9 md:px-6 lg:gap-12 lg:px-8 xl:px-10 2xl:px-12"
      :class="isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'"
    >
      <!-- Text -->
      <div
        class="w-full max-w-180 space-y-3.5 bg-[#f9fafb] lg:max-w-[54%]"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <h1 class="text-[1.55rem] font-bold leading-tight sm:text-[1.8rem] md:text-[2.1rem] xl:text-[2.4rem]">
          <span class="block text-[#000000]">
            {{ $t('beranda.heroSection.selamatDatang') }}
          </span>
        </h1>

        <h1 class="text-[1.55rem] font-bold leading-tight sm:text-[1.8rem] md:text-[2.1rem] xl:text-[2.4rem]">
          <span class="block text-[#e30613]">
            {{ $t('basic.namaAplikasi') }}
          </span>
        </h1>

        <p class="text-[1rem] font-semibold text-gray-900 sm:text-[1.15rem] md:text-[1.35rem] xl:text-[1.55rem]">
          {{ $t('basic.namaKampus') }}
        </p>

        <p class="max-w-170 leading-relaxed text-[13px] text-gray-600 sm:text-sm md:text-[0.95rem]">
          {{ $t('beranda.heroSection.deskripsi') }}
        </p>

        <div
          class="flex w-full flex-col gap-2.5 pt-1.5 sm:gap-3 sm:pt-2"
          :class="isRTL
            ? 'items-end sm:flex-row-reverse sm:justify-end'
            : 'items-start sm:flex-row sm:justify-start'"
        >
          <NuxtLink
            :to="localePath('/dashboard')"
            class="inline-flex min-h-10.5 w-full items-center justify-center rounded-full bg-[#e30613] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c10510] sm:w-auto sm:px-6 transition"
          >
            {{ $t('beranda.heroSection.infoMonev') }}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/profile/struktur-organisasi')"
            class="inline-flex min-h-10.5 w-full items-center justify-center rounded-full bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-300 sm:w-auto sm:px-6 transition"
          >
            {{ $t('beranda.heroSection.tentang') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Gambar -->
      <div class="flex w-full justify-center lg:max-w-[44%]">
        <img
          src="/img/gedung-umc.jpg"
          :alt="$t('basic.namaKampus')"
          class="h-50 w-full max-w-620 rounded-[18px] object-cover shadow-[0_20px_40px_rgba(15,23,42,0.18)] sm:h-62.5 sm:rounded-[20px] md:h-80 lg:h-90 xl:h-105"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const localePath = useLocalePath()
const { locale } = useI18n()

const isRTL = computed(() => locale.value === 'ar')
</script>
