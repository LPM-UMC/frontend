<!-- components/AcademicCalendar.vue -->
<template>
  <section class="overflow-x-hidden bg-gray-50">
    <!-- BATIK HEADER -->
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div
        class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
      />
    </div>

    <div class="mx-auto w-full max-w-[1880px] px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 xl:px-10 2xl:px-12">
      <!-- Judul + deskripsi -->
      <header class="mb-6 md:mb-7">
        <h1
          class="text-[1.45rem] font-extrabold tracking-wide text-gray-900 uppercase sm:text-2xl md:text-3xl"
        >
          Kalender Akademik
        </h1>
        <p class="text-[0.95rem] font-semibold text-gray-800 sm:text-lg md:text-xl">
          Universitas Muhammadiyah Cirebon
        </p>
        <p class="mt-3 max-w-4xl text-[13px] text-gray-600 sm:text-sm md:text-base">
          Kalender akademik berfungsi sebagai informasi terpadu yang menyediakan
          satu sumber terpercaya untuk semua tanggal dan tenggat waktu akademik
          penting, memungkinkan akademisi merencanakan kegiatan mereka secara
          efektif sepanjang semester.
        </p>
      </header>

      <!-- PDF + label (dibikin seperti figma) -->
      <div v-if="embedUrl" class="mt-2 flex justify-center">
        <!-- Atur max width supaya viewer tidak terlalu lebar -->
        <div class="w-full max-w-[1280px]">
          <div
            class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50"
          >
            <!-- Bar abu-abu di atas iframe -->
            <div
              class="bg-gray-800 text-gray-50 text-xs md:text-sm font-medium px-4 py-3"
            >
              Kalender Akademik Universitas Muhammadiyah Cirebon
            </div>

            <!-- Viewer PDF dari Google Drive -->
            <iframe
              :src="embedUrl"
              class="h-[320px] w-full sm:h-[440px] md:h-[560px] xl:h-[650px]"
              allow="autoplay"
            />
          </div>

          <!-- Tombol buka di tab baru -->
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

      <!-- Fallback kalau belum ada file ID -->
      <div
        v-else
        class="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500"
      >
        Kalender akademik belum tersedia. Silakan hubungi admin LPM untuk
        mengunggah file kalender akademik di Google Drive.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()

// ID PDF dari runtimeConfig / .env, cukup setup sekali
const fileId = computed(
  () =>
    config.public.academicCalendarFileId ||
    '1wEuY2Ld5LWC569sxWCmRHaduMxO3RGKI' // bisa kamu ganti, tapi idealnya dari .env
)

// Pakai viewer bawaan Google Drive
const embedUrl = computed(() =>
  fileId.value
    ? `https://drive.google.com/file/d/${fileId.value}/preview`
    : ''
)

// Link ke tampilan Drive biasa untuk "Buka di Tab Baru"
const driveViewUrl = computed(() =>
  fileId.value
    ? `https://drive.google.com/file/d/${fileId.value}/view`
    : '#'
)
</script>
