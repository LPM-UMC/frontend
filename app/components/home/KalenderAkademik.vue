<!-- components/AcademicCalendar.vue -->
<template>
<section
  class="overflow-x-hidden bg-gray-50"
  :dir="isRTL ? 'rtl' : 'ltr'"
>
    <!-- BATIK HEADER -->
    <div class="h-14 w-full sm:h-16 md:h-17.5">
      <div
        class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
      />
    </div>

    <div class="mx-auto w-full max-w-470 px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 xl:px-10 2xl:px-12">
      <!-- Judul + deskripsi -->
<header
  class="mb-6 md:mb-7"
  :class="isRTL ? 'text-right' : 'text-left'"
>
        <h1 class="text-[1.45rem] font-extrabold tracking-wide text-gray-900 uppercase sm:text-2xl md:text-3xl" >
            {{ $t('beranda.kalenderAkademik.judul') }}
        </h1>
        <p class="text-[0.95rem] font-semibold text-gray-800 sm:text-lg md:text-xl">
            {{ $t('basic.namaKampus') }}
        </p>
        <p class="mt-3 max-w-4xl text-[13px] text-gray-600 sm:text-sm md:text-base">
            {{ $t('beranda.kalenderAkademik.deskripsi') }}
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="pending" class="mt-4 flex justify-center py-10">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
      </div>

      <!-- PDF + label (dibikin seperti figma) -->
      <div v-else-if="embedUrl" class="mt-2 flex justify-center">
        <!-- Atur max width supaya viewer tidak terlalu lebar -->
        <div class="w-full max-w-7-xl">
          <div
            class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50"
          >
            <!-- Bar abu-abu di atas iframe -->
            <div
              class="bg-gray-800 text-gray-50 text-xs md:text-sm font-medium px-4 py-3"
            >
            {{ $t('beranda.kalenderAkademik.kalenderUniversitas') }}
            </div>

            <!-- Viewer PDF dari Google Drive -->
            <iframe
              :src="embedUrl"
              class="h-80 w-full sm:h-110 md:h-140 xl:h-162"
              allow="autoplay"
            />
          </div>

          <!-- Tombol buka di tab baru -->
<div
  class="flex pt-3"
  :class="isRTL ? 'justify-end sm:justify-start' : 'justify-start sm:justify-end'"
>
            <a
              :href="driveViewUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 text-xs md:text-sm text-white-700 bg-red-600 hover:bg-red-700"
            >
              {{ $t('beranda.kalenderAkademik.bukaDiTabBaru') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Fallback kalau belum ada file ID -->
      <div
        v-else
        class="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500"
      >
            {{ $t('beranda.kalenderAkademik.belumTersedia') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAsyncData, useRuntimeConfig } from '#imports'

const { locale } = useI18n()
const config = useRuntimeConfig()

const isRTL = computed(() => locale.value === 'ar')

const baseURL = computed(() =>
  ((config.public.apiBaseUrl as string) || 'http://localhost:3001').replace(/\/api\/?$/, '')
)

const { data, pending } = await useAsyncData('active-periode', () =>
  $fetch<{ data: { kalender?: any } }>(`${baseURL.value}/api/periode/aktif`)
    .catch(() => ({ data: null }))
)

const hasActiveCalendar = computed(() => !!data.value?.data?.kalender)

const embedUrl = computed(() =>
  hasActiveCalendar.value
    ? `${baseURL.value}/api/periode/aktif/kalender`
    : ''
)

const driveViewUrl = computed(() => embedUrl.value || '#')
</script>
