<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm6MahasiswaRepository } from '../../composables/useFm6MahasiswaRepository'
import {
  FM6_MAHASISWA_ACTIVE_DUMMY_ROLE,
  type Fm6MahasiswaContext,
  type Fm6MahasiswaDetailDummyData,
  type Fm6MahasiswaRole,
  type Fm6MahasiswaSubmitPayload,
  type Fm6MahasiswaSurveyQuestion,
} from '../../data/fm6MahasiswaDummy'

const route = useRoute()
const repository = useFm6MahasiswaRepository('auto')

const activeDummyRole = ref<Fm6MahasiswaRole>(FM6_MAHASISWA_ACTIVE_DUMMY_ROLE)
const detailData = ref<Fm6MahasiswaDetailDummyData | null>(null)
const answerMap = ref<Record<string, string>>({})
const loading = ref(true)
const attemptedSubmit = ref(false)

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

const jawabId = computed(() =>
  normalizeRouteParam(
    route.params.jawab_id as string | string[] | undefined,
    'jawab-001'
  )
)

const context = computed<Fm6MahasiswaContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const missingRequiredCount = computed(() => {
  if (!detailData.value) return 0

  return detailData.value.questions.filter((question) => {
    if (!question.required) return false
    const value = answerMap.value[question.id] ?? ''
    return value.trim().length === 0
  }).length
})

const isSubmitDisabled = computed(() => {
  if (!detailData.value || detailData.value.isReadOnly) return true
  return missingRequiredCount.value > 0
})

