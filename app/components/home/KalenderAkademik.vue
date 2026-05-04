<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()

const fileId = computed(
  () =>
    config.public.academicCalendarFileId || '1wEuY2Ld5LWC569sxWCmRHaduMxO3RGKI'
)

const embedUrl = computed(() =>
  fileId.value
    ? `https://drive.google.com/file/d/${fileId.value}/preview`
    : ''
)

const driveViewUrl = computed(() =>
  fileId.value
    ? `https://drive.google.com/file/d/${fileId.value}/view`
    : '#'
)
</script>

<template>
  <section class="overflow-x-hidden bg-gray-50">
    <div class="h-14 w-full sm:h-16 md:h-17.5">
      <div
        class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
      />
    </div>

    <div class="mx-auto w-full max-w-470 px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 xl:px-10 2xl:px-12">
      <header class="mb-6 md:mb-7">
        <h1 class="text-[1.45rem] font-extrabold tracking-wide text-gray-900 uppercase sm:text-2xl md:text-3xl" >
          {{ $t('kalender_akademik') }}
        </h1>
        <p class="text-[0.95rem] font-semibold text-gray-800 sm:text-lg md:text-xl">
          {{ $t('univ') }}
        </p>
        <p class="mt-3 max-w-4xl text-[13px] text-gray-600 sm:text-sm md:text-base">
          {{ $t('deskripsi_kalender') }}
        </p>
      </header>

      <div v-if="embedUrl" class="mt-2 flex justify-center">
        <div class="w-full max-w-7xl">
          <div
            class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50"
          >
            <div class="bg-gray-800 text-gray-50 text-xs md:text-sm font-medium px-4 py-3" >
              {{ $t('kalender_akademik_univ') }}
            </div>

            <iframe
              :src="embedUrl"
              class="h-80 w-full sm:h-110 md:h-140 xl:h-162.5"
              allow="autoplay"
            />
          </div>

          <div class="flex justify-start pt-3 sm:justify-end">
            <a
              :href="driveViewUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 text-xs md:text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Buka di Tab Baru
            </a>
          </div>
        </div>
      </div>

      <div v-else class="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500" >
        <p>{{ $t('not_found') }}</p>
      </div>
    </div>
  </section>
</template>

