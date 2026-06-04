<template>
  <div>
    <div class="h-14 w-full sm:h-16 md:h-17.5">
      <div style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
        class="h-full w-full bg-repeat-x bg-top" />
    </div>

    <!-- Breadcrumb  -->
    <div dir="ltr"
      class="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 md:mt-6 ml-4 md:ml-6 lg:ml-8 xl:ml-10 2xl:ml-12">
      <NuxtLink :to="localePath('/dashboard')">
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
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
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

    <section class="mx-auto w-full max-w-470 px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mx-auto mb-5 w-full max-w-220 sm:mb-6 md:mb-7">
        <div class="relative">
          <input v-model="search" type="text" :placeholder="t('ami.placeholder.cari')"
            class="h-11 w-full rounded-full border border-[#b1afaf] bg-[#ffffff] px-4 pr-11 text-[14px] text-slate-700 shadow-[0_2px_7px_rgba(15,23,42,0.06)] outline-none placeholder:text-slate-400 sm:h-[52px] sm:px-5 sm:pr-12 sm:text-[15px]">
          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 sm:right-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-5.5 sm:w-5.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4  min-[1800px]:grid-cols-5">
        <ModuleCard v-for="entry in filteredModules" :key="entry.item.id" :title="entry.item.title"
          :description="entry.item.description" :periode-modul-id="entry.item.periodeModulId"
          :unit-lingkup-periode-modul-id="entry.item.unitLingkupPeriodeModulId"
          :accent-variant="useAlternateColorPattern(entry.originalIndex) ? 'wave' : entry.item.accentVariant"
          :surface-color="useAlternateColorPattern(entry.originalIndex) ? alternateCardColor : defaultCardColor" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ModuleCard from '#features/dashboard/components/ModuleCard.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const localePath = useLocalePath()

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('ami.judul'),
    active: true,
  },
])

const search = ref('')

const defaultCardColor = '#ffffff'
const alternateCardColor = '#f6f7f9'

const moduleData = ref({
  searchPlaceholder: 'Cari modul...',
  topics: [
    {
      id: '1',
      title: 'Perencanaan',
      description: 'Pengelolaan dan penyusunan perencanaan program kerja serta target capaian.',
      accentVariant: 'wave',
    },
    {
      id: '2',
      title: 'Monitoring',
      description: 'Pemantauan pelaksanaan kegiatan secara berkala untuk memastikan kesesuaian dengan rencana.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'curve',
    },
    {
      id: '3',
      title: 'Evaluasi',
      description: 'Evaluasi hasil kegiatan dan pengukuran indikator keberhasilan program.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'wave',
    },
    {
      id: '4',
      title: 'Pelaporan',
      description: 'Penyusunan laporan kegiatan, capaian, dan rekomendasi tindak lanjut.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'curve',
    },
    {
      id: '5',
      title: 'Indikator Kinerja',
      description: 'Pengelolaan indikator kinerja utama dan pendukung untuk pengukuran capaian.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'wave',
    },
    {
      id: '6',
      title: 'Manajemen Risiko',
      description: 'Identifikasi, analisis, dan mitigasi risiko dalam pelaksanaan program.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'curve',
    },
    {
      id: '7',
      title: 'Audit Internal',
      description: 'Pelaksanaan audit internal untuk memastikan kepatuhan terhadap standar.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'wave',
    },
    {
      id: '8',
      title: 'Dashboard',
      description: 'Visualisasi data monitoring dan evaluasi dalam bentuk dashboard interaktif.',
      periodeModulId: 1,
      unitLingkupPeriodeModulId: 1,
      aspekPeriodeModulId: 1,
      accentVariant: 'curve',
    },
  ],
})

const modules = computed(() => moduleData.value.topics)

const indexedModules = computed(() =>
  modules.value.map((item, originalIndex) => ({
    item,
    originalIndex,
  })),
)

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return indexedModules.value
  }

  return indexedModules.value.filter(({ item }) =>
    item.title.toLowerCase().includes(query),
  )
})

function useAlternateColorPattern(originalIndex: number): boolean {
  const adjustedIndex = originalIndex + Math.floor(originalIndex / 4)
  return adjustedIndex % 2 === 1
}
</script>
