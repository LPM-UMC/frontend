<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm4KaprodiRepository } from '#features/periode-modul/composables/useFm4KaprodiRepository'
import { type Fm4KaprodiProgressEditDummyData } from '#features/periode-modul/data/fm4KaprodiRtlDummy'
import { type Fm4DashboardContext } from '#features/periode-modul/data/fm4GkmfDummy'

const route = useRoute()
const repository = useFm4KaprodiRepository('auto')

const loading = ref(true)
const pageData = ref<Fm4KaprodiProgressEditDummyData | null>(null)

const progressForm = reactive({
  status: '',
  completionPercent: 0,
  realizationDate: '',
  realizationTime: '',
  result: '',
  evidenceLink: '',
  notes: '',
})

const displayCharacterLimit = 100

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

const completionCount = computed(() => String(progressForm.completionPercent).length)
const resultCount = computed(() => Math.min(progressForm.result.length, displayCharacterLimit))
const notesCount = computed(() => Math.min(progressForm.notes.length, displayCharacterLimit))

function buildProgressRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/progres`
}

function buildProgressDetailRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm4/rtl/progres/${encodeURIComponent(rtlId.value)}`
}

async function handleCancel() {
  await navigateTo(buildProgressRoute())
}

async function handleSave() {
  await repository.updateRtlProgress(context.value, rtlId.value, {
    status: progressForm.status,
    progressPercent: progressForm.completionPercent,
    realizationDate: progressForm.realizationDate || undefined,
    realizationTime: progressForm.realizationTime || undefined,
    result: progressForm.result.trim(),
    evidenceLink: progressForm.evidenceLink.trim(),
    additionalNotes: progressForm.notes.trim(),
    progressNotes: progressForm.notes.trim(),
    progressDate: progressForm.realizationDate || undefined,
  })

  await navigateTo(buildProgressDetailRoute())
}

watch(
  pageData,
  (nextData) => {
    if (!nextData) return
    progressForm.status = nextData.defaultValues.status
    progressForm.completionPercent = nextData.defaultValues.completionPercent
    progressForm.realizationDate = nextData.defaultValues.realizationDate
    progressForm.realizationTime = nextData.defaultValues.realizationTime
    progressForm.result = nextData.defaultValues.result
    progressForm.evidenceLink = nextData.defaultValues.evidenceLink
    progressForm.notes = nextData.defaultValues.notes
  },
  { immediate: true }
)

