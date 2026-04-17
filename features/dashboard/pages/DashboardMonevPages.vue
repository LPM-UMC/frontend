<script setup lang="ts">
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
  <div class="h-[70px] w-full">
      <div
        class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto 90px;"
      />
  </div>
  
  <section class="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-5 md:px-6 md:pt-10 bg-[#f4f4f4]">
    <div class="mx-auto mb-7 max-w-[760px] bg-[#f4f4f4]">
      <div class="relative">
        <input
          v-model="search"
          type="text"
          :placeholder="moduleData.searchPlaceholder"
          class="h-[52px] w-full rounded-full border border-[#b1afaf] bg-[#fffff] px-5 pr-12 text-[14px] text-slate-700 shadow-[0_2px_7px_rgba(15,23,42,0.06)] outline-none placeholder:text-slate-400 sm:text-[15px]"
        >
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
