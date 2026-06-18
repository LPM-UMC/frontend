<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm6MahasiswaRepository } from '../../composables/useFm6MahasiswaRepository'
import {
  FM6_MAHASISWA_ACTIVE_DUMMY_ROLE,
  FM6_MAHASISWA_DEFAULT_LIST_MODE,
  type Fm6MahasiswaContext,
  type Fm6MahasiswaJawabPageDummyData,
  type Fm6MahasiswaListMode,
  type Fm6MahasiswaRole,
} from '../../data/fm6MahasiswaDummy'

const route = useRoute()
const repository = useFm6MahasiswaRepository('auto')

const activeDummyRole = ref<Fm6MahasiswaRole>(FM6_MAHASISWA_ACTIVE_DUMMY_ROLE)
const pageData = ref<Fm6MahasiswaJawabPageDummyData | null>(null)
const loading = ref(true)

const currentPage = ref(1)
const pageSize = 5

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

function getFirstQueryValue(value: string | string[] | null | undefined): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value[0] ?? undefined
  return value
}

function resolveListMode(rawValue: string | undefined): Fm6MahasiswaListMode {
  if (!rawValue) return FM6_MAHASISWA_DEFAULT_LIST_MODE

  const normalized = rawValue.toLowerCase()

  if (normalized === 'list' || normalized === 'aktif' || normalized === 'active') {
    return 'list'
  }

  if (normalized === 'after_submit' || normalized === 'selesai' || normalized === 'done') {
    return 'after_submit'
  }

  return FM6_MAHASISWA_DEFAULT_LIST_MODE
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

const listMode = computed<Fm6MahasiswaListMode>(() =>
  resolveListMode(getFirstQueryValue(route.query.state as string | string[] | null | undefined))
)

const context = computed<Fm6MahasiswaContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const cards = computed(() => pageData.value?.cards ?? [])

const totalPages = computed(() => Math.max(1, Math.ceil(cards.value.length / pageSize)))

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return cards.value.slice(start, start + pageSize).map((item, index) => ({
    ...item,
    rowNumber: start + index + 1,
  }))
})

const showingFrom = computed(() => {
  if (!cards.value.length) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() => {
  if (!cards.value.length) return 0
  return Math.min(currentPage.value * pageSize, cards.value.length)
})

function buildDetailRoute(jawabId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/jawab/${encodeURIComponent(jawabId)}`
}

async function goToSurvey(jawabId: string) {
  await navigateTo(buildDetailRoute(jawabId))
}

watch(listMode, () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch(
  [context, listMode, activeDummyRole],
  async ([nextContext, nextMode, nextRole]) => {
    loading.value = true
    pageData.value = await repository.getJawabPageData(nextContext, nextMode, nextRole)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm6-page mx-auto w-full max-w-[1580px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 xl:px-6 2xl:max-w-[1660px]">
    <section
      v-if="pageData"
      class="rounded-[16px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-4 py-4 shadow-[0_5px_14px_rgba(15,23,42,0.18)] md:px-5 md:py-5 xl:px-6 xl:py-6"
    >
      <h1 class="text-[clamp(1.45rem,1.8vw,2.25rem)] font-semibold leading-tight text-white">
        {{ pageData.hero.title }}
      </h1>
      <p class="mt-2.5 max-w-[1300px] text-[clamp(0.9rem,0.95vw,1.12rem)] leading-relaxed text-white/95 md:mt-3">
        {{ pageData.hero.description }}
      </p>
    </section>

    <section v-if="pageData?.showSurveyList" class="space-y-4 md:space-y-5">
      <h2 class="pt-2 text-center text-[clamp(1.7rem,2vw,2.45rem)] font-medium leading-tight text-[#151823]">
        {{ pageData.listTitle }}
      </h2>

      <div class="space-y-4 md:space-y-5">
        <article
          v-for="card in paginatedCards"
          :key="card.id"
          class="rounded-[22px] border border-[#d7dce3] bg-[#efefef] px-4 py-4 shadow-[0_3px_8px_rgba(15,23,42,0.06)] md:px-6 md:py-6 lg:px-7 lg:py-7"
        >
          <h3 class="text-[clamp(1.4rem,1.7vw,2rem)] font-semibold leading-tight text-[#1f2633]">
            {{ card.title }}
          </h3>

          <p class="mt-2.5 max-w-[1300px] text-[clamp(0.98rem,1.05vw,1.28rem)] leading-relaxed text-[#566174] md:mt-3">
            {{ card.description }}
          </p>

          <button
            type="button"
            class="mt-5 inline-flex items-center gap-1.5 text-[clamp(1.05rem,1.2vw,1.42rem)] font-medium text-[#e30000] transition hover:opacity-90 md:mt-6"
            @click="goToSurvey(card.id)"
          >
            {{ card.actionLabel }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </article>
      </div>

      <div class="flex flex-col gap-3 border-t border-[#d8dde5] pt-4 md:flex-row md:items-center md:justify-between">
        <p class="text-[clamp(0.95rem,1vw,1.15rem)] text-[#4e596d]">
          Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ cards.length }}</strong> data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[14px] border border-[#d8dde5] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[16px] md:px-5 md:py-2"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            class="rounded-[14px] bg-[#e30000] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] font-semibold text-white md:rounded-[16px] md:px-5 md:py-2"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[14px] border border-[#d8dde5] px-4 py-1.5 text-[clamp(0.9rem,0.95vw,1rem)] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60 md:rounded-[16px] md:px-5 md:py-2"
            :disabled="currentPage === totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <section v-if="pageData && !pageData.showSurveyList" class="min-h-[64vh]" />

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat data survei mahasiswa...
    </section>
  </section>
</template>
