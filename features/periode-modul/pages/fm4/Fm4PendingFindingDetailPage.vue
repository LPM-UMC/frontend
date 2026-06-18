<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm4GkmfRepository } from '#features/periode-modul/composables/useFm4GkmfRepository'
import {
  FM4_ACTIVE_DUMMY_ROLE,
  resolveFm4RpnCategory,
  resolveFm4RpnLevelMeta,
  type Fm4DashboardContext,
  type Fm4DummyRole,
  type Fm4PendingDetailDummyData,
} from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4GkmfRepository('auto')

const activeDummyRole = ref<Fm4DummyRole>(FM4_ACTIVE_DUMMY_ROLE)
const detailData = ref<Fm4PendingDetailDummyData | null>(null)
const loading = ref(true)

const form = reactive({
  impact: '',
  cause: '',
  severity: 1,
  occurrence: 1,
  detection: 1,
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

const temuanPendingId = computed(() =>
  normalizeRouteParam(
    route.params.temuan_pending_id as string | string[] | undefined,
    'temuan-pending-001'
  )
)

const context = computed<Fm4DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const isGkmfMode = computed(() => activeDummyRole.value === 'gkmf')

const impactCount = computed(() => Math.min(form.impact.length, displayCharacterLimit))
const causeCount = computed(() => Math.min(form.cause.length, displayCharacterLimit))

const rpnValue = computed(() => form.severity * form.occurrence * form.detection)
const rpnCategory = computed(() => resolveFm4RpnCategory(rpnValue.value))
const rpnMeta = computed(() => resolveFm4RpnLevelMeta(rpnCategory.value))

function buildPendingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/temuan-pending`
}

async function handleCancel() {
  await navigateTo(buildPendingRoute())
}

async function handleSave() {
  if (!detailData.value) return

  await repository.savePendingAnalysis(context.value, temuanPendingId.value, {
    impact: form.impact.trim(),
    cause: form.cause.trim(),
    severity: form.severity,
    occurrence: form.occurrence,
    detection: form.detection,
    rpnValue: rpnValue.value,
    rpnCategory: rpnCategory.value,
  })

  await navigateTo(buildPendingRoute())
}

watch(
  detailData,
  (nextData) => {
    if (!nextData) return

    form.impact = nextData.defaultValues.impact
    form.cause = nextData.defaultValues.cause
    form.severity = nextData.defaultValues.severity
    form.occurrence = nextData.defaultValues.occurrence
    form.detection = nextData.defaultValues.detection
  },
  { immediate: true }
)

watch([context, temuanPendingId], async ([nextContext, nextTemuanId]) => {
  loading.value = true
  detailData.value = await repository.getTemuanPendingDetailData(nextContext, nextTemuanId)
  loading.value = false
}, { immediate: true })
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isGkmfMode">
      <section v-if="detailData" class="rounded-[22px] border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <h1 class="text-[clamp(2.2rem,3.1vw,4rem)] font-semibold leading-tight text-[#11141b]">
          {{ detailData.headerTitle }}
        </h1>
        <p class="mt-3 max-w-[1320px] text-[clamp(1.12rem,1.45vw,1.8rem)] leading-relaxed text-[#5b6679]">
          {{ detailData.headerDescription }}
        </p>

        <div class="mt-6 flex items-center gap-3 text-[clamp(1.2rem,1.5vw,1.8rem)] text-[#4f5c70]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#e30000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.1">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 2v4M16 2v4M3 10h18" />
          </svg>
          <p>
            {{ detailData.deadlineLabel }} : <strong class="font-semibold text-[#e30000]">{{ detailData.deadlineValue }}</strong>
          </p>
        </div>
      </section>

      <section v-if="detailData" class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,0.8fr)]">
        <form
          class="rounded-[24px] border-2 border-dashed border-[#d0d6df] bg-[#f7f7f7] p-5 shadow-[0_6px_16px_rgba(15,23,42,0.12)] md:p-6 xl:p-7"
          @submit.prevent="handleSave"
        >
          <h2 class="text-center text-[clamp(2.1rem,2.8vw,3.8rem)] font-semibold text-[#151922]">
            {{ detailData.formTitle }}
          </h2>

          <div class="mt-7">
            <p class="text-[clamp(1.3rem,1.6vw,2.1rem)] font-semibold text-[#4a5568]">
              {{ detailData.findingLabel }} <span class="text-[#e30000]">*</span>
            </p>
            <p class="mt-2 max-w-[1020px] text-[clamp(2.05rem,2.7vw,3.4rem)] font-semibold leading-tight text-[#101520]">
              {{ detailData.findingTitle }}
            </p>
          </div>

          <div class="mt-6 flex items-center gap-3 text-[clamp(1.1rem,1.2vw,1.55rem)] font-semibold uppercase tracking-[0.02em] text-[#9aa3b3]">
            <span class="h-px flex-1 bg-[#d8dde4]" />
            <span>{{ detailData.additionalInputLabel }}</span>
            <span class="h-px flex-1 bg-[#d8dde4]" />
          </div>

          <h3 class="mt-6 text-[clamp(2.1rem,2.8vw,3.8rem)] font-semibold text-[#11141b]">
            {{ detailData.analysisSectionTitle }}
          </h3>

          <div class="mt-5 space-y-5">
            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ detailData.impactLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.impact"
                rows="4"
                class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
                <span>{{ detailData.impactHelp }}</span>
                <span class="font-semibold">{{ impactCount }}/{{ displayCharacterLimit }}</span>
              </p>
            </div>

            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ detailData.causeLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.cause"
                rows="4"
                class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
                <span>{{ detailData.causeHelp }}</span>
                <span class="font-semibold">{{ causeCount }}/{{ displayCharacterLimit }}</span>
              </p>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label class="block">
                <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ detailData.severityLabel }}</span>
                <select
                  v-model.number="form.severity"
                  class="h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
                >
                  <option v-for="option in scoreOptions" :key="`sev-${option}`" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>

              <label class="block">
                <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ detailData.occurrenceLabel }}</span>
                <select
                  v-model.number="form.occurrence"
                  class="h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
                >
                  <option v-for="option in scoreOptions" :key="`occ-${option}`" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>

              <label class="block">
                <span class="mb-2 block text-[clamp(1.2rem,1.4vw,1.75rem)] text-[#3f4b5f]">{{ detailData.detectionLabel }}</span>
                <select
                  v-model.number="form.detection"
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
                  <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ detailData.scoreInfoLabel }}</p>
                  <span
                    class="mt-3 inline-flex rounded-[16px] px-5 py-2 text-[clamp(1.3rem,1.5vw,2rem)] font-semibold"
                    :class="rpnMeta.badgeClass"
                  >
                    {{ rpnMeta.label }}
                  </span>
                </div>

                <div class="text-left md:text-right">
                  <p class="text-[clamp(1.3rem,1.5vw,2rem)] font-semibold text-[#4a5568]">{{ detailData.scoreValueLabel }}</p>
                  <p class="mt-1 text-[clamp(3rem,4.5vw,6rem)] font-semibold leading-none text-[#1a2741]">
                    {{ rpnValue }}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div class="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#d8dde4] pt-5">
            <button
              type="button"
              class="inline-flex h-14 min-w-[150px] items-center justify-center rounded-[18px] border border-[#c7ced8] bg-[#f6f6f7] px-6 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-[#48546a] transition hover:bg-[#eceef2]"
              @click="handleCancel"
            >
              {{ detailData.cancelLabel }}
            </button>
            <button
              type="submit"
              class="inline-flex h-14 min-w-[180px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.2)] transition hover:bg-[#ca0000]"
            >
              {{ detailData.saveLabel }}
            </button>
          </div>
        </form>

        <aside class="rounded-[22px] border border-[#f0d0d0] bg-[#efefef] p-5">
          <p class="inline-flex items-center gap-3 text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#3f4b5f]">
            <span class="inline-block h-9 w-[7px] rounded-full bg-[#ef2d2d]" />
            {{ detailData.fmeaGuideTitle }}
          </p>

          <div class="mt-4 space-y-4">
            <article v-for="item in detailData.guideItems" :key="item.title">
              <h4 class="text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#1a2235]">{{ item.title }}</h4>
              <p class="mt-1 text-[clamp(1.2rem,1.35vw,1.6rem)] text-[#5f6b7e]">{{ item.description }}</p>
            </article>
          </div>

          <div class="my-5 h-px bg-[#f0d0d0]" />

          <p class="text-[clamp(1.9rem,2.2vw,2.8rem)] font-semibold text-[#1f2a3c]">
            RPN = S x O x D
          </p>

          <h4 class="mt-5 text-[clamp(1.7rem,2vw,2.4rem)] font-semibold text-[#1a2235]">
            {{ detailData.riskLegendTitle }}
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
        Memuat detail analisis...
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan saat ini disiapkan untuk role <strong>gkmf</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">FM4_ACTIVE_DUMMY_ROLE</code>
        pada file data FM4 secara manual.
      </p>
    </section>
  </section>
</template>
