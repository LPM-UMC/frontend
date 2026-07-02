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
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
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
          :description="entry.item.description" :to="entry.item.to" cta-text="Lihat Data Terbaru"
          :accent-variant="useAlternateColorPattern(entry.originalIndex) ? 'wave' : entry.item.accentVariant"
          :surface-color="useAlternateColorPattern(entry.originalIndex) ? alternateCardColor : defaultCardColor" />
          
        <template v-if="modulStore.isLoading">
          <USkeleton v-for="n in 4" :key="`skeleton-${n}`" class="min-h-[200px] w-full rounded-[12px] sm:min-h-[220px]" />
        </template>
        
        <div v-if="!modulStore.isLoading && filteredModules.length === 0" class="col-span-full py-16 text-center">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f6f7f9] text-[#a1a7b3]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-slate-800">{{ t('ami.kosong.judul') }}</h3>
          <p class="mt-2 mx-auto max-w-md text-sm text-slate-500">{{ t('ami.kosong.deskripsi') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import ModuleCard from '#features/dashboard/components/ModuleCard.vue'
import { useI18n } from 'vue-i18n'
import { useModulStore } from '#stores/modul'
import { useAuthStore } from '#stores/auth'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const localePath = useLocalePath()
const modulStore = useModulStore()
const authStore = useAuthStore()

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

onMounted(async () => {
  await authStore.initAuth()
  modulStore.fetchModulAmi()
})

const modules = computed(() => {
  return modulStore.modulAmi.map((item, index) => {
    const isSOP = item.nama === t('amiMenus.sop');
    const isMonev = item.nama === t('amiMenus.monev');
    const isTindakLanjut = item.nama === t('amiMenus.tindakLanjut');

    let toRoute = '';
    if (isSOP) toRoute = '/dashboard/ami/sop';
    else if (isMonev) toRoute = '/dashboard/ami/monev';
    else if (isTindakLanjut) toRoute = '/dashboard/ami/tindak-lanjut';
    else toRoute = '/dashboard/ami/sop'; // default fallback

    return {
      id: item.id,
      title: item.nama,
      description: item.deskripsi || '',
      to: toRoute,
      accentVariant: ((index % 2 === 0) ? 'wave' : 'curve') as 'wave' | 'curve',
    }
  })
})

const indexedModules = computed(() =>
  modules.value.map((item, originalIndex) => ({
    item,
    originalIndex,
  })),
)

const filteredModules = computed(() => {
  return indexedModules.value
})

let timeout: ReturnType<typeof setTimeout> | null = null
watch(search, (val) => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    modulStore.amiSearch = val
    modulStore.fetchModulAmi()
  }, 500)
})

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    modulStore.fetchModulAmi(true)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function useAlternateColorPattern(originalIndex: number): boolean {
  const adjustedIndex = originalIndex + Math.floor(originalIndex / 4)
  return adjustedIndex % 2 === 1
}
</script>
