<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm4KaprodiRepository } from '#features/periode-modul/composables/useFm4KaprodiRepository'
import {
  resolveFm4KaprodiRpnLevelFromScore,
  type Fm4KaprodiCreateRtlDummyData,
} from '#features/periode-modul/data/fm4KaprodiRtlDummy'
import {
  resolveFm4RpnLevelMeta,
  type Fm4DashboardContext,
} from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4KaprodiRepository('auto')

const loading = ref(true)
const formData = ref<Fm4KaprodiCreateRtlDummyData | null>(null)

const analysisForm = reactive({
  impact: '',
  cause: '',
  severity: 1,
  occurrence: 1,
  detection: 1,
})

const rtlForm = reactive({
  picName: '',
  picEmail: '',
  targetDate: '',
  rtlPlan: '',
})

const displayCharacterLimit = 100
const scoreOptions = Array.from({ length: 10 }, (_, index) => index + 1)

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

const temuanId = computed(() =>
  normalizeRouteParam(
    route.params.temuan_id as string | string[] | undefined,
    'temuan-rtl-001'
  )
)

const context = computed<Fm4DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const impactCount = computed(() => Math.min(analysisForm.impact.length, displayCharacterLimit))
const causeCount = computed(() => Math.min(analysisForm.cause.length, displayCharacterLimit))
const picNameCount = computed(() => Math.min(rtlForm.picName.length, displayCharacterLimit))
const picEmailCount = computed(() => Math.min(rtlForm.picEmail.length, displayCharacterLimit))
const rtlPlanCount = computed(() => Math.min(rtlForm.rtlPlan.length, displayCharacterLimit))

const rpnValue = computed(() =>
  analysisForm.severity * analysisForm.occurrence * analysisForm.detection
)

const rpnMeta = computed(() => {
  const category = resolveFm4KaprodiRpnLevelFromScore(
    analysisForm.severity,
    analysisForm.occurrence,
    analysisForm.detection
  )
  return resolveFm4RpnLevelMeta(category)
})

function buildPendingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/pending`
}

async function handleCancel() {
  await navigateTo(buildPendingRoute())
}

async function handleSave() {
  if (!formData.value) return

  await repository.createRtl(context.value, temuanId.value, {
    impact: analysisForm.impact.trim(),
    cause: analysisForm.cause.trim(),
    severity: analysisForm.severity,
    occurrence: analysisForm.occurrence,
    detection: analysisForm.detection,
    rpnValue: rpnValue.value,
    rpnCategory: rpnMeta.value.id,
    picName: rtlForm.picName.trim(),
    picEmail: rtlForm.picEmail.trim(),
    rtl: rtlForm.rtlPlan.trim(),
    dueDate: rtlForm.targetDate || undefined,
    notes: formData.value.noteText,
  })

  await navigateTo(buildPendingRoute())
}

watch(
  formData,
  (nextData) => {
    if (!nextData) return

    analysisForm.impact = nextData.defaultValues.impact
    analysisForm.cause = nextData.defaultValues.cause
    analysisForm.severity = nextData.defaultValues.severity
    analysisForm.occurrence = nextData.defaultValues.occurrence
    analysisForm.detection = nextData.defaultValues.detection

    rtlForm.picName = nextData.defaultValues.picName
    rtlForm.picEmail = nextData.defaultValues.picEmail
    rtlForm.targetDate = nextData.defaultValues.targetDate
    rtlForm.rtlPlan = nextData.defaultValues.rtlPlan
  },
  { immediate: true }
)

watch(
  [context, temuanId],
  async ([nextContext, nextTemuanId]) => {
    loading.value = true
    formData.value = await repository.getCreateRtlFormData(nextContext, nextTemuanId)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <section v-if="formData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
      <h1 class="text-[clamp(2.2rem,3.1vw,4rem)] font-semibold leading-tight text-[#11141b]">
        {{ formData.headerTitle }}
      </h1>
      <p class="mt-3 max-w-[1320px] text-[clamp(1.12rem,1.45vw,1.8rem)] leading-relaxed text-[#5b6679]">
        {{ formData.headerDescription }}
      </p>

      <div class="mt-6 flex items-center gap-3 text-[clamp(1.2rem,1.5vw,1.8rem)] text-[#4f5c70]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#e30000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.1">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 2v4M16 2v4M3 10h18" />
        </svg>
        <p>
          {{ formData.deadlineLabel }} : <strong class="font-semibold text-[#e30000]">{{ formData.deadlineValue }}</strong>
        </p>
      </div>
    </section>

    <section v-if="formData" class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,0.8fr)]">
      <form
        class="rounded-[24px] border-2 border-dashed border-[#d0d6df] bg-[#f7f7f7] p-5 shadow-[0_6px_16px_rgba(15,23,42,0.12)] md:p-6 xl:p-7"
        @submit.prevent="handleSave"
      >
        <h2 class="text-center text-[clamp(2.1rem,2.8vw,3.8rem)] font-semibold text-[#151922]">
          {{ formData.formTitle }}
        </h2>

        <div class="mt-7">
          <p class="text-[clamp(1.3rem,1.6vw,2.1rem)] font-semibold text-[#4a5568]">
            {{ formData.findingLabel }} <span class="text-[#e30000]">*</span>
          </p>
          <p class="mt-2 max-w-[1020px] text-[clamp(2.05rem,2.7vw,3.4rem)] font-semibold leading-tight text-[#101520]">
            {{ formData.findingTitle }}
          </p>
        </div>

        <div class="mt-6 flex items-center gap-3 text-[clamp(1.1rem,1.2vw,1.55rem)] font-semibold uppercase tracking-[0.02em] text-[#9aa3b3]">
          <span class="h-px flex-1 bg-[#d8dde4]" />
          <span>{{ formData.additionalInputLabel }}</span>
          <span class="h-px flex-1 bg-[#d8dde4]" />
        </div>

        <h3 class="mt-6 text-[clamp(2.1rem,2.8vw,3.8rem)] font-semibold text-[#11141b]">
          {{ formData.analysisSectionTitle }}
        </h3>

        <div class="mt-5 space-y-5">
          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ formData.impactLabel }}<span class="text-[#e30000]">*</span>
            </label>
            <textarea
              v-model="analysisForm.impact"
              rows="4"
              class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            />
            <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
              <span>{{ formData.impactHelp }}</span>
              <span class="font-semibold">{{ impactCount }}/{{ displayCharacterLimit }}</span>
            </p>
          </div>

          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ formData.causeLabel }}<span class="text-[#e30000]">*</span>
            </label>
            <textarea
              v-model="analysisForm.cause"
              rows="4"
              class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            />
            <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
              <span>{{ formData.causeHelp }}</span>
              <span class="font-semibold">{{ causeCount }}/{{ displayCharacterLimit }}</span>
            </p>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label class="block">
              <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ formData.severityLabel }}</span>
              <select
                v-model.number="analysisForm.severity"
                class="h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
                <option v-for="option in scoreOptions" :key="`sev-${option}`" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ formData.occurrenceLabel }}</span>
              <select
                v-model.number="analysisForm.occurrence"
                class="h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
                <option v-for="option in scoreOptions" :key="`occ-${option}`" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ formData.detectionLabel }}</span>
              <select
                v-model.number="analysisForm.detection"
                class="h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
                <option v-for="option in scoreOptions" :key="`det-${option}`" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
          </div>

          <article class="rounded-[16px] border border-[#e2dfd4] bg-[#f2f0e4] p-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ formData.scoreInfoLabel }}</p>
                <span
                  class="mt-3 inline-flex rounded-[16px] px-5 py-2 text-[clamp(1.3rem,1.5vw,2rem)] font-semibold"
                  :class="rpnMeta.badgeClass"
                >
                  {{ rpnMeta.label }}
                </span>
              </div>

              <div class="text-left md:text-right">
                <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ formData.scoreValueLabel }}</p>
                <p class="mt-1 text-[clamp(3rem,4.5vw,6rem)] font-semibold leading-none text-[#1a2741]">
                  {{ rpnValue }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-8 border-t border-[#d8dde4] pt-6">
          <h3 class="text-center text-[clamp(1.9rem,2.5vw,3rem)] font-semibold text-[#151922]">
            {{ formData.rtlFormTitle }}
          </h3>

          <div class="mt-5 space-y-5">
            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ formData.picNameLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="rtlForm.picName"
                type="text"
                placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[14px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
                <span>{{ formData.picNameHelp }}</span>
                <span class="font-semibold">{{ picNameCount }}/{{ displayCharacterLimit }}</span>
              </p>
            </div>

            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ formData.picEmailLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="rtlForm.picEmail"
                type="email"
                placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[14px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
                <span>{{ formData.picEmailHelp }}</span>
                <span class="font-semibold">{{ picEmailCount }}/{{ displayCharacterLimit }}</span>
              </p>
            </div>

            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ formData.targetDateLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="rtlForm.targetDate"
                type="date"
                class="mt-2 h-14 w-full rounded-[14px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
            </div>

            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ formData.rtlLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="rtlForm.rtlPlan"
                rows="4"
                placeholder="Masukkan Rencana Tindak Lanjut Disini"
                class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
                <span>{{ formData.rtlHelp }}</span>
                <span class="font-semibold">{{ rtlPlanCount }}/{{ displayCharacterLimit }}</span>
              </p>
            </div>

            <article class="rounded-[12px] border border-[#f6b8b8] bg-[#fff2f2] px-4 py-3 text-[1rem] text-[#d03333]">
              <strong>{{ formData.notePrefix }}</strong> {{ formData.noteText }}
            </article>

            <p class="flex items-center gap-2 text-[1rem] text-[#98a1b1]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              {{ formData.lastSavedText }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#d8dde4] pt-5">
          <button
            type="button"
            class="inline-flex h-14 min-w-[150px] items-center justify-center rounded-[18px] border border-[#c7ced8] bg-[#f6f6f7] px-6 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-[#48546a] transition hover:bg-[#eceef2]"
            @click="handleCancel"
          >
            {{ formData.cancelLabel }}
          </button>
          <button
            type="submit"
            class="inline-flex h-14 min-w-[180px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.2)] transition hover:bg-[#ca0000]"
          >
            {{ formData.saveLabel }}
          </button>
        </div>
      </form>

      <aside class="rounded-[22px] border border-[#f0d0d0] bg-[#efefef] p-5">
        <p class="inline-flex items-center gap-3 text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#3f4b5f]">
          <span class="inline-block h-9 w-[7px] rounded-full bg-[#ef2d2d]" />
          {{ formData.fmeaGuideTitle }}
        </p>

        <div class="mt-4 space-y-4">
          <article v-for="item in formData.guideItems" :key="item.title">
            <h4 class="text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#1a2235]">{{ item.title }}</h4>
            <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] text-[#5f6b7e]">{{ item.description }}</p>
          </article>
        </div>

        <div class="my-5 h-px bg-[#f0d0d0]" />

        <p class="text-[clamp(1.9rem,2.2vw,2.8rem)] font-semibold text-[#1f2a3c]">
          RPN = S x O x D
        </p>

        <h4 class="mt-5 text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#1a2235]">
          {{ formData.riskLegendTitle }}
        </h4>

        <div class="mt-3 space-y-2">
          <p class="flex items-center gap-2 text-[clamp(1.2rem,1.35vw,1.6rem)] text-[#5f6b7e]">
            <span class="h-4 w-4 rounded-full bg-[#12bf4c]" />
            Rendah
          </p>
          <p class="flex items-center gap-2 text-[clamp(1.2rem,1.35vw,1.6rem)] text-[#5f6b7e]">
            <span class="h-4 w-4 rounded-full bg-[#e9b700]" />
            Sedang
          </p>
          <p class="flex items-center gap-2 text-[clamp(1.2rem,1.35vw,1.6rem)] text-[#5f6b7e]">
            <span class="h-4 w-4 rounded-full bg-[#ff3348]" />
            Tinggi
          </p>
        </div>
      </aside>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat form buat RTL...
    </section>
  </section>
</template>
