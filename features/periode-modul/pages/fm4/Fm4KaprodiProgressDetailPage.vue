<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { useFm4KaprodiRepository } from '#features/periode-modul/composables/useFm4KaprodiRepository'
import {
  resolveFm4KaprodiProgressToneMeta,
  type Fm4KaprodiProgressDetailDummyData,
} from '#features/periode-modul/data/fm4KaprodiRtlDummy'
import { type Fm4DashboardContext } from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4KaprodiRepository('auto')

const loading = ref(true)
const detailData = ref<Fm4KaprodiProgressDetailDummyData | null>(null)

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

const rtlId = computed(() =>
  normalizeRouteParam(
    route.params.rtl_id as string | string[] | undefined,
    'rtl-progres-001'
  )
)

const context = computed<Fm4DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

watch(
  [context, rtlId],
  async ([nextContext, nextRtlId]) => {
    loading.value = true
    detailData.value = await repository.getProgressDetailData(nextContext, nextRtlId)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <section v-if="detailData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-[clamp(2.2rem,3.1vw,4rem)] font-semibold leading-tight text-[#11141b]">
            {{ detailData.headerTitle }}
          </h1>
          <p class="mt-3 max-w-[1320px] text-[clamp(1.12rem,1.45vw,1.8rem)] leading-relaxed text-[#5b6679]">
            {{ detailData.headerDescription }}
          </p>
        </div>

        <span class="inline-flex rounded-full bg-[#d1d5db] px-6 py-2 text-[clamp(1rem,1.2vw,1.4rem)] font-medium text-[#334155]">
          {{ detailData.summaryText }}
        </span>
      </div>
    </section>

    <section v-if="detailData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
      <h2 class="text-[clamp(1.35rem,1.95vw,1.85rem)] font-semibold leading-tight text-[#080b12]">
        {{ detailData.indicatorTitle }}
      </h2>

      <div class="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="item in detailData.indicators"
          :key="item.id"
          class="rounded-xl bg-[#f3f3f3] px-4 pb-4 pt-4 shadow-[inset_0_0_0_1px_#ebebeb]"
        >
          <div class="flex items-start justify-between gap-2.5">
            <h3 class="text-[clamp(1.02rem,1.35vw,1.2rem)] font-semibold text-[#4a4b4f]">
              {{ item.title }}
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] text-[#67696d]">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 17L17 7M9 7h8v8"
              />
            </svg>
          </div>

          <p class="mt-3 text-[clamp(1.9rem,2.65vw,2.35rem)] font-semibold leading-none text-[#06090f]">
            {{ item.value }}
          </p>

          <div class="mt-3 h-[10px] w-[140px] overflow-hidden rounded-full bg-[#dce2e9]">
            <span class="block h-full rounded-full bg-[#45cf74]" :style="{ width: `${item.progressPercent}%` }" />
          </div>

          <p class="mt-2.5 text-[1.1rem] text-[#1f76aa]">
            {{ item.subtitle }}
          </p>
        </article>
      </div>
    </section>

    <section v-if="detailData" class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.8fr)]">
      <article class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6">
        <h3 class="text-center text-[clamp(1.9rem,2.6vw,3.1rem)] font-semibold text-[#11141b]">
          {{ detailData.analysisCardTitle }}
        </h3>

        <article class="mt-4 rounded-[16px] border border-[#e2dfd4] bg-[#f2f0e4] p-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ detailData.rpnCategoryLabel }}</p>
              <span class="mt-3 inline-flex rounded-[16px] bg-[#f0de79] px-5 py-2 text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#ae7d09]">
                {{ detailData.rpnCategoryValue }}
              </span>
            </div>

            <div class="text-left md:text-right">
              <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ detailData.rpnValueLabel }}</p>
              <p class="mt-1 text-[clamp(3rem,4.5vw,6rem)] font-semibold leading-none text-[#1a2741]">
                {{ detailData.rpnValue }}
              </p>
            </div>
          </div>
        </article>

        <div class="mt-5 space-y-4 text-[#2b3443]">
          <h4 class="text-[clamp(2rem,2.7vw,3.2rem)] font-semibold">{{ detailData.findingTitle }}</h4>
          <p class="text-[clamp(1.2rem,1.45vw,1.8rem)] leading-relaxed">{{ detailData.findingDescription }}</p>
        </div>

        <div class="mt-5 flex items-center gap-3 text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
          <span class="h-px flex-1 bg-[#d8dde4]" />
          <span>Inputan Lainnya</span>
          <span class="h-px flex-1 bg-[#d8dde4]" />
        </div>

        <div class="mt-5 space-y-4 text-[#2b3443]">
          <h4 class="text-[clamp(2rem,2.7vw,3.2rem)] font-semibold">{{ detailData.rtlTitle }}</h4>
          <p class="text-[clamp(1.2rem,1.45vw,1.8rem)] leading-relaxed">{{ detailData.rtlDescription }}</p>

          <div class="text-[clamp(1.25rem,1.45vw,1.8rem)]">
            <p class="font-semibold text-[#667084]">{{ detailData.picLabel }}</p>
            <p class="mt-1">{{ detailData.picValue }}</p>
          </div>
          <div class="text-[clamp(1.25rem,1.45vw,1.8rem)]">
            <p class="font-semibold text-[#667084]">{{ detailData.targetLabel }}</p>
            <p class="mt-1 font-semibold text-[#e30000]">{{ detailData.targetValue }}</p>
          </div>
        </div>
      </article>

      <article class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6">
        <p class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
          {{ detailData.sideTagLabel }}
        </p>
        <h4 class="mt-2 text-[clamp(1.8rem,2.4vw,2.6rem)] font-semibold text-[#1a2235]">{{ detailData.impactLabel }}</h4>
        <p class="mt-2 text-[clamp(1.15rem,1.35vw,1.55rem)] text-[#5f6b7e]">{{ detailData.impactValue }}</p>

        <div class="my-4 h-px bg-[#d7dce3]" />

        <p class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
          {{ detailData.sideTagLabel }}
        </p>
        <h4 class="mt-2 text-[clamp(1.8rem,2.4vw,2.6rem)] font-semibold text-[#1a2235]">{{ detailData.causeLabel }}</h4>
        <p class="mt-2 text-[clamp(1.15rem,1.35vw,1.55rem)] text-[#5f6b7e]">{{ detailData.causeValue }}</p>
      </article>
    </section>

    <section v-if="detailData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6">
      <h3 class="text-center text-[clamp(1.9rem,2.6vw,3.1rem)] font-semibold text-[#11141b]">
        {{ detailData.historyTitle }}
      </h3>

      <div class="mt-6 space-y-4">
        <article
          v-for="history in detailData.historyItems"
          :key="history.id"
          class="relative pl-12"
        >
          <span
            class="absolute left-2 top-8 inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
            :class="resolveFm4KaprodiProgressToneMeta(history.tone).dotClass"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="4.5" />
            </svg>
          </span>
          <span class="absolute left-[22px] top-16 bottom-0 w-[2px]" :class="resolveFm4KaprodiProgressToneMeta(history.tone).lineClass" />

          <div class="rounded-[16px] p-5" :class="resolveFm4KaprodiProgressToneMeta(history.tone).containerClass">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="text-[clamp(1.8rem,2.4vw,2.8rem)] font-semibold text-[#1e293b]">{{ history.progressLabel }}</h4>
              <span class="text-[clamp(1rem,1.1vw,1.3rem)] font-semibold" :class="resolveFm4KaprodiProgressToneMeta(history.tone).statusClass">
                {{ history.statusLabel }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-1 gap-3 border-b border-[#ced7e4] pb-3 md:grid-cols-2">
              <div>
                <p class="text-[1rem] text-[#738399]">{{ history.executedLabel }}</p>
                <p class="text-[1.1rem] font-semibold text-[#334155]">{{ history.executedAt }}</p>
              </div>
              <div>
                <p class="text-[1rem] text-[#738399]">{{ history.submittedLabel }}</p>
                <p class="text-[1.1rem] font-semibold text-[#334155]">{{ history.submittedAt }}</p>
              </div>
            </div>

            <div class="mt-3 space-y-2">
              <p class="text-[1rem] text-[#738399]">{{ history.resultLabel }}</p>
              <p class="text-[1.1rem] text-[#334155]">{{ history.resultValue }}</p>

              <p class="text-[1rem] text-[#738399]">{{ history.evidenceLabel }}</p>
              <p class="text-[1.1rem] font-semibold text-[#ef4444]">{{ history.evidenceText }}</p>

              <p class="text-[1rem] text-[#738399]">{{ history.notesLabel }}</p>
              <p class="text-[1.1rem] text-[#334155]">{{ history.notesValue }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat detail progres RTL...
    </section>
  </section>
</template>
