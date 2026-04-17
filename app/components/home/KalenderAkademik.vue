<!-- components/AcademicCalendar.vue -->
<template>
  <section class="bg-gray-50 min-h-screen">
    <!-- BATIK HEADER -->
    <div class="w-full">
      <img
        src="/img/batik.png"
        alt="Motif batik Universitas Muhammadiyah Cirebon"
        class="w-full"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-2">
      <!-- Judul + deskripsi -->
      <header class="mb-6">
        <h1
          class="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900 uppercase"
        >
          Kalender Akademik
        </h1>
        <p class="text-lg md:text-xl font-semibold text-gray-800">
          Universitas Muhammadiyah Cirebon
        </p>
        <p class="mt-3 text-sm md:text-base text-gray-600 max-w-3xl">
          Kalender akademik berfungsi sebagai informasi terpadu yang menyediakan
          satu sumber terpercaya untuk semua tanggal dan tenggat waktu akademik
          penting, memungkinkan akademisi merencanakan kegiatan mereka secara
          efektif sepanjang semester.
        </p>
      </header>

      <!-- PDF + label (dibikin seperti figma) -->
      <div v-if="embedUrl" class="mt-2 flex justify-center">
        <!-- Atur max width supaya viewer tidak terlalu lebar -->
        <div class="w-full max-w-4xl">
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
              class="w-full h-[520px] md:h-[560px]"
              allow="autoplay"
            />
          </div>

          <!-- Tombol buka di tab baru -->
          <div class="flex justify-end pt-3">
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
