<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm7GkmfRepository } from '#features/periode-modul/composables/useFm7GkmfRepository'
import {
  FM7_ACTIVE_DUMMY_ROLE,
  type Fm7CreatePageDummyData,
  type Fm7DashboardContext,
  type Fm7DummyRole,
  type Fm7FakultasOption,
  type Fm7ProgramStudiOption,
} from '#features/periode-modul/data/fm7GkmfDummy'

type CreateStep = 1 | 2

interface Fm7CreateFormState {
  fakultasId: string
  programStudiId: string
}

const route = useRoute()
const repository = useFm7GkmfRepository('auto')

const activeDummyRole = ref<Fm7DummyRole>(FM7_ACTIVE_DUMMY_ROLE)
const pageData = ref<Fm7CreatePageDummyData | null>(null)
const loading = ref(true)
const creating = ref(false)
const currentStep = ref<CreateStep>(1)

const form = reactive<Fm7CreateFormState>({
  fakultasId: '',
  programStudiId: '',
})

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

const context = computed<Fm7DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const selectedFakultas = computed<Fm7FakultasOption | null>(() => {
  if (!pageData.value) return null
  return pageData.value.fakultasOptions.find((item) => item.id === form.fakultasId) ?? null
})

const availablePrograms = computed<Fm7ProgramStudiOption[]>(() => {
  return selectedFakultas.value?.programStudiOptions ?? []
})

const selectedProgram = computed<Fm7ProgramStudiOption | null>(() => {
  return availablePrograms.value.find((item) => item.id === form.programStudiId) ?? null
})

const canProceedToStepTwo = computed(() => {
  return Boolean(form.fakultasId && form.programStudiId)
})

function buildDashboardRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm7`
}

function buildDetailRoute(laporanId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm7/laporan/${encodeURIComponent(laporanId)}`
}

function goToStepTwo() {
  if (!canProceedToStepTwo.value) return
  currentStep.value = 2
}

async function handleBack() {
  if (currentStep.value === 2) {
    currentStep.value = 1
    return
  }

  await navigateTo(buildDashboardRoute())
}

async function handleGenerate() {
  if (!canProceedToStepTwo.value || creating.value) return

  creating.value = true

  const result = await repository.createReport(context.value, {
    fakultasId: form.fakultasId,
    programStudiId: form.programStudiId,
  })

  creating.value = false
  await navigateTo(buildDetailRoute(result.id))
}

watch(
  () => form.fakultasId,
  () => {
    if (!selectedFakultas.value) {
      form.programStudiId = ''
      return
    }

    const exists = selectedFakultas.value.programStudiOptions.some((item) => item.id === form.programStudiId)
    if (!exists) {
      form.programStudiId = ''
    }
  }
)