function buildListRouteWithDoneState(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/jawab?state=after_submit`
}

function setEssayAnswer(questionId: string, value: string) {
  if (detailData.value?.isReadOnly) return
  answerMap.value = {
    ...answerMap.value,
    [questionId]: value,
  }
}

function selectChoice(questionId: string, optionId: string) {
  if (detailData.value?.isReadOnly) return
  answerMap.value = {
    ...answerMap.value,
    [questionId]: optionId,
  }
}

function getEssayLength(questionId: string): number {
  return (answerMap.value[questionId] ?? '').length
}

function isChoiceSelected(questionId: string, optionId: string): boolean {
  return (answerMap.value[questionId] ?? '') === optionId
}

function isQuestionInvalid(question: Fm6MahasiswaSurveyQuestion): boolean {
  if (!attemptedSubmit.value || !question.required) return false
  return (answerMap.value[question.id] ?? '').trim().length === 0
}

function toSubmitPayload(): Fm6MahasiswaSubmitPayload {
  if (!detailData.value) return { answers: [] }

  return {
    answers: detailData.value.questions.map((question) => {
      const value = answerMap.value[question.id] ?? ''

      if (question.type === 'multiple_choice') {
        return {
          questionId: question.id,
          type: question.type,
          choiceId: value || undefined,
        }
      }

      return {
        questionId: question.id,
        type: question.type,
        essayAnswer: value || undefined,
      }
    }),
  }
}

async function submitAnswers() {
  if (!detailData.value || detailData.value.isReadOnly) return

  attemptedSubmit.value = true
  if (missingRequiredCount.value > 0) return

  const payload = toSubmitPayload()
  await repository.submitJawaban(context.value, jawabId.value, payload)
  await navigateTo(buildListRouteWithDoneState())
}

watch(
  [context, jawabId, activeDummyRole],
  async ([nextContext, nextJawabId, nextRole]) => {
    loading.value = true
    attemptedSubmit.value = false
    detailData.value = await repository.getJawabDetailData(nextContext, nextJawabId, nextRole)
    answerMap.value = { ...detailData.value.prefilledAnswers }
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm6-page mx-auto w-full max-w-[1580px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 xl:px-6 2xl:max-w-[1660px]">
    <section v-if="detailData" class="space-y-4">
      <h1 class="text-[clamp(1.55rem,2vw,2.65rem)] font-semibold leading-tight text-[#0f1522]">
        {{ detailData.surveyTitle }}
      </h1>

      <article
        v-if="detailData.isReadOnly"
        class="rounded-[16px] border border-[#cfd5de] bg-[#eef2f6] px-4 py-4 text-[clamp(0.95rem,1vw,1.1rem)] text-[#4d5a6f] md:px-5 md:py-5"
      >
        {{ detailData.readOnlyNotice }}
      </article>

      <article
        v-for="question in detailData.questions"
        :key="question.id"
        class="rounded-[24px] border-2 border-dashed border-[#d6dce4] bg-[#f3f4f6] px-4 py-4 md:px-5 md:py-5 xl:px-6 xl:py-6"
      >
        <div class="flex items-start gap-3.5 md:gap-4">
          <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff1425] text-[1.3rem] font-medium text-white shadow-[0_8px_16px_rgba(255,20,37,0.24)] md:h-12 md:w-12 md:text-[1.6rem]">
            {{ question.order }}
          </span>

          <div class="min-w-0 flex-1">
            <h2 class="text-[clamp(1.2rem,1.45vw,1.95rem)] font-semibold leading-tight text-[#2c374a]">
              {{ question.title }}
            </h2>
            <p v-if="question.required" class="mt-1 text-[clamp(0.98rem,1vw,1.2rem)] text-[#ef0010]">
              * Wajib diisi
            </p>
          </div>
        </div>

        <template v-if="question.type === 'multiple_choice'">
          <div class="mt-4 space-y-3">
            <button
              v-for="option in question.options"
              :key="option.id"
              type="button"
              class="flex h-[66px] w-full items-center gap-3 rounded-[22px] border px-4 text-left transition md:h-[74px] md:gap-4 md:rounded-[24px] md:px-5"
              :class="[
                isChoiceSelected(question.id, option.id)
                  ? 'border-[#e10000] bg-[#fff0f0]'
                  : 'border-[#c1c8d2] bg-[#f0f2f5]',
                isQuestionInvalid(question) ? 'border-[#ed4040]' : '',
              ]"
              :disabled="detailData.isReadOnly"
              @click="selectChoice(question.id, option.id)"
            >
              <span
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition md:h-9 md:w-9"
                :class="isChoiceSelected(question.id, option.id) ? 'bg-[#ef0010]' : 'bg-[#4b4d52]'"
              >
                <span v-if="isChoiceSelected(question.id, option.id)" class="h-3 w-3 rounded-full bg-white" />
              </span>

              <span class="text-[clamp(1.02rem,1.2vw,1.45rem)] font-medium text-[#3b4558]">
                {{ option.label }}
              </span>
            </button>
          </div>
        </template>

        <template v-else>
          <div class="mt-4">
            <textarea
              :value="answerMap[question.id] ?? ''"
              :maxlength="question.maxLength"
              :placeholder="question.placeholder"
              :disabled="detailData.isReadOnly"
              rows="7"
              class="w-full rounded-[22px] border border-[#c1c8d2] bg-[#f0f2f5] px-4 py-3.5 text-[clamp(1rem,1.08vw,1.25rem)] text-[#3f4754] outline-none placeholder:text-[#a4adbb] md:rounded-[24px] md:px-5 md:py-4"
              :class="isQuestionInvalid(question) ? 'border-[#ed4040]' : ''"
              @input="setEssayAnswer(question.id, ($event.target as HTMLTextAreaElement).value)"
            />

            <div class="mt-3 flex items-center justify-between text-[clamp(0.9rem,0.95vw,1.02rem)] text-[#9aa3b3]">
              <span>Maks. {{ question.maxLength }} karakter. Gunakan format konsisten.</span>
              <span class="font-semibold">{{ getEssayLength(question.id) }}/{{ question.maxLength }}</span>
            </div>
          </div>
        </template>
      </article>

      <section
        v-if="!detailData.isReadOnly"
        class="rounded-[20px] border border-[#f0cb76] bg-[#fff4d8] px-4 py-3.5 text-[clamp(1rem,1.1vw,1.22rem)] text-[#be6808] md:px-5 md:py-4"
      >
        <p class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 text-[#f0a000] md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
          </svg>
          {{ detailData.submitPanel.warningMessage }}
        </p>
      </section>

      <section
        v-if="!detailData.isReadOnly"
        class="grid gap-4 rounded-[22px] border border-[#f1d2d2] bg-[#f8f8f8] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-6 md:py-5"
      >
        <div>
          <h3 class="text-[clamp(1.25rem,1.45vw,1.7rem)] font-medium text-[#4a5669]">
            {{ detailData.submitPanel.ctaTitle }}
          </h3>
          <p class="mt-1 text-[clamp(0.98rem,1.02vw,1.15rem)] text-[#7b8597]">
            {{ detailData.submitPanel.ctaDescription }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-[58px] items-center justify-center gap-2.5 rounded-[22px] px-6 text-[clamp(1.15rem,1.2vw,1.45rem)] font-semibold text-white transition md:h-[64px] md:min-w-[280px] md:rounded-[24px] md:px-7"
          :class="isSubmitDisabled ? 'cursor-not-allowed bg-[#f4a8a8] opacity-75' : 'bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] hover:brightness-95'"
          :disabled="isSubmitDisabled"
          @click="submitAnswers"
        >
          {{ detailData.submitPanel.submitLabel }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m22 2-7 20-4-9-9-4 20-7zM22 2l-11 11" />
          </svg>
        </button>
      </section>
    </section>

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat pertanyaan survei...
    </section>
  </section>
</template>
