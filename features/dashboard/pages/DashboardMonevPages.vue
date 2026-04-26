<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ModuleCard from '../components/ModuleCard.vue'
import { useDashboardRepository } from '../composables/useDashboardRepository'
import { getDashboardDummyModuleData } from '../data/dashboardDummy'
import type { DashboardModuleData } from '../types/dashboard'

const search = ref('')
const repository = useDashboardRepository('auto')
const moduleData = ref<DashboardModuleData>(getDashboardDummyModuleData('monev'))
const defaultCardColor = '#ffffff'
const alternateCardColor = '#f6f7f9'

onMounted(async () => {
  moduleData.value = await repository.getModuleData('monev')
})

const modules = computed(() => moduleData.value.topics)
const indexedModules = computed(() =>
  modules.value.map((item, originalIndex) => ({
    item,
    originalIndex,
  }))
)

const filteredModules = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return indexedModules.value

  return indexedModules.value.filter(({ item }) =>
    item.title.toLowerCase().includes(query)
  )
})

function useAlternateColorPattern(originalIndex: number): boolean {
  const adjustedIndex = originalIndex + Math.floor(originalIndex / 4)
  return adjustedIndex % 2 === 1
}
</script>

<template>
  <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
    <div
      class="h-full w-full bg-repeat-x bg-top"
      style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
    />
  </div>

  <section class="mx-auto w-full max-w-[1880px] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <div class="mx-auto mb-5 w-full max-w-[880px] sm:mb-6 md:mb-7">
      <div class="relative">
        <input
          v-model="search"
          type="text"
          :placeholder="moduleData.searchPlaceholder"
          class="h-11 w-full rounded-full border border-[#b1afaf] bg-[#ffffff] px-4 pr-11 text-[14px] text-slate-700 shadow-[0_2px_7px_rgba(15,23,42,0.06)] outline-none placeholder:text-slate-400 sm:h-[52px] sm:px-5 sm:pr-12 sm:text-[15px]"
        >
        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 sm:right-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-[22px] sm:w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5">
      <ModuleCard
        v-for="entry in filteredModules"
        :key="entry.item.id"
        :title="entry.item.title"
        :description="entry.item.description"
        :to="entry.item.to"
        :cta-label="entry.item.ctaLabel"
        :accent-variant="useAlternateColorPattern(entry.originalIndex) ? 'wave' : entry.item.accentVariant"
        :surface-color="useAlternateColorPattern(entry.originalIndex) ? alternateCardColor : defaultCardColor"
      />
    </div>
  </section>
</template>
