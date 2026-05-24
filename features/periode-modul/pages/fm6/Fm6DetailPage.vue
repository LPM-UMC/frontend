<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { useFm6AdminRepository } from '#features/periode-modul/composables/useFm6AdminRepository'
import {
  FM6_ACTIVE_DUMMY_ROLE,
  type Fm6AdminRole,
  type Fm6ChartBarItem,
  type Fm6DashboardContext,
  type Fm6DetailDummyData,
} from '#features/periode-modul/data/fm6AdminDummy'

const route = useRoute()
const repository = useFm6AdminRepository('auto')

const activeDummyRole = ref<Fm6AdminRole>(FM6_ACTIVE_DUMMY_ROLE)
const detailData = ref<Fm6DetailDummyData | null>(null)
const loading = ref(true)

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(
    route.params.periode_modul_id as string | string[] | undefined,
    'pm-2026-genap'
  )
)

const unitId = computed(() =>
  normalizeRouteParam(
    route.params.unit_id as string | string[] | undefined,
    'unit-tif'
  )
)

const detailId = computed(() =>
  normalizeRouteParam(
    route.params.detail_id as string | string[] | undefined,
    'fm6-survey-001'
  )
)

const context = computed<Fm6DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const analytics = computed(() => detailData.value?.analytics)

function resolveBarToneClass(tone: Fm6ChartBarItem['tone']): string {
  if (tone === 'soft') return 'bg-[linear-gradient(90deg,#ef8d8d_0%,#f96c71_100%)]'
  if (tone === 'medium') return 'bg-[linear-gradient(90deg,#ff6267_0%,#ff3545_100%)]'
  if (tone === 'strong') return 'bg-[linear-gradient(90deg,#ff1630_0%,#ff0015_100%)]'
  return 'bg-[linear-gradient(90deg,#f40010_0%,#de0000_100%)]'
}

function resolveBarWidth(value: number, maxScale: number): string {
  if (!maxScale || maxScale <= 0) return '0%'
  const percentage = Math.max(0, Math.min(100, (value / maxScale) * 100))
  return `${percentage}%`
}

watch(
  [context, detailId, activeDummyRole],
  async ([nextContext, nextDetailId, nextRole]) => {
    loading.value = true
    detailData.value = await repository.getDetailData(nextContext, nextDetailId, nextRole)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="detailData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
    >
      <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
        {{ detailData.headerCard.title }}
      </h1>
      <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
        {{ detailData.headerCard.description }}
      </p>
    </section>

    <section
      v-if="detailData?.showAnalytics && analytics"
      class="space-y-4"
    >
      <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
          {{ analytics.indicatorTitle }}
        </h2>

        <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="item in analytics.indicators"
            :key="item.id"
            class="rounded-[16px] bg-[#f4f4f5] px-4 py-4"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-[clamp(1rem,1.08vw,1.3rem)] font-semibold text-[#484b51]">
                {{ item.title }}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-[#70727a] md:h-6 md:w-6">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>

            <p class="mt-3 text-[clamp(1.9rem,2.25vw,2.65rem)] font-semibold leading-none text-[#080b11]">
              {{ item.value }}
            </p>

            <div class="mt-3 h-[12px] w-[220px] max-w-full overflow-hidden rounded-full bg-[#dce2e8] md:h-[14px]">
              <span class="block h-full rounded-full bg-[#42cd72]" :style="{ width: `${item.progressPercent}%` }" />
            </div>

            <p class="mt-3 text-[clamp(0.9rem,0.95vw,1.05rem)] text-[#2176a8]">
              {{ item.subtitle }}
            </p>
          </article>
        </div>
      </section>

      <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <h2 class="text-[clamp(1.55rem,2vw,2.35rem)] font-semibold leading-tight text-[#11141b]">
          {{ analytics.chartTitle }}
        </h2>

        <article
          v-for="section in analytics.chartSections"
          :key="section.id"
          class="mt-4 rounded-[16px] border border-[#f0d6d6] bg-[#f4f4f5] px-4 py-5 md:px-6 md:py-6"
        >
          <h3 class="text-[clamp(1.25rem,1.55vw,1.8rem)] font-semibold text-[#1f293b]">
            {{ section.title }}
          </h3>

          <div class="mt-4 space-y-3">
            <div
              v-for="bar in section.bars"
              :key="bar.id"
              class="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3 md:grid-cols-[130px_minmax(0,1fr)] md:gap-4"
            >
              <p class="text-[clamp(0.96rem,1.05vw,1.15rem)] text-[#566276]">
                {{ bar.label }}
              </p>

              <div class="relative h-[38px] overflow-hidden rounded-[16px] bg-[#e4e6ea] md:h-[42px]">
                <span
                  class="absolute inset-y-0 left-0 flex items-center justify-end rounded-[16px] pr-4 text-[clamp(0.95rem,1vw,1.1rem)] font-semibold text-white"
                  :class="resolveBarToneClass(bar.tone)"
                  :style="{ width: resolveBarWidth(bar.value, analytics.maxScale) }"
                >
                  {{ bar.value }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between pl-[110px] text-[clamp(0.88rem,0.95vw,1rem)] text-[#9aa3b3] md:pl-[130px]">
            <span v-for="label in analytics.axisLabels" :key="label">{{ label }}</span>
          </div>
        </article>
      </section>
    </section>

    <section
      v-if="detailData && !detailData.showAnalytics"
      class="min-h-[64vh]"
    />

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat detail FM6...
    </section>
  </section>
</template>