watch(
  [context, activeDummyRole],
  async ([nextContext, nextRole]) => {
    loading.value = true
    pageData.value = await repository.getCreatePageData(nextContext, nextRole)

    form.fakultasId = ''
    form.programStudiId = ''
    currentStep.value = 1
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm7-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="pageData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
    >
      <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
        {{ pageData.headerTitle }}
      </h1>
      <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
        {{ pageData.headerDescription }}
      </p>
    </section>

    <section
      v-if="pageData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
    >
      <h2 class="text-[clamp(1.7rem,2.2vw,2.65rem)] font-semibold leading-tight text-[#11141b]">
        {{ pageData.flowTitle }}
      </h2>

      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div class="flex items-center gap-3">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full text-[1.65rem] font-semibold"
            :class="currentStep === 1 ? 'bg-[#e60000] text-white' : 'bg-[#29a13c] text-white'"
          >
            <template v-if="currentStep === 1">1</template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4 10-10" />
              </svg>
            </template>
          </span>
          <span
            class="text-[clamp(1.35rem,1.6vw,1.95rem)]"
            :class="currentStep === 1 ? 'text-[#e60000]' : 'font-semibold text-[#1f2b3d]'"
          >
            {{ pageData.stepOneLabel }}
          </span>
        </div>

        <span class="h-[3px] w-20 rounded-full bg-[#d7dbe3]" />

        <div class="flex items-center gap-3">
          <span
            class="inline-flex h-12 w-12 items-center justify-center rounded-full text-[1.65rem] font-semibold"
            :class="currentStep === 2 ? 'bg-[#d4d9e1] text-[#667086]' : 'bg-[#d4d9e1] text-[#788296]'"
          >
            2
          </span>
          <span
            class="text-[clamp(1.35rem,1.6vw,1.95rem)]"
            :class="currentStep === 2 ? 'text-[#657082] font-medium' : 'text-[#7a8392]'"
          >
            {{ pageData.stepTwoLabel }}
          </span>
        </div>
      </div>

      <template v-if="currentStep === 1">
        <div class="mt-7 space-y-4">
          <div>
            <label class="text-[clamp(1rem,1.05vw,1.2rem)] font-semibold text-[#4d586b]">
              {{ pageData.fakultasLabel }}
            </label>
            <label class="relative mt-2 block">
              <select
                v-model="form.fakultasId"
                class="h-[56px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.2rem)] text-[#3b4557] outline-none"
              >
                <option value="" disabled>{{ pageData.fakultasPlaceholder }}</option>
                <option
                  v-for="option in pageData.fakultasOptions"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 text-[#3d4659]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </label>
            <p class="mt-2 text-[clamp(0.86rem,0.95vw,1.03rem)] text-[#98a2b3]">
              {{ pageData.fakultasHint }}
            </p>
          </div>

          <div>
            <label class="text-[clamp(1rem,1.05vw,1.2rem)] font-semibold text-[#4d586b]">
              {{ pageData.programStudiLabel }}
            </label>
            <label class="relative mt-2 block">
              <select
                v-model="form.programStudiId"
                class="h-[56px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.2rem)] text-[#3b4557] outline-none"
                :disabled="availablePrograms.length === 0"
              >
                <option value="" disabled>{{ pageData.programStudiPlaceholder }}</option>
                <option
                  v-for="option in availablePrograms"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 text-[#3d4659]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </label>
            <p class="mt-2 text-[clamp(0.86rem,0.95vw,1.03rem)] text-[#98a2b3]">
              {{ pageData.programStudiHint }}
            </p>
          </div>
        </div>

        <article class="mt-6 rounded-[14px] border border-[#f0a4a4] bg-[#fbefef] px-4 py-3 text-[#c91f1f]">
          <p class="flex items-center gap-2 text-[clamp(0.95rem,1vw,1.05rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
            <strong>{{ pageData.warningTitle }}:</strong>
            <span>{{ pageData.warningMessage }}</span>
          </p>
        </article>
      </template>

      <template v-else>
        <article class="mt-7 rounded-[16px] border border-[#9de9b8] bg-[#dff1e7] px-5 py-5">
          <h3 class="text-center text-[clamp(1.35rem,1.65vw,2rem)] font-semibold text-[#155f3a]">
            {{ pageData.stepTwoSummaryTitle }}
          </h3>

          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p class="text-[clamp(1rem,1.05vw,1.2rem)] text-[#178447]">Fakultas</p>
              <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] font-semibold text-[#16663f]">
                {{ selectedFakultas?.label || '-' }}
              </p>
            </div>
            <div>
              <p class="text-[clamp(1rem,1.05vw,1.2rem)] text-[#178447]">Program Studi</p>
              <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] font-semibold text-[#16663f]">
                {{ selectedProgram?.label || '-' }}
              </p>
            </div>
            <div>
              <p class="text-[clamp(1rem,1.05vw,1.2rem)] text-[#178447]">Semester</p>
              <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] font-semibold text-[#16663f]">
                {{ selectedProgram?.semester || '-' }}
              </p>
            </div>
            <div>
              <p class="text-[clamp(1rem,1.05vw,1.2rem)] text-[#178447]">Tahun Akademik</p>
              <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] font-semibold text-[#16663f]">
                {{ selectedProgram?.tahunAkademik || '-' }}
              </p>
            </div>
          </div>
        </article>

        <section class="mt-6">
          <h3 class="text-[clamp(1.25rem,1.45vw,1.85rem)] font-semibold text-[#1a2437]">
            {{ pageData.sourceDataTitle }}
          </h3>

          <div class="mt-3 space-y-3">
            <article
              v-for="item in pageData.sourceItems"
              :key="item.id"
              class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-[14px] border border-[#d5dbe5] bg-[#f4f5f7] px-4 py-3"
            >
              <p class="flex items-center gap-2 text-[clamp(1.05rem,1.18vw,1.5rem)] text-[#4b5669]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 shrink-0 text-[#8f99aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <path d="M14 2v4h4" />
                  <path d="M8 12h8M8 16h6M8 8h2" />
                </svg>
                <strong class="text-[#131a26]">{{ item.label.split(' ')[0] }}</strong>
                <span>{{ item.label.replace(`${item.label.split(' ')[0]} `, '') }}</span>
              </p>

              <span class="inline-flex min-w-[96px] items-center justify-center rounded-[10px] bg-[#e8e9eb] px-3 py-1 text-[clamp(0.95rem,1vw,1.08rem)] text-[#262f3c]">
                {{ item.babLabel }}
              </span>

              <span class="inline-flex items-center gap-1 text-[clamp(0.98rem,1.02vw,1.12rem)] font-semibold text-[#18a14f]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4 10-10" />
                </svg>
                {{ item.statusLabel }}
              </span>
            </article>
          </div>
        </section>

        <article class="mt-6 rounded-[14px] border border-[#f2cd68] bg-[#f7f4e2] px-4 py-4 text-[#a64f08]">
          <p class="flex items-start gap-2 text-[clamp(1rem,1.08vw,1.22rem)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-6 w-6 shrink-0 text-[#dd7f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v6m0 4h.01" />
            </svg>
            <strong>{{ pageData.impactTitle }}:</strong>
          </p>
          <ul class="mt-2 space-y-1 pl-8 text-[clamp(1rem,1.08vw,1.22rem)]">
            <li v-for="line in pageData.impactLines" :key="line">
              {{ line }}
            </li>
          </ul>
        </article>
      </template>

      <div class="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2">
        <button
          type="button"
          class="inline-flex h-[56px] items-center justify-center rounded-[18px] bg-[#e7e8eb] px-6 text-[clamp(1.25rem,1.45vw,1.95rem)] font-medium text-[#4a566a] transition hover:bg-[#dde1e7]"
          @click="handleBack"
        >
          {{ pageData.backLabel }}
        </button>

        <button
          v-if="currentStep === 1"
          type="button"
          class="inline-flex h-[56px] items-center justify-center rounded-[18px] bg-[#e30000] px-6 text-[clamp(1.25rem,1.45vw,1.95rem)] font-semibold text-white transition hover:bg-[#ca0000] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canProceedToStepTwo"
          @click="goToStepTwo"
        >
          {{ pageData.nextLabel }}
        </button>

        <button
          v-else
          type="button"
          class="inline-flex h-[56px] items-center justify-center rounded-[18px] bg-[#e30000] px-6 text-[clamp(1.25rem,1.45vw,1.95rem)] font-semibold text-white transition hover:bg-[#ca0000] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="creating || !canProceedToStepTwo"
          @click="handleGenerate"
        >
          {{ creating ? 'Generating...' : pageData.generateLabel }}
        </button>
      </div>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat form FM7...
    </section>
  </section>
</template>