watch(
  [context, rtlId],
  async ([nextContext, nextRtlId]) => {
    loading.value = true
    pageData.value = await repository.getProgressEditFormData(nextContext, nextRtlId)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <section v-if="pageData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
      <h1 class="text-[clamp(2.2rem,3.1vw,4rem)] font-semibold leading-tight text-[#11141b]">
        {{ pageData.headerTitle }}
      </h1>
      <p class="mt-3 max-w-[1320px] text-[clamp(1.12rem,1.45vw,1.8rem)] leading-relaxed text-[#5b6679]">
        {{ pageData.headerDescription }}
      </p>
    </section>

    <section v-if="pageData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="space-y-4">
          <h2 class="text-[clamp(2rem,2.8vw,3.4rem)] font-semibold text-[#11141b]">
            {{ pageData.findingTitle }}
          </h2>
          <p class="text-[clamp(1.3rem,1.6vw,2rem)] text-[#5c6779]">
            {{ pageData.findingDescription }}
          </p>

          <div class="grid grid-cols-[220px_minmax(0,1fr)] gap-x-4 gap-y-4 text-[clamp(1.25rem,1.5vw,1.9rem)]">
            <span class="font-semibold text-[#667084]">{{ pageData.picLabel }}</span>
            <span class="text-[#344053]">{{ pageData.picValue }}</span>

            <span class="font-semibold text-[#667084]">{{ pageData.rtlLabel }}</span>
            <span class="max-w-[650px] text-[#344053]">{{ pageData.rtlValue }}</span>

            <span class="font-semibold text-[#667084]">{{ pageData.targetLabel }}</span>
            <strong class="text-[#e30000]">{{ pageData.targetValue }}</strong>
          </div>
        </div>

        <span class="inline-flex rounded-full bg-[#f0de79] px-6 py-2 text-[clamp(1rem,1.2vw,1.4rem)] font-medium text-[#ae7d09]">
          {{ pageData.rpnLabel }}
        </span>
      </div>
    </section>

    <section v-if="pageData" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 md:p-6">
      <h2 class="text-[clamp(2rem,2.8vw,3.4rem)] font-semibold text-[#11141b]">
        {{ pageData.sectionTitle }}
      </h2>

      <form class="mt-4 rounded-[24px] border-2 border-dashed border-[#d0d6df] bg-[#f7f7f7] p-5 md:p-6 xl:px-8" @submit.prevent="handleSave">
        <h3 class="text-center text-[clamp(2rem,2.7vw,3.2rem)] font-semibold text-[#11141b]">
          {{ pageData.formTitle }}
        </h3>

        <div class="mt-6 space-y-4">
          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ pageData.statusLabel }}
            </label>
            <select
              v-model="progressForm.status"
              class="mt-2 h-14 w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-10 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
            >
              <option v-for="option in pageData.statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ pageData.completionLabel }} <span class="text-[#e30000]">*</span>
            </label>
            <input
              v-model.number="progressForm.completionPercent"
              type="number"
              min="0"
              max="100"
              class="mt-2 h-14 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
            >
            <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
              <span>{{ pageData.completionHelp }}</span>
              <span class="font-semibold">{{ completionCount }}/{{ displayCharacterLimit }}</span>
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ pageData.realizationDateLabel }} <span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="progressForm.realizationDate"
                type="date"
                class="mt-2 h-14 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
            </div>
            <div>
              <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
                {{ pageData.realizationTimeLabel }} <span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="progressForm.realizationTime"
                type="time"
                class="mt-2 h-14 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
              >
            </div>
          </div>

          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ pageData.resultLabel }}<span class="text-[#e30000]">*</span>
            </label>
            <textarea
              v-model="progressForm.result"
              rows="4"
              placeholder="Jelaskan Hasil dari RTL"
              class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            />
            <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
              <span>{{ pageData.resultHelp }}</span>
              <span class="font-semibold">{{ resultCount }}/{{ displayCharacterLimit }}</span>
            </p>
          </div>

          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ pageData.evidenceLabel }}
            </label>
            <input
              v-model="progressForm.evidenceLink"
              type="url"
              class="mt-2 h-14 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(1.1rem,1.2vw,1.45rem)] text-[#2e3846] outline-none"
            >
            <p class="mt-2 text-[clamp(1rem,1.1vw,1.35rem)] text-[#7a879a]">
              {{ pageData.evidenceHint }}
            </p>
          </div>

          <div>
            <label class="block text-[clamp(1.35rem,1.6vw,2rem)] font-semibold text-[#3f4b5f]">
              {{ pageData.notesLabel }}
            </label>
            <textarea
              v-model="progressForm.notes"
              rows="4"
              placeholder="Opsional"
              class="mt-2 w-full resize-y rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[clamp(1.15rem,1.3vw,1.7rem)] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            />
            <p class="mt-2 flex items-center justify-between text-[clamp(1rem,1.1vw,1.35rem)] text-[#98a1b1]">
              <span>{{ pageData.notesHelp }}</span>
              <span class="font-semibold">{{ notesCount }}/{{ displayCharacterLimit }}</span>
            </p>
          </div>

          <article class="rounded-[12px] border border-[#f6b8b8] bg-[#fff2f2] px-4 py-3 text-[1rem] text-[#d03333]">
            <strong>{{ pageData.warningPrefix }}</strong> {{ pageData.warningText }}
          </article>

          <p class="flex items-center gap-2 text-[1rem] text-[#98a1b1]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
            </svg>
            {{ pageData.lastSavedText }}
          </p>
        </div>

        <div class="mt-6 flex flex-wrap justify-center gap-3 border-t border-[#d8dde4] pt-5 md:justify-end">
          <button
            type="button"
            class="inline-flex h-14 min-w-[150px] items-center justify-center rounded-[18px] border border-[#c7ced8] bg-[#f6f6f7] px-6 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-[#48546a] transition hover:bg-[#eceef2]"
            @click="handleCancel"
          >
            {{ pageData.cancelLabel }}
          </button>
          <button
            type="submit"
            class="inline-flex h-14 min-w-[180px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[clamp(1.2rem,1.3vw,1.5rem)] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.2)] transition hover:bg-[#ca0000]"
          >
            {{ pageData.saveLabel }}
          </button>
        </div>
      </form>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat form progres RTL...
    </section>
  </section>
</template>
